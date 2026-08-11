import type { NextRequest } from "next/server"
import { getServices } from "./services"
import type { SiteDocument } from "@cms-core/modules/sites/site.schema"

/**
 * Auflösung der Site für öffentliche Anfragen: zuerst der Header `X-Site-Key`
 * (so ruft die Website), sonst die anfragende Domain, sonst der Standardwert
 * aus der Umgebung. Die Site-ID kommt nie aus dem Anfragekörper.
 */
export async function resolveSite(request: NextRequest): Promise<SiteDocument> {
  const { sites } = await getServices()

  const key = request.headers.get("x-site-key")
  if (key) {
    const byKey = await sites.findByKey(key)
    if (byKey) return byKey
  }

  const host = request.headers.get("host")?.split(":")[0]
  if (host) {
    const byDomain = await sites.findByDomain(host)
    if (byDomain) return byDomain
  }

  const fallback = await sites.findByKey(process.env.SITE_KEY ?? "yunity")
  if (!fallback) {
    throw new Error("Keine Site gefunden — wurde der Seed ausgefuehrt?")
  }
  return fallback
}

/** Sprachauflösung mit Rückfall auf die Standardsprache der Site. */
export function resolveLocale(
  requested: string | null,
  site: SiteDocument,
): string {
  if (requested && site.enabledLocales.includes(requested)) {
    return requested
  }
  return site.defaultLocale
}
