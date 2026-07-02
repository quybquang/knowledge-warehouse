---
name: ba-review
description: Review pending items in knowledge/inbox/ one proposal at a time and merge approved changes into the warehouse (domain/, glossary.md, decisions/, contracts/, INDEX.md). Usage /ba-review [inbox file]. The only path by which knowledge enters the warehouse.
---

# /ba-review — process the review queue

This is the human gate. Design constraint: **each decision must take the reviewer under 2 minutes.** Present diffs, not documents.

## Steps

1. List `knowledge/inbox/*.md` (excluding README). If empty, say so and stop. If an argument names a file, process only that one; otherwise process oldest first.
2. For each inbox item, walk through its proposals **one at a time** using AskUserQuestion:
   - Show: proposal type (add/update/retire), the exact content that would be written, and — for updates/conflicts — the current version side by side.
   - Options: **Approve** / **Edit** (user dictates changes, then apply) / **Reject** / **Defer** (leave in inbox).
   - For conflicts: present both sides, ask which wins; if the answer settles a real discussion, offer to record it as an ADR.
   - Open questions the user can answer now become new proposals on the spot; unanswered ones stay in the item as deferred.
3. **Apply approved proposals immediately after each approval** (not batched at the end):
   - Rules → `knowledge/domain/<module>.md` (create from `_template.md` if new module; also add module to `config.yml` and `INDEX.md`)
   - Terms/fields → `knowledge/glossary.md`
   - Decisions → `knowledge/decisions/ADR-NNN-<slug>.md` (next number)
   - API contracts → `contracts/openapi/<module>.yaml`
   - Retired rules: change status to `retired (superseded by ...)`, never delete the block.
4. Update `knowledge/INDEX.md` if files were added/removed.
5. Finish the item: if everything was resolved, delete the inbox file; if proposals were deferred, rewrite the file keeping only the deferred parts.
6. If this is a git repo, show `git status` and offer a single commit summarizing the review session (e.g. `review: +3 rules payment, 1 ADR, 2 glossary entries`).

## Rules

- Never apply anything not explicitly approved in this session.
- Never renumber existing IDs.
- After applying: check size budgets on files you touched — `INDEX.md` ≤ 30 lines, `domain/<module>.md` ≤ 300. Exceeded → propose splitting the module (a modeling fix), do not trim content silently.
- If an approval would contradict an existing active rule that was NOT flagged in the item, stop and surface it before applying.
