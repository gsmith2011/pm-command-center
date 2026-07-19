import type { ProvenanceTag, SourceKind, EvidenceRow } from "./types";
import { resolveLink } from "./workspace";
import { toText, parseMd } from "./md";

const KINDS: SourceKind[] = ["interviews", "meetings", "market", "adhoc"];

function kindOf(path: string): SourceKind | null {
  const seg = path.split("/")[1];
  return (KINDS as string[]).includes(seg) ? (seg as SourceKind) : null;
}

function pathTag(
  fromFile: string,
  target: string,
  raw: string,
  fileExists: (p: string) => boolean
): ProvenanceTag | null {
  const resolved = resolveLink(fromFile, target) ?? target.split("#")[0];
  if (!resolved) return null;
  const area = resolved.startsWith("ingestion/")
    ? "ingestion"
    : resolved.startsWith("source/")
      ? "source"
      : null;
  if (!area) return null;
  return {
    kind: "path",
    area,
    path: resolved,
    sourceKind: kindOf(resolved),
    resolved: fileExists(resolved),
    raw,
  };
}

function parentheticalTag(raw: string): ProvenanceTag | null {
  const m = raw.match(
    /^\(\s*(stakeholder-verbal|intuition|industry-knowledge|chat)\b\s*,?\s*([^)]*)\)$/i
  );
  if (!m) return null;
  const kind = m[1].toLowerCase();
  const rest = m[2].trim();
  if (kind === "stakeholder-verbal") {
    const parts = rest.split(",").map((s) => s.trim());
    const date = parts.find((p) => /^\d{4}-\d{2}-\d{2}$/.test(p)) ?? null;
    const name = parts.filter((p) => p !== date && p !== "").join(", ") || "unnamed";
    return { kind: "stakeholder-verbal", name, date, raw };
  }
  if (kind === "intuition") {
    const date = rest.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
    return { kind: "intuition", date, raw };
  }
  if (kind === "industry-knowledge") return { kind: "industry-knowledge", raw };
  return { kind: "chat", raw };
}

// Matches, anywhere in a row (each optionally wrapped in backticks):
//  1. [label](target)              — markdown link into ingestion/ or source/
//  2. [ingestion/x.md] / [source/x.md] — bare-bracket citation with no target
//  3. (stakeholder-verbal, …) (intuition, …) (industry-knowledge) (chat, …)
const TAG_RE =
  /`?\[([^\]\n]+)\]\(([^)\n]+)\)`?|`?\[((?:ingestion|source)\/[^\]\n]+\.md)\](?!\()`?|`?(\(\s*(?:stakeholder-verbal|intuition|industry-knowledge|chat)\b[^)]*\))`?/gi;

export interface TagScan {
  tags: ProvenanceTag[];
  /** the row markdown with *trailing* tags stripped (mid-text citations stay) */
  displayMd: string;
}

/** Find all provenance tags in a row; strip the trailing ones from display. */
export function scanTags(
  md: string,
  fromFile: string,
  fileExists: (p: string) => boolean
): TagScan {
  const tags: ProvenanceTag[] = [];
  const matches: { start: number; end: number; tag: ProvenanceTag }[] = [];
  for (const m of md.matchAll(TAG_RE)) {
    const full = m[0];
    const linkTarget = m[2];
    const barePath = m[3];
    const parenthetical = m[4];
    let tag: ProvenanceTag | null = null;
    if (linkTarget !== undefined) {
      tag = pathTag(fromFile, linkTarget, full, fileExists);
      // a plain link that doesn't point into ingestion/source is not a tag
    } else if (barePath !== undefined) {
      tag = pathTag(fromFile, barePath, full, fileExists);
    } else if (parenthetical !== undefined) {
      tag = parentheticalTag(parenthetical);
    }
    if (tag) {
      tags.push(tag);
      matches.push({ start: m.index!, end: m.index! + full.length, tag });
    }
  }
  // strip only tags sitting at the tail of the row (possibly several, whitespace/punct separated)
  let display = md;
  let cut = md.length;
  for (let i = matches.length - 1; i >= 0; i--) {
    const between = md.slice(matches[i].end, cut);
    if (/^[\s.;,·—-]*$/.test(between)) {
      cut = matches[i].start;
    } else break;
  }
  display = md.slice(0, cut).replace(/[\s·—-]+$/, "").trim();
  return { tags, displayMd: display || md.trim() };
}

/** Build an EvidenceRow (claim + tags + orphan flag) from a raw bullet. */
export function evidenceRow(
  md: string,
  fromFile: string,
  fileExists: (p: string) => boolean
): EvidenceRow {
  const { tags, displayMd } = scanTags(md, fromFile, fileExists);
  return {
    md: displayMd,
    text: toText(parseMd(displayMd)),
    tags,
    orphan: tags.length === 0,
  };
}

/** `_(none yet)_` and similar empty markers are not claims. */
export function isEmptyMarker(md: string): boolean {
  return /^_?\(?\s*none(\s+yet)?\s*\)?_?$/i.test(md.trim());
}
