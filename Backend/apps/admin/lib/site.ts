"use client";

import { SITE_COOKIE } from "./site-cookie";

export { SITE_COOKIE } from "./site-cookie";

export function getActiveSiteId(): string {
  if (typeof document === "undefined") {
    return "";
  }
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${SITE_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(SITE_COOKIE.length + 1)) : "";
}

export function setActiveSiteId(id: string): void {
  if (typeof document === "undefined") {
    return;
  }
  // 30 Tage, same-origin. Kein httpOnly noetig — nur ein Kontext-Hinweis.
  const maxAge = 30 * 24 * 60 * 60;
  document.cookie = `${SITE_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${maxAge}; samesite=lax`;
}
