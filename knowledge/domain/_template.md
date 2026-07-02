# Module: <module name>

> Copy this file to `<module>.md`. One file = one bounded context.
> Register the module in `config.yml` and add a line to `INDEX.md`.

## Overview

2–4 sentences: what business problem this module solves, who the main actors are.

## States & lifecycle

If the module has a state machine (order, invoice, ticket...), draw it here — this is where AI invents the most:

```
DRAFT → CONFIRMED → PAID → COMPLETED
          ↓
       CANCELLED (only from CONFIRMED, see RULE-XXX-002)
```

## Business rules

<!-- One block per rule. IDs are never reused. A rule that stops applying → set status to `retired`, keep the block. -->

### RULE-<MODULE>-001

- **Rule:** <one testable statement>
- **Source:** <doc/person/meeting> — <YYYY-MM-DD>
- **Status:** active | needs-confirmation | retired (superseded by RULE-...)
- **Notes:** <edge cases, reasoning, ADR link if any>

## Edge cases & open questions

- [ ] <anything unclear or unsettled — with who needs to answer it>

## Related

- Entities: see [glossary.md](../glossary.md#entities)
- Contract: [../../contracts/openapi/<module>.yaml](../../contracts/openapi/)
- Decisions: <ADR-xxx if any>
