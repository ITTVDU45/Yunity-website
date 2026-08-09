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
  ADMIN_LOCALE_COOKIE,
  type AdminLocale,
} from "./admin-locales";

export {
  ADMIN_LANGUAGE_OPTIONS,
  ADMIN_LOCALE_COOKIE,
  ADMIN_LOCALES,
  isAdminLocale,
} from "./admin-locales";
export type { AdminLocale } from "./admin-locales";

const messages = {
  de: {
    "shell.language": "Inhaltssprache",
    "shell.languageHint": "Bearbeitung & Vorschau",
    "shell.content": "Inhalte",
    "shell.interaction": "Interaktion",
    "shell.system": "System",
    "shell.dashboard": "Dashboard",
    "shell.pages": "Seiten",
    "shell.navigation": "Navigation",
    "shell.media": "Medien",
    "shell.services": "Leistungen",
    "shell.industries": "Branchen",
    "shell.testimonials": "Stimmen",
    "shell.blog": "Blogartikel",
    "shell.competencies": "Themen",
    "shell.forms": "Formulare",
    "shell.submissions": "Anfragen",
    "shell.settings": "Einstellungen",
    "shell.users": "Benutzer & Rollen",
    "shell.audit": "Audit-Log",
    "shell.soon": "bald",
    "shell.closeMenu": "Menü schließen",
    "shell.openMenu": "Menü öffnen",
    "shell.logout": "Abmelden",
    "settings.appearance": "Darstellung",
    "settings.appearanceTitle": "Farbschema",
    "settings.appearanceDescription": "Wählen Sie die Darstellung des Admin-Bereichs.",
    "settings.appearanceHint": "Die Auswahl gilt nur für diesen Browser. System folgt automatisch der Geräteeinstellung.",
    "settings.themeLight": "Hell",
    "settings.themeDark": "Dunkel",
    "settings.themeSystem": "System",
    "status.DRAFT": "Entwurf",
    "status.IN_REVIEW": "In Prüfung",
    "status.APPROVED": "Freigegeben",
    "status.PUBLISHED": "Veröffentlicht",
    "status.SCHEDULED": "Geplant",
    "status.ARCHIVED": "Archiviert",
    "common.untitled": "(ohne Titel)",
    "common.save": "Speichern",
    "common.saved": "Gespeichert",
    "common.delete": "Löschen",
    "common.cancel": "Abbrechen",
    "common.loading": "Wird geladen…",
    "common.search": "Suchen",
    "common.back": "Zurück",
    "common.preview": "Vorschau",
    "common.publish": "Veröffentlichen",
    "common.publishChanges": "Änderungen veröffentlichen",
    "common.languageFallback": "Noch keine Übersetzung. Deutsche Inhalte werden als Ausgangspunkt angezeigt.",
    "pages.sectionSaved": "Sektion gespeichert. Veröffentlichen Sie die Änderungen, damit sie auf der Website erscheinen.",
    "pages.orderSaved": "Reihenfolge gespeichert. Veröffentlichen Sie die Änderungen, damit sie auf der Website erscheinen.",
    "pages.published": "Die aktuelle Version wurde veröffentlicht.",
    "login.intro": "Melden Sie sich an, um Inhalte zu verwalten.",
    "login.reset": "Passwort zurücksetzen.",
    "login.email": "E-Mail-Adresse",
    "login.password": "Passwort",
    "login.remember": "Angemeldet bleiben",
    "login.forgot": "Passwort vergessen?",
    "login.submit": "Anmelden",
    "login.submitting": "Anmeldung läuft…",
    "login.request": "Link anfordern",
    "login.sending": "Wird gesendet…",
    "login.return": "Zurück zur Anmeldung",
    "login.requested": "Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen versendet.",
  },
  en: {
    "shell.language": "Content language",
    "shell.languageHint": "Editing & preview",
    "shell.content": "Content",
    "shell.interaction": "Interaction",
    "shell.system": "System",
    "shell.dashboard": "Dashboard",
    "shell.pages": "Pages",
    "shell.navigation": "Navigation",
    "shell.media": "Media",
    "shell.services": "Services",
    "shell.industries": "Industries",
    "shell.testimonials": "Testimonials",
    "shell.blog": "Blog articles",
    "shell.competencies": "Topics",
    "shell.forms": "Forms",
    "shell.submissions": "Submissions",
    "shell.settings": "Settings",
    "shell.users": "Users & roles",
    "shell.audit": "Audit log",
    "shell.soon": "soon",
    "shell.closeMenu": "Close menu",
    "shell.openMenu": "Open menu",
    "shell.logout": "Sign out",
    "settings.appearance": "Appearance",
    "settings.appearanceTitle": "Colour scheme",
    "settings.appearanceDescription": "Choose the appearance of the admin area.",
    "settings.appearanceHint": "This selection only applies to this browser. System automatically follows the device setting.",
    "settings.themeLight": "Light",
    "settings.themeDark": "Dark",
    "settings.themeSystem": "System",
    "status.DRAFT": "Draft",
    "status.IN_REVIEW": "In review",
    "status.APPROVED": "Approved",
    "status.PUBLISHED": "Published",
    "status.SCHEDULED": "Scheduled",
    "status.ARCHIVED": "Archived",
    "common.untitled": "(untitled)",
    "common.save": "Save",
    "common.saved": "Saved",
    "common.delete": "Delete",
    "common.cancel": "Cancel",
    "common.loading": "Loading…",
    "common.search": "Search",
    "common.back": "Back",
    "common.preview": "Preview",
    "common.publish": "Publish",
    "common.publishChanges": "Publish changes",
    "common.languageFallback": "No translation yet. German content is shown as a starting point.",
    "pages.sectionSaved": "Section saved. Publish the changes for them to appear on the website.",
    "pages.orderSaved": "Order saved. Publish the changes for them to appear on the website.",
    "pages.published": "The current version has been published.",
    "login.intro": "Sign in to manage content.",
    "login.reset": "Reset your password.",
    "login.email": "Email address",
    "login.password": "Password",
    "login.remember": "Keep me signed in",
    "login.forgot": "Forgot password?",
    "login.submit": "Sign in",
    "login.submitting": "Signing in…",
    "login.request": "Request link",
    "login.sending": "Sending…",
    "login.return": "Back to sign in",
    "login.requested": "If an account exists for this email address, a reset link has been sent.",
  },
  tr: {
    "shell.language": "İçerik dili",
    "shell.languageHint": "Düzenleme ve önizleme",
    "shell.content": "İçerik",
    "shell.interaction": "Etkileşim",
    "shell.system": "Sistem",
    "shell.dashboard": "Kontrol paneli",
    "shell.pages": "Sayfalar",
    "shell.navigation": "Navigasyon",
    "shell.media": "Medya",
    "shell.services": "Hizmetler",
    "shell.industries": "Sektörler",
    "shell.testimonials": "Referanslar",
    "shell.blog": "Blog yazıları",
    "shell.competencies": "Konular",
    "shell.forms": "Formlar",
    "shell.submissions": "Başvurular",
    "shell.settings": "Ayarlar",
    "shell.users": "Kullanıcılar ve roller",
    "shell.audit": "Denetim kaydı",
    "shell.soon": "yakında",
    "shell.closeMenu": "Menüyü kapat",
    "shell.openMenu": "Menüyü aç",
    "shell.logout": "Çıkış yap",
    "settings.appearance": "Görünüm",
    "settings.appearanceTitle": "Renk şeması",
    "settings.appearanceDescription": "Yönetim alanının görünümünü seçin.",
    "settings.appearanceHint": "Bu seçim yalnızca bu tarayıcı için geçerlidir. Sistem, cihaz ayarını otomatik olarak izler.",
    "settings.themeLight": "Açık",
    "settings.themeDark": "Koyu",
    "settings.themeSystem": "Sistem",
    "status.DRAFT": "Taslak",
    "status.IN_REVIEW": "İncelemede",
    "status.APPROVED": "Onaylandı",
    "status.PUBLISHED": "Yayınlandı",
    "status.SCHEDULED": "Planlandı",
    "status.ARCHIVED": "Arşivlendi",
    "common.untitled": "(başlıksız)",
    "common.save": "Kaydet",
    "common.saved": "Kaydedildi",
    "common.delete": "Sil",
    "common.cancel": "İptal",
    "common.loading": "Yükleniyor…",
    "common.search": "Ara",
    "common.back": "Geri",
    "common.preview": "Önizleme",
    "common.publish": "Yayınla",
    "common.publishChanges": "Değişiklikleri yayınla",
    "common.languageFallback": "Henüz çeviri yok. Almanca içerik başlangıç olarak gösteriliyor.",
    "pages.sectionSaved": "Bölüm kaydedildi. Web sitesinde görünmesi için değişiklikleri yayınlayın.",
    "pages.orderSaved": "Sıralama kaydedildi. Web sitesinde görünmesi için değişiklikleri yayınlayın.",
    "pages.published": "Güncel sürüm yayınlandı.",
    "login.intro": "İçerikleri yönetmek için giriş yapın.",
    "login.reset": "Şifrenizi sıfırlayın.",
    "login.email": "E-posta adresi",
    "login.password": "Şifre",
    "login.remember": "Oturumu açık tut",
    "login.forgot": "Şifrenizi mi unuttunuz?",
    "login.submit": "Giriş yap",
    "login.submitting": "Giriş yapılıyor…",
    "login.request": "Bağlantı iste",
    "login.sending": "Gönderiliyor…",
    "login.return": "Giriş ekranına dön",
    "login.requested": "Bu e-posta adresiyle bir hesap varsa sıfırlama bağlantısı gönderildi.",
  },
} as const;

export type AdminMessageKey = keyof (typeof messages)["de"];

interface AdminI18nContextValue {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: AdminMessageKey) => string;
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: AdminLocale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: AdminLocale) => {
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${maxAge}; samesite=lax`;
    setLocaleState(nextLocale);
  }, []);

  const value = useMemo<AdminI18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => messages[locale][key] ?? messages.de[key],
    }),
    [locale, setLocale],
  );

  return (
    <AdminI18nContext.Provider value={value}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n(): AdminI18nContextValue {
  const value = useContext(AdminI18nContext);
  if (!value) {
    throw new Error("useAdminI18n muss innerhalb des Providers verwendet werden.");
  }
  return value;
}
