"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { TaxonomyResponse } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { useAdminI18n } from "@/lib/admin-i18n";

function TaxonomyManager({
  title,
  description,
  endpoint,
  withDescription,
}: {
  title: string;
  description: string;
  endpoint: string;
  withDescription?: boolean;
}) {
  const { locale, t } = useAdminI18n();
  const [items, setItems] = useState<TaxonomyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await clientApi<TaxonomyResponse[]>(endpoint);
    if (res.success) {
      setItems(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    const name = window.prompt(`Name (${title}):`);
    if (!name) {
      return;
    }
    const res = await clientApi<TaxonomyResponse>(endpoint, {
      method: "POST",
      body: { title: name, locale },
    });
    if (res.success) {
      void load();
    } else {
      setError(res.error.message);
    }
  };

  const edit = async (item: TaxonomyResponse) => {
    const current = item.translations[locale] ?? item.translations.de ?? {};
    const titleValue = window.prompt("Titel:", current.title ?? "");
    if (!titleValue) {
      return;
    }
    const descriptionValue = withDescription
      ? window.prompt("Beschreibung:", current.description ?? "")
      : undefined;
    if (withDescription && descriptionValue === null) {
      return;
    }
    const res = await clientApi<TaxonomyResponse>(`${endpoint}/${item.id}`, {
      method: "PATCH",
      body: {
        locale,
        title: titleValue,
        ...(withDescription ? { description: descriptionValue ?? "" } : {}),
      },
    });
    if (res.success) {
      void load();
    } else {
      setError(res.error.message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Eintrag loeschen?")) {
      return;
    }
    const res = await clientApi(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.success) {
      void load();
    } else {
      setError(res.error.message);
    }
  };

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <button
          onClick={add}
          className="p-2 rounded-lg bg-brand text-white hover:scale-105 transition-transform"
          aria-label="Hinzufuegen"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-400">Noch keine Eintraege.</p>
      ) : (
        <ul className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {items.map((item) => (
            <li key={item.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {item.translations[locale]?.title ??
                    item.translations.de?.title ??
                    t("common.untitled")}
                </span>
                {withDescription &&
                  (item.translations[locale]?.description ??
                    item.translations.de?.description) && (
                  <span className="block text-xs text-zinc-400">
                    {item.translations[locale]?.description ??
                      item.translations.de?.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => edit(item)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Bearbeiten"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function CompetenciesPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
          Kompetenzen & Kategorien
        </h1>
        <p className="text-zinc-500 font-medium">
          Verwaltbare Datensaetze fuer Teamprofile.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TaxonomyManager
          title="Kompetenzen"
          description="Fachliche Schwerpunkte, den Teammitgliedern zuweisbar."
          endpoint="/api/v1/admin/competencies"
        />
        <TaxonomyManager
          title="Team-Kategorien"
          description="Gruppierung des Teams (Gruendungspartner, Partner …)."
          endpoint="/api/v1/admin/team-categories"
          withDescription
        />
      </div>
    </div>
  );
}
