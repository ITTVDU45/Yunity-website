import type { NextRequest } from "next/server"
import { handle, notFound, ok } from "@/server/respond"
import { publicContext } from "../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  return handle(async () => {
    const { key } = await params
    const { siteId, site, locale, services } = await publicContext(request)
    const form = await services.forms.getByKeyActive(siteId, key)
    if (!form) return notFound("Formular nicht gefunden.")
    return ok(services.forms.toPublicDefinition(form, locale, site.defaultLocale))
  })
}
