#!/usr/bin/env bash
set -euo pipefail

readonly SOURCE_CONTAINER="backend-yunity-api"
readonly CONFIG_DIR="/etc/backend-yunity"
readonly ENV_FILE="$CONFIG_DIR/api.env"
readonly SECRET_DIR="$CONFIG_DIR/secrets"

install -d -m 700 -o root -g root "$CONFIG_DIR" "$SECRET_DIR"
cp -a "$ENV_FILE" "$ENV_FILE.before-secret-files"

extract_secret() {
  local variable="$1"
  local filename="$2"
  local temporary="$SECRET_DIR/.$filename.tmp"

  docker exec "$SOURCE_CONTAINER" node -e \
    "const value=process.env['$variable'];if(!value)process.exit(1);process.stdout.write(value)" \
    > "$temporary"
  test -s "$temporary"
  chmod 0444 "$temporary"
  chown root:root "$temporary"
  mv -f "$temporary" "$SECRET_DIR/$filename"
}

extract_secret MONGODB_URI mongodb_uri
extract_secret SESSION_SECRET session_secret
extract_secret S3_ACCESS_KEY s3_access_key
extract_secret S3_SECRET_KEY s3_secret_key
extract_secret REVALIDATION_SECRET revalidation_secret

awk -F= '
  BEGIN {
    secret["MONGODB_URI"]=1
    secret["SESSION_SECRET"]=1
    secret["S3_ACCESS_KEY"]=1
    secret["S3_SECRET_KEY"]=1
    secret["REVALIDATION_SECRET"]=1
  }
  !($1 in secret)
' "$ENV_FILE" > "$ENV_FILE.tmp"

chmod 0600 "$ENV_FILE.tmp"
chown root:root "$ENV_FILE.tmp"
mv -f "$ENV_FILE.tmp" "$ENV_FILE"
