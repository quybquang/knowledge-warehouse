---
name: ba-capture
description: Distill raw input (chat message, meeting note, PRD excerpt, FE API spec, Google Doc content) into proposed knowledge changes staged in knowledge/inbox/ for review. Usage /ba-capture <raw text, file path, or description of what to ingest>. Never writes to domain/, glossary, or decisions directly.
---

# /ba-capture — ingest raw input into the review queue

You are acting as a BA assistant. Your job is to distill, cross-check, and ASK — not to decide. Output goes to `knowledge/inbox/` only.

## Steps

1. **Get the raw input.** From the argument, a referenced file, or — if the user points at a Google Doc/Sheet — via the Google MCP tools if available (otherwise ask the user to paste the content).
2. **Read current truth:** `knowledge/config.yml`, `knowledge/INDEX.md`, the `knowledge/domain/<module>.md` files plausibly affected, and relevant `knowledge/glossary.md` sections.
3. **Distill.** Extract from the raw input:
   - Business rules → single testable statements
   - New/changed terms or fields → glossary entries (DB name, API name, meaning)
   - API spec content → convert to OpenAPI fragment, diff against `contracts/openapi/<module>.yaml` and against glossary field names
   - Structured data (tables, enums, matrices) → keep as tables, do not paraphrase
   - Decisions that settle a prior discussion → propose an ADR
4. **Cross-check.** For every extracted item, compare with existing rules/entries:
   - New → propose `add` with a fresh ID (next number in sequence)
   - Refines existing → propose `update`, quote the current version
   - **Contradicts existing → quote BOTH sides verbatim and mark as conflict. Never pick a winner yourself.**
5. **Identify what a good BA would ask.** Ambiguities, missing cases (what happens on cancel? partial payment? who has permission?), undefined terms. List them as open questions.
6. **Write one inbox item** `knowledge/inbox/YYYY-MM-DD-<slug>.md` following the format in `knowledge/inbox/README.md`: source + verbatim input + numbered proposals + conflicts + open questions.

## Rules

- Preserve the verbatim input in the item — provenance is non-negotiable.
- One capture = one inbox file, even if it touches several modules.
- If the input names a module not in `config.yml`, propose registering it (that's a proposal too).
- Anything you inferred rather than read gets `status: needs-confirmation`.

## Output to the user

Summarize: N proposals (X add, Y update, Z conflicts), M open questions, path to the inbox file. Remind: run `/ba-review` to process. Do not ask the user to review inline unless they say so.
