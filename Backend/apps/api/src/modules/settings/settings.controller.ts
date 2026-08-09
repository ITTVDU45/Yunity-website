import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
} from "@nestjs/common";
import { IsObject } from "class-validator";
import type { SettingsGroupResponse } from "@yunity/contracts";
import { ActiveSiteId } from "../../common/site-context";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import type { AuthContext } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import { isSettingsGroup } from "./settings.config";
import { SettingsService } from "./settings.service";

class PutSettingsDto {
  @IsObject()
  values: Record<string, unknown>;
}

@Controller("v1/admin/settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly auditService: AuditService,
  ) {}

  @Get(":group")
  @RequirePermission("settings.read")
  async getGroup(
    @ActiveSiteId() siteId: string,
    @Param("group") group: string,
  ): Promise<SettingsGroupResponse> {
    if (!isSettingsGroup(group)) {
      throw new NotFoundException("Unbekannte Einstellungsgruppe.");
    }
    const values = await this.settingsService.getGroup(siteId, group);
    return { group, values };
  }

  @Put(":group")
  @RequirePermission("settings.manage")
  async putGroup(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("group") group: string,
    @Body() dto: PutSettingsDto,
    @Req() request: { ip?: string; headers: Record<string, unknown> },
  ): Promise<SettingsGroupResponse> {
    if (!isSettingsGroup(group)) {
      throw new NotFoundException("Unbekannte Einstellungsgruppe.");
    }
    const values = await this.settingsService.putGroup(
      siteId,
      group,
      dto.values,
    );
    await this.auditService.log({
      action: "SETTINGS_UPDATED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Setting",
      entityId: group,
      ipAddress: request.ip ?? null,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? (request.headers["user-agent"] as string)
          : null,
    });
    return { group, values };
  }
}
