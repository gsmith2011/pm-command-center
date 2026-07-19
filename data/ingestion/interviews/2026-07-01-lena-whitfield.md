# Ingestion — Interview, Lena Whitfield (Meridian Retail Group)

- **Date:** 2026-07-01
- **Shape:** interview
- **Source (verbatim anchor):** [`source/interviews/2026-07-01-lena-whitfield.md`](../../source/interviews/2026-07-01-lena-whitfield.md)
- **Who:** Lena Whitfield — RevOps Lead, Meridian Retail Group (~150 seats, second enterprise account)
- **Context:** Second account-facing source in the activation investigation. First **independent** corroboration of silent field-mapping breakage — and the first real evidence for the onboarding rival. Prior sources: [`activation snapshot`](../../ingestion/adhoc/2026-06-24-renee-activation-snapshot.md), [`Diego Alvarez interview`](../../ingestion/interviews/2026-06-26-diego-alvarez.md).

## Synthesis

Lena is a genuinely **independent** second voice (different company, different RevOps maturity, different breakage trigger). She does three things at once: (1) independently corroborates silent runtime breakage, (2) supplies a **counter-persona** nuance on the *solution*, and (3) gives the **onboarding** rival its first real evidence. The synthesis must hold all three without flattening them.

### Observations (directly verifiable from the transcript)
- **[observation]** ~6 weeks ago a **Salesforce managed-package update** (a billing integration) altered field types at Meridian; Lena's team did not initiate the change. Afterward a set of reps stopped getting Flo notes into Salesforce. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** No error or warning surfaced — not to reps, not to Lena, nothing in the dashboard. She discovered it only via a manager escalation, ~2 weeks after it broke. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** Meridian has **no dedicated Salesforce admin**; Lena (RevOps, not a SFDC developer) could not fix the broken mapping herself and had to wait for an external contractor. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** Lena states a bare "your mapping is broken" alert would only *partly* help her — she'd want Flo to re-detect the field and offer to remap, or at minimum name the exact field to change; an alarm alone is insufficient for an admin-less team. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** Meridian hires reps in waves (~30 this spring). Getting new reps from "account created" to "actually syncing" is slow; many never finished and remain non-activated seats. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** Lena attributes the onboarding drop-off to **guidance, not setup complexity** — the mapping setup itself "wasn't hard" once she did it; new reps stall because they lack hand-holding and don't know what "good" looks like. `[source/interviews/2026-07-01-lena-whitfield.md]`
- **[observation]** Lena's own weighting: for Meridian, non-active seats are *more* "never got through onboarding" than "was working then broke." Breakage was dramatic; onboarding drop-off is the quiet majority of her problem. `[source/interviews/2026-07-01-lena-whitfield.md]`

### Interpretations (inference — labeled, not fact)
- **[interpretation]** Meridian and Brightline look like **two distinct segments** experiencing the same product at different pressure points: mature-RevOps/SFDC-admin-equipped (Diego) feels runtime breakage as the whole story and a bare alert suffices; lean-RevOps/no-admin (Lena) feels onboarding first and needs guided remediation. This is a segmentation read, and Lena's guess that Brightline "has a mature Salesforce org" is *her inference*, not confirmed. `(chat, no artifact)`
- **[interpretation]** The independence check holds: Diego and Lena are two different customer accounts reporting the breakage independently — legitimately two sources, NOT the same population through two channels. (The later ticket digest, by contrast, will be same-population and must not be counted as a third independent confirmation.) `(chat, no artifact)`

### Routing decisions (what this changes)
- **H-fieldmap** gains an **independent** evidence-for row anchored on Lena's *own* managed-package breakage (not on her agreement with the interviewer's summary of Diego). Now 2 independent sources → confidence raised low→medium. **Not promoted to validated** — that needs PM sign-off (escalation rule) and the Week-4 sequencing (ticket digest + eng-capacity read still pending).
- **H-onboarding** gains its **first evidence-for** row (Lena's guidance-driven new-rep drop-off). Stays low (single source).
- **H-setup** gains a second **evidence-against** row (Lena: setup itself wasn't hard; the blocker is guidance, not manual setup complexity). Weakening, kept alive.
- **insights.md**: silent-schema-change breakage crosses the promotion bar (2 independent voices) → promoted as an Active theme with 2 named evidence rows; Lena's onboarding-first weighting + admin-less solution nuance preserved under Contradictions.
- **personas.md**: lean-RevOps/no-admin segment added as a **candidate** counter-persona.

## Contradictions with prior evidence (preserved, not resolved)
- **Primary-problem disagreement:** Diego — runtime breakage is the whole story, setup was smooth, an alert is what he needs. Lena — onboarding is the bigger activation drag *for her account*, and an alert alone won't help an admin-less team. Both preserved; neither overwrites the other. This is a segmentation signal, not a conflict to resolve.

## Open question for the PM
H-fieldmap now has 2 independent sources and its written decision-trigger ("≥2 independent + material volume") is within reach. I have **not** promoted it — do you want to hold at `active/medium` through the Week-3 ticket digest and Sam's capacity read before considering `/hypothesize` → validated, or reconsider sooner? My recommendation: hold; the ticket digest is same-population (won't add independence) but the eng-capacity tradeoff isn't scoped yet, so a decision would be premature.
