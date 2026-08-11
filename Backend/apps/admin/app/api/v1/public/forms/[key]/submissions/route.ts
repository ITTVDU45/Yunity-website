import { createHmac } from "node:crypto"
import type { NextRequest } from "next/server"
import { fail, handle, notFound, ok } from "@/server/respond"
import { getModels } from "@/server/models"
import { publicContext } from "../../../_shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** 5 Uebermittlungen pro 10 Minuten je Absender. */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function clientIp(request: NextRequest): string | null {
  // Auf Vercel steht die echte Adresse in x-forwarded-for (erster Eintrag).
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")
}

function hashIp(ip: string | null): string | null {
  const secret = process.env.SESSION_SECRET
  return ip && secret
    ? createHmac("sha256", secret).update(ip).digest("hex")
    : null
}

export function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  return handle(async () => {
    const { key } = await params
    const { siteId, site, services } = await publicContext(request)
    const form = await services.forms.getByKeyActive(siteId, key)
    if (!form) return notFound("Formular nicht gefunden.")

    const body = (await request.json().catch(() => ({}))) as {
      data?: Record<string, unknown>
      honeypot?: string
      pageUrl?: string
      referrer?: string
      locale?: string
    }

    /*
     * Das Rate-Limit lief in der NestJS-Fassung ueber @Throttle, also im
     * Arbeitsspeicher eines Prozesses. Auf Vercel teilen sich die Instanzen
     * keinen Speicher — ein Angreifer traefe einfach immer eine frische.
     * Deshalb wird hier gegen die bereits gespeicherten Uebermittlungen
     * gezaehlt; der ipHash liegt ohnehin in jedem Datensatz.
     */
    const ipAddress = clientIp(request)
    const ipHash = hashIp(ipAddress)
    if (ipHash) {
      const { FormSubmission } = await getModels()
      const recent = await FormSubmission.countDocuments({
        ipHash,
        submittedAt: { $gte: new Date(Date.now() - WINDOW_MS) },
      })
      if (recent >= MAX_PER_WINDOW) {
        return fail(
          "RATE_LIMITED",
          "Zu viele Uebermittlungen. Bitte in einigen Minuten erneut versuchen.",
          429,
        )
      }
    }

    const locale =
      body.locale && site.enabledLocales.includes(body.locale)
        ? body.locale
        : site.defaultLocale

    return ok(
      await services.submissions.submit(form, {
        data: body.data ?? {},
        honeypot: body.honeypot,
        pageUrl: body.pageUrl,
        referrer: body.referrer,
        locale,
        ipAddress,
        userAgent: request.headers.get("user-agent"),
      }),
    )
  })
}
