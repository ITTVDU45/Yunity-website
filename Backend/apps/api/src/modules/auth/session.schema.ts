import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

@Schema({ timestamps: true, collection: "sessions" })
export class Session {
  @Prop({ required: true, unique: true })
  tokenHash: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, default: null })
  ipAddress: string | null;

  @Prop({ type: String, default: null })
  userAgent: string | null;

  @Prop({ default: false })
  rememberMe: boolean;

  /** Sliding Expiration; TTL-Index raeumt abgelaufene Sessions automatisch ab. */
  @Prop({ required: true })
  expiresAt: Date;

  /** Absolute Obergrenze, wird beim Refresh nicht verlaengert. */
  @Prop({ required: true })
  absoluteExpiresAt: Date;

  @Prop({ type: Date, default: null })
  revokedAt: Date | null;
}

export type SessionDocument = HydratedDocument<Session> & { createdAt: Date };
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
