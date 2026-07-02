# Harness Engineering — Techniques Catalog

Distilled from [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) (12 lectures + templates). Reference for harness decisions; not loaded by agents on routine tasks.

Core thesis: **"The model is smart, the harness makes it reliable."** A harness = everything outside the model weights, built from five subsystems — missing any one makes it incomplete:

| Subsystem | Artifact | Purpose |
|---|---|---|
| Instructions | AGENTS.md / CLAUDE.md | conventions, constraints, entry map |
| Tools | shell, scoped MCP | sufficient access, least privilege |
| Environment | lockfiles, pinned runtimes, init.sh | reproducible, self-describing |
| State | PROGRESS.md, feature list, git | survive session boundaries |
| Feedback | test/lint/typecheck commands | *lowest investment, highest return* |

## 1. Diagnosis

- **Fix the harness first.** When a task fails, don't swap models — attribute the failure to one of five layers: task spec, context provision, environment, verification feedback, state management. Keep a per-failure log; the layer that recurs is the bottleneck.
- **Diagnostic loop.** Execute → observe failure → attribute to a layer → fix that layer → re-run. Every failure becomes a permanent harness improvement.
- **Periodic simplification (ablation).** Monthly: disable one harness component, measure; no degradation → delete it. Harnesses rot ("harness debt"); what a weaker model needed becomes overhead on a stronger one.

## 2. Instructions

- **Entry file = router, not encyclopedia.** 50–200 lines: overview, first-run commands, ≤15 hard constraints, links to topic docs (50–150 lines each) loaded on demand.
- **Lost-in-the-middle rule.** Critical rules go at the top or bottom of the entry file, never the middle (moving one security rule from line 300 to top: compliance 60%→95%).
- **Instruction metadata.** Every rule records why it was added, when it applies, when it can expire. Audit and delete — "add a rule after each failure" is short-term relief, long-term poison (bloat, contradictions, buried priorities).
- **Deletion test.** If removing a line doesn't change agent behavior, remove it.
- **Push knowledge into code.** Types, interface comments, config annotations beat duplicated prose instructions.

## 3. Repo as system of record

- **"Information that doesn't exist in the repo doesn't exist for the agent."** Externalize knowledge from Slack/heads/wikis into repo files.
- **Fresh Session Test.** A brand-new session, repo only, must answer: what is this system / how organized / how to run / how to verify / where are we now. Any unanswerable question = missing artifact.
- **Knowledge proximity.** Docs live next to the code they govern (per-module ARCHITECTURE.md/CONSTRAINTS.md); a 50-line doc beside the code beats 500 pages elsewhere. Stale docs are worse than none — update docs in the same commit as code.
- **ACID state.** One logical change = one commit (atomicity); define a "consistent state" predicate — tests+lint pass — and never commit outside it (consistency); per-agent branches (isolation); durable knowledge only in git-tracked files (durability).

## 4. Multi-session state

- **Treat the agent as an engineer whose memory is wiped every session.**
- **PROGRESS.md** — current verified state (commit hash, test status), completed, in-progress + blocker, next steps. Target rebuild cost ≤3 min.
- **DECISIONS.md** — dated: decision, reason, rejected alternative + why. Compaction keeps the "what", loses the "why"; this file is the "why".
- **Clock-in/clock-out ritual** (in the entry file). Start: read progress → read decisions → run checks → continue from next-steps. End: update progress → run checks → commit clean.
- **Initialization session.** Session 1 writes zero feature code: runnable env, test framework with ≥1 passing test, readiness checklist, task breakdown with acceptance criteria, clean checkpoint (+31% multi-session completion).
- **init.sh** — one standard path: install deps → run baseline verification → print start command. Sessions never re-derive boot steps.
- **Context-anxiety rule.** Running low on context → do NOT rush: stop, update progress, commit a clean checkpoint.

## 5. Scope control

- **WIP=1.** One task active at a time; next starts only after current passes end-to-end verification; no "also refactor while at it" (+37% completion; agent LOC correlates *negatively* with completion).
- **Feature list as a primitive, not a memo.** Machine-readable file; each entry = (behavior, executable verification command, state, evidence). Four states only: `not_started / active / blocked / passing`. The harness — not the agent — flips states: `active→passing` requires the verification command to actually pass. "Documents can be ignored; primitives can't be bypassed."
- **Granularity:** each feature completable in one session ("user can add items to cart" — not "implement the cart", not "add the name field").
- **VCR gate.** Verified Completion Rate = verified/activated; block activating new work while VCR < 1.0.

## 6. Verification

- **Externalized termination judgment.** Completion is decided by runtime signals, never agent confidence (self-evaluation is systematically over-positive). "Done ≠ code written; done = behavior verification passed."
- **Three layers, in order:** static (lint/typecheck) → runtime (tests, startup, critical paths) → system (e2e). Never proceed to layer N+1 while N fails. Unit tests are structurally blind to interface mismatch, state propagation, resource leaks — only e2e proves absence of system-level defects.
- **Worker/checker separation.** An independent nitpicky evaluator (agent or human) gates completion; the same model that wrote the code must not be its only judge.
- **No refactoring until core behavior is verified** — refactoring moves the verified/unverified boundary.
- **Executable architecture rules.** Every constraint becomes a lint/test/grep check in CI, not prose ("enforce invariants, don't micromanage implementation"). Agents copy existing repo patterns — even bad ones — so boundaries must precede code.
- **WHAT/WHY/FIX errors.** Agent-facing errors carry the violation, the reason, and the concrete fix path — enabling self-correction without a human.
- **Review-feedback promotion.** Every recurring review comment becomes an automated check.

## 7. Observability & handoff

- **Two layers:** runtime (logs, health, traces — what the system did) + process (plans, contracts, rubrics — why the change should be accepted). Missing either wastes 30–50% of session time re-diagnosing.
- **Sprint contract** (before coding): scope, verification standards, explicit exclusions. **Evaluator rubric:** dimension × grade with hard thresholds, evidence-cited.
- **Clean-state session exit:** build passes, tests pass, progress recorded, no stale artifacts (debug logs, commented-out code, TODOs), standard startup works. Like a DB transaction: commit clean or roll back — no middle ground.
- **Dual-mode cleanup:** every session (immediate) + weekly full scan (periodic). "Clean up later = never."
- **Quality document:** per-module grades (verification, legibility, test stability, boundaries) so fresh sessions know the weakest spot.

## Principles worth quoting

- "One AGENTS.md file might be more effective than upgrading to a more expensive model."
- "Give a map, not a manual."
- "Do less but finish always beats do more but leave half-done."
- "Harness design needs specific understanding of the target model, not a one-size-fits-all template."
- "As models improve, the interesting combinations in a harness don't shrink — they shift."
- "Add the smallest artifact that directly addresses the observed failure mode."
