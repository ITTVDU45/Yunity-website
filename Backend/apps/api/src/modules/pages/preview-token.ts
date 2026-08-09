import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env";

const PREVIEW_TTL_MS = 10 * 60 * 1000; // 10 min

/**
 * Kurzlebiges, HMAC-signiertes Preview-Token, an eine Seite gebunden.
 * Format: base64url(pageId.expiresAt).signature
 */
export function createPreviewToken(
  pageId: string,
  now: number = Date.now(),
): string {
  const expiresAt = now + PREVIEW_TTL_MS;
  const payload = `${pageId}.${expiresAt}`;
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyPreviewToken(
  token: string,
  now: number = Date.now(),
): { pageId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const [encoded, signature] = parts;
  const expected = sign(encoded);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  const decoded = Buffer.from(encoded, "base64url").toString("utf8");
  const [pageId, expiresAtRaw] = decoded.split(".");
  const expiresAt = Number.parseInt(expiresAtRaw ?? "", 10);
  if (!pageId || !Number.isFinite(expiresAt) || expiresAt < now) {
    return null;
  }
  return { pageId };
}

function sign(value: string): string {
  return createHmac("sha256", env.SESSION_SECRET)
    .update(`preview:${value}`)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}
