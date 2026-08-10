import { Prop, Schema, SchemaFactory } from "../../common/nest-mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

export type UserStatus = "ACTIVE" | "INVITED" | "DISABLED";

/**
 * Rollenzuweisung: siteId null = globale Rolle (Super Administrator).
 * Ersetzt die relationale UserRole-Tabelle (s. data-model.md §0).
 */
@Schema({ _id: false })
export class UserRoleAssignment {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Role", required: true })
  roleId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", default: null })
  siteId: Types.ObjectId | null;
}

const UserRoleAssignmentSchema =
  SchemaFactory.createForClass(UserRoleAssignment);

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({
    type: String,
    enum: ["ACTIVE", "INVITED", "DISABLED"],
    default: "ACTIVE",
  })
  status: UserStatus;

  @Prop({ type: [UserRoleAssignmentSchema], default: [] })
  roles: UserRoleAssignment[];

  /** Vorbereitet fuer TOTP-2FA (Phase 9+), niemals ueber die API ausgeben. */
  @Prop({ type: String, default: null })
  totpSecret: string | null;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
