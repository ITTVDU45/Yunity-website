import type { CookieOptions, Response } from "express";
import { randomBytes } from "node:crypto";
import { env } from "../../config/env";

export const SESSION_COOKIE = "cms_session";
export const CSRF_COOKIE = "cms_csrf";
export const SITE_COOKIE = "cms_site";
export const CSRF_HEADER = "x-csrf-token";
export const SITE_HEADER = "x-site-id";

function baseOptions(): CookieOptions {
  return {
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
    path: "/",
  };
}

export function setSessionCookies(
  response: Response,
  sessionToken: string,
  absoluteExpiresAt: Date,
): void {
  const maxAge = absoluteExpiresAt.getTime() - Date.now();
  response.cookie(SESSION_COOKIE, sessionToken, {
    ...baseOptions(),
    httpOnly: true,
    maxAge,
  });
  // CSRF-Cookie ist bewusst NICHT httpOnly (Double-Submit-Muster).
  response.cookie(CSRF_COOKIE, randomBytes(24).toString("base64url"), {
    ...baseOptions(),
    httpOnly: false,
    maxAge,
  });
}

export function clearSessionCookies(response: Response): void {
  response.clearCookie(SESSION_COOKIE, { ...baseOptions(), httpOnly: true });
  response.clearCookie(CSRF_COOKIE, { ...baseOptions(), httpOnly: false });
}
