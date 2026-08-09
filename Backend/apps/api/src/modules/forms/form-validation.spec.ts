import {
  evaluateConditions,
  validateSubmission,
  type FieldDef,
} from "./form-validation";

function field(overrides: Partial<FieldDef>): FieldDef {
  return {
    id: "f1",
    type: "text",
    name: "field",
    required: false,
    isEnabled: true,
    validation: {},
    conditions: null,
    options: [],
    ...overrides,
  };
}

describe("validateSubmission", () => {
  test("Pflichtfeld ohne Wert erzeugt Fehler", () => {
    const result = validateSubmission(
      [field({ name: "name", required: true })],
      {},
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe("name");
  });

  test("E-Mail-Format wird geprueft", () => {
    const fields = [field({ name: "email", type: "email", required: true })];
    expect(validateSubmission(fields, { email: "keine-mail" }).valid).toBe(false);
    expect(validateSubmission(fields, { email: "a@b.de" }).valid).toBe(true);
  });

  test("min/maxLength werden angewendet", () => {
    const fields = [
      field({ name: "t", validation: { minLength: 3, maxLength: 5 } }),
    ];
    expect(validateSubmission(fields, { t: "ab" }).valid).toBe(false);
    expect(validateSubmission(fields, { t: "abcdef" }).valid).toBe(false);
    expect(validateSubmission(fields, { t: "abcd" }).valid).toBe(true);
  });

  test("Zahl wird gecastet und begrenzt", () => {
    const fields = [
      field({ name: "n", type: "number", validation: { min: 1, max: 10 } }),
    ];
    expect(validateSubmission(fields, { n: "5" }).cleaned.n).toBe(5);
    expect(validateSubmission(fields, { n: "20" }).valid).toBe(false);
  });

  test("Auswahl akzeptiert nur gueltige Optionen", () => {
    const fields = [
      field({
        name: "sel",
        type: "select",
        options: [
          { value: "a", isEnabled: true },
          { value: "b", isEnabled: true },
        ],
      }),
    ];
    expect(validateSubmission(fields, { sel: "a" }).valid).toBe(true);
    expect(validateSubmission(fields, { sel: "x" }).valid).toBe(false);
  });

  test("Layout- und Datei-Felder werden ignoriert", () => {
    const result = validateSubmission(
      [
        field({ name: "h", type: "heading", required: true }),
        field({ name: "f", type: "file", required: true }),
      ],
      {},
    );
    expect(result.valid).toBe(true);
  });

  test("Consent muss true sein, wenn erforderlich", () => {
    const fields = [field({ name: "c", type: "consent", required: true })];
    expect(validateSubmission(fields, { c: false }).valid).toBe(false);
    expect(validateSubmission(fields, { c: true }).valid).toBe(true);
  });

  test("unbekannte Felder landen nicht in cleaned", () => {
    const result = validateSubmission([field({ name: "known" })], {
      known: "x",
      evil: "y",
    });
    expect(result.cleaned).toEqual({ known: "x" });
  });

  test("unsichere oder ungueltige Regex-Muster werden geschlossen abgewiesen", () => {
    const unsafe = [
      field({ name: "unsafe", validation: { pattern: "(a+)+$" } }),
    ];
    const invalid = [
      field({ name: "invalid", validation: { pattern: "[" } }),
    ];

    expect(validateSubmission(unsafe, { unsafe: "aaaa!" }).valid).toBe(false);
    expect(validateSubmission(invalid, { invalid: "x" }).valid).toBe(false);
  });
});

describe("evaluateConditions", () => {
  const conditional = field({
    name: "cv",
    required: true,
    conditions: {
      action: "show",
      operator: "AND",
      rules: [{ field: "type", comparison: "equals", value: "career" }],
    },
  });

  test("show-Bedingung blendet Feld aus, wenn Regel nicht passt", () => {
    expect(evaluateConditions(conditional, { type: "other" }).visible).toBe(false);
    expect(evaluateConditions(conditional, { type: "career" }).visible).toBe(true);
  });

  test("verstecktes Pflichtfeld ist nicht pflichtig", () => {
    const result = validateSubmission([conditional], { type: "other" });
    expect(result.valid).toBe(true);
  });

  test("sichtbares Pflichtfeld bleibt pflichtig", () => {
    const result = validateSubmission([conditional], { type: "career" });
    expect(result.valid).toBe(false);
  });
});
