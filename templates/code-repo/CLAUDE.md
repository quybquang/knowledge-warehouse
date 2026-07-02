# {{PROJECT}} — Agent Operating Rules

<!-- One-line project description + stack. Fill this in. -->

## Knowledge Warehouse (business truth lives OUTSIDE this repo)

Business rules, glossary, ADRs, API contracts: `{{KB_ROOT}}`

```bash
export KB_ROOT={{KB_ROOT}}
$KB_ROOT/bin/kb module <name>    # BEFORE implementing/verifying anything in a module
$KB_ROOT/bin/kb term <word>      # BEFORE naming any field or business term
$KB_ROOT/bin/kb rule <RULE-ID>   # cite rules in business-logic claims
$KB_ROOT/bin/kb pending          # before significant decisions — knowledge may be changing
```

Missing business fact = **knowledge gap**: say so, propose capturing it in the warehouse. Never invent. Business "why" → warehouse ADRs. Technical "how" (library, pattern, trade-off) → `DECISIONS.md` here.

## Working rules

1. **WIP=1.** One feature `active` at a time. Next starts only after the current one passes verification. No "also refactor while at it".
2. **Never edit states in `feature_list.json` by hand.** Only `scripts/verify-feature.mjs` changes states.
3. **No refactoring until the active feature's behavior is verified.**
4. Stay in scope: work only on the active feature. New ideas → add as `not_started` entries, don't start them.
5. Don't weaken or delete tests/verification commands to look complete.

## Definition of Done (three layers, in order — never skip ahead while one fails)

1. Static: lint + typecheck pass
2. Tests: unit/integration pass (including pre-existing ones)
3. Feature: `node scripts/verify-feature.mjs verify <id>` passes → state flips to `passing` with evidence

"Code is written" is not done. Done = layer 3 passed.

## Session start (clock-in)

1. Read `PROGRESS.md`
2. `node scripts/verify-feature.mjs status` — continue the `active` feature, or activate the highest-priority `not_started`
3. `git log --oneline -5`
4. `./init.sh` — baseline must pass BEFORE new work; if it fails, fixing it IS the task

## Session end (clock-out)

1. Update `PROGRESS.md` (current state, blocker, next step)
2. Run the Definition of Done layers on touched code
3. Commit clean (message says what + why). No debug logs, no commented-out code, no stray TODOs.

Running low on context: do NOT rush — update `PROGRESS.md`, commit a clean checkpoint, stop. A clean partial beats a rushed finish.
