import { Injectable, NotFoundException } from "@nestjs/common";
import type { Request } from "express";
import { SitesService } from "../sites/sites.service";
import type { SiteDocument } from "../sites/site.schema";

export const PUBLIC_SITE_KEY_HEADER = "x-site-key";

/**
 * Loest die Site fuer oeffentliche Anfragen auf.
 * Bevorzugt die anfragende Domain (Origin/Host), faellt auf den Header
 * X-Site-Key zurueck. So kann das Frontend seine Site eindeutig adressieren.
 */
@Injectable()
export class PublicSiteResolver {
  constructor(private readonly sitesService: SitesService) {}

  async resolve(request: Request): Promise<SiteDocument> {
    const headerKey = request.headers[PUBLIC_SITE_KEY_HEADER];
    if (typeof headerKey === "string" && headerKey.length > 0) {
      const site = await this.sitesService.findByKey(headerKey);
      if (site) {
        return site;
      }
    }

    const host = request.headers.host;
    if (typeof host === "string" && host.length > 0) {
      const domain = host.split(":")[0];
      const site = await this.sitesService.findByDomain(domain);
      if (site) {
        return site;
      }
    }

    throw new NotFoundException("Site konnte nicht aufgeloest werden.");
  }
}
