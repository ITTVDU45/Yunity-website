# Produktionsdeployment — cms.\<domain\>

Der CMS-Stack (Admin + API + MongoDB + MinIO + Reverse Proxy) läuft per Docker
Compose auf einer eigenen Subdomain. Die öffentliche Website (`www.<domain>`)
wird **separat** deployed und spricht das CMS nur über die öffentliche API an.

## Architektur

```text
Internet ─► Caddy (TLS, :80/:443)
              ├─ cms.<domain>/api/*  ─► api   (NestJS,   :4000, intern)
              └─ cms.<domain>/*      ─► admin (Next.js,  :4100, intern)
api ─► mongo:27017 · minio:9000   (nur im internen Netz)
backup ─► täglicher mongodump ins Volume `backups`
```

## Voraussetzungen

- Server mit Docker + Docker Compose, öffentliche Ports 80/443.
- DNS: `cms.<domain>` → Server-IP (für automatisches Let's-Encrypt-Zertifikat).
- Ordner: das `cms/`-Verzeichnis dieses Repos auf dem Server.

## Erstinbetriebnahme

```bash
cd cms
cp infrastructure/.env.production.example infrastructure/.env.production
chmod 600 infrastructure/.env.production
# CMS_DOMAIN, SESSION_SECRET (openssl rand -hex 32), SUPERADMIN_*, S3-Keys,
# REVALIDATION_SECRET (identisch mit dem Frontend), SMTP_* ausfüllen.

bash infrastructure/scripts/deploy.sh
```

`deploy.sh` baut die Images, startet DB/Storage, macht ein Pre-Deploy-Backup,
läuft den idempotenten Seed (Site, Rollen, Super-Admin), startet API/Admin/Proxy
und prüft `/api/health/ready`.

Danach `SUPERADMIN_PASSWORD` aus der `.env.production` entfernen und das Passwort
nach dem ersten Login ändern.

## Inhalte importieren (optional)

```bash
docker compose -f compose.production.yaml --env-file infrastructure/.env.production \
  run --rm api npm run import:content -w @yunity/api
```

## Updates

```bash
git pull
bash infrastructure/scripts/deploy.sh   # baut neu, Backup, Seed, rolling restart
```

## Backups & Restore

- Der `backup`-Sidecar erstellt täglich `mongodump --archive --gzip` im Volume
  `backups` (Aufbewahrung `BACKUP_RETENTION_DAYS`, optional GPG-verschlüsselt via
  `BACKUP_GPG_RECIPIENT`).
- Manuelles Backup: `... run --rm backup /scripts/backup.sh`.
- Restore:
  ```bash
  docker compose -f compose.production.yaml --env-file infrastructure/.env.production \
    run --rm backup /scripts/restore.sh /backups/mongo-YYYYMMDD-HHMMSS.archive.gz
  ```
- **Monatlicher Restore-Test** in einer Staging-DB einplanen (dokumentieren).

## Health & Monitoring

- `GET /api/health/live` — Prozess läuft.
- `GET /api/health/ready` — prüft MongoDB, Storage und Pflicht-ENV.
- Uptime-Check extern auf `https://cms.<domain>/api/health/ready` + Login-Seite;
  Alerting bei wiederholtem Fehlschlag. Container-Restart-Policy: `unless-stopped`.

## Sicherheitscheck vor Go-Live

- [ ] `SESSION_SECRET`/`REVALIDATION_SECRET` zufällig, nicht im Repo.
- [ ] `COOKIE_SECURE=true` (HTTPS), `ADMIN_URL=https://cms.<domain>`.
- [ ] `SUPERADMIN_PASSWORD` aus `.env.production` entfernt, Passwort geändert.
- [ ] CORS-Allowlist = nur die CMS-Domain; MongoDB/MinIO nicht öffentlich exponiert.
- [ ] Rate Limits aktiv (Login 5/15 min, Formulare 5/10 min).
- [ ] TLS-Zertifikat ausgestellt (Caddy-Logs), Security-Header vorhanden.
- [ ] Backups laufen und ein Restore-Test war erfolgreich.

## Datenbank-Migrationen

Indizes werden von Mongoose beim Start angelegt. Für kontrollierte
Schema-/Datenänderungen wird `migrate-mongo` empfohlen (Skripte unter
`cms/migrations/`, Ausführung als API-Job-Container im Deploy-Ablauf).

## Frontend (öffentliche Website)

Separat deployen (eigenes Next.js-Projekt im Repo-Root). Erforderliche ENV:
`CMS_ENABLED=true`, `CMS_API_URL=https://cms.<domain>`, `SITE_KEY=yunity`,
`REVALIDATION_SECRET=<gleich wie CMS>`. Die Route `POST /api/revalidate` empfängt
die signierten Cache-Invalidierungen des CMS.
