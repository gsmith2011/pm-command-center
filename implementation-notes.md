# Implementation notes

Working log for the Phase-1 build. Two sections: **Deviations** (where the build
departs from the written plan, with the reasoning) and **Deferred** (known
cuts, with where they'd land later).

## Deviations

| # | Plan said | Built | Why |
|---|---|---|---|
| D1 | Q13: "parse `INDEX.md` tables" for grids/kanban | Area files are parsed directly (markdown AST, tolerant per-schema extractors); INDEXes are cross-checked and INDEX-vs-file drift renders as a health finding | Only `stakeholders/INDEX.md` is actually a table; the hypothesis/decision INDEXes are annotated bullet lists, `ingestion/INDEX.md` is documentation, and the workspace's own history shows INDEX claims can drift from reality. Files as source of truth is the only honest read. *(Approved at sign-off.)* |
| D2 | Q5: `gray-matter` for parsing | `unified`/`remark` AST + structure extraction | No file in the workspace has YAML frontmatter; statuses live in prose (`Status: promoted (2026-07-14) — …`). gray-matter had nothing to parse. *(Approved at sign-off.)* |
| D3 | Q5: "shadcn/ui for components" | Radix primitives (tooltip/dialog/popover/tabs) + `cmdk` + hand-rolled components following shadcn conventions (`cn`-style composition, Tailwind v4 tokens) | The Linear token system needed full control of surfaces/hairlines; pulling shadcn's generated components would have meant restyling everything anyway. The stack remains Tailwind + Radix, i.e. shadcn-compatible. |
| D4 | Spec §6: "initiative → feature → risk area" hierarchy | Feature → risk area → hypothesis; strategy-priority linkage shown instead | "Initiative" is not a concept the brain has — the 1:1 principle wins. *(User decision #2.)* |
| D5 | Q12 (superseded in Session B): light SaaS | Linear DESIGN.md dark system, as re-decided | Session B already superseded this; noting for the record. Font: Geist Sans/Mono (npm package) rather than Inter — the spec names Geist as a sanctioned substitute, and the npm package removes the Google-Fonts network dependency from builds. |
| D6 | — | `routedTo` (ingestion fan-out) is derived from **backlinks** (who cites the artifact), unioned with forward links | Ingestion records don't link forward to every file they updated; the durable files cite the artifact. Citation-proven routing is the honest direction and matches the audit-trail semantics. |
| D7 | — | `maintenance/log/2026-07-15-eval-selfcheck.md` is excluded by `sync-data` from the public snapshot (see `scripts/sync-data.ts` EXCLUDE) | It's out-of-world scaffolding committed in-world; it would break the fourth wall on the public demo. The workspace file itself is untouched; live/dev mode still shows it. *(User decision #1.)* |
| D8 | — | Detail routes set `dynamicParams = false`; `next.config.ts` traces `data/**` into server output | A frozen-snapshot deploy should never render an unknown slug at runtime; the 404 path still renders the layout (which reads the snapshot), so the data ships with the function. |

## Deferred

| # | What | Where it lands |
|---|---|---|
| F1 | Command execution from the dashboard (run `/review` etc.) | Phase 2 — localhost-only, shells out to the `claude` CLI, command-agnostic. See `PHASE-2-PLAN.md`. |
| F2 | Full-text / fuzzy search with filters | Later. Phase-1 ⌘K is deliberately title/name-only. *(User decision #3.)* |
| F3 | Git-derived timeline enrichment (commit events joined to file events) | Later. The file-derived event stream covers Phase 1; git history would add ordering confidence and per-file diffs. |
| F4 | Mobile navigation (sidebar collapse / hamburger) | Later. The dashboard is a desktop command-center first; content grids collapse responsively but the sidebar is fixed-width. |
| F5 | Curated surfaces for `rules/` and `docs/` areas | Later, if ever — both render fine through the universal `/files/*` viewer today. |
| F6 | Rendered markdown for `#fragment` deep links into file sections | Later. Cross-links with fragments resolve to the target page top. |
| F7 | OG/social images and screenshot automation | Ship-prep may add manual screenshots to the README; automated OG images are gold-plating for now. |
