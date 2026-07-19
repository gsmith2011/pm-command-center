// Deliberate snapshot sync: copies the PM Brain workspace's in-world markdown
// into data/, which is committed. The public deploy only ever changes when this
// is run on purpose — a mid-edit workspace file never accidentally goes live.
//
// Usage: npm run sync-data [-- /path/to/workspace]   (default: ../pm-brain-workspace)
import fs from "node:fs";
import path from "node:path";
import { AREA_DIRS, ROOT_FILES } from "../src/lib/brain/workspace";

// Out-of-world scaffolding that must never reach the public demo.
// (The eval self-check log describes the demo-data setup itself — in-world it
// stays untouched; it just doesn't ship.)
const EXCLUDE = new Set(["maintenance/log/2026-07-15-eval-selfcheck.md"]);

const src = path.resolve(process.cwd(), process.argv[2] ?? "../pm-brain-workspace");
const dest = path.join(process.cwd(), "data");

if (!fs.existsSync(path.join(src, "INDEX.md"))) {
  console.error(`Not a PM Brain workspace (no INDEX.md): ${src}`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

let copied = 0;
const skipped: string[] = [];

function walk(rel: string) {
  const abs = path.join(src, rel);
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const childRel = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (rel === "" && !AREA_DIRS.includes(e.name)) continue;
      walk(childRel);
    } else if (e.name.endsWith(".md")) {
      if (rel === "" && !ROOT_FILES.includes(e.name)) continue;
      if (EXCLUDE.has(childRel)) {
        skipped.push(childRel);
        continue;
      }
      const target = path.join(dest, childRel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(src, childRel), target);
      copied++;
    }
  }
}
walk("");

fs.writeFileSync(
  path.join(dest, "sync-meta.json"),
  JSON.stringify(
    { syncedAt: new Date().toISOString(), workspaceName: path.basename(src) },
    null,
    2
  )
);

console.log(`Synced ${copied} files from ${src} -> data/`);
if (skipped.length) console.log(`Excluded (out-of-world): ${skipped.join(", ")}`);
