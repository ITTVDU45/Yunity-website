import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import * as argon2 from "argon2";
import { SYSTEM_ROLES } from "@yunity/permissions";
import { AppModule } from "./app.module";
import { env } from "./config/env";
import { Role } from "./modules/users/role.schema";
import { Site } from "./modules/sites/site.schema";
import { User } from "./modules/users/user.schema";

/**
 * Idempotenter Erst-Seed: Site, Systemrollen, Super-Administrator.
 * Mehrfache Laeufe erzeugen keine Duplikate (Upsert nach key/email).
 */
async function seed(): Promise<void> {
  const logger = new Logger("Seed");
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });

  try {
    const siteModel = app.get<Model<Site>>(getModelToken(Site.name));
    const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
    const userModel = app.get<Model<User>>(getModelToken(User.name));

    // 1. Site
    const site = await siteModel.findOneAndUpdate(
      { key: "yunity" },
      {
        $set: {
          // Die Website ist einsprachig deutsch; die i18n-Mechanik des Kerns
          // bleibt erhalten, es ist nur genau eine Sprache aktiviert.
          defaultLocale: "de",
          enabledLocales: ["de"],
        },
        $setOnInsert: {
          key: "yunity",
          name: "Yunity",
          primaryDomain: "yunity-jobs.de",
          cmsDomain: "admin.yunity-jobs.de",
          timezone: "Europe/Berlin",
          status: "ACTIVE",
          enabledModules: {
            pages: true,
            navigation: true,
            media: true,
            forms: true,
            services: true,
            industries: true,
            testimonials: true,
            blog: true,
          },
          settings: {},
        },
      },
      { upsert: true, new: true },
    );
    logger.log(`Site: ${site.name} (${site._id.toString()})`);

    // 2. Systemrollen
    for (const preset of SYSTEM_ROLES) {
      await roleModel.findOneAndUpdate(
        { key: preset.key, siteId: null },
        {
          $set: {
            name: preset.name,
            description: preset.description,
            permissions: [...preset.permissions],
            isSystem: true,
            isGlobal: preset.isGlobal,
          },
        },
        { upsert: true, new: true },
      );
      logger.log(`Rolle: ${preset.name}`);
    }

    // 3. Super-Administrator (nur wenn ENV gesetzt und Benutzer neu)
    if (env.SUPERADMIN_EMAIL && env.SUPERADMIN_PASSWORD) {
      const existing = await userModel.findOne({
        email: env.SUPERADMIN_EMAIL.toLowerCase(),
      });
      if (existing) {
        logger.log(`Super-Admin existiert bereits: ${existing.email}`);
      } else {
        const superAdminRole = await roleModel.findOne({
          key: "super-admin",
          siteId: null,
        });
        if (!superAdminRole) {
          throw new Error("Systemrolle super-admin fehlt");
        }
        const passwordHash = await argon2.hash(env.SUPERADMIN_PASSWORD, {
          type: argon2.argon2id,
        });
        const user = await userModel.create({
          email: env.SUPERADMIN_EMAIL.toLowerCase(),
          passwordHash,
          firstName: "Super",
          lastName: "Admin",
          status: "ACTIVE",
          roles: [{ roleId: superAdminRole._id, siteId: null }],
        });
        logger.log(`Super-Admin angelegt: ${user.email}`);
        logger.warn(
          "SUPERADMIN_PASSWORD nach dem ersten Login aendern und aus der .env entfernen.",
        );
      }
    } else {
      logger.warn(
        "SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD nicht gesetzt — kein Admin-Benutzer angelegt.",
      );
    }
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  const logger = new Logger("Seed");
  logger.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
