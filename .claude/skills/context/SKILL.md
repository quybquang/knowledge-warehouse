---
name: context
description: Load the context pack for a module before implementing, reviewing, or verifying a bug. Usage /context <module> [task description]. Use whenever work touches a specific module's business logic, or when a bug report arrives from FE/tester.
---

# /context — load module context pack

Goal: give the agent (and the user) exactly the knowledge needed for one module in a few seconds — instead of wandering the codebase.

## Steps

Prefer `bin/kb` for lookups (`kb module`, `kb rule`, `kb term`, `kb pending`) — deterministic and token-cheap. Follow the retrieval protocol in CLAUDE.md.

1. Read `knowledge/config.yml` → project name, `code_repos` paths, `modules` list.
2. Resolve the module argument against the `modules` list (fuzzy match ok: "pay" → "payment"). If no argument or no match, list available modules and files in `knowledge/domain/` and ask which one.
3. Read, in this order:
   - `knowledge/INDEX.md`
   - `knowledge/domain/<module>.md` — rules, state machine, open questions
   - `knowledge/glossary.md` — only the sections for entities this module touches
   - `contracts/openapi/<module>.yaml` if it exists
   - Any `knowledge/decisions/ADR-*.md` referenced by the domain file
4. If a code repo path is configured and exists, locate (do not fully read) the module's entities/DTOs/controllers there — note the file paths for later reference.
5. If `knowledge/inbox/` contains unreviewed items mentioning this module, flag them: knowledge may be about to change.

## Output

A compact brief (not a dump):

- **Module:** name + one-line purpose
- **Active rules:** list of RULE-IDs with their one-sentence statements
- **State machine:** if defined
- **Key entities/fields:** from glossary, with DB↔API names
- **Open questions / needs-confirmation rules:** anything unsettled that affects this task
- **Pending inbox items:** if any — warn that these are NOT yet approved truth
- **Code locations:** file paths found in step 4

Then proceed with the user's task using ONLY this knowledge for business decisions. If the task requires a business fact not present in the pack, say so explicitly and suggest `/ba-capture` — never fill the gap with invention.

## Bug verification mode

If the task is verifying a bug report: compare the reported behavior against the active rules and contract. Conclude one of: **(a) code violates a rule → bug**, **(b) behavior matches rules → not a bug, spec-as-designed**, **(c) no rule covers this → knowledge gap, capture it**. Always cite the RULE-ID or the gap.
