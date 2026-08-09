import type { z } from "zod";

export type BlockCategory =
  | "header"
  | "content"
  | "collection"
  | "interaction"
  | "layout";

export interface BlockDefinition {
  key: string;
  label: string;
  category: BlockCategory;
  schemaVersion: number;
  /** Validiert die uebersetzbaren Inhaltsdaten (data[locale]). */
  schema: z.ZodTypeAny;
  /** Gueltiger Startwert bei "Sektion hinzufuegen". */
  defaultValue: unknown;
  /** Name der Editor-Komponente im Admin (statisch registriert). */
  editorComponent: string;
  /** Name der Renderer-Komponente im oeffentlichen Frontend. */
  rendererKey: string;
  /** Migrationsfunktionen: zielVersion -> transform(alteDaten). */
  migrations?: Record<number, (data: unknown) => unknown>;
}

/** Schlanke Metadaten fuer die Admin-UI (ohne Zod-Schema). */
export interface BlockMeta {
  key: string;
  label: string;
  category: BlockCategory;
  schemaVersion: number;
  editorComponent: string;
  defaultValue: unknown;
}
