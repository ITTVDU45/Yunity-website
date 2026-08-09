import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { env } from "./config/env";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "./modules/auth/guards/auth.guard";
import { CsrfGuard } from "./modules/auth/guards/csrf.guard";
import { PermissionGuard } from "./modules/auth/guards/permission.guard";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { HealthModule } from "./modules/health/health.module";
import { MediaModule } from "./modules/media/media.module";
import { CollectionsModule } from "./modules/collections/collections.module";
import { FormsModule } from "./modules/forms/forms.module";
import { NavigationModule } from "./modules/navigation/navigation.module";
import { PagesModule } from "./modules/pages/pages.module";
import { PublicModule } from "./modules/public/public.module";
import { PublicContentModule } from "./modules/public-content/public-content.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { SitesModule } from "./modules/sites/sites.module";
import { StorageModule } from "./modules/storage/storage.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI),
    ScheduleModule.forRoot(),
    // Basis-Limit fuer alle Routen; Login/Reset haben strengere @Throttle-Overrides.
    ThrottlerModule.forRoot({
      throttlers: [{ name: "default", ttl: 60 * 1000, limit: 100 }],
    }),
    SitesModule,
    UsersModule,
    AuthModule,
    AuditModule,
    DashboardModule,
    HealthModule,
    StorageModule,
    MediaModule,
    NavigationModule,
    SettingsModule,
    PublicModule,
    PagesModule,
    CollectionsModule,
    FormsModule,
    PublicContentModule,
  ],
  providers: [
    // Reihenfolge ist relevant: Rate Limit -> Session -> CSRF -> Permission.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
