import type { NavigationItemResponse } from "@yunity/contracts";

export interface FlatEntry {
  id: string;
  parentId: string | null;
}

/** Tiefensuche-Reihenfolge (Eltern vor Kindern) fuer den Reorder-Aufruf. */
export function flattenTree(items: NavigationItemResponse[]): FlatEntry[] {
  const result: FlatEntry[] = [];
  const walk = (nodes: NavigationItemResponse[]): void => {
    for (const node of nodes) {
      result.push({ id: node.id, parentId: node.parentId });
      walk(node.children);
    }
  };
  walk(items);
  return result;
}

/** Vertauscht zwei benachbarte Geschwister im Baum (immutabel). */
export function moveSibling(
  items: NavigationItemResponse[],
  id: string,
  direction: -1 | 1,
): NavigationItemResponse[] {
  const swapIn = (
    nodes: NavigationItemResponse[],
  ): NavigationItemResponse[] => {
    const index = nodes.findIndex((node) => node.id === id);
    if (index !== -1) {
      const target = index + direction;
      if (target < 0 || target >= nodes.length) {
        return nodes;
      }
      const next = [...nodes];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    }
    return nodes.map((node) => ({
      ...node,
      children: swapIn(node.children),
    }));
  };
  return swapIn(items);
}
