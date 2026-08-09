#!/usr/bin/env bash
set -euo pipefail

readonly ROOT_DIR="/opt/backend-yunity"
readonly COMPOSE_FILE="$ROOT_DIR/compose.api.yaml"
readonly PRODUCTION_IMAGE="backend-yunity-api:production"
readonly ROLLBACK_IMAGE="backend-yunity-api:rollback-last"
readonly CANDIDATE_IMAGE="backend-yunity-api:candidate-$(date -u +%Y%m%d%H%M%S)"

compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

wait_healthy() {
  local container="$1"
  for _ in $(seq 1 30); do
    if [[ "$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container" 2>/dev/null || true)" == "healthy" ]]; then
      return 0
    fi
    sleep 3
  done
  docker logs --tail 100 "$container" >&2 || true
  return 1
}

deploy_service() {
  local service="$1"
  local container="$2"
  compose up -d --no-deps --force-recreate "$service"
  wait_healthy "$container"
}

rollback() {
  local exit_code=$?
  trap - ERR
  printf '%s\n' "Deployment fehlgeschlagen, vorheriges Image wird wiederhergestellt." >&2
  docker tag "$ROLLBACK_IMAGE" "$PRODUCTION_IMAGE"
  deploy_service api-secondary backend-api-secondary || true
  deploy_service api-primary backend-api-primary || true
  exit "$exit_code"
}

cd "$ROOT_DIR"
docker image inspect "$PRODUCTION_IMAGE" >/dev/null
docker tag "$PRODUCTION_IMAGE" "$ROLLBACK_IMAGE"

docker build --pull \
  -f infrastructure/docker/api.Dockerfile \
  -t "$CANDIDATE_IMAGE" \
  .

docker tag "$CANDIDATE_IMAGE" "$PRODUCTION_IMAGE"
trap rollback ERR

deploy_service api-secondary backend-api-secondary
deploy_service api-primary backend-api-primary
curl --fail --silent --show-error \
  https://api.159-69-144-3.sslip.io/api/health/ready >/dev/null

trap - ERR
docker image rm "$CANDIDATE_IMAGE" >/dev/null 2>&1 || true
printf '%s\n' "Rollierendes API-Deployment erfolgreich."
