// Öffentliche CMS-Antworttypen (Spiegel von Backend/packages/contracts).
// Bewusst dupliziert, damit das Frontend unabhängig vom Backend-Workspace baut.

export interface CmsMedia {
  url: string
  width: number | null
  height: number | null
  alt: string
}

export interface PublicSection {
  id: string
  type: string
  schemaVersion: number
  data: Record<string, unknown>
  settings: Record<string, unknown>
}

export interface PublicPageResponse {
  id: string
  slug: string
  locale: string
  isHomepage: boolean
  seo: {
    title: string
    description: string
    noIndex: boolean
    noFollow: boolean
    canonicalUrl: string | null
  }
  sections: PublicSection[]
}

export interface PublicSiteResponse {
  key: string
  name: string
  defaultLocale: string
  enabledLocales: string[]
  settings: Record<string, unknown>
}

export interface NavigationItem {
  id: string
  label: string
  type: string
  url: string | null
  pageId: string | null
  anchor: string | null
  target: "SELF" | "BLANK"
  children: NavigationItem[]
}

export interface NavigationResponse {
  key: string
  name: string
  items: NavigationItem[]
}

/** Kompakter Karteninhalt, den Collection-Blöcke serverseitig aufgelöst liefern. */
export interface CollectionCard {
  id: string
  slug: string
  title: string
  subtitle?: string
  excerpt?: string
  icon: string | null
  imageUrl: string | null
  attributes: Record<string, unknown>
}

export interface PublicCollectionDetail {
  id: string
  kind: string
  slug: string
  locale: string
  title: string
  subtitle: string
  excerpt: string
  body: string
  icon: string | null
  imageUrl: string | null
  attributes: Record<string, unknown>
  seo: { title: string; description: string }
  sections: PublicSection[]
}

export interface PublicFormFieldOption {
  value: string
  label: string
}

export interface PublicFormField {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
  helpText: string
  required: boolean
  width: "FULL" | "HALF" | "THIRD"
  defaultValue: string | null
  validation: Record<string, unknown>
  conditions: Record<string, unknown> | null
  options: PublicFormFieldOption[]
}

export interface PublicFormDefinition {
  key: string
  title: string
  successMessage: string
  privacyText: string
  consentText: string
  fields: PublicFormField[]
}
