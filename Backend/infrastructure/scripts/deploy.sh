#!/usr/bin/env bash
# Deployment-Ablauf auf dem Produktionsserver (im cms/-Verzeichnis ausführen).
# Voraussetzung: infrastructure/.env.production ist gefüllt.
set -euo pipefail

COMPOSE="docker compose -f compose.production.yaml --env-file infrastructure/.env.production"

echo "==> 1/6 Images bauen"
$COMPOSE build

echo "==> 2/6 Infrastruktur (MongoDB, MinIO) starten"
$COMPOSE up -d mongo minio

echo "==> 3/6 Pre-Deploy-Backup"
$COMPOSE run --rm backup /scripts/backup.sh || echo "WARN: Backup übersprungen (erster Lauf?)"

echo "==> 4/6 Seed (idempotent: Site, Rollen, Super-Admin)"
$COMPOSE run --rm api node apps/api/dist/seed.js

echo "==> 5/6 API, Admin, Proxy starten"
$COMPOSE up -d api admin proxy backup

echo "==> 6/6 Health-Check"
sleep 8
$COMPOSE exec -T api node -e "fetch('http://localhost:4000/api/health/ready').then(r=>{console.log('ready:',r.status);process.exit(r.ok?0:1)}).catch(e=>{console.error(e.message);process.exit(1)})"

echo "==> Deployment abgeschlossen."
