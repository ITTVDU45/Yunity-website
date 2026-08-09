import { Injectable, Logger } from "@nestjs/common";
import { createHmac } from "node:crypto";
import { env } from "../../config/env";

/**
 * Informiert das öffentliche Frontend über veröffentlichte Änderungen und
 * invalidiert dort gezielt Cache-Tags. Signiert per HMAC (REVALIDATION_SECRET).
 * Best-effort: Fehler werden nur protokolliert — Publishing schlägt nie fehl.
 * Ohne FRONTEND_URL/REVALIDATION_SECRET bleibt es beim Log (Stub).
 */
@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);

  async revalidate(siteId: string, tags: readonly string[]): Promise<void> {
    if (tags.length === 0) {
      return;
    }
    if (!env.FRONTEND_URL || !env.REVALIDATION_SECRET) {
      this.logger.log(
        `Revalidation (Site ${siteId}): ${tags.join(", ")} — FRONTEND_URL/SECRET nicht gesetzt, kein Versand.`,
      );
      return;
    }

    const body = JSON.stringify({ siteId, tags });
    const timestamp = Date.now().toString();
    const signature = createHmac("sha256", env.REVALIDATION_SECRET)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    try {
      const response = await fetch(`${env.FRONTEND_URL}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": signature,
          "X-Timestamp": timestamp,
        },
        body,
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        this.logger.warn(
          `Revalidation-Antwort ${response.status} für Tags: ${tags.join(", ")}`,
        );
      }
    } catch (error: unknown) {
      this.logger.warn(
        `Revalidation-Versand fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
