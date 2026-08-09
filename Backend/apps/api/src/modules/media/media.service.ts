import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Readable } from "node:stream";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { stripUndefined } from "@yunity/utilities";
import { escapeRegex } from "../../common/regex";
import { StorageService } from "../storage/storage.service";
import {
  magicBytesMatchMime,
  validateUpload,
} from "../storage/upload-validation";
import {
  MediaAsset,
  type MediaAssetDocument,
} from "./media-asset.schema";
import { MediaFolder, type MediaFolderDocument } from "./media-folder.schema";
import type { CreateFolderDto, PresignUploadDto, UpdateMediaDto } from "./dto";

const MAGIC_BYTES_LENGTH = 16;

export interface MediaUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface OpenMediaFile {
  asset: MediaAssetDocument;
  stream: Readable;
}

export interface MediaListQuery {
  folderId?: string | null;
  search?: string;
  mimePrefix?: string;
  page: number;
  limit: number;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaAsset.name)
    private readonly assetModel: Model<MediaAsset>,
    @InjectModel(MediaFolder.name)
    private readonly folderModel: Model<MediaFolder>,
    private readonly storage: StorageService,
  ) {}

  // --- Ordner ---

  async listFolders(siteId: string): Promise<MediaFolderDocument[]> {
    return this.folderModel
      .find({ siteId, deletedAt: null })
      .sort({ position: 1, name: 1 })
      .exec();
  }

  async createFolder(
    siteId: string,
    dto: CreateFolderDto,
  ): Promise<MediaFolderDocument> {
    return this.folderModel.create({
      siteId: new Types.ObjectId(siteId),
      name: dto.name,
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
    });
  }

  // --- Upload-Flow ---

  /**
   * Proxy-Upload fuer den Admin: validiert den Inhalt vor dem Schreiben und
   * haelt die Storage-Zugangsdaten sowie Bucket-URLs vollstaendig serverseitig.
   */
  async upload(
    siteId: string,
    userId: string,
    file: MediaUploadFile,
    folderId?: string,
  ): Promise<MediaAssetDocument> {
    const validationError = validateUpload({
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
    if (validationError) {
      throw new BadRequestException(validationError.message);
    }
    if (
      !magicBytesMatchMime(
        file.buffer.subarray(0, MAGIC_BYTES_LENGTH),
        file.mimetype,
      )
    ) {
      throw new BadRequestException(
        "Dateiinhalt passt nicht zum angegebenen Dateityp.",
      );
    }

    if (folderId) {
      const folderExists = await this.folderModel.exists({
        _id: folderId,
        siteId,
        deletedAt: null,
      });
      if (!folderExists) {
        throw new BadRequestException("Medienordner wurde nicht gefunden.");
      }
    }

    const storageKey = this.storage.buildStorageKey(siteId, file.originalname);
    const asset = (await this.assetModel.create({
      siteId: new Types.ObjectId(siteId),
      folderId: folderId ? new Types.ObjectId(folderId) : null,
      storageProvider: "s3",
      storageKey,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      status: "PROCESSING",
      uploadedBy: new Types.ObjectId(userId),
      translations: {},
    })) as MediaAssetDocument;

    try {
      await this.storage.putObject(storageKey, file.buffer, file.mimetype);
      const stat = await this.storage.statObject(storageKey);
      if (!stat || stat.size !== file.size) {
        throw new Error("Gespeicherte Dateigroesse stimmt nicht ueberein.");
      }
      asset.fileSize = stat.size;
      asset.status = "READY";
      await asset.save();
      return asset;
    } catch (error: unknown) {
      await this.discard(asset);
      throw error;
    }
  }

  /** Schritt 1: validieren, PROCESSING-Asset anlegen, Presigned-PUT liefern. */
  async presignUpload(
    siteId: string,
    userId: string,
    dto: PresignUploadDto,
  ): Promise<{ assetId: string; uploadUrl: string; storageKey: string }> {
    const validationError = validateUpload({
      filename: dto.filename,
      mimeType: dto.mimeType,
      size: dto.size,
    });
    if (validationError) {
      throw new BadRequestException(validationError.message);
    }

    const storageKey = this.storage.buildStorageKey(siteId, dto.filename);
    const asset = await this.assetModel.create({
      siteId: new Types.ObjectId(siteId),
      folderId: dto.folderId ? new Types.ObjectId(dto.folderId) : null,
      storageProvider: "s3",
      storageKey,
      originalFilename: dto.filename,
      mimeType: dto.mimeType,
      fileSize: dto.size,
      status: "PROCESSING",
      uploadedBy: new Types.ObjectId(userId),
      translations: {},
    });

    const uploadUrl = await this.storage.presignUpload(storageKey);
    return { assetId: asset._id.toString(), uploadUrl, storageKey };
  }

  /**
   * Schritt 2: nach dem Direkt-Upload verifizieren, dass das Objekt existiert,
   * die Groesse stimmt und der tatsaechliche Inhalt (Magic Bytes) zum MIME passt.
   * Bei Fehlschlag wird das Objekt entfernt und das Asset verworfen.
   */
  async completeUpload(
    siteId: string,
    assetId: string,
  ): Promise<MediaAssetDocument> {
    const asset = await this.getOwned(siteId, assetId);
    if (asset.status === "READY") {
      return asset;
    }

    const stat = await this.storage.statObject(asset.storageKey);
    if (!stat || stat.size !== asset.fileSize) {
      await this.discard(asset);
      throw new BadRequestException(
        stat
          ? "Hochgeladene Dateigroesse stimmt nicht mit der Freigabe ueberein."
          : "Hochgeladene Datei wurde nicht gefunden.",
      );
    }

    const header = await this.storage.readHeadBytes(
      asset.storageKey,
      MAGIC_BYTES_LENGTH,
    );
    if (!magicBytesMatchMime(header, asset.mimeType)) {
      await this.discard(asset);
      throw new BadRequestException(
        "Dateiinhalt passt nicht zum angegebenen Dateityp.",
      );
    }

    asset.fileSize = stat.size;
    asset.status = "READY";
    await asset.save();
    return asset;
  }

  private async discard(asset: MediaAssetDocument): Promise<void> {
    await this.storage.removeObject(asset.storageKey).catch(() => undefined);
    await this.assetModel.deleteOne({ _id: asset._id });
  }

  // --- Abfragen ---

  async list(
    siteId: string,
    query: MediaListQuery,
  ): Promise<{ items: MediaAssetDocument[]; total: number }> {
    // Nur fertig verarbeitete Medien anzeigen — verwaiste PROCESSING-Assets
    // (Presign ohne abgeschlossenen Upload) bleiben ausgeblendet.
    const filter: Record<string, unknown> = {
      siteId,
      deletedAt: null,
      status: "READY",
    };
    if (query.folderId !== undefined) {
      filter.folderId = query.folderId
        ? new Types.ObjectId(query.folderId)
        : null;
    }
    if (query.search) {
      filter.originalFilename = {
        $regex: escapeRegex(query.search),
        $options: "i",
      };
    }
    if (query.mimePrefix) {
      filter.mimeType = { $regex: `^${escapeRegex(query.mimePrefix, 50)}` };
    }

    const [items, total] = await Promise.all([
      this.assetModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .exec() as Promise<MediaAssetDocument[]>,
      this.assetModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async getOwned(siteId: string, assetId: string): Promise<MediaAssetDocument> {
    if (!Types.ObjectId.isValid(siteId) || !Types.ObjectId.isValid(assetId)) {
      throw new NotFoundException("Medium nicht gefunden.");
    }
    const asset = (await this.assetModel
      .findOne({ _id: assetId, siteId, deletedAt: null })
      .exec()) as MediaAssetDocument | null;
    if (!asset) {
      throw new NotFoundException("Medium nicht gefunden.");
    }
    return asset;
  }

  /** Interne, authentifizierte Vorschau-URL fuer den Admin. */
  previewUrl(asset: MediaAssetDocument): string {
    return `/api/v1/admin/media/${asset._id.toString()}/file`;
  }

  /** Interne Public-URL zu einer veroeffentlichten Asset-Id. */
  async resolveUrl(siteId: string, assetId: string): Promise<string | null> {
    if (!Types.ObjectId.isValid(assetId)) {
      return null;
    }
    const asset = (await this.assetModel
      .findOne({ _id: assetId, siteId, deletedAt: null, status: "READY" })
      .exec()) as MediaAssetDocument | null;
    return asset ? this.publicUrl(siteId, asset._id.toString()) : null;
  }

  /** Batch-Aufloesung mehrerer Asset-Ids -> { assetId: url } (kein N+1). */
  async resolveUrls(
    siteId: string,
    assetIds: readonly string[],
  ): Promise<Record<string, string>> {
    const validIds = assetIds.filter((id) => Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return {};
    }
    const assets = (await this.assetModel
      .find({
        _id: { $in: validIds },
        siteId,
        deletedAt: null,
        status: "READY",
      })
      .exec()) as MediaAssetDocument[];
    return Object.fromEntries(
      assets.map((asset) => [
        asset._id.toString(),
        this.publicUrl(siteId, asset._id.toString()),
      ]),
    );
  }

  async openReadyFile(siteId: string, assetId: string): Promise<OpenMediaFile> {
    const asset = await this.getOwned(siteId, assetId);
    if (asset.status !== "READY") {
      throw new NotFoundException("Medium nicht gefunden.");
    }
    const object = await this.storage.statObject(asset.storageKey);
    if (!object) {
      throw new NotFoundException("Mediendatei nicht gefunden.");
    }
    return {
      asset,
      stream: await this.storage.getObject(asset.storageKey),
    };
  }

  private publicUrl(siteId: string, assetId: string): string {
    return `/api/v1/public/media/${siteId}/${assetId}`;
  }

  // --- Aenderungen ---

  async update(
    siteId: string,
    assetId: string,
    dto: UpdateMediaDto,
  ): Promise<MediaAssetDocument> {
    const asset = await this.getOwned(siteId, assetId);

    if (dto.locale && dto.translation) {
      // undefined-Felder entfernen, damit ein Teil-Update bestehende
      // Metadaten (Titel, Alt-Text …) nicht ueberschreibt.
      const incoming = stripUndefined(
        dto.translation as Record<string, unknown>,
      );
      asset.translations = {
        ...asset.translations,
        [dto.locale]: { ...asset.translations[dto.locale], ...incoming },
      };
      asset.markModified("translations");
    }
    if (dto.focalPointX !== undefined) {
      asset.focalPointX = dto.focalPointX;
    }
    if (dto.focalPointY !== undefined) {
      asset.focalPointY = dto.focalPointY;
    }
    await asset.save();
    return asset;
  }

  async archive(siteId: string, assetId: string): Promise<void> {
    const asset = await this.getOwned(siteId, assetId);
    asset.status = "ARCHIVED";
    await asset.save();
  }

  /**
   * Endgueltiges Loeschen inkl. Objekt im Storage.
   * Phase 4+: vorher Verwendungsnachweis pruefen (Sections/Entitaeten).
   */
  async remove(siteId: string, assetId: string): Promise<void> {
    const asset = await this.getOwned(siteId, assetId);
    await this.storage.removeObject(asset.storageKey).catch(() => undefined);
    asset.deletedAt = new Date();
    await asset.save();
  }

  async countReady(siteId: string): Promise<number> {
    return this.assetModel.countDocuments({
      siteId,
      status: "READY",
      deletedAt: null,
    });
  }
}
