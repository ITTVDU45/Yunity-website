import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export type NavigationItemType =
  | "PAGE"
  | "EXTERNAL"
  | "ANCHOR"
  | "GROUP"
  | "BUTTON"
  | "COLLECTION"
  | "PLACEHOLDER";

@Schema({ timestamps: true, collection: "navigation_items" })
export class NavigationItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: "Navigation",
    required: true,
    index: true,
  })
  navigationId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "NavigationItem", default: null })
  parentId: Types.ObjectId | null;

  @Prop({
    type: String,
    enum: ["PAGE", "EXTERNAL", "ANCHOR", "GROUP", "BUTTON", "COLLECTION", "PLACEHOLDER"],
    default: "PLACEHOLDER",
  })
  type: NavigationItemType;

  /** Fallback-Label; uebersetzte Labels stehen in translations. */
  @Prop({ required: true, trim: true })
  label: string;

  /** { de: "Team", en: "Team", tr: "Ekip" } */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, string>;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Page", default: null })
  pageId: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  url: string | null;

  @Prop({ type: String, default: null })
  anchor: string | null;

  @Prop({ type: String, enum: ["SELF", "BLANK"], default: "SELF" })
  target: "SELF" | "BLANK";

  @Prop({ type: String, default: null })
  icon: string | null;

  @Prop({ type: String, default: null })
  cssClass: string | null;

  @Prop({ default: 1000 })
  position: number;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: SchemaTypes.Mixed, default: null })
  visibilityRules: Record<string, unknown> | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type NavigationItemDocument = HydratedDocument<NavigationItem>;
export const NavigationItemSchema =
  SchemaFactory.createForClass(NavigationItem);
NavigationItemSchema.index({ navigationId: 1, parentId: 1, position: 1 });
