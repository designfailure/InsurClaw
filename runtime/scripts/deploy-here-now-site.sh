#!/usr/bin/env bash
# Deploy a static folder to here.now using HERENOW_API_KEY from runtime/.env when present.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="${1:-$ROOT/deploy-site}"
ENV_FILE="$ROOT/runtime/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

SCRIPT="$ROOT/skills/here_now/scripts/publish.sh"
if [[ ! -x "$SCRIPT" ]]; then
  chmod +x "$SCRIPT" 2>/dev/null || true
fi

exec bash "$SCRIPT" "$SITE" --title "InsurClaw" --description "Static InsurClaw preview" --client "insurclaw-runtime"
