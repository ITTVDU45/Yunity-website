import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { StorageModule } from "../storage/storage.module";
import { MediaAsset, MediaAssetSchema } from "./media-asset.schema";
import { MediaFolder, MediaFolderSchema } from "./media-folder.schema";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { PublicMediaController } from "./public-media.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MediaAsset.name, schema: MediaAssetSchema },
      { name: MediaFolder.name, schema: MediaFolderSchema },
    ]),
    StorageModule,
    AuditModule,
  ],
  providers: [MediaService],
  controllers: [MediaController, PublicMediaController],
  exports: [MediaService],
})
export class MediaModule {}
