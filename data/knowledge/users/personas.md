# Personas

> Active personas with JTBD (jobs-to-be-done). Update only when behavior or context meaningfully shifts. New interview themes that don't shift personas go to [insights.md](./insights.md) instead.

## Active personas

### Lean revenue operator (no dedicated Salesforce admin) — `active`
- **Archetype:** the revenue leader / RevOps-of-one at a smaller-to-mid account (~45–200 seats) with **no in-house Salesforce admin** and a largely non-technical rep base. Owns the CRM outcome but not the CRM internals.
- **Job-to-be-done (shared, primary):** get my whole team from signup to a *working* CRM sync **without hand-holding each rep myself** — activation is the job, and I can't throw an admin at it.
- **Behaviors (observed):** the leader can push through setup personally but the rep base cannot; reps abandon the un-guided multi-step first-run flow and revert to manual entry; teams hire in waves and lose many new reps before first sync.
  - Meridian (~150): loses reps across hiring waves before first sync.  [source/interviews/2026-07-01-lena-whitfield.md](../../source/interviews/2026-07-01-lena-whitfield.md)
  - Tandem (~45): ~6 of 30+ reps ever activated; rest bounced off the first-run flow.  [source/interviews/2026-07-03-nadia-osei.md](../../source/interviews/2026-07-03-nadia-osei.md)
- **Primary pain (sourced):** new-rep activation drop-off from lack of guided onboarding — the dominant, universal pain for this segment.  [source/interviews/2026-07-03-nadia-osei.md](../../source/interviews/2026-07-03-nadia-osei.md)
- **Facet — silent breakage / self-remediation (NOT universal):** the *larger* lean accounts that get far enough to hit runtime also suffer silent field-mapping breakage they can't self-fix, and for them a bare alert is insufficient — they need Flo to guide or auto-remap. Observed at Meridian (which reached runtime); **not** observed at Tandem, which never activated enough reps to hit breakage — so this facet is scoped to lean accounts that actually reach runtime, not asserted for the whole segment.  [source/interviews/2026-07-01-lena-whitfield.md](../../source/interviews/2026-07-01-lena-whitfield.md)
- **Current alternatives:** manual CRM entry; the leader hand-holding reps one by one; waiting on an external contractor for SFDC changes.
- **Contrast (not folded in):** distinct from the **mature-RevOps / SFDC-admin-equipped** segment (e.g. Brightline, ~400) that activates cleanly and can act on a bare break-alert. That segment's pain is runtime breakage, not onboarding.  `(intuition, PM, 2026-07-03)`
- **Last revised:** 2026-07-03
- **Status:** active — 2 independent accounts (Meridian, Tandem). Promoted from candidate 2026-07-03. Breakage facet remains scoped, not universal.

## TODO
PM-fillable. Populate from interview Batch A + ingested user research. Each persona should have:

- **Name / archetype**
- **Job-to-be-done** (the situation, motivation, expected outcome)
- **Behaviors** (observed, not assumed)
- **Pain points** (sourced — link to interview or analytics)
- **Current alternatives**
- **Last revised:** YYYY-MM-DD

Stakeholder motivations and persona claims are **interpretations** by default. Tag accordingly when uncertain.
