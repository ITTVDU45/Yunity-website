import type { NextRequest } from "next/server"
import { handle, ok } from "@/server/respond"
import { publicContext } from "../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  return handle(async () => {
    const { site, siteId, services } = await publicContext(request)
    // getPublicSettings filtert die als sensibel markierten Schluessel heraus.
    const settings = await services.settings.getPublicSettings(siteId)
    return ok({
      key: site.key,
      name: site.name,
      defaultLocale: site.defaultLocale,
      enabledLocales: site.enabledLocales,
      settings,
    })
  })
}
