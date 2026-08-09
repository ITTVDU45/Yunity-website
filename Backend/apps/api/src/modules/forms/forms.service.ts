import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { slugify, stripUndefined } from "@yunity/utilities";
import type { PublicFormDefinition } from "@yunity/contracts";
import { Form, type FormDocument, type FormFieldType } from "./schemas/form.schema";
import {
  FormSubmission,
} from "./schemas/form-submission.schema";
import type { FieldDef } from "./form-validation";
import type {
  AddFieldDto,
  CreateFormDto,
  UpdateFieldDto,
  UpdateFormDto,
} from "./dto";

type FieldSubdoc = FormDocument["fields"][number];

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<Form>,
    @InjectModel(FormSubmission.name)
    private readonly submissionModel: Model<FormSubmission>,
  ) {}

  async list(siteId: string): Promise<FormDocument[]> {
    return this.formModel
      .find({ siteId, deletedAt: null })
      .sort({ name: 1 })
      .exec() as Promise<FormDocument[]>;
  }

  async countSubmissions(formId: string): Promise<number> {
    return this.submissionModel.countDocuments({ formId, deletedAt: null });
  }

  async countByStatus(siteId: string): Promise<Record<string, number>> {
    const rows = await this.formModel.aggregate<{ _id: string; count: number }>(
      [
        { $match: { siteId: new Types.ObjectId(siteId), deletedAt: null } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ],
    );
    return Object.fromEntries(rows.map((row) => [row._id, row.count]));
  }

  async getOwned(siteId: string, id: string): Promise<FormDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Formular nicht gefunden.");
    }
    const form = (await this.formModel
      .findOne({ _id: id, siteId, deletedAt: null })
      .exec()) as FormDocument | null;
    if (!form) {
      throw new NotFoundException("Formular nicht gefunden.");
    }
    return form;
  }

  async getByKeyActive(
    siteId: string,
    key: string,
  ): Promise<FormDocument | null> {
    return this.formModel
      .findOne({ siteId, key, status: "ACTIVE", deletedAt: null })
      .exec() as Promise<FormDocument | null>;
  }

  async create(siteId: string, dto: CreateFormDto): Promise<FormDocument> {
    const key = slugify(dto.key ?? dto.name);
    const existing = await this.formModel.findOne({
      siteId,
      key,
      deletedAt: null,
    });
    if (existing) {
      throw new ConflictException(
        `Formular mit Schluessel "${key}" existiert bereits.`,
      );
    }
    const locale = dto.locale ?? "de";
    const created = await this.formModel.create({
      siteId: new Types.ObjectId(siteId),
      key,
      name: dto.name,
      translations: {
        [locale]: { successMessage: this.defaultSuccessMessage(locale) },
      },
    });
    return created as FormDocument;
  }

  async update(
    siteId: string,
    id: string,
    dto: UpdateFormDto,
  ): Promise<FormDocument> {
    const form = await this.getOwned(siteId, id);

    if (dto.key !== undefined) {
      const key = slugify(dto.key);
      const clash = await this.formModel.findOne({
        siteId,
        key,
        deletedAt: null,
        _id: { $ne: form._id },
      });
      if (clash) {
        throw new ConflictException(`Schluessel "${key}" ist bereits vergeben.`);
      }
      form.key = key;
    }
    if (dto.name !== undefined) form.name = dto.name;
    if (dto.status !== undefined) form.status = dto.status as FormDocument["status"];
    if (dto.successAction !== undefined) {
      form.successAction = dto.successAction as "MESSAGE" | "REDIRECT";
    }
    if (dto.redirectUrl !== undefined) form.redirectUrl = dto.redirectUrl;
    if (dto.notificationSettings !== undefined) {
      form.notificationSettings = dto.notificationSettings;
      form.markModified("notificationSettings");
    }
    if (dto.spamSettings !== undefined) {
      form.spamSettings = dto.spamSettings;
      form.markModified("spamSettings");
    }
    if (dto.retentionDays !== undefined) form.retentionDays = dto.retentionDays;
    if (dto.translation) {
      const locale = dto.locale ?? "de";
      const current = form.translations[locale] ?? {};
      const incoming = stripUndefined(dto.translation as Record<string, unknown>);
      form.translations = {
        ...form.translations,
        [locale]: { ...current, ...incoming },
      };
      form.markModified("translations");
    }
    await form.save();
    return form;
  }

  async remove(siteId: string, id: string): Promise<void> {
    const form = await this.getOwned(siteId, id);
    form.deletedAt = new Date();
    await form.save();
  }

  // --- Felder ---

  async addField(
    siteId: string,
    id: string,
    dto: AddFieldDto,
  ): Promise<FormDocument> {
    const form = await this.getOwned(siteId, id);
    const maxPosition = form.fields.reduce(
      (max, field) => Math.max(max, field.position),
      0,
    );
    const name = this.uniqueFieldName(form, dto.type);
    const locale = dto.locale ?? "de";
    form.fields.push({
      type: dto.type,
      name,
      required: false,
      defaultValue: null,
      width: "FULL",
      position: maxPosition + 1000,
      isEnabled: true,
      validation: {},
      conditions: null,
      settings: {},
      translations: { [locale]: { label: this.defaultLabel(dto.type, locale) } },
      options: [],
    } as FieldSubdoc);
    await form.save();
    return form;
  }

  async updateField(
    siteId: string,
    id: string,
    fieldId: string,
    dto: UpdateFieldDto,
  ): Promise<FormDocument> {
    const form = await this.getOwned(siteId, id);
    const field = form.fields.find((f) => f._id?.toString() === fieldId);
    if (!field) {
      throw new NotFoundException("Feld nicht gefunden.");
    }

    if (dto.name !== undefined) {
      const name = slugify(dto.name).replace(/-/g, "_");
      if (
        form.fields.some(
          (f) => f._id?.toString() !== fieldId && f.name === name,
        )
      ) {
        throw new ConflictException(`Feldname "${name}" ist bereits vergeben.`);
      }
      field.name = name;
    }
    if (dto.required !== undefined) field.required = dto.required;
    if (dto.width !== undefined) field.width = dto.width as FieldSubdoc["width"];
    if (dto.isEnabled !== undefined) field.isEnabled = dto.isEnabled;
    if (dto.validation !== undefined) field.validation = dto.validation;
    if (dto.conditions !== undefined) field.conditions = dto.conditions;
    if (dto.settings !== undefined) field.settings = dto.settings;
    if (dto.translation) {
      const locale = dto.locale ?? "de";
      const current = field.translations[locale] ?? {};
      const incoming = stripUndefined(dto.translation as Record<string, unknown>);
      field.translations = {
        ...field.translations,
        [locale]: { ...current, ...incoming },
      };
    }
    if (dto.options !== undefined) {
      const locale = dto.locale ?? "de";
      const existingByValue = new Map(
        field.options.map((option) => [option.value, option]),
      );
      field.options = dto.options.map((option, index) => {
        const existing = existingByValue.get(option.value);
        return {
          _id: existing?._id,
          value: option.value,
          position: (index + 1) * 1000,
          isEnabled: option.isEnabled ?? true,
          translations: {
            ...(existing?.translations ?? {}),
            [locale]: { label: option.label ?? option.value },
          },
        };
      }) as FieldSubdoc["options"];
    }
    form.markModified("fields");
    await form.save();
    return form;
  }

  async removeField(
    siteId: string,
    id: string,
    fieldId: string,
  ): Promise<FormDocument> {
    const form = await this.getOwned(siteId, id);
    form.fields = form.fields.filter(
      (f) => f._id?.toString() !== fieldId,
    ) as FormDocument["fields"];
    await form.save();
    return form;
  }

  async reorderFields(
    siteId: string,
    id: string,
    orderedIds: string[],
  ): Promise<FormDocument> {
    const form = await this.getOwned(siteId, id);
    const positionById = new Map(
      orderedIds.map((fieldId, index) => [fieldId, (index + 1) * 1000]),
    );
    for (const field of form.fields) {
      const next = positionById.get(field._id?.toString() ?? "");
      if (next !== undefined) {
        field.position = next;
      }
    }
    form.fields.sort((a, b) => a.position - b.position);
    form.markModified("fields");
    await form.save();
    return form;
  }

  // --- Ableitungen ---

  /** Feldliste fuer die serverseitige Validierung. */
  buildFieldDefs(form: FormDocument): FieldDef[] {
    return form.fields.map((field) => ({
      id: field._id?.toString() ?? "",
      type: field.type,
      name: field.name,
      required: field.required,
      isEnabled: field.isEnabled,
      validation: field.validation,
      conditions: (field.conditions as FieldDef["conditions"]) ?? null,
      options: field.options.map((option) => ({
        value: option.value,
        isEnabled: option.isEnabled,
      })),
    }));
  }

  toPublicDefinition(
    form: FormDocument,
    locale: string,
    defaultLocale: string,
  ): PublicFormDefinition {
    const t = form.translations[locale] ?? form.translations[defaultLocale] ?? {};
    return {
      key: form.key,
      locale,
      title: t.title ?? form.name,
      successMessage: t.successMessage ?? "",
      consentText: t.consentText ?? "",
      privacyText: t.privacyText ?? "",
      successAction: form.successAction,
      redirectUrl: form.redirectUrl,
      fields: form.fields
        .filter((field) => field.isEnabled)
        .sort((a, b) => a.position - b.position)
        .map((field) => {
          const ft =
            field.translations[locale] ??
            field.translations[defaultLocale] ??
            {};
          return {
            id: field._id?.toString() ?? "",
            type: field.type,
            name: field.name,
            required: field.required,
            width: field.width,
            label: ft.label ?? "",
            placeholder: ft.placeholder ?? "",
            helpText: ft.helpText ?? "",
            validation: field.validation,
            conditions: field.conditions,
            options: field.options
              .filter((option) => option.isEnabled)
              .sort((a, b) => a.position - b.position)
              .map((option) => {
                const ot =
                  option.translations[locale] ??
                  option.translations[defaultLocale] ??
                  {};
                return { value: option.value, label: ot.label ?? option.value };
              }),
          };
        }),
    };
  }

  private uniqueFieldName(form: FormDocument, type: FormFieldType): string {
    const base = type.replace(/-/g, "_");
    let index = form.fields.length + 1;
    let candidate = `${base}_${index}`;
    const names = new Set(form.fields.map((f) => f.name));
    while (names.has(candidate)) {
      index += 1;
      candidate = `${base}_${index}`;
    }
    return candidate;
  }

  private defaultLabel(type: FormFieldType, locale: string): string {
    const labelsByLocale: Record<
      string,
      Partial<Record<FormFieldType, string>>
    > = {
      en: {
        text: "Text",
        textarea: "Message",
        email: "Email",
        phone: "Phone",
        number: "Number",
        date: "Date",
        time: "Time",
        select: "Selection",
        radio: "Option",
        checkbox: "Checkbox",
        "checkbox-group": "Multiple selection",
        multiselect: "Multiple selection",
        file: "File",
        consent: "Consent",
        hidden: "Hidden field",
        heading: "Heading",
        paragraph: "Explanatory text",
        divider: "Divider",
      },
      tr: {
        text: "Metin",
        textarea: "Mesaj",
        email: "E-posta",
        phone: "Telefon",
        number: "Sayı",
        date: "Tarih",
        time: "Saat",
        select: "Seçim",
        radio: "Seçenek",
        checkbox: "Onay kutusu",
        "checkbox-group": "Çoklu seçim",
        multiselect: "Çoklu seçim",
        file: "Dosya",
        consent: "Onay",
        hidden: "Gizli alan",
        heading: "Başlık",
        paragraph: "Açıklama metni",
        divider: "Ayırıcı",
      },
    };
    const german: Partial<Record<FormFieldType, string>> = {
      text: "Text",
      textarea: "Nachricht",
      email: "E-Mail",
      phone: "Telefon",
      number: "Zahl",
      date: "Datum",
      time: "Uhrzeit",
      select: "Auswahl",
      radio: "Option",
      checkbox: "Checkbox",
      "checkbox-group": "Mehrfachauswahl",
      multiselect: "Mehrfachauswahl",
      file: "Datei",
      consent: "Zustimmung",
      hidden: "Verstecktes Feld",
      heading: "Ueberschrift",
      paragraph: "Erklaerungstext",
      divider: "Trennlinie",
    };
    return labelsByLocale[locale]?.[type] ?? german[type] ?? "Feld";
  }

  private defaultSuccessMessage(locale: string): string {
    if (locale === "en") return "Thank you for your message.";
    if (locale === "tr") return "Mesajınız için teşekkür ederiz.";
    return "Vielen Dank fuer Ihre Nachricht.";
  }
}
