import { Prop, Schema, SchemaFactory } from "../../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";
import type { ContentStatus } from "../publishing/workflow";
import { CONTENT_STATUSES } from "../publishing/workflow";

export type TranslationStatus =
  | "MISSING"
  | "DRAFT"
  | "COMPLETE"
  | "NEEDS_REVIEW";

/** Uebersetzbare Seitenfelder je Locale (eingebettet statt PageTranslation-Tabelle). */
export interface PageTranslationValue {
  title?: string;
  navigationTitle?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  translationStatus?: TranslationStatus;
}

@Schema({ timestamps: true, collection: "pages" })
export class Page {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Page", default: null })
  parentId: Types.ObjectId | null;

  @Prop({ required: true, trim: true })
  internalName: string;

  @Prop({ required: true, default: "default" })
  templateKey: string;

  @Prop({ type: String, enum: CONTENT_STATUSES, default: "DRAFT" })
  status: ContentStatus;

  @Prop({ default: false })
  isHomepage: boolean;

  @Prop({ default: 1000 })
  position: number;

  /** Uebersetzbare Felder: { de: {...}, en: {...}, tr: {...} }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, PageTranslationValue>;

  /**
   * Denormalisierte Slugs des veroeffentlichten Standes (Routing-Schluessel der
   * Public-API). Wird beim Publish gesetzt, beim Unpublish geleert.
   */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  publishedSlugs: Record<string, string>;

  @Prop({ type: SchemaTypes.ObjectId, ref: "ContentRevision", default: null })
  currentPublishedRevisionId: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;

  @Prop({ type: Date, default: null })
  scheduledPublishAt: Date | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type PageDocument = HydratedDocument<Page> & {
  createdAt: Date;
  updatedAt: Date;
};
export const PageSchema = SchemaFactory.createForClass(Page);
PageSchema.index({ siteId: 1, status: 1 });
PageSchema.index({ siteId: 1, isHomepage: 1 });
