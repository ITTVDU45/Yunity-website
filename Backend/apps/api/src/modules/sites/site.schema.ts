import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type SiteStatus = "ACTIVE" | "SUSPENDED";

@Schema({ timestamps: true, collection: "sites" })
export class Site {
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  primaryDomain: string;

  @Prop({ trim: true })
  cmsDomain?: string;

  @Prop({ required: true, default: "de" })
  defaultLocale: string;

  @Prop({ type: [String], required: true, default: ["de", "en", "tr"] })
  enabledLocales: string[];

  @Prop({ required: true, default: "Europe/Berlin" })
  timezone: string;

  @Prop({ type: String, enum: ["ACTIVE", "SUSPENDED"], default: "ACTIVE" })
  status: SiteStatus;

  @Prop({ type: Object, required: true, default: {} })
  enabledModules: Record<string, boolean>;

  @Prop({ type: Object, required: true, default: {} })
  settings: Record<string, unknown>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type SiteDocument = HydratedDocument<Site>;
export const SiteSchema = SchemaFactory.createForClass(Site);
