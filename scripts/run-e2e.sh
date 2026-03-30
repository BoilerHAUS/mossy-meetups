#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.e2e.yml"

export DATABASE_URL="${DATABASE_URL:-postgresql://MossyMeetupsUser:changeme@127.0.0.1:54329/mossymeetups_e2e?schema=public}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-mossy-meetups-e2e-secret}"
export EMAIL_SERVER="${EMAIL_SERVER:-smtp://127.0.0.1:3025}"
export EMAIL_FROM="${EMAIL_FROM:-e2e@mossymeetups.local}"
export BASE_URL="${BASE_URL:-http://localhost:3000}"

cleanup() {
  docker-compose -f "$COMPOSE_FILE" down -v >/dev/null 2>&1 || true
}

wait_for_postgres() {
  local attempts=60
  while (( attempts > 0 )); do
    if docker-compose -f "$COMPOSE_FILE" exec -T db \
      pg_isready -U MossyMeetupsUser -d mossymeetups_e2e >/dev/null 2>&1; then
      return 0
    fi
    attempts=$((attempts - 1))
    sleep 1
  done

  echo "Postgres did not become ready for E2E tests." >&2
  docker-compose -f "$COMPOSE_FILE" logs db >&2 || true
  return 1
}

trap cleanup EXIT

cd "$ROOT_DIR"

docker-compose -f "$COMPOSE_FILE" up -d
wait_for_postgres

npx prisma migrate reset --force --skip-seed
node scripts/seed-e2e.js
npx playwright test "$@"
