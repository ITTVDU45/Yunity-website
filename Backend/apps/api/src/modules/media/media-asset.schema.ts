import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export type MediaStatus = "PROCESSING" | "READY" | "ARCHIVED";

/** Uebersetzbare Metadaten je Locale (ersetzt die MediaTranslation-Tabelle). */
export interface MediaTranslationValue {
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
}

@Schema({ timestamps: true, collection: "media_assets" })
export class MediaAsset {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "MediaFolder", default: null })
  folderId: Types.ObjectId | null;

  @Prop({ required: true, default: "s3" })
  storageProvider: string;

  @Prop({ required: true, unique: true })
  storageKey: string;

  @Prop({ required: true })
  originalFilename: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true, default: 0 })
  fileSize: number;

  @Prop({ type: Number, default: null })
  width: number | null;

  @Prop({ type: Number, default: null })
  height: number | null;

  @Prop({ type: Number, default: 0.5 })
  focalPointX: number;

  @Prop({ type: Number, default: 0.5 })
  focalPointY: number;

  /** Uebersetzbare Metadaten: { de: {...}, en: {...}, tr: {...} }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, MediaTranslationValue>;

  @Prop({
    type: String,
    enum: ["PROCESSING", "READY", "ARCHIVED"],
    default: "PROCESSING",
  })
  status: MediaStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  uploadedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type MediaAssetDocument = HydratedDocument<MediaAsset> & {
  createdAt: Date;
  updatedAt: Date;
};
export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);
MediaAssetSchema.index({ siteId: 1, folderId: 1, status: 1 });
