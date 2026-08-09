"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, LogIn, Mail, Scale } from "lucide-react";
import type { AuthUser } from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { setActiveSiteId } from "@/lib/site";
import {
  ADMIN_LANGUAGE_OPTIONS,
  type AdminLocale,
  useAdminI18n,
} from "@/lib/admin-i18n";

type Mode = "login" | "forgot";

export default function LoginPage() {
  const { locale, setLocale, t } = useAdminI18n();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await clientApi<AuthUser>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password, rememberMe },
    });

    if (result.success) {
      // Aktive Site fuer den X-Site-Id-Header setzen (erste zugewiesene Site).
      if (result.data.sites[0]) {
        setActiveSiteId(result.data.sites[0].id);
      }
      // Voller Reload statt Client-Navigation: der Router haelt sonst den vor
      // dem Login geprefetchten Redirect (/ -> /login) im Cache.
      window.location.assign("/");
    } else {
      setError(result.error.message);
      setLoading(false);
    }
  };

  const handleForgot = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await clientApi<{ requested: boolean }>(
      "/api/v1/auth/forgot-password",
      { method: "POST", body: { email } },
    );

    setLoading(false);
    if (result.success) {
      setInfo(
        t("login.requested"),
      );
    } else {
      setError(result.error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-zinc-50 to-zinc-50 dark:via-zinc-950 dark:to-zinc-950">
      <label className="absolute right-6 top-6">
        <span className="sr-only">{t("shell.language")}</span>
        <select
          aria-label={t("shell.language")}
          className="h-10 border border-zinc-200 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          onChange={(event) => setLocale(event.target.value as AdminLocale)}
          value={locale}
        >
          {ADMIN_LANGUAGE_OPTIONS.map((option) => (
            <option key={option.locale} value={option.locale}>
              {option.shortLabel} · {option.label}
            </option>
          ))}
        </select>
      </label>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/10 text-accent border border-accent/20 mb-6 shadow-2xl shadow-accent/20">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            CMS Admin
          </h1>
          <p className="text-zinc-500 font-medium">
            {mode === "login"
              ? t("login.intro")
              : t("login.reset")}
          </p>
        </div>

        <form
          onSubmit={mode === "login" ? handleLogin : handleForgot}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder={t("login.email")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {mode === "login" && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder={t("login.password")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            )}
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="w-4 h-4 rounded accent-[#bfa996]"
                />
                {t("login.remember")}
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setInfo("");
                }}
                className="text-zinc-400 hover:text-accent transition-colors font-medium"
              >
                {t("login.forgot")}
              </button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/40 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900/40 rounded-xl px-4 py-3">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-accent text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:opacity-60 disabled:hover:scale-100"
          >
            {mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                {loading ? t("login.submitting") : t("login.submit")}
              </>
            ) : (
              <>{loading ? t("login.sending") : t("login.request")}</>
            )}
          </button>

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setInfo("");
              }}
              className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("login.return")}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
