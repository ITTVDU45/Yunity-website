import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SubmissionsService } from "./submissions.service";

/**
 * Zeitplan fuer die Aufbewahrungsfrist. Bewusst vom Service getrennt: so bleibt
 * die Logik frei von @nestjs/schedule und laesst sich auch aus einer
 * Next-Route (Vercel Cron) aufrufen.
 */
@Injectable()
export class SubmissionsCron {
  constructor(private readonly submissions: SubmissionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purge(): Promise<void> {
    await this.submissions.purgeExpired();
  }
}
