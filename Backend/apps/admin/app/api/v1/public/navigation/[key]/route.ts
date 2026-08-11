import type { NextRequest } from "next/server"
import { handle, ok } from "@/server/respond"
import { publicContext } from "../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  return handle(async () => {
    const { key } = await params
    const { siteId, locale, services } = await publicContext(request)
    const { navigation, tree } = await services.navigation.getPublicTree(
      siteId,
      key,
      locale,
    )
    return ok({
      id: navigation._id.toString(),
      key: navigation.key,
      name: navigation.name,
      items: tree,
    })
  })
}
