# Knowledge Warehouse

Centralized project knowledge — the single place holding **approved** business rules, terminology, decisions, and API contracts. Goal: humans and AI agents make decisions from the same source of truth instead of scattered docs.

**Landing page:** https://quybquang.github.io/knowledge-warehouse/ · Full architecture: [docs/HARNESS.md](docs/HARNESS.md).

## Core principles

1. **The warehouse only stores what code cannot express** — business rules, reasons, edge cases, terminology. DB schema and DTOs live in the code repo; never copy them here.
2. **All knowledge enters through review** — AI proposes (into `knowledge/inbox/`), the human approves, git records history.
3. **Every rule has an ID, a source, and a version** — citable and auditable.

## Structure

```
knowledge/
  config.yml        ← per-project config (name, code repo paths, modules)
  INDEX.md          ← the index — entry point for every agent
  glossary.md       ← data dictionary: business terms ↔ DB/API field names
  domain/           ← business rules per module (RULE-<MODULE>-NNN)
  decisions/        ← ADRs — settlements with techlead/FE/client
  inbox/            ← review queue (staging)
contracts/
  openapi/          ← API contracts (converted from FE specs)
bin/
  kb                ← retrieval CLI (see below)
docs/
  HARNESS.md        ← harness design: layers, retrieval protocol, roadmap
```

## Workflow

| Situation | Command | Result |
|---|---|---|
| New requirement / message / meeting note | `/ba-capture <content or file>` | Distilled proposals in `inbox/` |
| Process the review queue | `/ba-review` | Approve per proposal → merged into warehouse |
| Start a task / verify a bug in module X | `/context <module>` | Loads exactly that module's context pack |

Data flow: **source (Google Docs, chat, FE spec) → `/ba-capture` → `inbox/` → `/ba-review` (human gate) → `domain/` + `glossary.md` + `INDEX.md`**

## Retrieval — `bin/kb`

Deterministic, token-cheap lookups (works from any directory via `KB_ROOT`):

```
kb index              # entry point
kb module payment     # one module's rules/states/questions
kb rule RULE-PAY-003  # a single rule block
kb term invoice       # glossary lookup before naming anything
kb search "partial"   # grep across knowledge + contracts
kb api payment        # endpoint list of a contract (never load whole YAML)
kb api payment /api/v1/invoices/{id}/payments   # one path + its schemas
kb pending            # unreviewed inbox items
kb gaps               # open questions + unconfirmed rules
```

The full retrieval protocol (what agents must/must not do) is in [CLAUDE.md](CLAUDE.md).

## New project setup — two scripts

```bash
# 1. Scaffold a fresh knowledge warehouse (frame only, no content copied)
setup/setup-warehouse.sh ~/projects/new-kb my-project

# 2. Install the execution harness into the source code repo, wired to that warehouse
~/projects/new-kb/setup/setup-code-harness.sh ~/projects/new-app --kb ~/projects/new-kb
```

Script 2 drops `templates/code-repo/` into the source repo: CLAUDE.md (WIP=1, Definition of Done, clock-in/out rituals, warehouse pointer), `feature_list.json` (4-state machine), `scripts/verify-feature.mjs` (the gate — the only thing allowed to flip states, requires verification commands to actually pass), `PROGRESS.md`, `DECISIONS.md` (technical decisions only — business decisions are warehouse ADRs), `init.sh`. Idempotent: existing files are skipped; an existing CLAUDE.md gets the harness block appended, never overwritten.

Once the skills stabilize, promote `.claude/skills/*` to `~/.claude/skills/` so every project shares one copy.

## Roadmap (not built)

- `/ba-sync` — pull Google Docs/Sheets via MCP, diff against last snapshot, propose changes. Needs: Google MCP + `snapshots/`.
- `kb lint` — broken RULE references, duplicate IDs, stale inbox items.
- Contract-vs-code diff: `contracts/openapi/*.yaml` vs DTOs/entities in the code repo.
- Hallucination incident log (the harness's eval loop) — see [docs/HARNESS.md](docs/HARNESS.md).
