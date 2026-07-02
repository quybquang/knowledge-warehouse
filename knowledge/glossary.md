# Glossary — Data Dictionary

Business terms ↔ names in code. The main weapon against field drift and invented names.

**Conventions:**
- One table per entity. A new field enters here before it enters code or an API spec.
- The `Rules` column links to related rule IDs in `domain/`.
- If the DB name and API name differ, that is debt — record it explicitly, don't hide it.
- Vietnamese business terms go in the `Term (VN)` column so both languages resolve to the same field.

## General terms

| Term (VN) | Name in code | Meaning | Rules |
|---|---|---|---|
| _e.g. Hoa hồng_ | _commission_ | _% paid to sales when an order is fully paid_ | _RULE-COMM-001_ |

## Entities

<!-- Copy this block per entity:

### <EntityName> (`table: <table_name>`)

One line: what this entity represents in the business.

| Field (DB) | Field (API) | Type | Meaning | Rules |
|---|---|---|---|---|
| | | | | |

-->
