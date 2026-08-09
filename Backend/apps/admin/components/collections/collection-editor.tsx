"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Undo2, Upload } from "lucide-react";
import type {
  ApiError,
  CollectionDetail,
  CollectionRelations,
} from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import {
  ItemsField,
  StringListField,
  TextAreaField,
  TextField,
} from "@/components/page-editor/fields";
import { StatusBadge } from "@/components/page-editor/status-badge";
import { cn } from "@/lib/utils";
import type { CollectionModuleConfig } from "./config";
import { ContactFieldsEditor } from "./contact-fields-editor";
import { MediaPicker } from "./media-picker";
import { RelationPicker } from "./relation-picker";
import { useAdminI18n } from "@/lib/admin-i18n";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Ohne die Feldnamen ist "Attribute sind ungueltig." nicht behebbar. */
function errorText(error: ApiError): string {
  if (!error.details?.length) {
    return error.message;
  }
  const fields = error.details
    .map((detail) =>
      detail.field ? `${detail.field}: ${detail.message}` : detail.message,
    )
    .join(" · ");
  return `${error.message} (${fields})`;
}

export function CollectionEditor({
  config,
  id,
}: {
  config: CollectionModuleConfig;
  id: string;
}) {
  const { locale, t } = useAdminI18n();
  const base = `/api/v1/admin/collections/${config.kind}`;
  const [item, setItem] = useState<CollectionDetail | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // Editierpuffer
  const [translation, setTranslation] = useState<Record<string, unknown>>({});
  const [attributes, setAttributes] = useState<Record<string, unknown>>({});
  const [relations, setRelations] = useState<CollectionRelations>({});
  const [featured, setFeatured] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await clientApi<CollectionDetail>(`${base}/${id}`);
    if (res.success) {
      const data = res.data;
      setItem(data);
      setTranslation(
        (data.translations[locale] ?? data.translations.de ?? {}) as Record<
          string,
          unknown
        >,
      );
      setAttributes(data.attributes ?? {});
      setRelations(data.relations ?? {});
      setFeatured(data.featured);
      setImageId(data.imageId);
      setImageUrl(data.imageUrl);
      setError("");
    } else {
      setError(errorText(res.error));
    }
  }, [base, id, locale]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setError("");
    const res = await clientApi<CollectionDetail>(`${base}/${id}`, {
      method: "PATCH",
      body: {
        locale,
        translation,
        attributes,
        relations,
        featured,
        imageId,
      },
    });
    setBusy(false);
    if (res.success) {
      setItem(res.data);
      setInfo("Gespeichert.");
    } else {
      setError(errorText(res.error));
    }
  };

  const runWorkflow = async (action: string) => {
    setBusy(true);
    const res = await clientApi<CollectionDetail>(`${base}/${id}/workflow`, {
      method: "POST",
      body: { action },
    });
    setBusy(false);
    if (res.success) {
      setItem(res.data);
      setInfo(`Aktion „${action}" ausgefuehrt.`);
    } else {
      setError(errorText(res.error));
    }
  };

  const setAttr = (key: string, value: unknown) => {
    setAttributes((current) => {
      const next = { ...current };
      if (value === undefined || value === "" || value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const setTrans = (key: string, value: string) =>
    setTranslation((current) => ({ ...current, [key]: value }));

  const details =
    translation.details && typeof translation.details === "object"
      ? (translation.details as Record<string, unknown>)
      : {};

  const setDetail = (key: string, value: unknown) => {
    setTranslation((current) => {
      const currentDetails =
        current.details && typeof current.details === "object"
          ? (current.details as Record<string, unknown>)
          : {};
      const nextDetails = { ...currentDetails };
      if (value === undefined || value === "" || value === null) {
        delete nextDetails[key];
      } else {
        nextDetails[key] = value;
      }
      return { ...current, details: nextDetails };
    });
  };

  const transString = (key: string) =>
    typeof translation[key] === "string" ? (translation[key] as string) : "";

  if (!item) {
    return (
      <div className="p-16 flex justify-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-16 lg:top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/collections/${config.kind}`}
              className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Zurueck"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="font-black text-lg text-zinc-900 dark:text-white truncate">
                {transString("title") || config.singular}
              </p>
              <StatusBadge status={item.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {t("common.save")}
            </button>
            {item.status === "PUBLISHED" ? (
              <button
                onClick={() => runWorkflow("unpublish")}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                <Undo2 className="w-4 h-4" />
                Zurueckziehen
              </button>
            ) : (
              <button
                onClick={async () => {
                  await save();
                  await runWorkflow("publish");
                }}
                disabled={busy}
                className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-60"
              >
                <Upload className="w-4 h-4" />
                {t("common.publish")}
              </button>
            )}
          </div>
        </div>
        {(error || info) && (
          <p
            className={cn(
              "mt-3 text-sm rounded-xl px-4 py-2",
              error
                ? "text-red-500 bg-red-50 dark:bg-red-950/30"
                : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
            )}
          >
            {error || info}
          </p>
        )}
      </header>

      <div className="p-4 lg:p-8 grid gap-6 lg:grid-cols-[1fr_360px] max-w-6xl">
        <div className="space-y-6">
          {!item.translations[locale] && locale !== "de" && (
            <p className="border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
              {t("common.languageFallback")}
            </p>
          )}
          <Card title="Inhalt">
            <TextField label="Titel" value={transString("title")} onChange={(v) => setTrans("title", v)} />
            <TextField label="Untertitel" value={transString("subtitle")} onChange={(v) => setTrans("subtitle", v)} />
            <TextField label="Slug" value={transString("slug")} onChange={(v) => setTrans("slug", v)} />
            <TextAreaField label="Kurztext (Teaser)" value={transString("excerpt")} onChange={(v) => setTrans("excerpt", v)} rows={2} />
            <TextAreaField label="Beschreibung (HTML)" value={transString("body")} onChange={(v) => setTrans("body", v)} rows={6} />
          </Card>

          {config.attributeFields.length > 0 && (
            <Card title="Details">
              {config.attributeFields.map((field) => {
                const fieldValues = field.localized ? details : attributes;
                const updateField = field.localized ? setDetail : setAttr;
                if (field.type === "list") {
                  const list = Array.isArray(fieldValues[field.key])
                    ? (fieldValues[field.key] as string[])
                    : [];
                  return (
                    <StringListField
                      key={field.key}
                      label={field.label}
                      items={list}
                      onChange={(items) => updateField(field.key, items)}
                    />
                  );
                }
                if (field.type === "objectList") {
                  const rows = Array.isArray(fieldValues[field.key])
                    ? (fieldValues[field.key] as Record<string, string>[])
                    : [];
                  return (
                    <ItemsField
                      key={field.key}
                      label={field.label}
                      items={rows}
                      subFields={field.subFields ?? []}
                      onChange={(items) => updateField(field.key, items)}
                    />
                  );
                }
                if (field.type === "textarea") {
                  return (
                    <TextAreaField
                      key={field.key}
                      label={field.label}
                      value={String(fieldValues[field.key] ?? "")}
                      onChange={(v) => updateField(field.key, v)}
                      rows={3}
                    />
                  );
                }
                return (
                  <TextField
                    key={field.key}
                    label={field.label}
                    value={String(fieldValues[field.key] ?? "")}
                    onChange={(v) =>
                      updateField(
                        field.key,
                        field.type === "number"
                          ? v === ""
                            ? undefined
                            : Number(v)
                          : v,
                      )
                    }
                  />
                );
              })}
            </Card>
          )}

          {config.contactOwnerType && (
            <Card title="Kontaktdaten">
              <ContactFieldsEditor
                ownerType={config.contactOwnerType}
                ownerId={item.id}
              />
            </Card>
          )}

          {config.relations.length > 0 && (
            <Card title="Verknuepfungen">
              {config.relations.map((relation) => (
                <RelationPicker
                  key={relation.key}
                  field={relation}
                  locale={locale}
                  selected={(relations[relation.key] as string[]) ?? []}
                  onChange={(ids) =>
                    setRelations((current) => ({
                      ...current,
                      [relation.key]: ids,
                    }))
                  }
                />
              ))}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Einstellungen">
            <MediaPicker
              imageUrl={imageUrl}
              onSelect={(assetId, url) => {
                setImageId(assetId);
                setImageUrl(url);
              }}
            />
            <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="w-4 h-4 rounded accent-[#0a1624]"
              />
              Hervorgehoben (z. B. Startseite)
            </label>
          </Card>

          <Card title="SEO">
            <TextField label="Meta-Titel" value={transString("metaTitle")} onChange={(v) => setTrans("metaTitle", v)} />
            <TextAreaField label="Meta-Beschreibung" value={transString("metaDescription")} onChange={(v) => setTrans("metaDescription", v)} rows={3} />
          </Card>
        </div>
      </div>
    </div>
  );
}
