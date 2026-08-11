import type { NextRequest } from "next/server"
import { handle } from "@/server/respond"
import { collectionDetail } from "../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return handle(async () => collectionDetail(request, "blog", (await params).slug))
}
