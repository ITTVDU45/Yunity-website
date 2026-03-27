import type { ServiceIconKey } from "@/lib/content/service-icons"

export interface ServiceItem {
  id: string
  /** Kurz-Label für Karten-Badge (Startseite) */
  badge: string
  /** Teaser-Bild (Startseite-Karten) */
  imageSrc: string
  imageAlt: string
  title: string
  short: string
  description: string
  benefitEmployer: string
  benefitWorker: string
  iconKey: ServiceIconKey
}

export const services: ServiceItem[] = [
  {
    id: "eventpersonal",
    badge: "Event & Service",
    imageSrc:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team bei einer professionellen Veranstaltung und Konferenz",
    title: "Eventpersonal",
    short: "Gastgeber:innen, Einlass, Service – reibungslose Abläufe vor Ort.",
    description:
      "Von der Begrüßung bis zur Betreuung: Wir stellen eingespielte Teams für Events jeder Größe – diskret, freundlich, lösungsorientiert.",
    benefitEmployer:
      "Skalierbare Teams, klare Ansprechpartner:innen und kurzfristige Erhöhung der Kapazität ohne langwierige Einstellungsprozesse.",
    benefitWorker:
      "Abwechslungsreiche Einsätze, faire Abstimmung der Schichten und Einarbeitung in wiederkehrende Formate.",
    iconKey: "party",
  },
  {
    id: "promotion",
    badge: "Promotion",
    imageSrc:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team bei einer Markenaktion und Promotion im Außenbereich",
    title: "Promotionaktionen",
    short: "Markenbotschafter:innen mit Auftritt und Routine.",
    description:
      "Aktivierungen, Sampling und POS-Promotion: Wir vermitteln motivierte Promoter:innen, die Ihre Marke souverän repräsentieren.",
    benefitEmployer:
      "Schnelle Besetzung, Briefings nach Briefing-Vorgabe und zuverlässige Reporting-Punkte.",
    benefitWorker:
      "Spannende Kampagnen, Teamgeist vor Ort und transparente Einsatzplanung.",
    iconKey: "megaphone",
  },
  {
    id: "auf-abbau",
    badge: "Auf- & Abbau",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Montage und Aufbauarbeiten auf einer Baustelle mit Schutzhelm",
    title: "Auf- und Abbauarbeiten",
    short: "Strukturiertes Handwerk für temporäre Projekte.",
    description:
      "Messestände, Bühnen und temporäre Strukturen: Hilfskräfte mit Erfahrung in Logistik und sicherem Arbeiten im Team.",
    benefitEmployer:
      "Termintreue, klare Schichten und Personal, das mit Crews und Location-Teams zusammenarbeitet.",
    benefitWorker:
      "Physische, gut planbare Einsätze mit klaren Aufgaben und Teamstrukturen.",
    iconKey: "construction",
  },
  {
    id: "stadion",
    badge: "Stadion & Sport",
    imageSrc:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Volles Stadion bei einer Sportveranstaltung",
    title: "Stadionpersonal",
    short: "Service und Ordnung bei Großevents.",
    description:
      "Einlasskontrollen, Gästeführung und Catering-Support: Wir unterstützen bei Sport- und Entertainment-Events mit erfahrenen Teams.",
    benefitEmployer:
      "Hohe Auslastungsspitzen abfedern und Besucherströme professionell managen.",
    benefitWorker:
      "Event-Atmosphäre, strukturierte Briefings und wiederkehrende Großformate.",
    iconKey: "trophy",
  },
  {
    id: "gastronomie",
    badge: "Gastronomie",
    imageSrc:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Gastronomie und Service im Restaurant mit eingedeckten Tischen",
    title: "Gastronomiepersonal",
    short: "Service, Bar und Küche – dort, wo Gäste im Mittelpunkt stehen.",
    description:
      "Von der Bankettreihe bis zur Festival-Gastro: Wir besetzen kurzfristig Service- und Hilfsrollen mit Erfahrung im Gastro-Alltag.",
    benefitEmployer:
      "Flexible Kapazität bei Saison, Events und Catering-Spitzen – ohne Personalüberhang.",
    benefitWorker:
      "Vielseitige Einsätze, faire Schichtmodelle und schnelle Integration in bestehende Teams.",
    iconKey: "utensils",
  },
  {
    id: "logistik",
    badge: "Logistik",
    imageSrc:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Lagerhalle mit Regalen und Warenverwaltung",
    title: "Logistikhelfer",
    short: "Kommissionierung, Warenbewegung, Unterstützung im Lager.",
    description:
      "Für Peaks, Projekte und saisonale Lasten: zuverlässige Unterstützung in der operativen Logistik.",
    benefitEmployer:
      "Schnelle Aufstockung der Kapazität mit klaren SLAs und nachvollziehbarer Planung.",
    benefitWorker:
      "Klare Aufgabenprofile, geregelte Arbeitszeiten und Einstieg auch für Quereinsteiger:innen.",
    iconKey: "truck",
  },
  {
    id: "buero",
    badge: "Büro & Office",
    imageSrc:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Modernes Büro mit Arbeitsplätzen und Tageslicht",
    title: "Büroaushilfen",
    short: "Backoffice, Daten, Empfang – wenn’s eng wird.",
    description:
      "Aushilfen für administrative Spitzen: von der Dokumentation bis zur telefonischen Erreichbarkeit.",
    benefitEmployer:
      "Projektbezogene Entlastung ohne langfristige Bindung – ideal bei Deadlines und Urlaubsvertretung.",
    benefitWorker:
      "Strukturierte Tätigkeiten, Büro-Nähe und planbare Einsatzfenster.",
    iconKey: "briefcase",
  },
]

export function getServiceById(id: string): ServiceItem | undefined {
  return services.find((s) => s.id === id)
}
