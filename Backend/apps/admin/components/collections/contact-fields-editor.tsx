"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { ContactFieldResponse } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { useAdminI18n } from "@/lib/admin-i18n";

const FIELD_TYPES = [
  "PHONE",
  "MOBILE",
  "EMAIL",
  "FAX",
  "WEBSITE",
  "ADDRESS",
  "WHATSAPP",
  "LINKEDIN",
  "CUSTOM",
] as const;

const inputClass =
  "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-accent/60 transition-all";

/** Verwaltet die dynamischen Kontaktfelder eines Standorts oder Teammitglieds. */
export function ContactFieldsEditor({
  ownerType,
  ownerId,
}: {
  ownerType: "LOCATION" | "TEAM_MEMBER";
  ownerId: string;
}) {
  const { locale } = useAdminI18n();
  const [fields, setFields] = useState<ContactFieldResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const query = `ownerType=${ownerType}&ownerId=${ownerId}`;

  const load = useCallback(async () => {
    const res = await clientApi<ContactFieldResponse[]>(
      `/api/v1/admin/contact-fields?${query}`,
    );
    if (res.success) {
      setFields(res.data);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    const res = await clientApi<ContactFieldResponse>(
      `/api/v1/admin/contact-fields?${query}`,
      {
        method: "POST",
        body: {
          fieldType: "PHONE",
          label:
            locale === "en" ? "Phone" : locale === "tr" ? "Telefon" : "Telefon",
          locale,
          value: "",
        },
      },
    );
    if (res.success) {
      setFields((current) => [...current, res.data]);
    }
  };

  const save = async (field: ContactFieldResponse) => {
    const label =
      field.translations[locale]?.label ??
      field.translations.de?.label ??
      field.label;
    await clientApi(
      `/api/v1/admin/contact-fields/${field.id}?ownerType=${ownerType}`,
      {
        method: "PATCH",
        body: {
          fieldType: field.fieldType,
          label,
          locale,
          value: field.value,
          link: field.link,
          isPublic: field.isPublic,
        },
      },
    );
  };

  const remove = async (id: string) => {
    const res = await clientApi(
      `/api/v1/admin/contact-fields/${id}?ownerType=${ownerType}`,
      { method: "DELETE" },
    );
    if (res.success) {
      setFields((current) => current.filter((field) => field.id !== id));
    }
  };

  const patch = (id: string, patch: Partial<ContactFieldResponse>) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...patch } : field,
      ),
    );
  };

  const patchLabel = (field: ContactFieldResponse, label: string) => {
    patch(field.id, {
      translations: {
        ...field.translations,
        [locale]: { ...field.translations[locale], label },
      },
    });
  };

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />;
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3"
        >
          <select
            value={field.fieldType}
            onChange={(event) => patch(field.id, { fieldType: event.target.value })}
            className={`${inputClass} w-32`}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            value={
              field.translations[locale]?.label ??
              field.translations.de?.label ??
              field.label
            }
            placeholder={`Bezeichnung (${locale.toUpperCase()})`}
            onChange={(event) => patchLabel(field, event.target.value)}
            onBlur={() => save(field)}
            className={`${inputClass} flex-1 min-w-[120px]`}
          />
          <input
            value={field.value}
            placeholder="Wert"
            onChange={(event) => patch(field.id, { value: event.target.value })}
            onBlur={() => save(field)}
            className={`${inputClass} flex-1 min-w-[120px]`}
          />
          <input
            value={field.link ?? ""}
            placeholder="Link (tel:/mailto:)"
            onChange={(event) => patch(field.id, { link: event.target.value })}
            onBlur={() => save(field)}
            className={`${inputClass} flex-1 min-w-[120px]`}
          />
          <label className="flex items-center gap-1.5 text-xs text-zinc-500">
            <input
              type="checkbox"
              checked={field.isPublic}
              onChange={(event) => {
                patch(field.id, { isPublic: event.target.checked });
                void save({ ...field, isPublic: event.target.checked });
              }}
              className="w-4 h-4 rounded accent-[#0a1624]"
            />
            oeffentlich
          </label>
          <button
            type="button"
            onClick={() => remove(field.id)}
            className="text-zinc-400 hover:text-red-500 transition-colors"
            aria-label="Entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm font-bold text-brand dark:text-accent hover:opacity-80 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Kontaktfeld hinzufuegen
      </button>
    </div>
  );
}
