# Landing page refresh — design spec

**Date:** 2026-08-21
**Status:** approved (brainstorm), implementation in progress
**Branch:** `landing-page`

## Goal
Ship a public marketing landing page as the front door to PM Command Center — the
first screen at the live URL. It must make three things unmistakable within one scroll:
**what the product is**, **the value/problem it solves**, and **how to use it**. Loosely
follows the checklist.design landing-page checklist.

## Confirmed decisions
- **Home path:** landing lives at `/`. The app's Overview moves to `/overview`. All other
  app routes (`/loop`, `/hypotheses`, …) keep their URLs.
- **Identity — "reconciled middle":** a *light*, calm marketing page that shares brand
  tokens with the app — **Geist** font, **lavender accent** (`--color-accent #5e6ad2`),
  and **Linear semantic palette** (`--color-sem-*`) — on a light surface ladder. No dark
  canvas; no teal/Fraunces (the earlier artifact identity is dropped).
- **Social proof:** none invented. Attribution micro-copy only: "Built on PM Brain OS".
- **No footer link-columns.** End with the closing CTA + a single slim credit/disclosure
  line.
- **Do not deploy to production until user approval.** Branch + PR + Vercel *preview* are
  fine; merging to `main` (production) waits for sign-off.

## Architecture / routing
Next App Router **route groups** so the marketing page and the app don't share chrome:
- `src/app/(app)/…` — all current pages, wrapped by `(app)/layout.tsx` which renders
  `<Shell>` (sidebar + top bar). Overview becomes `(app)/overview/page.tsx` → `/overview`.
- `src/app/(marketing)/page.tsx` — the landing page, with `(marketing)/layout.tsx`: a bare
  layout, no Shell, light surface scoped to its wrapper (overrides the global dark `body`).
- Root `layout.tsx` slims to `html`/`body`/fonts/`TipProvider` only (Shell removed).
- Update the two in-app home links (`shell.tsx` logo + nav "Overview") from `/` → `/overview`.

Light theming: `globals.css` keeps the app dark. The marketing wrapper carries a
`data-site="marketing"` scope that redefines surface/ink tokens to a light ladder and paints
its own background, so the page holds regardless of the global dark `body`.

## Content structure (→ checklist mapping)
1. **Hero** — headline (what it is), subhead, one primary CTA, live "Monday Brief" as hero
   visual, assurance row, "Built on PM Brain OS" pill. *(headline / subhead / hero visual / CTA)*
2. **What this is** — problem→solution clarity band. *(clarity ask #1, #2)*
3. **Key benefits** — 3 outcome-framed. *(benefits)*
4. **Surfaces** — bento of 6; includes the fixed stakeholder matrix. *(benefits)*
5. **How it works** — 5-stage loop + `BRAIN_DIR` usage note. *(clarity ask #3 / objection: complexity)*
6. **Trust principles** — 4. *(objection: is it safe)*
7. **FAQ** — 5 Qs. *(objection handling)*
8. **Closing CTA** — repeated primary action. *(repeated CTA)*
9. **Slim credit line** — "Built on PM Brain OS · Demo data is fictional (Flo)". *(attribution)*

Final copy for all sections is captured in the implementation plan / PR; see conversation
copy deck v1 (2026-08-21). Lead headline: "See where your product thinking stands, on one
screen."

## Specific fixes
- **Stakeholder matrix:** real 2×2 with labeled axes (Influence ↕ × Friction ↔), quadrant
  labels, 3–4 nodes placed meaningfully, legend. Not decorative.
- **CTA focus:** one primary action, repeated; secondaries are text links.

## Definition of done (launch criteria)
- All checklist items present and honest; the 3 clarity asks each unmistakable in one scroll.
- Responsive verified at 375 / 768 / 1280.
- Light-theme WCAG AA contrast verified (measured).
- `next build` passes, ESLint clean, zero console errors.
- Vercel **preview** URL opens on the landing page; CTAs point to `/overview` (the app).
- "Built on PM Brain OS" + fictional-Flo disclosure present.
- Production deploy gated on user approval.

## Out of scope
- The app's dark-tone / light-theme redesign (parked).
- Third-party license manifest (pre-deploy to-do, auto-generated when we deploy).
