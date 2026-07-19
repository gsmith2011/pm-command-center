# Source artifact — Support ticket digest (Zendesk export)

<!--
VERBATIM AUDIT ANCHOR — never edited after creation.
Aggregated export summary; individual ticket bodies paraphrased for length, counts are as-exported.
-->

- **Kind:** adhoc (support ticket digest — no dedicated ingest mode)
- **Compiled by:** Priya Nair's CS team (support triage), shared 2026-07-08
- **Retrieved-at:** 2026-07-08
- **Source system:** Zendesk export, tickets tagged `sync` / `salesforce` / `integration`
- **Window:** trailing quarter, 2026-04-08 → 2026-07-07

---

## Summary

- **Total sync/integration-tagged tickets in window:** 34
- **Silent field-mapping / sync-breakage pattern:** **24 of 34** (71%) — "was working, then stopped writing to Salesforce; no error; discovered late."
- **Onboarding / first-run setup (couldn't get sync working initially):** 6 of 34
- **Other** (auth expiry, HubSpot-side, feature questions): 4 of 34
- **Accounts represented in the 24 breakage tickets:** 11 distinct accounts.
- **Median time from suspected break to ticket filed:** ~12 days (reps notice slowly; several said they'd "assumed it was a one-off" for weeks).

## Breakage-pattern breakdown (the 24)

| Attribute | Value |
| --- | --- |
| Tickets citing a Salesforce-side change (field rename / type change / package update) as the trigger | 15 of 24 |
| Tickets where the rep got **no error or warning** from Flo | 22 of 24 |
| Tickets where reps had **already reverted to manual entry** before filing | 9 of 24 |
| Tickets from reps at **already-interviewed accounts** (Brightline, Meridian) | 7 of 24 |
| Avg support handle time to diagnose + manually remap | ~2.5 hrs/ticket |

## Representative (paraphrased, anonymized) tickets

- *Ticket #4471 — AE, Brightline:* "Flo stopped putting my call notes in Salesforce about two weeks ago. Nothing changed on my end that I know of. No error, I just noticed the fields were empty. Can you check?"
- *Ticket #4512 — Ops, Meridian:* "After our billing package update several reps' notes aren't syncing. We didn't touch Flo. How do we even tell which mappings are affected?"
- *Ticket #4408 — AE, mid-market account:* "Was working great for months, now nothing syncs. Found out because my manager asked where my notes were. Kind of lost trust honestly."
- *Ticket #4560 — RevOps, enterprise account:* "We renamed some custom fields in a Salesforce cleanup and didn't realize it would break Flo. No alert told us. Please advise which fields to fix."
- *Ticket #4487 — SDR, small account (onboarding, NOT breakage):* "I can't get past the Salesforce field mapping step during setup — I don't know which fields to pick." *(categorized as onboarding/setup, not breakage.)*

## Compiler notes (Priya's CS team)

- This is almost certainly an **undercount of the real incidence.** The defining behavior here is that reps *don't* complain — they quietly stop using Flo. The reps who file a ticket are the minority who bothered; the interviews (Brightline, Meridian) both described reps who silently reverted with no ticket at all. So 24 tickets is a **floor**, not the true number of affected reps.
- These tickets are **the same customer population** as the recent discovery interviews, reaching us through a different channel (support vs. call). 7 of the 24 are literally from Brightline/Meridian reps. Treat as corroboration of scale, not as new independent accounts confirming the theory.
- Every breakage ticket to date has been resolved by **manual remapping by support** — there is no self-serve or automated path, and no proactive detection. Support is effectively the detection mechanism, after the damage.
