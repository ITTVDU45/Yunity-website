# Yunity — CMS-Backend

Eigenständiger npm-Workspace neben der Website. Stack: **NestJS + MongoDB (Mongoose) + S3-kompatibler Objektspeicher**, Admin: **Next.js + Tailwind 4**.

Der Kern stammt aus einem bestehenden, projektneutral geschnittenen CMS. Für Yunity wurden ausgetauscht: die Inhaltsarten, der Blockkatalog, die Markenfarben und die Startinhalte.

## Struktur

```text
Backend/
├── apps/
│   ├── api/        NestJS-API  → http://localhost:4000/api  (Swagger: /api/docs)
│   └── admin/      Admin-UI    → http://localhost:4100
├── packages/
│   ├── contracts/      geteilte API-Typen
│   ├── permissions/    Berechtigungsschluessel + Systemrollen
│   ├── block-schemas/  Blockregistry (22 Bloecke)
│   └── utilities/      Slugify, Positionslogik
├── docs/           Architektur- und Planungsdokumente (aus dem Ursprungsprojekt)
└── compose.yaml    MongoDB + MinIO fuer die Entwicklung
```

## Setup

```bash
cd Backend
cp .env.example .env          # MONGODB_URI, SESSION_SECRET, S3-Zugang eintragen
npm install
npm run build:packages
npm run seed                  # Site, Systemrollen, Super-Admin
npm run import:content        # Bestandsinhalte der Website uebernehmen
npm run dev:api               # Terminal 1
npm run dev:admin             # Terminal 2 → http://localhost:4100/login
```

**Datenbank:** `MONGODB_URI` zeigt per Default auf eine lokale MongoDB. Für die vorhandene Cloud-Instanz einfach die Atlas-URI eintragen — sonst ändert sich nichts.

**Medien:** Die Mediathek braucht einen S3-kompatiblen Speicher. Lokal startet `npm run infra:up` MongoDB und MinIO per Docker; für Cloudflare R2, AWS S3 oder Hetzner Object Storage genügt es, `S3_ENDPOINT`/`S3_ACCESS_KEY`/`S3_SECRET_KEY` zu tauschen — der Code bleibt identisch.

## Inhaltsmodell

| Bereich | Inhalt |
|---|---|
| **Seiten** | Start, Leistungen, Für Unternehmen, Für Bewerber, Branchen, Über uns, Kontakt, Impressum, Datenschutz — je Seite frei sortierbare Sektionen |
| **Sammlungen** | Leistungen (8), Branchen (10), Stimmen (3), Blogartikel |
| **Weiteres** | Mediathek, Navigation (header/footer), Einstellungen, Formulare + Anfragen-Inbox, Audit-Log |

### Blockkatalog

Jeder Block bildet genau eine heute sichtbare Sektion der Website ab — es entsteht kein neues Layout:

`hero` · `page-hero` · `logo-loop` · `rich-text` · `text-image` · `icon-card-grid` · `numbered-steps` · `process-steps` · `checklist-panel` · `statistics` · `accordion` · `job-examples` · `team-cards` · `contact-cards` · `quote` · `cta` · `applicant-cta` · `form-embed` · `service-grid` · `industry-grid` · `testimonial-slider` · `blog-grid`

Unbekannte Blocktypen werden im Frontend übersprungen und geloggt, nie gerendert — sie können die Seite nicht zerlegen.

## Frontend-Anbindung

Die Website liegt eine Ebene höher (`../`). Sie liest ausschließlich die öffentliche API und fällt bei jedem Fehler auf ihre statischen Inhalte zurück.

`.env.local` im Website-Root (gitignored):

```bash
CMS_ENABLED=true
CMS_API_URL=http://localhost:4000
SITE_KEY=yunity
REVALIDATION_SECRET=…            # identisch mit Backend/.env
NEXT_PUBLIC_CMS_MEDIA_PROTOCOL=http
NEXT_PUBLIC_CMS_MEDIA_HOST=localhost
NEXT_PUBLIC_CMS_MEDIA_PORT=9000
```

Ohne `CMS_ENABLED=true` bleibt die Website unverändert statisch.

### Inhalte nachziehen

`npm run import:content` **überspringt jeden bereits veröffentlichten Eintrag** — auf einer gepflegten Site passiert ohne Flag also nichts.

| Befehl | Wirkung |
| --- | --- |
| `CONTENT_IMPORT_KINDS=service npm run import:content` | schreibt nur die Sammlung `service` neu |
| `CONTENT_IMPORT_PAGES=kontakt npm run import:content` | dasselbe für einzelne Seiten |
| `CONTENT_IMPORT_FORCE=true npm run import:content` | überschreibt **alles**, auch im Backend Gepflegtes |

Die Sammlungsdaten stammen aus `apps/api/src/content/yunity-content.json`, das direkt aus `src/lib/content/*.ts` der Website extrahiert wurde — es gibt keine abgetippte zweite Wahrheit.

## Wichtige Kommandos

| Kommando | Zweck |
|---|---|
| `npm run build` | Packages + API + Admin bauen |
| `npm run test` | Unit-Tests der API (76 Tests) |
| `npm run seed` | idempotenter Erst-Seed |
| `npm run infra:up` | MongoDB + MinIO lokal starten |
| `GET /api/health/live` / `ready` | Health-Checks (ready prüft Mongo + Storage) |

## Sicherheitshinweise

- `SESSION_SECRET` produktiv zwingend zufällig (≥ 32 Zeichen); `COOKIE_SECURE=true` hinter HTTPS.
- `SUPERADMIN_PASSWORD` nach dem ersten Login ändern und aus der `.env` entfernen.
- `REVALIDATION_SECRET` muss in Backend und Website identisch sein.
- Passwort-Reset-Mails sind ohne SMTP-Konfiguration ein Logger-Stub.

## Stand

Fertig und geprüft: Datenmodell, Blockkatalog, Admin (Dashboard, Mediathek, Seiten mit Sektionseditor, Navigation, Einstellungen, Formular-Builder, Anfragen, Audit-Log), Frontend-Anbindung aller neun Seiten mit **allen 42 Sektionen**, Header/Footer über Navigation und Einstellungen, Formularversand, Import der Bestandsinhalte.

Verifiziert ohne Datenbank: Build von API und Admin, 76 Unit-Tests grün, Typprüfung beider Projekte fehlerfrei; die Website rendert mit deaktiviertem **und** mit aktiviertem CMS (Backend nicht erreichbar) byte-gleiches Markup wie zuvor.

Noch offen: der Durchlauf gegen eine echte Datenbank (`seed` → `import:content` → Redaktionsschleife). Dafür wird die MongoDB-URI bzw. ein gestartetes Docker benötigt.
