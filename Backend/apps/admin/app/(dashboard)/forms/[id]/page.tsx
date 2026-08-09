"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
} from "lucide-react";
import type { FormDetail, FormFieldDef } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { FieldEditor } from "@/components/forms/field-editor";
import { useAdminI18n } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

const FIELD_TYPES: { type: string; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "textarea", label: "Textbereich" },
  { type: "email", label: "E-Mail" },
  { type: "phone", label: "Telefon" },
  { type: "number", label: "Zahl" },
  { type: "date", label: "Datum" },
  { type: "time", label: "Uhrzeit" },
  { type: "select", label: "Dropdown" },
  { type: "radio", label: "Radio" },
  { type: "checkbox", label: "Checkbox" },
  { type: "checkbox-group", label: "Checkbox-Gruppe" },
  { type: "consent", label: "Zustimmung" },
  { type: "heading", label: "Ueberschrift" },
  { type: "paragraph", label: "Erklaerungstext" },
  { type: "divider", label: "Trennlinie" },
];

export default function FormBuilder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { locale } = useAdminI18n();
  const [form, setForm] = useState<FormDetail | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const load = useCallback(async () => {
    const res = await clientApi<FormDetail>(`/api/v1/admin/forms/${id}`);
    if (res.success) {
      setForm(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedField = useMemo(
    () => form?.fields.find((f) => f.id === selectedId) ?? null,
    [form, selectedId],
  );

  const addField = async (type: string) => {
    setAddOpen(false);
    setBusy(true);
    const res = await clientApi<FormDetail>(`/api/v1/admin/forms/${id}/fields`, {
      method: "POST",
      body: { type, locale },
    });
    setBusy(false);
    if (res.success) {
      setForm(res.data);
      const newest = res.data.fields[res.data.fields.length - 1];
      setSelectedId(newest?.id ?? null);
    } else {
      setError(res.error.message);
    }
  };

  const saveField = async (patch: Record<string, unknown>) => {
    if (!selectedId) return;
    setBusy(true);
    const res = await clientApi<FormDetail>(
      `/api/v1/admin/forms/${id}/fields/${selectedId}`,
      { method: "PATCH", body: patch },
    );
    setBusy(false);
    if (res.success) {
      setForm(res.data);
      setInfo("Feld gespeichert.");
    } else {
      setError(res.error.message);
    }
  };

  const deleteField = async (fieldId: string) => {
    if (!window.confirm("Feld loeschen?")) return;
    const res = await clientApi<FormDetail>(
      `/api/v1/admin/forms/${id}/fields/${fieldId}`,
      { method: "DELETE" },
    );
    if (res.success) {
      setForm(res.data);
      if (selectedId === fieldId) setSelectedId(null);
    } else {
      setError(res.error.message);
    }
  };

  const moveField = async (index: number, direction: -1 | 1) => {
    if (!form) return;
    const target = index + direction;
    if (target < 0 || target >= form.fields.length) return;
    const ordered = [...form.fields];
    const [moved] = ordered.splice(index, 1);
    ordered.splice(target, 0, moved);
    setForm({ ...form, fields: ordered });
    await clientApi(`/api/v1/admin/forms/${id}/reorder-fields`, {
      method: "POST",
      body: { orderedIds: ordered.map((f) => f.id) },
    });
  };

  if (!form) {
    return (
      <div className="p-16 flex justify-center">
        {error ? <p className="text-red-500">{error}</p> : <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />}
      </div>
    );
  }

  return (
    <div>
      <header className="sticky top-16 lg:top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/forms" className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Zurueck">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="font-black text-lg text-zinc-900 dark:text-white truncate">{form.name}</p>
              <p className="text-xs text-zinc-400 font-mono">{form.key}</p>
            </div>
          </div>
        </div>
        {(error || info) && (
          <p className={cn("mt-3 text-sm rounded-xl px-4 py-2", error ? "text-red-500 bg-red-50 dark:bg-red-950/30" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30")}>
            {error || info}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 p-4 lg:p-6">
        {/* Feldliste */}
        <aside className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Felder</h2>
            <div className="relative">
              <button onClick={() => setAddOpen((o) => !o)} className="p-1.5 rounded-lg bg-brand text-white hover:scale-105 transition-transform" aria-label="Feld hinzufuegen">
                <Plus className="w-4 h-4" />
              </button>
              {addOpen && (
                <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-xl z-50 p-2">
                  {FIELD_TYPES.map((ft) => (
                    <button key={ft.type} onClick={() => addField(ft.type)} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                      {ft.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {form.fields.length === 0 && <p className="text-xs text-zinc-400 py-4 text-center">Noch keine Felder.</p>}
            {form.fields.map((field, index) => (
              <div key={field.id} className={cn("group rounded-xl border transition-all", selectedId === field.id ? "border-brand bg-brand/5" : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                <div className="flex items-center gap-1 px-2 py-2">
                  <button onClick={() => setSelectedId(field.id)} className="flex-1 text-left min-w-0">
                    <span className="block text-sm font-bold truncate text-zinc-900 dark:text-white">
                      {field.translations[locale]?.label ??
                        field.translations.de?.label ??
                        field.name}
                      {field.required && <span className="text-red-400"> *</span>}
                    </span>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">{field.type}</span>
                  </button>
                  <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveField(index, -1)} className="text-zinc-400 hover:text-brand dark:hover:text-accent" aria-label="Nach oben"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveField(index, 1)} className="text-zinc-400 hover:text-brand dark:hover:text-accent" aria-label="Nach unten"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Feld-Editor */}
        <main className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 lg:p-8">
          {selectedField ? (
            <FieldEditor
              key={`${selectedField.id}-${locale}`}
              field={selectedField}
              otherFields={form.fields.filter((f) => f.id !== selectedField.id)}
              onSave={saveField}
              onDelete={() => deleteField(selectedField.id)}
              busy={busy}
            />
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center text-center">
              <p className="text-zinc-400 text-sm max-w-xs">Waehlen Sie links ein Feld oder fuegen Sie eines hinzu.</p>
            </div>
          )}
        </main>

        {/* Formular-Einstellungen */}
        <FormSettings
          key={`${form.id}-${locale}`}
          form={form}
          locale={locale}
          onSaved={setForm}
          onError={setError}
        />
      </div>
    </div>
  );
}

function FormSettings({
  form,
  locale,
  onSaved,
  onError,
}: {
  form: FormDetail;
  locale: "de" | "en" | "tr";
  onSaved: (form: FormDetail) => void;
  onError: (message: string) => void;
}) {
  const { t } = useAdminI18n();
  const translation = form.translations[locale] ?? form.translations.de ?? {};
  const [status, setStatus] = useState(form.status);
  const [successMessage, setSuccessMessage] = useState(translation.successMessage ?? "");
  const [consentText, setConsentText] = useState(translation.consentText ?? "");
  const [recipients, setRecipients] = useState(
    Array.isArray(form.notificationSettings.recipients) ? (form.notificationSettings.recipients as string[]).join(", ") : "",
  );
  const [honeypot, setHoneypot] = useState((form.spamSettings.honeypotField as string) ?? "");
  const [retentionDays, setRetentionDays] = useState(form.retentionDays != null ? String(form.retentionDays) : "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await clientApi<FormDetail>(`/api/v1/admin/forms/${form.id}`, {
      method: "PATCH",
      body: {
        locale,
        status,
        notificationSettings: {
          recipients: recipients.split(",").map((r) => r.trim()).filter(Boolean),
        },
        spamSettings: { honeypotField: honeypot || undefined },
        retentionDays: retentionDays ? Number(retentionDays) : null,
        translation: { successMessage, consentText },
      },
    });
    setSaving(false);
    if (res.success) onSaved(res.data);
    else onError(res.error.message);
  };

  const fieldClass = "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-accent/60 transition-all";
  const labelClass = "block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5";

  return (
    <aside className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-5 h-fit space-y-4">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Formular-Einstellungen</h2>
      {!form.translations[locale] && locale !== "de" && (
        <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-300 rounded-xl px-3 py-2">
          {t("common.languageFallback")}
        </p>
      )}
      <label className="block">
        <span className={labelClass}>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as FormDetail["status"])} className={fieldClass}>
          <option value="ACTIVE">Aktiv</option>
          <option value="DISABLED">Deaktiviert</option>
          <option value="ARCHIVED">Archiviert</option>
        </select>
      </label>
      <label className="block">
        <span className={labelClass}>Erfolgsnachricht</span>
        <textarea value={successMessage} rows={2} onChange={(e) => setSuccessMessage(e.target.value)} className={`${fieldClass} resize-y`} />
      </label>
      <label className="block">
        <span className={labelClass}>Einwilligungstext</span>
        <textarea value={consentText} rows={2} onChange={(e) => setConsentText(e.target.value)} className={`${fieldClass} resize-y`} />
      </label>
      <label className="block">
        <span className={labelClass}>Benachrichtigung an (E-Mails)</span>
        <input value={recipients} placeholder="a@kanzlei.de, b@kanzlei.de" onChange={(e) => setRecipients(e.target.value)} className={fieldClass} />
      </label>
      <label className="block">
        <span className={labelClass}>Honeypot-Feldname (Spam)</span>
        <input value={honeypot} placeholder="website" onChange={(e) => setHoneypot(e.target.value)} className={`${fieldClass} font-mono text-xs`} />
      </label>
      <label className="block">
        <span className={labelClass}>Aufbewahrung (Tage)</span>
        <input type="number" value={retentionDays} placeholder="unbegrenzt" onChange={(e) => setRetentionDays(e.target.value)} className={fieldClass} />
      </label>
      <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {t("common.save")}
      </button>
    </aside>
  );
}
