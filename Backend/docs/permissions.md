# Rollen & Berechtigungen

## 1. Prinzipien

- Berechtigungsschlüssel zentral in `cms/packages/permissions` (Single Source für API-Guards, Seed und Admin-UI).
- Prüfung **immer serverseitig** (`@RequirePermission(...)`-Guard nach Auth- und Site-Guard). UI-Ausblendung ist nur Komfort.
- Rollenzuweisung ist **site-gebunden** (`UserRole.siteId`) — derselbe User kann je Site unterschiedliche Rollen haben.
- Systemrollen (`isSystem: true`) sind nicht löschbar; eigene Rollen je Site frei definierbar.

## 2. Berechtigungsschlüssel

```text
pages.read | pages.create | pages.update | pages.publish | pages.delete
navigation.read | navigation.manage
media.read | media.manage
team.read | team.manage | team.publish
locations.read | locations.manage | locations.publish
practiceAreas.read | practiceAreas.manage | practiceAreas.publish
expertise.read | expertise.manage | expertise.publish
blog.read | blog.manage | blog.publish
competencies.manage
forms.read | forms.manage
forms.submissions.read | forms.submissions.manage | forms.submissions.export
users.read | users.manage
roles.manage
settings.read | settings.manage
sites.manage                    (nur Super Admin)
revisions.read | revisions.restore
audit.read
content.review                  (freigeben / zurückweisen)
media.deletePermanent | content.deletePermanent
```

`*.manage` umfasst create/update/duplicate/archive/reorder des Moduls; `*.publish` ist separat, damit Editoren ohne Veröffentlichungsrecht arbeiten können.

## 3. Rollen-Matrix (Systemrollen)

| Permission-Gruppe | Super Admin | Site Admin | Editor | Reviewer | Viewer |
|---|---|---|---|---|---|
| sites.manage, roles.manage | ✓ | — | — | — | — |
| users.* | ✓ | ✓ (nur eigene Site) | — | — | — |
| settings.* | ✓ | ✓ | read | read | read |
| pages.read/create/update | ✓ | ✓ | ✓ | read | read |
| pages.publish / *.publish | ✓ | ✓ | — | ✓ | — |
| pages.delete | ✓ | ✓ | — | — | — |
| content.review | ✓ | ✓ | — | ✓ | — |
| navigation.manage | ✓ | ✓ | — | — | — |
| media.read/manage | ✓ | ✓ | ✓ | read | read |
| Fachmodule read/manage | ✓ | ✓ | ✓ | read | read |
| forms.manage | ✓ | ✓ | — | — | — |
| forms.submissions.read/manage | ✓ | ✓ | — | — | — |
| forms.submissions.export | ✓ | ✓ | — | — | — |
| revisions.read | ✓ | ✓ | ✓ | ✓ | — |
| revisions.restore | ✓ | ✓ | — | — | — |
| audit.read | ✓ | ✓ | — | — | — |
| *.deletePermanent | ✓ | — | — | — | — |

Super Admin ist zusätzlich **site-übergreifend** (Zugriff auf alle Sites, Site-Anlage, Modul-Toggles).

## 4. Workflow-Rechte

```text
DRAFT        Editor erstellt/bearbeitet (pages.update)
IN_REVIEW    Editor sendet zur Prüfung (pages.update)
APPROVED     Reviewer/Admin gibt frei (content.review)
PUBLISHED    Reviewer/Admin veröffentlicht (pages.publish)
zurückweisen IN_REVIEW → DRAFT (content.review, mit Kommentar)
```

Statusübergänge werden serverseitig als Zustandsmaschine validiert (kein direkter DRAFT→PUBLISHED für Rollen ohne publish-Recht).

## 5. Admin-UI-Verhalten

- Menüpunkte erscheinen nur bei `*.read` des Moduls **und** aktiviertem Modul (`Site.enabledModules`).
- Aktions-Buttons (Veröffentlichen, Löschen, Export) nur bei entsprechender Permission.
- `GET /api/v1/auth/me` liefert effektive Permission-Liste je Site für das UI-Gating.

## 6. Audit-Pflicht

Alle Aktionen mit `manage/publish/delete/export/restore`-Charakter erzeugen AuditLog-Einträge (Aktion, Entität, before/after redigiert). `forgot-password`, Login-Erfolg/-Fehlschlag ebenfalls.
