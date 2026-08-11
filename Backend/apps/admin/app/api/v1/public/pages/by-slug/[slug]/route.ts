import type { NextRequest } from "next/server"
import { handle, notFound, ok } from "@/server/respond"
import { buildPageResponse, publicContext } from "../../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return handle(async () => {
    const { slug } = await params
    const { siteId, site, locale, services } = await publicContext(request)
    const snapshot = await services.pages.getPublishedBySlug(siteId, slug, locale)
    if (!snapshot) return notFound("Seite nicht gefunden.")
    return ok(
      await buildPageResponse(siteId, snapshot, locale, site.defaultLocale, slug),
    )
  })
}
