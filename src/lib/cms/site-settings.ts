import { cache } from "react"

import { cms } from "./client"
import { footerColumns, navItems, siteConfig } from "@/lib/site-config"

/**
 * Führt die im Backend gepflegten Einstellungen und die Navigation mit den
 * statischen Werten aus `site-config.ts` zusammen. Die statischen Werte sind
 * die Vorgabe — das CMS überschreibt nur, was dort tatsächlich gefüllt ist.
 * Ist das Backend aus oder nicht erreichbar, bleibt alles wie bisher.
 *
 * `cache()` sorgt dafür, dass Layout und Seiten pro Anfrage nur einmal laden.
 */

export interface NavLink {
  href: string
  label: string
}

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export interface SiteSettings {
  name: string
  legalName: string
  shortDescription: string
  email: string
  phoneDisplay: string
  phoneE164: string
  street: string
  zip: string
  city: string
  linkedin: string
  instagram: string
  footerClaim: string
  footerClaimText: string
  trustPoints: string[]
  navItems: NavLink[]
  footerColumns: FooterColumn[]
}

/** Nicht-leerer String aus den CMS-Werten, sonst der statische Rückfallwert. */
function value(
  values: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const candidate = values?.[key]
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : fallback
}

/** Kommagetrennte Liste aus den Einstellungen (z. B. Vertrauenspunkte). */
function csv(
  values: Record<string, unknown> | undefined,
  key: string,
  fallback: readonly string[],
): string[] {
  const raw = values?.[key]
  if (typeof raw !== "string" || !raw.trim()) {
    return [...fallback]
  }
  const parts = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
  return parts.length ? parts : [...fallback]
}

const STATIC_TRUST_POINTS = [
  "Kurzfristig verfügbar",
  "Feste Ansprechpartner",
  "Deutschlandweite Einsätze",
] as const

const STATIC_FOOTER_CLAIM = "Personalbedarf oder Lust auf den nächsten Einsatz?"
const STATIC_FOOTER_CLAIM_TEXT =
  "Ob Unternehmen oder Bewerber:in – bei Yunity führt ein klarer Weg direkt zum passenden Team oder Job."

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const [site, header] = await Promise.all([cms.site(), cms.navigation("header")])

  const company = site?.settings?.company as Record<string, unknown> | undefined
  const footer = site?.settings?.footer as Record<string, unknown> | undefined

  // Navigation aus dem CMS nur übernehmen, wenn sie tatsächlich Einträge hat —
  // eine leer gepflegte Navigation darf das Menü nicht verschwinden lassen.
  const cmsNav = (header?.items ?? [])
    .filter((item) => item.url)
    .map((item) => ({ href: item.url as string, label: item.label }))

  return {
    name: value(company, "name", siteConfig.name),
    legalName: value(company, "legalName", siteConfig.legalName),
    shortDescription: siteConfig.shortDescription,
    email: value(company, "email", siteConfig.email),
    phoneDisplay: value(company, "phone", siteConfig.phoneDisplay),
    phoneE164: value(company, "phoneE164", siteConfig.phoneE164),
    street: value(company, "street", siteConfig.address.street),
    zip: value(company, "zip", siteConfig.address.zip),
    city: value(company, "city", siteConfig.address.city),
    linkedin: value(footer, "linkedin", siteConfig.social.linkedin),
    instagram: value(footer, "instagram", siteConfig.social.instagram),
    footerClaim: value(footer, "claim", STATIC_FOOTER_CLAIM),
    footerClaimText: value(footer, "claimText", STATIC_FOOTER_CLAIM_TEXT),
    trustPoints: csv(footer, "trustPoints", STATIC_TRUST_POINTS),
    navItems: cmsNav.length ? cmsNav : navItems.map((item) => ({ ...item })),
    footerColumns: footerColumns.map((column) => ({
      title: column.title,
      links: column.links.map((link) => ({ ...link })),
    })),
  }
})
