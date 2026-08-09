"use client";

import { useEffect, useState } from "react";
import { ImageOff, Loader2, X } from "lucide-react";
import type { MediaAssetResponse } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";

function adminMediaUrl(asset: MediaAssetResponse): string {
  return `/api/v1/admin/media/${asset.id}/file`;
}

/** Kompakter Bildauswahl-Dialog auf Basis der Mediathek (Phase 3). */
export function MediaPicker({
  imageUrl,
  onSelect,
}: {
  imageUrl: string | null;
  onSelect: (assetId: string | null, url: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setLoading(true);
      void clientApi<MediaAssetResponse[]>("/api/v1/admin/media?type=image").then(
        (res) => {
          if (cancelled) {
            return;
          }
          if (res.success) {
            setAssets(res.data);
          }
          setLoading(false);
        }
      );
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [open]);

  return (
    <div>
      <span className="block text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
        Hauptbild
      </span>
      <div className="flex items-center gap-3">
        <div className="w-24 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Vorschau"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-6 h-6 text-zinc-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Bild waehlen
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => onSelect(null, null)}
              className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
            >
              Entfernen
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Bild waehlen
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                </div>
              ) : assets.length === 0 ? (
                <p className="text-center text-zinc-500 py-10 text-sm">
                  Keine Bilder in der Mediathek. Zuerst unter &quot;Medien&quot;
                  hochladen.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        onSelect(asset.id, adminMediaUrl(asset));
                        setOpen(false);
                      }}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-accent transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={adminMediaUrl(asset)}
                        alt={asset.originalFilename}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
