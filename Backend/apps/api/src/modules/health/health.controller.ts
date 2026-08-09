import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Public } from "../../common/decorators";
import { StorageService } from "../storage/storage.service";

@Controller("health")
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly storageService: StorageService,
  ) {}

  @Public()
  @Get("live")
  live(): { status: "ok" } {
    return { status: "ok" };
  }

  @Public()
  @Get("ready")
  async ready(): Promise<{
    status: "ok";
    checks: Record<string, string>;
  }> {
    const checks: Record<string, string> = {};

    try {
      if (!this.connection.db) {
        throw new Error("Keine Datenbankverbindung");
      }
      await this.connection.db.admin().ping();
      checks.mongodb = "ok";
    } catch {
      checks.mongodb = "error";
    }

    checks.storage = await this.storageService.checkReady();
    checks.env = "ok"; // env.ts validiert beim Start; Prozess laeuft nur mit gueltiger Konfiguration.

    const failed = Object.values(checks).includes("error");
    if (failed) {
      throw new ServiceUnavailableException({ status: "degraded", checks });
    }
    return { status: "ok", checks };
  }
}
