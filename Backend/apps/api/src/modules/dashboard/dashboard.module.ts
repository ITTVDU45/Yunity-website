import { Module } from "@nestjs/common";
import { CollectionsModule } from "../collections/collections.module";
import { FormsModule } from "../forms/forms.module";
import { PagesModule } from "../pages/pages.module";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [PagesModule, CollectionsModule, FormsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
