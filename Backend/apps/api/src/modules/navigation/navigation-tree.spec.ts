import { buildNavigationTree, type FlatNavigationItem } from "./navigation-tree";

function item(
  partial: Partial<FlatNavigationItem> & { id: string },
): FlatNavigationItem {
  return {
    parentId: null,
    type: "PAGE",
    label: partial.id,
    translations: {},
    pageId: null,
    url: null,
    anchor: null,
    target: "SELF",
    icon: null,
    cssClass: null,
    position: 1000,
    isVisible: true,
    ...partial,
  };
}

describe("buildNavigationTree", () => {
  test("verschachtelt Kinder unter ihren Eltern und sortiert nach position", () => {
    const tree = buildNavigationTree([
      item({ id: "b", position: 2000 }),
      item({ id: "a", position: 1000 }),
      item({ id: "a1", parentId: "a", position: 2000 }),
      item({ id: "a0", parentId: "a", position: 1000 }),
    ]);

    expect(tree.map((node) => node.id)).toEqual(["a", "b"]);
    expect(tree[0].children.map((node) => node.id)).toEqual(["a0", "a1"]);
  });

  test("verwaiste Items (unbekannter parentId) landen auf Wurzelebene", () => {
    const tree = buildNavigationTree([
      item({ id: "x", parentId: "missing" }),
    ]);
    expect(tree.map((node) => node.id)).toEqual(["x"]);
  });

  test("onlyVisible filtert unsichtbare Items", () => {
    const tree = buildNavigationTree(
      [
        item({ id: "visible", position: 1000 }),
        item({ id: "hidden", position: 2000, isVisible: false }),
      ],
      { onlyVisible: true },
    );
    expect(tree.map((node) => node.id)).toEqual(["visible"]);
  });

  test("locale waehlt das uebersetzte Label, sonst Fallback", () => {
    const tree = buildNavigationTree(
      [item({ id: "team", label: "Team", translations: { tr: "Ekip" } })],
      { locale: "tr" },
    );
    expect(tree[0].label).toBe("Ekip");

    const fallback = buildNavigationTree(
      [item({ id: "team", label: "Team", translations: {} })],
      { locale: "tr" },
    );
    expect(fallback[0].label).toBe("Team");
  });
});
