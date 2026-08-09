import type { PermissionKey } from "@yunity/permissions";
import type { WorkflowAction } from "./workflow";

export const WORKFLOW_ACTIONS = [
  "submitForReview",
  "approve",
  "reject",
  "publish",
  "schedule",
  "unpublish",
  "archive",
  "restore",
] as const;

/**
 * Zusaetzliche Berechtigung je Workflow-Aktion. Der Endpunkt verlangt generell
 * pages.update; publizierende und freigebende Aktionen benoetigen daneben ein
 * weitergehendes Recht (serverseitig geprueft).
 */
export const ACTION_PERMISSION: Record<WorkflowAction, PermissionKey> = {
  submitForReview: "pages.update",
  approve: "content.review",
  reject: "content.review",
  publish: "pages.publish",
  schedule: "pages.publish",
  unpublish: "pages.publish",
  archive: "pages.update",
  restore: "pages.update",
};
