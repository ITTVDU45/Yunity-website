import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";
import type { ContentStatus } from "../pages/publishing/workflow";
import { CONTENT_STATUSES } from "../pages/publishing/workflow";

/** Fachmodul- und Blog-Arten teilen sich diese generische Collection. */
export const COLLECTION_KINDS = [
  "service",
  "industry",
  "testimonial",
  "blog",
] as const;

export type CollectionKind = (typeof COLLECTION_KINDS)[number];

export interface CollectionTranslationValue {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  body?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Art-spezifische, uebersetzbare Listen und Zusatzangaben. */
  details?: Record<string, unknown>;
  translationStatus?: "MISSING" | "DRAFT" | "COMPLETE" | "NEEDS_REVIEW";
}

/** Verknuepfungen zu anderen Collections + Kompetenzen (IDs, keine Duplikate). */
export interface CollectionRelations {
  serviceIds?: string[];
  industryIds?: string[];
  competencyIds?: string[];
}

@Schema({ timestamps: true, collection: "collection_items" })
export class CollectionItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: String, enum: COLLECTION_KINDS, required: true, index: true })
  kind: CollectionKind;

  @Prop({ type: String, enum: CONTENT_STATUSES, default: "DRAFT" })
  status: ContentStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: "MediaAsset", default: null })
  imageId: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  icon: string | null;

  @Prop({ default: 1000 })
  position: number;

  @Prop({ default: false })
  featured: boolean;

  /** Uebersetzbare Textfelder: { de: {...}, en: {...} }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, CollectionTranslationValue>;

  /** Kind-spezifische, nicht-uebersetzbare Strukturdaten (Adresse, Name …). */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  attributes: Record<string, unknown>;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  relations: CollectionRelations;

  // --- Veroeffentlichter Stand (analog zu Page) ---
  @Prop({ type: SchemaTypes.ObjectId, ref: "ContentRevision", default: null })
  currentPublishedRevisionId: Types.ObjectId | null;

  @Prop({ type: SchemaTypes.Mixed, default: {} })
  publishedSlugs: Record<string, string>;

  /** Kompakter, denormalisierter Karteninhalt fuer Grid-Bloecke (kein N+1). */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  publishedCard: Record<string, CollectionTranslationValue>;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type CollectionItemDocument = HydratedDocument<CollectionItem> & {
  createdAt: Date;
  updatedAt: Date;
};
export const CollectionItemSchema =
  SchemaFactory.createForClass(CollectionItem);
CollectionItemSchema.index({ siteId: 1, kind: 1, status: 1, position: 1 });
CollectionItemSchema.index({ siteId: 1, kind: 1, currentPublishedRevisionId: 1 });
