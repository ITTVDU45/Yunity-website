import type { NextRequest } from "next/server"
import { handle } from "@/server/respond"
import { listCollection } from "../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  return handle(() => listCollection(request, "blog"))
}
