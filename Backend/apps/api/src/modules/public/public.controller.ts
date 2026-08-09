import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import type { Request } from "express";
import type {
  NavigationResponse,
  PublicSiteResponse,
} from "@yunity/contracts";
import { Public } from "../../common/decorators";
import { NavigationService } from "../navigation/navigation.service";
import { SettingsService } from "../settings/settings.service";
import { PublicSiteResolver } from "./public-site.resolver";
import { resolveContentLocale } from "../../common/locales";

/**
 * Oeffentliche, read-only API fuer das Frontend.
 * Liefert ausschliesslich veroeffentlichte/nicht-sensible Inhalte.
 * In Phase 3 verfuegbar: Site-Infos + Navigation.
 */
@Controller("v1/public")
export class PublicController {
  constructor(
    private readonly siteResolver: PublicSiteResolver,
    private readonly settingsService: SettingsService,
    private readonly navigationService: NavigationService,
  ) {}

  @Public()
  @Get("site")
  async site(@Req() request: Request): Promise<PublicSiteResponse> {
    const site = await this.siteResolver.resolve(request);
    const settings = await this.settingsService.getPublicSettings(
      site._id.toString(),
    );
    return {
      key: site.key,
      name: site.name,
      defaultLocale: site.defaultLocale,
      enabledLocales: site.enabledLocales,
      settings,
    };
  }

  @Public()
  @Get("navigation/:key")
  async navigation(
    @Req() request: Request,
    @Param("key") key: string,
    @Query("locale") locale?: string,
  ): Promise<NavigationResponse> {
    const site = await this.siteResolver.resolve(request);
    const resolvedLocale = resolveContentLocale(
      locale,
      site.defaultLocale,
      site.enabledLocales,
    );
    const { navigation, tree } = await this.navigationService.getPublicTree(
      site._id.toString(),
      key,
      resolvedLocale,
    );
    return {
      id: navigation._id.toString(),
      key: navigation.key,
      name: navigation.name,
      items: tree,
    };
  }
}
