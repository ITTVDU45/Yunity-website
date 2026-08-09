"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useAdminI18n, type AdminMessageKey } from "@/lib/admin-i18n";
import {
  ADMIN_THEME_MODES,
  type AdminThemeMode,
} from "@/lib/admin-theme";
import { useAdminTheme } from "@/components/admin-theme-provider";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: Record<
  AdminThemeMode,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: AdminMessageKey;
  }
> = {
  light: { icon: Sun, label: "settings.themeLight" },
  dark: { icon: Moon, label: "settings.themeDark" },
  system: { icon: Monitor, label: "settings.themeSystem" },
};

export function AdminThemeSelector() {
  const { theme, setTheme } = useAdminTheme();
  const { t } = useAdminI18n();

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">
          {t("settings.appearanceTitle")}
        </h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {t("settings.appearanceDescription")}
        </p>
      </div>

      <div
        aria-label={t("settings.appearanceTitle")}
        className="grid grid-cols-3 gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800"
        role="radiogroup"
      >
        {ADMIN_THEME_MODES.map((option) => {
          const config = THEME_OPTIONS[option];
          const Icon = config.icon;
          const isActive = theme === option;

          return (
            <button
              key={option}
              aria-checked={isActive}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "bg-white text-brand shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:bg-white/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700/70 dark:hover:text-white",
              )}
              onClick={() => setTheme(option)}
              role="radio"
              title={t(config.label)}
              type="button"
            >
              <Icon className="h-5 w-5" />
              <span>{t(config.label)}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs leading-5 text-zinc-400">
        {t("settings.appearanceHint")}
      </p>
    </div>
  );
}
