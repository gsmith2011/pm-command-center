# PHASE-2-PLAN — command execution (localhost-only)

> **Who this is for:** an Opus/Sonnet Claude Code session executing steps in order.
> Each step is self-contained: files to touch, what to write, and a definition of
> done you can verify with a command. Do NOT skip DoD checks. Do NOT start a step
> until the previous step's DoD passed.
>
> **What Phase 2 is:** buttons/inputs in the dashboard that run PM Brain commands
> (`/review`, `/ingest …`, or anything else) by shelling out to the **`claude` CLI**
> as a subprocess in the workspace directory, streaming output into the UI, then
> refreshing the (live-filesystem) views so the PM watches the brain update.
>
> **Hard constraints (from the locked build plan — do not relitigate):**
> - **Localhost-only.** Execution must be impossible on the public Vercel deploy.
>   Triple guard: dev-mode check, BRAIN_DIR check, request-host check.
> - **Command-agnostic.** Never hardcode the six PM Brain commands. The input is a
>   free-form `/command` string; the registry (parsed from the workspace `INDEX.md`)
>   only *prefills* it. PM Skills commands must work with zero code changes.
> - **$0.** The `claude` CLI uses the user's existing subscription. No API keys,
>   no usage-billed services, no new paid dependencies.
> - **Never edit** the PM Brain workspace from dashboard code. Only the spawned
>   `claude` process writes to it (that's the whole point — the real workflow runs).
> - **Read-only surfaces stay read-only.** No optimistic UI writes; after a run
>   completes, re-read from disk (`router.refresh()`), so the UI only ever shows
>   what's actually in the files.

## Architecture (agreed, don't redesign)

```
Browser (client component RunConsole)
  │  POST /api/run  {command: "/review"}        ← fetch with streaming response
  ▼
Next.js route handler (dev server only)
  │  guards: NODE_ENV==="development" && BRAIN_DIR && host is localhost
  │  lock: one run at a time (in-memory)
  ▼
spawn("claude", ["-p", command, "--dangerously-skip-permissions"], { cwd: BRAIN_DIR })
  │  stdout/stderr chunks → ReadableStream → browser
  ▼
on exit: client calls router.refresh() → live FS reads re-render every surface
```

Notes for the implementer:
- `claude -p "<prompt>"` is print mode: runs the prompt non-interactively in the
  workspace and exits. The command string (e.g. `/review`) is passed **as one
  argv element** — never through a shell, never string-interpolated.
- `--dangerously-skip-permissions` is required for unattended writes. That is
  acceptable ONLY because this runs on the PM's own machine against their own
  workspace, started by their own click. Document this in the UI ("runs with
  write access to your workspace").
- If the `claude` binary isn't on PATH, surface the error verbatim in the console
  output — don't silently fail.

---

## Step 1 — Config plumbing & the execution guard

**Files:** `src/lib/exec/guard.ts` (new)

Write a pure function the API route and the UI both use:

```ts
export function execAllowed(): { allowed: boolean; reason: string } {
  if (process.env.NODE_ENV !== "development")
    return { allowed: false, reason: "Command execution only exists in `next dev`." };
  if (!process.env.BRAIN_DIR)
    return { allowed: false, reason: "No live workspace — BRAIN_DIR is not set (snapshot mode)." };
  return { allowed: true, reason: "" };
}
```

**DoD:** `npx tsc --noEmit` passes. Unit sanity: `BRAIN_DIR= npx tsx -e 'import {execAllowed} from "./src/lib/exec/guard"; console.log(execAllowed())'` prints `allowed: false`.

## Step 2 — API route with guards, no spawning yet

**Files:** `src/app/api/run/route.ts` (new)

`POST` handler:
1. Call `execAllowed()`; if not allowed → `Response` 403 with the reason.
2. Host check: `new URL(request.url).hostname` must be `localhost` or `127.0.0.1`; else 403.
3. Parse JSON body `{ command: string }`. Validate: non-empty, `command.trim().startsWith("/")`, length ≤ 500, single line (no `\n`). Reject otherwise with 400 and a plain-language message. (This is input hygiene, not command whitelisting — stay command-agnostic.)
4. For now return `new Response("guards ok: " + command, { status: 200 })`.

**DoD:** With dev server running (`BRAIN_DIR=../pm-brain-workspace npm run dev`):
`curl -s -X POST localhost:3000/api/run -H 'content-type: application/json' -d '{"command":"/review"}'` → `guards ok: /review`. And `curl -s -X POST -d '{"command":"rm -rf /"}' …` → 400 (doesn't start with `/`). Then `BRAIN_DIR= npm run build` still succeeds and the route returns 403 in `npm start` (production) mode.

## Step 3 — Spawn + streaming (echo first, then claude)

**Files:** `src/app/api/run/route.ts` (extend), `src/lib/exec/lock.ts` (new)

1. `lock.ts`: module-level `let running: string | null`; `acquire(cmd)` returns false if busy; `release()`. (Good enough — one dev server, one PM.)
2. In the route: if `!acquire(command)` → 409 "A command is already running: <cmd>".
3. Spawn (Node runtime, add `export const runtime = "nodejs"`):
   ```ts
   import { spawn } from "node:child_process";
   const child = spawn("claude", ["-p", command, "--dangerously-skip-permissions"], {
     cwd: path.resolve(process.cwd(), process.env.BRAIN_DIR!),
     env: { ...process.env },
   });
   ```
4. Return a `ReadableStream` Response: enqueue stdout and stderr chunks as they arrive (prefix stderr chunks with `[stderr] `), plus a final `\n--- exit ${code} ---\n` line. `release()` on close/error. Kill the child if the request aborts (`request.signal.addEventListener("abort", () => child.kill("SIGTERM"))`).
5. **Test with echo first:** temporarily spawn `["echo", ...]`... no — keep it real but cheap: DoD uses a harmless command.

**DoD:** `curl -N -s -X POST localhost:3000/api/run -H 'content-type: application/json' -d '{"command":"/strategy-check"}'` streams output progressively (you see text before the request ends) and ends with `--- exit 0 ---`. A second concurrent curl gets 409. `git -C ../pm-brain-workspace status` afterward: if the command wrote files, that's expected and fine — but **reset nothing yourself**; leave workspace changes for the PM to review. If `claude` is not installed, the stream must contain the spawn error text instead of hanging.

## Step 4 — RunConsole client component

**Files:** `src/components/run-console.tsx` (new, `"use client"`)

A collapsible bottom drawer (fixed, right-aligned, above the canvas, Linear-styled:
`bg-surface-1`, hairline border, mono text):
- Input: free text, must start with `/`. Submit on Enter. Disabled while running.
- Output area: `<pre>` with streamed text (use `fetch` + `res.body.getReader()`,
  append decoded chunks to state; auto-scroll to bottom).
- States: idle → running (spinner + the command shown) → done (exit line) / error.
- On successful completion: `router.refresh()` (from `next/navigation`) so every
  server component re-reads the live workspace. Show a one-line hint: "surfaces
  refreshed from disk".
- A small "stop" button while running: `AbortController.abort()`.
- Render **nothing at all** unless a `enabled` prop is true.

**DoD:** `npx tsc --noEmit` + `npx eslint src` clean. Manual: run `/strategy-check`
from the drawer, watch streaming output, see the exit line, and confirm a
workspace change (e.g. after an `/ingest`) appears in the UI after refresh
without a manual reload.

## Step 5 — Wire into the shell + Loop page

**Files:** `src/components/shell.tsx`, `src/app/loop/page.tsx`

1. In `Shell` (server component): compute `const exec = execAllowed()` and render
   `<RunConsole enabled={exec.allowed} />` once, outside `<main>`. When not
   allowed, nothing renders — the public deploy stays visually identical.
2. Loop page command registry: each command card gets a "run" affordance ONLY in
   exec mode — pass `exec.allowed` down; clicking prefills the RunConsole input
   with `c.command`'s literal string minus placeholder args (e.g. `/prep ` for
   `/prep <stakeholder-slug>` — strip `<...>` tokens, keep the prefix; the PM
   completes the args). Implementation: RunConsole subscribes to a tiny client
   event (`window.dispatchEvent(new CustomEvent("run-prefill", {detail}))`) fired
   by a small client wrapper on the card — keep it simple, no state library.
3. Sidebar footer: in exec mode show "live workspace · execution enabled" with a
   tooltip noting the localhost-only guarantee.

**DoD:** In dev: drawer present, prefill works from /loop, running `/review`
updates the Review page after refresh. In `BRAIN_DIR= npm run build && npm start`:
`grep -c run-console` on the rendered HTML of `/` is 0 (component renders nothing),
`/api/run` returns 403.

## Step 6 — Docs + notes

**Files:** `README.md`, `implementation-notes.md`

1. README: move "Command execution" from *Planned* to *Built (localhost-only)*,
   with two sentences on the guard story and one screenshot/GIF if easy.
2. `implementation-notes.md`: append any deviations taken during Steps 1–5 to the
   Deviations table (e.g. flag choice differences if the `claude` CLI args needed
   adjusting), and remove F1 from Deferred.

**DoD:** Both files updated; `npx eslint src` and `BRAIN_DIR= npm run build` still clean.

## Step 7 — Final verification sweep (fresh context if possible)

Run these and record results:
1. `BRAIN_DIR= npm run build` → zero errors; `npm start` → `/api/run` 403; no drawer in HTML.
2. Dev mode: `/api/run` with a non-`/` command → 400; concurrent run → 409; abort kills the child (`ps` shows no orphan `claude`).
3. `git -C ../pm-brain-workspace status --porcelain` contains only changes made by commands the operator deliberately ran (never by dashboard code).
4. Grep check: `grep -rn "ingest\"\|/review\"" src/app/api src/lib/exec` shows no hardcoded command names in the execution path.

**DoD:** All four pass. Commit with a message listing them. STOP — do not deploy
anything; execution never ships to Vercel by design.

---

## Explicitly out of scope for Phase 2 (don't gold-plate)

- Multi-run queueing, run history persistence, or a jobs table.
- Parsing/structuring the CLI's output beyond raw text (the workspace files are
  the structured result; the UI re-reads them).
- Auth of any kind (localhost-only is the security model).
- Exposing execution on any deployed environment, behind any flag. No.
