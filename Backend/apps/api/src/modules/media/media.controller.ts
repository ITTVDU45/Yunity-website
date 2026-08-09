import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import type {
  MediaAssetResponse,
  MediaFolderResponse,
  PresignUploadResponse,
} from "@yunity/contracts";
import { ActiveSiteId } from "../../common/site-context";
import { CurrentAuth, RequirePermission } from "../../common/decorators";
import type { AuthContext } from "../../common/request-context";
import { AuditService } from "../audit/audit.service";
import {
  CreateFolderDto,
  PresignUploadDto,
  UpdateMediaDto,
  UploadMediaDto,
} from "./dto";
import type { MediaAssetDocument } from "./media-asset.schema";
import type { MediaFolderDocument } from "./media-folder.schema";
import { MediaService, type MediaUploadFile } from "./media.service";
import { streamMediaFile } from "./media-stream";
import { MAX_UPLOAD_BYTES } from "../storage/upload-validation";

function auditMeta(request: { ip?: string; headers: Record<string, unknown> }) {
  return {
    ipAddress: request.ip ?? null,
    userAgent:
      typeof request.headers["user-agent"] === "string"
        ? (request.headers["user-agent"] as string)
        : null,
  };
}

@Controller("v1/admin/media")
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly auditService: AuditService,
  ) {}

  private async toResponse(
    asset: MediaAssetDocument,
  ): Promise<MediaAssetResponse> {
    return {
      id: asset._id.toString(),
      folderId: asset.folderId ? asset.folderId.toString() : null,
      originalFilename: asset.originalFilename,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
      focalPointX: asset.focalPointX,
      focalPointY: asset.focalPointY,
      status: asset.status,
      translations: asset.translations,
      url:
        asset.status === "READY"
          ? this.mediaService.previewUrl(asset)
          : "",
      createdAt: asset.createdAt.toISOString(),
    };
  }

  @Get("folders")
  @RequirePermission("media.read")
  async listFolders(
    @ActiveSiteId() siteId: string,
  ): Promise<MediaFolderResponse[]> {
    const folders = await this.mediaService.listFolders(siteId);
    return folders.map((folder: MediaFolderDocument) => ({
      id: folder._id.toString(),
      name: folder.name,
      parentId: folder.parentId ? folder.parentId.toString() : null,
      position: folder.position,
    }));
  }

  @Post("folders")
  @RequirePermission("media.manage")
  async createFolder(
    @ActiveSiteId() siteId: string,
    @Body() dto: CreateFolderDto,
  ): Promise<MediaFolderResponse> {
    const folder = await this.mediaService.createFolder(siteId, dto);
    return {
      id: folder._id.toString(),
      name: folder.name,
      parentId: folder.parentId ? folder.parentId.toString() : null,
      position: folder.position,
    };
  }

  @Get()
  @RequirePermission("media.read")
  async list(
    @ActiveSiteId() siteId: string,
    @Query("folderId") folderId?: string,
    @Query("search") search?: string,
    @Query("type") type?: string,
    @Query("page") pageRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const limit = Math.min(
      60,
      Math.max(1, Number.parseInt(limitRaw ?? "24", 10) || 24),
    );
    const { items, total } = await this.mediaService.list(siteId, {
      folderId: folderId === undefined ? undefined : folderId || null,
      search,
      mimePrefix: type,
      page,
      limit,
    });
    const data = await Promise.all(items.map((item) => this.toResponse(item)));
    return { data, meta: { total, page, limit } };
  }

  @Get(":id")
  @RequirePermission("media.read")
  async getOne(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<MediaAssetResponse> {
    const asset = await this.mediaService.getOwned(siteId, id);
    return this.toResponse(asset);
  }

  @Post("presign")
  @RequirePermission("media.manage")
  async presign(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Body() dto: PresignUploadDto,
  ): Promise<PresignUploadResponse> {
    return this.mediaService.presignUpload(siteId, auth.user._id.toString(), dto);
  }

  @Post("upload")
  @RequirePermission("media.manage")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: MAX_UPLOAD_BYTES,
        files: 1,
        fields: 4,
      },
    }),
  )
  async upload(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @UploadedFile() file: MediaUploadFile | undefined,
    @Body() dto: UploadMediaDto,
    @Req() request: { ip?: string; headers: Record<string, unknown> },
  ): Promise<MediaAssetResponse> {
    if (!file) {
      throw new BadRequestException("Keine Datei uebermittelt.");
    }
    const asset = await this.mediaService.upload(
      siteId,
      auth.user._id.toString(),
      file,
      dto.folderId,
    );
    await this.auditService.log({
      action: "MEDIA_UPLOADED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "MediaAsset",
      entityId: asset._id.toString(),
      ...auditMeta(request),
    });
    return this.toResponse(asset);
  }

  @Get(":id/file")
  @RequirePermission("media.read")
  async file(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.mediaService.openReadyFile(siteId, id);
    await streamMediaFile(response, file, "private, max-age=300");
  }

  @Post(":id/complete")
  @RequirePermission("media.manage")
  async complete(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("id") id: string,
    @Req() request: { ip?: string; headers: Record<string, unknown> },
  ): Promise<MediaAssetResponse> {
    const asset = await this.mediaService.completeUpload(siteId, id);
    await this.auditService.log({
      action: "MEDIA_UPLOADED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "MediaAsset",
      entityId: id,
      ...auditMeta(request),
    });
    return this.toResponse(asset);
  }

  @Patch(":id")
  @RequirePermission("media.manage")
  async update(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: UpdateMediaDto,
  ): Promise<MediaAssetResponse> {
    const asset = await this.mediaService.update(siteId, id, dto);
    return this.toResponse(asset);
  }

  @Post(":id/archive")
  @RequirePermission("media.manage")
  async archive(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<{ archived: boolean }> {
    await this.mediaService.archive(siteId, id);
    return { archived: true };
  }

  @Delete(":id")
  @RequirePermission("media.deletePermanent")
  async remove(
    @ActiveSiteId() siteId: string,
    @CurrentAuth() auth: AuthContext,
    @Param("id") id: string,
    @Req() request: { ip?: string; headers: Record<string, unknown> },
  ): Promise<{ deleted: boolean }> {
    await this.mediaService.remove(siteId, id);
    await this.auditService.log({
      action: "MEDIA_DELETED",
      siteId,
      userId: auth.user._id.toString(),
      userEmail: auth.user.email,
      entityType: "MediaAsset",
      entityId: id,
      ...auditMeta(request),
    });
    return { deleted: true };
  }
}
