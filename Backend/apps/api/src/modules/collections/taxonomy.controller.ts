import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import type { TaxonomyResponse } from "@yunity/contracts";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import { ActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import { TaxonomyService } from "./taxonomy.service";
import type {
  CompetencyDocument,
  TeamCategoryDocument,
} from "./taxonomy.schema";
import { TaxonomyDto } from "./dto";

function toResponse(
  doc: CompetencyDocument | TeamCategoryDocument,
): TaxonomyResponse {
  return {
    id: doc._id.toString(),
    position: doc.position,
    translations: doc.translations,
  };
}

@Controller("v1/admin/competencies")
export class CompetenciesController {
  constructor(private readonly service: TaxonomyService) {}

  @Get()
  @RequirePermission("competencies.read")
  async list(@ActiveSiteId() siteId: string): Promise<TaxonomyResponse[]> {
    const docs = await this.service.listCompetencies(siteId);
    return docs.map(toResponse);
  }

  @Post()
  @RequirePermission("competencies.manage")
  async create(
    @ActiveSiteId() siteId: string,
    @Body() dto: TaxonomyDto,
  ): Promise<TaxonomyResponse> {
    const doc = await this.service.createCompetency(
      siteId,
      dto.locale ?? "de",
      dto.title,
    );
    return toResponse(doc);
  }

  @Patch(":id")
  @RequirePermission("competencies.manage")
  async update(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: TaxonomyDto,
  ): Promise<TaxonomyResponse> {
    const doc = await this.service.updateCompetency(
      siteId,
      id,
      dto.locale ?? "de",
      dto.title,
    );
    return toResponse(doc);
  }

  @Delete(":id")
  @RequirePermission("competencies.manage")
  async remove(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ deleted: boolean }> {
    await this.service.removeCompetency(siteId, id);
    return { deleted: true };
  }
}

@Controller("v1/admin/team-categories")
export class TeamCategoriesController {
  constructor(private readonly service: TaxonomyService) {}

  @Get()
  @RequirePermission("competencies.read")
  async list(@ActiveSiteId() siteId: string): Promise<TaxonomyResponse[]> {
    const docs = await this.service.listCategories(siteId);
    return docs.map(toResponse);
  }

  @Post()
  @RequirePermission("competencies.manage")
  async create(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() _auth: AuthContext,
    @Body() dto: TaxonomyDto,
  ): Promise<TaxonomyResponse> {
    const doc = await this.service.createCategory(
      siteId,
      dto.locale ?? "de",
      dto.title,
      dto.description,
    );
    return toResponse(doc);
  }

  @Patch(":id")
  @RequirePermission("competencies.manage")
  async update(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: TaxonomyDto,
  ): Promise<TaxonomyResponse> {
    const doc = await this.service.updateCategory(
      siteId,
      id,
      dto.locale ?? "de",
      dto.title,
      dto.description,
    );
    return toResponse(doc);
  }

  @Delete(":id")
  @RequirePermission("competencies.manage")
  async remove(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ deleted: boolean }> {
    await this.service.removeCategory(siteId, id);
    return { deleted: true };
  }
}
