"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ADMIN_THEME_COOKIE,
  type AdminThemeMode,
} from "@/lib/admin-theme";

interface AdminThemeContextValue {
  theme: AdminThemeMode;
  setTheme: (theme: AdminThemeMode) => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

function applyTheme(theme: AdminThemeMode, prefersDark: boolean) {
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function AdminThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: AdminThemeMode;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<AdminThemeMode>(initialTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => applyTheme(theme, mediaQuery.matches);

    updateTheme();
    if (theme === "system") {
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: AdminThemeMode) => {
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${ADMIN_THEME_COOKIE}=${nextTheme}; path=/; max-age=${maxAge}; samesite=lax`;
    applyTheme(
      nextTheme,
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme(): AdminThemeContextValue {
  const value = useContext(AdminThemeContext);
  if (!value) {
    throw new Error(
      "useAdminTheme muss innerhalb des AdminThemeProvider verwendet werden.",
    );
  }
  return value;
}
