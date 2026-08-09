import { stripUndefined } from "@yunity/utilities";

describe("stripUndefined", () => {
  test("entfernt undefined-Felder (DTO-Merge-Schutz)", () => {
    const dtoLike = {
      title: undefined,
      slug: undefined,
      excerpt: "Nur dieses Feld",
    };
    expect(stripUndefined(dtoLike)).toEqual({ excerpt: "Nur dieses Feld" });
  });

  test("behaelt null und leere Strings (nur undefined faellt weg)", () => {
    expect(stripUndefined({ a: null, b: "", c: 0, d: undefined })).toEqual({
      a: null,
      b: "",
      c: 0,
    });
  });

  test("gemergt ueber Bestandswerte gehen keine Felder verloren", () => {
    const current = { title: "Bestand", slug: "bestand" };
    const incoming = stripUndefined({ title: undefined, excerpt: "neu" });
    expect({ ...current, ...incoming }).toEqual({
      title: "Bestand",
      slug: "bestand",
      excerpt: "neu",
    });
  });
});
