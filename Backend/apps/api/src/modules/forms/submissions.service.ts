import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { createHmac } from "node:crypto";
import { Model, Types } from "mongoose";
import { env } from "../../config/env";
import { validateSubmission } from "./form-validation";
import { FormsService } from "./forms.service";
import { MailService } from "./mail.service";
import type { FormDocument } from "./schemas/form.schema";
import {
  FormSubmission,
  type FormSubmissionDocument,
  type SubmissionStatus,
} from "./schemas/form-submission.schema";

export interface SubmitContext {
  data: Record<string, unknown>;
  honeypot?: string;
  pageUrl?: string;
  referrer?: string;
  locale: string;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface SubmitResult {
  successAction: "MESSAGE" | "REDIRECT";
  successMessage: string;
  redirectUrl: string | null;
}

export function escapeCsvCell(value: unknown): string {
  let text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  if (/^[\t\r\n ]*[=+@-]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectModel(FormSubmission.name)
    private readonly model: Model<FormSubmission>,
    @InjectModel("Form") private readonly formModel: Model<FormDocument>,
    private readonly formsService: FormsService,
    private readonly mailService: MailService,
  ) {}

  private hashIp(ip: string | null): string | null {
    return ip
      ? createHmac("sha256", env.SESSION_SECRET).update(ip).digest("hex")
      : null;
  }

  /** Oeffentliche Uebermittlung: validieren, speichern, benachrichtigen. */
  async submit(form: FormDocument, ctx: SubmitContext): Promise<SubmitResult> {
    const honeypotField = form.spamSettings.honeypotField as string | undefined;
    const isSpam = Boolean(honeypotField && ctx.honeypot && ctx.honeypot.length > 0);

    const defs = this.formsService.buildFieldDefs(form);
    const result = validateSubmission(defs, ctx.data);
    if (!result.valid && !isSpam) {
      throw new BadRequestException({
        message: "Formular enthaelt Fehler.",
        issues: result.errors,
      });
    }

    const t = form.translations[ctx.locale] ?? form.translations.de ?? {};

    await this.model.create({
      formId: form._id,
      siteId: form.siteId,
      data: result.cleaned,
      status: isSpam ? "SPAM" : "NEW",
      locale: ctx.locale,
      ipHash: this.hashIp(ctx.ipAddress),
      userAgent: ctx.userAgent,
      referrer: ctx.referrer ?? null,
      pageUrl: ctx.pageUrl ?? null,
      spamScore: isSpam ? 100 : 0,
    });

    if (!isSpam) {
      void this.notify(form, result.cleaned);
    }

    return {
      successAction: form.successAction,
      successMessage: t.successMessage ?? "Vielen Dank fuer Ihre Nachricht.",
      redirectUrl: form.redirectUrl,
    };
  }

  private async notify(
    form: FormDocument,
    data: Record<string, unknown>,
  ): Promise<void> {
    const recipients = Array.isArray(form.notificationSettings.recipients)
      ? (form.notificationSettings.recipients as string[])
      : [];
    if (recipients.length === 0) {
      return;
    }
    const body = Object.entries(data)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join("\n");
    await this.mailService.send({
      to: recipients,
      subject: `Neue Formularanfrage: ${form.name}`,
      text: body || "(keine Daten)",
    });
  }

  // --- Admin-Inbox ---

  async list(
    siteId: string,
    query: { formId?: string; status?: string; page: number; limit: number },
  ): Promise<{ items: FormSubmissionDocument[]; total: number }> {
    const filter: Record<string, unknown> = { siteId, deletedAt: null };
    if (query.formId && Types.ObjectId.isValid(query.formId)) {
      filter.formId = new Types.ObjectId(query.formId);
    }
    if (query.status) {
      filter.status = query.status;
    }
    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .exec() as Promise<FormSubmissionDocument[]>,
      this.model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async get(siteId: string, id: string): Promise<FormSubmissionDocument> {
    const submission = (await this.model
      .findOne({ _id: id, siteId, deletedAt: null })
      .exec()) as FormSubmissionDocument | null;
    if (!submission) {
      throw new BadRequestException("Uebermittlung nicht gefunden.");
    }
    // Beim ersten Oeffnen automatisch als gelesen markieren.
    if (submission.status === "NEW") {
      submission.status = "READ";
      await submission.save();
    }
    return submission;
  }

  async update(
    siteId: string,
    id: string,
    patch: { status?: string; notes?: string },
  ): Promise<FormSubmissionDocument> {
    const submission = await this.get(siteId, id);
    if (patch.status !== undefined) {
      submission.status = patch.status as SubmissionStatus;
      submission.processedAt = new Date();
    }
    if (patch.notes !== undefined) {
      submission.notes = patch.notes;
    }
    await submission.save();
    return submission;
  }

  async remove(siteId: string, id: string): Promise<void> {
    const submission = await this.get(siteId, id);
    submission.deletedAt = new Date();
    await submission.save();
  }

  async countNew(siteId: string): Promise<number> {
    return this.model.countDocuments({ siteId, status: "NEW", deletedAt: null });
  }

  /** CSV-Export aller (nicht geloeschten) Uebermittlungen eines Formulars. */
  async exportCsv(siteId: string, formId: string): Promise<string> {
    const rows = (await this.model
      .find({ siteId, formId, deletedAt: null })
      .sort({ createdAt: -1 })
      .exec()) as FormSubmissionDocument[];

    const dataKeys = new Set<string>();
    for (const row of rows) {
      Object.keys(row.data).forEach((key) => dataKeys.add(key));
    }
    const columns = ["submittedAt", "status", ...dataKeys];
    const lines = [columns.map(escapeCsvCell).join(",")];
    for (const row of rows) {
      const record: Record<string, unknown> = {
        submittedAt: row.createdAt.toISOString(),
        status: row.status,
        ...row.data,
      };
      lines.push(columns.map((col) => escapeCsvCell(record[col])).join(","));
    }
    return lines.join("\n");
  }

  /** Taeglich: Uebermittlungen jenseits der Aufbewahrungsfrist hart loeschen. */
  /**
   * Loescht abgelaufene Uebermittlungen. Der Zeitplan liegt bewusst NICHT hier:
   * @nestjs/schedule zieht den Nest-Kern nach, der sich nicht in einen
   * Next-Build packen laesst. Ausgeloest wird die Methode von
   * `submissions.cron.ts` (NestJS) bzw. von der Cron-Route der Admin-App.
   */
  async purgeExpired(): Promise<void> {
    if (!env.SCHEDULER_ENABLED) {
      return;
    }
    const forms = await this.formModel
      .find({ retentionDays: { $ne: null }, deletedAt: null })
      .select("_id retentionDays")
      .exec();
    for (const form of forms) {
      const days = form.retentionDays;
      if (!days || days <= 0) {
        continue;
      }
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const res = await this.model.deleteMany({
        formId: form._id,
        createdAt: { $lt: cutoff },
      });
      if (res.deletedCount > 0) {
        this.logger.log(
          `Retention: ${res.deletedCount} Uebermittlung(en) fuer Formular ${form._id.toString()} entfernt.`,
        );
      }
    }
  }
}
