# Ingestion — Slack claim, Marcus Chen (competing Enterprise-tier priority)

- **Date:** 2026-07-11
- **Shape:** adhoc (Slack message — stakeholder competing-priority claim)
- **Source (verbatim anchor):** [`source/adhoc/2026-07-11-marcus-chen-slack.md`](../../source/adhoc/2026-07-11-marcus-chen-slack.md)
- **From:** Marcus Chen — Head of Sales (high influence)
- **Context:** The other side of the T1 tradeoff, made concrete right before a `/decide` on sync-health detection. Marcus pushes to put Sam's integrations team on Enterprise tier this quarter. Captured as opinion-tier pressure, scanned against higher-confidence sources.

## Synthesis

This is a **stakeholder opinion**, not evidence. The message is written (so it's source-preserved as an audit anchor), but its content is Marcus's in-passing assertion with no supporting data. Per the evidence hierarchy in `CLAUDE.md` (explicit decisions > strategy > direct customer evidence > analytics > **stakeholder opinions** > market signals), it does **not** override the strategy priorities or the direct customer evidence behind the activation work. It is preserved as real leadership pressure feeding **T1** — held, not resolved.

### Observations (directly verifiable from the message)
- **[observation]** Marcus reports Vantage Group + two other six-figure enterprise deals are stalling on missing SSO/SAML and granular admin roles; Vantage procurement asked directly. `[source/adhoc/2026-07-11-marcus-chen-slack.md]`
- **[observation]** Marcus asks to put the integrations team on Enterprise tier this quarter, characterizing activation/sync-mapping work as "polishing the base" / "plumbing." `[source/adhoc/2026-07-11-marcus-chen-slack.md]`
- **[observation]** He frames Enterprise as "the story the board wants" and warns Vantage is drifting toward Gong; asks to talk before the quarter's eng plan is locked. `[source/adhoc/2026-07-11-marcus-chen-slack.md]`

### Interpretation & counter-evidence scan
- **[interpretation]** Marcus's core claim — "Enterprise is where the real growth is, activation is polishing the base" — is an **unsubstantiated opinion** (no pipeline value, win-rate, or ARR-at-risk figures attached). Tag downstream as `(stakeholder-verbal, Marcus Chen, 2026-07-11)` — medium trust, opinion-tier. `(stakeholder-verbal, Marcus Chen, 2026-07-11)`
- **[interpretation]** It **conflicts with two higher-confidence sources**, so it does not get to silently win:
  - `strategy.md` makes integration activation the #1 Q3 priority/OKR and explicitly lists Enterprise tier as *being scoped, not built* (a stated non-goal this window). Marcus's ask would invert that ordering. `[knowledge/strategy.md](../../knowledge/strategy.md)`
  - Direct customer evidence (Diego, Lena, ticket digest) shows activation/retention actively bleeding via silent breakage — a concrete, evidenced loss — whereas the Enterprise claim is an asserted opportunity with no numbers. Direct customer evidence outranks stakeholder opinion. `(chat, no artifact)`
- **[interpretation]** This is exactly the leadership pressure T1 anticipated ("leadership has not formally signed off on the deprioritization"). It makes T1 *live* rather than theoretical — but resolving T1 (and any `strategy.md` edit) is a deliberate Week-4 step requiring leadership sign-off, per PM instruction. Not done here. `(chat, no artifact)`

### Routing decisions
- **Stakeholder** → [`stakeholders/marcus-chen.md`](../../stakeholders/marcus-chen.md): position on Enterprise + "let's talk before you lock the eng plan" ask logged; touchpoint + last-touched set.
- **No hypothesis created** — an opinion pushing a priority is not a testable belief about the product; Enterprise tier is not entered as a hypothesis.
- **strategy.md / T1** → **not touched.** T1's substance now spans this note + Sam's 1:1 + Marcus's file; the formal T1 resolution waits for leadership sign-off (Week 4 `/review`).
- **No confidence changes** to any activation hypothesis — this input speaks to *priority contention*, not to whether field-mapping breakage is real.
- **Feeds the `/decide`** — becomes a named entry in the decision's "competing considerations / what we're trading against," tagged opinion-tier.

## Contradictions with prior evidence (preserved, not resolved)
- **Marcus (Enterprise-first) vs. strategy + customer evidence (activation-first).** Preserved as the T1 tension. Both are real: Marcus's enterprise-pipeline concern is a genuine business signal (just unquantified), and the activation evidence is concrete and customer-sourced. The decision should *acknowledge* Marcus's tradeoff explicitly and route the resolution to leadership, not pretend consensus.

## Open question for the PM
Everything for the `/decide` is now assembled, including the concrete competing priority. Recommend: `/hypothesize sync-field-mapping-breakage` to formally adjudicate the rivals and mark field-mapping ready for promotion, then `/decide`. Want me to hold for your `/hypothesize` invocation? (No further inputs needed — Input set is complete at 7.)
