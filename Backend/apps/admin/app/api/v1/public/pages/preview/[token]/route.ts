import type { NextRequest } from "next/server"
import { handle, notFound, ok } from "@/server/respond"
import { verifyPreviewToken } from "@cms-core/modules/pages/preview-token"
import { buildPageResponse, publicContext } from "../../../_shared"

export const runtime = "nodejs"
// Entwuerfe duerfen niemals zwischengespeichert werden.
export const dynamic = "force-dynamic"
export const revalidate = 0

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  return handle(async () => {
    const { token } = await params
    const verified = verifyPreviewToken(token)
    if (!verified) return notFound("Vorschau-Link ist ungueltig oder abgelaufen.")

    const { siteId, site, locale, services } = await publicContext(request)
    const snapshot = await services.pages.getDraftSnapshot(siteId, verified.pageId)
    if (!snapshot) return notFound("Seite nicht gefunden.")

    const response = ok(
      await buildPageResponse(
        siteId, snapshot, locale, site.defaultLocale, verified.pageId,
      ),
    )
    response.headers.set("Cache-Control", "no-store")
    return response
  })
}
