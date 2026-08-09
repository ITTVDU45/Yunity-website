import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { MediaModule } from "../media/media.module";
import { PagesModule } from "../pages/pages.module";
import {
  CollectionItem,
  CollectionItemSchema,
} from "./collection-item.schema";
import { ContactField, ContactFieldSchema } from "./contact-field.schema";
import {
  Competency,
  CompetencySchema,
  TeamCategory,
  TeamCategorySchema,
} from "./taxonomy.schema";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { ContactFieldsController } from "./contact-fields.controller";
import { ContactFieldsService } from "./contact-fields.service";
import {
  CompetenciesController,
  TeamCategoriesController,
} from "./taxonomy.controller";
import { TaxonomyService } from "./taxonomy.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionItem.name, schema: CollectionItemSchema },
      { name: ContactField.name, schema: ContactFieldSchema },
      { name: Competency.name, schema: CompetencySchema },
      { name: TeamCategory.name, schema: TeamCategorySchema },
    ]),
    PagesModule,
    MediaModule,
    AuditModule,
  ],
  providers: [CollectionsService, ContactFieldsService, TaxonomyService],
  controllers: [
    CollectionsController,
    ContactFieldsController,
    CompetenciesController,
    TeamCategoriesController,
  ],
  exports: [CollectionsService, ContactFieldsService],
})
export class CollectionsModule {}
