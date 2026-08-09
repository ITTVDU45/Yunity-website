import type { SettingsGroup } from "./setting.schema";

/** Erlaubte Einstellungsgruppen. */
export const SETTINGS_GROUPS: readonly SettingsGroup[] = [
  "general",
  "company",
  "header",
  "footer",
  "seo",
  "integrations",
];

export function isSettingsGroup(value: string): value is SettingsGroup {
  return (SETTINGS_GROUPS as readonly string[]).includes(value);
}

/**
 * Schluessel, deren Werte als sensibel gelten (z. B. Integrations-Tokens).
 * Sie werden nie ueber die oeffentliche API ausgeliefert. Der eigentliche
 * Secret-Wert gehoert in ENV — hier stehen nur konfigurierbare IDs/Toggles.
 */
export const SENSITIVE_SETTING_KEYS: Readonly<
  Partial<Record<SettingsGroup, readonly string[]>>
> = {
  integrations: [
    "analyticsApiSecret",
    "newsletterApiKey",
    "crmApiKey",
    "webhookSecret",
    "mapsApiKey",
  ],
};

export function isSensitiveKey(group: SettingsGroup, key: string): boolean {
  return (SENSITIVE_SETTING_KEYS[group] ?? []).includes(key);
}
