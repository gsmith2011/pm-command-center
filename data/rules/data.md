# Data rules

> Source-of-truth per metric, naming conventions, what counts as evidence.

## Source of truth per metric
<!-- For each tracked metric: where the canonical value lives. Two systems disagreeing is a signal, not a margin of error. -->
- Integration activation rate, weekly active seats — Amplitude.
- CRM sync success rate, field mapping state — Salesforce + HubSpot sync logs.
- Support friction signal — Zendesk, tagged `field-mapping` / `sync-error`.
- Eng backlog/capacity — Linear.

## Naming conventions
<!-- Event names, property names, segment definitions. Consistency over cleverness. -->
TODO — not yet documented for this scope.

## Evidence quality

What counts as evidence, by tier:

1. **Direct customer evidence** — quotes, interviews, support tickets, recorded behavior.
2. **Product analytics** — instrumented events, cohort behavior, funnel metrics.
3. **Stakeholder opinions** — internal but informed.
4. **Market / competitor signals** — directional, not definitive.
5. **Internal speculation** — lowest weight. Label as assumption.

## TODO
PM-fillable. Populate from interview Batch D Q1.
