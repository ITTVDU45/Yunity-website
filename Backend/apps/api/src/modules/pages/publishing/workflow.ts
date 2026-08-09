/**
 * Zustandsmaschine des Entwurfs-/Freigabe-/Veroeffentlichungs-Workflows.
 * Rein funktional (ohne Datenbank), damit die Uebergaenge isoliert testbar sind.
 * Wer eine Aktion ausloesen darf, entscheidet der PermissionGuard — hier wird
 * nur geprueft, ob der Uebergang aus dem aktuellen Status ueberhaupt zulaessig ist.
 */

export const CONTENT_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export type WorkflowAction =
  | "submitForReview"
  | "approve"
  | "reject"
  | "publish"
  | "schedule"
  | "unpublish"
  | "archive"
  | "restore";

const TRANSITIONS: Record<WorkflowAction, {
  from: readonly ContentStatus[];
  to: ContentStatus;
}> = {
  submitForReview: { from: ["DRAFT", "APPROVED"], to: "IN_REVIEW" },
  approve: { from: ["IN_REVIEW"], to: "APPROVED" },
  reject: { from: ["IN_REVIEW"], to: "DRAFT" },
  // Direktveroeffentlichung (Reviewer/Admin) ist aus mehreren Zustaenden erlaubt;
  // Republish nach Aenderungen bleibt ebenfalls moeglich.
  publish: {
    from: ["DRAFT", "IN_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"],
    to: "PUBLISHED",
  },
  schedule: { from: ["DRAFT", "APPROVED"], to: "SCHEDULED" },
  unpublish: { from: ["PUBLISHED", "SCHEDULED"], to: "DRAFT" },
  archive: {
    from: ["DRAFT", "IN_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"],
    to: "ARCHIVED",
  },
  restore: { from: ["ARCHIVED"], to: "DRAFT" },
};

export function canTransition(
  current: ContentStatus,
  action: WorkflowAction,
): boolean {
  return TRANSITIONS[action].from.includes(current);
}

/**
 * Liefert den Zielstatus einer Aktion oder null, wenn der Uebergang aus dem
 * aktuellen Status nicht erlaubt ist.
 */
export function nextStatus(
  current: ContentStatus,
  action: WorkflowAction,
): ContentStatus | null {
  return canTransition(current, action) ? TRANSITIONS[action].to : null;
}
