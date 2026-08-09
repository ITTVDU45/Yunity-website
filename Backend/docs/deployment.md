# Deployment — cms.yunity.law

## 1. Zielarchitektur

```text
Internet ──► Reverse Proxy (TLS, HTTP/2)
              ├── cms.domain.de/        → admin  (Next.js, Port 4100)
              ├── cms.domain.de/api/    → api    (NestJS, Port 4000)
              └── www.domain.de         → bestehendes Frontend (separates Deployment)
api ──► mongodb:27017 · redis:6379 (optional) · S3-Storage (MinIO/extern)
```

## 2. Container (Docker Compose)

`cms/compose.yaml` (dev): `mongo:7`, `minio`, `api` (watch), `admin` (watch), optional `redis:7`.
`cms/compose.production.yaml`: `proxy` (Caddy oder nginx), `api`, `admin`, `mongo` (Volume + Healthcheck), `redis`, `backup`-Sidecar. Images über Multi-Stage-Dockerfiles (`node:22-slim`, non-root User, `NODE_ENV=production`, nur Prod-Dependencies).

Healthchecks in Compose:
```yaml
api:    test: curl -f http://localhost:4000/api/health/ready
admin:  test: curl -f http://localhost:4100/
mongo:  test: mongosh --eval "db.adminCommand('ping')"
```

## 3. Environments

Getrennte `.env` je Umgebung (dev/test/prod), Beispieldatei `infrastructure/.env.example`:
```text
MONGODB_URI=             SESSION_SECRET=          CSRF_SECRET=
S3_ENDPOINT= S3_BUCKET= S3_ACCESS_KEY= S3_SECRET_KEY= S3_PRIVATE_BUCKET=
SMTP_HOST= SMTP_USER= SMTP_PASSWORD= MAIL_FROM=
REVALIDATION_SECRET=     FRONTEND_URL=            ADMIN_URL=
REDIS_URL= (optional)    SUPERADMIN_EMAIL= SUPERADMIN_PASSWORD= (nur Erst-Seed)
```
ENV-Validierung beim Start (Zod) — fehlende Pflichtwerte ⇒ Prozess startet nicht. Secrets nie im Repo/Image; auf dem Server via Docker-Secrets oder `.env` mit 600er-Rechten.

## 4. Deployment-Ablauf (prod)

```text
1. git pull / Image-Pull (Tag)
2. Backup: mongodump vor Migration (automatisch im Deploy-Skript)
3. npx migrate-mongo up   (einmalig, als Job-Container)
4. neue api/admin-Container starten (rolling: erst api, ready-Check, dann admin)
5. /api/health/ready prüfen
6. alte Container entfernen
7. Frontend-Cache invalidieren (Revalidate-Broadcast)
```
Skripte unter `infrastructure/scripts/`: `deploy.sh`, `migrate.sh`, `seed.sh`, `backup.sh`, `restore.sh`.

## 5. Reverse Proxy (Beispiel Caddy)

```caddyfile
cms.yunity.law {
  encode gzip
  handle /api/* { reverse_proxy api:4000 }
  handle        { reverse_proxy admin:4100 }
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    Referrer-Policy strict-origin-when-cross-origin
  }
}
```
(nginx-Äquivalent in `infrastructure/nginx/`.)

## 6. Health-Endpunkte

- `GET /api/health/live` — Prozess läuft.
- `GET /api/health/ready` — DB-Query, Redis-Ping (falls konfiguriert), Storage-HEAD auf Bucket, Pflicht-ENV vorhanden. Antwort mit Teilstatus je Abhängigkeit.

## 7. Backups

- **MongoDB:** täglicher `mongodump --archive --gzip` via Backup-Sidecar (cron), GPG-verschlüsselt, Upload in separaten Object-Storage-Bucket/Region; Retention 7 täglich / 4 wöchentlich / 6 monatlich.
- **Object Storage:** Bucket-Versionierung aktiv; privater Submissions-Bucket in Backup-Scope.
- **Vor kritischen Migrationen:** automatisches Pre-Deploy-Backup (Schritt 2 oben).
- **Restore-Tests:** monatlich Restore (mongorestore) in Staging-DB, dokumentiert (`infrastructure/backups/restore-log.md`).

## 8. Monitoring & Betrieb

- Uptime-Check auf `/api/health/ready` + Login-Seite; Alerting bei ≥2 Fehlversuchen in Folge.
- Strukturierte JSON-Logs (pino/Nest-Logger), keine Secrets/PII in Logs; Log-Rotation via Docker.
- Fehler-Tracking optional (Sentry o. ä., DSN via ENV).
- Dependency-Scans (`npm audit` in CI), Basis-Image-Updates monatlich.

## 9. Umgebungen

| Umgebung | Zweck | Daten |
|---|---|---|
| dev (lokal) | Compose mit Postgres+MinIO, Seeds | synthetisch |
| test/staging | Prod-nahes Compose, Restore-Ziel, E2E-Läufe | anonymisierte Kopie |
| prod | cms.yunity.law | echt, Backups |

Getrennte Datenbanken/Buckets je Umgebung; niemals Prod-Credentials in dev/test.
