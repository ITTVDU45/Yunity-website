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
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { hasPermission } from "@yunity/permissions";
import type {
  ContentSectionResponse,
  PageDetail,
  PageListItem,
  RevisionSummary,
} from "@yunity/contracts";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import { ActiveSiteId, resolveActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import type { RequestWithAuth } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import {
  AddSectionDto,
  CreatePageDto,
  ReorderSectionsDto,
  UpdatePageDto,
  UpdateSectionDto,
  WorkflowActionDto,
} from "./dto";
import { PagesService } from "./pages.service";
import { RevisionsService } from "./revisions.service";
import { SectionsService } from "./sections.service";
import { ACTION_PERMISSION } from "./publishing/actions";
import { createPreviewToken } from "./preview-token";
import { RevalidationService } from "./revalidation.service";
import { resolveContentLocale } from "../../common/locales";
import type { PageDocument } from "./schemas/page.schema";
import type { ContentSectionDocument } from "./schemas/content-section.schema";

function sectionToResponse(
  section: ContentSectionDocument,
): ContentSectionResponse {
  return {
    id: section._id.toString(),
    blockType: section.blockType,
    schemaVersion: section.schemaVersion,
    internalLabel: section.internalLabel,
    position: section.position,
    data: section.data,
    settings: section.settings,
    isEnabled: section.isEnabled,
  };
}

function pageToListItem(page: PageDocument, locale: string): PageListItem {
  const translation =
    page.translations[locale] ??
    page.translations.de ??
    Object.values(page.translations)[0] ??
    {};
  return {
    id: page._id.toString(),
    internalName: page.internalName,
    status: page.status,
    templateKey: page.templateKey,
    isHomepage: page.isHomepage,
    title: translation.title ?? page.internalName,
    slug: translation.slug ?? "",
    updatedAt: page.updatedAt.toISOString(),
    publishedAt: page.publishedAt ? page.publishedAt.toISOString() : null,
  };
}

@Controller("v1/admin/pages")
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly sectionsService: SectionsService,
    private readonly revisionsService: RevisionsService,
    private readonly revalidation: RevalidationService,
    private readonly auditService: AuditService,
  ) {}

  private auditMeta(request: Request) {
    return {
      ipAddress: request.ip ?? null,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? request.headers["user-agent"]
          : null,
    };
  }

  private async detail(
    siteId: string,
    page: PageDocument,
  ): Promise<PageDetail> {
    const sections = await this.pagesService.getSections(
      siteId,
      page._id.toString(),
    );
    return {
      id: page._id.toString(),
      internalName: page.internalName,
      templateKey: page.templateKey,
      status: page.status,
      isHomepage: page.isHomepage,
      translations: page.translations,
      sections: sections.map(sectionToResponse),
      publishedAt: page.publishedAt ? page.publishedAt.toISOString() : null,
      scheduledPublishAt: page.scheduledPublishAt
        ? page.scheduledPublishAt.toISOString()
        : null,
      updatedAt: page.updatedAt.toISOString(),
    };
  }

  @Get()
  @RequirePermission("pages.read")
  async list(
    @ActiveSiteId() siteId: string,
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("locale") localeRaw?: string,
    @Query("page") pageRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const locale = resolveContentLocale(localeRaw);
    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(limitRaw ?? "20", 10) || 20),
    );
    const { items, total } = await this.pagesService.list(siteId, {
      status,
      search,
      locale,
      page,
      limit,
    });
    return {
      data: items.map((item) => pageToListItem(item, locale)),
      meta: { total, page, limit },
    };
  }

  @Post()
  @RequirePermission("pages.create")
  async create(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CreatePageDto,
    @Req() request: Request,
  ): Promise<PageDetail> {
    const page = await this.pagesService.create(
      siteId,
      auth.user._id.toString(),
      dto,
    );
    await this.auditService.log({
      action: "PAGE_CREATED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Page",
      entityId: page._id.toString(),
      ...this.auditMeta(request),
    });
    return this.detail(siteId, page);
  }

  @Get(":id")
  @RequirePermission("pages.read")
  async getOne(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<PageDetail> {
    const page = await this.pagesService.getOwned(siteId, id);
    return this.detail(siteId, page);
  }

  @Patch(":id")
  @RequirePermission("pages.update")
  async update(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("id") id: string,
    @Body() dto: UpdatePageDto,
  ): Promise<PageDetail> {
    const page = await this.pagesService.update(
      siteId,
      auth.user._id.toString(),
      id,
      dto,
    );
    return this.detail(siteId, page);
  }

  @Post(":id/duplicate")
  @RequirePermission("pages.create")
  async duplicate(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("id") id: string,
  ): Promise<PageDetail> {
    const page = await this.pagesService.duplicate(
      siteId,
      auth.user._id.toString(),
      id,
    );
    return this.detail(siteId, page);
  }

  @Delete(":id")
  @RequirePermission("pages.delete")
  async remove(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("id") id: string,
    @Req() request: Request,
  ): Promise<{ deleted: boolean }> {
    await this.pagesService.remove(siteId, id);
    await this.auditService.log({
      action: "PAGE_DELETED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Page",
      entityId: id,
      ...this.auditMeta(request),
    });
    return { deleted: true };
  }

  // --- Sektionen ---

  @Post(":id/sections")
  @RequirePermission("pages.update")
  async addSection(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: AddSectionDto,
  ): Promise<ContentSectionResponse> {
    await this.pagesService.getOwned(siteId, id);
    const section = await this.sectionsService.add(siteId, "PAGE", id, dto);
    return sectionToResponse(section);
  }

  @Patch(":id/sections/:sectionId")
  @RequirePermission("pages.update")
  async updateSection(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Param("sectionId") sectionId: string,
    @Body() dto: UpdateSectionDto,
  ): Promise<ContentSectionResponse> {
    const section = await this.sectionsService.update(
      siteId,
      "PAGE",
      id,
      sectionId,
      dto,
    );
    return sectionToResponse(section);
  }

  @Post(":id/sections/:sectionId/duplicate")
  @RequirePermission("pages.update")
  async duplicateSection(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Param("sectionId") sectionId: string,
  ): Promise<ContentSectionResponse> {
    const section = await this.sectionsService.duplicate(
      siteId,
      "PAGE",
      id,
      sectionId,
    );
    return sectionToResponse(section);
  }

  @Delete(":id/sections/:sectionId")
  @RequirePermission("pages.update")
  async removeSection(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Param("sectionId") sectionId: string,
  ): Promise<{ deleted: boolean }> {
    await this.sectionsService.remove(siteId, "PAGE", id, sectionId);
    return { deleted: true };
  }

  @Post(":id/reorder-sections")
  @RequirePermission("pages.update")
  async reorderSections(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: ReorderSectionsDto,
  ): Promise<{ reordered: boolean }> {
    await this.sectionsService.reorder(siteId, "PAGE", id, dto.orderedIds);
    return { reordered: true };
  }

  // --- Workflow / Revisionen / Vorschau ---

  @Post(":id/workflow")
  @RequirePermission("pages.update")
  async workflow(
    @Param("id") id: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: WorkflowActionDto,
    @Req() request: RequestWithAuth,
  ): Promise<PageDetail> {
    const siteId = resolveActiveSiteId(request);

    // Zusaetzliche, aktionsspezifische Berechtigung serverseitig pruefen.
    const required = ACTION_PERMISSION[dto.action];
    const siteGranted = auth.permissionsBySite[siteId] ?? [];
    const allowed =
      hasPermission(auth.globalPermissions, required) ||
      hasPermission(siteGranted, required);
    if (!allowed) {
      throw new ForbiddenException(
        `Keine Berechtigung fuer Aktion "${dto.action}".`,
      );
    }

    const { page, revalidateTags } = await this.pagesService.runWorkflow(
      siteId,
      auth.user._id.toString(),
      id,
      dto.action,
      { scheduledAt: dto.scheduledAt, changeSummary: dto.changeSummary },
    );

    await this.auditService.log({
      action: `PAGE_${dto.action.toUpperCase()}`,
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Page",
      entityId: id,
      after: { status: page.status },
      ...this.auditMeta(request),
    });

    if (revalidateTags.length > 0) {
      await this.revalidation.revalidate(siteId, revalidateTags);
    }
    return this.detail(siteId, page);
  }

  @Post(":id/preview-token")
  @RequirePermission("pages.read")
  async previewToken(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ token: string }> {
    await this.pagesService.getOwned(siteId, id);
    return { token: createPreviewToken(id) };
  }

  @Get(":id/revisions")
  @RequirePermission("revisions.read")
  async revisions(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<RevisionSummary[]> {
    await this.pagesService.getOwned(siteId, id);
    const revisions = await this.revisionsService.list("PAGE", id);
    return revisions.map((revision) => ({
      id: revision._id.toString(),
      version: revision.version,
      changeSummary: revision.changeSummary,
      isPublishedSnapshot: revision.isPublishedSnapshot,
      createdAt: revision.createdAt.toISOString(),
    }));
  }
}
