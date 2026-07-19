# Hypotheses — Salesforce setup friction

<!-- Paths in this file are relative to THIS file's location (hypotheses/<slug>.md). -->

## Meta
- Feature: `../knowledge/product/features/salesforce-sync.md` (canonical feature file not yet created)
- Status: active
- Created: 2026-06-26
- Last updated: 2026-07-14

## Usability risk

### H-U1: The initial Salesforce field-mapping *setup* is too manual/error-prone, so new accounts stall before reaching a working sync — depressing activation.
- **Origin:** data-derived (rival explanation registered during the activation investigation)
- **Confidence:** low
- **Evidence for:**
  - Tandem: two non-admin reps gave up at the Salesforce field-mapping *setup* step on a screen-share — "no idea which Salesforce field was which… that's an admin question and they're not admins."  [ingestion/interviews/2026-07-03-nadia-osei.md](../ingestion/interviews/2026-07-03-nadia-osei.md)
- **Evidence against:**
  - Brightline reported setup and initial field-mapping went smoothly ("setup was fine"); their failure began *post-activation*, not during setup.  [ingestion/interviews/2026-06-26-diego-alvarez.md](../ingestion/interviews/2026-06-26-diego-alvarez.md)
  - Meridian reported the mapping setup itself "wasn't hard" once done; Lena attributes new-rep stalls to lack of guidance, not manual setup complexity.  [ingestion/interviews/2026-07-01-lena-whitfield.md](../ingestion/interviews/2026-07-01-lena-whitfield.md)
- **Open questions / caveats:**
  - Registered rival (canonical — strategy priority #2, "deeper Salesforce integration / reduce manual field-mapping setup"). Now 1 evidence-for / 2 evidence-against — the weakest of the three, kept live.
  - **The single evidence-for is ambiguous.** Tandem's field-mapping-step confusion is real, but it arrived *inside* a broader onboarding stall (no hand-holding on the whole first-run flow). It may be a facet of the onboarding-guidance problem rather than a standalone "setup is too manual" problem. If a guided onboarding flow would resolve the field-mapping-step confusion too, this hypothesis largely collapses into [onboarding-ux-friction](./onboarding-ux-friction.md).
  - Distinguishing test needed: is the setup step hard *even with* good guidance (→ setup-friction is real and separate), or only hard *because* guidance is absent (→ it's an onboarding problem)? No evidence yet isolates this.
- **Test:** interview accounts that stalled before first sync; check the ticket digest for setup-stage failures (mapping never completed vs. mapping broke later).
- **Decision trigger:** promote if multiple accounts cite setup effort as the activation blocker; demote if setup is consistently reported smooth across accounts.
- **Status:** active — **weakest of the three; adjudicated not-selected 2026-07-14**, likely subsumed into onboarding (kept active pending a distinguishing test).
- **Resolution:** —

## Adjudication note — 2026-07-14 (`/hypothesize`)

Weakest of the three rivals: **1 evidence-for / 2 evidence-against.** The single evidence-for (Tandem reps stalling at the Salesforce field-mapping *setup* step) arrived inside a broader onboarding stall and is **likely a facet of the onboarding guidance gap**, not standalone "setup is too manual" friction. **Not selected.** Kept `active` — not demoted — pending the distinguishing test: *is the setup step hard even WITH good onboarding guidance?* If yes → setup friction is independently real and separable; if no → it collapses into [onboarding-ux-friction](./onboarding-ux-friction.md). No evidence yet isolates this. See [sync-field-mapping-breakage § Adjudication](./sync-field-mapping-breakage.md).
