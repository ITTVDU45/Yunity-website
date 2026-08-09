import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import type {
  FormDetail,
  FormFieldDef,
  FormListItem,
} from "@yunity/contracts";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import { ActiveSiteId } from "../../common/site-context";
import type { AuthContext } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import {
  AddFieldDto,
  CreateFormDto,
  ReorderFieldsDto,
  UpdateFieldDto,
  UpdateFormDto,
} from "./dto";
import { FormsService } from "./forms.service";
import type { FormDocument } from "./schemas/form.schema";

function toFieldDef(field: FormDocument["fields"][number]): FormFieldDef {
  return {
    id: field._id?.toString() ?? "",
    type: field.type,
    name: field.name,
    required: field.required,
    width: field.width,
    position: field.position,
    isEnabled: field.isEnabled,
    validation: field.validation,
    conditions: field.conditions,
    settings: field.settings,
    translations: field.translations,
    options: field.options.map((option) => ({
      id: option._id?.toString() ?? "",
      value: option.value,
      position: option.position,
      isEnabled: option.isEnabled,
      translations: option.translations,
    })),
  };
}

function toDetail(form: FormDocument): FormDetail {
  return {
    id: form._id.toString(),
    key: form.key,
    name: form.name,
    status: form.status,
    successAction: form.successAction,
    redirectUrl: form.redirectUrl,
    notificationSettings: form.notificationSettings,
    spamSettings: form.spamSettings,
    retentionDays: form.retentionDays,
    translations: form.translations,
    fields: [...form.fields]
      .sort((a, b) => a.position - b.position)
      .map(toFieldDef),
    updatedAt: form.updatedAt.toISOString(),
  };
}

@Controller("v1/admin/forms")
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly auditService: AuditService,
  ) {}

  private meta(request: Request) {
    return {
      ipAddress: request.ip ?? null,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? request.headers["user-agent"]
          : null,
    };
  }

  @Get()
  @RequirePermission("forms.read")
  async list(@ActiveSiteId() siteId: string): Promise<FormListItem[]> {
    const forms = await this.formsService.list(siteId);
    return Promise.all(
      forms.map(async (form) => ({
        id: form._id.toString(),
        key: form.key,
        name: form.name,
        status: form.status,
        fieldCount: form.fields.length,
        submissionCount: await this.formsService.countSubmissions(
          form._id.toString(),
        ),
        updatedAt: form.updatedAt.toISOString(),
      })),
    );
  }

  @Post()
  @RequirePermission("forms.manage")
  async create(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: CreateFormDto,
    @Req() request: Request,
  ): Promise<FormDetail> {
    const form = await this.formsService.create(siteId, dto);
    await this.auditService.log({
      action: "FORM_CREATED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "Form",
      entityId: form._id.toString(),
      ...this.meta(request),
    });
    return toDetail(form);
  }

  @Get(":id")
  @RequirePermission("forms.read")
  async getOne(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<FormDetail> {
    return toDetail(await this.formsService.getOwned(siteId, id));
  }

  @Patch(":id")
  @RequirePermission("forms.manage")
  async update(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFormDto,
  ): Promise<FormDetail> {
    return toDetail(await this.formsService.update(siteId, id, dto));
  }

  @Delete(":id")
  @RequirePermission("forms.manage")
  async remove(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ deleted: boolean }> {
    await this.formsService.remove(siteId, id);
    return { deleted: true };
  }

  @Post(":id/fields")
  @RequirePermission("forms.manage")
  async addField(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: AddFieldDto,
  ): Promise<FormDetail> {
    return toDetail(await this.formsService.addField(siteId, id, dto));
  }

  @Patch(":id/fields/:fieldId")
  @RequirePermission("forms.manage")
  async updateField(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Param("fieldId") fieldId: string,
    @Body() dto: UpdateFieldDto,
  ): Promise<FormDetail> {
    return toDetail(
      await this.formsService.updateField(siteId, id, fieldId, dto),
    );
  }

  @Delete(":id/fields/:fieldId")
  @RequirePermission("forms.manage")
  async removeField(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Param("fieldId") fieldId: string,
  ): Promise<FormDetail> {
    return toDetail(await this.formsService.removeField(siteId, id, fieldId));
  }

  @Post(":id/reorder-fields")
  @RequirePermission("forms.manage")
  async reorderFields(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: ReorderFieldsDto,
  ): Promise<FormDetail> {
    return toDetail(
      await this.formsService.reorderFields(siteId, id, dto.orderedIds),
    );
  }
}
