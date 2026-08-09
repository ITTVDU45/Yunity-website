import { ScrollText } from "lucide-react";
import type { AuditLogEntry } from "@yunity/contracts";
import { apiFetch } from "@/lib/api";

export const metadata = { title: "Audit-Log" };

export default async function AuditPage() {
  const entries =
    (await apiFetch<AuditLogEntry[]>(
      "/api/v1/admin/audit-logs?page=1&limit=50",
    )) ?? [];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
          Audit-Log
        </h1>
        <p className="text-zinc-500 font-medium">
          Protokoll aller administrativen Aktionen.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <ScrollText className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500 text-sm">Noch keine Eintraege.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Zeitpunkt
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Benutzer
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Aktion
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Entitaet
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString("de-DE")}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      {entry.userEmail ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-brand/5 dark:bg-white/5 text-xs font-bold text-brand dark:text-accent">
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {entry.entityType
                        ? `${entry.entityType}${entry.entityId ? ` · ${entry.entityId}` : ""}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
