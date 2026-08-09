import { cookies } from "next/headers";
import type { ApiResponse } from "@yunity/contracts";
import { SITE_COOKIE } from "./site-cookie";

const API_URL = process.env.CMS_API_URL ?? "http://localhost:4000";

/**
 * Serverseitiger API-Zugriff mit Cookie-Weiterleitung.
 * Liefert null bei 401/403/Netzwerkfehler — Aufrufer leiten dann zum Login um.
 */
export async function apiFetch<T>(
  path: string,
  options: { siteId?: string } = {},
): Promise<T | null> {
  const cookieStore = await cookies();
  try {
    const headers: Record<string, string> = {
      cookie: cookieStore.toString(),
    };
    const siteId = options.siteId ?? cookieStore.get(SITE_COOKIE)?.value;
    if (siteId) {
      headers["X-Site-Id"] = siteId;
    }
    const response = await fetch(`${API_URL}${path}`, {
      headers,
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const body = (await response.json()) as ApiResponse<T>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}
