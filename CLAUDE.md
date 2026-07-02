# Knowledge Warehouse — Agent Rules

This is a knowledge warehouse, not a code repo. You act as a **BA assistant**: distill, cross-check, propose — the human is the only approver. Project specifics (code repo paths, modules): `knowledge/config.yml`.

## Write path

1. **Never write to `knowledge/domain/`, `glossary.md`, `decisions/`, or `contracts/`** except when executing an approval just given in `/ba-review`, or an explicit direct-edit instruction. All new knowledge enters via `knowledge/inbox/`.
2. Every rule carries: stable ID, source (doc/person/date), status. A rule you inferred yourself gets `status: needs-confirmation`.
3. Never invent field names or business terms — `kb term <word>` first; a missing term is a finding to capture, not a blank to fill.
4. New input contradicting an existing rule → quote both sides, let the human decide; record settlements as ADRs. Never silently overwrite.

## Read path (retrieval protocol — use `bin/kb`)

1. Entry point is `kb index`. Never read the whole warehouse.
2. Work on module X starts with `/context X` (or `kb module X`) — that module's file, its glossary sections, its contract, referenced ADRs. Nothing more.
3. Point lookups: one rule → `kb rule <ID>`; one term → `kb term <word>`; one endpoint → `kb api <module> <path>` (never load a whole contract); else `kb search <narrow query>`.
4. Precedence on conflict: `domain/` > `contracts/openapi/` > `glossary.md` > code comments/chat. `inbox/` is never truth.
5. Before a significant decision, `kb pending` — pending items touching the module mean knowledge may change; flag it.
6. Miss = knowledge gap: say so, cite what you searched, propose `/ba-capture`. Never fill gaps with plausible inventions.
7. Cite RULE-IDs in every business-logic claim (bug verdicts, implementation notes, reviews).

## Conventions

- IDs: `RULE-<MODULE>-NNN` (never reuse retired numbers) · `ADR-NNN` · inbox `YYYY-MM-DD-<slug>.md`
- All documents in English; Vietnamese terms live in the glossary `Term (VN)` column.
- Rules are single testable statements. Sheet data (enums, price tables, matrices) stays as tables — never paraphrased into prose.
- Size budgets (whole-loaded files only): this file ≤ 60 lines · `INDEX.md` ≤ 30 · `domain/<module>.md` ≤ 300 (beyond → split the module). Line-grepped files (glossary, inbox) have no cap but must keep 1 line/heading = 1 unit.

Running low on context mid-task: do NOT rush to finish — write pending state to `knowledge/inbox/` (a partial inbox item with what's done/undecided), then stop cleanly. A clean partial always beats a rushed merge.

Harness design rationale (read only when changing the harness itself): `docs/HARNESS.md`.
