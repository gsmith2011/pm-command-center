# PM Command Center

A dashboard for a [PM Brain](https://github.com/phuryn/pm-brain) — it reads a folder of
plain-markdown product thinking (beliefs, evidence, decisions, disagreements) and lays it
out as one legible screen, so you can take in the whole picture instead of piecing it
together file by file.

![Mission control — what needs you, what's moving](docs/media/overview.png)

> **Demo data disclosure:** the workspace shown everywhere here — "Flo," its customers,
> metrics, and stakeholders — is **fictional**, built to demonstrate the system in
> realistic use. No real company or customer data appears in this repo. The dashboard
> itself is workspace-agnostic: point it at any PM Brain folder and it renders that.

## The problem

PM Brain is deliberately headless: your strategy, hypotheses, decision records, and
interview evidence live as markdown in a repo, operated through Claude Code commands.
That's the right storage model — inspectable, versioned, no lock-in — but reading the
*state of your own thinking* means walking directories and diffing your memory against
INDEX files. The system runs on a loop (ingest → synthesize → propagate → tag → sweep),
and none of that motion is visible in a file tree.

## What it does

- **Makes the loop visible.** A dedicated view shows the five-stage cycle with live
  counts, and lets you follow any single artifact through it: verbatim source →
  synthesized record → every file it actually changed, each hop a real citation.
- **Makes claims walkable.** Every evidence row wears a typed provenance chip
  (synthesized record / raw source / heard verbally / PM intuition / industry background
  / chat-only / **untagged**). Click a chip, land on the artifact, see who else cites it.
- **Keeps disagreement visible.** Evidence-for and evidence-against render as two sides;
  preserved contradictions stay two-sided; a rejected explanation stays on the page with
  its revival condition, so it isn't re-litigated.
- **Elevates reversal conditions.** Decision records show "what would reverse this" as a
  first-class panel with forcing dates — including the decided-but-blocked nuance in the
  record's own words.
- **Watches health continuously.** The weekly sweep's checks (staleness, decision debt,
  relationship cadence, link rot, untagged claims, INDEX drift) are recomputed from the
  files on every load. Drift between an index and its files is *surfaced*, not silently
  fixed — same ethos as the brain itself.
- **Renders honestly at every fill level.** Empty areas answer three questions: what
  lives here, why it's empty, and the command that fills it. A pointer to a file that
  doesn't exist yet renders as exactly that.

More screens: [the loop](docs/media/loop.png) ·
[hypothesis detail](docs/media/hypothesis-detail.png) ·
[decision record](docs/media/decision-detail.png) ·
[stakeholder grid](docs/media/stakeholders.png)

## Quick start

```bash
npm install
npm run dev
```

That runs against the committed demo snapshot in `data/`. To point it at your own
PM Brain workspace instead:

```bash
echo 'BRAIN_DIR=../your-pm-brain-workspace' > .env.local
npm run dev
```

In `BRAIN_DIR` mode reads are live — run `/ingest` or `/review` in your workspace,
refresh, and watch the surfaces update. Deploys never read live: `npm run sync-data`
copies the workspace into `data/` as a deliberate, committed snapshot, and all relative
times on the deployed site anchor to that sync date.

## How it reads the files

No frontmatter, no sidecar database, no changes to the workspace. The parser
(`src/lib/brain/`) reads the brain's own conventions from markdown structure: schema
sections, status lines, the six provenance tag shapes (including backtick-wrapped and
bare-bracket citations), and relative links. From those it derives the link/backlink
graph, a dated event stream (ingests, promotions, decisions, sweeps), and the health
findings. Anything it can't parse structurally still renders as prose through a
universal file viewer, so no file in the workspace is unreachable.

## Decisions & tradeoffs

- **Files are the source of truth, not INDEXes.** The original plan was to parse
  `INDEX.md` tables. On contact with real data, only one area actually keeps a table —
  and the workspace's own history shows INDEX entries drifting from files. So the parser
  reads the files and *renders* INDEX drift as a health finding. Tradeoff: more parser
  surface to maintain, in exchange for never presenting stale rosters as truth.
- **The event stream is derived from dated facts in files, not git.** Git history would
  give richer ordering, but it isn't available on a deployed snapshot and not every
  workspace has clean history. Filename dates + promotion/decision/sweep dates cover the
  need with zero dependencies. I'd revisit git enrichment if per-file diffs become worth
  showing.
- **The dashboard never computes a verdict.** Chips are typed by *source*, confidence
  comes only from the files, and a correlational watch item stays labeled correlational.
  It would be easy to score "evidence strength" — and it would break the system's core
  contract that the human sees the inputs, not an opinion laundered through a UI.
- **Read-only in Phase 1, on purpose.** Acting on the brain (running commands from the
  dashboard) is planned as localhost-only Phase 2 ([PHASE-2-PLAN.md](PHASE-2-PLAN.md)) —
  execution never ships to the public deploy.

## Built vs. planned

| | Status |
|---|---|
| All read surfaces: overview, loop, hypotheses, decisions, stakeholders, knowledge areas, ingestion feed, review/health, artifact viewer | **Built** |
| Provenance chips, walkable audit trail, backlinks, contested evidence, reversal conditions, always-on health checks, event stream | **Built** |
| Empty-state handling for sparse/greenfield workspaces | **Built** |
| ⌘K jump (titles/names only) | **Built** — basic by design |
| Command execution from the dashboard (`/review`, `/ingest`, …) — localhost-only, shells out to the `claude` CLI, command-agnostic | **Planned** — [PHASE-2-PLAN.md](PHASE-2-PLAN.md) |
| Full-text search, git-derived timeline, mobile nav | Not planned for now — see [implementation-notes.md](implementation-notes.md) |

## Known limits

- Desktop-first: content grids collapse responsively, but the sidebar doesn't yet.
- Search is jump-to-anything by title/name — no full-text, no filters.
- The public deploy is a frozen snapshot; it only changes when `sync-data` is run and
  committed, which is a feature, but means the demo isn't "live" in the streaming sense.

## Stack & credits

Next.js (App Router) · Tailwind v4 · Radix primitives + cmdk · unified/remark ·
Geist. Visual language follows [Linear](https://linear.app)'s dark design system.
Built on top of [PM Brain OS](https://github.com/phuryn/pm-brain) by Paweł Huryn (MIT) —
the dashboard is a companion viewer, not a fork; it never modifies a workspace.

MIT — see [LICENSE](LICENSE).
