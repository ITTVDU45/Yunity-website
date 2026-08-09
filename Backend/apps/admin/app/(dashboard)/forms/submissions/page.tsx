"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Inbox, Loader2, Trash2 } from "lucide-react";
import type {
  FormListItem,
  SubmissionDetail,
  SubmissionListItem,
} from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { getActiveSiteId } from "@/lib/site";
import { readCsrfToken } from "@/lib/client-api";
import { cn } from "@/lib/utils";

const STATUSES = ["NEW", "READ", "IN_PROGRESS", "COMPLETED", "SPAM", "ARCHIVED"] as const;
const STATUS_LABEL: Record<string, string> = {
  NEW: "Neu",
  READ: "Gelesen",
  IN_PROGRESS: "In Bearbeitung",
  COMPLETED: "Erledigt",
  SPAM: "Spam",
  ARCHIVED: "Archiviert",
};

export default function SubmissionsPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [formId, setFormId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [items, setItems] = useState<SubmissionListItem[]>([]);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormId(params.get("formId") ?? "");
    void clientApi<FormListItem[]>("/api/v1/admin/forms").then((res) => {
      if (res.success) setForms(res.data);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (formId) query.set("formId", formId);
    if (statusFilter) query.set("status", statusFilter);
    const res = await clientApi<SubmissionListItem[]>(
      `/api/v1/admin/submissions?${query.toString()}`,
    );
    if (res.success) {
      setItems(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [formId, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = async (id: string) => {
    const res = await clientApi<SubmissionDetail>(
      `/api/v1/admin/submissions/${id}`,
    );
    if (res.success) {
      setSelected(res.data);
      void load();
    }
  };

  const changeStatus = async (status: string) => {
    if (!selected) return;
    const res = await clientApi<SubmissionDetail>(
      `/api/v1/admin/submissions/${selected.id}`,
      { method: "PATCH", body: { status } },
    );
    if (res.success) {
      setSelected(res.data);
      void load();
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Anfrage loeschen?")) return;
    const res = await clientApi(`/api/v1/admin/submissions/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      if (selected?.id === id) setSelected(null);
      void load();
    }
  };

  const exportCsv = async () => {
    if (!formId) {
      setError("Bitte zuerst ein Formular waehlen.");
      return;
    }
    const response = await fetch(
      `/api/v1/admin/submissions/export?formId=${formId}`,
      {
        credentials: "include",
        headers: {
          "X-Site-Id": getActiveSiteId(),
          "X-CSRF-Token": readCsrfToken(),
        },
      },
    );
    if (!response.ok) {
      setError("Export fehlgeschlagen.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "anfragen.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            Anfragen
          </h1>
          <p className="text-zinc-500 font-medium">Formular-Uebermittlungen verwalten.</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV-Export
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={formId} onChange={(e) => setFormId(e.target.value)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm">
          <option value="">Alle Formulare</option>
          {forms.map((form) => (
            <option key={form.id} value={form.id}>{form.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm">
          <option value="">Alle Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="p-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-300" /></div>
          ) : items.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4"><Inbox className="w-8 h-8 text-zinc-300" /></div>
              <p className="text-zinc-500 text-sm">Keine Anfragen.</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => open(item.id)}
                    className={cn("w-full text-left px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-4", selected?.id === item.id && "bg-brand/5")}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-900 dark:text-white truncate">
                        {Object.values(item.data).slice(0, 2).map(String).join(" · ") || "(leer)"}
                      </p>
                      <p className="text-xs text-zinc-400">{new Date(item.createdAt).toLocaleString("de-DE")}</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0", item.status === "NEW" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : item.status === "SPAM" ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300")}>
                      {STATUS_LABEL[item.status]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <aside className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Anfrage</h2>
              <button onClick={() => remove(selected.id)} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" aria-label="Loeschen">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <dl className="space-y-2">
              {Object.entries(selected.data).map(([key, value]) => (
                <div key={key} className="border-b border-zinc-50 dark:border-zinc-800/50 pb-2">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{key}</dt>
                  <dd className="text-sm text-zinc-900 dark:text-white break-words">{Array.isArray(value) ? value.join(", ") : String(value)}</dd>
                </div>
              ))}
            </dl>
            <label className="block">
              <span className="block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">Status</span>
              <select value={selected.status} onChange={(e) => changeStatus(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm">
                {STATUSES.map((s) => (<option key={s} value={s}>{STATUS_LABEL[s]}</option>))}
              </select>
            </label>
            <p className="text-xs text-zinc-400">Eingegangen: {new Date(selected.createdAt).toLocaleString("de-DE")}</p>
          </aside>
        )}
      </div>
    </div>
  );
}
