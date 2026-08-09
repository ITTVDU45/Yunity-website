import { createHmac, timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Empfängt signierte Revalidierungs-Signale vom CMS und invalidiert die
 * betroffenen Cache-Tags. Ohne gültige HMAC-Signatur wird abgewiesen.
 */
const MAX_SKEW_MS = 5 * 60 * 1000

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) {
    return NextResponse.json({ error: "not configured" }, { status: 503 })
  }

  const raw = await request.text()
  const signature = request.headers.get("x-signature") ?? ""
  const timestamp = request.headers.get("x-timestamp") ?? ""

  const age = Math.abs(Date.now() - Number.parseInt(timestamp, 10))
  if (!Number.isFinite(age) || age > MAX_SKEW_MS) {
    return NextResponse.json({ error: "stale" }, { status: 401 })
  }
  if (!safeEqual(signature, sign(`${timestamp}.${raw}`, secret))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  let tags: string[] = []
  try {
    const body = JSON.parse(raw) as { tags?: string[] }
    tags = Array.isArray(body.tags) ? body.tags : []
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 })
  }

  for (const tag of tags) {
    revalidateTag(tag, "max")
  }
  return NextResponse.json({ revalidated: true, tags })
}
