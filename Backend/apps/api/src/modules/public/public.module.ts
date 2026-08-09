import { Module } from "@nestjs/common";
import { NavigationModule } from "../navigation/navigation.module";
import { SettingsModule } from "../settings/settings.module";
import { SitesModule } from "../sites/sites.module";
import { PublicController } from "./public.controller";
import { PublicSiteResolver } from "./public-site.resolver";

@Module({
  imports: [SitesModule, SettingsModule, NavigationModule],
  providers: [PublicSiteResolver],
  controllers: [PublicController],
  exports: [PublicSiteResolver],
})
export class PublicModule {}
