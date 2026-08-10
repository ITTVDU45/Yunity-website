import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

/**
 * Rollen speichern Berechtigungsschluessel direkt (statt RolePermission-Tabelle).
 * Schluessel werden beim Schreiben gegen @yunity/permissions validiert.
 * siteId null = Systemrolle / global verfuegbare Rolle.
 */
@Schema({ timestamps: true, collection: "roles" })
export class Role {
  @Prop({ required: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", default: null })
  siteId: Types.ObjectId | null;

  @Prop({ type: [String], required: true, default: [] })
  permissions: string[];

  @Prop({ default: false })
  isSystem: boolean;

  /** Globale Rolle: gilt site-uebergreifend (nur Super Administrator). */
  @Prop({ default: false })
  isGlobal: boolean;
}

export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ siteId: 1, key: 1 }, { unique: true });
