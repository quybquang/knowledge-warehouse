#!/usr/bin/env bash
set -euo pipefail

# Drop the execution harness (Phase 2) into a source code repo.
# Usage: setup-code-harness.sh <target-repo> [--kb <warehouse-path>] [--name <project-name>]
# Default --kb: the warehouse this script lives in. Idempotent: never overwrites existing files.

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$HERE/templates/code-repo"

TARGET="${1:-}"; shift || true
[ -n "$TARGET" ] || { echo "usage: setup-code-harness.sh <target-repo> [--kb <path>] [--name <name>]" >&2; exit 1; }
KB="$HERE"; NAME=""
while [ $# -gt 0 ]; do
  case "$1" in
    --kb)   KB="$2"; shift 2 ;;
    --name) NAME="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done
mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"; KB="$(cd "$KB" && pwd)"
NAME="${NAME:-$(basename "$TARGET")}"
[ -x "$KB/bin/kb" ] || echo "WARN: $KB does not look like a warehouse (no bin/kb) — pointer will still be written."

render() { sed -e "s|{{PROJECT}}|$NAME|g" -e "s|{{KB_ROOT}}|$KB|g" "$1"; }

place() { # place <template-rel-path>
  local src="$TPL/$1" dst="$TARGET/$1"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ]; then echo "skip   $1 (exists)"; else render "$src" > "$dst"; echo "create $1"; fi
}

# CLAUDE.md: append if the repo already has one — never clobber project instructions.
if [ -e "$TARGET/CLAUDE.md" ]; then
  if grep -q "Knowledge Warehouse" "$TARGET/CLAUDE.md"; then
    echo "skip   CLAUDE.md (harness block already present)"
  else
    { echo ""; echo "<!-- appended by setup-code-harness -->"; render "$TPL/CLAUDE.md" | tail -n +2; } >> "$TARGET/CLAUDE.md"
    echo "append CLAUDE.md (harness block added below existing content)"
  fi
else
  place CLAUDE.md
fi

place feature_list.json
place PROGRESS.md
place DECISIONS.md
place init.sh
place scripts/verify-feature.mjs
chmod +x "$TARGET/init.sh"

echo ""
echo "Harness installed in $TARGET (KB_ROOT=$KB)."
echo "Next steps:"
echo "  1. Edit init.sh — the 3 command variables at the top"
echo "  2. Replace the example feature in feature_list.json"
echo "  3. Fill the description line at the top of CLAUDE.md"
echo "  4. Sanity check: node scripts/verify-feature.mjs status"
