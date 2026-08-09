/**
 * Geteilte API-Vertraege zwischen API, Admin-Dashboard und (spaeter) dem
 * oeffentlichen Frontend. Keine Laufzeit-Logik, nur Typen.
 */

export const CMS_LOCALES = ["de", "en", "tr"] as const;
export type CmsLocale = (typeof CMS_LOCALES)[number];

// ---------- Envelope ----------

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  code:
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "INTERNAL";
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
}

export type ApiResponse<T> =
  | { success: true; data: T; meta?: ApiMeta }
  | { success: false; error: ApiError };

// ---------- Auth ----------

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SiteSummary {
  id: string;
  key: string;
  name: string;
  defaultLocale: string;
  enabledLocales: string[];
  enabledModules: Record<string, boolean>;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Effektive Berechtigungen je Site-Id; "*" = alle. */
  permissionsBySite: Record<string, string[]>;
  /** Site-uebergreifende Berechtigungen (Super Administrator). */
  globalPermissions: string[];
  sites: SiteSummary[];
}

export interface SessionInfo {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  current: boolean;
}

// ---------- Dashboard ----------

export interface DashboardStats {
  pages: DashboardContentStats;
  services: DashboardContentStats;
  industries: DashboardContentStats;
  testimonials: DashboardContentStats;
  blogArticles: DashboardContentStats;
  forms: DashboardFormStats;
  newSubmissions: number;
}

export interface DashboardContentStats {
  total: number;
  published: number;
  pending: number;
}

export interface DashboardFormStats {
  total: number;
  active: number;
}

export type DashboardContentKind =
  | "PAGE"
  | "SERVICE"
  | "INDUSTRY"
  | "TESTIMONIAL"
  | "BLOG_ARTICLE";

export interface DashboardRecentContent {
  id: string;
  kind: DashboardContentKind;
  title: string;
  status: ContentStatus;
  href: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  userEmail: string | null;
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentContent: DashboardRecentContent[];
}

// ---------- Media ----------

export interface MediaTranslationValue {
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
}

export interface MediaFolderResponse {
  id: string;
  name: string;
  parentId: string | null;
  position: number;
}

export interface MediaAssetResponse {
  id: string;
  folderId: string | null;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  focalPointX: number;
  focalPointY: number;
  status: "PROCESSING" | "READY" | "ARCHIVED";
  translations: Record<string, MediaTranslationValue>;
  /** Zeitlich begrenzte Vorschau-URL (Presigned GET). */
  url: string;
  createdAt: string;
}

export interface PresignUploadResponse {
  assetId: string;
  uploadUrl: string;
  storageKey: string;
}

// ---------- Navigation ----------

export type NavigationItemType =
  | "PAGE"
  | "EXTERNAL"
  | "ANCHOR"
  | "GROUP"
  | "BUTTON"
  | "COLLECTION"
  | "PLACEHOLDER";

export interface NavigationItemResponse {
  id: string;
  parentId: string | null;
  type: NavigationItemType;
  label: string;
  translations: Record<string, string>;
  pageId: string | null;
  url: string | null;
  anchor: string | null;
  target: "SELF" | "BLANK";
  icon: string | null;
  cssClass: string | null;
  position: number;
  isVisible: boolean;
  children: NavigationItemResponse[];
}

export interface NavigationResponse {
  id: string;
  key: string;
  name: string;
  items: NavigationItemResponse[];
}

// ---------- Settings ----------

export type SettingsGroup =
  | "general"
  | "company"
  | "header"
  | "footer"
  | "seo"
  | "integrations";

export interface SettingsGroupResponse {
  group: SettingsGroup;
  values: Record<string, unknown>;
}

export interface PublicSiteResponse {
  key: string;
  name: string;
  defaultLocale: string;
  enabledLocales: string[];
  settings: Record<string, unknown>;
}

// ---------- Pages / Sections / Blocks ----------

export type ContentStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export type TranslationStatus =
  | "MISSING"
  | "DRAFT"
  | "COMPLETE"
  | "NEEDS_REVIEW";

export interface PageTranslationValue {
  title?: string;
  navigationTitle?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  translationStatus?: TranslationStatus;
}

export interface PageListItem {
  id: string;
  internalName: string;
  status: ContentStatus;
  templateKey: string;
  isHomepage: boolean;
  title: string;
  slug: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ContentSectionResponse {
  id: string;
  blockType: string;
  schemaVersion: number;
  internalLabel: string | null;
  position: number;
  data: Record<string, unknown>;
  settings: Record<string, unknown>;
  isEnabled: boolean;
}

export interface PageDetail {
  id: string;
  internalName: string;
  templateKey: string;
  status: ContentStatus;
  isHomepage: boolean;
  translations: Record<string, PageTranslationValue>;
  sections: ContentSectionResponse[];
  publishedAt: string | null;
  scheduledPublishAt: string | null;
  updatedAt: string;
}

export interface RevisionSummary {
  id: string;
  version: number;
  changeSummary: string | null;
  isPublishedSnapshot: boolean;
  createdAt: string;
}

export interface BlockMetaResponse {
  key: string;
  label: string;
  category: string;
  schemaVersion: number;
  editorComponent: string;
  defaultValue: unknown;
}

/** Eine im oeffentlichen Frontend gerenderte Sektion (locale-aufgeloest). */
export interface PublicSection {
  id: string;
  type: string;
  schemaVersion: number;
  data: Record<string, unknown>;
  settings: Record<string, unknown>;
}

export interface PublicPageResponse {
  id: string;
  slug: string;
  locale: string;
  isHomepage: boolean;
  seo: {
    title: string;
    description: string;
    noIndex: boolean;
    noFollow: boolean;
    canonicalUrl: string | null;
  };
  sections: PublicSection[];
}

// ---------- Collections (Fachmodule) ----------

export type CollectionKind =
  | "service"
  | "industry"
  | "testimonial"
  | "blog";

export interface CollectionRelations {
  serviceIds?: string[];
  industryIds?: string[];
  competencyIds?: string[];
}

export interface CollectionTranslationValue {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  body?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  details?: Record<string, unknown>;
  translationStatus?: TranslationStatus;
}

export interface CollectionListItem {
  id: string;
  kind: CollectionKind;
  status: ContentStatus;
  title: string;
  slug: string;
  featured: boolean;
  position: number;
  imageUrl: string | null;
  updatedAt: string;
}

export interface CollectionDetail {
  id: string;
  kind: CollectionKind;
  status: ContentStatus;
  featured: boolean;
  icon: string | null;
  imageId: string | null;
  imageUrl: string | null;
  translations: Record<string, CollectionTranslationValue>;
  attributes: Record<string, unknown>;
  relations: CollectionRelations;
  sections: ContentSectionResponse[];
  publishedAt: string | null;
  updatedAt: string;
}

/** Kompakte Karte fuer Grid-Bloecke und Uebersichten. */
export interface CollectionCard {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  icon: string | null;
  imageUrl: string | null;
  attributes: Record<string, unknown>;
}

export interface ContactFieldResponse {
  id: string;
  fieldType: string;
  label: string;
  translations: Record<string, { label?: string }>;
  value: string;
  link: string | null;
  icon: string | null;
  position: number;
  isPublic: boolean;
}

// ---------- Formulare ----------

export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "time"
  | "select"
  | "radio"
  | "checkbox"
  | "checkbox-group"
  | "multiselect"
  | "file"
  | "consent"
  | "hidden"
  | "heading"
  | "paragraph"
  | "divider";

export type FormStatus = "ACTIVE" | "DISABLED" | "ARCHIVED";

export type SubmissionStatus =
  | "NEW"
  | "READ"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SPAM"
  | "ARCHIVED";

export interface FormFieldOptionDef {
  id: string;
  value: string;
  position: number;
  isEnabled: boolean;
  translations: Record<string, { label?: string }>;
}

export interface FormFieldDef {
  id: string;
  type: FormFieldType;
  name: string;
  required: boolean;
  width: "FULL" | "HALF" | "THIRD";
  position: number;
  isEnabled: boolean;
  validation: Record<string, unknown>;
  conditions: Record<string, unknown> | null;
  settings: Record<string, unknown>;
  translations: Record<
    string,
    { label?: string; placeholder?: string; helpText?: string }
  >;
  options: FormFieldOptionDef[];
}

export interface FormListItem {
  id: string;
  key: string;
  name: string;
  status: FormStatus;
  fieldCount: number;
  submissionCount: number;
  updatedAt: string;
}

export interface FormDetail {
  id: string;
  key: string;
  name: string;
  status: FormStatus;
  successAction: "MESSAGE" | "REDIRECT";
  redirectUrl: string | null;
  notificationSettings: Record<string, unknown>;
  spamSettings: Record<string, unknown>;
  retentionDays: number | null;
  translations: Record<
    string,
    {
      title?: string;
      successMessage?: string;
      privacyText?: string;
      consentText?: string;
    }
  >;
  fields: FormFieldDef[];
  updatedAt: string;
}

/** Oeffentliche Formulardefinition fuer das Frontend (locale-aufgeloest). */
export interface PublicFormField {
  id: string;
  type: FormFieldType;
  name: string;
  required: boolean;
  width: "FULL" | "HALF" | "THIRD";
  label: string;
  placeholder: string;
  helpText: string;
  validation: Record<string, unknown>;
  conditions: Record<string, unknown> | null;
  options: { value: string; label: string }[];
}

export interface PublicFormDefinition {
  key: string;
  locale: string;
  title: string;
  successMessage: string;
  consentText: string;
  privacyText: string;
  successAction: "MESSAGE" | "REDIRECT";
  redirectUrl: string | null;
  fields: PublicFormField[];
}

export interface SubmissionListItem {
  id: string;
  status: SubmissionStatus;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface SubmissionDetail {
  id: string;
  formId: string;
  status: SubmissionStatus;
  notes: string | null;
  data: Record<string, unknown>;
  locale: string;
  pageUrl: string | null;
  createdAt: string;
}

/** Detailausgabe eines Fachmodul-Eintrags im oeffentlichen Frontend. */
export interface PublicCollectionDetail {
  id: string;
  kind: CollectionKind;
  slug: string;
  locale: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  icon: string | null;
  imageUrl: string | null;
  attributes: Record<string, unknown>;
  seo: { title: string; description: string };
  contactFields: ContactFieldResponse[];
  sections: PublicSection[];
}

export interface TaxonomyResponse {
  id: string;
  position: number;
  translations: Record<string, { title?: string; description?: string; slug?: string }>;
}
