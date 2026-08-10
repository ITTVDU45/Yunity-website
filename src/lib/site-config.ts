export const siteConfig = {
  name: "Yunity",
  legalName: "Yunity Personalvermittlung",
  tagline: "Kurzfristig. Zuverlässig. Professionell.",
  description:
    "Personalvermittlung mit Fokus auf kurzfristige Personalbereitstellung für Events, Promotion, Messen, Gastronomie, Logistik und projektbezogene Einsätze.",
  shortDescription:
    "Flexibles Personal für Events, Promotion und Logistik – kurzfristig verfügbar, sorgfältig ausgewählt.",
  keywords: [
    "Personalvermittlung",
    "Eventpersonal",
    "Promotionpersonal",
    "Messepersonal",
    "Gastronomiepersonal",
    "Logistikhelfer",
    "Stadionpersonal",
    "kurzfristige Personalbereitstellung",
    "Aushilfen",
    "Servicekräfte",
  ],
  url: "https://yunity-jobs.de",
  ogImage: "/icons/og.png",
  email: "kontakt@yunity.de",
  phone: "+49 30 123 456 789",
  phoneDisplay: "+49 30 123 456 789",
  phoneE164: "+493012345678",
  address: {
    street: "Musterstraße 12",
    zip: "10115",
    city: "Berlin",
    country: "DE",
    countryName: "Deutschland",
    region: "Berlin",
  },
  geo: {
    latitude: 52.53,
    longitude: 13.395,
  },
  openingHours: ["Mo-Fr 09:00-18:00"],
  social: {
    linkedin: "https://www.linkedin.com/company/yunity",
    instagram: "https://www.instagram.com/yunity",
  },
  founder: {
    name: "Yunity Team",
  },
  foundingYear: 2024,
} as const

export const navItems = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/fuer-unternehmen", label: "Für Unternehmen" },
  { href: "/fuer-bewerber", label: "Für Bewerber" },
  { href: "/branchen", label: "Branchen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const

export const footerColumns = [
  {
    title: "Angebot",
    links: [
      { href: "/leistungen", label: "Leistungen" },
      { href: "/branchen", label: "Branchen & Einsatzbereiche" },
      { href: "/fuer-unternehmen", label: "Für Unternehmen" },
      { href: "/fuer-bewerber", label: "Für Bewerber" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
] as const

export const routesForSitemap = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/leistungen", priority: 0.9, changeFrequency: "monthly" as const },
  {
    path: "/fuer-unternehmen",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/fuer-bewerber",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  { path: "/branchen", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/ueber-uns", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
] as const
