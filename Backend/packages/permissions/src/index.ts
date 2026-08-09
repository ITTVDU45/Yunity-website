/**
 * Zentrale Berechtigungsschluessel des CMS.
 * Single Source of Truth fuer API-Guards, Seed und Admin-UI.
 * Siehe cms/docs/permissions.md.
 */

export const PERMISSIONS = [
  "pages.read",
  "pages.create",
  "pages.update",
  "pages.publish",
  "pages.delete",

  "navigation.read",
  "navigation.manage",

  "media.read",
  "media.manage",
  "media.deletePermanent",

  "services.read",
  "services.manage",
  "services.publish",

  "industries.read",
  "industries.manage",
  "industries.publish",

  "testimonials.read",
  "testimonials.manage",
  "testimonials.publish",

  "blog.read",
  "blog.manage",
  "blog.publish",

  "competencies.read",
  "competencies.manage",

  "forms.read",
  "forms.manage",
  "forms.submissions.read",
  "forms.submissions.manage",
  "forms.submissions.export",

  "users.read",
  "users.manage",
  "roles.manage",

  "settings.read",
  "settings.manage",

  "sites.manage",

  "revisions.read",
  "revisions.restore",

  "audit.read",

  "content.review",
  "content.deletePermanent",
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

/** Platzhalter fuer "alle Berechtigungen" (nur Systemrolle Super Administrator). */
export const WILDCARD_PERMISSION = "*" as const;

export type GrantedPermission = PermissionKey | typeof WILDCARD_PERMISSION;

export function isKnownPermission(key: string): key is PermissionKey {
  return (PERMISSIONS as readonly string[]).includes(key);
}

/**
 * Prueft, ob eine Menge gewaehrter Berechtigungen einen benoetigten Schluessel abdeckt.
 * "*" deckt alles ab.
 */
export function hasPermission(
  granted: readonly string[],
  required: PermissionKey,
): boolean {
  return granted.includes(WILDCARD_PERMISSION) || granted.includes(required);
}

const READ_ALL: PermissionKey[] = [
  "pages.read",
  "navigation.read",
  "media.read",
  "services.read",
  "industries.read",
  "testimonials.read",
  "competencies.read",
  "blog.read",
  "forms.read",
  "settings.read",
];

const EDITOR_PERMISSIONS: PermissionKey[] = [
  ...READ_ALL,
  "pages.create",
  "pages.update",
  "media.manage",
  "services.manage",
  "industries.manage",
  "testimonials.manage",
  "blog.manage",
  "competencies.read",
  "competencies.manage",
  "revisions.read",
];

const REVIEWER_PERMISSIONS: PermissionKey[] = [
  ...READ_ALL,
  "content.review",
  "pages.publish",
  "services.publish",
  "industries.publish",
  "testimonials.publish",
  "blog.publish",
  "revisions.read",
];

const SITE_ADMIN_PERMISSIONS: PermissionKey[] = [
  ...EDITOR_PERMISSIONS,
  ...REVIEWER_PERMISSIONS.filter((key) => !EDITOR_PERMISSIONS.includes(key)),
  "pages.delete",
  "navigation.manage",
  "forms.manage",
  "forms.submissions.read",
  "forms.submissions.manage",
  "forms.submissions.export",
  "users.read",
  "users.manage",
  "settings.manage",
  "revisions.restore",
  "audit.read",
];

/**
 * Systemrollen-Presets. Werden beim Seed in die Rollen-Collection geschrieben.
 * Super Administrator erhaelt den Wildcard und ist site-uebergreifend.
 */
export const SYSTEM_ROLES: ReadonlyArray<{
  key: string;
  name: string;
  description: string;
  permissions: readonly GrantedPermission[];
  isGlobal: boolean;
}> = [
  {
    key: "super-admin",
    name: "Super Administrator",
    description: "Voller Zugriff auf alle Sites, Benutzer und Systemeinstellungen.",
    permissions: [WILDCARD_PERMISSION],
    isGlobal: true,
  },
  {
    key: "site-admin",
    name: "Site Administrator",
    description: "Vollstaendige Inhalts- und Benutzerverwaltung einer Site.",
    permissions: SITE_ADMIN_PERMISSIONS,
    isGlobal: false,
  },
  {
    key: "editor",
    name: "Editor",
    description: "Inhalte erstellen und bearbeiten, ohne Veroeffentlichung.",
    permissions: EDITOR_PERMISSIONS,
    isGlobal: false,
  },
  {
    key: "reviewer",
    name: "Reviewer",
    description: "Inhalte pruefen, freigeben und veroeffentlichen.",
    permissions: REVIEWER_PERMISSIONS,
    isGlobal: false,
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Ausschliesslich lesender Zugriff.",
    permissions: READ_ALL,
    isGlobal: false,
  },
];
