export const siteConfig = {
  name: "Yunity",
  tagline: "Kurzfristig. Zuverlässig. Professionell.",
  description:
    "Personalvermittlung mit Fokus auf kurzfristige Personalbereitstellung für Events, Promotion, Messen, Gastronomie, Logistik und projektbezogene Einsätze.",
  url: "https://www.yunity.de",
  email: "kontakt@yunity.de",
  phone: "+49 30 123 456 789",
  phoneDisplay: "+49 30 123 456 789",
  address: {
    street: "Musterstraße 12",
    zip: "10115",
    city: "Berlin",
  },
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
