/** Projektneutrale Hilfsfunktionen (Slugs, Sortier-Positionen). */

/**
 * Entfernt Schluessel mit undefined-Wert. Notwendig vor dem Merge von DTOs:
 * class-transformer instanziiert verschachtelte DTOs mit allen deklarierten
 * optionalen Feldern als undefined — ein direktes Spread wuerde bestehende
 * Werte ueberschreiben.
 */
export function stripUndefined<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T;
}

const GERMAN_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/ä/g, "ae"],
  [/ö/g, "oe"],
  [/ü/g, "ue"],
  [/ß/g, "ss"],
  [/ç/g, "c"],
  [/ğ/g, "g"],
  [/ı/g, "i"],
  [/ş/g, "s"],
];

/** Erzeugt einen URL-sicheren Slug (de/tr-Umlaute transliteriert). */
export function slugify(input: string): string {
  let value = input.trim().toLowerCase();
  for (const [pattern, replacement] of GERMAN_REPLACEMENTS) {
    value = value.replace(pattern, replacement);
  }
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Abstand des Lueckensystems fuer Sortier-Positionen (1000, 2000, ...). */
export const POSITION_GAP = 1000;

/** Naechste Position am Listenende. */
export function nextPosition(existing: readonly number[]): number {
  if (existing.length === 0) {
    return POSITION_GAP;
  }
  return Math.max(...existing) + POSITION_GAP;
}

/**
 * Position zwischen zwei Nachbarn. Liefert null, wenn keine Luecke mehr frei
 * ist — dann muss der Aufrufer normalisieren.
 */
export function positionBetween(before: number, after: number): number | null {
  const candidate = Math.floor((before + after) / 2);
  if (candidate <= before || candidate >= after) {
    return null;
  }
  return candidate;
}

/** Normalisiert Positionen zurueck auf das Lueckensystem (stabile Reihenfolge). */
export function normalizePositions<T extends { position: number }>(
  items: readonly T[],
): T[] {
  return [...items]
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({ ...item, position: (index + 1) * POSITION_GAP }));
}
