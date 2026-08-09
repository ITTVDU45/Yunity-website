# Deployment: Vercel + Railway/Render + Atlas + R2

Ziel-Topologie (alles per GitHub-Push deploybar):

```text
domain.de              → Vercel   Frontend (öffentliche Website)
subdomain.domain.de    → Vercel   Admin  (Login → Backend)
api.domain.de          → Railway  NestJS-API (nutzt infrastructure/docker/api.Dockerfile)
                         MongoDB Atlas   (Datenbank)
                         Cloudflare R2   (Medien-Storage, S3-kompatibel)
```

**Warum getrennt:** Vercel ist serverless und eignet sich für die zwei Next.js-
Apps. Die dauerlaufende NestJS-API (inkl. Retention-Cron), MongoDB und der
Object-Storage brauchen einen Node-Host bzw. verwaltete Dienste.

Der Anmelde-Ablauf bleibt sauber first-party: Der Browser spricht immer
`subdomain.domain.de/api/*` an; Next leitet das serverseitig an die API weiter
(`next.config` rewrite → `CMS_API_URL`). Die Session-Cookies gehören damit zu
`subdomain.domain.de`. Nach dem Login → Änderung im Backend → das CMS schickt
einen signierten Revalidierungs-Request an das Frontend → sofort sichtbar.

---

## 1. MongoDB Atlas

1. Kostenlosen Cluster (M0) erstellen, DB-User anlegen.
2. Network Access: die IP der API bzw. temporär `0.0.0.0/0` (für den ersten
   lokalen Seed) freigeben.
3. Connection-String notieren:
   `mongodb+srv://<user>:<pass>@<cluster>/yunity-cms?retryWrites=true&w=majority`
   → wird zu `MONGODB_URI`.

## 2. Cloudflare R2 (oder AWS S3)

1. Zwei Buckets anlegen: `cms-media` (öffentlich lesbar/Previews) und
   `cms-private`.
2. R2-API-Token mit Lese-/Schreibrecht auf beide Buckets erstellen.
3. Werte: `S3_ENDPOINT=<account>.r2.cloudflarestorage.com`, `S3_PORT=443`,
   `S3_USE_SSL=true`, `S3_REGION=auto`, `S3_AUTO_CREATE_BUCKET=false`,
   `S3_ACCESS_KEY`/`S3_SECRET_KEY` = die R2-Token-Keys.
4. **CORS am `cms-media`-Bucket** (Browser-Upload aus dem Admin, presigned PUT):
   ```json
   [{ "AllowedOrigins": ["https://subdomain.domain.de"],
      "AllowedMethods": ["GET", "PUT"],
      "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```

## 3. API auf Railway (empfohlen) — Alternative: Render

**Railway**
1. Neues Projekt → „Deploy from GitHub repo" → dieses Repo.
2. Service-Settings:
   - **Root Directory:** `cms`
   - **Build:** Dockerfile → Pfad `infrastructure/docker/api.Dockerfile`,
     Context `cms` (bei Root Directory `cms` ist der Context bereits `cms`).
3. Variables setzen (siehe Tabelle unten). `PORT` NICHT setzen — Railway
   injiziert ihn, die API lauscht automatisch darauf.
4. Eigene Domain `api.domain.de` dem Service zuweisen.

**Render (Alternative):** `cms/render.yaml` ist ein fertiges Blueprint
(Root/Repo = `cms`). Secrets im Dashboard ausfüllen.

### API-Umgebungsvariablen

| Variable | Wert |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas-Connection-String |
| `SESSION_SECRET` | `openssl rand -hex 32` (≥ 32 Zeichen) |
| `COOKIE_SECURE` | `true` |
| `ADMIN_URL` | `https://subdomain.domain.de` |
| `FRONTEND_URL` | `https://domain.de` |
| `REVALIDATION_SECRET` | zufällig — **identisch mit dem Frontend** |
| `S3_ENDPOINT` `S3_PORT` `S3_USE_SSL` `S3_REGION` | R2-Werte (s. o.) |
| `S3_ACCESS_KEY` `S3_SECRET_KEY` | R2-Token |
| `S3_BUCKET` `S3_PRIVATE_BUCKET` `S3_AUTO_CREATE_BUCKET` | `cms-media` / `cms-private` / `false` |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` `MAIL_FROM` | E-Mail (optional) |
| `SUPERADMIN_EMAIL` `SUPERADMIN_PASSWORD` | nur falls Seed in-container läuft |

## 4. Admin auf Vercel

1. Neues Vercel-Projekt aus demselben GitHub-Repo.
2. **Root Directory:** `cms/apps/admin` (die `vercel.json` dort setzt Install-
   und Build-Command auf den Workspace-Root, damit die `@yunity/*`-Pakete gebaut
   werden).
3. Environment Variable: `CMS_API_URL = https://api.domain.de`.
4. Domain `subdomain.domain.de` zuweisen.

## 5. Frontend auf Vercel

1. Zweites Vercel-Projekt, gleiches Repo, **Root Directory:** `.` (Repo-Root).
   `.vercelignore` schließt den `cms/`-Ordner aus.
2. Environment Variables:
   | Variable | Wert |
   |---|---|
   | `CMS_ENABLED` | `true` |
   | `CMS_API_URL` | `https://api.domain.de` |
   | `SITE_KEY` | `yunity` |
   | `REVALIDATION_SECRET` | identisch mit der API |
3. Domain `domain.de` (und `www`) zuweisen.

## 6. DNS

| Record | Ziel |
|---|---|
| `domain.de` / `www` | Vercel (Frontend-Projekt) |
| `subdomain.domain.de` | Vercel (Admin-Projekt) |
| `api.domain.de` | Railway/Render (API-Service) |

## 7. Erstbefüllung der Produktionsdatenbank

Der Seed und der Inhalts-Import laufen **einmalig lokal** gegen Atlas (der
Import liest die bestehenden Frontend-Datendateien, die nicht im API-Image
liegen). Im Repo-Root:

```bash
# .env in cms/ temporär auf Produktion zeigen lassen:
#   MONGODB_URI=<Atlas-URI>
#   SESSION_SECRET=<derselbe wie in der API>
#   SUPERADMIN_EMAIL=... SUPERADMIN_PASSWORD=...
cd cms
npm run seed            # Site, Systemrollen, Super-Admin
npm run import:content  # 13 Tätigkeitsbereiche, 16 Expertisen, Standorte,
                        # Team, Formular, alle Content-Seiten
```

Danach die produktive `MONGODB_URI` wieder aus der lokalen `.env` entfernen
und in Atlas ggf. `0.0.0.0/0` wieder einschränken.

## 8. Nach dem Go-Live prüfen

- [ ] `https://api.domain.de/api/health/ready` → `{"status":"ok"}`.
- [ ] Admin-Login unter `https://subdomain.domain.de` funktioniert; danach
      Passwort ändern.
- [ ] Frontend zeigt CMS-Inhalte (Startseite, Tätigkeitsbereiche …).
- [ ] Test: im Admin eine Seite ändern + veröffentlichen → erscheint nach
      kurzer Zeit auf dem Frontend (Revalidierung).
- [ ] Medien-Upload im Admin funktioniert (R2-CORS korrekt).
- [ ] `COOKIE_SECURE=true`, Secrets nicht im Repo, `SUPERADMIN_PASSWORD` entfernt.

## Hinweise

- **Cron/Retention:** läuft auf Railway/Render (dauerhafter Prozess) automatisch.
- **Bild-URLs:** aktuell presigned (zeitlich begrenzt). Für optimales Caching
  öffentlicher Bilder später eine öffentliche R2-Domain anbinden.
- Der Docker-/Caddy-Weg (`compose.production.yaml`, `DEPLOYMENT.md`) bleibt als
  Alternative für einen eigenen VPS bestehen.
