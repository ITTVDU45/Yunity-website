"use client";

import { useEffect, useState } from "react";
import type {
  CollectionListItem,
  TaxonomyResponse,
} from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import type { RelationField } from "./config";
import { cn } from "@/lib/utils";
import type { AdminLocale } from "@/lib/admin-i18n";

interface Option {
  id: string;
  label: string;
}

/** Mehrfachauswahl verknuepfter Eintraege (Chips zum An-/Abwaehlen). */
export function RelationPicker({
  field,
  locale,
  selected,
  onChange,
}: {
  field: RelationField;
  locale: AdminLocale;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const load = async () => {
      if (field.source === "competency") {
        const res = await clientApi<TaxonomyResponse[]>(
          "/api/v1/admin/competencies",
        );
        if (res.success) {
          setOptions(
            res.data.map((item) => ({
              id: item.id,
              label:
                item.translations[locale]?.title ??
                item.translations.de?.title ??
                "(ohne Titel)",
            })),
          );
        }
        return;
      }
      const res = await clientApi<CollectionListItem[]>(
        `/api/v1/admin/collections/${field.source}?limit=100&locale=${locale}`,
      );
      if (res.success) {
        setOptions(
          res.data.map((item) => ({ id: item.id, label: item.title })),
        );
      }
    };
    void load();
  }, [field.source, locale]);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((entry) => entry !== id)
        : [...selected, id],
    );
  };

  return (
    <div>
      <span className="block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
        {field.label}
      </span>
      {options.length === 0 ? (
        <p className="text-xs text-zinc-400">Keine Eintraege verfuegbar.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                  active
                    ? "bg-brand text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
