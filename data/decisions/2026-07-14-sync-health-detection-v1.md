# Decision: Build sync-health field-mapping-break detection v1 as the activation bet (over the co-equal onboarding problem), with the resourcing tradeoff escalated to leadership

## Status
decided <!-- decided on DIRECTION only; the resourcing tradeoff is escalated, not resolved — see Decision + Reversal -->

## Date
2026-07-14

## Context
Integration activation is flat at ~58% and not tracking to the 80% Q3 OKR. The investigation surfaced **two co-equal, independently-validated causes** — silent runtime Salesforce field-mapping breakage, and new-account onboarding stall — plus a rejected pricing red herring. Both are real; we cannot fund both this quarter with the 4-person integrations team. This decision picks which to build first, and names the resourcing tradeoff that only leadership can resolve.

## Options considered
1. **Build sync-health field-mapping-break detection v1** (detect + alert + sync-health indicator), prevention (durable field-ID binding) as a parallel track, guided/auto-remediation deferred. ← chosen
2. **Prioritize the onboarding fix first** (guided first-run flow) — the co-equal validated problem.
3. **Reprioritize the integrations team to Enterprise tier this quarter** (Marcus's push) — deprioritize activation work.
4. Do nothing / keep absorbing breakage via manual support remapping.

## Decision
**Decided (direction):** Build **sync-health field-mapping-break detection v1** — runtime detection of silent Salesforce schema changes that break sync, an alert to the admin, and a sync-health indicator. Run **prevention (durable field-ID binding)** as a parallel track. **Defer guided/auto-remediation** to a fast-follow. Field-mapping detection is the v1 activation bet; **onboarding is deferred, not rejected** (see below).

**Escalated (NOT resolved here) — required next action:** which existing workstream drops to free ~1 engineer-month — **deeper-Salesforce depth work OR Enterprise-tier scoping** — is a **leadership call (T1)**. This decision does **not** assert that tradeoff as settled. Owner: PM to raise with Marcus Chen / Jordan Reyes before the Q3 eng-plan lock. Until leadership approves the deprioritization, v1 has direction but no funded start.

## Why
This is a **prioritization choice between two validated problems — not an evidence verdict.** On evidence, onboarding stall is co-equal with field-mapping breakage (each has 2 independent sources). Detection v1 is sequenced first on three grounds:

- **Feasibility.** Detection is a small, bounded first build — Sam's rough, order-of-magnitude read is ~3–4 engineer-weeks for a credible v1 (explicitly not committed scope). Onboarding's fix (a re-designed guided first-run flow) is a larger, less-bounded effort.
- **Sequencing / instrumentation.** There is **no sync-health telemetry today.** Detection v1 *is* the instrumentation — it produces the breakage denominator we currently lack. Paired with a funnel-stage pull for the onboarding denominator, it's what will let us **size** breakage-loss vs. onboarding-loss and make the onboarding call on data instead of anecdote. Building detection first unblocks the measurement that de-risks the *next* decision.
- **Leverage.** Breakage is actively churning the **flagship ~400-seat account** (Brightline) and, per the ticket floor, ≥11 accounts — a concrete, in-flight retention loss, resolved today only by manual support remapping after the damage.

Prevention (field-ID binding) shrinks the incidence of a whole class of breaks; detection covers the rest and measures. Together they're a scoped, defensible v1 that doesn't over-commit.

## Evidence
- Brightline: a routine Salesforce field rename silently broke sync; ~dozen+ reps affected, no error surfaced, reps reverted to manual entry.  [ingestion/interviews/2026-06-26-diego-alvarez.md](../ingestion/interviews/2026-06-26-diego-alvarez.md)
- Meridian (independent account): a managed-package field-type change silently broke sync ~2 weeks with no signal to reps, admin, or dashboard.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../ingestion/interviews/2026-07-01-lena-whitfield.md)
- Material volume: 24 silent-breakage tickets across 11 accounts in the trailing quarter (15 citing a Salesforce-side change; 22 with no error surfaced) — a same-population *floor*, not incidence, resolved only by manual support remapping (~2.5 hrs/ticket).  [ingestion/adhoc/2026-07-08-support-ticket-digest.md](../ingestion/adhoc/2026-07-08-support-ticket-digest.md)
- Detection is feasible via Salesforce metadata-API schema diffing; rough order-of-magnitude v1 sizing ~3–4 engineer-weeks (NOT committed scope); guided remediation a separate ~6–8+ week effort.  (stakeholder-verbal, Sam Okafor, 2026-07-10)
- No sync-health telemetry exists today, so detection v1 doubles as the instrumentation that yields the true breakage rate.  [ingestion/meetings/2026-07-10-sam-okafor-1-1.md](../ingestion/meetings/2026-07-10-sam-okafor-1-1.md)
- Prevention (durable field-ID binding) would make renames non-breaking but does not cover deletions, type changes, package changes, already-broken mappings, or rep visibility — a complement, not a replacement for detection.  [ingestion/meetings/2026-07-10-sam-okafor-1-1.md](../ingestion/meetings/2026-07-10-sam-okafor-1-1.md)
- Onboarding stall is a co-equal validated problem (2 independent accounts: Meridian, Tandem) — establishing this is a prioritization call between two real problems, not a rejection of onboarding.  [ingestion/interviews/2026-07-03-nadia-osei.md](../ingestion/interviews/2026-07-03-nadia-osei.md)

## Explicitly NOT doing
- **Not** building guided/auto-remediation in v1 — deferred to a fast-follow (separate ~6–8+ week effort per Sam).  [ingestion/meetings/2026-07-10-sam-okafor-1-1.md](../ingestion/meetings/2026-07-10-sam-okafor-1-1.md)
- **Not** delivering remediation for admin-less accounts in v1 — a named limitation: Meridian-type teams with no Salesforce admin can't act on a bare alert and need guided remediation this v1 won't provide.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../ingestion/interviews/2026-07-01-lena-whitfield.md)
- **Not** prioritizing the onboarding fix this quarter — deferred (not rejected) pending the funnel-stage segmentation this decision commissions.  [ingestion/interviews/2026-07-03-nadia-osei.md](../ingestion/interviews/2026-07-03-nadia-osei.md)
- **Not** reprioritizing the integrations team to Enterprise tier this quarter despite Marcus's push — an unquantified, opinion-tier ask that conflicts with strategy priority #1 and the direct customer evidence; recorded as the competing consideration, not adopted.  (stakeholder-verbal, Marcus Chen, 2026-07-11)

## What would reverse this
This decision is **superseded** if ANY of:
1. **Leadership declines the deprioritization** — does not approve dropping SFDC-depth *or* Enterprise scoping to free the ~1 engineer-month, **or funds neither track, by the Q3 eng-plan lock (target 2026-07-28)**. Direction cannot execute without the resourcing; if unfunded, this is superseded, not silently stalled.
2. **Detection instrumentation, once live, measures a silent-breakage rate materially below the ticket-implied floor** — i.e. breakage does not explain a meaningful share of the activation gap. (This is the falsification the instrumentation exists to enable.)
3. **The Renee funnel pull shows never-started/onboarding loss dominates worked-then-broke/breakage loss by a wide margin** — flipping the priority to the onboarding problem.

## Remaining ambiguities
- **v1 design constraint — alert-fatigue:** a legitimately empty field resembles a broken one; v1 must be conservative about what it calls a "break" or admins mute it. A build constraint, not yet a solved design.  (stakeholder-verbal, Sam Okafor, 2026-07-10)
- **Sizing is rough.** ~3–4 eng-weeks is order-of-magnitude, not a committed estimate; real scoping happens at build time.
- **Onboarding is un-sized.** We do not yet know how much of the flat-58% loss is never-started vs. worked-then-broke — the commissioned funnel-stage pull (Renee) + detection instrumentation are what will size it, for onboarding's own future decision.
- **T1 unresolved.** Leadership has not signed off on any deprioritization; Marcus is actively pushing the opposite. This decision names the tradeoff; it does not resolve T1.

## Linked
<!-- Paths are relative to THIS file's location (decisions/YYYY-MM-DD-<slug>.md). -->
- Hypotheses: [`../hypotheses/sync-field-mapping-breakage.md`](../hypotheses/sync-field-mapping-breakage.md) (promoted by this decision); co-equal deferred: [`../hypotheses/onboarding-ux-friction.md`](../hypotheses/onboarding-ux-friction.md)
- Strategy: [`../knowledge/strategy.md`](../knowledge/strategy.md) § Priorities (#1 activation), § Tensions (T1 — resourcing sign-off required)
- Stakeholders to inform: [`../stakeholders/marcus-chen.md`](../stakeholders/marcus-chen.md) + [`../stakeholders/jordan-reyes.md`](../stakeholders/jordan-reyes.md) (leadership — the deprioritization sign-off this decision depends on; not yet informed), [`../stakeholders/sam-okafor.md`](../stakeholders/sam-okafor.md) (eng/capacity), [`../stakeholders/diego-alvarez.md`](../stakeholders/diego-alvarez.md) + [`../stakeholders/lena-whitfield.md`](../stakeholders/lena-whitfield.md) (affected accounts), [`../stakeholders/priya-nair.md`](../stakeholders/priya-nair.md) (CS cost), [`../stakeholders/renee-park.md`](../stakeholders/renee-park.md) (funnel-segmentation owner)
