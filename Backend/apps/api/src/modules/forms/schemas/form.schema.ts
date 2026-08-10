import { Prop, Schema, SchemaFactory } from "../../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export const FORM_FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "date",
  "time",
  "select",
  "radio",
  "checkbox",
  "checkbox-group",
  "multiselect",
  "file",
  "consent",
  "hidden",
  "heading",
  "paragraph",
  "divider",
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export type FormStatus = "ACTIVE" | "DISABLED" | "ARCHIVED";

/** Auswahloption (Dropdown, Radio, Checkbox-Gruppe). */
@Schema({ _id: true })
export class FormFieldOption {
  /** Typ-only (Mongoose vergibt die _id zur Laufzeit; kein Klassenfeld). */
  declare _id?: Types.ObjectId;

  @Prop({ required: true })
  value: string;

  @Prop({ default: 1000 })
  position: number;

  @Prop({ default: true })
  isEnabled: boolean;

  /** { de: { label } }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, { label?: string }>;
}
const FormFieldOptionSchema = SchemaFactory.createForClass(FormFieldOption);

@Schema({ _id: true })
export class FormField {
  /** Typ-only (Mongoose vergibt die _id zur Laufzeit; kein Klassenfeld). */
  declare _id?: Types.ObjectId;

  @Prop({ type: String, enum: FORM_FIELD_TYPES, required: true })
  type: FormFieldType;

  /** Maschinenname = Schluessel in den Submission-Daten. */
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: SchemaTypes.Mixed, default: null })
  defaultValue: unknown;

  @Prop({ type: String, enum: ["FULL", "HALF", "THIRD"], default: "FULL" })
  width: "FULL" | "HALF" | "THIRD";

  @Prop({ default: 1000 })
  position: number;

  @Prop({ default: true })
  isEnabled: boolean;

  /** { minLength?, maxLength?, min?, max?, pattern?, allowedFileTypes?, maxFileSize?, errorMessage? } */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  validation: Record<string, unknown>;

  /** { action, operator, rules: [{ field, comparison, value }] } */
  @Prop({ type: SchemaTypes.Mixed, default: null })
  conditions: Record<string, unknown> | null;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  settings: Record<string, unknown>;

  /** { de: { label, placeholder?, helpText? } }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<
    string,
    { label?: string; placeholder?: string; helpText?: string }
  >;

  @Prop({ type: [FormFieldOptionSchema], default: [] })
  options: FormFieldOption[];
}
const FormFieldSchema = SchemaFactory.createForClass(FormField);

@Schema({ timestamps: true, collection: "forms" })
export class Form {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    enum: ["ACTIVE", "DISABLED", "ARCHIVED"],
    default: "ACTIVE",
  })
  status: FormStatus;

  @Prop({ type: String, enum: ["MESSAGE", "REDIRECT"], default: "MESSAGE" })
  successAction: "MESSAGE" | "REDIRECT";

  @Prop({ type: String, default: null })
  redirectUrl: string | null;

  /** { recipients: string[], autoReply: boolean } — Secrets liegen in ENV. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  notificationSettings: Record<string, unknown>;

  /** { honeypotField?: string, rateLimit?: number } */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  spamSettings: Record<string, unknown>;

  @Prop({ type: Number, default: null })
  retentionDays: number | null;

  /** { de: { title?, successMessage?, privacyText?, consentText? } }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<
    string,
    {
      title?: string;
      successMessage?: string;
      privacyText?: string;
      consentText?: string;
    }
  >;

  @Prop({ type: [FormFieldSchema], default: [] })
  fields: FormField[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type FormDocument = HydratedDocument<Form> & {
  createdAt: Date;
  updatedAt: Date;
};
export const FormSchema = SchemaFactory.createForClass(Form);
FormSchema.index({ siteId: 1, key: 1 }, { unique: true });
