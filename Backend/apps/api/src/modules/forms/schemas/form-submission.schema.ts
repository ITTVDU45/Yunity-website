import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export const SUBMISSION_STATUSES = [
  "NEW",
  "READ",
  "IN_PROGRESS",
  "COMPLETED",
  "SPAM",
  "ARCHIVED",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

@Schema({ timestamps: true, collection: "form_submissions" })
export class FormSubmission {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Form", required: true, index: true })
  formId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  /** Validierte Feldwerte (Schluessel = Feldname). */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  data: Record<string, unknown>;

  @Prop({ type: String, enum: SUBMISSION_STATUSES, default: "NEW" })
  status: SubmissionStatus;

  @Prop({ type: String, default: null })
  notes: string | null;

  @Prop({ default: "de" })
  locale: string;

  /** Gehashte IP (nie im Klartext gespeichert). */
  @Prop({ type: String, default: null })
  ipHash: string | null;

  @Prop({ type: String, default: null })
  userAgent: string | null;

  @Prop({ type: String, default: null })
  referrer: string | null;

  @Prop({ type: String, default: null })
  pageUrl: string | null;

  @Prop({ type: Number, default: 0 })
  spamScore: number;

  @Prop({ type: Date, default: null })
  processedAt: Date | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type FormSubmissionDocument = HydratedDocument<FormSubmission> & {
  createdAt: Date;
};
export const FormSubmissionSchema =
  SchemaFactory.createForClass(FormSubmission);
FormSubmissionSchema.index({ formId: 1, status: 1, createdAt: -1 });
