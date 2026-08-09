"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { FormFieldDef } from "@yunity/contracts";
import { useAdminI18n } from "@/lib/admin-i18n";

const inputClass =
  "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all";
const labelClass =
  "block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5";

const CHOICE_TYPES = new Set(["select", "radio", "checkbox-group", "multiselect"]);
const TEXT_TYPES = new Set(["text", "textarea", "email", "phone"]);
const LAYOUT_TYPES = new Set(["heading", "paragraph", "divider"]);

interface OptionDraft {
  value: string;
  label: string;
  isEnabled: boolean;
}

interface ConditionDraft {
  action: string;
  field: string;
  comparison: string;
  value: string;
}

export function FieldEditor({
  field,
  otherFields,
  onSave,
  onDelete,
  busy,
}: {
  field: FormFieldDef;
  otherFields: FormFieldDef[];
  onSave: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { locale, t } = useAdminI18n();
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [helpText, setHelpText] = useState("");
  const [required, setRequired] = useState(false);
  const [width, setWidth] = useState("FULL");
  const [validation, setValidation] = useState<Record<string, unknown>>({});
  const [options, setOptions] = useState<OptionDraft[]>([]);
  const [condition, setCondition] = useState<ConditionDraft | null>(null);

  useEffect(() => {
    const translation =
      field.translations[locale] ?? field.translations.de ?? {};
    setLabel(translation.label ?? "");
    setName(field.name);
    setPlaceholder(translation.placeholder ?? "");
    setHelpText(translation.helpText ?? "");
    setRequired(field.required);
    setWidth(field.width);
    setValidation(field.validation ?? {});
    setOptions(
      field.options.map((option) => ({
        value: option.value,
        label:
          option.translations[locale]?.label ??
          option.translations.de?.label ??
          option.value,
        isEnabled: option.isEnabled,
      })),
    );
    const rule =
      field.conditions &&
      Array.isArray((field.conditions as { rules?: unknown[] }).rules)
        ? (field.conditions as {
            action: string;
            rules: { field: string; comparison: string; value: unknown }[];
          })
        : null;
    setCondition(
      rule && rule.rules[0]
        ? {
            action: rule.action,
            field: rule.rules[0].field,
            comparison: rule.rules[0].comparison,
            value: String(rule.rules[0].value ?? ""),
          }
        : null,
    );
  }, [field, locale]);

  const setVal = (key: string, value: unknown) => {
    setValidation((current) => {
      const next = { ...current };
      if (value === "" || value === undefined || value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const save = () => {
    const conditions =
      condition && condition.field
        ? {
            action: condition.action,
            operator: "AND",
            rules: [
              {
                field: condition.field,
                comparison: condition.comparison,
                value: condition.value,
              },
            ],
          }
        : null;
    onSave({
      locale,
      name,
      required,
      width,
      validation,
      conditions,
      translation: { label, placeholder, helpText },
      ...(CHOICE_TYPES.has(field.type)
        ? {
            options: options.map((option) => ({
              value: option.value,
              label: option.label,
              isEnabled: option.isEnabled,
            })),
          }
        : {}),
    });
  };

  const isLayout = LAYOUT_TYPES.has(field.type);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-accent">
            {field.type}
          </p>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">
            Feld bearbeiten
          </h2>
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          aria-label="Feld loeschen"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {!field.translations[locale] && locale !== "de" && (
        <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-300 rounded-xl px-3 py-2">
          {t("common.languageFallback")}
        </p>
      )}

      <label className="block">
        <span className={labelClass}>Beschriftung</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputClass} />
      </label>

      {!isLayout && (
        <>
          <label className="block">
            <span className={labelClass}>Feldname (technisch)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} font-mono text-xs`} />
          </label>

          {TEXT_TYPES.has(field.type) && (
            <label className="block">
              <span className={labelClass}>Platzhalter</span>
              <input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} className={inputClass} />
            </label>
          )}

          <label className="block">
            <span className={labelClass}>Hilfetext</span>
            <input value={helpText} onChange={(e) => setHelpText(e.target.value)} className={inputClass} />
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
              <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="w-4 h-4 rounded accent-[#0a1624]" />
              Pflichtfeld
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-500">
              Breite
              <select value={width} onChange={(e) => setWidth(e.target.value)} className={`${inputClass} w-28 py-1.5`}>
                <option value="FULL">Voll</option>
                <option value="HALF">Halb</option>
                <option value="THIRD">Drittel</option>
              </select>
            </label>
          </div>

          {TEXT_TYPES.has(field.type) && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelClass}>Min. Laenge</span>
                <input type="number" value={String(validation.minLength ?? "")} onChange={(e) => setVal("minLength", e.target.value ? Number(e.target.value) : "")} className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Max. Laenge</span>
                <input type="number" value={String(validation.maxLength ?? "")} onChange={(e) => setVal("maxLength", e.target.value ? Number(e.target.value) : "")} className={inputClass} />
              </label>
            </div>
          )}

          {field.type === "number" && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelClass}>Minimum</span>
                <input type="number" value={String(validation.min ?? "")} onChange={(e) => setVal("min", e.target.value ? Number(e.target.value) : "")} className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Maximum</span>
                <input type="number" value={String(validation.max ?? "")} onChange={(e) => setVal("max", e.target.value ? Number(e.target.value) : "")} className={inputClass} />
              </label>
            </div>
          )}

          {CHOICE_TYPES.has(field.type) && (
            <div>
              <span className={labelClass}>Optionen</span>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={option.label}
                      placeholder="Anzeige"
                      onChange={(e) =>
                        setOptions(options.map((o, i) => (i === index ? { ...o, label: e.target.value, value: o.value || slug(e.target.value) } : o)))
                      }
                      className={inputClass}
                    />
                    <button type="button" onClick={() => setOptions(options.filter((_, i) => i !== index))} className="text-zinc-400 hover:text-red-500 shrink-0" aria-label="Option entfernen">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setOptions([...options, { value: "", label: "", isEnabled: true }])} className="mt-2 flex items-center gap-2 text-sm font-bold text-brand dark:text-accent hover:opacity-80">
                <Plus className="w-4 h-4" />
                Option hinzufuegen
              </button>
            </div>
          )}

          {/* Bedingte Sichtbarkeit */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={labelClass + " mb-0"}>Bedingte Sichtbarkeit</span>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                <input
                  type="checkbox"
                  checked={condition !== null}
                  onChange={(e) =>
                    setCondition(e.target.checked ? { action: "show", field: "", comparison: "equals", value: "" } : null)
                  }
                  className="w-4 h-4 rounded accent-[#0a1624]"
                />
                aktiv
              </label>
            </div>
            {condition && (
              <div className="grid grid-cols-2 gap-2">
                <select value={condition.action} onChange={(e) => setCondition({ ...condition, action: e.target.value })} className={`${inputClass} py-1.5`}>
                  <option value="show">Anzeigen wenn</option>
                  <option value="hide">Verbergen wenn</option>
                  <option value="require">Pflicht wenn</option>
                </select>
                <select value={condition.field} onChange={(e) => setCondition({ ...condition, field: e.target.value })} className={`${inputClass} py-1.5`}>
                  <option value="">Feld waehlen…</option>
                  {otherFields.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.translations[locale]?.label ??
                        f.translations.de?.label ??
                        f.name}
                    </option>
                  ))}
                </select>
                <select value={condition.comparison} onChange={(e) => setCondition({ ...condition, comparison: e.target.value })} className={`${inputClass} py-1.5`}>
                  <option value="equals">ist gleich</option>
                  <option value="notEquals">ist ungleich</option>
                  <option value="isNotEmpty">ist ausgefuellt</option>
                  <option value="isEmpty">ist leer</option>
                </select>
                <input value={condition.value} placeholder="Wert" onChange={(e) => setCondition({ ...condition, value: e.target.value })} className={`${inputClass} py-1.5`} />
              </div>
            )}
          </div>
        </>
      )}

      <button
        onClick={save}
        disabled={busy}
        className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {t("common.save")}
      </button>
    </div>
  );
}

function slug(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
