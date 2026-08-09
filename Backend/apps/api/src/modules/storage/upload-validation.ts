/** Serverseitige Upload-Regeln. Rein funktional, ohne Storage-Abhaengigkeit. */

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB

/** Erlaubte MIME-Typen → zugehoerige Dateiendungen. */
export const ALLOWED_MIME_TYPES: Readonly<Record<string, readonly string[]>> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
  "image/gif": ["gif"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
};

export interface UploadValidationInput {
  filename: string;
  mimeType: string;
  size: number;
}

export interface UploadValidationError {
  field: "filename" | "mimeType" | "size";
  message: string;
}

export function extractExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0 || dot === filename.length - 1) {
    return "";
  }
  return filename.slice(dot + 1).toLowerCase();
}

/** Prueft MIME-Allowlist, Groesse und Endungs-Konsistenz vor dem Presign. */
export function validateUpload(
  input: UploadValidationInput,
): UploadValidationError | null {
  if (
    input.filename.length === 0 ||
    input.filename.length > 255 ||
    /[\u0000\r\n]/.test(input.filename)
  ) {
    return { field: "filename", message: "Ungueltiger Dateiname." };
  }
  const allowedExtensions = ALLOWED_MIME_TYPES[input.mimeType];
  if (!allowedExtensions) {
    return { field: "mimeType", message: "Dateityp ist nicht erlaubt." };
  }
  if (!Number.isFinite(input.size) || input.size <= 0) {
    return { field: "size", message: "Ungueltige Dateigroesse." };
  }
  if (input.size > MAX_UPLOAD_BYTES) {
    return {
      field: "size",
      message: `Datei ist zu gross (max. ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))} MB).`,
    };
  }
  const extension = extractExtension(input.filename);
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      field: "filename",
      message: "Dateiendung passt nicht zum Dateityp.",
    };
  }
  return null;
}

/**
 * Verifiziert den tatsaechlichen Dateiinhalt anhand der Magic Bytes.
 * Verhindert, dass ein falsch deklarierter MIME-Typ durchrutscht.
 * SVG ist textbasiert und wird gesondert (Praefix-Heuristik) geprueft.
 */
export function magicBytesMatchMime(
  header: Buffer,
  mimeType: string,
): boolean {
  const startsWith = (...bytes: number[]): boolean =>
    bytes.every((byte, index) => header[index] === byte);

  switch (mimeType) {
    case "image/jpeg":
      return startsWith(0xff, 0xd8, 0xff);
    case "image/png":
      return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "image/gif":
      return startsWith(0x47, 0x49, 0x46, 0x38); // "GIF8"
    case "application/pdf":
      return startsWith(0x25, 0x50, 0x44, 0x46); // "%PDF"
    case "image/webp":
      // "RIFF"...."WEBP"
      return (
        startsWith(0x52, 0x49, 0x46, 0x46) &&
        header[8] === 0x57 &&
        header[9] === 0x45 &&
        header[10] === 0x42 &&
        header[11] === 0x50
      );
    case "image/avif": {
      // ....ftyp....avif/avis (Box-Signatur ab Offset 4)
      const brand = header.subarray(4, 12).toString("ascii");
      return brand.startsWith("ftyp") && brand.includes("av");
    }
    case "image/svg+xml": {
      const text = header.toString("utf8").trimStart().toLowerCase();
      return text.startsWith("<svg") || text.startsWith("<?xml");
    }
    default:
      return false;
  }
}
