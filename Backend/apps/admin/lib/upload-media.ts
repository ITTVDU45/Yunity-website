"use client";

import type { MediaAssetResponse } from "@yunity/contracts";
import { clientApi } from "./client-api";

interface PresignResult {
  assetId: string;
  uploadUrl: string;
  storageKey: string;
}

/**
 * Der Datei-Body geht nie durch den /api-Rewrite, sondern per presign direkt in
 * den Bucket. Serverless-Plattformen deckeln den Request-Body ihrer Funktionen
 * (Vercel bei 4,5 MB); alles, was durch den Rewrite laeuft, scheitert oberhalb
 * dieser Grenze mit einem 413, bevor die API die Datei ueberhaupt sieht.
 * Deshalb gibt es hier bewusst keine Groessenschwelle und keinen zweiten Weg —
 * die Obergrenze setzt allein MAX_UPLOAD_BYTES in der API.
 */
export async function uploadMediaFile(file: File): Promise<MediaAssetResponse> {
  const presign = await clientApi<PresignResult>(
    "/api/v1/admin/media/presign",
    {
      method: "POST",
      body: { filename: file.name, mimeType: file.type, size: file.size },
    },
  );
  if (!presign.success) {
    throw new Error(presign.error.message);
  }

  const stored = await fetch(presign.data.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!stored.ok) {
    throw new Error(
      `Upload zum Speicher fehlgeschlagen (${stored.status}). Erlaubt der Bucket PUT von dieser Domain?`,
    );
  }

  // Erst hiernach ist das Asset nutzbar: die API vergleicht die abgelegte
  // Groesse mit der angekuendigten und setzt den Status.
  const complete = await clientApi<MediaAssetResponse>(
    `/api/v1/admin/media/${presign.data.assetId}/complete`,
    { method: "POST" },
  );
  if (!complete.success) {
    throw new Error(complete.error.message);
  }
  return complete.data;
}
