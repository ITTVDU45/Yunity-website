import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export type SettingsGroup =
  | "general"
  | "company"
  | "header"
  | "footer"
  | "seo"
  | "integrations";

@Schema({ timestamps: true, collection: "settings" })
export class Setting {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  // Union-Typ: der Compiler kann daraus keinen design:type ableiten (SWC meldet
  // "ambiguous type"), deshalb der Typ explizit.
  @Prop({ type: String, required: true })
  group: SettingsGroup;

  @Prop({ required: true })
  key: string;

  @Prop({ type: SchemaTypes.Mixed, default: null })
  value: unknown;

  /** Sensible Werte werden nie ueber die oeffentliche API ausgeliefert. */
  @Prop({ default: false })
  isSensitive: boolean;
}

export type SettingDocument = HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
SettingSchema.index({ siteId: 1, group: 1, key: 1 }, { unique: true });
