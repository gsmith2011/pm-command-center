import fs from "node:fs";
import path from "node:path";
import type { SyncMeta } from "./types";

// Areas the dashboard reads. Anything else (`.planning/`, `.claude/`, dotfiles)
// is out-of-world scaffolding and never parsed.
export const AREA_DIRS = [
  "knowledge",
  "hypotheses",
  "decisions",
  "stakeholders",
  "ingestion",
  "source",
  "maintenance",
  "rules",
  "docs",
];

export const ROOT_FILES = ["INDEX.md", "README.md", "PORTFOLIO.md", "CLAUDE.md"];

/**
 * Resolve the workspace root:
 * - BRAIN_DIR env (dev): live filesystem reads of a real PM Brain workspace.
 * - ./data (deploy): the committed snapshot produced by `npm run sync-data`.
 */
export function workspaceRoot(): string {
  if (process.env.BRAIN_DIR) {
    return path.resolve(process.cwd(), process.env.BRAIN_DIR);
  }
  return path.join(process.cwd(), "data");
}

export function readSyncMeta(root: string): SyncMeta {
  if (process.env.BRAIN_DIR) {
    return { syncedAt: null, live: true, workspaceName: path.basename(root) };
  }
  try {
    const raw = fs.readFileSync(path.join(root, "sync-meta.json"), "utf8");
    const parsed = JSON.parse(raw);
    return {
      syncedAt: typeof parsed.syncedAt === "string" ? parsed.syncedAt : null,
      live: false,
      workspaceName:
        typeof parsed.workspaceName === "string" ? parsed.workspaceName : null,
    };
  } catch {
    return { syncedAt: null, live: false, workspaceName: null };
  }
}

/** All markdown files in the workspace, as workspace-relative posix paths. */
export function listMarkdownFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (rel: string) => {
    const abs = path.join(root, rel);
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const childRel = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        // only walk known areas from the root; walk everything below them
        if (rel === "" && !AREA_DIRS.includes(e.name)) continue;
        walk(childRel);
      } else if (e.name.endsWith(".md")) {
        if (rel === "" && !ROOT_FILES.includes(e.name)) continue;
        out.push(childRel);
      }
    }
  };
  walk("");
  return out.sort();
}

export function readFileRaw(root: string, relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

export function exists(root: string, relPath: string): boolean {
  return fs.existsSync(path.join(root, relPath));
}

/** Resolve a relative markdown link from `fromFile` to a workspace-relative path. */
export function resolveLink(fromFile: string, href: string): string | null {
  if (!href || /^(https?:|mailto:)/.test(href)) return null;
  const [target] = href.split("#");
  if (!target) return null; // pure fragment link
  const fromDir = path.posix.dirname(fromFile);
  const resolved = path.posix.normalize(path.posix.join(fromDir, target));
  if (resolved.startsWith("..")) return null; // points above the workspace
  return resolved;
}

/** Top-level area of a workspace-relative path ("hypotheses", "knowledge", …). */
export function areaOf(relPath: string): string {
  const first = relPath.split("/")[0];
  return first.endsWith(".md") ? "root" : first;
}

/** YYYY-MM-DD prefix of a `YYYY-MM-DD-slug.md` filename, if present. */
export function dateFromFilename(relPath: string): string | null {
  const base = path.posix.basename(relPath, ".md");
  const m = base.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

export function slugFromFilename(relPath: string): string {
  const base = path.posix.basename(relPath, ".md");
  return base.replace(/^\d{4}-\d{2}-\d{2}-?/, "") || base;
}
