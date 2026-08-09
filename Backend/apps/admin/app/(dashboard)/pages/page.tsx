"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { PageDetail, PageListItem } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { StatusBadge } from "@/components/page-editor/status-badge";
import { useAdminI18n } from "@/lib/admin-i18n";

export default function PagesListPage() {
  const router = useRouter();
  const { locale } = useAdminI18n();
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await clientApi<PageListItem[]>(
      `/api/v1/admin/pages?locale=${locale}`,
    );
    if (res.success) {
      setPages(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const createPage = async () => {
    const name = window.prompt("Interner Name der neuen Seite:");
    if (!name) {
      return;
    }
    setCreating(true);
    const res = await clientApi<PageDetail>("/api/v1/admin/pages", {
      method: "POST",
      body: { internalName: name, locale },
    });
    setCreating(false);
    if (res.success) {
      router.push(`/pages/${res.data.id}`);
    } else {
      setError(res.error.message);
    }
  };

  const duplicate = async (id: string) => {
    const res = await clientApi<PageDetail>(
      `/api/v1/admin/pages/${id}/duplicate`,
      { method: "POST" },
    );
    if (res.success) {
      void load();
    } else {
      setError(res.error.message);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Seite „${title}" wirklich loeschen?`)) {
      return;
    }
    const res = await clientApi(`/api/v1/admin/pages/${id}`, {
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
            Seiten
          </h1>
          <p className="text-zinc-500 font-medium">
            Seiten aus modularen Sektionen aufbauen und veroeffentlichen.
          </p>
        </div>
        <button
          onClick={createPage}
          disabled={creating}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-60"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Neue Seite
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
          </div>
        ) : pages.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500 text-sm">
              Noch keine Seiten. Legen Sie die erste an.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Titel
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Slug
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Geaendert
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/pages/${page.id}`}
                        className="font-bold text-zinc-900 dark:text-white hover:text-accent transition-colors"
                      >
                        {page.title}
                      </Link>
                      {page.isHomepage && (
                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-accent">
                          Startseite
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                      {new Date(page.updatedAt).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/pages/${page.id}`}
                          className="p-2 rounded-lg text-zinc-400 hover:text-brand dark:hover:text-accent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          aria-label="Bearbeiten"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => duplicate(page.id)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-brand dark:hover:text-accent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          aria-label="Duplizieren"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(page.id, page.title)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          aria-label="Loeschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
