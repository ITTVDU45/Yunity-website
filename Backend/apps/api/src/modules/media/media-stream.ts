import type { Response } from "express";
import { pipeline } from "node:stream/promises";
import type { OpenMediaFile } from "./media.service";

function contentDisposition(filename: string): string {
  const normalized = filename.replace(/[\uD800-\uDFFF]/g, "_");
  const ascii = normalized
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/["\\]/g, "_");
  return `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(normalized)}`;
}

/** Streamt private Bucket-Inhalte mit sicheren Browser-Headern. */
export async function streamMediaFile(
  response: Response,
  file: OpenMediaFile,
  cacheControl: string,
): Promise<void> {
  response.status(200);
  response.setHeader("Content-Type", file.asset.mimeType);
  response.setHeader("Content-Length", String(file.asset.fileSize));
  response.setHeader(
    "Content-Disposition",
    contentDisposition(file.asset.originalFilename),
  );
  response.setHeader("Cache-Control", cacheControl);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader(
    "Content-Security-Policy",
    "sandbox; default-src 'none'; style-src 'unsafe-inline'",
  );

  try {
    await pipeline(file.stream, response);
  } catch (error: unknown) {
    if (!response.headersSent) {
      throw error;
    }
    response.destroy();
  }
}
