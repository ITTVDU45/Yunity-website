import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import type {
  SubmissionDetail,
  SubmissionListItem,
} from "@yunity/contracts";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import { ActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import { UpdateSubmissionDto } from "./dto";
import { SubmissionsService } from "./submissions.service";
import type { FormSubmissionDocument } from "./schemas/form-submission.schema";

function toListItem(s: FormSubmissionDocument): SubmissionListItem {
  return {
    id: s._id.toString(),
    status: s.status,
    data: s.data,
    createdAt: s.createdAt.toISOString(),
  };
}

function toDetail(s: FormSubmissionDocument): SubmissionDetail {
  return {
    id: s._id.toString(),
    formId: s.formId.toString(),
    status: s.status,
    notes: s.notes,
    data: s.data,
    locale: s.locale,
    pageUrl: s.pageUrl,
    createdAt: s.createdAt.toISOString(),
  };
}

@Controller("v1/admin/submissions")
export class SubmissionsController {
  constructor(
    private readonly submissions: SubmissionsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @RequirePermission("forms.submissions.read")
  async list(
    @ActiveSiteId() siteId: string,
    @Query("formId") formId?: string,
    @Query("status") status?: string,
    @Query("page") pageRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(limitRaw ?? "25", 10) || 25),
    );
    const { items, total } = await this.submissions.list(siteId, {
      formId,
      status,
      page,
      limit,
    });
    return { data: items.map(toListItem), meta: { total, page, limit } };
  }

  @Get("export")
  @RequirePermission("forms.submissions.export")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", 'attachment; filename="submissions.csv"')
  async export(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Query("formId") formId: string,
    @Req() request: Request,
  ): Promise<string> {
    await this.auditService.log({
      action: "FORM_SUBMISSIONS_EXPORTED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Form",
      entityId: formId,
      ipAddress: request.ip ?? null,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? request.headers["user-agent"]
          : null,
    });
    return this.submissions.exportCsv(siteId, formId);
  }

  @Get(":id")
  @RequirePermission("forms.submissions.read")
  async getOne(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<SubmissionDetail> {
    return toDetail(await this.submissions.get(siteId, id));
  }

  @Patch(":id")
  @RequirePermission("forms.submissions.manage")
  async update(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: UpdateSubmissionDto,
  ): Promise<SubmissionDetail> {
    return toDetail(await this.submissions.update(siteId, id, dto));
  }

  @Delete(":id")
  @RequirePermission("forms.submissions.manage")
  async remove(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ deleted: boolean }> {
    await this.submissions.remove(siteId, id);
    return { deleted: true };
  }
}
