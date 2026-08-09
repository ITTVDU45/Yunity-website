# Architektur — Headless-CMS (wiederverwendbar, mandantenfähig)

## 1. Gesamtbild

```text
www.yunity.law                cms.yunity.law
┌────────────────────┐             ┌──────────────────────────────┐
│ Bestehendes         │  REST      │ /            Admin (Next.js) │
│ Next.js-Frontend    │◄───────────│ /api/v1/public   Read-only   │
│ (unverändertes UI)  │            │ /api/v1/admin    geschützt   │
└─────────┬───────────┘            │ /api/v1/auth     Sessions    │
          │ POST /api/revalidate   └──────────┬───────────────────┘
          ◄────────────────────────────────────┤ NestJS-API
                                    ┌──────────┴───────────┐
                                    │ PostgreSQL  │ Redis*  │
                                    │ S3-Storage (Medien)   │
                                    └───────────────────────┘
```
\* Redis optional (Rate Limits, Cache, Jobs) — Phase 1 ohne Redis lauffähig (In-Memory-Fallback).

## 2. Stack-Entscheidung und Begründung

Das bestehende Frontend ist Next.js 16 / React 19 / Tailwind 4 / npm. Der empfohlene Stack aus `Docs/backenddashbaord.md` wird übernommen, mit zwei bewussten Anpassungen:

| Entscheidung | Begründung |
|---|---|
| **NestJS-API als eigene App** (`cms/apps/api`) | Klare Modultrennung, Guards, DTO-Validierung, OpenAPI out of the box. Kein Vermischen mit dem öffentlichen Frontend. |
| **Admin als Next.js App Router App** (`cms/apps/admin`) | Gleiche React/Tailwind-Version wie Frontend → `packages/ui` teilbar; Team kennt den Stack. |
| **npm workspaces statt pnpm** | Das bestehende Projekt nutzt npm. Ein zweiter Package Manager im selben Repo erzeugt Reibung. `pnpm-workspace.yaml` entfällt; `cms/package.json` mit `workspaces`. (Abweichung von der Vorgabe, dokumentiert.) |
| **MongoDB + Mongoose statt PostgreSQL/Prisma** | **Explizite Nutzer-Vorgabe (Phase 2):** gleiche Infrastruktur wie das Götz-Backend (MongoDB, MinIO). Relationale Join-Tabellen werden zu eingebetteten Arrays/Referenzen (s. data-model.md §0). Versionierte Schema-/Seed-Änderungen über `migrate-mongo`-Skripte statt Prisma-Migrationen. Mehrschritt-Änderungen (z. B. Reorder) laufen ab Phase 4 über MongoDB-Transaktionen (Replica-Set) oder atomare Einzel-Updates. |
| **MinIO lokal / S3-kompatibel prod** | Presigned-URL-Uploads, keine Binärdaten in der DB. |
| **Design-Referenz Admin-UI: Götz & Götz Hebebühnen Backend** | Bewährtes, modernes Admin-Design (siehe [admin-design.md](admin-design.md)); wird auf die Projektmarkenfarben adaptiert. |

## 3. Monorepo-Struktur

```text
Yunity-website/
├── src/                      bestehendes Frontend (unverändert)
├── cms/
│   ├── apps/
│   │   ├── api/              NestJS (Port 4000) — /api/v1/*
│   │   └── admin/            Next.js Admin (Port 4100)
│   ├── packages/
│   │   ├── contracts/        geteilte Response/Request-Typen (Zod-Schemas + inferierte Typen)
│   │   ├── block-schemas/    Block-Registry: Schema, Defaults, Versionen je Blocktyp
│   │   ├── permissions/      Berechtigungsschlüssel + Rollen-Presets
│   │   ├── ui/               geteilte Admin-UI-Primitives
│   │   ├── config/           ESLint/TS-Basiskonfiguration
│   │   └── utilities/        Slugify, Position-Handling, Sanitizing
│   ├── prisma/               schema.prisma, migrations/, seed.ts
│   ├── infrastructure/       docker/, nginx/, scripts/, backups/
│   ├── docs/                 diese Dokumente
│   ├── compose.yaml
│   ├── package.json          npm workspaces root (cms-eigen)
│   └── README.md
```

Das CMS ist ein **eigenständiger Workspace** — es teilt keinen Code-Import mit `src/` außer später dem `contracts`-Paket (Frontend konsumiert nur Typen + HTTP).

## 4. Trennung Core ↔ Fachmodule

**Core** (projektneutral, keine Projekt-Inhalte): Auth, Users, Roles, Permissions, Sites, Pages, PageSections, Block-Registry, Navigation, Media, Forms, Settings, Revisions, Publishing, AuditLog, i18n.

**Fachmodule** (aktivierbar per `Site.enabledModules`): practiceAreas, expertise, locations, team, competencies, contactFields; vorbereitet aber initial deaktiviert: insights, cases, industries.

Fachmodule referenzieren Core (Media, Revisions, Audit), niemals umgekehrt. Kein Fachmodul kennt konkrete Seiten — die Verknüpfung erfolgt ausschließlich über Collection-Blöcke in `PageSection.data`.

## 5. Datenfluss

1. **Redaktion:** Admin-UI → Admin-API (Session-Cookie, CSRF-Token) → Validierung (Zod-DTO) → Prisma → Revision + AuditLog.
2. **Veröffentlichung:** `publish` kopiert den Draft-Snapshot in die Published-Revision (`currentPublishedRevisionId`), setzt Status, feuert signierten `POST /api/revalidate` ans Frontend (Cache-Tags).
3. **Auslieferung:** Frontend ruft `GET /api/v1/public/...` (nur veröffentlichte Inhalte, Collection-Blöcke serverseitig aufgelöst) mit `locale` und Site-Auflösung per Domain/`X-Site-Key`.
4. **Preview:** Kurzlebiger signierter Token → Next.js Draft Mode → Public-API mit `?preview=`-Token liefert Draft-Revision. Niemals öffentlich cachebar (`Cache-Control: no-store`).

## 6. Authentifizierung & Autorisierung

- Argon2id-Hashes; Login mit neutralen Fehlermeldungen und Rate Limit (5/15 min).
- **Session-Modell:** httpOnly + Secure + `SameSite=Lax` Cookie mit opakem Token (Hash in DB), Sliding Expiration + absolutem Limit; "Angemeldet bleiben" verlängert das absolute Limit. Refresh-Rotation über Session-Erneuerung; Widerruf per `revokedAt`.
- CSRF: Double-Submit-Token für alle mutierenden Admin-Requests.
- Autorisierung serverseitig via NestJS-Guard-Kette: `AuthGuard → SiteGuard (siteId-Scope) → PermissionGuard (@RequirePermission('pages.publish'))`. Admin-UI blendet Menüpunkte nur zusätzlich aus.
- 2FA (TOTP) im Datenmodell vorbereitet (`User.totpSecret`, nullable), Umsetzung Phase 9+.

## 7. Mandantenfähigkeit

- `Site`-Entität ab der ersten Migration; **jede** inhaltstragende Tabelle hat `siteId` + zusammengesetzte Unique-Constraints (`siteId, slug`).
- Site-Auflösung: Admin über explizite Site-Auswahl (Session-Kontext), Public-API über Domain-Mapping, Fallback `X-Site-Key`.
- Guard verhindert Cross-Site-Zugriffe: `siteId` kommt **nie** aus dem Request-Body, sondern aus dem aufgelösten Kontext (Schutz vor Site-ID-Manipulation / Mass Assignment via explizite DTO-Whitelists).

## 8. Block-System

- Blocktypen ausschließlich in `packages/block-schemas` registriert (`BlockDefinition` mit `key`, `schemaVersion`, Zod-`schema`, `defaultValue`, `editorComponent`-**Name**, `rendererKey`).
- DB speichert nur `blockType` + `schemaVersion` + validiertes JSONB — **niemals Code**. Editor-/Renderer-Komponenten werden über statische Registries im Admin bzw. Frontend aufgelöst; unbekannte Keys → geloggter Skip, kein Crash.
- Schema-Änderungen: neue `schemaVersion` + Migrationsfunktion `migrate(vAlt → vNeu)` im Paket; Lazy-Migration beim Laden im Admin, persistiert beim Speichern.

## 9. Medien

- S3-kompatibel (MinIO dev, R2/Hetzner prod), Upload via Presigned URL, zufällige Storage-Keys.
- Serverseitige Prüfung: MIME + Magic Bytes, Größe, Erweiterungs-Allowlist, Bildabmessungen; Varianten (WebP/AVIF, Größen) als Job nach Upload.
- Verwendungsnachweis über zentrale Referenztabelle (mediaId-Scans in Sections + Entitätsfeldern) vor Löschung.

## 10. Caching & Revalidierung

- Public-API: `Cache-Control` + ETag; optional Redis-Objekt-Cache pro (`siteId`, `locale`, Ressource).
- Frontend: Next.js `revalidateTag` über signierten `POST /api/revalidate` (HMAC mit `REVALIDATION_SECRET`, Timestamp gegen Replay).
- Tags: `page:{slug}`, `navigation:{key}`, `practice-areas:list`, `team:{slug}` usw.

## 11. Sicherheit (Kurzreferenz)

HTTPS-only · Argon2id · httpOnly/Secure-Cookies · CSRF · CORS-Allowlist (nur www-Domain + Admin-Origin) · globale DTO-Validierung (`whitelist: true, forbidNonWhitelisted: true`) · Rich-Text-Sanitizing serverseitig (Allowlist-HTML) · Rate Limits (Login 5/15 min, Passwort-Reset 3/h, Formulare 5/10 min, Public-API per IP) · Helmet-Header · keine Stack-Traces in prod · Secrets nur via ENV · Audit-Log ohne Hashes/Tokens · Prisma-Parameterisierung gegen SQLi.

## 12. Revisionen, Publishing, Audit

- Jeder relevante Save → `ContentRevision` (Snapshot als JSONB, `version` fortlaufend je Entität).
- `currentDraftRevisionId` / `currentPublishedRevisionId` auf publishbaren Entitäten; Public-API liest ausschließlich Published-Snapshots.
- Workflow-Status: `DRAFT → IN_REVIEW → APPROVED → PUBLISHED` (+ `SCHEDULED`, `ARCHIVED`); geplante Veröffentlichung über Scheduler-Job.
- AuditLog für alle mutierenden Aktionen inkl. before/after (bereinigt um sensible Felder), IP, User-Agent.

## 13. Deployment, Backups, Skalierung

Siehe [deployment.md](deployment.md). Kurz: Docker Compose (proxy, admin, api, postgres, redis, minio dev), Health-Endpunkte `/api/health/live|ready`, tägliche verschlüsselte pg_dumps mit Retention, Restore-Tests. Skalierung: API stateless (horizontale Replikas), Sessions in DB/Redis, Storage extern.

## 14. Erweiterbarkeit

Neues Projekt = neuer `Site`-Datensatz + Domain-Mapping + Modul-Toggles + eigene Rollen. Neue Blöcke = neue Einträge in `block-schemas` + Renderer im jeweiligen Frontend. Neue Fachmodule folgen dem Modul-Template (Model + Translation + Service + Controller + Admin-Feature + Permission-Keys + Tests).

## 15. Offene Architekturentscheidungen

1. **`industries`**: eigene Collection, Taxonomie an Expertise, oder vorerst statisch? → Empfehlung: statisch lassen (Phase 1), später leichte Collection.
2. **Insights/Cases**: als deaktivierte Module vormodellieren oder erst bei Bedarf? → Empfehlung: Datenmodell vorsehen (Module-Toggle `false`), UI erst später.
3. **`teamCategories`**: Enum-Feld an TeamMember vs. eigene verwaltbare Entität → Empfehlung: eigene kleine Entität `TeamCategory` (übersetzbar, sortierbar).
4. **Redis ab Phase 1?** → Empfehlung: nein; Interfaces so schneiden, dass Redis später einsteckbar ist.
5. **E-Mail-Versand** (Formular-Benachrichtigungen): SMTP-Anbieter klären (projektspezifische Konfiguration, Secrets via ENV).
