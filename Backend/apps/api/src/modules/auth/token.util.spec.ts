import {
  ABSOLUTE_REMEMBER_ME_MS,
  ABSOLUTE_SESSION_MS,
  SLIDING_SESSION_MS,
  computeRefreshedExpiry,
  computeSessionExpiries,
  generateToken,
  hashToken,
  tokensMatch,
} from "./token.util";

describe("token.util", () => {
  test("generateToken liefert eindeutige, ausreichend lange Tokens", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).not.toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(48);
  });

  test("hashToken ist deterministisch und secret-abhaengig", () => {
    const token = "test-token";
    expect(hashToken(token, "secret-a")).toEqual(hashToken(token, "secret-a"));
    expect(hashToken(token, "secret-a")).not.toEqual(
      hashToken(token, "secret-b"),
    );
  });

  test("tokensMatch vergleicht timing-sicher", () => {
    expect(tokensMatch("abc", "abc")).toBe(true);
    expect(tokensMatch("abc", "abd")).toBe(false);
    expect(tokensMatch("abc", "abcd")).toBe(false);
  });

  test("Session ohne rememberMe laeuft nach 12h sliding, 24h absolut ab", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const { expiresAt, absoluteExpiresAt } = computeSessionExpiries(false, now);
    expect(expiresAt.getTime()).toBe(now.getTime() + SLIDING_SESSION_MS);
    expect(absoluteExpiresAt.getTime()).toBe(
      now.getTime() + ABSOLUTE_SESSION_MS,
    );
  });

  test("rememberMe verlaengert die absolute Grenze auf 30 Tage", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const { absoluteExpiresAt } = computeSessionExpiries(true, now);
    expect(absoluteExpiresAt.getTime()).toBe(
      now.getTime() + ABSOLUTE_REMEMBER_ME_MS,
    );
  });

  test("Refresh verlaengert nie ueber die absolute Grenze hinaus", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const absolute = new Date(now.getTime() + 60 * 60 * 1000); // in 1h
    expect(computeRefreshedExpiry(absolute, now).getTime()).toBe(
      absolute.getTime(),
    );

    const farAbsolute = new Date(now.getTime() + 100 * 60 * 60 * 1000);
    expect(computeRefreshedExpiry(farAbsolute, now).getTime()).toBe(
      now.getTime() + SLIDING_SESSION_MS,
    );
  });
});
