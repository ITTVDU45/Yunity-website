import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Millisekunden-Konstanten fuer die Session-Laufzeiten. */
export const SLIDING_SESSION_MS = 12 * 60 * 60 * 1000; // 12 h
export const ABSOLUTE_SESSION_MS = 24 * 60 * 60 * 1000; // 24 h
export const ABSOLUTE_REMEMBER_ME_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 h

/** Opakes Session-/Reset-Token; nur der HMAC-Hash wird gespeichert. */
export function generateToken(): string {
  return randomBytes(48).toString("base64url");
}

export function hashToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function tokensMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

export interface SessionExpiries {
  expiresAt: Date;
  absoluteExpiresAt: Date;
}

export function computeSessionExpiries(
  rememberMe: boolean,
  now: Date = new Date(),
): SessionExpiries {
  const absoluteMs = rememberMe ? ABSOLUTE_REMEMBER_ME_MS : ABSOLUTE_SESSION_MS;
  const absoluteExpiresAt = new Date(now.getTime() + absoluteMs);
  const slidingCandidate = new Date(now.getTime() + SLIDING_SESSION_MS);
  return {
    expiresAt:
      slidingCandidate < absoluteExpiresAt ? slidingCandidate : absoluteExpiresAt,
    absoluteExpiresAt,
  };
}

/** Sliding Refresh: verlaengert bis maximal zur absoluten Grenze. */
export function computeRefreshedExpiry(
  absoluteExpiresAt: Date,
  now: Date = new Date(),
): Date {
  const candidate = new Date(now.getTime() + SLIDING_SESSION_MS);
  return candidate < absoluteExpiresAt ? candidate : absoluteExpiresAt;
}
