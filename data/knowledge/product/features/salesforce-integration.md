# Salesforce Integration

## Meta
- Owner: Garrett Smith
- Status: shipping
- Priority: high — directly tied to integration activation OKR
- Last updated: 2026-06-24

## Problem
Reps need Flo to update Salesforce automatically after calls (CRM fields, follow-ups, deal notes) without manual data entry. Salesforce is the dominant CRM among Flo's mid-market/enterprise target accounts.

## Target users
Sales reps and sales managers at mid-market/enterprise accounts using Salesforce. See [`knowledge/users/personas.md`](../../users/personas.md) (not yet populated).

## Success metrics
- Integration activation rate (current: 58%, target: 80% by Q3) — see [`metrics.md`](../metrics.md)
- CRM sync success rate

## Risks
Full hypotheses live in [`hypotheses/salesforce-integration.md`](../../../hypotheses/salesforce-integration.md) — not yet created. See immediate next moves.

## Dependencies
- Engineering: Sam Okafor's integrations team (4 people) — shared across all active integration work.
- Salesforce platform (API limits, custom field schemas per customer).

## Timeline
Continuous delivery — no fixed milestones logged yet.

## Evidence
None ingested yet. First `/ingest` will seed this.

## Linked
<!-- Paths are relative to THIS file's location (knowledge/product/features/<slug>.md). -->
- Hypotheses: `../../../hypotheses/salesforce-integration.md` (not yet created)
- Decisions: none yet
- Stakeholders affected: `../../../stakeholders/diego-alvarez.md`, `../../../stakeholders/lena-whitfield.md`, `../../../stakeholders/marcus-chen.md`

## Open questions
- What's driving the gap between 58% and 80% activation specifically on Salesforce vs. HubSpot accounts? Not yet broken out.

## Follow-up after launch
N/A — ongoing, not a discrete launch.
