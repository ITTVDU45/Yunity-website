"use client";

import type { ContentStatus } from "@yunity/contracts";
import type { AdminMessageKey } from "@/lib/admin-i18n";
import { useAdminI18n } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<ContentStatus, { label: AdminMessageKey; className: string }> =
  {
    DRAFT: {
      label: "status.DRAFT",
      className: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
    },
    IN_REVIEW: {
      label: "status.IN_REVIEW",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    APPROVED: {
      label: "status.APPROVED",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    },
    SCHEDULED: {
      label: "status.SCHEDULED",
      className:
        "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    },
    PUBLISHED: {
      label: "status.PUBLISHED",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    ARCHIVED: {
      label: "status.ARCHIVED",
      className: "bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    },
  };

export function StatusBadge({ status }: { status: ContentStatus }) {
  const { t } = useAdminI18n();
  const style = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest",
        style.className,
      )}
    >
      {t(style.label)}
    </span>
  );
}
