import type {
  CollectionCard,
  NavigationResponse,
  PublicCollectionDetail,
  PublicFormDefinition,
  PublicPageResponse,
  PublicSiteResponse,
} from "./types"

/**
 * Zentraler Client für die öffentliche CMS-API. Keine Komponente baut eigene
 * URLs zusammen. Bei Fehlern oder deaktiviertem CMS wird `null` geliefert,
 * damit die Aufrufer sauber auf die statischen Inhalte zurückfallen können —
 * ein nicht erreichbares Backend darf die Website nie zerlegen.
 */

const API_URL = process.env.CMS_API_URL ?? "http://localhost:4000"
const SITE_KEY = process.env.SITE_KEY ?? "yunity"

/** Feature-Flag: solange false, bleibt die Website vollständig statisch. */
export const CMS_ENABLED = process.env.CMS_ENABLED === "true"

interface FetchOptions {
  locale?: string
  /** Cache-Tags für gezielte Revalidierung nach Veröffentlichung. */
  tags?: string[]
  /** Inhalte, die nach Backend-Änderungen sofort frisch sein müssen. */
  noStore?: boolean
}

async function cmsFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T | null> {
  if (!CMS_ENABLED) {
    return null
  }

  const url = new URL(`${API_URL}/api/v1/public${path}`)
  if (options.locale) {
    url.searchParams.set("locale", options.locale)
  }

  try {
    const response = await fetch(url, {
      headers: { "X-Site-Key": SITE_KEY },
      ...(options.noStore
        ? { cache: "no-store" as const }
        : { next: { tags: options.tags, revalidate: 300 } }),
    })
    if (!response.ok) {
      return null
    }
    const body = (await response.json()) as
      | { success: true; data: T }
      | { success: false }
    return body.success ? body.data : null
  } catch {
    return null
  }
}

async function post<T>(
  path: string,
  payload: unknown,
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(`${API_URL}/api/v1/public${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Site-Key": SITE_KEY,
      },
      body: JSON.stringify(payload),
    })
    const body = await response.json()
    if (response.ok && body?.success) {
      return { ok: true, data: body.data as T }
    }
    return {
      ok: false,
      message: body?.error?.message ?? "Die Anfrage konnte nicht gesendet werden.",
    }
  } catch {
    return { ok: false, message: "Verbindung fehlgeschlagen." }
  }
}

export const cms = {
  site: (locale?: string) =>
    cmsFetch<PublicSiteResponse>("/site", { locale, tags: ["site"] }),

  navigation: (key: string, locale?: string) =>
    cmsFetch<NavigationResponse>(`/navigation/${key}`, {
      locale,
      tags: [`navigation:${key}`],
    }),

  home: (locale?: string) =>
    cmsFetch<PublicPageResponse>("/pages/home", {
      locale,
      tags: ["page:/", "page:home"],
    }),

  pageBySlug: (slug: string, locale?: string) =>
    cmsFetch<PublicPageResponse>(`/pages/by-slug/${slug}`, {
      locale,
      tags: [`page:${slug}`],
    }),

  /** Vorschau eines Entwurfs — niemals cachen. */
  preview: (token: string, locale?: string) =>
    cmsFetch<PublicPageResponse>(`/pages/preview/${token}`, {
      locale,
      noStore: true,
    }),

  services: (locale?: string) =>
    cmsFetch<CollectionCard[]>("/services", { locale, tags: ["services:list"] }),
  service: (slug: string, locale?: string) =>
    cmsFetch<PublicCollectionDetail>(`/services/${slug}`, {
      locale,
      tags: [`service:${slug}`],
    }),

  industries: (locale?: string) =>
    cmsFetch<CollectionCard[]>("/industries", {
      locale,
      tags: ["industries:list"],
    }),
  industry: (slug: string, locale?: string) =>
    cmsFetch<PublicCollectionDetail>(`/industries/${slug}`, {
      locale,
      tags: [`industry:${slug}`],
    }),

  testimonials: (locale?: string) =>
    cmsFetch<CollectionCard[]>("/testimonials", {
      locale,
      tags: ["testimonials:list"],
    }),

  blogArticles: (locale?: string) =>
    cmsFetch<CollectionCard[]>("/blog", { locale, tags: ["blog:list"] }),
  blogArticle: (slug: string, locale?: string) =>
    cmsFetch<PublicCollectionDetail>(`/blog/${slug}`, {
      locale,
      tags: [`blog:${slug}`],
    }),

  form: (key: string, locale?: string) =>
    cmsFetch<PublicFormDefinition>(`/forms/${key}`, {
      locale,
      tags: [`form:${key}`],
    }),

  submitForm: (
    key: string,
    payload: { data: Record<string, unknown>; honeypot?: string; locale?: string },
  ) => post<{ id: string; successMessage: string }>(`/forms/${key}/submissions`, payload),
}
