import type { Request } from "express";
import type { UserDocument } from "../modules/users/user.schema";

/** Effektive Zugriffsrechte eines angemeldeten Benutzers. */
export interface AuthContext {
  user: UserDocument;
  sessionId: string;
  /** Site-uebergreifende Berechtigungen ("*" beim Super Administrator). */
  globalPermissions: string[];
  /** Berechtigungen je Site-Id. */
  permissionsBySite: Record<string, string[]>;
}

export type RequestWithAuth = Request & { auth?: AuthContext };
