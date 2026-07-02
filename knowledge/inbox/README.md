# Inbox — review queue

Staging area. All new knowledge (from `/ba-capture`, later `/ba-sync`) sits here until
approved via `/ba-review`. **Nothing in the inbox counts as truth.**

Format of an inbox item (`YYYY-MM-DD-<slug>.md`):

```markdown
# <short title>

- **Source:** <who/which channel> — <date>
- **Verbatim input:** (quote the raw input unchanged)

## Proposals

### Proposal 1: <add | update | retire> <RULE-xxx | glossary entry | ADR>
- Proposed content
- Conflict detected: <quote the existing rule/entry if they clash, or "none">

## Questions to answer before approval

- [ ] <if any>
```

After review, the item is deleted (git keeps history), or rewritten keeping only
deferred parts if some proposals still need follow-up.
