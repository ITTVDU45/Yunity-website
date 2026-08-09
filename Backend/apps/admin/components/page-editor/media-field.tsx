"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageOff,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { MediaAssetResponse } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { uploadMediaFile } from "@/lib/upload-media";
import { useAdminI18n } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

type SectionMediaFieldProps = {
  label: string;
  mediaId: string;
  imageUrl: string;
  onSelect: (asset: MediaAssetResponse) => void;
  onRemove: () => void;
};

function assetAlt(asset: MediaAssetResponse, locale: string): string {
  return (
    asset.translations[locale]?.altText ??
    asset.translations.de?.altText ??
    asset.originalFilename
  );
}

function adminMediaUrl(asset: MediaAssetResponse): string {
  return `/api/v1/admin/media/${asset.id}/file`;
}

async function uploadImage(file: File): Promise<MediaAssetResponse> {
  return uploadMediaFile(file);
}

export function SectionMediaField({
  label,
  mediaId,
  imageUrl,
  onSelect,
  onRemove,
}: SectionMediaFieldProps) {
  const { locale } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetResponse[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetResponse | null>(
    null,
  );
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAsset = mediaId ? selectedAsset : null;
  const previewUrl = currentAsset ? adminMediaUrl(currentAsset) : imageUrl;
  const hasImage = Boolean(mediaId || imageUrl);

  const loadAssets = useCallback(async () => {
    setLoadingAssets(true);
    setError("");
    const params = new URLSearchParams({
      type: "image",
      limit: "60",
    });
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const result = await clientApi<MediaAssetResponse[]>(
      `/api/v1/admin/media?${params.toString()}`,
    );
    if (result.success) {
      setAssets(result.data);
    } else {
      setError(result.error.message);
    }
    setLoadingAssets(false);
  }, [search]);

  useEffect(() => {
    if (!mediaId) {
      return;
    }

    let cancelled = false;
    void clientApi<MediaAssetResponse>(`/api/v1/admin/media/${mediaId}`).then(
      (result) => {
        if (cancelled) {
          return;
        }
        if (result.success) {
          setSelectedAsset(result.data);
          setError("");
        } else {
          setSelectedAsset(null);
          setError(result.error.message);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [mediaId]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handle = window.setTimeout(() => {
      void loadAssets();
    }, search ? 180 : 0);
    return () => window.clearTimeout(handle);
  }, [loadAssets, open, search]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Bitte eine Bilddatei auswaehlen.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const asset = await uploadImage(file);
      onSelect(asset);
      setSelectedAsset(asset);
      setOpen(false);
      setSearch("");
      setAssets((current) => [asset, ...current]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-zinc-900 sm:w-44">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={currentAsset ? assetAlt(currentAsset, locale) : "Vorschau"}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageOff className="h-7 w-7 text-zinc-300" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                {currentAsset?.originalFilename ||
                  (imageUrl ? "Bestehendes Bild" : "Kein Bild ausgewaehlt")}
              </p>
              <p className="mt-1 break-all font-mono text-[11px] text-zinc-400">
                {mediaId || imageUrl || "Aus der Mediathek waehlen oder neu hochladen."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Mediathek
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-zinc-700 transition hover:border-accent/50 hover:text-accent disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Hochladen
              </button>
              {hasImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAsset(null);
                    onRemove();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Entfernen
                </button>
              )}
            </div>
          </div>
        </div>
        {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files?.[0])}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[84vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-zinc-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                  Bild auswaehlen
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Vorhandene Bilder einsehen oder direkt ein neues hochladen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Schliessen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 dark:border-zinc-800 sm:flex-row">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Dateiname suchen"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.01] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Hochladen
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {error && (
                <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500 dark:border-red-900/40 dark:bg-red-950/20">
                  {error}
                </p>
              )}
              {loadingAssets ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
                </div>
              ) : assets.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
                  <ImageOff className="mx-auto h-8 w-8 text-zinc-300" />
                  <p className="mt-3 text-sm text-zinc-500">
                    Keine Bilder gefunden. Laden Sie ein neues Bild hoch.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {assets.map((asset) => {
                    const active = asset.id === mediaId;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          onSelect(asset);
                          setSelectedAsset(asset);
                          setOpen(false);
                        }}
                        className={cn(
                          "group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-900",
                          active
                            ? "border-accent ring-2 ring-accent/20"
                            : "border-zinc-100 dark:border-zinc-800",
                        )}
                      >
                        <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={adminMediaUrl(asset)}
                            alt={assetAlt(asset, locale)}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                            {asset.originalFilename}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-zinc-400">
                            {asset.width && asset.height
                              ? `${asset.width} x ${asset.height}`
                              : asset.mimeType}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
