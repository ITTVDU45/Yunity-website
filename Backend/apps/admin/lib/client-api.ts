"use client";

import type { ApiResponse } from "@yunity/contracts";
import { getActiveSiteId } from "./site";

/** Liest das (bewusst nicht-httpOnly) CSRF-Cookie fuer das Double-Submit-Muster. */
export function readCsrfToken(): string {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("cms_csrf="));
  return match ? decodeURIComponent(match.slice("cms_csrf=".length)) : "";
}

/** Client-Requests laufen same-origin ueber den /api-Rewrite. */
export async function clientApi<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown },
): Promise<ApiResponse<T>> {
  const method = init?.method ?? "GET";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const siteId = getActiveSiteId();
  if (siteId) {
    headers["X-Site-Id"] = siteId;
  }
  if (method !== "GET" && method !== "HEAD") {
    headers["X-CSRF-Token"] = readCsrfToken();
  }

  try {
    const response = await fetch(path, {
      ...init,
      method,
      headers: { ...headers, ...(init?.headers as Record<string, string>) },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: "include",
    });
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: {
        code: "INTERNAL",
        message: "Verbindung zum Server fehlgeschlagen.",
      },
    };
  }
}

