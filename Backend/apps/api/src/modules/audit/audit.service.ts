import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog, type AuditLogDocument } from "./audit-log.schema";

export interface AuditEvent {
  action: string;
  siteId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/** Feldnamen, die niemals im Audit-Log landen duerfen. */
const REDACTED_FIELDS = new Set([
  "password",
  "passwordHash",
  "token",
  "tokenHash",
  "totpSecret",
  "secret",
  "apiKey",
  "authorization",
  "cookie",
  "setCookie",
]);

function shouldRedact(key: string): boolean {
  const normalized = key.replace(/[-_]/g, "").toLowerCase();
  return [...REDACTED_FIELDS].some(
    (field) => {
      const sensitive = field.replace(/[-_]/g, "").toLowerCase();
      return normalized === sensitive || normalized.endsWith(sensitive);
    },
  );
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }
  if (
    value &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        shouldRedact(key) ? "[REDACTED]" : redactValue(nested),
      ]),
    );
  }
  return value;
}

export function redactAuditPayload(
  payload: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!payload) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      shouldRedact(key) ? "[REDACTED]" : redactValue(value),
    ]),
  );
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name) private readonly auditModel: Model<AuditLog>,
  ) {}

  /** Schreibfehler im Audit-Log duerfen den Hauptvorgang nicht abbrechen. */
  async log(event: AuditEvent): Promise<void> {
    try {
      await this.auditModel.create({
        action: event.action,
        siteId: event.siteId ?? null,
        userId: event.userId ?? null,
        userEmail: event.userEmail ?? null,
        entityType: event.entityType ?? null,
        entityId: event.entityId ?? null,
        before: redactAuditPayload(event.before),
        after: redactAuditPayload(event.after),
        ipAddress: event.ipAddress ?? null,
        userAgent: event.userAgent ?? null,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Audit-Log konnte nicht geschrieben werden (${event.action})`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async findRecent(limit: number): Promise<AuditLogDocument[]> {
    return this.auditModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec() as Promise<AuditLogDocument[]>;
  }

  async countSince(since: Date): Promise<number> {
    return this.auditModel.countDocuments({ createdAt: { $gte: since } });
  }

  async findPaginated(page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.auditModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec() as Promise<AuditLogDocument[]>,
      this.auditModel.countDocuments(),
    ]);
    return { items, total };
  }
}
