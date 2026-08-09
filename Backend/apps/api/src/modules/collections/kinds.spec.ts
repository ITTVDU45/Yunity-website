import { KIND_CONFIG, isCollectionKind, permissionFor } from "./kinds";

describe("collection kinds", () => {
  test("alle Fachmodul- und Blog-Arten sind konfiguriert", () => {
    for (const kind of ["service", "industry", "testimonial", "blog"]) {
      expect(isCollectionKind(kind)).toBe(true);
    }
    expect(isCollectionKind("case-study")).toBe(false);
    // Arten aus dem Ursprungsprojekt duerfen nicht durchrutschen.
    expect(isCollectionKind("practice-area")).toBe(false);
  });

  test("Berechtigungen werden korrekt aus dem Praefix gebildet", () => {
    expect(permissionFor("service", "read")).toBe("services.read");
    expect(permissionFor("industry", "publish")).toBe("industries.publish");
    expect(permissionFor("testimonial", "manage")).toBe("testimonials.manage");
    expect(permissionFor("blog", "publish")).toBe("blog.publish");
  });

  test("service-Attribute akzeptieren Icon und Anker, lehnen Unbekanntes ab", () => {
    const schema = KIND_CONFIG.service.attributesSchema;
    expect(
      schema.safeParse({ iconKey: "party", anchorId: "eventpersonal" }).success,
    ).toBe(true);
    expect(schema.safeParse({}).success).toBe(true);
    expect(schema.safeParse({ unbekannt: 1 }).success).toBe(false);
  });

  test("industry-Attribute bleiben auf den Icon-Schluessel beschraenkt", () => {
    const schema = KIND_CONFIG.industry.attributesSchema;
    expect(schema.safeParse({ iconKey: "truck" }).success).toBe(true);
    // Beschreibungstexte gehoeren in die Uebersetzung, nicht in die Attribute.
    expect(schema.safeParse({ description: "…" }).success).toBe(false);
  });

  test("blog-Attribute bleiben strikt, Inhalte liegen in Translation-Details", () => {
    const schema = KIND_CONFIG.blog.attributesSchema;
    expect(schema.safeParse({}).success).toBe(true);
    expect(schema.safeParse({ category: "Recruiting" }).success).toBe(false);
  });
});
