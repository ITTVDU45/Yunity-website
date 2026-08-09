# API-Design — NestJS, REST, `/api/v1`

## 1. Grundsätze

- Versionierung im Pfad: `/api/v1/...`; Breaking Changes → `/api/v2`.
- **Drei Bereiche**: `auth` (Sessions), `admin` (geschützt, Permission-geprüft), `public` (read-only, nur veröffentlichte Inhalte).
- Site-Auflösung: Public über anfragende Domain (Mapping `Site.primaryDomain`), Fallback-Header `X-Site-Key`; Admin über Session-Site-Kontext (`X-Site-Id` nur aus der Liste der dem User zugewiesenen Sites).
- Locale: `?locale=de` (Default = `Site.defaultLocale`), Fallback-Kette locale → defaultLocale mit `translationStatus`-Kennzeichnung.
- OpenAPI/Swagger unter `/api/docs` (nur non-prod bzw. hinter Auth).

## 2. Einheitliches Antwortformat

```jsonc
// Erfolg
{ "success": true, "data": { ... }, "meta": { "total": 42, "page": 1, "limit": 20 } }
// Fehler
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [ { "field": "title", "message": "…" } ] } }
```

Fehlercodes: `VALIDATION_ERROR` 422 · `UNAUTHORIZED` 401 · `FORBIDDEN` 403 · `NOT_FOUND` 404 · `CONFLICT` 409 · `RATE_LIMITED` 429 · `INTERNAL` 500 (ohne Details in prod).

## 3. Auth

```text
POST /api/v1/auth/login              { email, password, rememberMe }
POST /api/v1/auth/logout
POST /api/v1/auth/refresh            (Session-Verlängerung/Rotation)
POST /api/v1/auth/forgot-password    { email }   → immer 200 (neutral)
POST /api/v1/auth/reset-password     { token, password }
GET  /api/v1/auth/me                 → User + Sites + effektive Permissions
GET  /api/v1/auth/sessions           / DELETE /api/v1/auth/sessions/:id
```

Rate Limits: login 5/15 min (IP+Account) · forgot-password 3/h.

## 4. Public API (read-only, nur PUBLISHED, cachebar)

```text
GET /api/v1/public/site                          → Name, Locales, öffentliche Settings (nie isSensitive)
GET /api/v1/public/navigation/:key               → Baumstruktur, aufgelöste Page-URLs je Locale
GET /api/v1/public/pages/home
GET /api/v1/public/pages/by-slug/:slug           → Seite + sections[] in Reihenfolge, Collection-Blöcke AUFGELÖST
GET /api/v1/public/practice-areas                → Liste (title, teaser, slug, image)
GET /api/v1/public/practice-areas/:slug          → Detail + sections
GET /api/v1/public/expertise            [/:slug]
GET /api/v1/public/team                 [/:slug] → inkl. isPublic-Kontaktfelder, Relationen
GET /api/v1/public/locations            [/:slug]
GET /api/v1/public/forms/:key                    → Felddefinitionen + Validierung + Conditions (locale-aufgelöst)
POST /api/v1/public/forms/:key/submissions       → validierte Übermittlung (Rate Limit 5/10 min, Honeypot)
```

Antwortobjekte: Medien immer strukturiert `{ url, width, height, alt, variants }`; Sections `{ id, type, schemaVersion, data, settings }`; unbekannte/deaktivierte Blöcke werden serverseitig nicht ausgeliefert.

Preview: `GET .../pages/by-slug/:slug?previewToken=…` → Draft-Snapshot, `Cache-Control: no-store`. Token: kurzlebig (10 min), HMAC-signiert, entitätsgebunden.

## 5. Admin API — Muster für alle Module

Standard-CRUD (Beispiel Pages; identisches Muster für practice-areas, expertise, locations, team, competencies, forms, media, navigations, users, roles, settings):

```text
GET    /api/v1/admin/pages?search=&status=&locale=&page=&limit=&sort=
POST   /api/v1/admin/pages
GET    /api/v1/admin/pages/:id
PATCH  /api/v1/admin/pages/:id
DELETE /api/v1/admin/pages/:id            (Soft Delete; ?permanent=true mit Extra-Permission)
POST   /api/v1/admin/pages/:id/duplicate
POST   /api/v1/admin/pages/:id/archive
POST   /api/v1/admin/pages/:id/publish            { scheduledAt? }
POST   /api/v1/admin/pages/:id/unpublish
POST   /api/v1/admin/pages/:id/submit-review      / approve / reject
GET    /api/v1/admin/pages/:id/revisions          / :revId  / POST :revId/restore
```

Sektionen (gilt für alle Section-Owner):
```text
POST   /api/v1/admin/pages/:id/sections           { blockType, position?, data? }
PATCH  /api/v1/admin/pages/:id/sections/:sectionId
DELETE /api/v1/admin/pages/:id/sections/:sectionId
POST   /api/v1/admin/pages/:id/sections/:sectionId/duplicate
POST   /api/v1/admin/pages/:id/reorder-sections   { orderedIds: [...] }   (transaktional)
```

Modulspezifisch:
```text
Navigation:  POST .../navigations/:id/items · PATCH/DELETE items/:itemId · POST :id/reorder (Baum, transaktional)
Media:       POST /media/presign { filename, mimeType, size } → { uploadUrl, assetId }
             POST /media/:id/complete · GET /media/:id/usage · POST /media/:id/replace
Forms:       POST /forms/:id/fields · fields/:fieldId/options · reorder · 
             GET /forms/:id/submissions?status= · PATCH submissions/:sid { status, notes }
             POST /forms/:id/submissions/export (CSV, audit-geloggt)
Sortierung:  POST /{modul}/reorder { orderedIds } für alle positionierbaren Collections
Relationen:  PATCH am Hauptobjekt mit expliziten Arrays (practiceAreaIds, locationIds, …)
Users/Roles: CRUD + POST /users/:id/roles { roleId, siteId } · Invite-Flow
Settings:    GET/PUT /settings/:group (Zod-Schema je Gruppe)
Audit:       GET /api/v1/admin/audit-logs?entityType=&userId=&from=&to=
Dashboard:   GET /api/v1/admin/dashboard → Zählerkarten, letzte Aktivitäten, offene Reviews, neue Submissions
Block-Types: GET /api/v1/admin/block-types → Registry-Metadaten für den Editor
Übersetzung: GET /api/v1/admin/translation-status?entityType= → MISSING/NEEDS_REVIEW-Matrix
```

## 6. Revalidierung Richtung Frontend

```text
POST https://www.domain.de/api/revalidate
Headers: X-Signature: HMAC-SHA256(body, REVALIDATION_SECRET), X-Timestamp
Body: { "site": "yunity", "tags": ["page:/expertise", "expertise:list"] }
```
Wird bei publish/unpublish/reorder/settings-Änderung mit den betroffenen Tags gefeuert (Retry mit Backoff, Fehler nur geloggt — Publishing schlägt dadurch nicht fehl).

## 7. Health

```text
GET /api/health/live    → 200 wenn Prozess läuft
GET /api/health/ready   → prüft DB, Redis (falls konfiguriert), Storage-HEAD, Pflicht-ENV
```

## 8. Sicherheitsregeln (API-Ebene)

- Globale `ValidationPipe` (whitelist + forbidNonWhitelisted) — Mass-Assignment-Schutz.
- `siteId` nie aus Body; immer aus Kontext-Guard.
- CORS: Public nur www-Domain(s) der Site; Admin nur Admin-Origin; Credentials nur Admin.
- CSRF-Token-Pflicht für alle mutierenden Admin-Routen.
- Rich-Text: serverseitiges Sanitizing (Allowlist) vor Persistenz **und** bei Auslieferung defensiv.
- Datei-Downloads aus Submissions nur über signierte, berechtigungsgeprüfte URLs (privater Bucket).
