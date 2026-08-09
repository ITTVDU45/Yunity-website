# Block-Mapping — bestehende Komponenten → CMS-Blöcke

Registry lebt in `cms/packages/block-schemas`. Jeder Block: `key`, `label`, `category`, `schemaVersion: 1`, Zod-Schema, Defaults, `editorComponent` (Admin), `rendererKey` (Frontend). Frontend-Registry mappt `rendererKey` → bestehende React-Komponente; unbekannte Keys werden geloggt und übersprungen.

## 1. Vollständige Mapping-Tabelle

| Bestehende Komponente | Aktuelle Datei | Verwendung | Hartcodierte Inhalte | CMS-Block | Notwendige Datenfelder | Aufwand |
|---|---|---|---|---|---|---|
| `HeroSection` | `src/components/sections/hero-section.tsx` | Startseite | Eyebrow, Headline, Claim, CTAs, Frame-Sequence-Hintergrund | `hero` | eyebrow?, title, subtitle?, description?, primaryAction{label,href}, secondaryAction?, mediaId? (Phase 1: Hintergrund bleibt im Code), settings: variant, overlayStrength | mittel |
| `PageHero` | `sections/page-hero.tsx` | alle Unterseiten | title, intro | `page-hero` | title, intro?, showBreadcrumbs | gering |
| `AboutSection` | `sections/about-section.tsx` | Startseite, Über uns | Heading, Absätze, Bild, Link | `text-image` | heading, body (RichText), imageId, imageAlt (aus Media), action?, settings: imagePosition, background | gering |
| Freie Textabschnitte (Über uns, Karriere, Impressum, Datenschutz) | jeweilige `page.tsx` | Unterseiten | Absätze aus Dictionary | `rich-text` | body (sanitisiertes HTML/JSON), settings: width, background | gering |
| `SectionHeader` | `section-header.tsx` | überall | eyebrow, title, text | kein eigener Block — Teilschema `sectionHeader` in Collection-Blöcken | eyebrow?, title, description? | — |
| `TrustStats` | `sections/trust-stats.tsx` | Über uns | 4 Kennzahlen | `statistics` | items[{value,label}] (1–6), settings: columns | gering |
| `FaqSection` | `sections/faq-section.tsx` | Kontakt | 6 FAQs | `accordion` | title?, items[{question,answer}] | gering |
| `CTASection` | `sections/cta-section.tsx` | mehrfach | title, text, Button | `cta` | title, description?, action{label,href}, settings: variant | gering |
| `NewsletterSignup` | `sections/newsletter-signup.tsx` | global | E-Mail-Feld | `form-embed` (formKey=`newsletter`) | formKey, settings: compact | gering |
| `ContactForm` | `contact-form.tsx` | Kontakt | komplette Feldstruktur | `form-embed` (formKey=`contact`) | formKey | hoch (inkl. Submissions-Backend) |
| `Breadcrumbs` | `sections/breadcrumbs.tsx` | Detailseiten | — | automatisch (Template) | — | — |
| `Reveal`, `ButtonLink` | diverse | Utility | — | kein Block | — | — |

## 2. Collection-Blöcke

Gemeinsames Schema-Fragment für alle Collection-Blöcke:

```ts
const collectionQuery = z.object({
  selectionMode: z.enum(["all", "manual", "featured", "byLocation", "byPracticeArea", "byExpertise", "byCompetency", "latest", "ordered"]),
  selectedIds: z.array(z.string()).default([]),
  filterId: z.string().optional(),   // z. B. locationId bei byLocation
  limit: z.number().int().min(1).max(50).optional(),
});
```

| Bestehende Komponente | Datei | CMS-Block | Zusätzliche Felder | Renderer-Verhalten |
|---|---|---|---|---|
| `PracticeAreaCard`-Grid + `PracticeAreaMobileSlider` | `cards/cards.tsx`, `sections/practice-area-mobile-slider.tsx` | `practice-area-grid` | sectionHeader, collectionQuery, settings: layout (`grid\|slider`), showTeaser | API löst Einträge auf (title, teaser, slug, image) |
| Expertise-Karten | `app/expertise/page.tsx` (inline) | `expertise-grid` | sectionHeader, collectionQuery, showServices | dito |
| `TeamSection` / `LawyerDirectory` | `sections/team-section.tsx`, `lawyer-directory.tsx` | `team-grid` | sectionHeader, collectionQuery, groupByCategory Bool | Kategorien aus `TeamCategory` |
| Standort-Karten + `LocationMobileCarousel` | `sections/location-mobile-carousel.tsx`, `app/standorte/page.tsx` | `location-grid` | sectionHeader, collectionQuery, showContact Bool | Kontaktfelder isPublic werden mitgeliefert |
| `InsightsSection` | `sections/insights-section.tsx` | `insights-grid` (Modul `insights`, initial aus) | sectionHeader, collectionQuery, featuredFirst | Phase ≥ 8 |
| `SelectedCasesSection` | `sections/selected-cases-section.tsx` | `cases-slider` (Modul `cases`, initial aus) | sectionHeader, collectionQuery | Phase ≥ 8 |
| `IndustriesSection` | `sections/industries-section.tsx` | `industry-grid` (optional) | items inline ODER Collection (offene Entscheidung, s. architecture.md §15) | Phase ≥ 8 |

## 3. Weitere Standardblöcke (Core-Katalog, ohne bestehendes Pendant)

Für Wiederverwendbarkeit im CMS-Core registriert, Renderer entstehen bei Bedarf:
`heading-text` · `two-columns` · `image` · `gallery` · `video` · `quote` · `download` · `logo-grid` · `contact-section` · `divider` · `spacer`.

## 4. Detailseiten der Fachmodule

Detailseiten (`/taetigkeitsbereiche/[slug]`, `/standorte/[slug]`, `/team/[slug]`) rendern:
1. **Strukturierte Kopf-Daten** aus der Entität selbst (Hero, Kontaktblock, Listen) — kein Block nötig, Template-gesteuert.
2. **Optionale Zusatz-Sektionen** aus `ContentSection(ownerType=…)` mit demselben Block-Katalog.

Vorbelegte Sektionstypen je Modul:
- PracticeArea: `rich-text` (description), `focus-list` (Beratungsschwerpunkte — eigener kleiner Block: title?, items[]), `team-grid` (byPracticeArea), `related-practice-areas` (auto), `cta`.
- Location: `contact-info` (aus ContactFields, auto), `map` (mapQuery/coords), `team-grid` (byLocation), `form-embed`.
- TeamMember: strukturiert (bio, Kompetenzen, Sprachen, Kontakt) — Template; optional `cta`.

## 5. Versionierungsregeln

- Schemaänderung, die alte Daten ungültig macht → `schemaVersion++` + Migrationsfunktion im Block-Paket (`migrations: { 2: (v1data) => v2data }`).
- Nur additive optionale Felder → keine Versionserhöhung nötig (Zod-Defaults greifen).
- Renderer müssen fehlende optionale Felder tolerieren; Pflichtfeld-Verletzungen führen zu Skip + Log, nie zu Crash.

## 6. Beispiel-Blockdefinition (hero)

```ts
export const heroBlock: BlockDefinition = {
  key: "hero",
  label: "Hero",
  category: "Header",
  schemaVersion: 1,
  schema: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(1).max(200),
    subtitle: z.string().max(200).optional(),
    description: z.string().max(600).optional(),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    mediaId: z.string().optional(),
  }),
  defaultValue: { title: "" },
  editorComponent: "HeroBlockEditor",
  rendererKey: "HeroSection",
};
```
