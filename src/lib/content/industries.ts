import type { IndustryIconKey } from "@/lib/content/industry-icons"

export interface IndustryItem {
  id: string
  title: string
  description: string
  support: string
  iconKey: IndustryIconKey
  /** Teaser-Bild (Karten & Slider) */
  imageSrc: string
  imageAlt: string
}

export const industries: IndustryItem[] = [
  {
    id: "eventagenturen",
    title: "Eventagenturen",
    description:
      "Komplexe Produktionen mit vielen Schnittstellen – wir liefern zuverlässige Teams für die operative Umsetzung.",
    support:
      "Personal für Aufbau, Laufzeit und Abbau – abgestimmt auf Ihre Crew-Struktur und Zeitpläne.",
    iconKey: "party",
    imageSrc:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Professionelle Event- und Konferenzkulisse mit Besucher:innen",
  },
  {
    id: "festivals",
    title: "Festivalveranstalter",
    description:
      "Hohe Besucherzahlen, lange Tage und klare Sicherheits- und Serviceanforderungen.",
    support:
      "Skalierbare Besetzung für Einlass, Gastro, Info und Support – mit Erfahrung in Großevents.",
    iconKey: "tent",
    imageSrc:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Konzertpublikum bei einem Festival mit Bühnenlicht",
  },
  {
    id: "messen",
    title: "Messeveranstalter",
    description:
      "Präzise Abläufe und professionelle Interaktion auf der Fläche.",
    support:
      "Hostessen, Service und Hilfskräfte für Auf- und Abbau – termingetrieben und briefingsicher.",
    iconKey: "building",
    imageSrc:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Moderner Messestand mit Besucher:innen und Ausstellung",
  },
  {
    id: "promotion",
    title: "Promotionagenturen",
    description:
      "Markenaktionen leben von Präsenz und Qualität – jedes Gesicht zählt.",
    support:
      "Promoter:innen mit kurzen Einarbeitungszeiten und klaren Rollenbildern.",
    iconKey: "megaphone",
    imageSrc:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team bei einer Promotion- und Markenaktion im Außenbereich",
  },
  {
    id: "marketing",
    title: "Marketingagenturen",
    description:
      "Wenn Kampagnen live gehen, muss das Team auf Anhieb funktionieren.",
    support:
      "Flexible Einsatzteams für Roadshows, Pop-ups und Aktivierungen.",
    iconKey: "chart",
    imageSrc:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Kreatives Team bei der Zusammenarbeit in einem modernen Büro",
  },
  {
    id: "gastro",
    title: "Gastronomie & Catering",
    description:
      "Peak-Zeiten, Events und saisonale Spitzen – ohne feste Überkapazität.",
    support:
      "Servicekräfte und Hilfsrollen für Küche und Front – kurzfristig planbar.",
    iconKey: "pizza",
    imageSrc:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Gastronomie: Restaurant mit Gästen und eingedeckten Tischen",
  },
  {
    id: "sport",
    title: "Stadien & Sportveranstaltungen",
    description:
      "Große Menschenmengen, hohe Standards: Sicherheit und Service im Gleichgewicht.",
    support:
      "Personal für Einlass, Service und Support – strukturiert und erfahren mit Großevents.",
    iconKey: "users",
    imageSrc:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Volles Fußballstadion bei einer Sportveranstaltung",
  },
  {
    id: "logistik",
    title: "Logistikunternehmen",
    description:
      "Peaks in der Auslastung und Projektphasen erfordern schnelle Verstärkung.",
    support:
      "Hilfskräfte für Kommissionierung, Warenbewegung und operative Unterstützung.",
    iconKey: "truck",
    imageSrc:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Lagerhalle mit Regalen und Warenverwaltung",
  },
  {
    id: "projekt",
    title: "Projektunternehmen",
    description:
      "Projekte mit Start, Stopp und klaren Meilensteinen – Personalbedarf schwankt.",
    support:
      "Zeitlich begrenzte Teams, die auf kurzfristige Anforderungen reagieren.",
    iconKey: "factory",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Arbeiter mit Schutzhelm auf einer Baustelle",
  },
  {
    id: "kurzfristig",
    title: "Unternehmen mit kurzfristigem Personalbedarf",
    description:
      "Ausfälle, Auftragsspitzen oder kurzfristige Skalierung – ohne langen Vorlauf.",
    support:
      "Schnelle Abstimmung, klarer Prozess und verlässliche Besetzung aus dem Pool.",
    iconKey: "clock",
    imageSrc:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team in einem Meeting zur schnellen Personalplanung",
  },
]
