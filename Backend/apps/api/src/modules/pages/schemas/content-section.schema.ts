import { Prop, Schema, SchemaFactory } from "../../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

/**
 * Polymorphe Sektions-Collection: dieselbe Struktur traegt Seiten-Sektionen und
 * (ab Phase 5) Detailseiten der Fachmodule. Referenzintegritaet wird auf der
 * Service-Ebene sichergestellt.
 */
export const SECTION_OWNER_TYPES = [
  "PAGE",
  "SERVICE",
  "INDUSTRY",
  "TESTIMONIAL",
  "BLOG_ARTICLE",
] as const;

export type SectionOwnerType = (typeof SECTION_OWNER_TYPES)[number];

@Schema({ timestamps: true, collection: "content_sections" })
export class ContentSection {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: String, enum: SECTION_OWNER_TYPES, required: true })
  ownerType: SectionOwnerType;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  blockType: string;

  @Prop({ required: true, default: 1 })
  schemaVersion: number;

  @Prop({ type: String, default: null })
  internalLabel: string | null;

  @Prop({ default: 1000 })
  position: number;

  /** Uebersetzbare Inhaltsdaten je Locale: { de: {...}, en: {...} }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  data: Record<string, unknown>;

  /** Nicht-uebersetzbare Layout-/Design-Optionen. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  settings: Record<string, unknown>;

  @Prop({ type: SchemaTypes.Mixed, default: null })
  visibility: Record<string, unknown> | null;

  @Prop({ default: true })
  isEnabled: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type ContentSectionDocument = HydratedDocument<ContentSection>;
export const ContentSectionSchema =
  SchemaFactory.createForClass(ContentSection);
ContentSectionSchema.index({ ownerType: 1, ownerId: 1, position: 1 });
