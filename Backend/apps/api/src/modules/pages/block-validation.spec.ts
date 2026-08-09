import {
  defaultBlockData,
  isKnownBlock,
  listBlocks,
  validateBlockData,
} from "@yunity/block-schemas";

// Der Sanitizer (sanitize-html) wird zur Laufzeit ueber die API geprueft — sein
// ESM-Transitiv-Import laesst sich hier nicht ohne Weiteres in Jest laden.

describe("block registry", () => {
  test("bekannte und unbekannte Blocktypen werden unterschieden", () => {
    expect(isKnownBlock("hero")).toBe(true);
    expect(isKnownBlock("does-not-exist")).toBe(false);
  });

  test("Standardwerte JEDES registrierten Blocks sind gegen ihr Schema gueltig", () => {
    // Ueber die gesamte Registry, nicht ueber eine Handauswahl: ein neuer Block
    // mit unpassendem defaultValue faellt so sofort auf.
    for (const block of listBlocks()) {
      const result = validateBlockData(block.key, defaultBlockData(block.key));
      expect({ key: block.key, ok: result.success }).toEqual({
        key: block.key,
        ok: true,
      });
    }
    expect(listBlocks().length).toBeGreaterThan(15);
  });

  test("unbekannte Felder werden abgelehnt (strict)", () => {
    const result = validateBlockData("hero", { title: "Hi", bogus: 1 });
    expect(result.success).toBe(false);
  });

  test("falsche Typen werden abgelehnt", () => {
    const result = validateBlockData("statistics", { items: "nope" });
    expect(result.success).toBe(false);
  });

  test("unbekannter Blocktyp ist ungueltig", () => {
    const result = validateBlockData("ghost", {});
    expect(result.success).toBe(false);
  });
});
