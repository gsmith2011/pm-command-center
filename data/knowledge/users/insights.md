# User Insights

> Synthesized themes from interviews + analytics. Working memory lives in `ingestion/`. Items get promoted here only when they meet the [memory promotion bar](../../CLAUDE.md#memory-promotion--working-vs-long-term): recurring, decision-relevant, observed across sources, useful beyond one session.

## Provenance vocabulary

Every supporting-evidence row carries a provenance tag from the enum defined in `../../hypotheses/_SCHEMA.md`. The same rule applies here: tag honestly, don't fabricate. Path-typed tags (`[ingestion/...]`, `[source/...]`) MUST be working links.

## Active themes
<!-- Synthesized themes that are shaping current work. Each entry: theme + evidence rows (each tagged) + decision/feature relevance. -->

### Silent Salesforce schema-change breaks Flo sync at runtime, with no error surfaced
Promoted 2026-07-01 on 2 independent accounts. A change to the Salesforce field schema (a manual rename OR a managed-package field-type change) silently breaks Flo→SFDC sync at runtime. No error reaches the rep, the admin, or the dashboard, so previously-active reps quietly go inactive and the loss is invisible in the activation funnel.
- **Evidence:**
  - Brightline: a routine May Salesforce custom-field rename silently stopped sync writing those fields; ~dozen+ reps affected, no error surfaced, reps reverted to manual entry.  [ingestion/interviews/2026-06-26-diego-alvarez.md](../../ingestion/interviews/2026-06-26-diego-alvarez.md)
  - Meridian (independent): a Salesforce managed-package update silently altered field types, breaking sync for a set of reps ~2 weeks with no signal to reps, admin, or dashboard.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../../ingestion/interviews/2026-07-01-lena-whitfield.md)
- **Relevance:** primary support for [`hypotheses/sync-field-mapping-breakage.md`](../../hypotheses/sync-field-mapping-breakage.md) (active/medium). Points toward a sync-health / field-mapping-break detection capability. **Materiality (2026-07-08):** the support-ticket digest quantifies scale — 24 silent-breakage tickets across 11 accounts in the trailing quarter, a *floor* not incidence, resolved only by manual support remapping. This is same-population corroboration through the support channel — it establishes *how material*, NOT independence, and did not add a third independent source or bump confidence.  [ingestion/adhoc/2026-07-08-support-ticket-digest.md](../../ingestion/adhoc/2026-07-08-support-ticket-digest.md)

### New-account onboarding stall — reps don't reach first sync without hand-holding
Promoted 2026-07-03 on 2 independent accounts. Lean/no-admin accounts lose most new reps *before* first successful sync: the multi-step first-run flow (connect calendar, connect Salesforce, confirm mapping) has no guidance, so non-technical reps abandon it. Distinct from the breakage theme — here nothing breaks because nothing ever starts.
- **Evidence:**
  - Meridian: hires in waves (~30 this spring); many never reach first sync — attributed to lack of guidance, not setup complexity.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../../ingestion/interviews/2026-07-01-lena-whitfield.md)
  - Tandem: ~6 of 30+ reps ever activated; the rest abandoned the un-guided first-run flow — "nothing broke because nothing ever really started for them."  [ingestion/interviews/2026-07-03-nadia-osei.md](../../ingestion/interviews/2026-07-03-nadia-osei.md)
- **Relevance:** support for [`hypotheses/onboarding-ux-friction.md`](../../hypotheses/onboarding-ux-friction.md) (active/medium) — now a co-leader with field-mapping breakage. The two are NOT mutually exclusive; the decisive open question is a funnel-stage split (never-started vs. worked-then-broke), not more interviews.

## Contradictions
<!-- Where users meaningfully disagree. Preserve. Do not collapse into false consensus. Each side carries its own provenance tags. -->

### What primarily depresses activation — runtime breakage vs. onboarding drop-off (segment-dependent)
- **Side A (mature-RevOps / SFDC-admin-equipped, ~400 seats):** runtime breakage is the whole story; setup was smooth; a break-alert is the fix needed.  [ingestion/interviews/2026-06-26-diego-alvarez.md](../../ingestion/interviews/2026-06-26-diego-alvarez.md)
- **Side B (lean-RevOps / no dedicated SFDC admin, ~150 seats):** onboarding drop-off is the *quiet majority* of non-active seats; a bare break-alert is insufficient because there's no one to act on it — needs guided/auto remediation.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../../ingestion/interviews/2026-07-01-lena-whitfield.md)
- **Why preserved:** this is a segmentation signal, not noise to average away. It shapes both prioritization (runtime-break detection vs. onboarding guidance are different bets) and the *design* of any break-detection feature (notification-only will underserve admin-less accounts). Flattening it into "customers want sync reliability" would discard the most decision-relevant distinction. See the lean-revenue-operator persona (now active) in [`personas.md`](./personas.md).

## Retired
<!-- Themes that no longer hold or have been superseded. Keep them — they prevent re-running wrong assumptions. Note WHY retired and link the superseding evidence. -->

### Pricing as a driver of flat activation — WEIGHED AND SET ASIDE (2026-07-03)
Surfaced once (Tandem), never established as a cause. Kept here so it isn't re-litigated.
- **What was floated:** Nadia (Tandem) is unhappy about paying for ~30 seats when ~6 are active; her CFO questioned the spend.  [source/interviews/2026-07-03-nadia-osei.md](../../source/interviews/2026-07-03-nadia-osei.md)
- **Why set aside (not flattened):** Nadia diagnoses it herself as *displaced frustration downstream of low activation* — "the price only feels bad because the value isn't there yet… fix activation and the price conversation goes away." Pricing is not a Flo strategy lever (absent from [`strategy.md`](../strategy.md)); single account; resolves as a symptom of the activation problem, not an independent cause. Not promoted to a hypothesis by design.
- **What would revive it:** multiple accounts citing price as the reason they *churned despite active usage* (i.e. value landed and they still left on price). No such signal exists.

## TODO
PM-fillable. Populate from interview Batch D + existing user research.
