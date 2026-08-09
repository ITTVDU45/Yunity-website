import { BadRequestException } from "@nestjs/common";
import { CMS_LOCALES, type CmsLocale } from "@yunity/contracts";

export function isCmsLocale(value: unknown): value is CmsLocale {
  return (
    typeof value === "string" &&
    CMS_LOCALES.includes(value as CmsLocale)
  );
}

export function resolveContentLocale(
  requested: string | undefined,
  defaultLocale = "de",
  enabledLocales: readonly string[] = CMS_LOCALES,
): CmsLocale {
  const fallback = isCmsLocale(defaultLocale) ? defaultLocale : "de";
  if (!requested) {
    return fallback;
  }
  if (!isCmsLocale(requested) || !enabledLocales.includes(requested)) {
    throw new BadRequestException(
      `Nicht unterstuetzte Sprache "${requested}". Erlaubt: ${CMS_LOCALES.join(", ")}.`,
    );
  }
  return requested;
}
