export const ADMIN_THEME_COOKIE = "cms_admin_theme";

export const ADMIN_THEME_MODES = ["light", "dark", "system"] as const;

export type AdminThemeMode = (typeof ADMIN_THEME_MODES)[number];

export function isAdminThemeMode(value: unknown): value is AdminThemeMode {
  return ADMIN_THEME_MODES.includes(value as AdminThemeMode);
}

export const ADMIN_THEME_BOOTSTRAP_SCRIPT = `(() => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("${ADMIN_THEME_COOKIE}="));
    const stored = cookie ? cookie.split("=")[1] : "system";
    const theme = ["light", "dark", "system"].includes(stored)
      ? stored
      : "system";
    const isDark = theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
})();`;
