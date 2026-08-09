import { CORE_BLOCKS } from "./blocks";
import type { BlockDefinition, BlockMeta } from "./types";

export type { BlockDefinition, BlockMeta, BlockCategory } from "./types";
export {
  CORE_BLOCKS,
  actionSchema,
  sectionHeaderSchema,
  SELECTION_MODES,
  COLLECTION_BLOCK_KINDS,
} from "./blocks";

/**
 * Statische Block-Registry. Alle registrierten Bloecke stammen aus CORE_BLOCKS
 * (kein import-order-abhaengiges Nebenwirkungs-Registrieren). Die Datenbank
 * speichert nur blockType + schemaVersion + validierte Daten — niemals Code.
 */
const registry: ReadonlyMap<string, BlockDefinition> = new Map(
  CORE_BLOCKS.map((block) => [block.key, block]),
);

export function getBlock(key: string): BlockDefinition | undefined {
  return registry.get(key);
}

export function isKnownBlock(key: string): boolean {
  return registry.has(key);
}

export function listBlocks(): BlockDefinition[] {
  return [...registry.values()];
}

/** Schlanke Metadaten fuer die Admin-UI (ohne Zod-Schema, JSON-serialisierbar). */
export function listBlockMeta(): BlockMeta[] {
  return CORE_BLOCKS.map((block) => ({
    key: block.key,
    label: block.label,
    category: block.category,
    schemaVersion: block.schemaVersion,
    editorComponent: block.editorComponent,
    defaultValue: block.defaultValue,
  }));
}

export interface BlockValidationIssue {
  path: string;
  message: string;
}

export type BlockValidationResult =
  | { success: true; data: unknown }
  | { success: false; issues: BlockValidationIssue[] };

/**
 * Validiert die Inhaltsdaten einer Sektion gegen das Schema ihres Blocktyps.
 * Unbekannte Blocktypen sind ein Fehler beim Schreiben (im oeffentlichen
 * Renderer werden sie dagegen still uebersprungen).
 */
export function validateBlockData(
  key: string,
  data: unknown,
): BlockValidationResult {
  const block = registry.get(key);
  if (!block) {
    return {
      success: false,
      issues: [{ path: "", message: `Unbekannter Blocktyp "${key}".` }],
    };
  }

  const result = block.schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

/** Startwert einer neuen Sektion; leeres Objekt bei unbekanntem Blocktyp. */
export function defaultBlockData(key: string): unknown {
  return registry.get(key)?.defaultValue ?? {};
}
