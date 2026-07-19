# pm-command-center — Build Plan

> A local-first, deployable web dashboard that visualizes a PM Brain workspace
> and (later) drives its Claude Code commands. Built as a portfolio artifact on
> top of [PM Brain OS](https://github.com/phuryn/pm-brain) (MIT).
>
> **This document migrates into the `pm-command-center` repo** (as `docs/PLAN.md`
> or its README) when Session B creates that repo. It lives in `.planning/` only
> until then.

## What it is

A "Command Center" for PM Brain: a polished web UI that reads the markdown
workspace and renders strategy, stakeholders, hypotheses, decisions, metrics,
and ingestion as structured views. PM Brain is deliberately headless
("everything is grep-able," no UI by design) — this is the visualization layer
it intentionally doesn't ship, built as a genuinely separate companion tool.

## Locked decisions (from the grilling session)

| # | Decision | Choice |
| --- | --- | --- |
| Q1–Q2 | Platform / data | Local web app reading a **mock company** (Flo) markdown workspace |
| Q3 | How it acts | **Shell out to the `claude` CLI** as a subprocess (Option B) — reuses the Claude Code subscription, **zero extra token/$$ cost** vs. read-only, no API key. Phased *after* read-only. |
| Q4 | Distribution | **Public read-only deploy** (static Flo snapshot, no secrets) **+ localhost-only command execution** (CLI-driving stays local, never exposed to the internet) |
| Q5 | Stack | **Next.js (React) + Tailwind + `gray-matter`**; **shadcn/ui** for components |
| Q6 | Data reads | **Hybrid**: `next dev` = live filesystem reads (localhost, reflects `/ingest` on refresh); `build`/deploy = static snapshot frozen at build time |
| Q7 | Repo | **Separate repo** (`pm-command-center`), sibling to `pm-brain-workspace`. Mirrors PM Brain's own skill-vs-workspace separation. |
| Q8 | Pages | **7 routes**: landing/mission-control homepage + 6 area pages |
| Q9 | Deploy data sync | **Manual vendor/copy script** (`npm run sync-data`) → commits a `data/` snapshot. Public demo updates only when deliberately synced. |
| Q10 | Hosting | **Vercel** (existing account; GitHub push auto-deploys) |
| Q11 | Name | **`pm-command-center`** ("PM" = the product manager, not the PM Brain brand — reads as *my* artifact built on top, not a fork) |
| Q12 | Aesthetic | ~~**Light, polished, structured-but-spacious SaaS** feel, single accent~~ → **SUPERSEDED in Session B (2026-07-18):** adopt **Linear's DESIGN.md as-is — a dark command-center system** (near-black `#010102`, four-step surface ladder, hairline borders, single lavender-indigo `#5e6ad2` accent, aggressive negative display tracking). Rationale + details in [`DESIGN-SPEC.md`](./pm-command-center-DESIGN-SPEC.md) §9. Still single coherent aesthetic, no light/dark toggle — just dark instead of light. |
| Q13 | Data source | **Parse `INDEX.md` tables** for structured/grid/kanban views; **render individual files as prose** on detail pages. Zero changes to `pm-brain-workspace` (no frontmatter added). Least fragile — leans on PM Brain's INDEX-maintenance hard rule. |
| Q16 | This plan's home | Lives in `.planning/` now; **migrates into `pm-command-center`** when created |

## Routes (7)

Mirrors the canonical-ownership table in the workspace `CLAUDE.md` — each concept
has one canonical home, each home gets one view.

| Route | Reads from | View |
| --- | --- | --- |
| `/` | all INDEX tables (cross-area) | **Mission control**: strategy-tensions banner, stakeholder friction grid, hypothesis status counts, recent decisions feed. Substantive *and* the front door — links out to the six area pages. Effectively a rendered cross-area `INDEX.md`. |
| `/strategy` | `knowledge/strategy.md` | North-star metric, quarter priorities, non-goals, tensions |
| `/stakeholders` | `stakeholders/INDEX.md` (grid) + `<slug>.md` (detail) | Roster + influence/friction grid; detail pages render prose |
| `/hypotheses` | `hypotheses/INDEX.md` (kanban) + `<slug>.md` (detail) | Status columns: active / partially-validated / promoted / demoted / archived |
| `/decisions` | `decisions/INDEX.md` + `<file>.md` | Decision log + rendered decision records |
| `/ingestion` | `ingestion/**` | Ingestion log / synthesis feed |
| `/metrics` | `knowledge/product/metrics.md` | Current metric values, watch items |

## Phasing

**Phase 1 — Read-only dashboard (ship this as a complete thing first).**
The 7 routes, reading markdown, rendered in the polished aesthetic. Deployable to
Vercel. This is the safe, demoable, screenshot-worthy portfolio artifact even if
Phase 2 never lands.

**Phase 2 — Command execution (localhost-only "dev mode").**
Buttons like "Run /review" / "Ingest this transcript" that spawn
`claude -p "/..."` as a subprocess (this is how PM Brain's own test harness works
— see `tests/harness/run_scenario.py` in the upstream repo) and stream output
into the UI. **Keep this command-agnostic** — shell out to whatever `/command` is
passed, don't hardcode the six PM Brain commands. The PM Skills Marketplace
(nascent, separate) will add commands later; a command-agnostic executor won't
need rearchitecting when that lands. Never exposed on the public deploy.

## Data snapshot for deploy (Q9)

- `npm run sync-data` copies the relevant `pm-brain-workspace` markdown into
  `pm-command-center/data/`, which is committed.
- Deploy = commit snapshot → push → Vercel builds from committed data.
- Public demo therefore only reflects **deliberate** syncs — a mid-edit Flo file
  never accidentally goes live.

## Demo state — golden-worktree reset (Q10)

- Tag the mature ~1-month Flo state in git (e.g. `demo-baseline`).
- Run **live** demos from a **separate git worktree/clone**, never the real
  working copy.
- Before each live demo: `git checkout demo-baseline -- .` (or recreate the
  worktree) to snap back to identical, reproducible state.
- Stage one "new" interview transcript **outside** the repo, ready to feed into a
  live `/ingest` — every demo performs the same rehearsed "watch it update in
  real time" moment.
- The real working repo stays available to show the accumulated outcome over time.
- *Parked for later:* a recorded screen-capture fallback in case a live `/ingest`
  misbehaves in front of someone.

## Dependencies / sequencing

- **Blocked on Session A** — the dashboard needs populated Flo data to render
  anything meaningful. Build Phase 1 only after the workspace has ~1 month of
  history (see `flo-mock-data-manifest.md`).

## Deferred / open (not decided yet — revisit when relevant)

- Phase 2 command-executor UX details (concurrency, streaming, error surfacing).
- Whether the Command Center should ever also surface the separate Obsidian vault
  (career/job-search) — out of scope for now; PM-Brain-scoped only.
- PM Skills Marketplace commands — dashboard stays command-agnostic to absorb them.

## Session B — Product/UX planning layer (started 2026-07-04, IN PROGRESS)

The decisions above are the **engineering architecture**. Session B also needs a
**product/UX design** before building — this section tracks it. Deliverable: a design
spec (via `superpowers:brainstorming` → `writing-plans`), then build.

**Locked this session:**
- **Build model: Opus 4.8.** Most capable coding model for an engineering-heavy build.
  Use the `frontend-design` skill for UI quality (matters more than a model swap). No
  reliable evidence Fable 5 is better for frontend — don't switch on a hunch.
- **Empty-state / generalizability stance: generalizable bones, Flo-flavored showcase.**
  The dashboard is workspace-agnostic (reads ANY PM Brain workspace off disk — already
  true via the Q13 INDEX-parsing decision, zero Flo-specific logic). Empty/sparse states
  are **first-class** (a fresh brain shows "no hypotheses yet — run `/hypothesize`", not
  a broken blank) — handling the zero-state well is itself a product-maturity signal and
  makes the "anyone can point this at their own brain" claim real. Demo + hero
  screenshots use Flo's rich data. **YAGNI line:** no multi-tenancy, no auth, no config
  UI — it reads one workspace, whichever it's pointed at.

**Open — 4 product/UX buckets (resume brainstorm here, one at a time):**
1. **Empty-state / generalizability detail** — how each page renders sparse vs. rich.
2. **Per-page information design** — what each of the 7 routes surfaces + hierarchy.
3. **Provenance / evidence-trail visualization — THE DIFFERENTIATOR.** How the audit
   chain (claim → tagged evidence → `source/` artifact) is surfaced; hypothesis kanban
   with confidence; stakeholder friction grid; strategy tensions; the decision record's
   evidence trail + reversal conditions. Rendering plain prose wastes the brain's value;
   this is where the design earns its keep.
4. **Phase-1 scope / YAGNI** — smallest buildable, still-demo-worthy slice.

**Sequencing:** finish the brainstorm on the 4 buckets → design spec (approved) →
`writing-plans` → build. When building, create the sibling `pm-command-center` repo and
migrate this build plan into it (Q16).
