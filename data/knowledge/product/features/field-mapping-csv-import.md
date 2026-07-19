# Field Mapping CSV Import

## Meta
- Owner: Garrett Smith
- Status: building
- Priority: high — directly targets the manual-setup root cause behind low activation
- Last updated: 2026-06-24

## Problem
Field mapping setup is manual per account today, which is the root cause of the activation problem (see [`field-mapping-engine.md`](./field-mapping-engine.md)). Bulk CSV import would let RevOps/admins configure mappings for many fields/accounts at once instead of one at a time.

## Target users
RevOps leads and admins at enterprise accounts (e.g., Diego Alvarez, Lena Whitfield) who currently do manual per-account setup.

## Success metrics
- Reduction in manual field-mapping setup time (no baseline logged yet — TODO)
- Downstream effect on integration activation rate

## Risks
Full hypotheses live in [`hypotheses/field-mapping-csv-import.md`](../../../hypotheses/field-mapping-csv-import.md) — not yet created.

## Dependencies
- Engineering: Sam Okafor's integrations team — same team building the rest of this roadmap.
- Builds on the existing field mapping engine.

## Timeline
In progress — no committed ship date logged yet.

## Evidence
This builds on the recently-shipped HubSpot field-mapping auto-suggest (shipped ~6 weeks ago; activation rate hasn't moved as much as expected yet — see [`metrics.md`](../metrics.md)). `(stakeholder-verbal, PM interview, 2026-06-24)`

## Linked
<!-- Paths are relative to THIS file's location (knowledge/product/features/<slug>.md). -->
- Hypotheses: `../../../hypotheses/field-mapping-csv-import.md` (not yet created)
- Decisions: none yet
- Stakeholders affected: `../../../stakeholders/diego-alvarez.md`, `../../../stakeholders/lena-whitfield.md`

## Open questions
- Why hasn't the HubSpot auto-suggest shipped 6 weeks ago moved activation as much as expected? Worth investigating before assuming CSV import will perform better.

## Follow-up after launch
Measure activation-rate movement post-launch; compare against the muted impact of the auto-suggest feature to test whether the root cause is setup friction or something else entirely.
