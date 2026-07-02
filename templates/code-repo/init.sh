#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

# The one standard startup path. Sessions never re-derive boot steps.
# Adjust these three lines per project — nothing else should need editing.
INSTALL_CMD="npm ci"
VERIFY_CMD="npm run lint && npm test"
START_CMD="npm run start:dev"

echo "== init: $(pwd)"
echo "== install"
eval "$INSTALL_CMD"
echo "== baseline verification (must pass BEFORE any new work)"
eval "$VERIFY_CMD"
echo "== baseline green. Start the app with: $START_CMD"
[ "${RUN_START_COMMAND:-0}" = "1" ] && eval "$START_CMD" || true
