import { z } from "zod";
import type { BlockDefinition } from "./types";

/**
 * Gemeinsame Teilschemata. Felder sind bewusst grosszuegig optional gehalten:
 * Validierung prueft Typen und Grenzen, nicht die Vollstaendigkeit — so bleiben
 * teilweise befuellte Sektionen im Editor jederzeit speicherbar. Renderer im
 * Frontend muessen mit fehlenden optionalen Feldern umgehen koennen und fallen
 * dann auf die statischen Standardtexte der Website zurueck.
 */
export const actionSchema = z.object({
  label: z.string().max(80),
  href: z.string().max(500),
});

export const sectionHeaderSchema = z.object({
  eyebrow: z.string().max(80).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(600).optional(),
});

/** Kopfzeile (Eyebrow/Titel/Beschreibung) als wiederverwendbare Felder. */
const headerShape = {
  eyebrow: z.string().max(80).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(1200).optional(),
};

/**
 * Icon-Schluessel werden im Frontend gegen geschlossene Maps aufgeloest.
 * Hier bleibt es ein freier String — ein unbekannter Wert fuehrt dort zum
 * Standard-Icon statt zu einem Absturz.
 */
const iconKey = z.string().max(40).optional();

/** Bild: entweder Medien-ID aus der Mediathek oder direkte URL. */
const imageShape = {
  mediaId: z.string().max(60).optional(),
  imageUrl: z.string().max(1000).optional(),
  imageAlt: z.string().max(300).optional(),
};

// ---------------------------------------------------------------- Kopfbereich

const heroSchema = z
  .object({
    badge: z.string().max(120).optional(),
    title: z.string().max(300).optional(),
    description: z.string().max(1200).optional(),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    /** Kleingedruckte Zeile unter den Buttons. */
    footnote: z.string().max(400).optional(),
    ...imageShape,
  })
  .strict();

const pageHeroSchema = z
  .object({
    ...headerShape,
    ...imageShape,
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    highlights: z.array(z.string().max(80)).max(6).optional(),
  })
  .strict();

// -------------------------------------------------------------------- Inhalte

const richTextSchema = z
  .object({
    ...headerShape,
    body: z.string().max(40000).optional(),
  })
  .strict();

const textImageSchema = z
  .object({
    ...headerShape,
    ...imageShape,
    body: z.string().max(20000).optional(),
    /** Bildseite im zweispaltigen Panel. */
    imageSide: z.enum(["left", "right"]).optional(),
    action: actionSchema.optional(),
  })
  .strict();

const iconCardGridSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          icon: iconKey,
          title: z.string().max(200),
          text: z.string().max(1200).optional(),
        }),
      )
      .max(12)
      .optional(),
    columns: z.number().int().min(2).max(4).optional(),
  })
  .strict();

const numberedStepsSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          number: z.string().max(8).optional(),
          title: z.string().max(200),
          text: z.string().max(1200).optional(),
        }),
      )
      .max(8)
      .optional(),
  })
  .strict();

/** Animierte Prozessleiste der Startseite bzw. /fuer-unternehmen. */
const processStepsSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          step: z.string().max(8).optional(),
          title: z.string().max(200),
          text: z.string().max(1200).optional(),
        }),
      )
      .max(8)
      .optional(),
    action: actionSchema.optional(),
  })
  .strict();

const checklistPanelSchema = z
  .object({
    ...headerShape,
    ...imageShape,
    items: z.array(z.string().max(300)).max(12).optional(),
    /** Helles Panel mit Bild oder dunkle Vollflaeche. */
    tone: z.enum(["image", "dark"]).optional(),
  })
  .strict();

const statisticsSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          value: z.number(),
          prefix: z.string().max(8).optional(),
          suffix: z.string().max(8).optional(),
          label: z.string().max(200),
        }),
      )
      .max(6)
      .optional(),
  })
  .strict();

const accordionSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          question: z.string().max(300),
          answer: z.string().max(4000),
        }),
      )
      .max(30)
      .optional(),
  })
  .strict();

/** Endlos laufende Einsatzbereiche-Leiste unter dem Hero. */
const logoLoopSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          icon: iconKey,
          label: z.string().max(120),
        }),
      )
      .max(16)
      .optional(),
  })
  .strict();

const jobExamplesSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          title: z.string().max(200),
          location: z.string().max(120).optional(),
          tag: z.string().max(60).optional(),
        }),
      )
      .max(12)
      .optional(),
  })
  .strict();

/**
 * Teamkarten auf „Über uns". Bewusst ein Block und keine Collection: das Team
 * ist klein, erscheint nur an dieser einen Stelle und braucht weder Detailseite
 * noch Slug.
 */
const teamCardsSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          name: z.string().max(160),
          role: z.string().max(160).optional(),
          mediaId: z.string().max(60).optional(),
          imageUrl: z.string().max(1000).optional(),
          imageAlt: z.string().max(300).optional(),
        }),
      )
      .max(12)
      .optional(),
  })
  .strict();

const contactCardsSchema = z
  .object({
    ...headerShape,
    items: z
      .array(
        z.object({
          icon: iconKey,
          label: z.string().max(120),
          value: z.string().max(300),
          href: z.string().max(500).optional(),
        }),
      )
      .max(6)
      .optional(),
  })
  .strict();

const quoteSchema = z
  .object({
    text: z.string().max(1000).optional(),
    author: z.string().max(160).optional(),
    role: z.string().max(160).optional(),
  })
  .strict();

// ---------------------------------------------------------------- Interaktion

const ctaSchema = z
  .object({
    title: z.string().max(300).optional(),
    description: z.string().max(1200).optional(),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    variant: z.enum(["default", "muted"]).optional(),
  })
  .strict();

const applicantCtaSchema = z
  .object({
    badge: z.string().max(80).optional(),
    title: z.string().max(300).optional(),
    description: z.string().max(1200).optional(),
    action: actionSchema.optional(),
    ...imageShape,
  })
  .strict();

const formEmbedSchema = z
  .object({
    ...headerShape,
    formKey: z.string().max(60).optional(),
    compact: z.boolean().optional(),
  })
  .strict();

// ----------------------------------------------------------------- Sammlungen

/** Auswahllogik fuer Collection-Bloecke (referenzieren, nicht duplizieren). */
export const SELECTION_MODES = [
  "all",
  "manual",
  "featured",
  "byService",
  "byIndustry",
  "byCompetency",
  "latest",
  "ordered",
] as const;

const collectionQueryShape = {
  ...headerShape,
  selectionMode: z.enum(SELECTION_MODES).optional(),
  selectedIds: z.array(z.string().max(60)).max(50).optional(),
  filterId: z.string().max(60).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  action: actionSchema.optional(),
};

const serviceGridSchema = z
  .object({
    ...collectionQueryShape,
    /** cards = Startseite, detail = Leistungsseite, chips = Kurzlinks. */
    layout: z.enum(["cards", "detail", "chips"]).optional(),
  })
  .strict();

const industryGridSchema = z
  .object({
    ...collectionQueryShape,
    layout: z.enum(["slider", "grid"]).optional(),
  })
  .strict();

const testimonialSliderSchema = z.object(collectionQueryShape).strict();
const blogGridSchema = z.object(collectionQueryShape).strict();

/** Katalog der verfuegbaren Inhaltsbloecke der Yunity-Website. */
export const CORE_BLOCKS: BlockDefinition[] = [
  {
    key: "hero",
    label: "Startseiten-Hero",
    category: "header",
    schemaVersion: 1,
    schema: heroSchema,
    defaultValue: {},
    editorComponent: "HeroBlockEditor",
    rendererKey: "HeroSection",
  },
  {
    key: "page-hero",
    label: "Seiten-Header",
    category: "header",
    schemaVersion: 1,
    schema: pageHeroSchema,
    defaultValue: {},
    editorComponent: "PageHeroBlockEditor",
    rendererKey: "PageHero",
  },
  {
    key: "logo-loop",
    label: "Einsatzbereiche-Laufband",
    category: "content",
    schemaVersion: 1,
    schema: logoLoopSchema,
    defaultValue: { items: [] },
    editorComponent: "LogoLoopBlockEditor",
    rendererKey: "TechnologyStackContent",
  },
  {
    key: "rich-text",
    label: "Fliesstext",
    category: "content",
    schemaVersion: 1,
    schema: richTextSchema,
    defaultValue: { body: "" },
    editorComponent: "RichTextBlockEditor",
    rendererKey: "RichTextSection",
  },
  {
    key: "text-image",
    label: "Text mit Bild",
    category: "content",
    schemaVersion: 1,
    schema: textImageSchema,
    defaultValue: {},
    editorComponent: "TextImageBlockEditor",
    rendererKey: "TextImageSection",
  },
  {
    key: "icon-card-grid",
    label: "Icon-Karten",
    category: "content",
    schemaVersion: 1,
    schema: iconCardGridSchema,
    defaultValue: { items: [] },
    editorComponent: "IconCardGridBlockEditor",
    rendererKey: "IconCardGridSection",
  },
  {
    key: "numbered-steps",
    label: "Nummerierte Schritte",
    category: "content",
    schemaVersion: 1,
    schema: numberedStepsSchema,
    defaultValue: { items: [] },
    editorComponent: "NumberedStepsBlockEditor",
    rendererKey: "NumberedStepsSection",
  },
  {
    key: "process-steps",
    label: "Ablauf (animiert)",
    category: "content",
    schemaVersion: 1,
    schema: processStepsSchema,
    defaultValue: { items: [] },
    editorComponent: "ProcessStepsBlockEditor",
    rendererKey: "ProcessSteps",
  },
  {
    key: "checklist-panel",
    label: "Vorteils-Panel",
    category: "content",
    schemaVersion: 1,
    schema: checklistPanelSchema,
    defaultValue: { items: [], tone: "image" },
    editorComponent: "ChecklistPanelBlockEditor",
    rendererKey: "ChecklistPanelSection",
  },
  {
    key: "statistics",
    label: "Kennzahlen",
    category: "content",
    schemaVersion: 1,
    schema: statisticsSchema,
    defaultValue: { items: [] },
    editorComponent: "StatisticsBlockEditor",
    rendererKey: "StatsSection",
  },
  {
    key: "accordion",
    label: "Akkordeon / FAQ",
    category: "content",
    schemaVersion: 1,
    schema: accordionSchema,
    defaultValue: { items: [] },
    editorComponent: "AccordionBlockEditor",
    rendererKey: "FaqAccordion",
  },
  {
    key: "job-examples",
    label: "Beispiel-Einsaetze",
    category: "content",
    schemaVersion: 1,
    schema: jobExamplesSchema,
    defaultValue: { items: [] },
    editorComponent: "JobExamplesBlockEditor",
    rendererKey: "JobExamplesSection",
  },
  {
    key: "team-cards",
    label: "Teamkarten",
    category: "content",
    schemaVersion: 1,
    schema: teamCardsSchema,
    defaultValue: { items: [] },
    editorComponent: "TeamCardsBlockEditor",
    rendererKey: "TeamCardsSection",
  },
  {
    key: "contact-cards",
    label: "Kontaktkacheln",
    category: "content",
    schemaVersion: 1,
    schema: contactCardsSchema,
    defaultValue: { items: [] },
    editorComponent: "ContactCardsBlockEditor",
    rendererKey: "ContactCardsSection",
  },
  {
    key: "quote",
    label: "Zitat",
    category: "content",
    schemaVersion: 1,
    schema: quoteSchema,
    defaultValue: { text: "" },
    editorComponent: "QuoteBlockEditor",
    rendererKey: "QuoteSection",
  },
  {
    key: "cta",
    label: "Call-to-Action",
    category: "interaction",
    schemaVersion: 1,
    schema: ctaSchema,
    defaultValue: {},
    editorComponent: "CtaBlockEditor",
    rendererKey: "CtaSection",
  },
  {
    key: "applicant-cta",
    label: "Bewerber-CTA (Bild)",
    category: "interaction",
    schemaVersion: 1,
    schema: applicantCtaSchema,
    defaultValue: {},
    editorComponent: "ApplicantCtaBlockEditor",
    rendererKey: "ApplicantCta",
  },
  {
    key: "form-embed",
    label: "Formular",
    category: "interaction",
    schemaVersion: 1,
    schema: formEmbedSchema,
    defaultValue: { formKey: "contact" },
    editorComponent: "FormEmbedBlockEditor",
    rendererKey: "DynamicFormSection",
  },
  {
    key: "service-grid",
    label: "Leistungen",
    category: "collection",
    schemaVersion: 1,
    schema: serviceGridSchema,
    defaultValue: { selectionMode: "all", layout: "cards" },
    editorComponent: "CollectionBlockEditor",
    rendererKey: "ServiceGridSection",
  },
  {
    key: "industry-grid",
    label: "Branchen",
    category: "collection",
    schemaVersion: 1,
    schema: industryGridSchema,
    defaultValue: { selectionMode: "all", layout: "grid" },
    editorComponent: "CollectionBlockEditor",
    rendererKey: "IndustryGridSection",
  },
  {
    key: "testimonial-slider",
    label: "Stimmen",
    category: "collection",
    schemaVersion: 1,
    schema: testimonialSliderSchema,
    defaultValue: { selectionMode: "all" },
    editorComponent: "CollectionBlockEditor",
    rendererKey: "TestimonialSliderSection",
  },
  {
    key: "blog-grid",
    label: "Blogartikel",
    category: "collection",
    schemaVersion: 1,
    schema: blogGridSchema,
    defaultValue: { selectionMode: "latest", limit: 6 },
    editorComponent: "CollectionBlockEditor",
    rendererKey: "BlogGridSection",
  },
];

/** Blocktyp → Collection-Art, die er referenziert (fuer die Public-Aufloesung). */
export const COLLECTION_BLOCK_KINDS: Record<string, string> = {
  "service-grid": "service",
  "industry-grid": "industry",
  "testimonial-slider": "testimonial",
  "blog-grid": "blog",
};
