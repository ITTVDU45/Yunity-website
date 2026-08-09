import { redactAuditPayload } from "./audit.service";

describe("redactAuditPayload", () => {
  test("entfernt Secrets rekursiv und unabhaengig von Schreibweise", () => {
    expect(
      redactAuditPayload({
        email: "admin@example.test",
        nested: { session_secret: "secret", Authorization: "Bearer token" },
        items: [{ passwordHash: "hash" }],
      }),
    ).toEqual({
      email: "admin@example.test",
      nested: {
        session_secret: "[REDACTED]",
        Authorization: "[REDACTED]",
      },
      items: [{ passwordHash: "[REDACTED]" }],
    });
  });
});
