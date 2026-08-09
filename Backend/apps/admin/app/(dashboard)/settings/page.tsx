"use client";

import { useCallback, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { SettingsGroup, SettingsGroupResponse } from "@yunity/contracts";
import { AdminThemeSelector } from "@/components/admin-theme-selector";
import { useAdminI18n } from "@/lib/admin-i18n";
import { clientApi } from "@/lib/client-api";
import { cn } from "@/lib/utils";

interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
}

const GROUPS: { group: SettingsGroup; label: string; fields: FieldDef[] }[] = [
  {
    group: "general",
    label: "Allgemein",
    fields: [
      { key: "projectName", label: "Projektname", placeholder: "Yunity" },
      { key: "tagline", label: "Claim", placeholder: "Kurzfristig. Zuverlässig. Professionell." },
      { key: "defaultLocale", label: "Standardsprache", placeholder: "de" },
      { key: "timezone", label: "Zeitzone", placeholder: "Europe/Berlin" },
    ],
  },
  {
    group: "company",
    label: "Unternehmen",
    fields: [
      { key: "name", label: "Firmenname", placeholder: "Yunity" },
      { key: "legalName", label: "Vollständiger Firmenname", placeholder: "Yunity Personalvermittlung" },
      { key: "email", label: "E-Mail" },
      { key: "phone", label: "Telefon (Anzeige)", placeholder: "+49 30 123 456 789" },
      { key: "phoneE164", label: "Telefon (Wählformat)", placeholder: "+493012345678" },
      { key: "street", label: "Straße und Hausnummer" },
      { key: "zip", label: "Postleitzahl" },
      { key: "city", label: "Stadt" },
      { key: "openingHours", label: "Öffnungszeiten", placeholder: "Mo-Fr 09:00-18:00" },
      { key: "vatId", label: "Umsatzsteuer-ID" },
    ],
  },
  {
    group: "seo",
    label: "SEO",
    fields: [
      { key: "defaultMetaTitle", label: "Standard-Metatitel" },
      { key: "titleTemplate", label: "Titelvorlage", placeholder: "%s · Yunity" },
      {
        key: "defaultMetaDescription",
        label: "Standardbeschreibung",
        multiline: true,
      },
    ],
  },
  {
    group: "footer",
    label: "Footer",
    fields: [
      { key: "claim", label: "Footer-Überschrift" },
      { key: "claimText", label: "Footer-Text", multiline: true },
      { key: "trustPoints", label: "Vertrauenspunkte (kommagetrennt)", multiline: true },
      { key: "copyright", label: "Copyright" },
      { key: "linkedin", label: "LinkedIn-URL" },
      { key: "instagram", label: "Instagram-URL" },
    ],
  },
];

type SettingsTab = "appearance" | SettingsGroup;

export default function SettingsPage() {
  const { t } = useAdminI18n();
  const [activeGroup, setActiveGroup] = useState<SettingsTab>("appearance");
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (group: SettingsGroup) => {
    setLoading(true);
    setSaved(false);
    const result = await clientApi<SettingsGroupResponse>(
      `/api/v1/admin/settings/${group}`,
    );
    if (result.success) {
      setValues(result.data.values);
      setError("");
    } else {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  const selectTab = (tab: SettingsTab) => {
    setActiveGroup(tab);
    setLoading(tab !== "appearance");
    setSaved(false);
    setError("");
    if (tab !== "appearance") {
      void load(tab);
    }
  };

  const save = async () => {
    if (activeGroup === "appearance") {
      return;
    }
    setSaving(true);
    setError("");
    const result = await clientApi(`/api/v1/admin/settings/${activeGroup}`, {
      method: "PUT",
      body: { values },
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(result.error.message);
    }
  };

  const config = GROUPS.find((entry) => entry.group === activeGroup);

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
          Einstellungen
        </h1>
        <p className="text-zinc-500 font-medium">
          Globale Konfiguration der Website.
        </p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1 overflow-x-auto">
          <button
            onClick={() => selectTab("appearance")}
            className={cn(
              "px-4 py-3 rounded-xl text-left font-bold text-sm transition-all whitespace-nowrap",
              activeGroup === "appearance"
                ? "bg-brand text-white"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
            )}
          >
            {t("settings.appearance")}
          </button>
          {GROUPS.map((entry) => (
            <button
              key={entry.group}
              onClick={() => selectTab(entry.group)}
              className={cn(
                "px-4 py-3 rounded-xl text-left font-bold text-sm transition-all whitespace-nowrap",
                entry.group === activeGroup
                  ? "bg-brand text-white"
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm p-6 lg:p-8">
          {activeGroup === "appearance" ? (
            <AdminThemeSelector />
          ) : loading ? (
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Wird geladen…
            </div>
          ) : (
            <div className="space-y-5 max-w-xl">
              {config?.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    {field.label}
                  </label>
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      value={String(values[field.key] ?? "")}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40 resize-none"
                    />
                  ) : (
                    <input
                      placeholder={field.placeholder}
                      value={String(values[field.key] ?? "")}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={() => void save()}
                disabled={saving}
                className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Gespeichert
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Speichern…
                  </>
                ) : (
                  "Speichern"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
