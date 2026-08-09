import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

@Schema({ timestamps: true, collection: "media_folders" })
export class MediaFolder {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "MediaFolder", default: null })
  parentId: Types.ObjectId | null;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 1000 })
  position: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type MediaFolderDocument = HydratedDocument<MediaFolder>;
export const MediaFolderSchema = SchemaFactory.createForClass(MediaFolder);
MediaFolderSchema.index({ siteId: 1, parentId: 1 });
