import { Controller, Get, Query } from "@nestjs/common";
import type { AuditLogEntry } from "@yunity/contracts";
import { RequirePermission } from "../../common/decorators";
import { AuditService } from "./audit.service";
import type { AuditLogDocument } from "./audit-log.schema";

function toEntry(log: AuditLogDocument): AuditLogEntry {
  return {
    id: log._id.toString(),
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    userEmail: log.userEmail,
    createdAt: log.createdAt.toISOString(),
  };
}

@Controller("v1/admin/audit-logs")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission("audit.read")
  async list(
    @Query("page") pageRaw?: string,
    @Query("limit") limitRaw?: string,
  ) {
    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(limitRaw ?? "20", 10) || 20),
    );
    const { items, total } = await this.auditService.findPaginated(page, limit);
    return { data: items.map(toEntry), meta: { total, page, limit } };
  }
}
