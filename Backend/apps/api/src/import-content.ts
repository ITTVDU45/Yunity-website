import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { AppModule } from "./app.module";
import content from "./content/yunity-content.json";
import { Site } from "./modules/sites/site.schema";
import { User } from "./modules/users/user.schema";
import { CollectionsService } from "./modules/collections/collections.service";
import type {
  CollectionItemDocument,
  CollectionKind,
  CollectionTranslationValue,
} from "./modules/collections/collection-item.schema";
import { PagesService } from "./modules/pages/pages.service";
import type { PageDocument } from "./modules/pages/schemas/page.schema";
import { SectionsService } from "./modules/pages/sections.service";
import { NavigationService } from "./modules/navigation/navigation.service";
import { SettingsService } from "./modules/settings/settings.service";
import { FormsService } from "./modules/forms/forms.service";

/**
 * Uebertraegt die bestehenden Inhalte der Yunity-Website idempotent ins CMS:
 * Einstellungen, Leistungen, Branchen, Stimmen, alle neun Seiten samt
 * Sektionen, die Navigation und die beiden Formulare.
 *
 * Die Sammlungsdaten stammen unveraendert aus `src/lib/content/*.ts` der
 * Website (extrahiert nach `content/yunity-content.json`) — es gibt also keine
 * abgetippte zweite Wahrheit.
 *
 * Steuerung:
 *   CONTENT_IMPORT_FORCE=true          ueberschreibt ALLES, auch im Backend Gepflegtes
 *   CONTENT_IMPORT_KINDS=service,...   schreibt nur diese Sammlungen neu
 *   CONTENT_IMPORT_PAGES=kontakt,...   schreibt nur diese Seiten neu
 */

const SITE_KEY = "yunity";
const LOCALE = "de";

const FORCE = process.env.CONTENT_IMPORT_FORCE === "true";
const PAGE_FILTER = (process.env.CONTENT_IMPORT_PAGES ?? "")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const KIND_FILTER = (process.env.CONTENT_IMPORT_KINDS ?? "")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

function forcesKind(kind: CollectionKind): boolean {
  return FORCE || KIND_FILTER.includes(kind);
}

type BlockData = Record<string, unknown>;
interface SectionPlan {
  blockType: string;
  label: string;
  data: BlockData;
}
interface PagePlan {
  slug: string;
  internalName: string;
  isHomepage?: boolean;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks: SectionPlan[];
}

/** Sprechende Slugs aus den bestehenden IDs der Website. */
const serviceSlug = (id: string) => id;
const industrySlug = (id: string) => id;

/* ------------------------------------------------------------- Seitenplaene */

function homePage(): PagePlan {
  return {
    slug: "home",
    internalName: "Startseite",
    isHomepage: true,
    title: "Flexibles Personal für Events, Promotion & Logistik",
    metaTitle: "Flexibles Personal für Events, Promotion & Logistik",
    metaDescription:
      "Kurzfristig Personal anfragen oder als Bewerber:in flexible Einsätze finden. Yunity vermittelt zuverlässige Teams für Event, Promotion, Gastro, Logistik und Office – deutschlandweit.",
    blocks: [
      { blockType: "hero", label: "Hero", data: {} },
      {
        blockType: "logo-loop",
        label: "Einsatzbereiche",
        data: {
          items: [
            { icon: "music", label: "Festivals" },
            { icon: "building", label: "Messen & Kongresse" },
            { icon: "trophy", label: "Sportveranstaltungen" },
            { icon: "megaphone", label: "Promotion & Roadshows" },
            { icon: "utensils", label: "Gastronomie & Catering" },
            { icon: "package", label: "Logistik & Aufbau" },
          ],
        },
      },
      {
        blockType: "service-grid",
        label: "Leistungen",
        data: { selectionMode: "all", layout: "cards" },
      },
      {
        blockType: "industry-grid",
        label: "Branchen",
        data: { selectionMode: "all", layout: "slider" },
      },
      {
        blockType: "statistics",
        label: "Kennzahlen",
        data: {
          items: content.stats.map((stat) => ({
            value: stat.value,
            suffix: stat.suffix,
            label: stat.label,
          })),
        },
      },
      { blockType: "process-steps", label: "Ablauf", data: {} },
      { blockType: "applicant-cta", label: "Bewerber-CTA", data: {} },
      {
        blockType: "testimonial-slider",
        label: "Stimmen",
        data: {
          selectionMode: "all",
          eyebrow: "Stimmen",
          title: "Was Partner:innen und Mitarbeitende sagen",
          description:
            "Echte Einsätze, klare Erwartungen – und ein Team, das den Unterschied in der Produktion macht.",
        },
      },
      {
        blockType: "accordion",
        label: "FAQ",
        data: {
          eyebrow: "FAQ",
          title: "Häufige Fragen",
          description: "Kurz beantwortet – für schnelle Klarheit in der Anfrage.",
          items: content.homeFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
      },
      { blockType: "cta", label: "Abschluss-CTA", data: {} },
    ],
  };
}

function servicesPage(): PagePlan {
  return {
    slug: "leistungen",
    internalName: "Leistungen",
    title: "Personal, das sich an Ihren Bedarf koppelt",
    metaTitle: "Leistungen – Personalvermittlung für Event, Promotion & Logistik",
    metaDescription:
      "Event- und Festivalpersonal, Promotion, Auf- und Abbau, Stadion, Gastro, Logistik und Büro – kurzfristige Personalbereitstellung mit klar definierten Rollen.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Unsere Leistungen",
          title: "Personal, das sich an Ihren Bedarf koppelt",
          description:
            "Kurzfristige Verfügbarkeit, klare Profile und Teams, die in Live-Settings performen – von der ersten Schicht bis zur langen Serie.",
          imageUrl: content.services[0].imageSrc,
          imageAlt: content.services[0].imageAlt,
          primaryAction: { label: "Personal anfragen", href: "/kontakt" },
          secondaryAction: { label: "Als Talent bewerben", href: "/fuer-bewerber" },
          highlights: ["8 Einsatzbereiche", "Flexible Teamgrößen", "Feste Ansprechpartner"],
        },
      },
      {
        blockType: "service-grid",
        label: "Leistungen im Detail",
        data: {
          selectionMode: "all",
          layout: "detail",
          eyebrow: "Passgenau statt pauschal",
          title: "Ein Pool, viele operative Rollen",
          description:
            "Wir besetzen genau die Funktionen, die Ihr Projekt vor Ort stabil machen – schnell skalierbar und klar gebrieft.",
        },
      },
      { blockType: "cta", label: "Abschluss-CTA", data: { variant: "muted" } },
    ],
  };
}

function companiesPage(): PagePlan {
  return {
    slug: "fuer-unternehmen",
    internalName: "Für Unternehmen",
    title: "Schnelles Personal für Ihre nächste Projektphase",
    metaTitle: "Für Unternehmen – Personal kurzfristig anfragen",
    metaDescription:
      "Kurzfristig Personal für Events, Messen, Logistik und Gastronomie – schnelle Abstimmung, klare Prozesse, planbare Teams. Jetzt unverbindlich anfragen.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Für Unternehmen",
          title: "Schnelles Personal für Ihre nächste Projektphase",
          description:
            "Wenn Zeit knapp ist und Qualität nicht verhandelbar: Wir liefern strukturierte Teams – abgestimmt auf Ort, Zeitraum und Rollenprofil.",
          imageUrl:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Professionelles Team bei der gemeinsamen Projektplanung",
          primaryAction: { label: "Personal anfragen", href: "#personalanfrage" },
          secondaryAction: { label: "Leistungen ansehen", href: "/leistungen" },
          highlights: ["Kurzfristig skalierbar", "Klare Prozesse", "Feste Ansprechpartner"],
        },
      },
      {
        blockType: "icon-card-grid",
        label: "Typische Engpässe",
        data: {
          eyebrow: "Wenn Planung auf Realität trifft",
          title: "Für typische Engpässe gemacht",
          description:
            "Wir verstärken dort, wo operative Belastung entsteht – ohne langwierigen Vorlauf.",
          columns: 3,
          items: [
            {
              icon: "alert",
              title: "Kurzfristige Ausfälle",
              text: "Krankheit, Peaks oder spontane Großprojekte – ohne dass interne Teams ausbrechen.",
            },
            {
              icon: "trending",
              title: "Personalengpässe",
              text: "Saison, Kampagnen oder Messe-Wochen: Bedarf steigt schneller als die Planung.",
            },
            {
              icon: "check",
              title: "Hoher Projektbedarf",
              text: "Großformate brauchen skalierbare Teams und klare Ansprechpartner:innen.",
            },
          ],
        },
      },
      {
        blockType: "checklist-panel",
        label: "Ihre Vorteile",
        data: {
          eyebrow: "Ihre Vorteile",
          title: "Mehr Kapazität. Weniger Reibung.",
          tone: "image",
          imageUrl:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Unternehmensteam in einer strukturierten Projektbesprechung",
          items: [
            "Schneller Zugriff auf qualifizierte Profile aus dem Pool",
            "Flexibel buchbar – von Tageseinsätzen bis zu Serien",
            "Planbare Abläufe mit Briefing und Feedback",
            "Professionelles Auftreten vor Ort",
            "Entlastung für Führung und operative Leads",
          ],
        },
      },
      { blockType: "process-steps", label: "Ablauf", data: {} },
      {
        blockType: "industry-grid",
        label: "Branchen (Auswahl)",
        data: {
          selectionMode: "all",
          layout: "grid",
          limit: 3,
          eyebrow: "Erfahrung im Einsatz",
          title: "Branchen, die wir häufig unterstützen",
          description:
            "Teams für dynamische Umfelder, in denen Timing und Verlässlichkeit zählen.",
          action: { label: "Alle Branchen", href: "/branchen" },
        },
      },
      {
        blockType: "form-embed",
        label: "Personalanfrage",
        data: {
          formKey: "company-inquiry",
          eyebrow: "Unverbindlich starten",
          title: "Was wird wann und wo gebraucht?",
          description:
            "Beschreiben Sie kurz Bedarf und Zeitraum. Wir strukturieren die Anfrage und melden uns mit den nächsten sinnvollen Schritten.",
        },
      },
    ],
  };
}

function applicantsPage(): PagePlan {
  return {
    slug: "fuer-bewerber",
    internalName: "Für Bewerber",
    title: "Flexible Jobs, die in dein Leben passen",
    metaTitle: "Für Bewerber – Flexible Jobs in Event, Gastro & Logistik",
    metaDescription:
      "Flexible Einsätze in Event, Promotion, Gastronomie und Logistik – fair abgestimmt, transparent geplant. Bewirb dich in wenigen Schritten bei Yunity.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Dein nächster Einsatz",
          title: "Flexible Jobs, die in dein Leben passen",
          description:
            "Wenn du zuverlässig bist und vor Ort liefern willst: Wir verbinden dich mit Einsätzen, die zu deinem Profil und deinem Kalender passen.",
          imageUrl:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Junges Team im Austausch vor einem gemeinsamen Einsatz",
          primaryAction: { label: "Profil starten", href: "/kontakt" },
          secondaryAction: { label: "Einsatzbereiche ansehen", href: "/leistungen" },
          highlights: ["Flexible Schichten", "Transparente Planung", "Persönlicher Kontakt"],
        },
      },
      {
        blockType: "icon-card-grid",
        label: "Deine Vorteile",
        data: {
          eyebrow: "Deine Vorteile",
          title: "Arbeiten mit mehr Freiheit und Klarheit",
          description:
            "Du bestimmst, was zu dir passt. Wir kümmern uns um ein klares Matching und einen strukturierten Start.",
          columns: 4,
          items: [
            { icon: "clock", title: "Flexible Einsätze", text: "Schichten und Projekte, die zu deinem Rhythmus passen." },
            { icon: "sparkles", title: "Abwechslung", text: "Von Promotion bis Logistik – du entscheidest mit." },
            { icon: "wallet", title: "Faire Bezahlung", text: "Transparente Modelle und verlässliche Abstimmung." },
            { icon: "heart", title: "Menschlich", text: "Direkte Ansprechpartner:innen statt anonymem Portal." },
          ],
        },
      },
      {
        blockType: "job-examples",
        label: "Beispiel-Einsätze",
        data: {
          eyebrow: "Aktuelle Beispiele",
          title: "So vielfältig kann dein nächster Job sein",
          description:
            "Die Beispiele zeigen typische Einsätze. Konkrete Verfügbarkeiten stimmen wir direkt mit dir ab.",
          items: [
            { title: "Servicekraft (Messe)", location: "Berlin", tag: "3 Tage" },
            { title: "Promoter:in (Aktivierung)", location: "München", tag: "Sa + So" },
            { title: "Logistikhelfer:in", location: "Hamburg", tag: "Peak-Woche" },
          ],
        },
      },
      {
        blockType: "numbered-steps",
        label: "Bewerbung in drei Schritten",
        data: {
          eyebrow: "In drei Schritten",
          title: "So läuft deine Bewerbung",
          description:
            "Unkompliziert starten, passende Optionen prüfen und gut vorbereitet in den Einsatz gehen.",
          items: [
            { number: "01", title: "Kurzprofil", text: "Du sagst uns Verfügbarkeit, Erfahrung und Präferenzen." },
            { number: "02", title: "Match", text: "Wir schlagen passende Einsätze vor – du entscheidest." },
            { number: "03", title: "Start", text: "Briefing, Teamkontakt, erster Tag und Feedback danach." },
          ],
        },
      },
      {
        blockType: "service-grid",
        label: "Einsatzbereiche (Kurzlinks)",
        data: {
          selectionMode: "all",
          layout: "chips",
          eyebrow: "Einsatzbereiche",
          title: "Wo möchtest du mitwirken?",
          action: { label: "Alle Bereiche", href: "/leistungen" },
        },
      },
      { blockType: "applicant-cta", label: "Bewerber-CTA", data: {} },
    ],
  };
}

function industriesPage(): PagePlan {
  return {
    slug: "branchen",
    internalName: "Branchen",
    title: "Wo flexible Teams den Unterschied machen",
    metaTitle: "Branchen & Einsatzbereiche – wo Yunity unterstützt",
    metaDescription:
      "Event, Festival, Messe, Promotion, Gastronomie, Sport, Logistik und mehr: Yunity vermittelt Personal für die Branchen mit hoher operativer Dynamik.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Branchenkompetenz",
          title: "Wo flexible Teams den Unterschied machen",
          description:
            "Wir kennen die Dynamik von Live-Formaten, saisonalen Peaks und operativen Projektphasen – und besetzen genau die Rollen, die vor Ort zählen.",
          imageUrl: content.industries[1].imageSrc,
          imageAlt: content.industries[1].imageAlt,
          primaryAction: { label: "Bedarf besprechen", href: "/kontakt" },
          secondaryAction: { label: "Leistungen ansehen", href: "/leistungen" },
          highlights: ["Events & Messen", "Gastro & Logistik", "Promotion & Projekte"],
        },
      },
      {
        blockType: "industry-grid",
        label: "Alle Branchen",
        data: {
          selectionMode: "all",
          layout: "grid",
          eyebrow: "Einsatzfelder",
          title: "Erfahrung in dynamischen Umfeldern",
          description:
            "Jede Branche hat ihre eigenen Abläufe. Unsere Teams werden passend zum Setting, zur Rolle und zum Zeitplan zusammengestellt.",
        },
      },
      { blockType: "cta", label: "Abschluss-CTA", data: { variant: "muted" } },
    ],
  };
}

function aboutPage(): PagePlan {
  return {
    slug: "ueber-uns",
    internalName: "Über uns",
    title: "Menschen, die operative Realität mögen",
    metaTitle: "Über uns – Operative Personalvermittlung mit Haltung",
    metaDescription:
      "Yunity verbindet operative Zuverlässigkeit mit moderner Personalvermittlung – menschlich, schnell, professionell. Lerne das Team und unsere Werte kennen.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Über Yunity",
          title: "Menschen, die operative Realität mögen",
          description:
            "Wir verbinden kurzfristige Personalbereitstellung mit einem klaren Anspruch: professionell arbeiten, verlässlich kommunizieren und menschlich bleiben.",
          imageUrl:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Yunity Team bei der gemeinsamen Zusammenarbeit",
          primaryAction: { label: "Mit uns sprechen", href: "/kontakt" },
          secondaryAction: { label: "Unsere Leistungen", href: "/leistungen" },
          highlights: ["Menschlich", "Schnell", "Professionell"],
        },
      },
      {
        blockType: "text-image",
        label: "Wer wir sind",
        data: {
          eyebrow: "Wer wir sind",
          title: "Aus Erfahrung für den Einsatz gebaut",
          description:
            "Starke Events, reibungslose Messen und stabile Logistik entstehen durch Teams, die wissen, was vor Ort zählt. Yunity bündelt dieses Know-how in einer schlanken Organisation mit klaren Verantwortlichkeiten und ehrlicher Kommunikation.",
          imageUrl:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Team im persönlichen Austausch",
          imageSide: "left",
        },
      },
      {
        blockType: "icon-card-grid",
        label: "Werte",
        data: {
          eyebrow: "Unsere Haltung",
          title: "Werte, die im Alltag sichtbar werden",
          description:
            "Nicht als Schlagworte, sondern in Planung, Kommunikation und jedem einzelnen Einsatz.",
          columns: 4,
          items: [
            { icon: "shield", title: "Zuverlässigkeit", text: "Wir planen realistisch und liefern nachvollziehbar." },
            { icon: "sparkles", title: "Qualität", text: "Profile, die zur Rolle und zum Einsatz passen." },
            { icon: "gauge", title: "Flexibilität", text: "Skalierbare Lösungen für kurzfristige Bedarfe." },
            { icon: "handshake", title: "Partnerschaft", text: "Wir denken vom Briefing bis zum Feedback mit." },
          ],
        },
      },
      {
        blockType: "checklist-panel",
        label: "Warum Yunity",
        data: {
          eyebrow: "Warum Yunity",
          title: "Nähe zum Einsatz statt Distanz zum Alltag",
          tone: "dark",
          items: [
            "Bestehender, aktiver Mitarbeiterpool",
            "Schnelle Erstreaktion und klare nächste Schritte",
            "Fokus auf operative Rollen",
            "Verständnis für kurzfristige Peaks und Projektrealität",
          ],
        },
      },
      {
        blockType: "team-cards",
        label: "Team",
        data: {
          eyebrow: "Das Team",
          title: "Direkte Ansprechpartner",
          description:
            "Die Profile werden mit den finalen Teamfotos und persönlichen Kurzbeschreibungen ergänzt.",
          items: [
            { name: "Vorname Nachname", role: "Gründung & Operations" },
            { name: "Vorname Nachname", role: "Recruiting & Pool" },
          ],
        },
      },
      { blockType: "cta", label: "Abschluss-CTA", data: { variant: "muted" } },
    ],
  };
}

function contactPage(): PagePlan {
  return {
    slug: "kontakt",
    internalName: "Kontakt",
    title: "Lassen Sie uns kurz sprechen",
    metaTitle: "Kontakt – Personalanfrage oder Bewerbung starten",
    metaDescription:
      "Yunity per Telefon, E-Mail oder Formular kontaktieren. Wir antworten typischerweise innerhalb von 1–2 Werktagen – bei dringenden Einsätzen schneller.",
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: {
          eyebrow: "Direkter Kontakt",
          title: "Lassen Sie uns kurz sprechen",
          description:
            "Ob Personalanfrage oder Bewerbung: Wir melden uns zeitnah mit den nächsten sinnvollen Schritten.",
          imageUrl:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=85&auto=format&fit=crop",
          imageAlt: "Persönliches Beratungsgespräch in einem modernen Büro",
          primaryAction: { label: "Nachricht senden", href: "#kontaktformular" },
          secondaryAction: { label: "Direkt anrufen", href: "tel:+493012345678" },
          highlights: ["Persönlich erreichbar", "Schnelle Rückmeldung", "Unverbindlicher Erstkontakt"],
        },
      },
      {
        blockType: "contact-cards",
        label: "Kontaktwege",
        data: {
          items: [
            { icon: "phone", label: "Telefon", value: "+49 30 123 456 789", href: "tel:+493012345789" },
            { icon: "mail", label: "E-Mail", value: "kontakt@yunity.de", href: "mailto:kontakt@yunity.de" },
            { icon: "clock", label: "Antwortzeit", value: "Meist innerhalb von 1–2 Werktagen" },
          ],
        },
      },
      {
        blockType: "form-embed",
        label: "Kontaktformular",
        data: {
          formKey: "contact",
          eyebrow: "Ihre Nachricht",
          title: "Worum geht es?",
          description:
            "Ein paar Eckdaten reichen für den Start. Wir ordnen Ihre Anfrage direkt dem richtigen Ansprechpartner zu.",
        },
      },
      {
        blockType: "accordion",
        label: "FAQ Kontakt",
        data: {
          eyebrow: "Kurz vorab",
          title: "Häufige Fragen zum Kontakt",
          description: "Die wichtigsten Antworten, bevor wir persönlich ins Gespräch gehen.",
          items: content.contactFaqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
      },
    ],
  };
}

function legalPage(
  slug: "impressum" | "datenschutz",
  title: string,
  intro: string,
  body: string,
  metaDescription: string,
): PagePlan {
  return {
    slug,
    internalName: title,
    title,
    metaTitle: title,
    metaDescription,
    blocks: [
      {
        blockType: "page-hero",
        label: "Seitenkopf",
        data: { title, description: intro },
      },
      { blockType: "rich-text", label: "Inhalt", data: { body } },
    ],
  };
}

function pagePlans(): PagePlan[] {
  return [
    homePage(),
    servicesPage(),
    companiesPage(),
    applicantsPage(),
    industriesPage(),
    aboutPage(),
    contactPage(),
    // Rechtstexte 1:1 aus den bisherigen Seiten uebernommen — inhaltlich
    // weiterhin Platzhalter der Website, aber ab jetzt im Backend redigierbar.
    legalPage(
      "impressum",
      "Impressum",
      "Platzhalter – bitte durch Ihre rechtskonformen Angaben ersetzen.",
      [
        "<p><strong>Yunity</strong><br />Musterstraße 12<br />10115 Berlin</p>",
        "<p>Telefon: +49 30 123 456 789<br />E-Mail: kontakt@yunity.de</p>",
        "<p>Vertretungsberechtigt: [Name der vertretungsberechtigten Person]<br />",
        "Registergericht: [falls zutreffend]<br />USt-IdNr.: [falls vorhanden]</p>",
        "<p>Haftungshinweise, Streitschlichtung und weitere Pflichtangaben nach Ihrer Rechtsberatung ergänzen.</p>",
      ].join(""),
      "Impressum und Pflichtangaben der Yunity Personalvermittlung.",
    ),
    legalPage(
      "datenschutz",
      "Datenschutz",
      "Platzhalter – bitte durch eine vollständige Datenschutzerklärung ersetzen.",
      [
        "<p>Diese Seite enthält noch keinen vollständigen Datenschutztext. Für den Live-Betrieb ",
        "benötigen Sie eine rechtskonforme Erklärung inkl. Verantwortlicher, Zwecke, ",
        "Rechtsgrundlagen, Speicherdauer, Betroffenenrechte und Kontakt der Datenschutzaufsicht.</p>",
        "<p>Anfragen über die Formulare dieser Website werden im CMS-Backend gespeichert ",
        "und nach der eingestellten Aufbewahrungsfrist automatisch gelöscht.</p>",
      ].join(""),
      "Informationen zur Verarbeitung personenbezogener Daten.",
    ),
  ];
}

/* ------------------------------------------------------------------- Ablauf */

async function run(): Promise<void> {
  const logger = new Logger("ContentImport");
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });

  try {
    const siteModel = app.get<Model<Site>>(getModelToken(Site.name));
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const collections = app.get(CollectionsService);
    const pages = app.get(PagesService);
    const sections = app.get(SectionsService);
    const navigation = app.get(NavigationService);
    const settings = app.get(SettingsService);
    const forms = app.get(FormsService);

    const site = await siteModel.findOne({ key: SITE_KEY, deletedAt: null });
    if (!site) {
      throw new Error(`Site "${SITE_KEY}" fehlt. Bitte zuerst "npm run seed" ausfuehren.`);
    }
    const admin = await userModel.findOne({ status: "ACTIVE", deletedAt: null });
    const siteId = site._id.toString();
    const userId = admin?._id.toString() ?? siteId;

    // Ein auf einzelne Seiten begrenzter Lauf fasst die Einstellungen nicht an;
    // sonst wuerden dort gepflegte Kontaktdaten zurueckgesetzt.
    if (PAGE_FILTER.length === 0) {
      await settings.putGroup(siteId, "general", {
        projectName: "Yunity",
        tagline: "Kurzfristig. Zuverlässig. Professionell.",
        defaultLocale: "de",
        timezone: "Europe/Berlin",
      });
      await settings.putGroup(siteId, "company", {
        name: "Yunity",
        legalName: "Yunity Personalvermittlung",
        email: "kontakt@yunity.de",
        phone: "+49 30 123 456 789",
        phoneE164: "+493012345678",
        street: "Musterstraße 12",
        zip: "10115",
        city: "Berlin",
        openingHours: "Mo-Fr 09:00-18:00",
      });
      await settings.putGroup(siteId, "seo", {
        defaultMetaTitle:
          "Yunity – Flexibles Personal für Events, Promotion & Logistik",
        titleTemplate: "%s · Yunity",
        defaultMetaDescription:
          "Personalvermittlung mit Fokus auf kurzfristige Personalbereitstellung für Events, Promotion, Messen, Gastronomie, Logistik und projektbezogene Einsätze.",
      });
      await settings.putGroup(siteId, "footer", {
        claim: "Personalbedarf oder Lust auf den nächsten Einsatz?",
        claimText:
          "Ob Unternehmen oder Bewerber:in – bei Yunity führt ein klarer Weg direkt zum passenden Team oder Job.",
        trustPoints:
          "Kurzfristig verfügbar, Feste Ansprechpartner, Deutschlandweite Einsätze",
        linkedin: "https://www.linkedin.com/company/yunity",
        instagram: "https://www.instagram.com/yunity",
      });
      logger.log("Einstellungen geschrieben.");
    }

    /* ---------------------------------------------------------- Sammlungen */

    const upsertCollection = async (
      kind: CollectionKind,
      slug: string,
      translation: CollectionTranslationValue,
      attributes: Record<string, unknown> = {},
      position?: number,
    ): Promise<CollectionItemDocument | null> => {
      if (KIND_FILTER.length > 0 && !KIND_FILTER.includes(kind)) {
        return null;
      }
      const existing = await collections.list(siteId, kind, { page: 1, limit: 500 });
      let item = existing.items.find((entry) => entry.translations.de?.slug === slug);
      if (!item) {
        item = await collections.create(siteId, kind, userId, {
          title: translation.title ?? slug,
          slug,
          attributes,
        });
      } else if (!forcesKind(kind) && item.currentPublishedRevisionId) {
        return item;
      }
      await collections.update(siteId, kind, userId, item._id.toString(), {
        locale: LOCALE,
        translation: { ...translation, slug, translationStatus: "COMPLETE" },
      });
      item = await collections.update(siteId, kind, userId, item._id.toString(), {
        attributes,
        ...(position === undefined ? {} : { position }),
      });
      await collections.runWorkflow(siteId, kind, userId, item._id.toString(), "publish");
      return item;
    };

    let serviceCount = 0;
    for (const [index, service] of content.services.entries()) {
      const item = await upsertCollection(
        "service",
        serviceSlug(service.id),
        {
          title: service.title,
          excerpt: service.short,
          body: service.description,
          metaTitle: service.title,
          metaDescription: service.short,
          details: {
            badge: service.badge,
            benefitEmployer: service.benefitEmployer,
            benefitWorker: service.benefitWorker,
            imageAlt: service.imageAlt,
            imageUrl: service.imageSrc,
          },
        },
        { iconKey: service.iconKey, anchorId: service.id },
        (index + 1) * 1000,
      );
      if (item) serviceCount += 1;
    }
    if (serviceCount) logger.log(`${serviceCount} Leistungen veroeffentlicht.`);

    let industryCount = 0;
    for (const [index, industry] of content.industries.entries()) {
      const item = await upsertCollection(
        "industry",
        industrySlug(industry.id),
        {
          title: industry.title,
          excerpt: industry.description,
          metaTitle: industry.title,
          metaDescription: industry.description,
          details: {
            support: industry.support,
            imageAlt: industry.imageAlt,
            imageUrl: industry.imageSrc,
          },
        },
        { iconKey: industry.iconKey },
        (index + 1) * 1000,
      );
      if (item) industryCount += 1;
    }
    if (industryCount) logger.log(`${industryCount} Branchen veroeffentlicht.`);

    let testimonialCount = 0;
    for (const [index, testimonial] of content.testimonials.entries()) {
      const item = await upsertCollection(
        "testimonial",
        `stimme-${testimonial.id}`,
        {
          title: testimonial.name,
          subtitle: testimonial.role,
          excerpt: testimonial.quote,
          details: {
            company: testimonial.company,
            imageAlt: testimonial.imageAlt,
            imageUrl: testimonial.imageSrc,
          },
        },
        {},
        (index + 1) * 1000,
      );
      if (item) testimonialCount += 1;
    }
    if (testimonialCount) logger.log(`${testimonialCount} Stimmen veroeffentlicht.`);

    /* ---------------------------------------------------------- Navigation */

    const NAVIGATIONS = [
      {
        key: "header",
        name: "Hauptnavigation",
        items: [
          { label: "Leistungen", url: "/leistungen" },
          { label: "Für Unternehmen", url: "/fuer-unternehmen" },
          { label: "Für Bewerber", url: "/fuer-bewerber" },
          { label: "Branchen", url: "/branchen" },
          { label: "Über uns", url: "/ueber-uns" },
          { label: "Kontakt", url: "/kontakt" },
        ],
      },
      {
        key: "footer",
        name: "Footer",
        items: [
          { label: "Leistungen", url: "/leistungen" },
          { label: "Branchen & Einsatzbereiche", url: "/branchen" },
          { label: "Für Unternehmen", url: "/fuer-unternehmen" },
          { label: "Für Bewerber", url: "/fuer-bewerber" },
          { label: "Über uns", url: "/ueber-uns" },
          { label: "Kontakt", url: "/kontakt" },
          { label: "Impressum", url: "/impressum" },
          { label: "Datenschutz", url: "/datenschutz" },
        ],
      },
    ];

    if (PAGE_FILTER.length === 0 && KIND_FILTER.length === 0) {
      for (const plan of NAVIGATIONS) {
        const all = await navigation.listNavigations(siteId);
        let nav = all.find((entry) => entry.key === plan.key);
        if (!nav) {
          nav = await navigation.createNavigation(siteId, {
            key: plan.key,
            name: plan.name,
          });
        }
        const current = await navigation.getItems(siteId, nav._id.toString());
        if (FORCE) {
          for (const item of current) {
            await navigation.removeItem(siteId, item._id.toString());
          }
        } else if (current.length > 0) {
          continue;
        }
        for (const entry of plan.items) {
          await navigation.addItem(siteId, nav._id.toString(), {
            type: "EXTERNAL",
            label: entry.label,
            url: entry.url,
            locale: LOCALE,
          });
        }
        logger.log(`Navigation "${plan.key}": ${plan.items.length} Eintraege.`);
      }
    }

    /* ------------------------------------------------------------ Formulare */

    const FORM_PLANS = [
      {
        key: "contact",
        name: "Kontakt",
        successMessage:
          "Vielen Dank für Ihre Nachricht – wir melden uns zeitnah bei Ihnen.",
        fields: [
          { type: "text", name: "name", label: "Name", required: true, width: "HALF", placeholder: "Vor- und Nachname" },
          { type: "email", name: "email", label: "E-Mail", required: true, width: "HALF", placeholder: "mail@beispiel.de" },
          { type: "phone", name: "phone", label: "Telefon", required: false, width: "FULL", placeholder: "+49 …" },
          { type: "text", name: "topic", label: "Thema", required: false, width: "FULL", placeholder: "Personalanfrage, Bewerbung, Sonstiges" },
          { type: "textarea", name: "message", label: "Nachricht", required: true, width: "FULL", placeholder: "Wie können wir helfen?" },
        ],
      },
      {
        key: "company-inquiry",
        name: "Personalanfrage",
        successMessage:
          "Danke für Ihre Anfrage – wir melden uns mit den nächsten Schritten.",
        fields: [
          { type: "text", name: "company", label: "Unternehmen", required: true, width: "HALF", placeholder: "Firmenname" },
          { type: "text", name: "contact", label: "Ansprechperson", required: true, width: "HALF", placeholder: "Name" },
          { type: "email", name: "email", label: "E-Mail", required: true, width: "HALF", placeholder: "mail@firma.de" },
          { type: "phone", name: "phone", label: "Telefon", required: false, width: "HALF", placeholder: "+49 …" },
          { type: "text", name: "industry", label: "Branche / Kontext", required: false, width: "FULL", placeholder: "z. B. Messe, Festival, Logistik-Peak" },
          { type: "text", name: "period", label: "Zeitraum", required: false, width: "FULL", placeholder: "z. B. KW 12–14 / einzelner Termin" },
          { type: "textarea", name: "need", label: "Personalbedarf", required: true, width: "FULL", placeholder: "Rollen, Anzahl, Skills, Besonderheiten …" },
        ],
      },
    ];

    if (PAGE_FILTER.length === 0 && KIND_FILTER.length === 0) {
      for (const plan of FORM_PLANS) {
        const existing = await forms.list(siteId);
        let form = existing.find((entry) => entry.key === plan.key);
        if (!form) {
          form = await forms.create(siteId, {
            name: plan.name,
            key: plan.key,
            locale: LOCALE,
          });
        }
        if (FORCE) {
          for (const field of [...form.fields]) {
            await forms.removeField(siteId, form._id.toString(), field._id?.toString() ?? "");
          }
          form = await forms.getOwned(siteId, form._id.toString());
        }
        if (FORCE || form.fields.length === 0) {
          for (const fieldPlan of plan.fields) {
            const updated = await forms.addField(siteId, form._id.toString(), {
              type: fieldPlan.type as never,
              locale: LOCALE,
            });
            const field = updated.fields[updated.fields.length - 1];
            await forms.updateField(siteId, form._id.toString(), field._id?.toString() ?? "", {
              locale: LOCALE,
              name: fieldPlan.name,
              required: fieldPlan.required,
              width: fieldPlan.width as never,
              translation: {
                label: fieldPlan.label,
                placeholder: fieldPlan.placeholder,
              },
            });
          }
        }
        await forms.update(siteId, form._id.toString(), {
          status: "ACTIVE",
          locale: LOCALE,
          translation: {
            title: plan.name,
            successMessage: plan.successMessage,
            privacyText:
              "Mit dem Absenden stimmen Sie der Verarbeitung zu Informationszwecken zu – Details in der Datenschutzerklärung.",
          },
        });
        logger.log(`Formular "${plan.key}": ${plan.fields.length} Felder.`);
      }
    }

    /* ---------------------------------------------------------------- Seiten */

    const existingPages = await pages.list(siteId, { page: 1, limit: 500 });
    let pageCount = 0;
    for (const plan of pagePlans()) {
      if (PAGE_FILTER.length > 0 && !PAGE_FILTER.includes(plan.slug)) {
        continue;
      }
      if (KIND_FILTER.length > 0 && PAGE_FILTER.length === 0) {
        // Ein reiner Sammlungs-Lauf laesst die Seiten in Ruhe.
        continue;
      }
      const forcePage = FORCE || PAGE_FILTER.includes(plan.slug);
      let page: PageDocument | undefined = plan.isHomepage
        ? existingPages.items.find((entry) => entry.isHomepage)
        : existingPages.items.find(
            (entry) => entry.translations.de?.slug === plan.slug,
          );
      if (!page) {
        page = await pages.create(siteId, userId, {
          internalName: plan.internalName,
          title: plan.title,
          slug: plan.slug,
          isHomepage: plan.isHomepage,
        });
      } else if (!forcePage && page.currentPublishedRevisionId) {
        continue;
      }

      await pages.update(siteId, userId, page._id.toString(), {
        locale: LOCALE,
        internalName: plan.internalName,
        isHomepage: plan.isHomepage ?? false,
        translation: {
          title: plan.title,
          slug: plan.slug,
          metaTitle: plan.metaTitle,
          metaDescription: plan.metaDescription,
          translationStatus: "COMPLETE",
        },
      });

      await sections.deleteAllForOwner(siteId, "PAGE", page._id.toString());
      for (const sectionPlan of plan.blocks) {
        const section = await sections.add(siteId, "PAGE", page._id.toString(), {
          blockType: sectionPlan.blockType,
          internalLabel: sectionPlan.label,
        });
        await sections.update(
          siteId,
          "PAGE",
          page._id.toString(),
          section._id.toString(),
          { locale: LOCALE, data: sectionPlan.data },
        );
      }

      await pages.runWorkflow(siteId, userId, page._id.toString(), "publish", {
        changeSummary: "Import der Bestandsinhalte",
      });
      pageCount += 1;
      logger.log(`${plan.internalName}: ${plan.blocks.length} Sektionen veroeffentlicht.`);
    }
    if (pageCount) logger.log(`${pageCount} Seiten veroeffentlicht.`);

    if (!FORCE && KIND_FILTER.length === 0 && PAGE_FILTER.length === 0) {
      // Sonst sieht ein Lauf, der jeden veroeffentlichten Eintrag uebersprungen
      // hat, genauso aus wie ein erfolgreicher.
      logger.warn(
        "Bereits veroeffentlichte Eintraege wurden uebersprungen. Zum gezielten " +
          "Nachziehen CONTENT_IMPORT_KINDS=service setzen, " +
          "CONTENT_IMPORT_PAGES=kontakt fuer einzelne Seiten, " +
          "CONTENT_IMPORT_FORCE=true ueberschreibt alles.",
      );
    }
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  run().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
