import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

@Schema({ timestamps: true, collection: "password_reset_tokens" })
export class PasswordResetToken {
  @Prop({ required: true, unique: true })
  tokenHash: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: Date, default: null })
  usedAt: Date | null;
}

export type PasswordResetTokenDocument = HydratedDocument<PasswordResetToken>;
export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
