#!/usr/bin/env bash
set -euo pipefail

# Scaffold a NEW knowledge warehouse repo (frame only — no content from this one).
# Usage: setup-warehouse.sh <target-dir> [project-name]
# Copies the frame (kb, skills, templates, setup, harness docs); generates fresh
# content files (INDEX, glossary, config, README). Idempotent: refuses to touch
# an existing warehouse.

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"; NAME="${2:-}"
[ -n "$TARGET" ] || { echo "usage: setup-warehouse.sh <target-dir> [project-name]" >&2; exit 1; }
mkdir -p "$TARGET"; TARGET="$(cd "$TARGET" && pwd)"
NAME="${NAME:-$(basename "$TARGET")}"
[ -e "$TARGET/knowledge" ] && { echo "ERROR: $TARGET already has knowledge/ — refusing to overwrite a warehouse." >&2; exit 1; }

echo "== copying frame"
mkdir -p "$TARGET"/{knowledge/{domain,decisions,inbox},contracts/openapi,docs}
cp -R "$HERE/bin"            "$TARGET/bin"
mkdir -p "$TARGET/.claude" && cp -R "$HERE/.claude/skills" "$TARGET/.claude/skills"
cp -R "$HERE/setup"          "$TARGET/setup"
cp -R "$HERE/templates"      "$TARGET/templates"
cp "$HERE/CLAUDE.md"                                  "$TARGET/CLAUDE.md"
cp "$HERE/docs/HARNESS.md"                            "$TARGET/docs/"
cp "$HERE/docs/harness-engineering-techniques.md"     "$TARGET/docs/"
cp "$HERE/knowledge/domain/_template.md"              "$TARGET/knowledge/domain/"
cp "$HERE/knowledge/decisions/_template.md"           "$TARGET/knowledge/decisions/"
cp "$HERE/knowledge/inbox/README.md"                  "$TARGET/knowledge/inbox/"
cp "$HERE/contracts/openapi/README.md"                "$TARGET/contracts/openapi/"

echo "== generating fresh content files"
cat > "$TARGET/knowledge/config.yml" <<EOF
# Per-project configuration — the only file you must edit when reusing this warehouse.
project:
  name: $NAME
  description: <one line>
code_repos:
  backend: <absolute path to the source code repo>
modules: []
sources:
  - kind: <google-docs|chat|meeting>
    what: <PRD|API specs|...>
    owner: <who>
reviewer: <email>
EOF

cat > "$TARGET/knowledge/INDEX.md" <<'EOF'
# INDEX — warehouse map

> Entry point for every agent (`kb index`). One line per item: what to read, when.
> Updated whenever files are added/removed (done by /ba-review).

## Foundation

- [glossary.md](glossary.md) — data dictionary: business terms ↔ DB/API field names. **Check before naming anything.**
- [config.yml](config.yml) — project config, code repo paths, module list.
- [../docs/HARNESS.md](../docs/HARNESS.md) — harness principles. Read ONLY when changing the harness itself (tools/skills/structure); routine tasks need CLAUDE.md, not this.

## Domain (business rules per module)

_No modules yet. Create by copying `domain/_template.md`._

## Decisions (ADRs)

_No decisions recorded yet._

## Contracts

- [../contracts/openapi/](../contracts/openapi/) — API contracts converted from FE specs.

## Pending review

See [inbox/](inbox/) (`kb pending`) — run `/ba-review` to process.
EOF

cat > "$TARGET/knowledge/glossary.md" <<'EOF'
# Glossary — Data Dictionary

Business terms ↔ names in code. The main weapon against field drift and invented names.

**Conventions:** one table per entity; a new field enters here before it enters code or an API spec; the `Rules` column links to rule IDs in `domain/`; DB-vs-API name mismatches are debt — record them explicitly.

## General terms

| Term (VN) | Name in code | Meaning | Rules |
|---|---|---|---|

## Entities

<!-- Per entity:
### <EntityName> (`table: <table_name>`)
One line: what this entity represents.
| Field (DB) | Field (API) | Type | Meaning | Rules |
|---|---|---|---|---|
-->
EOF

cat > "$TARGET/README.md" <<EOF
# $NAME — Knowledge Warehouse

Single source of approved business truth for **$NAME**: rules, glossary, decisions, API contracts. Architecture and retrieval protocol: [docs/HARNESS.md](docs/HARNESS.md); agent rules: [CLAUDE.md](CLAUDE.md).

## First steps

1. Edit \`knowledge/config.yml\` (project, code repo paths, sources, reviewer)
2. Install the execution harness into the source repo:
   \`setup/setup-code-harness.sh <code-repo> --kb $TARGET\`
3. Capture the first real doc: \`/ba-capture <content>\` → review with \`/ba-review\`

## Daily use

| Situation | Command |
|---|---|
| New requirement / message / note | \`/ba-capture <content>\` |
| Process the review queue | \`/ba-review\` |
| Start a task / verify a bug in module X | \`/context <module>\` |
| Retrieval from anywhere | \`KB_ROOT=$TARGET bin/kb <index|module|rule|term|search|api|pending|gaps>\` |
EOF

( cd "$TARGET" && git init -q )
echo ""
echo "Warehouse scaffolded at $TARGET (project: $NAME). Git initialized, nothing committed."
echo "Next: edit knowledge/config.yml, then run setup/setup-code-harness.sh <code-repo> --kb $TARGET"
