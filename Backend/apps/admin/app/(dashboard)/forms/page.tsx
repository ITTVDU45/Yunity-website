"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { FormDetail, FormListItem } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { useAdminI18n } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Aktiv",
  DISABLED: "Deaktiviert",
  ARCHIVED: "Archiviert",
};

export default function FormsListPage() {
  const router = useRouter();
  const { locale } = useAdminI18n();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await clientApi<FormListItem[]>("/api/v1/admin/forms");
    if (res.success) {
      setForms(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    const name = window.prompt("Name des neuen Formulars:");
    if (!name) {
      return;
    }
    const res = await clientApi<FormDetail>("/api/v1/admin/forms", {
      method: "POST",
      body: { name, locale },
    });
    if (res.success) {
      router.push(`/forms/${res.data.id}`);
    } else {
      setError(res.error.message);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Formular „${name}" loeschen?`)) {
      return;
    }
    const res = await clientApi(`/api/v1/admin/forms/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      void load();
    } else {
      setError(res.error.message);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            Formulare
          </h1>
          <p className="text-zinc-500 font-medium">
            Dynamische Formulare bauen und Anfragen empfangen.
          </p>
        </div>
        <button
          onClick={create}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20"
        >
          <Plus className="w-4 h-4" />
          Neues Formular
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-16 text-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FormInput className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 text-sm">Noch keine Formulare.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/forms/${form.id}`}
                    className="font-black text-zinc-900 dark:text-white hover:text-accent transition-colors block truncate"
                  >
                    {form.name}
                  </Link>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {form.key}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0",
                    form.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
                  )}
                >
                  {STATUS_LABEL[form.status]}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400 font-bold uppercase tracking-widest">
                <span>{form.fieldCount} Felder</span>
                <span>{form.submissionCount} Anfragen</span>
              </div>
              <div className="flex items-center gap-1 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href={`/forms/${form.id}`}
                  className="p-2 rounded-lg text-zinc-400 hover:text-brand dark:hover:text-accent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Bearbeiten"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <Link
                  href={`/forms/submissions?formId=${form.id}`}
                  className="text-xs font-bold text-brand dark:text-accent hover:opacity-80 transition-opacity ml-2"
                >
                  Anfragen ansehen
                </Link>
                <button
                  onClick={() => remove(form.id, form.name)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ml-auto"
                  aria-label="Loeschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
