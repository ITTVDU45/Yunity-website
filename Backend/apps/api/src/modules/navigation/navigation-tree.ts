import type { NavigationItemResponse, NavigationItemType } from "@yunity/contracts";

/** Minimale Item-Struktur fuer den Baum-Aufbau (DB-unabhaengig, testbar). */
export interface FlatNavigationItem {
  id: string;
  parentId: string | null;
  type: NavigationItemType;
  label: string;
  translations: Record<string, string>;
  pageId: string | null;
  url: string | null;
  anchor: string | null;
  target: "SELF" | "BLANK";
  icon: string | null;
  cssClass: string | null;
  position: number;
  isVisible: boolean;
}

/**
 * Baut aus flachen Items den verschachtelten Navigationsbaum.
 * - sortiert je Ebene nach position
 * - verwaiste Items (unbekannter parentId) werden als Wurzel behandelt,
 *   damit fehlerhafte Referenzen nichts verschlucken
 * - optional wird auf sichtbare Items gefiltert (oeffentliche Ausgabe)
 */
export function buildNavigationTree(
  items: readonly FlatNavigationItem[],
  options: { onlyVisible?: boolean; locale?: string } = {},
): NavigationItemResponse[] {
  const known = new Set(items.map((item) => item.id));
  const childrenByParent = new Map<string | null, FlatNavigationItem[]>();

  for (const item of items) {
    if (options.onlyVisible && !item.isVisible) {
      continue;
    }
    const parentKey =
      item.parentId && known.has(item.parentId) ? item.parentId : null;
    const bucket = childrenByParent.get(parentKey) ?? [];
    bucket.push(item);
    childrenByParent.set(parentKey, bucket);
  }

  const toNode = (item: FlatNavigationItem): NavigationItemResponse => {
    const children = (childrenByParent.get(item.id) ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(toNode);
    const label =
      options.locale && item.translations[options.locale]
        ? item.translations[options.locale]
        : item.label;
    return {
      id: item.id,
      parentId: item.parentId,
      type: item.type,
      label,
      translations: item.translations,
      pageId: item.pageId,
      url: item.url,
      anchor: item.anchor,
      target: item.target,
      icon: item.icon,
      cssClass: item.cssClass,
      position: item.position,
      isVisible: item.isVisible,
      children,
    };
  };

  return (childrenByParent.get(null) ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(toNode);
}
