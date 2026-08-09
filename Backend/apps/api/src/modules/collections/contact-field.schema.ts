import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export const CONTACT_OWNER_TYPES = ["LOCATION", "TEAM_MEMBER", "SITE"] as const;
export type ContactOwnerType = (typeof CONTACT_OWNER_TYPES)[number];

export const CONTACT_FIELD_TYPES = [
  "PHONE",
  "MOBILE",
  "EMAIL",
  "FAX",
  "WEBSITE",
  "ADDRESS",
  "WHATSAPP",
  "LINKEDIN",
  "CUSTOM",
] as const;
export type ContactFieldType = (typeof CONTACT_FIELD_TYPES)[number];

/** Wiederverwendbares Kontaktfeld fuer Standorte, Teammitglieder und die Site. */
@Schema({ timestamps: true, collection: "contact_fields" })
export class ContactField {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: String, enum: CONTACT_OWNER_TYPES, required: true })
  ownerType: ContactOwnerType;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: String, enum: CONTACT_FIELD_TYPES, required: true })
  fieldType: ContactFieldType;

  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, { label?: string }>;

  @Prop({ required: true, trim: true })
  value: string;

  @Prop({ type: String, default: null })
  link: string | null;

  @Prop({ type: String, default: null })
  icon: string | null;

  @Prop({ default: 1000 })
  position: number;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type ContactFieldDocument = HydratedDocument<ContactField>;
export const ContactFieldSchema = SchemaFactory.createForClass(ContactField);
ContactFieldSchema.index({ ownerType: 1, ownerId: 1, position: 1 });
