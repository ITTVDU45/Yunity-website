import { escapeRegex } from "./regex";

describe("escapeRegex", () => {
  test("behandelt Suchtext als Literal", () => {
    const escaped = escapeRegex("a.*(b)+");
    expect(new RegExp(escaped).test("a.*(b)+")).toBe(true);
    expect(new RegExp(escaped).test("anything-bbb")).toBe(false);
  });

  test("begrenzt die Eingabelaenge", () => {
    expect(escapeRegex("a".repeat(200))).toHaveLength(100);
  });
});
