# Lena Whitfield — RevOps Lead, second enterprise account

## Snapshot
- Role: RevOps Lead at Meridian Retail Group (second enterprise account, ~150 seats)
- Reports to / works with: Customer-side; async via `#integrations-activation`. No dedicated in-house Salesforce admin — relies on an external contractor for SFDC changes.
- Influence on my work: medium
- Friction level: medium — same role/segment family as Diego Alvarez, but leaner ops (candidate counter-persona, see [`personas.md`](../knowledge/users/personas.md)).

## What they care about
Keeping CRM sync working without owning Salesforce internals: fast new-rep time-to-value and recovery from breakage that doesn't require an admin on staff. `[2026-07-01 interview](../ingestion/interviews/2026-07-01-lena-whitfield.md)`

## Concerns / watch-outs
- Silent sync breakage she can't self-diagnose or self-fix (broke ~2 weeks after a Salesforce managed-package field-type change, no signal). `[2026-07-01 interview](../ingestion/interviews/2026-07-01-lena-whitfield.md)`
- New-rep onboarding drop-off — hires in waves, many never reach first sync; attributes it to lack of guidance, not setup complexity. `[2026-07-01 interview](../ingestion/interviews/2026-07-01-lena-whitfield.md)`

## Communication style
Direct, candid, weighs her own account's experience explicitly against others' — flagged unprompted that the fix for one segment may not serve hers. `(intuition, PM, 2026-07-01)`

## Open asks
**Raised 2026-07-01:** don't ship break-detection as notification-only — an alert alone is insufficient for admin-less teams; wants Flo to re-detect the field and offer to remap (or at minimum name the exact field to fix). `[2026-07-01 interview](../ingestion/interviews/2026-07-01-lena-whitfield.md)`

## Touchpoint log
<!-- Paths are relative to THIS file's location (stakeholders/<slug>.md). -->
- **2026-07-01** — 30-min call. Independently corroborated silent runtime sync breakage (managed-package field-type change, ~2 weeks undetected, no signal). Nuance: admin-less team can't act on a bare alert. Also surfaced onboarding drop-off as her account's larger activation drag (guidance, not setup). Ingested → [`ingestion/interviews/2026-07-01-lena-whitfield.md`](../ingestion/interviews/2026-07-01-lena-whitfield.md) (anchor: [`source/interviews/2026-07-01-lena-whitfield.md`](../source/interviews/2026-07-01-lena-whitfield.md)).

## Last touched
2026-07-01

