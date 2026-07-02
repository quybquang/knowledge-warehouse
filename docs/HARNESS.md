# Harness Design — Principles

Read this when **changing the harness itself** (structure, tools, skills, gates) — not for routine tasks. Operational rules agents follow every session live in [CLAUDE.md](../CLAUDE.md); never duplicate them here.

## Layers

```
L6  Validation      lint, contract-vs-code diff, hallucination log      [roadmap]
L5  Gates           inbox → /ba-review is the ONLY write path; git = audit trail
L4  Workflows       skills: /context, /ba-capture, /ba-review, /ba-sync[roadmap]
L3  Retrieval       bin/kb + retrieval protocol (in CLAUDE.md)
L2  Knowledge model rules with IDs, glossary, ADRs, contracts
L1  Instructions    CLAUDE.md here + pointer block in each code repo
L0  Storage         markdown/YAML in git — diffable, greppable
```

**Push behavior down the stack.** Convention the agent misses → L1 instruction. Frequent retrieval pattern → L3 tool. Multi-step routine → L4 skill. Must-never-happen → L5 gate. If an instruction exists and the agent still errs repeatedly, the instruction is at the wrong layer — turn it into a tool or gate.

**Every instruction must pass the deletion test:** "if this line didn't exist, would the agent do the wrong thing?" No → the agent already knows it → delete.

## Retrieval principles

1. **Grep-first, no vector DB.** IDs, headings, and tables are designed for lexical search; embeddings add silent-failure risk and solve a scale problem we don't have. Revisit (BM25/FTS5, still not embeddings) only if corpus > ~300 files or lookups routinely take > 3 grep rounds.
2. **CLI, not MCP server.** `bin/kb` composes with the agent's bash loop, works cross-repo via `KB_ROOT`, no server state. Wrap in MCP only when non-shell agents need access — the command set is already the spec.
3. **Length only costs on whole-file loads.** Line-grepped files (glossary, search) may grow freely if 1 line = 1 unit. Whole-loaded files get budgets (see CLAUDE.md) and must be sliceable by stable IDs/headings — `kb rule` slices domain files, `kb api` slices contracts. Fix retrieval, not storage: never restructure data for the reader; give the reader a better picking tool.
4. **Tool misses must teach.** Every not-found message states the next correct action (narrow the query / treat as knowledge gap / `/ba-capture`) — never a bare error.

## Knowledge principles

- The warehouse stores only what code cannot express. Schema/DTOs stay in code repos; contracts are canonical only for the API boundary.
- A rule without source + status is not knowledge. Conflicts are surfaced, never auto-resolved; settlements become ADRs.
- If a domain file exceeds its budget, the bounded context is too big — split the module (a modeling fix), don't invent pagination for prose.

## Maintenance rituals

- **Fresh Session Test** (run after any structural change, and occasionally): a brand-new session, repo contents only, must answer — what is this warehouse / how is it organized / how do I retrieve / how does knowledge enter / where are we now (`kb pending` + `kb gaps`). An unanswerable question = a missing or misplaced artifact.
- **Ablation, monthly**: disable one harness component (a kb command, a skill step, an instruction block); if nothing degrades, delete it permanently. Harness debt is real — what a weaker model needed becomes overhead on a stronger one.

## Porting to a new project

Copy `knowledge/` (templates only), `contracts/`, `bin/`, `.claude/skills/`, this file → edit `knowledge/config.yml` → add the pointer block (see README) to the code repo's CLAUDE.md. Promote stable skills to `~/.claude/skills/` for cross-project sharing.

## Roadmap

1. `/ba-sync` — Google Docs/Sheets via MCP; requires snapshots to diff against (never re-process whole docs).
2. Contract-vs-code diff — `contracts/openapi/*.yaml` field names vs DTOs/entities in code repos.
3. Hallucination incident log — for each miss, classify: missing from warehouse / present but not retrieved / present but wrong. Three failure classes, three fixes (coverage / retrieval / ingest). This is the harness's eval loop.
4. `kb lint` — only after budget/reference violations actually occur.
5. ~~Phase 2 — execution harness for the code repo~~ **Built** (2026-07-02): `templates/code-repo/` + `setup/setup-code-harness.sh`. Feature list primitive with 4-state machine gated by `scripts/verify-feature.mjs` (WIP=1 enforced, passing requires verification commands to pass, irreversible, evidence recorded), CLAUDE.md router (DoD 3 layers, clock-in/out, warehouse pointer), PROGRESS/DECISIONS, init.sh. New-project bootstrap: `setup/setup-warehouse.sh` then `setup-code-harness.sh` — see README. Not yet run against a real repo.

Key sources: [Anthropic — writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents), [effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), [grep vs embeddings evidence](https://jxnl.co/writing/2025/09/11/why-grep-beat-embeddings-in-our-swe-bench-agent-lessons-from-augment/). Techniques catalog: [harness-engineering-techniques.md](harness-engineering-techniques.md).
