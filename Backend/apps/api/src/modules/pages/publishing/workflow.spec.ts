import { canTransition, nextStatus } from "./workflow";

describe("workflow", () => {
  test("Entwurf kann zur Pruefung eingereicht werden", () => {
    expect(nextStatus("DRAFT", "submitForReview")).toBe("IN_REVIEW");
  });

  test("Reviewer gibt frei und veroeffentlicht", () => {
    expect(nextStatus("IN_REVIEW", "approve")).toBe("APPROVED");
    expect(nextStatus("APPROVED", "publish")).toBe("PUBLISHED");
  });

  test("Zurueckweisen fuehrt zurueck in den Entwurf", () => {
    expect(nextStatus("IN_REVIEW", "reject")).toBe("DRAFT");
  });

  test("Direktveroeffentlichung aus dem Entwurf ist moeglich", () => {
    expect(canTransition("DRAFT", "publish")).toBe(true);
    expect(nextStatus("DRAFT", "publish")).toBe("PUBLISHED");
  });

  test("Veroeffentlichung zuruecknehmen fuehrt in den Entwurf", () => {
    expect(nextStatus("PUBLISHED", "unpublish")).toBe("DRAFT");
  });

  test("Republish nach Aenderungen bleibt erlaubt", () => {
    expect(canTransition("PUBLISHED", "publish")).toBe(true);
  });

  test("unzulaessige Uebergaenge liefern null", () => {
    expect(nextStatus("ARCHIVED", "publish")).toBeNull();
    expect(nextStatus("DRAFT", "approve")).toBeNull();
    expect(nextStatus("PUBLISHED", "submitForReview")).toBeNull();
  });

  test("archiviert kann wiederhergestellt werden", () => {
    expect(nextStatus("ARCHIVED", "restore")).toBe("DRAFT");
  });
});
