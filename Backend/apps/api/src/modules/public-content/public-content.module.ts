import { Module } from "@nestjs/common";
import { CollectionsModule } from "../collections/collections.module";
import { FormsModule } from "../forms/forms.module";
import { PagesModule } from "../pages/pages.module";
import { PublicModule } from "../public/public.module";
import { PublicPagesController } from "../pages/public-pages.controller";
import { PublicCollectionsController } from "./public-collections.controller";
import { PublicFormsController } from "./public-forms.controller";
import { PublicContentService } from "./public-content.service";
import { MediaModule } from "../media/media.module";

/**
 * Buendelt die oeffentliche Auslieferung von Seiten und Fachmodulen.
 * Haengt an Pages- und Collections-Modul, ohne dass diese sich gegenseitig
 * kennen muessen (vermeidet eine zyklische Abhaengigkeit).
 */
@Module({
  imports: [PagesModule, CollectionsModule, FormsModule, PublicModule, MediaModule],
  providers: [PublicContentService],
  controllers: [
    PublicPagesController,
    PublicCollectionsController,
    PublicFormsController,
  ],
})
export class PublicContentModule {}
