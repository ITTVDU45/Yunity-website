#!/bin/sh
# Tägliches MongoDB-Backup (mongodump --archive --gzip), optional GPG-verschlüsselt,
# mit Aufbewahrungsfrist. Läuft im backup-Sidecar (mongo:7-Image).
set -eu

: "${MONGODB_URI:?MONGODB_URI fehlt}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="${BACKUP_DIR}/mongo-${STAMP}.archive.gz"

mkdir -p "${BACKUP_DIR}"
echo "[backup] ${STAMP}: mongodump -> ${TARGET}"
mongodump --uri="${MONGODB_URI}" --archive="${TARGET}" --gzip

# Optionale Verschlüsselung, wenn ein GPG-Empfänger gesetzt ist.
if [ -n "${BACKUP_GPG_RECIPIENT:-}" ] && command -v gpg >/dev/null 2>&1; then
  gpg --batch --yes --encrypt --recipient "${BACKUP_GPG_RECIPIENT}" "${TARGET}"
  rm -f "${TARGET}"
  echo "[backup] verschlüsselt: ${TARGET}.gpg"
fi

# Alte Backups entfernen.
find "${BACKUP_DIR}" -name 'mongo-*.archive.gz*' -type f -mtime "+${RETENTION_DAYS}" -delete
echo "[backup] fertig (Aufbewahrung: ${RETENTION_DAYS} Tage)"
