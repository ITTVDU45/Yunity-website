import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  AdminI18nProvider,
} from "@/lib/admin-i18n";
import { AdminThemeProvider } from "@/components/admin-theme-provider";
import {
  ADMIN_LOCALE_COOKIE,
  isAdminLocale,
} from "@/lib/admin-locales";
import {
  ADMIN_THEME_BOOTSTRAP_SCRIPT,
  ADMIN_THEME_COOKIE,
  isAdminThemeMode,
} from "@/lib/admin-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CMS Admin",
    template: "%s | CMS Admin",
  },
  description: "Content-Management fuer die Yunity-Website",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value;
  const locale = isAdminLocale(storedLocale) ? storedLocale : "de";
  const storedTheme = cookieStore.get(ADMIN_THEME_COOKIE)?.value;
  const theme = isAdminThemeMode(storedTheme) ? storedTheme : "system";

  return (
    <html
      className={theme === "dark" ? "dark" : undefined}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ADMIN_THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="font-sans">
        <AdminThemeProvider initialTheme={theme}>
          <AdminI18nProvider initialLocale={locale}>
            {children}
          </AdminI18nProvider>
        </AdminThemeProvider>
      </body>
    </html>
  );
}
