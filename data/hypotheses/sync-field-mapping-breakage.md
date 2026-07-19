# Hypotheses — Silent Salesforce field-mapping breakage

<!-- Paths in this file are relative to THIS file's location (hypotheses/<slug>.md). -->

## Meta
- Feature: `../knowledge/product/features/salesforce-sync.md` (canonical feature file not yet created)
- Status: promoted
- Created: 2026-06-26
- Last updated: 2026-07-14

## Usability risk

### H-U1: Salesforce custom-field renames silently break Flo→SFDC sync at runtime with no error surfaced, so previously-active reps quietly go inactive — holding activation/retention down invisibly.
- **Origin:** data-derived (from the activation snapshot + Diego Alvarez interview)
- **Confidence:** medium
- **Evidence for:**
  - Brightline's routine May Salesforce field rename silently stopped Flo writing those fields; ~dozen+ reps affected, no error surfaced, reps quietly reverted to manual entry.  [ingestion/interviews/2026-06-26-diego-alvarez.md](../ingestion/interviews/2026-06-26-diego-alvarez.md)
  - Meridian (independent account): a Salesforce managed-package update silently altered field types, breaking sync for a set of reps for ~2 weeks with no error surfaced to reps, admin, or dashboard.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../ingestion/interviews/2026-07-01-lena-whitfield.md)
- **Evidence against:**
  - _(none yet)_
- **Open questions / caveats:**
  - Now 2 independent accounts (Brightline + Meridian). The written decision-trigger ("≥2 independent + material volume") is within reach — but **held at active/medium pending PM sign-off** and the eng-capacity read. Not yet promoted.
  - **Volume/materiality — now quantified (same-population corroboration, NOT a 3rd independent source).** The support-ticket digest shows 24 silent-breakage tickets across 11 accounts in the trailing quarter (15 citing a Salesforce-side change; 22 with no error surfaced), resolved only by manual support remapping — no proactive detection exists. This is the same customer population as the interviews via the support channel, so it corroborates *scale*, not independence. It is a **floor, not incidence** — the core behavior is reps reverting silently without filing. Materiality gap now considered closed.  [ingestion/adhoc/2026-07-08-support-ticket-digest.md](../ingestion/adhoc/2026-07-08-support-ticket-digest.md)
  - The proposed link to Renee's 2 "activated-then-quiet" accounts is an *interpretation*, not established — nobody has confirmed either account is among them.
  - The activation snapshot is correlational-only and cannot establish causation on its own.
  - Support-ticket evidence on this same theme would be the *same population through another channel* — do not double-count tickets + interviews as independent confirmations (the ticket digest will NOT add a third independent source).
  - "Best accounts groom fields most, so are most exposed" is Diego's framing, not a measured exposure distribution.
  - **Solution nuance (Meridian):** a bare break-alert may be insufficient for admin-less accounts — they need guided/auto remediation, not just notification. Feeds the eventual decision's design, not the hypothesis's truth.
  - **Feasibility / capacity / cost (decision-input, NOT evidence — from Sam 1:1 2026-07-10):** detection is feasible via Salesforce metadata-API schema diffing against the mappings; v1 catches the common cases (rename / type change / field-missing-after-package-update). Rough, order-of-magnitude sizing (not committed scope): detection + alert + sync-health indicator ≈ 3–4 eng-weeks; guided/auto-remediation a separate ≈6–8+ weeks, deferred. **v1 design constraint:** must be conservative about what it calls a "break" (a legitimately empty field resembles a broken one) or alert-fatigue makes it worse than useless. **Prevention alternative:** binding mappings to durable field IDs would make renames non-breaking (parallel track), but doesn't cover deletions/type-changes/package-changes/already-broken mappings/rep visibility — so it complements, not replaces, detection. **Bonus:** no sync-health telemetry exists today, so detection is also how we'd finally measure the true breakage rate. **Capacity/T1:** the 4-person team can't absorb v1 without dropping SFDC-depth or Enterprise scoping — a leadership deprioritization call, not Sam's.  [ingestion/meetings/2026-07-10-sam-okafor-1-1.md](../ingestion/meetings/2026-07-10-sam-okafor-1-1.md)
- **Test:** scan the support-ticket digest for field-rename/silent-break reports (respecting same-population caveat); interview independent accounts; if possible, instrument sync-health telemetry to measure how often a mapping silently breaks post-activation.
- **Decision trigger:** promote if ≥2 *independent* sources confirm silent runtime breakage AND volume is material; demote if evidence shows breakage is rare or actually attributable to setup/onboarding.
- **Status:** promoted (2026-07-14) — met its promotion bar (2 independent sources + material volume); promoted atomically with its decision record.
- **Resolution:** Build sync-health field-mapping-break detection v1 → [decision 2026-07-14-sync-health-detection-v1](../decisions/2026-07-14-sync-health-detection-v1.md). **Direction decided; resourcing tradeoff (which workstream drops) escalated to leadership (T1), not resolved.**

## Adjudication vs. rivals — 2026-07-14 (`/hypothesize`, evidentiary only)

This adjudication is **evidentiary** — which explanations the evidence supports. It does NOT select what to build; that is the `/decide` step. The selection rationale (feasibility / sequencing / leverage) is argued in the **forthcoming decision record**, not here.

- **Meets promotion bar.** Silent field-mapping breakage is supported by **2 genuinely independent accounts** (Brightline, Meridian) plus **quantified material volume** (24 breakage tickets across 11 accounts in the trailing quarter — a same-population *floor*, not a third independent source). This clears the hypothesis's own decision-trigger ("≥2 independent + material volume").
- **Status stays `active`.** Per `_SCHEMA.md` promotion rule, a `promoted` hypothesis must be created together with its decision file. The flip to `promoted` + resolution link happens in the **same step as `/decide`** — not here — to avoid an orphan promoted state.
- **Co-equal, NOT superior on evidence.** Field-mapping is **not** better-validated than the onboarding rival — [onboarding-ux-friction](./onboarding-ux-friction.md) also has 2 independent sources and is an equally-real, validated problem. Field-mapping is the **leading candidate for the v1 decision**, but that selection rests on grounds argued in the decision record, **not** on evidentiary superiority. Reading this as "field-mapping beat onboarding on the evidence" is a misread.

**Rivals — evidentiary standing:**
- **[onboarding-ux-friction](./onboarding-ux-friction.md)** — co-equal validated problem (2 independent: Meridian, Tandem). **Deferred, not rejected**, pending funnel-stage segmentation to size never-started vs. worked-then-broke loss.
- **[salesforce-setup-friction](./salesforce-setup-friction.md)** — weakest (1 evidence-for / 2 evidence-against); its lone evidence-for is likely a facet of the onboarding guidance gap. Not selected; distinguishing test noted in its file.
- **pricing** — rejected red herring; displaced frustration downstream of low activation, no independent support. Recorded in [insights.md § Retired](../knowledge/users/insights.md).
