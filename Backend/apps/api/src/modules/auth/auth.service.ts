import {
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as argon2 from "argon2";
import { env } from "../../config/env";
import { AuditService } from "../audit/audit.service";
import { UsersService } from "../users/users.service";
import type { UserDocument } from "../users/user.schema";
import {
  PasswordResetToken,
} from "./password-reset-token.schema";
import { Session, type SessionDocument } from "./session.schema";
import {
  PASSWORD_RESET_TTL_MS,
  computeRefreshedExpiry,
  computeSessionExpiries,
  generateToken,
  hashToken,
} from "./token.util";

export interface RequestMeta {
  ipAddress: string | null;
  userAgent: string | null;
}

export interface LoginResult {
  user: UserDocument;
  sessionToken: string;
  session: SessionDocument;
}

/** Neutral — verraet nicht, ob E-Mail oder Passwort falsch war. */
const INVALID_CREDENTIALS = "E-Mail-Adresse oder Passwort ist ungueltig.";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(PasswordResetToken.name)
    private readonly resetTokenModel: Model<PasswordResetToken>,
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
    meta: RequestMeta,
  ): Promise<LoginResult> {
    const user = await this.usersService.findActiveByEmail(email);

    if (!user) {
      // Dummy-Verify gegen Timing-Unterschiede zwischen "User fehlt" und "Passwort falsch".
      await argon2
        .verify(
          "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          password,
        )
        .catch(() => false);
      await this.auditService.log({
        action: "USER_LOGIN_FAILED",
        userEmail: email.toLowerCase(),
        ...meta,
      });
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordValid = await argon2
      .verify(user.passwordHash, password)
      .catch(() => false);

    if (!passwordValid) {
      await this.auditService.log({
        action: "USER_LOGIN_FAILED",
        userId: user._id.toString(),
        userEmail: user.email,
        ...meta,
      });
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const sessionToken = generateToken();
    const expiries = computeSessionExpiries(rememberMe);
    const session = await this.sessionModel.create({
      tokenHash: hashToken(sessionToken, env.SESSION_SECRET),
      userId: user._id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      rememberMe,
      ...expiries,
    });

    await this.usersService.markLogin(user._id.toString());
    await this.auditService.log({
      action: "USER_LOGIN",
      userId: user._id.toString(),
      userEmail: user.email,
      ...meta,
    });

    return { user, sessionToken, session: session as SessionDocument };
  }

  /** Validiert ein Session-Token; liefert Session + Benutzer oder null. */
  async validateSession(
    token: string,
  ): Promise<{ session: SessionDocument; user: UserDocument } | null> {
    const tokenHash = hashToken(token, env.SESSION_SECRET);
    const now = new Date();
    const session = (await this.sessionModel
      .findOne({ tokenHash, revokedAt: null, expiresAt: { $gt: now } })
      .exec()) as SessionDocument | null;

    if (!session || session.absoluteExpiresAt <= now) {
      return null;
    }

    const user = await this.usersService.findActiveById(
      session.userId.toString(),
    );
    if (!user) {
      return null;
    }

    return { session, user };
  }

  /** Sliding Refresh bis zur absoluten Ablaufgrenze. */
  async refreshSession(session: SessionDocument): Promise<Date> {
    const expiresAt = computeRefreshedExpiry(session.absoluteExpiresAt);
    await this.sessionModel.updateOne(
      { _id: session._id },
      { $set: { expiresAt } },
    );
    return expiresAt;
  }

  async logout(
    session: SessionDocument,
    user: UserDocument,
    meta: RequestMeta,
  ): Promise<void> {
    await this.sessionModel.updateOne(
      { _id: session._id },
      { $set: { revokedAt: new Date() } },
    );
    await this.auditService.log({
      action: "USER_LOGOUT",
      userId: user._id.toString(),
      userEmail: user.email,
      ...meta,
    });
  }

  async listSessions(userId: string): Promise<SessionDocument[]> {
    const now = new Date();
    return this.sessionModel
      .find({ userId, revokedAt: null, expiresAt: { $gt: now } })
      .sort({ createdAt: -1 })
      .exec() as Promise<SessionDocument[]>;
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const result = await this.sessionModel.updateOne(
      { _id: sessionId, userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
    return result.modifiedCount > 0;
  }

  async countActiveSessions(): Promise<number> {
    return this.sessionModel.countDocuments({
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  /**
   * Passwort-vergessen: antwortet immer gleich, egal ob die E-Mail existiert.
   * E-Mail-Versand ist bis zur SMTP-Anbindung (Phase 6) ein Logger-Stub.
   */
  async requestPasswordReset(email: string, meta: RequestMeta): Promise<void> {
    const user = await this.usersService.findActiveByEmail(email);
    if (!user) {
      return;
    }

    const token = generateToken();
    await this.resetTokenModel.create({
      tokenHash: hashToken(token, env.SESSION_SECRET),
      userId: user._id,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    });

    await this.auditService.log({
      action: "PASSWORD_RESET_REQUESTED",
      userId: user._id.toString(),
      userEmail: user.email,
      ...meta,
    });

    // TODO(Phase 6): Versand ueber SMTP-Provider. Bis dahin nur dev-Log.
    if (env.NODE_ENV !== "production") {
      this.logger.log(
        `Passwort-Reset-Token fuer ${user.email} (nur dev sichtbar): ${token}`,
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
    meta: RequestMeta,
  ): Promise<void> {
    const tokenHash = hashToken(token, env.SESSION_SECRET);
    const resetToken = await this.resetTokenModel
      .findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } })
      .exec();

    if (!resetToken) {
      throw new UnauthorizedException(
        "Der Link ist ungueltig oder abgelaufen.",
      );
    }

    const user = await this.usersService.findActiveById(
      resetToken.userId.toString(),
    );
    if (!user) {
      throw new UnauthorizedException(
        "Der Link ist ungueltig oder abgelaufen.",
      );
    }

    user.passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });
    await user.save();

    resetToken.usedAt = new Date();
    await resetToken.save();

    // Alle bestehenden Sessions des Benutzers widerrufen.
    await this.sessionModel.updateMany(
      { userId: user._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );

    await this.auditService.log({
      action: "PASSWORD_RESET_COMPLETED",
      userId: user._id.toString(),
      userEmail: user.email,
      ...meta,
    });
  }
}
