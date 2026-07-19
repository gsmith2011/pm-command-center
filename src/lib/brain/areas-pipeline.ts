// Parsers for the raw layer + maintenance + the command registry.
import path from "node:path";
import type { Artifact, Command, MaintenanceLog, SourceKind } from "./types";
import { listItemsRaw, parseMd, sections, stripComments, toText } from "./md";
import { outboundLinks } from "./links";
import { dateFromFilename, slugFromFilename } from "./workspace";

type Exists = (p: string) => boolean;

function h1Title(md: string, fallback: string): string {
  const line = md.split("\n").find((l) => l.startsWith("# "));
  return line ? toText(parseMd(line)) : fallback;
}

const KINDS: SourceKind[] = ["interviews", "meetings", "market", "adhoc"];

export function parseArtifact(
  filePath: string,
  md: string,
  exists: Exists
): Artifact | null {
  const parts = filePath.split("/");
  const layer = parts[0] as "source" | "ingestion";
  if (layer !== "source" && layer !== "ingestion") return null;
  const kind = parts[1] as SourceKind;
  if (!KINDS.includes(kind)) return null; // skip INDEX.md and unknown dirs
  const routed =
    layer === "ingestion"
      ? outboundLinks({ path: filePath, md }, exists).filter(
          (l) =>
            l.path !== filePath &&
            ["hypotheses", "knowledge", "stakeholders", "decisions"].includes(l.area)
        )
      : [];
  const counterpart =
    layer === "ingestion"
      ? filePath.replace(/^ingestion\//, "source/")
      : filePath.replace(/^source\//, "ingestion/");
  return {
    layer,
    kind,
    date: dateFromFilename(filePath),
    slug: slugFromFilename(filePath),
    title: h1Title(md, path.posix.basename(filePath, ".md")),
    path: filePath,
    md,
    sourcePath: exists(counterpart) ? counterpart : null,
    routedTo: routed,
  };
}

export function parseMaintenanceLog(filePath: string, md: string): MaintenanceLog {
  return {
    slug: path.posix.basename(filePath, ".md"),
    date: dateFromFilename(filePath),
    title: h1Title(md, path.posix.basename(filePath, ".md")),
    path: filePath,
    md,
    sections: sections(md, 2).map((s) => ({ title: s.title, md: stripComments(s.md) })),
  };
}

/**
 * The command registry, parsed from `INDEX.md § Quick triggers`.
 * Command-agnostic by construction: whatever commands the workspace lists, render.
 */
export function parseCommands(indexMd: string): Command[] {
  const sec = sections(indexMd, 2).find((s) => /quick triggers/i.test(s.title));
  if (!sec) return [];
  const out: Command[] = [];
  for (const item of listItemsRaw(sec.md)) {
    // `- `/ingest interview <file>` — process a customer interview transcript`
    const m = item.match(/^`([^`]+)`\s*[—–-]\s*([\s\S]+)$/);
    if (!m) continue;
    const command = m[1].trim();
    out.push({
      command,
      name: command.split(/\s/)[0],
      description: m[2].trim(),
    });
  }
  return out;
}
