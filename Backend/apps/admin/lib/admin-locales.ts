export const ADMIN_LOCALES = ["de", "en", "tr"] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const ADMIN_LOCALE_COOKIE = "cms_locale";

export const ADMIN_LANGUAGE_OPTIONS: ReadonlyArray<{
  locale: AdminLocale;
  label: string;
  shortLabel: string;
}> = [
  { locale: "de", label: "Deutsch", shortLabel: "DE" },
  { locale: "en", label: "English", shortLabel: "EN" },
  { locale: "tr", label: "Türkçe", shortLabel: "TR" },
];

export function isAdminLocale(value: unknown): value is AdminLocale {
  return (
    typeof value === "string" &&
    ADMIN_LOCALES.includes(value as AdminLocale)
  );
}
