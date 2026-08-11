import type { NextRequest } from "next/server"
import { getServices } from "@/server/services"
import { resolveLocale, resolveSite } from "@/server/site"
import { ok } from "@/server/respond"
import type { CollectionKind } from "@cms-core/modules/collections/collection-item.schema"

/** Kontext, den fast jede öffentliche Route braucht. */
export async function publicContext(request: NextRequest) {
  const site = await resolveSite(request)
  const locale = resolveLocale(
    request.nextUrl.searchParams.get("locale"),
    site,
  )
  return { site, siteId: site._id.toString(), locale, services: await getServices() }
}

/** Liste einer Sammlung als Karten — identisch zur bisherigen Public-API. */
export async function listCollection(request: NextRequest, kind: CollectionKind) {
  const { siteId, site, locale, services } = await publicContext(request)
  const cards = await services.collections.resolveForBlock(
    siteId,
    kind,
    { selectionMode: "all" },
    locale,
    site.defaultLocale,
  )
  return ok(cards)
}

import type { PublishedPageSnapshot } from "@cms-core/modules/pages/pages.service"

/** Antwortaufbau einer Seite — identisch zur bisherigen NestJS-Fassung. */
export async function buildPageResponse(
  siteId: string,
  snapshot: PublishedPageSnapshot,
  locale: string,
  defaultLocale: string,
  pageId: string,
) {
  const { publicContent } = await getServices()
  const t =
    snapshot.translations[locale] ?? snapshot.translations[defaultLocale] ?? {}
  return {
    id: pageId,
    slug: t.slug ?? "",
    locale,
    isHomepage: snapshot.isHomepage,
    seo: {
      title: t.metaTitle ?? t.title ?? "",
      description: t.metaDescription ?? "",
      noIndex: t.noIndex ?? false,
      noFollow: t.noFollow ?? false,
      canonicalUrl: t.canonicalUrl ?? null,
    },
    sections: await publicContent.resolveSections(
      siteId,
      snapshot.sections,
      locale,
      defaultLocale,
    ),
  }
}

import { notFound } from "@/server/respond"

/** Detailseite eines Sammlungseintrags — gespiegelt aus PublicCollectionsController. */
export async function collectionDetail(
  request: NextRequest,
  kind: CollectionKind,
  slug: string,
) {
  const { siteId, site, locale, services } = await publicContext(request)
  const result = await services.collections.getPublishedBySlug(
    siteId,
    kind,
    slug,
    locale,
  )
  if (!result) return notFound("Eintrag nicht gefunden.")

  const { item, snapshot } = result
  const t =
    snapshot.translations[locale] ??
    snapshot.translations[site.defaultLocale] ??
    {}
  const [sections, imageUrl] = await Promise.all([
    services.publicContent.resolveSections(
      siteId,
      snapshot.sections,
      locale,
      site.defaultLocale,
    ),
    services.collections.imageUrlById(siteId, snapshot.imageId),
  ])

  return ok({
    id: item._id.toString(),
    kind,
    slug: t.slug ?? slug,
    locale,
    title: t.title ?? "",
    subtitle: t.subtitle ?? "",
    excerpt: t.excerpt ?? "",
    body: t.body ?? "",
    icon: snapshot.icon,
    imageUrl:
      imageUrl ??
      (typeof t.details?.imageUrl === "string"
        ? t.details.imageUrl
        : typeof snapshot.attributes.imageUrl === "string"
          ? snapshot.attributes.imageUrl
          : null),
    attributes: { ...snapshot.attributes, ...(t.details ?? {}) },
    seo: {
      title: t.metaTitle ?? t.title ?? "",
      description: t.metaDescription ?? "",
    },
    // Yunity fuehrt Kontaktdaten zentral in den Einstellungen.
    contactFields: [],
    sections,
  })
}
