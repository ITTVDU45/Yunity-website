"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all";

const labelClass =
  "block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
      />
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
    </label>
  );
}

export interface ActionValue {
  label?: string;
  href?: string;
}

export function ActionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ActionValue | undefined;
  onChange: (value: ActionValue | undefined) => void;
}) {
  const current = value ?? {};
  const update = (patch: Partial<ActionValue>) => {
    const next = { ...current, ...patch };
    if (!next.label && !next.href) {
      onChange(undefined);
    } else {
      onChange(next);
    }
  };
  return (
    <fieldset className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 space-y-3">
      <legend className="px-2 text-[11px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </legend>
      <TextField
        label="Beschriftung"
        value={current.label ?? ""}
        onChange={(v) => update({ label: v })}
      />
      <TextField
        label="Link (href)"
        value={current.href ?? ""}
        placeholder="/kontakt"
        onChange={(v) => update({ href: v })}
      />
    </fieldset>
  );
}

/** Editor fuer eine einfache Liste von Strings (z. B. Beratungsschwerpunkte). */
export function StringListField({
  label,
  items,
  onChange,
  addLabel = "Hinzufuegen",
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(event) =>
                onChange(
                  items.map((entry, i) =>
                    i === index ? event.target.value : entry,
                  ),
                )
              }
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
              aria-label="Entfernen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 flex items-center gap-2 text-sm font-bold text-brand dark:text-accent hover:opacity-80 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}

export interface ItemSubField {
  key: string;
  label: string;
  multiline?: boolean;
}

/** Editor fuer Listen gleichfoermiger Objekte (Statistik, Akkordeon …). */
export function ItemsField<T extends Record<string, string>>({
  label,
  items,
  subFields,
  onChange,
  addLabel = "Eintrag hinzufuegen",
}: {
  label: string;
  items: T[];
  subFields: ItemSubField[];
  onChange: (items: T[]) => void;
  addLabel?: string;
}) {
  const updateItem = (index: number, key: string, value: string) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  const addItem = () => {
    const empty = Object.fromEntries(
      subFields.map((field) => [field.key, ""]),
    ) as T;
    onChange([...items, empty]);
  };
  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 space-y-2 relative"
          >
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 transition-colors"
              aria-label="Eintrag entfernen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {subFields.map((field) =>
              field.multiline ? (
                <TextAreaField
                  key={field.key}
                  label={field.label}
                  rows={3}
                  value={item[field.key] ?? ""}
                  onChange={(v) => updateItem(index, field.key, v)}
                />
              ) : (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={item[field.key] ?? ""}
                  onChange={(v) => updateItem(index, field.key, v)}
                />
              ),
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-2 text-sm font-bold text-brand dark:text-accent hover:opacity-80 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}
