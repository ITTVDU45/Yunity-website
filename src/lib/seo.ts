import { siteConfig } from "@/lib/site-config"

type Schema = Record<string, unknown>

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icons/icon.svg"),
    description: siteConfig.description,
    foundingDate: `${siteConfig.foundingYear}-01-01`,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: siteConfig.phoneE164,
      email: siteConfig.email,
      areaServed: "DE",
      availableLanguage: ["de", "en"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.zip,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
  }
}

export function localBusinessSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": absoluteUrl("/#local-business"),
    name: siteConfig.legalName,
    image: absoluteUrl(siteConfig.ogImage),
    url: siteConfig.url,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.zip,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHours: siteConfig.openingHours,
    areaServed: { "@type": "Country", name: "DE" },
  }
}

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "de-DE",
    publisher: { "@id": absoluteUrl("/#organization") },
  }
}

export function serviceSchema(input: {
  name: string
  description: string
  url?: string
}): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.name,
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: "DE" },
    availableLanguage: "de",
    ...(input.url ? { url: absoluteUrl(input.url) } : {}),
  }
}

export function faqSchema(items: ReadonlyArray<{ q: string; a: string }>): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}

export function breadcrumbSchema(
  items: ReadonlyArray<{ label: string; href: string }>,
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }
}
