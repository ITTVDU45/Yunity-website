import { escapeCsvCell } from "./submissions.service";

describe("escapeCsvCell", () => {
  test.each(["=1+1", "+cmd", "-2+3", "@SUM(A1:A2)", "  =1+1"])(
    "neutralisiert Tabellenformeln: %s",
    (value) => {
      expect(escapeCsvCell(value)).toContain("'");
    },
  );

  test("escaped Anfuehrungszeichen nach CSV-Regeln", () => {
    expect(escapeCsvCell('a"b')).toBe('"a""b"');
  });
});
