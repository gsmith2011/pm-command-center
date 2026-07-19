# Hypotheses — Onboarding UX friction

<!-- Paths in this file are relative to THIS file's location (hypotheses/<slug>.md). -->

## Meta
- Feature: `../knowledge/product/features/new-account-onboarding.md` (canonical feature file not yet created)
- Status: active
- Created: 2026-06-26
- Last updated: 2026-07-14

## Usability risk

### H-U1: New accounts stall before their first successful sync because of onboarding UX friction, holding activation down.
- **Origin:** data-derived (rival explanation registered during the activation investigation)
- **Confidence:** medium
- **Evidence for:**
  - Meridian hires reps in waves (~30 this spring); many never get from "account created" to first sync and remain non-activated seats — Lena attributes this to lack of guidance, not setup complexity.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../ingestion/interviews/2026-07-01-lena-whitfield.md)
  - Tandem (independent account): ~6 of 30+ reps ever activated; the rest abandoned the multi-step first-run flow with no hand-holding — "nothing broke because nothing ever really started for them."  [ingestion/interviews/2026-07-03-nadia-osei.md](../ingestion/interviews/2026-07-03-nadia-osei.md)
- **Evidence against:**
  - _(none yet)_
- **Open questions / caveats:**
  - Registered rival (canonical — strategy priority #3, "reduce time-to-value for new accounts"). Now 2 independent supporting accounts (Meridian + Tandem) → confidence medium. A genuine co-leader with the field-mapping hypothesis, not a straw man.
  - **Not mutually exclusive with field-mapping breakage.** Both can be true and both depress activation — they hit different stages (never-started vs. worked-then-broke) and different segments. Source-count no longer discriminates between them.
  - **Key unresolved gap:** no funnel-stage segmentation yet quantifies how much of the flat-58% activation loss is *never-started* (onboarding) vs. *worked-then-broke* (field-mapping). This is the decisive missing measurement — flagged for Renee.
  - Both supporting accounts are lean/no-admin/non-technical (Meridian ~150, Tandem ~45); onboarding stall may be less acute for mature-RevOps accounts that self-serve setup (e.g. Brightline activated cleanly).
  - **Minor same-population materiality:** the support-ticket digest includes 6 first-run/setup tickets ("can't get past the Salesforce field-mapping step during setup"), corroborating that onboarding stall is real at some scale — but same customer population as the interviews, so this is scale, not an independent source.  [ingestion/adhoc/2026-07-08-support-ticket-digest.md](../ingestion/adhoc/2026-07-08-support-ticket-digest.md)
  - **Do NOT read the raw 6-vs-24 (onboarding-vs-breakage) ticket split as a materiality comparison between the two hypotheses.** The support channel is *channel-biased against onboarding*: reps who never activated never engaged with Flo enough to file a ticket, so onboarding is undercounted far more severely than breakage (a rep who worked-then-broke at least had an active relationship and a reason to complain). 6 tickets floors onboarding *far* below its true incidence. Funnel-stage segmentation (Renee) remains the ONLY valid way to size onboarding vs. breakage — the ticket counts cannot.
- **Test:** interview an account that failed to activate; segment the activation funnel by onboarding drop-off stage to see where new accounts stall.
- **Decision trigger:** promote if stalled accounts cite onboarding UX as the blocker; demote if activation failures trace instead to runtime breakage or setup effort.
- **Status:** active — **validated problem, DEFERRED (not rejected)** as of 2026-07-14 adjudication.
- **Resolution:** —

## Adjudication note — 2026-07-14 (`/hypothesize`)

Evidentiarily a **co-equal validated problem** with silent field-mapping breakage: 2 independent supporting accounts (Meridian, Tandem), medium confidence. This hypothesis is **NOT rejected and NOT out-competed on evidence** — it is **deferred** for the current v1 decision, pending **funnel-stage segmentation** (how much of the flat-58% activation loss is never-started/onboarding vs. worked-then-broke/breakage). That segmentation cannot be done from ticket counts (channel-biased against onboarding — see caveats above); it requires a Renee funnel pull. The field-mapping v1 decision is expected to **commission that segmentation** (detection instrumentation gives the breakage denominator; the funnel pull gives the onboarding denominator). Revisit onboarding for its own decision once sized. See [sync-field-mapping-breakage § Adjudication](./sync-field-mapping-breakage.md).
