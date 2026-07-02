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
