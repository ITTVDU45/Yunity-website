import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

@Schema({ timestamps: true, collection: "navigations" })
export class Navigation {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type NavigationDocument = HydratedDocument<Navigation>;
export const NavigationSchema = SchemaFactory.createForClass(Navigation);
NavigationSchema.index({ siteId: 1, key: 1 }, { unique: true });
