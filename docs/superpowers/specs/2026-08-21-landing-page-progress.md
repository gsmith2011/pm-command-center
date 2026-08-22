# Landing page — progress & handoff

**Updated:** 2026-08-22
**Branch:** `landing-page` (8 commits ahead of `main`; **not pushed, not deployed**)
**Design spec:** [2026-08-21-landing-page-refresh-design.md](./2026-08-21-landing-page-refresh-design.md)

## Where to begin (new session)
The public marketing landing page is **built, iterated three times, and verified**, living on
the `landing-page` branch. It is **not pushed and not deployed** — production is gated on the
owner's explicit approval. The immediate open decisions are: (1) push the branch + open a PR,
and (2) the eventual Vercel production deploy. Everything else is optional polish.

Run it: `npm run dev`, then open `http://localhost:3000/` (landing) and `/overview` (the app).

## What's built
- A marketing landing page at **`/`** (route group `src/app/(marketing)/`), rendered **without**
  the app shell. The app's Overview moved to **`/overview`**; all other app routes unchanged.
  Routing lives in `src/app/(app)/` (wrapped by `(app)/layout.tsx` → `<Shell>`); root
  `layout.tsx` is slim.
- **Identity = "reconciled middle":** light surface, but shares the app's brand tokens —
  **Geist** font, **lavender accent** (`#5e6ad2` / text `#4954bd`), Linear semantic palette.
  All landing styles are `lp-` prefixed and scoped to `.lp` (`landing.css`), so nothing leaks
  into the app.
- **Sections (top → bottom):** hero with a self-assembling "Monday Brief" product visual →
  problem-led clarity band → honest credibility band → **3-act narrative** ("Bring the whole
  picture together" / "Keep every claim honest" / "Start the week a step ahead") with real
  mini-visuals (sources-unify graphic, evidence for/against card, influence×friction matrix) →
  `BRAIN_DIR` usage note → trust (3 principles) → FAQ → dark CTA panel → slim credit line.
- **Interactions:** scroll reveals, the brief assembly (scan → type → items, with regenerate),
  cursor-spotlight on the act rows. All `prefers-reduced-motion`-guarded.

## Verified
- `next build` passes (97/97 pages), ESLint clean, no runtime console errors (dev-only HMR
  socket noise aside). Re-verified 2026-08-22 after the design-review fixes below.
- **WCAG AA** across the light palette — measured on the running app (CTAs 6.39, act text 6.22,
  semantic tags ≥4.5). `--ink-faint` was `#6b7180` = 4.88 on white but only **4.40 on the tinted
  `--surface-2`** (below AA for the 10–11.5px labels that sit on it); darkened to `#636978`
  (4.95 on surface-2 / 5.49 on white) in the 2026-08-22 pass.
- **Real 375–390px mobile:** no horizontal overflow, nav fixed, every section stacks cleanly.

## Design-review pass — 2026-08-22 (ui-ux-pro-max)
End-to-end review against the `ui-ux-pro-max` skill (page maps to its **Trust & Authority +
Funnel-3-step** landing pattern and **Swiss/minimal, clean-white, single-accent** style rec for a
markdown/dev tool — both confirmed a good fit). Four fixes applied:
1. **FAQ entity bug (real defect):** the "What's it built on?" question was a bare JS string
   containing `&rsquo;`, so it rendered the literal `What&rsquo;s it built on?`. Replaced with a
   real apostrophe. It was the *only* such case — all other `&entity;` usages are in JSX or set
   via `innerHTML` and decode fine. `LandingClient.tsx`.
2. **Faint contrast → AA:** `--ink-faint` darkened `#6b7180` → `#636978` (see Verified). `landing.css`.
3. **Hero "more below" cue:** added a decorative, `aria-hidden`, motion-guarded down-chevron
   (`Ic.chev` + `.lp-hero-cue`) below the hero — the skill's hero rule flags "don't hide the next
   content cue"; the first fold previously ended flat on the assurance row. Hidden when the hero
   stacks (<940px). `LandingClient.tsx` + `landing.css`.
4. **Mobile nav touch target:** the "Live demo" button was ~34px tall; added `min-height: 44px`
   (+ padding) to clear the 44×44 minimum. `landing.css`.

Reviewed but **not** changed (owner's call): CTA label repeats identically 4× / no GitHub CTA in
nav; desktop `<h1>` wraps to 4 lines; the 28px regen button in the brief card is still under 44px
(scoped out — it's a desktop-hover affordance).

## Commit history (on `landing-page`, newest first)
- design-review pass: FAQ entity fix, faint→AA on surface-2, hero scroll cue, mobile nav touch
  target (this commit; also carries this doc update)
- `fc0b905` docs: landing page progress + handoff
- `3ee4d74` mobile pass + credibility band + motion polish
- `824873e` v2: problem-led hero, 3-act narrative, denser + de-slopped
- `33c7c3b` polish: fix CTA contrast, de-slop, balance, clarity
- `90b6265` full build (reconciled-middle identity)
- `3a84d15` scaffold: route groups, landing at `/`, overview → `/overview`
  — **note:** also carries the plain-language **README rewrite** (bundled here, not its own commit)
- `7b02196` spec
- (`main` tip `0825d86` = readability pass, already merged via PR #1)

## Locked decisions
- Landing at `/`; reconciled-middle identity; **no invented social proof** (attribution +
  honest credibility chips only); no footer link-columns; headline = "See where your product
  thinking stands, on one screen."; problem-led framing grounded in PM Brain's own language
  (context scattered across docs/Slack/folders).
- Product-screenshot idea (a framed shot of `/overview`) was **deliberately deferred**.

## Open items / next steps (priority order)
1. **Push `landing-page` + open a PR** (production stays gated at the `main` merge). A branch
   push *may* trigger a Vercel **preview** if the GitHub repo has a Vercel integration —
   unconfirmed from the CLI.
2. **Production deploy** to Vercel — hold for the owner's explicit go.
3. Optional polish still on the table: a real product screenshot below the hero; further
   copy tuning; the owner is the quality bar and has iterated hard, so expect more feedback.
4. **Pre-deploy chore:** auto-generate a `THIRD-PARTY-LICENSES.md` (deps embed in the built
   bundle). Not required for a source repo; do it at deploy time.

## Gotchas / lessons
- **Preview pane quirks (in-tool browser):** it renders scrolled content as a black frame —
  use a *tall viewport* (`resize_window` to e.g. 1300×5200) to capture the whole page in one
  top-anchored shot; it also throttles `setTimeout`/`rAF`, so the brief assembly looks "stuck"
  there but is fine in a real browser. Verify state via `javascript_tool` DOM queries, not just
  screenshots. It now *does* honor an explicit narrow width (390) for real mobile checks.
- **CSS specificity trap:** `.lp a { color: inherit }` (0,1,1) silently overrode button/link
  colors (0,1,0). Any new `.lp` link/button that sets a color needs `.lp .lp-x` or `.lp a.lp-x`
  specificity. This caused the original unreadable-CTA bug.
- **Dev/build interaction:** running `next build` while `npm run dev` is live can disrupt the
  dev server (shared `.next`); restart dev after a build. Kill stragglers with
  `pkill -9 -f "next dev"; pkill -9 -f "next-server"` then free `:3000`.
- **Pre-existing build warning** (`next.config.ts` NFT file-tracing) comes from the brain parser
  reading the markdown workspace — unrelated to the landing page, harmless.
- The **`ui-ux-pro-max`** skill (design intelligence: palettes, font pairings, UX guidelines) is
  now installed — useful for further UI review/polish.

## Key files
- `src/app/(marketing)/page.tsx` — server component, metadata, imports the CSS.
- `src/app/(marketing)/LandingClient.tsx` — the whole page (client island: reveals, brief
  assembly, spotlight).
- `src/app/(marketing)/landing.css` — all `lp-`-prefixed styles + the light token scope.
- `src/app/(app)/layout.tsx` — renders `<Shell>` for app routes.
- `src/components/shell.tsx` — app sidebar; home links point to `/overview`.
