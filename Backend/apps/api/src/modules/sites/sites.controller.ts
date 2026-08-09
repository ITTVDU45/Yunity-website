import { Controller, Get } from "@nestjs/common";
import type { SiteSummary } from "@yunity/contracts";
import { CurrentAuth } from "../../common/decorators";
import type { AuthContext } from "../../common/request-context";
import { SitesService } from "./sites.service";

@Controller("v1/admin/sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  /** Sites des angemeldeten Benutzers (Super Admin: alle aktiven Sites). */
  @Get()
  async list(@CurrentAuth() auth: AuthContext): Promise<SiteSummary[]> {
    const isSuperAdmin = auth.globalPermissions.includes("*");
    const sites = isSuperAdmin
      ? await this.sitesService.findActive()
      : await this.sitesService.findByIds(Object.keys(auth.permissionsBySite));
    return sites.map((site) => this.sitesService.toSummary(site));
  }
}
