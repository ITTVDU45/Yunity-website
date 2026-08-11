import type { NextRequest } from "next/server"
import { handle, notFound, ok } from "@/server/respond"
import { buildPageResponse, publicContext } from "../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  return handle(async () => {
    const { siteId, site, locale, services } = await publicContext(request)
    const snapshot = await services.pages.getPublishedHome(siteId)
    if (!snapshot) return notFound("Startseite ist nicht veroeffentlicht.")
    return ok(
      await buildPageResponse(siteId, snapshot, locale, site.defaultLocale, "home"),
    )
  })
}
