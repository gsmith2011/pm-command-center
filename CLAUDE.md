# CLAUDE.md — PM Command Center

A local-first Next.js dashboard that reads a [PM Brain](https://github.com/phuryn/pm-brain)
workspace (plain markdown — hypotheses, decisions, stakeholders, strategy) and renders it as
one legible screen. Read-only: it never modifies a workspace.

## How it reads data
- **Default:** reads the committed snapshot in `data/` — this is what the public Vercel deploy serves.
- **Live dev mode:** set `BRAIN_DIR=../your-workspace` in `.env.local` to read a real workspace off disk.
- `npm run sync-data` copies a live workspace into `data/` as a deliberate, committed snapshot.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (prerenders every page from `data/`)
- `npm run sync-data` — refresh the committed snapshot

## Architecture
The parser in `src/lib/brain/` reads markdown structure directly (no frontmatter, no database).
Files are the source of truth; INDEX drift is surfaced as a health finding, not silently fixed.
Build/deploy decisions and deferred work: see `implementation-notes.md`.
