import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { PublicModule } from "../public/public.module";
import { BlockTypesController } from "./block-types.controller";
import { PagesController } from "./pages.controller";
import { PagesService } from "./pages.service";
import { RevisionsService } from "./revisions.service";
import { RevalidationService } from "./revalidation.service";
import { SectionsService } from "./sections.service";
import {
  ContentRevision,
  ContentRevisionSchema,
} from "./schemas/content-revision.schema";
import {
  ContentSection,
  ContentSectionSchema,
} from "./schemas/content-section.schema";
import { Page, PageSchema } from "./schemas/page.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Page.name, schema: PageSchema },
      { name: ContentSection.name, schema: ContentSectionSchema },
      { name: ContentRevision.name, schema: ContentRevisionSchema },
    ]),
    AuditModule,
    PublicModule,
  ],
  providers: [
    PagesService,
    SectionsService,
    RevisionsService,
    RevalidationService,
  ],
  controllers: [PagesController, BlockTypesController],
  exports: [PagesService, RevisionsService, SectionsService, RevalidationService],
})
export class PagesModule {}
