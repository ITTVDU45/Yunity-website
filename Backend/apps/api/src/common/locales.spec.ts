import { BadRequestException } from "@nestjs/common";
import { resolveContentLocale } from "./locales";

describe("resolveContentLocale", () => {
  it("uses the configured default locale when none is requested", () => {
    expect(resolveContentLocale(undefined, "tr")).toBe("tr");
  });

  it.each(["de", "en", "tr"])("accepts supported locale %s", (locale) => {
    expect(resolveContentLocale(locale)).toBe(locale);
  });

  it("rejects unsupported and disabled locales", () => {
    expect(() => resolveContentLocale("fr")).toThrow(BadRequestException);
    expect(() => resolveContentLocale("tr", "de", ["de", "en"])).toThrow(
      BadRequestException,
    );
  });
});
