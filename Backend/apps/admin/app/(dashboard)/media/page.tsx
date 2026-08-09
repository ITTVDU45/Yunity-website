"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  ImageOff,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { MediaAssetResponse } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { uploadMediaFile } from "@/lib/upload-media";
import {
  type AdminLocale,
  useAdminI18n,
} from "@/lib/admin-i18n";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function adminMediaUrl(asset: MediaAssetResponse): string {
  return `/api/v1/admin/media/${asset.id}/file`;
}

export default function MediaPage() {
  const { locale } = useAdminI18n();
  const [assets, setAssets] = useState<MediaAssetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<MediaAssetResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await clientApi<MediaAssetResponse[]>(
      "/api/v1/admin/media?limit=48",
    );
    if (result.success) {
      setAssets(result.data);
      setError("");
    } else {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(handle);
  }, [load]);

  const uploadOne = useCallback(async (file: File) => {
    await uploadMediaFile(file);
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      setError("");
      try {
        for (const file of Array.from(files)) {
          await uploadOne(file);
        }
        await load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [uploadOne, load],
  );

  return (
    <div
      className="p-6 lg:p-10 space-y-8"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            Medien
          </h1>
          <p className="text-zinc-500 font-medium">
            Bilder und Dokumente hochladen und verwalten.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-3 bg-brand text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Wird hochgeladen…" : "Hochladen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Wird geladen…
        </div>
      ) : assets.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <ImageOff className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-500 text-sm max-w-sm">
            Noch keine Medien. Dateien hier ablegen oder auf &quot;Hochladen&quot;
            klicken.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelected(asset)}
              className="group text-left bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all"
            >
              <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {asset.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={adminMediaUrl(asset)}
                    alt={
                      asset.translations[locale]?.altText ??
                      asset.translations.de?.altText ??
                      asset.originalFilename
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-zinc-300" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {asset.originalFilename}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  {formatBytes(asset.fileSize)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MediaDetail
          key={`${selected.id}-${locale}`}
          asset={selected}
          locale={locale}
          onClose={() => setSelected(null)}
          onChanged={() => {
            setSelected(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function MediaDetail({
  asset,
  locale,
  onClose,
  onChanged,
}: {
  asset: MediaAssetResponse;
  locale: AdminLocale;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t } = useAdminI18n();
  const translation = asset.translations[locale] ?? asset.translations.de ?? {};
  const [altText, setAltText] = useState(translation.altText ?? "");
  const [title, setTitle] = useState(translation.title ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    const result = await clientApi(`/api/v1/admin/media/${asset.id}`, {
      method: "PATCH",
      body: { locale, translation: { altText, title } },
    });
    setSaving(false);
    if (result.success) {
      onChanged();
    } else {
      setError(result.error.message);
    }
  };

  const archive = async () => {
    setSaving(true);
    const result = await clientApi(`/api/v1/admin/media/${asset.id}/archive`, {
      method: "POST",
    });
    setSaving(false);
    if (result.success) {
      onChanged();
    } else {
      setError(result.error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-black text-lg uppercase tracking-tight text-zinc-900 dark:text-white">
            Medium bearbeiten
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-6">
          <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden">
            {asset.mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={adminMediaUrl(asset)}
                alt={altText || asset.originalFilename}
                className="w-full h-full object-contain"
              />
            ) : (
              <FileText className="w-16 h-16 text-zinc-300" />
            )}
          </div>
          <div className="space-y-4">
            {!asset.translations[locale] && locale !== "de" && (
              <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-300 rounded-xl px-3 py-2">
                {t("common.languageFallback")}
              </p>
            )}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                Dateiname
              </label>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 break-all">
                {asset.originalFilename}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {asset.mimeType} · {formatBytes(asset.fileSize)}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                Titel ({locale.toUpperCase()})
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                Alt-Text ({locale.toUpperCase()})
              </label>
              <textarea
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                rows={3}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40 resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => void save()}
                disabled={saving}
                className="flex-1 bg-brand text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              >
                {t("common.save")}
              </button>
              <button
                onClick={() => void archive()}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all font-bold text-xs"
                title="Archivieren"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
