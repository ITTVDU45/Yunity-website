import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import type { PublicPageResponse } from "@yunity/contracts";
import { Public } from "../../common/decorators";
import { PublicSiteResolver } from "../public/public-site.resolver";
import { PublicContentService } from "../public-content/public-content.service";
import { PagesService, type PublishedPageSnapshot } from "./pages.service";
import { verifyPreviewToken } from "./preview-token";
import { resolveContentLocale } from "../../common/locales";

/**
 * Oeffentliche Seiten-API. Liefert den veroeffentlichten Snapshot (mit
 * serverseitig aufgeloesten Collection-Bloecken). Mit gueltigem Preview-Token
 * wird stattdessen der Live-Entwurf ausgegeben (nie cachebar).
 */
@Controller("v1/public/pages")
export class PublicPagesController {
  constructor(
    private readonly siteResolver: PublicSiteResolver,
    private readonly pagesService: PagesService,
    private readonly publicContent: PublicContentService,
  ) {}

  private async buildResponse(
    siteId: string,
    snapshot: PublishedPageSnapshot,
    locale: string,
    defaultLocale: string,
    pageId: string,
  ): Promise<PublicPageResponse> {
    const translation =
      snapshot.translations[locale] ??
      snapshot.translations[defaultLocale] ??
      {};
    return {
      id: pageId,
      slug: translation.slug ?? "",
      locale,
      isHomepage: snapshot.isHomepage,
      seo: {
        title: translation.metaTitle ?? translation.title ?? "",
        description: translation.metaDescription ?? "",
        noIndex: translation.noIndex ?? false,
        noFollow: translation.noFollow ?? false,
        canonicalUrl: translation.canonicalUrl ?? null,
      },
      sections: await this.publicContent.resolveSections(
        siteId,
        snapshot.sections,
        locale,
        defaultLocale,
      ),
    };
  }

  @Public()
  @Get("home")
  async home(
    @Req() request: Request,
    @Query("locale") localeParam?: string,
  ): Promise<PublicPageResponse> {
    const site = await this.siteResolver.resolve(request);
    const siteId = site._id.toString();
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );
    const snapshot = await this.pagesService.getPublishedHome(siteId);
    if (!snapshot) {
      throw new NotFoundException("Startseite ist nicht veroeffentlicht.");
    }
    return this.buildResponse(siteId, snapshot, locale, site.defaultLocale, "home");
  }

  @Public()
  @Header("Cache-Control", "no-store")
  @Get("preview/:token")
  async preview(
    @Req() request: Request,
    @Param("token") token: string,
    @Query("locale") localeParam?: string,
  ): Promise<PublicPageResponse> {
    const verified = verifyPreviewToken(token);
    if (!verified) {
      throw new NotFoundException("Vorschau-Link ist ungueltig oder abgelaufen.");
    }
    const site = await this.siteResolver.resolve(request);
    const siteId = site._id.toString();
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );
    const snapshot = await this.pagesService.getDraftSnapshot(
      siteId,
      verified.pageId,
    );
    if (!snapshot) {
      throw new NotFoundException("Seite nicht gefunden.");
    }
    return this.buildResponse(
      siteId,
      snapshot,
      locale,
      site.defaultLocale,
      verified.pageId,
    );
  }

  @Public()
  @Get("by-slug/:slug")
  async bySlug(
    @Req() request: Request,
    @Param("slug") slug: string,
    @Query("locale") localeParam?: string,
  ): Promise<PublicPageResponse> {
    const site = await this.siteResolver.resolve(request);
    const siteId = site._id.toString();
    const locale = resolveContentLocale(
      localeParam,
      site.defaultLocale,
      site.enabledLocales,
    );
    const snapshot = await this.pagesService.getPublishedBySlug(
      siteId,
      slug,
      locale,
    );
    if (!snapshot) {
      throw new NotFoundException("Seite nicht gefunden.");
    }
    return this.buildResponse(siteId, snapshot, locale, site.defaultLocale, slug);
  }
}
