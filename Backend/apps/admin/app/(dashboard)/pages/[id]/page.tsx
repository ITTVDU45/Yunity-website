"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Eye,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import type {
  BlockMetaResponse,
  ContentSectionResponse,
  PageDetail,
} from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { BlockEditor, type BlockData } from "@/components/page-editor/block-editors";
import { StatusBadge } from "@/components/page-editor/status-badge";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/lib/admin-i18n";

interface SectionBuffer {
  data: BlockData;
  label: string;
  enabled: boolean;
  dirty: boolean;
}

interface ToastState {
  kind: "success" | "error";
  message: string;
}

export default function PageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { locale, t } = useAdminI18n();
  const [page, setPage] = useState<PageDetail | null>(null);
  const [blockTypes, setBlockTypes] = useState<BlockMetaResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<SectionBuffer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, kind: ToastState["kind"]) => {
    setToast({ message, kind });
  }, []);

  const showInfo = useCallback(
    (message: string) => {
      setError("");
      setInfo(message);
      showToast(message, "success");
    },
    [showToast],
  );

  const showError = useCallback(
    (message: string) => {
      setInfo("");
      setError(message);
      showToast(message, "error");
    },
    [showToast],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }
    const handle = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const load = useCallback(async () => {
    const res = await clientApi<PageDetail>(`/api/v1/admin/pages/${id}`);
    if (res.success) {
      setPage(res.data);
      setError("");
    } else {
      setError(res.error.message);
    }
  }, [id]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load();
      void clientApi<BlockMetaResponse[]>("/api/v1/admin/block-types").then(
        (res) => {
          if (res.success) setBlockTypes(res.data);
        },
      );
    }, 0);
    return () => window.clearTimeout(handle);
  }, [load]);

  const selectedSection = useMemo(
    () => page?.sections.find((section) => section.id === selectedId) ?? null,
    [page, selectedId],
  );

  const openSection = (section: ContentSectionResponse) => {
    setSelectedId(section.id);
    setBuffer({
      data:
        (section.data[locale] as BlockData | undefined) ??
        (section.data.de as BlockData | undefined) ??
        {},
      label: section.internalLabel ?? "",
      enabled: section.isEnabled,
      dirty: false,
    });
  };

  useEffect(() => {
    if (!selectedId || !page) {
      return;
    }
    const handle = window.setTimeout(() => {
      const section = page.sections.find((item) => item.id === selectedId);
      if (section) {
        openSection(section);
      }
    }, 0);
    return () => window.clearTimeout(handle);
    // Der Locale-Wechsel soll den Editorpuffer bewusst neu laden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const saveCurrentSection = useCallback(async (
    options: { announce?: boolean } = {},
  ): Promise<boolean> => {
    if (!buffer || !selectedId || !buffer.dirty) {
      return true;
    }
    const shouldAnnounce = options.announce ?? true;
    const sectionId = selectedId;
    const currentBuffer = buffer;
    setBusy(true);
    setError("");
    const res = await clientApi<ContentSectionResponse>(
      `/api/v1/admin/pages/${id}/sections/${sectionId}`,
      {
        method: "PATCH",
        body: {
          locale,
          data: currentBuffer.data,
          internalLabel: currentBuffer.label || null,
          isEnabled: currentBuffer.enabled,
        },
      },
    );
    setBusy(false);
    if (res.success) {
      setPage((current) =>
        current
          ? {
              ...current,
              sections: current.sections.map((section) =>
                section.id === res.data.id ? res.data : section,
              ),
            }
          : current,
      );
      setBuffer((current) => {
        if (
          !current ||
          current.data !== currentBuffer.data ||
          current.label !== currentBuffer.label ||
          current.enabled !== currentBuffer.enabled
        ) {
          return current;
        }
        return { ...current, dirty: false };
      });
      if (shouldAnnounce) {
        showInfo(t("pages.sectionSaved"));
      }
      return true;
    } else {
      showError(res.error.message);
      return false;
    }
  }, [buffer, selectedId, id, locale, t, showInfo, showError]);

  const saveSection = useCallback(async () => {
    await saveCurrentSection({ announce: true });
  }, [saveCurrentSection]);

  const addSection = async (blockType: string) => {
    setAddOpen(false);
    setBusy(true);
    const res = await clientApi<ContentSectionResponse>(
      `/api/v1/admin/pages/${id}/sections`,
      { method: "POST", body: { blockType } },
    );
    setBusy(false);
    if (res.success) {
      await load();
      openSection(res.data);
    } else {
      showError(res.error.message);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!window.confirm("Sektion wirklich loeschen?")) {
      return;
    }
    const res = await clientApi(
      `/api/v1/admin/pages/${id}/sections/${sectionId}`,
      { method: "DELETE" },
    );
    if (res.success) {
      if (selectedId === sectionId) {
        setSelectedId(null);
        setBuffer(null);
      }
      void load();
    } else {
      showError(res.error.message);
    }
  };

  const duplicateSection = async (sectionId: string) => {
    const res = await clientApi(
      `/api/v1/admin/pages/${id}/sections/${sectionId}/duplicate`,
      { method: "POST" },
    );
    if (res.success) {
      void load();
    } else {
      showError(res.error.message);
    }
  };

  const moveSection = async (index: number, direction: -1 | 1) => {
    if (!page || busy) {
      return;
    }
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) {
      return;
    }
    const ordered = [...page.sections];
    const [moved] = ordered.splice(index, 1);
    ordered.splice(target, 0, moved);
    const previousPage = page;
    setPage({ ...page, sections: ordered });
    setBusy(true);
    setError("");
    setInfo("");
    const res = await clientApi(`/api/v1/admin/pages/${id}/reorder-sections`, {
      method: "POST",
      body: { orderedIds: ordered.map((section) => section.id) },
    });
    setBusy(false);
    if (res.success) {
      showInfo(t("pages.orderSaved"));
    } else {
      setPage(previousPage);
      showError(res.error.message);
    }
  };

  const runWorkflow = async (action: string) => {
    if (action === "publish" && buffer?.dirty) {
      const saved = await saveCurrentSection({ announce: false });
      if (!saved) {
        return;
      }
    }
    setBusy(true);
    setError("");
    const res = await clientApi<PageDetail>(
      `/api/v1/admin/pages/${id}/workflow`,
      { method: "POST", body: { action } },
    );
    setBusy(false);
    if (res.success) {
      setPage(res.data);
      showInfo(
        action === "publish"
          ? t("pages.published")
          : `Aktion "${action}" ausgefuehrt.`,
      );
    } else {
      showError(res.error.message);
    }
  };

  const openPreview = async () => {
    const res = await clientApi<{ token: string }>(
      `/api/v1/admin/pages/${id}/preview-token`,
      { method: "POST" },
    );
    if (res.success) {
      window.open(
        `/api/v1/public/pages/preview/${res.data.token}?locale=${locale}`,
        "_blank",
        "noopener",
      );
    } else {
      showError(res.error.message);
    }
  };

  if (!page) {
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
    <div className="flex flex-col min-h-screen">
      {toast && (
        <div
          aria-live="polite"
          className={cn(
            "fixed right-4 top-4 z-[120] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur",
            toast.kind === "error"
              ? "border-red-100 bg-white text-red-600 shadow-red-950/10 dark:border-red-900/40 dark:bg-zinc-900"
              : "border-emerald-100 bg-white text-emerald-700 shadow-emerald-950/10 dark:border-emerald-900/40 dark:bg-zinc-900 dark:text-emerald-300",
          )}
        >
          {toast.kind === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-16 lg:top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/pages"
              className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Zurueck"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="font-black text-lg text-zinc-900 dark:text-white truncate">
                {page.internalName}
              </p>
              <div className="flex items-center gap-2">
                <StatusBadge status={page.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openPreview}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {t("common.preview")}
            </button>
            {page.status === "DRAFT" && (
              <button
                onClick={() => runWorkflow("submitForReview")}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                Zur Pruefung
              </button>
            )}
            {page.status !== "ARCHIVED" && (
              <button
                onClick={() => runWorkflow("publish")}
                disabled={busy}
                className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-60"
              >
                <Upload className="w-4 h-4" />
                {page.status === "PUBLISHED"
                  ? t("common.publishChanges")
                  : t("common.publish")}
              </button>
            )}
            {page.status === "PUBLISHED" && (
              <button
                onClick={() => runWorkflow("unpublish")}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                <Undo2 className="w-4 h-4" />
                Zurueckziehen
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

      {/* 3-Spalten */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 p-4 lg:p-6">
        {/* Sektionen */}
        <aside className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              Sektionen
            </h2>
            <div className="relative">
              <button
                onClick={() => setAddOpen((open) => !open)}
                className="p-1.5 rounded-lg bg-brand text-white hover:scale-105 transition-transform"
                aria-label="Sektion hinzufuegen"
              >
                <Plus className="w-4 h-4" />
              </button>
              {addOpen && (
                <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-xl z-50 p-2">
                  {blockTypes.map((block) => (
                    <button
                      key={block.key}
                      onClick={() => addSection(block.key)}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      {block.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            {page.sections.length === 0 && (
              <p className="text-xs text-zinc-400 py-4 text-center">
                Noch keine Sektionen.
              </p>
            )}
            {page.sections.map((section, index) => (
              <div
                key={section.id}
                className={cn(
                  "group rounded-xl border transition-all",
                  selectedId === section.id
                    ? "border-brand bg-brand/5"
                    : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                )}
              >
                <div className="flex items-center gap-1 px-2 py-2">
                  <button
                    onClick={() => openSection(section)}
                    className="flex-1 text-left min-w-0"
                  >
                    <span
                      className={cn(
                        "block text-sm font-bold truncate",
                        section.isEnabled
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-400 line-through",
                      )}
                    >
                      {section.internalLabel ?? section.blockType}
                    </span>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {section.blockType}
                    </span>
                  </button>
                  <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveSection(index, -1)}
                      className="text-zinc-400 hover:text-brand dark:hover:text-accent"
                      aria-label="Nach oben"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(index, 1)}
                      className="text-zinc-400 hover:text-brand dark:hover:text-accent"
                      aria-label="Nach unten"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <main className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 lg:p-8">
          {selectedSection && buffer ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-accent">
                    {selectedSection.blockType}
                  </p>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                    Sektion bearbeiten
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateSection(selectedSection.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-brand dark:hover:text-accent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Duplizieren"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSection(selectedSection.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    aria-label="Loeschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!selectedSection.data[locale] && locale !== "de" && (
                <p className="border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
                  {t("common.languageFallback")}
                </p>
              )}

              <BlockEditor
                blockType={selectedSection.blockType}
                data={buffer.data}
                onChange={(data) => setBuffer({ ...buffer, data, dirty: true })}
              />

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={buffer.enabled}
                    onChange={(event) =>
                      setBuffer({
                        ...buffer,
                        enabled: event.target.checked,
                        dirty: true,
                      })
                    }
                    className="w-4 h-4 rounded accent-[#0a1624]"
                  />
                  Sektion aktiv
                </label>
                <button
                  onClick={saveSection}
                  disabled={busy || !buffer.dirty}
                  className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save className="w-4 h-4" />
                  {buffer.dirty ? t("common.save") : t("common.saved")}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
              <p className="text-zinc-400 text-sm max-w-xs">
                Waehlen Sie links eine Sektion aus oder fuegen Sie eine neue
                hinzu, um sie zu bearbeiten.
              </p>
            </div>
          )}
        </main>

        {/* Seiteneinstellungen */}
        <PageSettings
          key={`${page.id}-${locale}`}
          page={page}
          locale={locale}
          onBeforeSave={() => saveCurrentSection({ announce: false })}
          onSaved={setPage}
          onInfo={showInfo}
          onError={showError}
        />
      </div>
    </div>
  );
}

function PageSettings({
  page,
  locale,
  onBeforeSave,
  onSaved,
  onInfo,
  onError,
}: {
  page: PageDetail;
  locale: "de" | "en" | "tr";
  onBeforeSave: () => Promise<boolean>;
  onSaved: (page: PageDetail) => void;
  onInfo: (message: string) => void;
  onError: (message: string) => void;
}) {
  const { t } = useAdminI18n();
  const translation = page.translations[locale] ?? page.translations.de ?? {};
  const [title, setTitle] = useState(translation.title ?? "");
  const [slug, setSlug] = useState(translation.slug ?? "");
  const [metaTitle, setMetaTitle] = useState(translation.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    translation.metaDescription ?? "",
  );
  const [isHomepage, setIsHomepage] = useState(page.isHomepage);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const canContinue = await onBeforeSave();
    if (!canContinue) {
      setSaving(false);
      return;
    }
    const res = await clientApi<PageDetail>(`/api/v1/admin/pages/${page.id}`, {
      method: "PATCH",
      body: {
        locale,
        isHomepage,
        translation: { title, slug, metaTitle, metaDescription },
      },
    });
    setSaving(false);
    if (res.success) {
      onSaved(res.data);
      onInfo(t("common.saved"));
    } else {
      onError(res.error.message);
    }
  };

  const fieldClass =
    "w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all";
  const labelClass =
    "block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5";

  return (
    <aside className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-5 h-fit space-y-4">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
        Seiteneinstellungen
      </h2>
      <label className="block">
        <span className={labelClass}>Titel</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Slug</span>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={`${fieldClass} font-mono text-xs`}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Meta-Titel</span>
        <input
          value={metaTitle}
          onChange={(event) => setMetaTitle(event.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Meta-Beschreibung</span>
        <textarea
          value={metaDescription}
          rows={3}
          onChange={(event) => setMetaDescription(event.target.value)}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
        <input
          type="checkbox"
          checked={isHomepage}
          onChange={(event) => setIsHomepage(event.target.checked)}
          className="w-4 h-4 rounded accent-[#0a1624]"
        />
        Als Startseite verwenden
      </label>
      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {t("common.save")}
      </button>
    </aside>
  );
}
