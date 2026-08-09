import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

/**
 * Append-only Protokoll administrativer Aktionen.
 * Niemals speichern: Passwort-Hashes, Tokens, API-Secrets (Redaktion im Service).
 */
@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: "audit_logs",
})
export class AuditLog {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", default: null })
  siteId: Types.ObjectId | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", default: null })
  userId: Types.ObjectId | null;

  /** Denormalisiert, damit Eintraege auch nach Benutzer-Loeschung lesbar bleiben. */
  @Prop({ type: String, default: null })
  userEmail: string | null;

  @Prop({ required: true })
  action: string;

  @Prop({ type: String, default: null })
  entityType: string | null;

  @Prop({ type: String, default: null })
  entityId: string | null;

  @Prop({ type: Object, default: null })
  before: Record<string, unknown> | null;

  @Prop({ type: Object, default: null })
  after: Record<string, unknown> | null;

  @Prop({ type: String, default: null })
  ipAddress: string | null;

  @Prop({ type: String, default: null })
  userAgent: string | null;
}

export type AuditLogDocument = HydratedDocument<AuditLog> & {
  createdAt: Date;
};
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ siteId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
