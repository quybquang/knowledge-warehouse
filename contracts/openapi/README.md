# API Contracts

One OpenAPI 3.x file per module: `<module>.yaml`.

FE currently sends free-form specs (no OpenAPI, no PRs). One-way process:

1. Receive a spec from FE → `/ba-capture` with the spec content
2. The agent converts it to OpenAPI, diffs against the existing contract (if any) and
   against the glossary (do field names match the data dictionary?)
3. Field/name drift → reported in the inbox item, you decide
4. Approved via `/ba-review` → the YAML here is **canonical**; the FE spec was only input

Field names in contracts must match the `Field (API)` column in `knowledge/glossary.md`.
A mismatch means one of the two is wrong — fix immediately, never let both coexist.
