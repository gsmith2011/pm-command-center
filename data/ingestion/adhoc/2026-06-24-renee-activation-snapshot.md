# Ingestion — Activation snapshot (Renee Park, analytics)

- **Date:** 2026-06-24
- **Shape:** adhoc (analytics snapshot)
- **Source (verbatim anchor):** [`source/adhoc/2026-06-24-renee-activation-snapshot.md`](../../source/adhoc/2026-06-24-renee-activation-snapshot.md)
- **Author:** Renee Park (Data/Analytics Lead)

## Synthesis

This is the **entry point** for the activation investigation. It establishes the *symptom*, not a cause. It is a **caveated watch item**, not a confidence-bearing signal on any hypothesis (correlational-vs-causal rule, `CLAUDE.md`).

### Observations (directly verifiable from the source)
- **[observation]** Integration activation is flat at **~58%** across six trailing weekly signup cohorts (Wk of May 11 → Wk of Jun 15). Per-cohort range 55–59%. `[source/adhoc/2026-06-24-renee-activation-snapshot.md]`
- **[observation]** Sample is small: N = 19–38 new seats per cohort; **163 seats aggregate, 94 activated (57.7%)**. `[source/adhoc/2026-06-24-renee-activation-snapshot.md]`
- **[observation]** The 80% Q3 OKR target ([`strategy.md`](../../knowledge/strategy.md) priority #1) is **not on track** — the trend is level, not climbing. `[source/adhoc/2026-06-24-renee-activation-snapshot.md]`
- **[observation]** Renee explicitly flags **2 established accounts** that cleanly activated earlier in spring, then went quiet (zero synced meetings 3+ consecutive weeks). They are outside the cohort window, do not move the %, and were **not attributed to any cause**. `[source/adhoc/2026-06-24-renee-activation-snapshot.md]`

### Interpretations (inference — labeled, not fact)
- **[interpretation]** The funnel structurally **cannot separate three distinct failure modes**: never-set-up, set-up-but-never-worked, and worked-then-stopped. This ambiguity is *why* the symptom cannot yet nominate a cause — and why competing explanations remain live. `(chat, no artifact)`
- **[interpretation]** The "activated-then-quiet" pattern would be invisible to an activation funnel by construction (it measures onboarding, not runtime continuity). If real, it points at a *reactivation/runtime* failure class — but this is a single unexplained anecdote (N=2), **not evidence for any hypothesis yet**. `(chat, no artifact)`

### Assumptions carried forward
- **[assumption]** Activation measurement window is first-working-sync within onboarding, but the **exact window is unconfirmed** (open TODO in [`metrics.md`](../../knowledge/product/metrics.md)). Window choice moves the absolute number ~1–2pts, not the flatness. `[source/adhoc/2026-06-24-renee-activation-snapshot.md]`

## Routing
- **Promoted:** activation-flat lands as a **caveated watch item** in [`metrics.md § Activation`](../../knowledge/product/metrics.md) with N tagged, correlational-only. No hypothesis created, no confidence bump.
- **No promotion to** `hypotheses/`, `knowledge/users/insights.md`, or `strategy.md § Tensions` this round — one correlational snapshot does not clear the promotion bar, and no cause is named.

## Open question for the PM
The symptom is defined but not diagnosed. Next step is direct account evidence (interviews) to discriminate between the three failure modes the funnel collapses. No cause should be inferred from this snapshot alone.
