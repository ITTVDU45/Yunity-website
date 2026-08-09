"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  FormInput,
  Image as ImageIcon,
  LayoutDashboard,
  Languages,
  ListTree,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Quote,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import type { AuthUser } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { getActiveSiteId, setActiveSiteId } from "@/lib/site";
import {
  ADMIN_LANGUAGE_OPTIONS,
  type AdminMessageKey,
  type AdminLocale,
  useAdminI18n,
} from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: AdminMessageKey;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  /** Benoetigte Berechtigung (Anzeige-Gating; Server prueft zusaetzlich). */
  permission?: string;
  /** Noch nicht implementiert (kommende Phase). */
  disabled?: boolean;
}

interface MenuGroup {
  label: AdminMessageKey | null;
  items: MenuItem[];
}

const MENU: MenuGroup[] = [
  {
    label: null,
    items: [
      { title: "shell.dashboard", icon: LayoutDashboard, href: "/" },
      { title: "shell.pages", icon: FileText, href: "/pages", permission: "pages.read" },
      { title: "shell.navigation", icon: ListTree, href: "/navigation", permission: "navigation.read" },
      { title: "shell.media", icon: ImageIcon, href: "/media", permission: "media.read" },
    ],
  },
  {
    label: "shell.content",
    items: [
      { title: "shell.services", icon: Briefcase, href: "/collections/service", permission: "services.read" },
      { title: "shell.industries", icon: Building2, href: "/collections/industry", permission: "industries.read" },
      { title: "shell.testimonials", icon: Quote, href: "/collections/testimonial", permission: "testimonials.read" },
      { title: "shell.blog", icon: Newspaper, href: "/collections/blog", permission: "blog.read" },
      { title: "shell.competencies", icon: Tags, href: "/competencies", permission: "competencies.read" },
    ],
  },
  {
    label: "shell.interaction",
    items: [
      { title: "shell.forms", icon: FormInput, href: "/forms", permission: "forms.read" },
      { title: "shell.submissions", icon: MessageSquare, href: "/forms/submissions", permission: "forms.submissions.read" },
    ],
  },
  {
    label: "shell.system",
    items: [
      { title: "shell.settings", icon: Settings, href: "/settings", permission: "settings.read" },
      { title: "shell.users", icon: Shield, href: "/users", permission: "users.read", disabled: true },
      { title: "shell.audit", icon: ScrollText, href: "/audit", permission: "audit.read" },
    ],
  },
];

function userCan(user: AuthUser, permission?: string): boolean {
  if (!permission) {
    return true;
  }
  if (user.globalPermissions.includes("*")) {
    return true;
  }
  const all = [
    ...user.globalPermissions,
    ...Object.values(user.permissionsBySite).flat(),
  ];
  return all.includes(permission);
}

function SidebarContent({
  user,
  pathname,
  onClose,
  onLogout,
}: {
  user: AuthUser;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  const { locale, setLocale, t } = useAdminI18n();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      <div className="p-8 overflow-y-auto">
        <div className="mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand text-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-tight text-zinc-900 dark:text-white">
                YUNITY
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Content Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden absolute top-0 right-0 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            aria-label={t("shell.closeMenu")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <label className="mb-8 block">
          <span className="mb-2 flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <Languages className="h-4 w-4 text-accent" />
            {t("shell.language")}
          </span>
          <span className="relative block">
            <select
              aria-label={t("shell.language")}
              className="h-11 w-full appearance-none border border-zinc-200 bg-zinc-50 px-3 pr-9 text-sm font-bold text-zinc-800 outline-none transition-colors hover:border-zinc-300 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              onChange={(event) =>
                setLocale(event.target.value as AdminLocale)
              }
              value={locale}
            >
              {ADMIN_LANGUAGE_OPTIONS.map((option) => (
                <option key={option.locale} value={option.locale}>
                  {option.shortLabel} · {option.label}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-zinc-400" />
          </span>
          <span className="mt-1.5 block px-1 text-[10px] text-zinc-400">
            {t("shell.languageHint")}
          </span>
        </label>

        <nav className="space-y-5">
          {MENU.map((group) => {
            const visible = group.items.filter((item) =>
              userCan(user, item.permission),
            );
            if (visible.length === 0) {
              return null;
            }
            return (
              <div key={group.label ?? "main"}>
                {group.label && (
                  <p className="px-5 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {t(group.label)}
                  </p>
                )}
                <div className="space-y-1">
                  {visible.map((item) => {
                    const isActive = pathname === item.href;
                    if (item.disabled) {
                      return (
                        <div
                          key={item.href}
                          className="flex items-center justify-between px-5 py-3.5 rounded-2xl text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                          title={t("shell.soon")}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight">
                              {t(item.title)}
                            </span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
                            {t("shell.soon")}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group",
                          isActive
                            ? "bg-brand text-white shadow-lg shadow-brand/20"
                            : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon
                            className={cn(
                              "w-5 h-5",
                              isActive
                                ? "text-accent"
                                : "text-zinc-400 group-hover:text-accent",
                            )}
                          />
                          <span className="font-bold text-sm tracking-tight">
                            {t(item.title)}
                          </span>
                        </div>
                        {isActive && (
                          <motion.div layoutId="active-indicator">
                            <ChevronRight className="w-4 h-4 opacity-50" />
                          </motion.div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 pt-4 space-y-3">
        <div className="px-5 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all duration-300 font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>{t("shell.logout")}</span>
        </button>
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { locale, t } = useAdminI18n();

  // Aktive Site sicherstellen, bevor Kind-Seiten ihre Daten laden. Der
  // useState-Initializer laeuft im Parent-Render vor den Child-Effects, sodass
  // clientApi den X-Site-Id-Header ab dem ersten Fetch senden kann.
  useState(() => {
    if (!getActiveSiteId() && user.sites[0]) {
      setActiveSiteId(user.sites[0].id);
    }
    return null;
  });

  const handleLogout = async () => {
    await clientApi("/api/v1/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 flex-col lg:flex-row">
      {/* Mobile Topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand text-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-black text-xs uppercase tracking-tight text-zinc-900 dark:text-white">
            Yunity CMS
          </span>
          <span className="border-l border-zinc-200 pl-2 text-[10px] font-black text-accent dark:border-zinc-700">
            {locale.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white"
          aria-label={t("shell.openMenu")}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex-col z-50">
        <SidebarContent
          user={user}
          pathname={pathname}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] bg-white dark:bg-zinc-900 z-[80] shadow-2xl lg:hidden"
            >
              <SidebarContent
                user={user}
                pathname={pathname}
                onClose={() => setIsOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen relative">
          {children}
        </div>
      </main>
    </div>
  );
}
