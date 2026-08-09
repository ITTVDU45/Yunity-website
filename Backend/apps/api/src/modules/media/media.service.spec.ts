import { Types } from "mongoose";
import type { Model } from "mongoose";
import type { MediaAsset } from "./media-asset.schema";
import type { MediaFolder } from "./media-folder.schema";
import { MediaService } from "./media.service";
import type { StorageService } from "../storage/storage.service";

const SITE_ID = new Types.ObjectId().toString();
const USER_ID = new Types.ObjectId().toString();

function createService() {
  const asset = {
    _id: new Types.ObjectId(),
    storageKey: `${SITE_ID}/file.png`,
    originalFilename: "file.png",
    mimeType: "image/png",
    fileSize: 8,
    status: "PROCESSING",
    deletedAt: null,
    save: jest.fn().mockResolvedValue(undefined),
  };
  const assetModel = {
    create: jest.fn().mockResolvedValue(asset),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn(),
  };
  const folderModel = { exists: jest.fn() };
  const storage = {
    buildStorageKey: jest.fn().mockReturnValue(asset.storageKey),
    putObject: jest.fn().mockResolvedValue(undefined),
    statObject: jest.fn().mockResolvedValue({ size: 8 }),
    removeObject: jest.fn().mockResolvedValue(undefined),
  };

  return {
    asset,
    assetModel,
    storage,
    service: new MediaService(
      assetModel as unknown as Model<MediaAsset>,
      folderModel as unknown as Model<MediaFolder>,
      storage as unknown as StorageService,
    ),
  };
}

describe("MediaService proxy upload", () => {
  test("validiert und speichert eine PNG-Datei serverseitig", async () => {
    const { asset, assetModel, storage, service } = createService();
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    const result = await service.upload(SITE_ID, USER_ID, {
      originalname: "file.png",
      mimetype: "image/png",
      size: png.length,
      buffer: png,
    });

    expect(storage.putObject).toHaveBeenCalledWith(
      `${SITE_ID}/file.png`,
      png,
      "image/png",
    );
    expect(assetModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "PROCESSING", fileSize: png.length }),
    );
    expect(asset.status).toBe("READY");
    expect(asset.save).toHaveBeenCalled();
    expect(result).toBe(asset);
  });

  test("liefert fuer Public-Inhalte nur eine interne API-URL", async () => {
    const { asset, assetModel, service } = createService();
    asset.status = "READY";
    assetModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(asset),
    });

    const url = await service.resolveUrl(SITE_ID, asset._id.toString());

    expect(url).toBe(
      `/api/v1/public/media/${SITE_ID}/${asset._id.toString()}`,
    );
    expect(url).not.toContain("storage");
  });
});
