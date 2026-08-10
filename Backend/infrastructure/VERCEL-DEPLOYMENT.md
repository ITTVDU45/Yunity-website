# Deployment ohne eigenen Server

Zieltopologie — alles per Git-Push deploybar, kein selbst betriebener Server:

```text
yunity-jobs.de          → Vercel    Website (öffentlich)
admin.yunity-jobs.de    → Vercel    Admin-Oberfläche (Login)
api.yunity-jobs.de      → Render    NestJS-API
                          MongoDB Atlas     Datenbank
                          Cloudflare R2     Medien (S3-kompatibel)
```

**Warum die API nicht auf Vercel läuft:** Sie braucht einen dauerhaft laufenden
Prozess — der Retention-Cron löscht Formular-Eingänge nach Ablauf der
Aufbewahrungsfrist, und MongoDB-Verbindungen sollen bestehen bleiben. Render und
Railway sind verwaltete Plattformen: Git-Push genügt, es ist kein Server zu
administrieren.

**Anmeldung bleibt first-party:** Der Browser spricht immer
`admin.yunity-jobs.de/api/*` an; Next leitet serverseitig an die API weiter
(Rewrite in `apps/admin/next.config.ts`). Die Session-Cookies gehören damit zu
`admin.yunity-jobs.de` — kein Third-Party-Cookie, keine CORS-Probleme.

---

## 1. MongoDB Atlas

1. Kostenlosen M0-Cluster erstellen, Datenbank-Benutzer anlegen.
2. Network Access: `0.0.0.0/0` (Render vergibt keine feste IP).
3. Connection-String → `MONGODB_URI`:
   `mongodb+srv://<user>:<pass>@<cluster>/yunity-cms?retryWrites=true&w=majority`

## 2. Cloudflare R2

1. Zwei Buckets: `yunity-media` (öffentlich lesbar) und `yunity-private`.
2. API-Token mit Lese-/Schreibrecht auf beide.
3. Env: `S3_ENDPOINT=<account>.r2.cloudflarestorage.com`, `S3_PORT=443`,
   `S3_USE_SSL=true`, `S3_REGION=auto`, `S3_AUTO_CREATE_BUCKET=false`.
4. **CORS am Medien-Bucket** (der Admin lädt per presigned PUT direkt hoch):
   ```json
   [{ "AllowedOrigins": ["https://admin.yunity-jobs.de"],
      "AllowedMethods": ["GET", "PUT"],
      "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```
5. Öffentliche Bucket-Domain (z. B. `medien.yunity-jobs.de`) notieren — sie
   kommt in `NEXT_PUBLIC_CMS_MEDIA_HOST` der Website.

## 3. API auf Render

Neuer **Web Service** → dieses Repository.

| Einstellung | Wert |
|---|---|
| Root Directory | `Backend` |
| Runtime | Docker |
| Dockerfile Path | `infrastructure/docker/api.Dockerfile` |
| Health Check Path | `/api/health/live` |
| Custom Domain | `api.yunity-jobs.de` |

`render.yaml` liegt als Blueprint bei und setzt die unkritischen Variablen
bereits. Im Dashboard zu ergänzen:

```
MONGODB_URI, SESSION_SECRET (>=32 Zeichen, zufällig),
ADMIN_URL=https://admin.yunity-jobs.de,
FRONTEND_URL=https://yunity-jobs.de,
REVALIDATION_SECRET,
S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY,
SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD   (nur für den ersten Seed)
```

## 4. Admin auf Vercel

**Neues** Vercel-Projekt auf dasselbe Repository.

| Einstellung | Wert |
|---|---|
| Root Directory | `Backend/apps/admin` |
| Include files outside root directory | **an** |
| Custom Domain | `admin.yunity-jobs.de` |
| Env | `CMS_API_URL=https://api.yunity-jobs.de` |

Install- und Build-Command stehen in `apps/admin/vercel.json` und greifen
automatisch.

## 5. Website auf Vercel

Das bestehende Projekt, Root Directory `.`, Domain `yunity-jobs.de`.
Zusätzliche Variablen (siehe `.env.example` im Repo-Root):

```
CMS_ENABLED=true
CMS_API_URL=https://api.yunity-jobs.de
SITE_KEY=yunity
REVALIDATION_SECRET=…              identisch mit der API!
NEXT_PUBLIC_CMS_MEDIA_PROTOCOL=https
NEXT_PUBLIC_CMS_MEDIA_HOST=medien.yunity-jobs.de
NEXT_PUBLIC_CMS_MEDIA_PORT=
```

> Da Website und Backend im selben Repository liegen, baut das Website-Projekt
> auch bei reinen Backend-Änderungen. Über **Settings → Git → Ignored Build
> Step** lässt sich das eingrenzen:
> `git diff --quiet HEAD^ HEAD -- . ':(exclude)Backend'`

## 6. Erstbefüllung

Einmalig lokal gegen die Produktionsdatenbank:

```bash
cd Backend
# .env temporär auf Produktion zeigen lassen (MONGODB_URI, S3_*)
npm run seed
npm run import:content
```

Danach `SUPERADMIN_PASSWORD` bei Render entfernen und das Passwort im Admin
ändern.

## 7. Funktionsprüfung

1. `https://api.yunity-jobs.de/api/health/ready` liefert 200 (prüft Datenbank
   und Speicher).
2. Login auf `https://admin.yunity-jobs.de`.
3. Bild in die Mediathek laden — schlägt das fehl, stimmt die R2-CORS-Regel nicht.
4. Sektionstitel ändern, veröffentlichen → `https://yunity-jobs.de` zeigt die
   Änderung binnen Sekunden. Passiert nichts, ist `REVALIDATION_SECRET` auf
   beiden Seiten unterschiedlich.
