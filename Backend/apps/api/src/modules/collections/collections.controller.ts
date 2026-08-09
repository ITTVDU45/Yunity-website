import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { hasPermission } from "@yunity/permissions";
import type {
  CollectionDetail,
  CollectionListItem,
  ContentSectionResponse,
  RevisionSummary,
} from "@yunity/contracts";
import { CurrentAuth } from "../../common/decorators";
import { ActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import {
  AddSectionDto,
  ReorderSectionsDto,
  UpdateSectionDto,
} from "../pages/dto";
import { RevisionsService } from "../pages/revisions.service";
import { SectionsService } from "../pages/sections.service";
import { RevalidationService } from "../pages/revalidation.service";
import type { WorkflowAction } from "../pages/publishing/workflow";
import type { ContentSectionDocument } from "../pages/schemas/content-section.schema";
import { CollectionsService } from "./collections.service";
import type { CollectionItemDocument } from "./collection-item.schema";
import { KIND_CONFIG, isCollectionKind, permissionFor } from "./kinds";
import type { CollectionKind } from "./collection-item.schema";
import {
  CollectionWorkflowDto,
  CreateCollectionDto,
  ReorderDto,
  UpdateCollectionDto,
} from "./dto";
import { resolveContentLocale } from "../../common/locales";

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

/** Aktion → benoetigtes Recht (kind-spezifisch bzw. Review). */
function actionPermission(
  kind: CollectionKind,
  action: WorkflowAction,
): string {
  if (action === "publish" || action === "unpublish" || action === "schedule") {
    return permissionFor(kind, "publish");
  }
  if (action === "approve" || action === "reject") {
    return "content.review";
  }
  return permissionFor(kind, "manage");
}

@Controller("v1/admin/collections/:kind")
export class CollectionsController {
  constructor(
    private readonly collections: CollectionsService,
    private readonly sectionsService: SectionsService,
    private readonly revisionsService: RevisionsService,
    private readonly revalidation: RevalidationService,
    private readonly auditService: AuditService,
  ) {}

  private resolveKind(raw: string): CollectionKind {
    if (!isCollectionKind(raw)) {
      throw new NotFoundException(`Unbekannte Collection-Art "${raw}".`);
    }
    return raw;
  }

  private assertPermission(
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

  private auditMeta(request: Request) {
    return {
      ipAddress: request.ip ?? null,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? request.headers["user-agent"]
          : null,
    };
  }

  private toListItem(
    item: CollectionItemDocument,
    imageUrl: string | null,
    locale: string,
  ): CollectionListItem {
    const t =
      item.translations[locale] ??
      item.translations.de ??
      Object.values(item.translations)[0] ??
      {};
    return {
      id: item._id.toString(),
      kind: item.kind,
      status: item.status,
      title: t.title ?? "(ohne Titel)",
      slug: t.slug ?? "",
      featured: item.featured,
      position: item.position,
      imageUrl,
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  private async toDetail(
    siteId: string,
    kind: CollectionKind,
    item: CollectionItemDocument,
  ): Promise<CollectionDetail> {
    const [sections, imageUrl] = await Promise.all([
      this.collections.getSections(siteId, kind, item._id.toString()),
      this.collections.imageUrl(siteId, item),
    ]);
    return {
      id: item._id.toString(),
      kind: item.kind,
      status: item.status,
      featured: item.featured,
      icon: item.icon,
      imageId: item.imageId ? item.imageId.toString() : null,
      imageUrl,
      translations: item.translations,
      attributes: item.attributes,
      relations: item.relations,
      sections: sections.map(sectionToResponse),
      publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  @Get()
  async list(
    @Param("kind") kindRaw: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("locale") localeRaw?: string,
    @Query("page") pageRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const locale = resolveContentLocale(localeRaw);
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "read"));
    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(limitRaw ?? "50", 10) || 50),
    );
    const { items, total } = await this.collections.list(siteId, kind, {
      status,
      search,
      locale,
      page,
      limit,
    });
    const urls = await Promise.all(
      items.map((item) => this.collections.imageUrl(siteId, item)),
    );
    return {
      data: items.map((item, i) => this.toListItem(item, urls[i], locale)),
      meta: { total, page, limit },
    };
  }

  @Post()
  async create(
    @Param("kind") kindRaw: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CreateCollectionDto,
    @Req() request: Request,
  ): Promise<CollectionDetail> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    const item = await this.collections.create(
      siteId,
      kind,
      auth.user._id.toString(),
      dto,
    );
    await this.auditService.log({
      action: `${KIND_CONFIG[kind].entityType}_CREATED`,
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: KIND_CONFIG[kind].entityType,
      entityId: item._id.toString(),
      ...this.auditMeta(request),
    });
    return this.toDetail(siteId, kind, item);
  }

  @Post("reorder")
  async reorder(
    @Param("kind") kindRaw: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: ReorderDto,
  ): Promise<{ reordered: boolean }> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    await this.collections.reorder(siteId, kind, dto.orderedIds);
    return { reordered: true };
  }

  @Get(":id")
  async getOne(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
  ): Promise<CollectionDetail> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "read"));
    const item = await this.collections.getOwned(siteId, kind, id);
    return this.toDetail(siteId, kind, item);
  }

  @Patch(":id")
  async update(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: UpdateCollectionDto,
  ): Promise<CollectionDetail> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    const item = await this.collections.update(
      siteId,
      kind,
      auth.user._id.toString(),
      id,
      dto,
    );
    return this.toDetail(siteId, kind, item);
  }

  @Delete(":id")
  async remove(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Req() request: Request,
  ): Promise<{ deleted: boolean }> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    await this.collections.remove(siteId, kind, id);
    await this.auditService.log({
      action: `${KIND_CONFIG[kind].entityType}_DELETED`,
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: KIND_CONFIG[kind].entityType,
      entityId: id,
      ...this.auditMeta(request),
    });
    return { deleted: true };
  }

  // --- Sektionen der Detailseite ---

  @Post(":id/sections")
  async addSection(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: AddSectionDto,
  ): Promise<ContentSectionResponse> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    await this.collections.getOwned(siteId, kind, id);
    const section = await this.sectionsService.add(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
      dto,
    );
    return sectionToResponse(section);
  }

  @Patch(":id/sections/:sectionId")
  async updateSection(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @Param("sectionId") sectionId: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: UpdateSectionDto,
  ): Promise<ContentSectionResponse> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    const section = await this.sectionsService.update(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
      sectionId,
      dto,
    );
    return sectionToResponse(section);
  }

  @Delete(":id/sections/:sectionId")
  async removeSection(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @Param("sectionId") sectionId: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
  ): Promise<{ deleted: boolean }> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    await this.sectionsService.remove(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
      sectionId,
    );
    return { deleted: true };
  }

  @Post(":id/reorder-sections")
  async reorderSections(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: ReorderSectionsDto,
  ): Promise<{ reordered: boolean }> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, permissionFor(kind, "manage"));
    await this.sectionsService.reorder(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
      dto.orderedIds,
    );
    return { reordered: true };
  }

  // --- Workflow / Revisionen ---

  @Post(":id/workflow")
  async workflow(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CollectionWorkflowDto,
    @Req() request: Request,
  ): Promise<CollectionDetail> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, actionPermission(kind, dto.action));
    const { item, revalidateTags } = await this.collections.runWorkflow(
      siteId,
      kind,
      auth.user._id.toString(),
      id,
      dto.action,
    );
    await this.auditService.log({
      action: `${KIND_CONFIG[kind].entityType}_${dto.action.toUpperCase()}`,
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: KIND_CONFIG[kind].entityType,
      entityId: id,
      after: { status: item.status },
      ...this.auditMeta(request),
    });
    if (revalidateTags.length > 0) {
      await this.revalidation.revalidate(siteId, revalidateTags);
    }
    return this.toDetail(siteId, kind, item);
  }

  @Get(":id/revisions")
  async revisions(
    @Param("kind") kindRaw: string,
    @Param("id") id: string,
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
  ): Promise<RevisionSummary[]> {
    const kind = this.resolveKind(kindRaw);
    this.assertPermission(auth, siteId, "revisions.read");
    await this.collections.getOwned(siteId, kind, id);
    const revisions = await this.revisionsService.list(
      KIND_CONFIG[kind].entityType,
      id,
    );
    return revisions.map((revision) => ({
      id: revision._id.toString(),
      version: revision.version,
      changeSummary: revision.changeSummary,
      isPublishedSnapshot: revision.isPublishedSnapshot,
      createdAt: revision.createdAt.toISOString(),
    }));
  }
}
