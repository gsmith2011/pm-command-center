# Strategy

> The north star. Loaded at the start of any prioritization, planning, or review task. Updated only deliberately — drift is surfaced, not silently absorbed.

## North-star metric
Weekly active meetings processed per paying seat. Company-wide north star — measures whether Flo is actually doing the work (processing calls) for the seats customers pay for. `(stakeholder-verbal, PM interview, 2026-06-24)`

## 1–2 quarter priorities
<!-- 3 max. Ordered. Each with: what, why now, what success looks like. -->
1. **Increase integration activation rate from 58% to 80% by Q3.** Why now: this is the current OKR and the primary lever for retention — reps only stay active if Flo updates their CRM without extra steps. Success: activation rate at or above 80% by end of Q3, measured in Amplitude.
2. **Deeper Salesforce integration.** Why now: Salesforce is the dominant CRM among mid-market/enterprise targets; integration depth directly drives activation (#1) and is a prerequisite for Enterprise tier. Success: reduced manual field-mapping setup time, fewer sync errors logged in Zendesk.
3. **Reduce time-to-value for new accounts.** Why now: supports both the Enterprise tier launch and retention — slow time-to-value compounds the activation problem for every new cohort. Success: shorter median time from signup to first successful CRM sync.

## Explicit non-goals
<!-- What we are deliberately NOT doing this period. This is the most valuable section. -->
- Not actively scoping AI-generated deal summaries this window, despite it being a stated 2026 priority — deprioritized behind activation work given shared eng capacity. See `§ Tensions` below.
- Not treating Enterprise tier launch as a near-term commitment yet — it's being scoped, not built, and competes with #1/#2 for the same engineers.

## Bets vs. commitments
- **Bets** (testing): see [`hypotheses/`](../hypotheses/)
- **Commitments** (decided): see [`decisions/`](../decisions/)

## Last reviewed
2026-06-24 — initial brain setup.

## Tensions
<!-- Maintenance and ingestion append here when signals conflict with the strategy. Tensions are not rejections — new bets, features, opportunities, and user needs can inform strategy just as strategy informs them. Each entry: signal, what it tensions, possible resolutions (update strategy / reject signal / hold as open tension). PM resolves deliberately. -->

### T1: Resourcing conflict across 2026 strategic priorities
- **Signal:** Leadership's full 2026 priority list includes Enterprise tier launch and AI-generated deal summaries, alongside the activation-rate OKR and deeper Salesforce integration. `(stakeholder-verbal, PM interview, 2026-06-24)`
- **What it tensions:** All four initiatives draw on the same 4-person integrations engineering team (Sam Okafor's team). The top-3 priorities above implicitly deprioritize Enterprise tier and AI deal summaries, but leadership has not formally signed off on that deprioritization.
- **Possible resolutions:** (a) get explicit leadership sign-off that Enterprise tier / AI deal summaries are Later, not Next; (b) add headcount to integrations eng; (c) hold as open tension until Q3 OKR result is known.
- **Update 2026-07-14 — now decision-linked and time-boxed:** Decision [`2026-07-14-sync-health-detection-v1`](../decisions/2026-07-14-sync-health-detection-v1.md) commits (on direction) to sync-health detection v1, which requires freeing ~1 engineer-month by deprioritizing **deeper-Salesforce depth work OR Enterprise-tier scoping** — which one is this tension's open question. Marcus Chen is actively pushing Enterprise (opinion-tier, [`2026-07-11 Slack`](../ingestion/adhoc/2026-07-11-marcus-chen-slack.md)). The decision **self-supersedes if leadership does not approve a deprioritization (or funds neither track) by 2026-07-28.**
- **Status:** open — **escalation now urgent** (forcing date 2026-07-28). Raise with Marcus Chen / Jordan Reyes immediately; Jordan is untouched and on the critical path.
