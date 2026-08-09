import type { CollectionKind, CollectionRelations } from "@yunity/contracts";
import type { ItemSubField } from "@/components/page-editor/fields";

export type AttributeFieldType =
  | "text"
  | "number"
  | "textarea"
  | "list"
  | "objectList";

export interface AttributeField {
  key: string;
  label: string;
  type: AttributeFieldType;
  /** Inhalt wird je ausgewaehlter Sprache in translation.details gespeichert. */
  localized?: boolean;
  /** Nur fuer "objectList": die Felder eines Eintrags. */
  subFields?: ItemSubField[];
}

export interface RelationField {
  key: keyof CollectionRelations;
  label: string;
  /** Quelle der Auswahloptionen: eine Collection-Art oder Kompetenzen. */
  source: CollectionKind | "competency";
}

export interface CollectionModuleConfig {
  kind: CollectionKind;
  /** Menü-/Seitentitel. */
  label: string;
  singular: string;
  attributeFields: AttributeField[];
  relations: RelationField[];
  /** Kontaktfelder (im Yunity-Projekt ungenutzt — Kontaktdaten stehen in den Einstellungen). */
  contactOwnerType?: "LOCATION" | "TEAM_MEMBER";
}

/**
 * Hinweis zu den Icon-Feldern: Die gueltigen Schluessel entsprechen den Maps
 * `serviceIconMap` bzw. `industryIconMap` im Frontend. Ein unbekannter Wert
 * fuehrt dort zum Standard-Icon, nicht zum Fehler.
 */
const SERVICE_ICON_KEYS =
  "party, music, megaphone, construction, trophy, utensils, truck, briefcase";
const INDUSTRY_ICON_KEYS =
  "party, tent, building, megaphone, chart, pizza, users, truck, factory, clock";

export const COLLECTION_CONFIG: Record<CollectionKind, CollectionModuleConfig> = {
  service: {
    kind: "service",
    label: "Leistungen",
    singular: "Leistung",
    attributeFields: [
      { key: "iconKey", label: `Icon (${SERVICE_ICON_KEYS})`, type: "text" },
      {
        key: "anchorId",
        label: "Anker auf /leistungen (leer = Slug)",
        type: "text",
      },
      { key: "badge", label: "Badge (Kartenlabel)", type: "text", localized: true },
      {
        key: "benefitEmployer",
        label: "Vorteil für Unternehmen",
        type: "textarea",
        localized: true,
      },
      {
        key: "benefitWorker",
        label: "Vorteil für Bewerber:innen",
        type: "textarea",
        localized: true,
      },
      { key: "imageAlt", label: "Bildbeschreibung", type: "text", localized: true },
    ],
    relations: [
      { key: "industryIds", label: "Passende Branchen", source: "industry" },
    ],
  },
  industry: {
    kind: "industry",
    label: "Branchen",
    singular: "Branche",
    attributeFields: [
      { key: "iconKey", label: `Icon (${INDUSTRY_ICON_KEYS})`, type: "text" },
      {
        key: "support",
        label: "Wie wir unterstützen",
        type: "textarea",
        localized: true,
      },
      { key: "imageAlt", label: "Bildbeschreibung", type: "text", localized: true },
    ],
    relations: [
      { key: "serviceIds", label: "Passende Leistungen", source: "service" },
    ],
  },
  testimonial: {
    kind: "testimonial",
    label: "Stimmen",
    singular: "Stimme",
    attributeFields: [
      { key: "source", label: "Quelle / Kampagne (intern)", type: "text" },
      { key: "company", label: "Unternehmen", type: "text", localized: true },
      { key: "imageAlt", label: "Bildbeschreibung", type: "text", localized: true },
    ],
    relations: [
      { key: "serviceIds", label: "Bezug zu Leistungen", source: "service" },
      { key: "industryIds", label: "Bezug zu Branchen", source: "industry" },
    ],
  },
  blog: {
    kind: "blog",
    label: "Blogartikel",
    singular: "Blogartikel",
    attributeFields: [
      { key: "category", label: "Kategorie", type: "text", localized: true },
      { key: "author", label: "Autor:in", type: "text", localized: true },
      { key: "seoTopics", label: "SEO-Themen", type: "list", localized: true },
    ],
    relations: [
      { key: "serviceIds", label: "Verwandte Leistungen", source: "service" },
      { key: "industryIds", label: "Verwandte Branchen", source: "industry" },
      { key: "competencyIds", label: "Themen", source: "competency" },
    ],
  },
};

export function isCollectionKind(value: string): value is CollectionKind {
  return value in COLLECTION_CONFIG;
}
