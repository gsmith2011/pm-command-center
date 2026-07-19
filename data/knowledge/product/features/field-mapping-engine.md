# Field Mapping Engine

## Meta
- Owner: Garrett Smith
- Status: shipping
- Priority: highest — core problem statement for this role's OKR
- Last updated: 2026-06-24

## Problem
Reps only stay active if Flo quietly updates their CRM without extra steps. Field mapping requires manual setup per account today, and when it's wrong or incomplete, reps stop using the product. This is the primary lever for integration activation and retention. `(stakeholder-verbal, PM interview, 2026-06-24)`

**Known issue:** Salesforce custom-field renames silently break the sync mapping — no error surfaces to the rep, the CRM just stops updating. Flagged repeatedly by Diego Alvarez at Brightline Logistics. `(stakeholder-verbal, Diego Alvarez, 2026-06-24)`

## Target users
Sales reps (silent failure directly causes churn from the product), RevOps leads (own the mapping setup and troubleshooting).

## Success metrics
- Integration activation rate (current: 58%, target: 80% by Q3)
- CRM sync success rate

## Risks
Full hypotheses live in [`hypotheses/field-mapping-engine.md`](../../../hypotheses/field-mapping-engine.md) — not yet created. **This is the highest-priority gap to fill** given the known issue above; recommend `/hypothesize field-mapping-engine` or `/risk field-mapping-engine` as a first real task.

## Dependencies
- Engineering: Sam Okafor's integrations team.
- Salesforce/HubSpot field schemas, which customers can rename/change without notice.

## Timeline
Continuous delivery. Related smaller initiative in progress: [`field-mapping-csv-import.md`](./field-mapping-csv-import.md).

## Evidence
None ingested yet — the known issue above is currently stakeholder-verbal only, no interview/ticket artifact ingested. Recommend ingesting a Diego Alvarez call or the relevant Zendesk tickets first.

## Linked
<!-- Paths are relative to THIS file's location (knowledge/product/features/<slug>.md). -->
- Hypotheses: `../../../hypotheses/field-mapping-engine.md` (not yet created)
- Decisions: none yet
- Stakeholders affected: `../../../stakeholders/diego-alvarez.md`, `../../../stakeholders/lena-whitfield.md`, `../../../stakeholders/sam-okafor.md`

## Open questions
- How many accounts are affected by the silent custom-field-rename failure, beyond Brightline? Not yet quantified.
- Should mapping failures surface an alert to the rep, RevOps, or both?

## Follow-up after launch
N/A — ongoing, not a discrete launch. The known issue above is the most urgent thing to convert into a tracked hypothesis and, eventually, a decision.
