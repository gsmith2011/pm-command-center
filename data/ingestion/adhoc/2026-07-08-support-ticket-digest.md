# Ingestion — Support ticket digest (Zendesk, trailing quarter)

- **Date:** 2026-07-08
- **Shape:** adhoc (support ticket digest)
- **Source (verbatim anchor):** [`source/adhoc/2026-07-08-support-ticket-digest.md`](../../source/adhoc/2026-07-08-support-ticket-digest.md)
- **Compiled by:** Priya Nair's CS team
- **Context:** Week-3 volume check on the field-mapping hypothesis. Prior sources: [`snapshot`](../../ingestion/adhoc/2026-06-24-renee-activation-snapshot.md), [`Diego`](../../ingestion/interviews/2026-06-26-diego-alvarez.md), [`Lena`](../../ingestion/interviews/2026-07-01-lena-whitfield.md), [`Nadia`](../../ingestion/interviews/2026-07-03-nadia-osei.md).

## Synthesis

The digest answers **"how material is the field-mapping breakage?"** — H-fieldmap's #1 open gap — WITHOUT adding an independent source. This is deliberate and important: support tickets are the **same customer population** as the discovery interviews, reaching us through a different channel. Per `CLAUDE.md`, that is corroboration of *scale*, not a third independent methodological confirmation. It lands as **materiality under Open questions/caveats**, not as a new Evidence-for row, and does **not** bump confidence.

### Observations (directly verifiable from the digest)
- **[observation]** 24 of 34 sync-tagged tickets in the trailing quarter match the silent-breakage pattern ("was working, then stopped writing to Salesforce, no error, discovered late"), across 11 distinct accounts. `[source/adhoc/2026-07-08-support-ticket-digest.md]`
- **[observation]** 15 of 24 breakage tickets cite a Salesforce-side change (field rename / type change / package update) as the trigger; 22 of 24 report no error or warning surfaced. `[source/adhoc/2026-07-08-support-ticket-digest.md]`
- **[observation]** 9 of 24 reps had already reverted to manual entry before filing; median time from break to ticket ~12 days. `[source/adhoc/2026-07-08-support-ticket-digest.md]`
- **[observation]** 7 of 24 breakage tickets are from Brightline/Meridian reps — the same accounts already interviewed. `[source/adhoc/2026-07-08-support-ticket-digest.md]`
- **[observation]** 6 of 34 tickets are onboarding/first-run setup ("can't get past the Salesforce field-mapping step during setup"). `[source/adhoc/2026-07-08-support-ticket-digest.md]`
- **[observation]** Every breakage ticket to date was resolved by manual remapping by support; there is no self-serve or automated remediation and no proactive detection. `[source/adhoc/2026-07-08-support-ticket-digest.md]`

### Interpretations (inference — labeled, not fact)
- **[interpretation]** The 24 is a **floor, not incidence.** The defining behavior of this failure is that reps go silently inactive *without filing anything* (corroborated by Diego/Lena describing ticket-less reverts). So the true affected population is larger than the ticket count — which strengthens the materiality read while remaining an inference, not a measured rate. `(chat, no artifact)`
- **[interpretation]** Support is currently the *de facto* detection mechanism — after the damage, reactively, at ~2.5 hrs/ticket. This is the operational case for building proactive sync-health detection, and it will feed the eventual decision's problem statement. `(chat, no artifact)`
- **[interpretation]** Same-population caution applies to the onboarding tickets too: the 6 setup tickets corroborate onboarding-stall *scale* but are the same population as Lena/Nadia, so they are materiality, not an independent third source for H-onboarding either. `(chat, no artifact)`

### Routing decisions
- **H-fieldmap** — materiality recorded under **Open questions/caveats** (24 breakage tickets / 11 accounts / floor-not-incidence / no proactive detection). **No new Evidence-for row. Confidence stays medium.** Independent sources remain Diego + Lena.
- **H-onboarding** — small parallel materiality note under caveats (6 setup tickets, same-population). No Evidence-for row, confidence stays medium.
- **insights.md** — the "forthcoming digest" note on the breakage theme updated to reflect the actual figures + same-population framing.
- **Priya Nair** — light touchpoint logged (her CS team compiled the digest).
- **No promotion** to validated. Materiality ≠ independence; validation is reserved for the Week-4 `/hypothesize` → `/decide` after the eng-capacity read.

## Contradictions with prior evidence
- None. The digest is consistent with the interviews and quantifies scale. It does not resolve the field-mapping-vs-onboarding two-way contest — it strengthens the *materiality* of breakage but says nothing about the funnel-stage split (never-started vs. worked-then-broke) that would size onboarding.

## Open question for the PM
The materiality gap on field-mapping is now filled (widespread, undercounted, no detection). The remaining blocker to a decision is the **eng-capacity read (Sam)** and the explicit tradeoff against Enterprise/AI work (T1). Recommend the Sam 1:1 next, then `/hypothesize` to adjudicate and `/decide`.
