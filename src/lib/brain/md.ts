import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString as mdToString } from "mdast-util-to-string";
import type { Root, RootContent, Heading, List, ListItem } from "mdast";

const processor = unified().use(remarkParse).use(remarkGfm);

export function parseMd(md: string): Root {
  return processor.parse(md) as Root;
}

export function toText(node: unknown): string {
  return mdToString(node as Parameters<typeof mdToString>[0]).trim();
}

function offsetOf(node: RootContent, which: "start" | "end"): number | null {
  return node.position?.[which]?.offset ?? null;
}

/** Raw markdown of a node, sliced from the original source. */
export function rawOf(node: RootContent, source: string): string {
  const s = offsetOf(node, "start");
  const e = offsetOf(node, "end");
  if (s == null || e == null) return "";
  return source.slice(s, e);
}

export interface Section {
  title: string;
  depth: number;
  /** markdown content between this heading and the next heading of depth <= this */
  md: string;
  /** offset range of the content (after the heading line) */
  start: number;
  end: number;
}

/** Split a document into sections at the given heading depth. */
export function sections(source: string, depth: number): Section[] {
  const root = parseMd(source);
  const out: Section[] = [];
  const nodes = root.children;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.type !== "heading" || (n as Heading).depth !== depth) continue;
    const title = toText(n);
    const start = offsetOf(n, "end");
    if (start == null) continue;
    // find the next heading at depth <= depth
    let end = source.length;
    for (let j = i + 1; j < nodes.length; j++) {
      const m = nodes[j];
      if (m.type === "heading" && (m as Heading).depth <= depth) {
        const s = offsetOf(m, "start");
        if (s != null) end = s;
        break;
      }
    }
    out.push({ title, depth, md: source.slice(start, end).trim(), start, end });
  }
  return out;
}

export function findSection(
  secs: Section[],
  pattern: RegExp
): Section | undefined {
  return secs.find((s) => pattern.test(s.title));
}

/** Top-level bullet items of the first list(s) in a markdown fragment, as raw markdown. */
export function listItemsRaw(fragment: string): string[] {
  const root = parseMd(fragment);
  const out: string[] = [];
  for (const child of root.children) {
    if (child.type !== "list") continue;
    for (const item of (child as List).children as ListItem[]) {
      // strip the leading marker from the raw slice by re-serializing children
      const raw = rawOf(item, fragment)
        .replace(/^[-*+]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        // de-indent continuation lines
        .split("\n")
        .map((l) => l.replace(/^ {2,4}/, ""))
        .join("\n")
        .trim();
      if (raw) out.push(raw);
    }
  }
  return out;
}

/** First paragraph of a fragment (raw markdown). */
export function firstParagraphRaw(fragment: string): string | null {
  const root = parseMd(fragment);
  for (const child of root.children) {
    if (child.type === "paragraph") return rawOf(child, fragment).trim();
  }
  return null;
}

/**
 * Bullet fields like `- **Origin:** proactive` or `- Feature: x` or `- Status: active`.
 * Returns a case-insensitive key -> raw value map from every bullet matching `Key: value`.
 */
export function fieldMap(fragment: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of listItemsRaw(fragment)) {
    const firstLine = item.split("\n")[0];
    const m = firstLine.match(/^\*{0,2}([A-Za-z][A-Za-z /-]{1,40}?)\*{0,2}\s*:\*{0,2}\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const rest = item.slice(firstLine.indexOf(m[2]) === -1 ? firstLine.length : 0);
    // value = remainder of first line + any continuation lines
    const value = (m[2] + (item.includes("\n") ? "\n" + item.split("\n").slice(1).join("\n") : ""))
      .trim();
    if (!map.has(key)) map.set(key, value);
    void rest;
  }
  return map;
}

/** Remove HTML comments (schema guidance) so they never render. */
export function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, "").trim();
}

/** First YYYY-MM-DD found in a string. */
export function firstDate(s: string | null | undefined): string | null {
  if (!s) return null;
  const m = s.match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}

/** Normalize an enum-ish value: first word, lowercased, stripped of markup. */
export function enumValue(s: string | null | undefined): string | null {
  if (!s) return null;
  const cleaned = s.replace(/[`*_]/g, "").trim();
  const m = cleaned.match(/^([a-zA-Z-]+)/);
  return m ? m[1].toLowerCase() : null;
}
