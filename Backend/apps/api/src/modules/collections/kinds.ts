import { z } from "zod";
import type { PermissionKey } from "@yunity/permissions";
import type { SectionOwnerType } from "../pages/schemas/content-section.schema";
import type { CollectionKind } from "./collection-item.schema";

/**
 * Kind-spezifische, nicht-uebersetzbare Attribute (serverseitig validiert).
 *
 * Uebersetzbare Texte liegen dagegen in `translations[locale]` bzw. deren
 * `details`-Objekt — hier stehen nur sprachneutrale Strukturdaten.
 */

/**
 * Icon-Schluessel werden im Frontend gegen eine geschlossene Map aufgeloest
 * (`serviceIconMap` / `industryIconMap`). Hier bleibt es bewusst ein freier,
 * laengenbegrenzter String: der Renderer faellt bei unbekannten Schluesseln auf
 * ein Standard-Icon zurueck, statt dass ein Tippfehler im Backend die Seite
 * zerlegt. Die Auswahl im Admin bietet die gueltigen Werte als Liste an.
 */
const iconKey = z.string().max(40).optional();

const serviceAttributes = z
  .object({
    iconKey,
    /**
     * Anker der Detailsektion auf /leistungen (z. B. "eventpersonal").
     * Ohne Wert nutzt das Frontend den Slug.
     */
    anchorId: z.string().max(60).optional(),
  })
  .strict();

const industryAttributes = z
  .object({
    iconKey,
  })
  .strict();

const testimonialAttributes = z
  .object({
    /** Optionale Sortierhilfe fuer wiederkehrende Kampagnen. */
    source: z.string().max(80).optional(),
  })
  .strict();

const blogAttributes = z.object({}).strict();

export interface KindConfig {
  kind: CollectionKind;
  /** Revisions-/Sektions-Owner-Typ. */
  entityType: string;
  ownerType: SectionOwnerType;
  /** Schluessel in Site.enabledModules. */
  moduleKey: string;
  /** Berechtigungspraefix (…​.read/.manage/.publish). */
  permissionPrefix: string;
  attributesSchema: z.ZodTypeAny;
}

export const KIND_CONFIG: Record<CollectionKind, KindConfig> = {
  service: {
    kind: "service",
    entityType: "SERVICE",
    ownerType: "SERVICE",
    moduleKey: "services",
    permissionPrefix: "services",
    attributesSchema: serviceAttributes,
  },
  industry: {
    kind: "industry",
    entityType: "INDUSTRY",
    ownerType: "INDUSTRY",
    moduleKey: "industries",
    permissionPrefix: "industries",
    attributesSchema: industryAttributes,
  },
  testimonial: {
    kind: "testimonial",
    entityType: "TESTIMONIAL",
    ownerType: "TESTIMONIAL",
    moduleKey: "testimonials",
    permissionPrefix: "testimonials",
    attributesSchema: testimonialAttributes,
  },
  blog: {
    kind: "blog",
    entityType: "BLOG_ARTICLE",
    ownerType: "BLOG_ARTICLE",
    moduleKey: "blog",
    permissionPrefix: "blog",
    attributesSchema: blogAttributes,
  },
};

export function isCollectionKind(value: string): value is CollectionKind {
  return value in KIND_CONFIG;
}

export function permissionFor(
  kind: CollectionKind,
  action: "read" | "manage" | "publish",
): PermissionKey {
  return `${KIND_CONFIG[kind].permissionPrefix}.${action}` as PermissionKey;
}
