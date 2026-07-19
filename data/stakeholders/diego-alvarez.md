# Diego Alvarez — RevOps Lead, Brightline Logistics

## Snapshot
- Role: RevOps Lead at Brightline Logistics (flagship enterprise account, ~400 seats)
- Reports to / works with: Customer-side; primary technical contact for Flo's CRM integration at this account. Async via `#integrations-activation`.
- Influence on my work: medium-high — flagship account, signal carries weight.
- Friction level: high

## What they care about
Reliable, hands-off CRM sync — field mapping that doesn't silently break. `(intuition, PM, 2026-06-24)`

## Concerns / watch-outs
Has repeatedly flagged that Salesforce custom-field renames silently break the sync mapping, with no error surfaced to reps. This is a real churn risk signal. `(stakeholder-verbal, Diego Alvarez, 2026-06-24)`

## Communication style
TODO — not yet established.

## Open asks
**Confirmed 2026-06-26:** a sync-health view / alert that surfaces when a Salesforce field mapping breaks. His framing: "the silence is the churn risk, not the bug." `[2026-06-26 interview](../ingestion/interviews/2026-06-26-diego-alvarez.md)`

## Touchpoint log
<!-- Paths are relative to THIS file's location (stakeholders/<slug>.md). -->
- **2026-06-26** — 30-min call. Confirmed the field-mapping concern with a concrete mechanism: a routine May Salesforce field rename silently broke sync at runtime, ~dozen+ reps affected, no error surfaced, reps quietly reverted to manual entry. Setup was *not* the problem (activated fine). Explicit ask: sync-health alerting. Ingested → [`ingestion/interviews/2026-06-26-diego-alvarez.md`](../ingestion/interviews/2026-06-26-diego-alvarez.md) (anchor: [`source/interviews/2026-06-26-diego-alvarez.md`](../source/interviews/2026-06-26-diego-alvarez.md)).

## Last touched
2026-06-26

