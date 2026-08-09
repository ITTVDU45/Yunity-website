import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { hasPermission } from "@yunity/permissions";
import type { ContactFieldResponse } from "@yunity/contracts";
import { CurrentAuth } from "../../common/decorators";
import { ActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import {
  type ContactFieldDocument,
  type ContactOwnerType,
} from "./contact-field.schema";
import { ContactFieldsService } from "./contact-fields.service";
import { CreateContactFieldDto, UpdateContactFieldDto } from "./dto";

function toResponse(field: ContactFieldDocument): ContactFieldResponse {
  return {
    id: field._id.toString(),
    fieldType: field.fieldType,
    label: field.label,
    translations: field.translations ?? {},
    value: field.value,
    link: field.link,
    icon: field.icon,
    position: field.position,
    isPublic: field.isPublic,
  };
}

/** Verwaltendes Recht je Owner-Typ des Kontaktfelds. */
const OWNER_PERMISSION: Record<ContactOwnerType, string> = {
  LOCATION: "locations.manage",
  TEAM_MEMBER: "team.manage",
  SITE: "settings.manage",
};

@Controller("v1/admin/contact-fields")
export class ContactFieldsController {
  constructor(private readonly service: ContactFieldsService) {}

  private assert(
    auth: AuthContext,
    siteId: string,
    permission: string,
  ): void {
    const granted = auth.permissionsBySite[siteId] ?? [];
    if (
      !hasPermission(auth.globalPermissions, permission as never) &&
      !hasPermission(granted, permission as never)
    ) {
      throw new ForbiddenException("Keine Berechtigung.");
    }
  }

  @Get()
  async list(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("ownerType") ownerType: ContactOwnerType,
    @Query("ownerId") ownerId: string,
  ): Promise<ContactFieldResponse[]> {
    // Lesen ist an das Verwalten-Recht des Owners gekoppelt (Admin-Kontext).
    this.assert(auth, siteId, OWNER_PERMISSION[ownerType] ?? "settings.read");
    const fields = await this.service.list(siteId, ownerType, ownerId);
    return fields.map(toResponse);
  }

  @Post()
  async create(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("ownerType") ownerType: ContactOwnerType,
    @Query("ownerId") ownerId: string,
    @Body() dto: CreateContactFieldDto,
  ): Promise<ContactFieldResponse> {
    this.assert(auth, siteId, OWNER_PERMISSION[ownerType]);
    const field = await this.service.create(siteId, ownerType, ownerId, dto);
    return toResponse(field);
  }

  @Patch(":id")
  async update(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("ownerType") ownerType: ContactOwnerType,
    @Param("id") id: string,
    @Body() dto: UpdateContactFieldDto,
  ): Promise<ContactFieldResponse> {
    this.assert(auth, siteId, OWNER_PERMISSION[ownerType]);
    const field = await this.service.update(siteId, id, dto);
    return toResponse(field);
  }

  @Delete(":id")
  async remove(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("ownerType") ownerType: ContactOwnerType,
    @Param("id") id: string,
  ): Promise<{ deleted: boolean }> {
    this.assert(auth, siteId, OWNER_PERMISSION[ownerType]);
    await this.service.remove(siteId, id);
    return { deleted: true };
  }
}
