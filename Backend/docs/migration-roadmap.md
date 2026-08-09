# Migrations-Roadmap

Grundregel: kein Big-Bang. Jede Phase endet buildbar, getestet, dokumentiert (Definition of Done s. u.). Das öffentliche Frontend bleibt bis Phase 7 visuell und funktional unangetastet.

## Phase 1 — Analyse & Architektur ✅ (dieses Paket)
Frontend-Audit, Architektur, Datenmodell, Block-Mapping, API-Design, Permissions, Admin-Design, Deployment-Konzept in `cms/docs/`.

## Phase 2 — Workspace & Fundament (Arbeitspakete 2–5)
1. `cms/` npm-Workspace: `apps/api` (NestJS), `apps/admin` (Next.js), `packages/{contracts,block-schemas,permissions,ui,config,utilities}`; Strict-TS, ESLint, Compose mit Postgres + MinIO.
2. Prisma-Schema (Core: Site, User, Role, Permission, UserRole, RolePermission, Session, AuditLog) + erste Migration + Seed (Site `yunity`, Systemrollen, Permission-Keys, Super-Admin aus ENV).
3. Auth: Login/Logout/Refresh/Reset, Argon2id, Session-Cookies, CSRF, Rate Limits, Guards (`Auth → Site → Permission`), Audit-Events.
4. Admin-Grundlayout im Götz-Design (Login, Sidebar-Shell, Dashboard-Skelett, geschützte Routen, `auth/me`-Gating).
   **Exit-Kriterium:** Login funktioniert e2e, Health-Checks grün, CI (lint+build+test) läuft.

## Phase 3 — Medien, Navigation, Einstellungen (AP 6–7) ✅ (2026-07-13)
1. **Medienbibliothek** ✅: Presigned PUT-Upload direkt zu MinIO (Browser-CORS verifiziert), serverseitige Validierung (MIME-Allowlist, Größe, Endung, **Magic-Byte-Prüfung** beim Complete), zufällige Storage-Keys, übersetzbare Alt-Texte/Titel, Presigned-GET-Vorschau, Archivieren/Löschen, Admin-Grid + Detail-Dialog. Offen (später): Ordner-UI, Varianten-Job (WebP/AVIF), Verwendungsnachweis (ab Phase 4, sobald Sections referenzieren), Bildabmessungen.
2. **Navigationen** ✅: CRUD, verschachtelte Items, Positionssystem (1000er) mit transaktionsfreiem `bulkWrite`-Reorder, rekursives Löschen, Sichtbarkeit, öffentlicher Endpoint `navigation/:key` (nur sichtbare Items, locale-aware). Admin: verschachtelte Liste mit Hoch/Runter-Reorder + Add/Edit/Delete. Offen (Polish): dnd-kit-Drag statt Pfeiltasten.
3. **Settings** ✅: Gruppen general/company/header/footer/seo/integrations (Upsert je Key, Sensibel-Flag), öffentlicher `site`-Endpoint (nur nicht-sensible Werte), Admin mit Gruppen-Tabs.
4. **Site-Kontext** ✅: `X-Site-Id`-Header + `@ActiveSiteId()`-Decorator (siteId nie aus dem Body); Admin-Frontend hält aktive Site im `cms_site`-Cookie.

## Phase 4 — Seiten, Blöcke, Publishing (AP 8)
1. Block-Registry (`block-schemas`) mit Kern-Blöcken aus [block-mapping.md](block-mapping.md) v1.
2. Page + PageTranslation + ContentSection CRUD; Slug-Logik je Locale.
3. Seiteneditor (3-Spalten, dnd, Blockformulare aus Zod-Schemas, interne Labels).
4. Revisionen (Snapshot je Save), Workflow-Zustandsmaschine, Publish/Unpublish/Schedule, Preview-Token.
5. Public `pages/home` + `pages/by-slug` (nur Published-Snapshot).

## Phase 5 — Fachmodule (AP 9)
Reihenfolge: Tätigkeitsbereiche → Expertisen → Standorte → Team (+ TeamCategory, Kompetenzen) → ContactFields (polymorph). Je Modul: Prisma-Modelle + Migration, CRUD-API, Admin-Listen/Detailformulare (DataTable im Götz-Stil), Relationen, Detail-Sektionen, Collection-Blöcke (`practice-area-grid`, `expertise-grid`, `team-grid`, `location-grid`) mit serverseitiger Auflösung, Public-Endpoints.

## Phase 6 — Formular-Builder (AP 10)
Form/FormField/Option-Modelle, Builder-UI (Feldtypen, Validierung, Optionen, Conditions, dnd), Public `forms/:key` + Submission-Endpoint (Zod-Laufzeitvalidierung aus Felddefinitionen, Honeypot, Rate Limit, ipHash), Submissions-Inbox (Status, Notizen, CSV-Export mit Audit), E-Mail-Benachrichtigung + Auto-Reply, Retention-Job. Seed: `contact`- und `newsletter`-Formular gemäß bestehendem `ContactForm`.

## Phase 7 — Frontend-Anbindung: Startseite als Referenz (AP 11)
1. `src/lib/cms/`-Client im Frontend (client.ts + Ressourcen-Module + Typen aus `contracts`); ENV `CMS_API_URL`, `SITE_KEY`.
2. Section-Renderer + Registry (bestehende Komponenten erhalten Props; unbekannte Blöcke → Skip + Log).
3. Importskript `cms/scripts/import-existing-content.ts` (idempotent, upsert per `siteId`+slug/key): Medien → Collections (13 PracticeAreas, 16 Expertisen, 3 Locations, 2 TeamMember, Kategorien, Kompetenzen) → Navigation → Startseiten-Sektionen → Settings → Formulare.
4. Startseite liest CMS-API (mit statischem Fallback hinter Feature-Flag `CMS_ENABLED`), Draft-Preview via Next Draft Mode, `POST /api/revalidate` mit Tag-Invalidierung.
   **Exit-Kriterium:** Startseite pixel-identisch aus CMS-Daten; Lighthouse/CWV unverändert.

## Phase 8 — Restliche Seiten schrittweise
Reihenfolge: Navigation/Footer global → Tätigkeitsbereiche (Übersicht + Details) → Expertise → Standorte → Team → Kontakt (dynamisches Formular live) → Über uns/Karriere → Impressum/Datenschutz → optional Insights/Cases-Module aktivieren. Hardcodes (`data.ts`, `practice-areas.ts`, `locations.ts`, Content-Teile von `i18n-content.ts`) werden **erst nach** verifizierter Migration der jeweiligen Seite entfernt; UI-Labels bleiben im Frontend-Dictionary.

## Phase 9 — Produktion (AP 12)
Subdomain `cms.yunity.law`, Docker-Produktions-Compose + Reverse Proxy + TLS, Migrations-Deployment-Ablauf, Backups (täglich, verschlüsselt, Restore-Test), Monitoring/Alerts auf Health-Endpoints, Sicherheitsprüfung (Checkliste aus api-design.md §8 + Pen-Test der Auth), Dokumentation/Handbuch, EN/TR-Übersetzungspflege über Translation-Status-Board.

## Definition of Done (je Modul)
Datenmodell + Migration ✓ · API mit DTO-Validierung + Permissions ✓ · Admin-UI ✓ · Audit-Log ✓ · Fehlerzustände ✓ · Unit-/Integrationstests ✓ · OpenAPI ✓ · i18n berücksichtigt ✓ · siteId-Trennung getestet ✓ · Docs aktualisiert ✓ · Build + Lint + Tests grün ✓.

## Teststrategie (Kurzfassung)
- **Unit:** Services, Permission-Auswertung, Blockvalidierung/-migration, Slugify, Positionslogik, Form-Conditions, Workflow-Zustandsmaschine.
- **Integration (Testcontainers-Postgres):** Auth/Sessions, CRUD je Modul, Publishing-Snapshots, Upload-Flow, Submission-Validierung, siteId-Isolation.
- **E2E (Playwright):** Login→Seite anlegen→Hero→publish→Public-API liefert · Expertise anlegen→Grid zeigt sie→Detailseite erreichbar · Formular bauen→Besucher sendet→Inbox zeigt Eintrag. Security-Tests: Zugriff ohne Login, falsche Rolle, fremde siteId, Mass Assignment, ungültige Blockdaten, XSS in Rich Text.

## Wichtigste Risiken
1. **Kontaktformular hat heute kein Backend** — E-Mail-Zustellung (SMTP-Provider, SPF/DKIM) früh klären, sonst blockiert Phase 6.
2. **i18n-Vermischung** (UI-Labels vs. Content in `i18n-content.ts`) — Import-Mapping sorgfältig, sonst doppelte Pflege.
3. **Pixel-Treue der Startseite** — Abweichungen im Block-Schema fallen erst beim Rendern auf → visuelle Regressionstests (Screenshots 320/768/1440) ab Phase 7.
4. **Scope-Falle Formular-Builder** (Conditions, Datei-Uploads) — Feldtypen für v1 auf die real benötigten begrenzen, Rest im Modell vorsehen.
5. **Zwei Deploy-Einheiten mehr** (API + Admin) — Ops-Aufwand; Compose + Health-Checks von Anfang an.
6. Next.js 16/React 19 sind sehr aktuell — Bibliotheks-Kompatibilität (dnd-kit, TipTap) im Admin früh verifizieren.
