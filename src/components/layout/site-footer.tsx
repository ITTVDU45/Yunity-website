import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react"
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6"

import { buttonVariants } from "@/components/ui/button-variants"
import { footerColumns, siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const DEFAULT_TRUST_POINTS = [
  "Kurzfristig verfügbar",
  "Feste Ansprechpartner",
  "Deutschlandweite Einsätze",
] as const

const DEFAULT_CLAIM = "Personalbedarf oder Lust auf den nächsten Einsatz?"
const DEFAULT_CLAIM_TEXT =
  "Ob Unternehmen oder Bewerber:in – bei Yunity führt ein klarer Weg direkt zum passenden Team oder Job."

interface SiteFooterProps {
  /** Werte aus dem CMS; ohne Angabe bleibt der Footer unveraendert. */
  settings?: {
    name: string
    legalName: string
    email: string
    phoneDisplay: string
    phoneE164: string
    linkedin: string
    instagram: string
    footerClaim: string
    footerClaimText: string
    trustPoints: string[]
    footerColumns: { title: string; links: { href: string; label: string }[] }[]
  }
}

export function SiteFooter({ settings }: SiteFooterProps = {}) {
  const brand = settings?.name || siteConfig.name
  const legalName = settings?.legalName || siteConfig.legalName
  const email = settings?.email || siteConfig.email
  const phoneDisplay = settings?.phoneDisplay || siteConfig.phoneDisplay
  const phoneE164 = settings?.phoneE164 || siteConfig.phoneE164
  const linkedin = settings?.linkedin || siteConfig.social.linkedin
  const instagram = settings?.instagram || siteConfig.social.instagram
  const claim = settings?.footerClaim || DEFAULT_CLAIM
  const claimText = settings?.footerClaimText || DEFAULT_CLAIM_TEXT
  const trustPoints = settings?.trustPoints?.length
    ? settings.trustPoints
    : DEFAULT_TRUST_POINTS
  const columns = settings?.footerColumns?.length
    ? settings.footerColumns
    : footerColumns
  return (
    <footer className="relative overflow-hidden bg-[oklch(0.19_0.045_260)] pb-[max(1rem,env(safe-area-inset-bottom))] text-white">
      <div
        className="pointer-events-none absolute -right-28 top-20 size-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 size-80 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.05] to-accent/[0.12] p-6 shadow-2xl shadow-black/15 backdrop-blur-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Gemeinsam starten
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {claim}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              {claimText}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Link
              href="/kontakt"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "group rounded-full bg-accent px-7 text-accent-foreground shadow-lg shadow-black/15 hover:bg-accent/90"
              )}
            >
              Personal anfragen
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/fuer-bewerber"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-white/25 bg-white/[0.06] px-7 text-white hover:bg-white/12 hover:text-white"
              )}
            >
              Jetzt bewerben
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.45fr_0.75fr_0.75fr] lg:gap-16 lg:py-16">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`${brand} – Startseite`}
            >
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/15 transition-transform duration-300 group-hover:scale-105"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 5l7 9 7-9M12 14v6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-xl font-semibold tracking-tight text-white">
                  {brand}
                </span>
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  Personalvermittlung
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
              {siteConfig.shortDescription}
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/75 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-white"
              >
                <Mail className="size-4 text-accent" aria-hidden />
                {email}
              </a>
              <a
                href={`tel:${phoneE164}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/75 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-white"
              >
                <Phone className="size-4 text-accent" aria-hidden />
                {phoneDisplay}
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm font-semibold text-white">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-accent"
                    >
                      <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {legalName}. Alle Rechte vorbehalten.
          </p>

          <div className="flex items-center gap-3">
            <span className="mr-1 text-xs text-white/40">Folgen Sie uns</span>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Yunity auf LinkedIn"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition-colors hover:border-accent/50 hover:bg-accent hover:text-accent-foreground"
            >
              <FaLinkedinIn className="size-4" aria-hidden />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Yunity auf Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition-colors hover:border-accent/50 hover:bg-accent hover:text-accent-foreground"
            >
              <FaInstagram className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
