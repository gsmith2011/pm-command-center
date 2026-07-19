# Source artifact — Activation snapshot (analytics note)

<!--
VERBATIM AUDIT ANCHOR — never edited after creation.
Captured as pasted; this is the raw artifact, not brain synthesis.
-->

- **Kind:** adhoc (analytics snapshot)
- **Author:** Renee Park (Data/Analytics Lead)
- **Channel:** shared in `#activation-okr`, 2026-06-24
- **Retrieved-at:** 2026-06-24
- **Pull source:** Amplitude — activation funnel, weekly signup cohorts

---

**Renee Park — 2026-06-24, `#activation-okr`:**

Pulled the activation funnel for the OKR check-in. Short version: we are **flat.** Integration activation has been sitting right around **58%** for six straight weekly cohorts. It is not trending toward the 80% Q3 target — it's just... level.

By weekly signup cohort (activation = new seat reaches a working, syncing CRM integration within the measurement window):

| Signup week (cohort) | New seats (N) | Activated | Activation % |
| --- | --- | --- | --- |
| Wk of May 11 | 31 | 18 | 58% |
| Wk of May 18 | 24 | 14 | 58% |
| Wk of May 25 | 38 | 21 | 55% |
| Wk of Jun 1  | 22 | 13 | 59% |
| Wk of Jun 8  | 29 | 17 | 59% |
| Wk of Jun 15 | 19 | 11 | 58% |
| **Trailing 6-wk aggregate** | **163** | **94** | **57.7%** |

Caveats — please read these before anyone runs with a story:

- **Small N.** These are 19–38 seats per cohort, 163 total. Cohort-to-cohort wobble (55–59%) is inside the noise band; I would not read the May 25 dip as a real move. Treat this as "flat," not "declining."
- **Correlational only — this tells us *that*, not *why*.** The funnel shows seats that didn't reach a working sync. It does **not** tell us the cause. I genuinely can't distinguish, from this data alone, between "never finished setup," "set up but mapping never worked," and "was working then stopped." Those are three different problems and the funnel collapses them into one bucket.
- **Measurement window still unconfirmed.** We're using first-working-sync within the onboarding window, but we never nailed the exact window definition (this is the open TODO on the metric). Slightly different windows move the absolute number a point or two, not the flatness.

One thing I flagged but can't explain from the funnel: I found **2 established accounts** that had *cleanly activated earlier in the spring* and then went quiet — zero synced meetings for 3+ consecutive weeks — without ever showing up as a failed onboarding. They're not in the cohort table above (they activated before this window), so they don't move the %, but they're odd. Reactivation regressions like that wouldn't surface in an activation funnel at all. Not attributing anything — just noting it's unexplained and worth a look.

Net: activation is stuck at ~58%, the 80% OKR is not on track, and I can't tell you the cause from analytics. Someone needs to go talk to accounts.
