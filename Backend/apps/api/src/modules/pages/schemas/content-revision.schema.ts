import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

/**
 * Unveraenderlicher Snapshot einer Entitaet (Seite inkl. Sektionen).
 * Der veroeffentlichte Snapshot (isPublishedSnapshot) ist die Quelle der
 * oeffentlichen API; Entwuerfe werden parallel weiterbearbeitet.
 */
@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: "content_revisions",
})
export class ContentRevision {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ required: true })
  entityType: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true })
  version: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  snapshot: Record<string, unknown>;

  @Prop({ type: String, default: null })
  changeSummary: string | null;

  @Prop({ default: false })
  isPublishedSnapshot: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  createdBy: Types.ObjectId | null;
}

export type ContentRevisionDocument = HydratedDocument<ContentRevision> & {
  createdAt: Date;
};
export const ContentRevisionSchema =
  SchemaFactory.createForClass(ContentRevision);
ContentRevisionSchema.index({ entityType: 1, entityId: 1, version: -1 });
