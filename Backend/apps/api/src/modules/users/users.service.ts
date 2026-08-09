import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "./role.schema";
import { User, type UserDocument } from "./user.schema";
import { resolveAccess, type ResolvedAccess } from "./access-resolver";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async findActiveByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: email.toLowerCase().trim(),
        status: "ACTIVE",
        deletedAt: null,
      })
      .exec();
  }

  async findActiveById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ _id: id, status: "ACTIVE", deletedAt: null })
      .exec();
  }

  async markLogin(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { lastLoginAt: new Date() } },
    );
  }

  async countActive(): Promise<number> {
    return this.userModel.countDocuments({ status: "ACTIVE", deletedAt: null });
  }

  /** Effektive Berechtigungen aus den Rollenzuweisungen des Benutzers. */
  async resolveAccessFor(user: UserDocument): Promise<ResolvedAccess> {
    const roleIds = user.roles.map((assignment) => assignment.roleId);
    if (roleIds.length === 0) {
      return { globalPermissions: [], permissionsBySite: {} };
    }

    const roles = await this.roleModel.find({ _id: { $in: roleIds } }).exec();
    const rolesById = new Map(
      roles.map((role) => [
        role._id.toString(),
        {
          id: role._id.toString(),
          permissions: role.permissions,
          isGlobal: role.isGlobal,
        },
      ]),
    );

    return resolveAccess(
      user.roles.map((assignment) => ({
        roleId: assignment.roleId.toString(),
        siteId: assignment.siteId ? assignment.siteId.toString() : null,
      })),
      rolesById,
    );
  }
}
