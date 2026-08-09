"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageOff, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { CollectionDetail, CollectionListItem } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { StatusBadge } from "@/components/page-editor/status-badge";
import type { CollectionModuleConfig } from "./config";
import { useAdminI18n } from "@/lib/admin-i18n";

export function CollectionList({
  config,
}: {
  config: CollectionModuleConfig;
}) {
  const router = useRouter();
  const { locale } = useAdminI18n();
  const [items, setItems] = useState<CollectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const base = `/api/v1/admin/collections/${config.kind}`;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await clientApi<CollectionListItem[]>(`${base}?locale=${locale}`);
    if (res.success) {
      setItems(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [base, locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    const title = window.prompt(`Titel des neuen Eintrags (${config.singular}):`);
    if (!title) {
      return;
    }
    const res = await clientApi<CollectionDetail>(base, {
      method: "POST",
      body: { title, locale },
    });
    if (res.success) {
      router.push(`/collections/${config.kind}/${res.data.id}`);
    } else {
      setError(res.error.message);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`„${title}" wirklich loeschen?`)) {
      return;
    }
    const res = await clientApi(`${base}/${id}`, { method: "DELETE" });
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
            {config.label}
          </h1>
          <p className="text-zinc-500 font-medium">
            Wiederverwendbare Inhalte – auf mehreren Seiten referenzierbar.
          </p>
        </div>
        <button
          onClick={create}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20"
        >
          <Plus className="w-4 h-4" />
          Neu
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
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-16 text-center text-zinc-500 text-sm">
          Noch keine Eintraege.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all group"
            >
              <div className="h-40 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-accent text-zinc-950 p-1.5 rounded-lg">
                    <Star className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="absolute top-3 right-3">
                  <StatusBadge status={item.status} />
                </span>
              </div>
              <div className="p-5">
                <Link
                  href={`/collections/${config.kind}/${item.id}`}
                  className="font-black text-zinc-900 dark:text-white hover:text-accent transition-colors block truncate"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-zinc-400 font-mono mt-1 truncate">
                  /{item.slug}
                </p>
                <div className="flex items-center gap-1 mt-4">
                  <Link
                    href={`/collections/${config.kind}/${item.id}`}
                    className="p-2 rounded-lg text-zinc-400 hover:text-brand dark:hover:text-accent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Bearbeiten"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => remove(item.id, item.title)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    aria-label="Loeschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
