import { Controller, Get, NotFoundException, Param, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import type {
  CollectionCard,
  ContactFieldResponse,
  PublicCollectionDetail,
} from "@yunity/contracts";
import { Public } from "../../common/decorators";
import { PublicSiteResolver } from "../public/public-site.resolver";
import { CollectionsService } from "../collections/collections.service";
import { ContactFieldsService } from "../collections/contact-fields.service";
import type { CollectionKind } from "../collections/collection-item.schema";
import { PublicContentService } from "./public-content.service";
import { resolveContentLocale } from "../../common/locales";

/**
 * Owner-Typ fuer oeffentliche Kontaktfelder je Art. Yunity fuehrt Kontaktdaten
 * zentral in den Einstellungen (Gruppe "company") — keine Art traegt eigene
 * Kontaktfelder. Die Mechanik bleibt fuer spaetere Arten erhalten.
 */
const CONTACT_OWNER: Partial<Record<CollectionKind, "LOCATION" | "TEAM_MEMBER">> =
  {};

/**
 * Oeffentliche Fachmodul-API. Explizite Routen je Art (kein `:segment`-
 * Catch-all, der sonst mit /public/site kollidieren wuerde).
 */
@Controller("v1/public")
export class PublicCollectionsController {
  constructor(
    private readonly siteResolver: PublicSiteResolver,
    private readonly collections: CollectionsService,
    private readonly contactFields: ContactFieldsService,
    private readonly publicContent: PublicContentService,
  ) {}

  // --- Leistungen ---
  @Public() @Get("services")
  services(@Req() r: Request, @Query("locale") l?: string) {
    return this.listImpl("service", r, l);
  }
  @Public() @Get("services/:slug")
  service(@Req() r: Request, @Param("slug") s: string, @Query("locale") l?: string) {
    return this.detailImpl("service", r, s, l);
  }

  // --- Branchen ---
  @Public() @Get("industries")
  industries(@Req() r: Request, @Query("locale") l?: string) {
    return this.listImpl("industry", r, l);
  }
  @Public() @Get("industries/:slug")
  industry(@Req() r: Request, @Param("slug") s: string, @Query("locale") l?: string) {
    return this.detailImpl("industry", r, s, l);
  }

  // --- Stimmen ---
  @Public() @Get("testimonials")
  testimonials(@Req() r: Request, @Query("locale") l?: string) {
    return this.listImpl("testimonial", r, l);
  }
  @Public() @Get("testimonials/:slug")
  testimonial(@Req() r: Request, @Param("slug") s: string, @Query("locale") l?: string) {
    return this.detailImpl("testimonial", r, s, l);
  }

  // --- Blogartikel ---
  @Public() @Get("blog")
  blogList(@Req() r: Request, @Query("locale") l?: string) {
    return this.listImpl("blog", r, l);
  }
  @Public() @Get("blog/:slug")
  blogArticle(@Req() r: Request, @Param("slug") s: string, @Query("locale") l?: string) {
    return this.detailImpl("blog", r, s, l);
  }

  // --- Implementierung ---

  private async listImpl(
    kind: CollectionKind,
    request: Request,
    localeParam?: string,
  ): Promise<CollectionCard[]> {
    const site = await this.siteResolver.resolve(request);
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );
    return this.collections.resolveForBlock(
      site._id.toString(),
      kind,
      { selectionMode: "all" },
      locale,
      site.defaultLocale,
    );
  }

  private async detailImpl(
    kind: CollectionKind,
    request: Request,
    slug: string,
    localeParam?: string,
  ): Promise<PublicCollectionDetail> {
    const site = await this.siteResolver.resolve(request);
    const siteId = site._id.toString();
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );

    const result = await this.collections.getPublishedBySlug(
      siteId,
      kind,
      slug,
      locale,
    );
    if (!result) {
      throw new NotFoundException("Eintrag nicht gefunden.");
    }
    const { item, snapshot } = result;
    const t =
      snapshot.translations[locale] ??
      snapshot.translations[site.defaultLocale] ??
      {};

    const [sections, contactFields, imageUrl] = await Promise.all([
      this.publicContent.resolveSections(
        siteId,
        snapshot.sections,
        locale,
        site.defaultLocale,
      ),
      this.loadContactFields(
        siteId,
        kind,
        item._id.toString(),
        locale,
        site.defaultLocale,
      ),
      this.collections.imageUrlById(siteId, snapshot.imageId),
    ]);

    return {
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
      attributes: {
        ...snapshot.attributes,
        ...(t.details ?? {}),
      },
      seo: {
        title: t.metaTitle ?? t.title ?? "",
        description: t.metaDescription ?? "",
      },
      contactFields,
      sections,
    };
  }

  private async loadContactFields(
    siteId: string,
    kind: CollectionKind,
    ownerId: string,
    locale: string,
    defaultLocale: string,
  ): Promise<ContactFieldResponse[]> {
    const ownerType = CONTACT_OWNER[kind];
    if (!ownerType) {
      return [];
    }
    const fields = await this.contactFields.list(
      siteId,
      ownerType,
      ownerId,
      true,
    );
    return fields.map((field) => {
      const label =
        field.translations?.[locale]?.label ??
        field.translations?.[defaultLocale]?.label ??
        field.label;
      return {
        id: field._id.toString(),
        fieldType: field.fieldType,
        label,
        translations: field.translations ?? {},
        value: field.value,
        link: field.link,
        icon: field.icon,
        position: field.position,
        isPublic: field.isPublic,
      };
    });
  }
}
