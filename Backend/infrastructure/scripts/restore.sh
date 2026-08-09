#!/bin/sh
# Stellt ein MongoDB-Backup wieder her.
# Nutzung: restore.sh /backups/mongo-YYYYMMDD-HHMMSS.archive.gz
set -eu

ARCHIVE="${1:?Pfad zum Backup-Archiv angeben}"
: "${MONGODB_URI:?MONGODB_URI fehlt}"

echo "[restore] ACHTUNG: überschreibt vorhandene Daten in ${MONGODB_URI}"
printf "Fortfahren? (ja/nein) "
read -r answer
[ "${answer}" = "ja" ] || { echo "abgebrochen"; exit 1; }

# GPG-verschlüsselte Archive vorher entschlüsseln.
case "${ARCHIVE}" in
  *.gpg)
    DECRYPTED="${ARCHIVE%.gpg}"
    gpg --batch --yes --decrypt --output "${DECRYPTED}" "${ARCHIVE}"
    ARCHIVE="${DECRYPTED}"
    ;;
esac

mongorestore --uri="${MONGODB_URI}" --archive="${ARCHIVE}" --gzip --drop
echo "[restore] fertig"
