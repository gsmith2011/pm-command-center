# Ingestion — Interview, Nadia Osei (Tandem Software)

- **Date:** 2026-07-03
- **Shape:** interview
- **Source (verbatim anchor):** [`source/interviews/2026-07-03-nadia-osei.md`](../../source/interviews/2026-07-03-nadia-osei.md)
- **Who:** Nadia Osei — Head of Revenue, Tandem Software (~45 seats, mid-market B2B SaaS; no dedicated ops/SFDC staff)
- **Context:** Third account-facing source. A smaller/earlier-stage account whose failure is *pre-activation* (onboarding stall), giving the onboarding rival its independent 2nd source — and floating a pricing signal that resolves as noise. Prior sources: [`snapshot`](../../ingestion/adhoc/2026-06-24-renee-activation-snapshot.md), [`Diego`](../../ingestion/interviews/2026-06-26-diego-alvarez.md), [`Lena`](../../ingestion/interviews/2026-07-01-lena-whitfield.md).

## Synthesis

Nadia's account is the cleanest test of the onboarding rival: Tandem mostly **never activated in the first place** (~6 of 30+ reps), so it is *silent* on runtime field-mapping breakage (nothing broke because nothing started). That silence is a feature — it means this source supports onboarding without falsely inflating field-mapping.

### Observations (directly verifiable from the transcript)
- **[observation]** ~6 of 30+ Tandem reps ever became active; the rest "bounced off in the first week or two" during the setup/first-run flow. `[source/interviews/2026-07-03-nadia-osei.md]`
- **[observation]** Nadia explicitly frames it as *never started*, not *worked-then-broke*: "Nothing broke because nothing ever really started for them." `[source/interviews/2026-07-03-nadia-osei.md]`
- **[observation]** Reps hit the multi-step first-run flow (connect calendar, connect Salesforce, confirm mapping) with no hand-holding, got confused, and abandoned; the reps who did complete it are fine and don't complain. `[source/interviews/2026-07-03-nadia-osei.md]`
- **[observation]** At the Salesforce field-mapping step specifically, Nadia watched two non-admin reps give up on a screen-share — "no idea which Salesforce field was which… that's an admin question and they're not admins." `[source/interviews/2026-07-03-nadia-osei.md]`
- **[observation]** Nadia's CFO questioned paying for 30+ seats when ~6 are used; she reports price "only feels bad because the value isn't there yet… fix activation and the price conversation goes away." `[source/interviews/2026-07-03-nadia-osei.md]`

### Interpretations (inference — labeled, not fact)
- **[interpretation]** Nadia shares the lean/no-admin/non-technical profile of the counter-persona seeded from Lena — but Tandem never reached runtime, so the *breakage/remediation* facet doesn't apply to her; her whole problem is getting reps from signup to first sync without hand-holding. This broadens the persona around a shared trait (lean ops → activation-without-hand-holding is the primary pain) rather than the breakage facet. `(chat, no artifact)`
- **[interpretation]** Her Salesforce-field-mapping-step confusion is *setup-stage* friction (never completed), distinct from Diego/Lena's *runtime* breakage (completed, then broke). Same "Salesforce fields are confusing" surface, two different failure stages — do not merge them. `(chat, no artifact)`

### Pricing signal — weighed and SET ASIDE (red herring, not a cause)
- **[interpretation]** Pricing surfaced but resolves as **displaced frustration downstream of low activation**, not an independent driver: Nadia herself says the price only stings because value isn't landing, and would "not blink at the price" if her reps were active. Pricing is not a Flo strategy lever (absent from `strategy.md`). Recorded, not flattened; **not** promoted to a hypothesis. Preserved durably under `insights.md § Retired / weighed-and-set-aside` so it isn't re-litigated. `(chat, no artifact)`

### Routing decisions
- **H-onboarding** gains an independent 2nd evidence-for row (Tandem) → confidence low→medium; its "need an onboarding-primary account" caveat is now satisfied.
- **H-setup** gains its **first** evidence-for row (the field-mapping *setup* step confused non-admin reps) → moves off 0-for; stays low (1-for / 2-against).
- **insights.md**: onboarding-stall promoted as an Active theme (2 independent sources); pricing recorded as set-aside.
- **personas.md**: counter-persona broadened (lead with shared lean/no-admin trait; breakage/remediation demoted to a facet for larger lean accounts) and promoted candidate→active on 2 independent accounts (Lena + Nadia); noted Nadia hasn't hit breakage so that facet isn't overstated.
- **New stakeholder**: `stakeholders/nadia-osei.md` created; INDEX row added; structural note in maintenance log.

## Contradictions / tensions (preserved)
- The investigation now has **two medium-confidence rivals both real**: field-mapping runtime breakage (Diego + Lena) AND onboarding stall (Lena + Nadia). They are **not mutually exclusive** — both depress activation, in different segments/stages. Source-count alone no longer separates them; adjudication now needs volume/materiality + the funnel-stage question + eng-capacity, not more anecdotes.

## Open question for the PM
Field-mapping and onboarding are now *both* at medium/2-independent-sources. The tie-breaker for what to `/decide` is no longer "which is real" but "which is the higher-leverage, more-tractable bet" — which needs (a) Renee funnel-stage segmentation (how much activation loss is never-started vs. worked-then-broke) and (b) Sam's eng-capacity read. Recommend both before `/hypothesize` → `/decide`. Do you want me to queue a funnel-segmentation ask to Renee alongside the Sam 1:1?
