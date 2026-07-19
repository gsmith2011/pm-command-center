import { visit } from "unist-util-visit";
import type { Link } from "mdast";
import type { Backlink, LinkRef } from "./types";
import { parseMd, toText } from "./md";
import { resolveLink, areaOf } from "./workspace";

export interface FileDoc {
  path: string;
  md: string;
  title: string;
}

/** All outbound in-workspace links of a file, with display labels. */
export function outboundLinks(
  doc: Pick<FileDoc, "path" | "md">,
  fileExists: (p: string) => boolean
): LinkRef[] {
  const root = parseMd(doc.md);
  const out: LinkRef[] = [];
  const seen = new Set<string>();
  visit(root, "link", (node: Link) => {
    const resolved = resolveLink(doc.path, node.url);
    if (!resolved || !resolved.endsWith(".md")) return;
    if (seen.has(resolved)) return;
    seen.add(resolved);
    out.push({
      path: resolved,
      label: toText(node) || resolved,
      area: areaOf(resolved),
      exists: fileExists(resolved),
    });
  });
  // bare-bracket citations (`[source/x.md]`) count as outbound references too
  for (const m of doc.md.matchAll(/\[((?:ingestion|source)\/[^\]\n]+\.md)\](?!\()/g)) {
    const p = m[1];
    if (!seen.has(p)) {
      seen.add(p);
      out.push({ path: p, label: p, area: areaOf(p), exists: fileExists(p) });
    }
  }
  return out;
}

/** target path -> who cites it, with a short plain-text context per citation. */
export function buildBacklinks(docs: FileDoc[]): Record<string, Backlink[]> {
  const map: Record<string, Backlink[]> = {};
  for (const doc of docs) {
    const root = parseMd(doc.md);
    const lines = doc.md.split("\n");
    const seenTargets = new Set<string>();
    const add = (target: string, line: number | null) => {
      if (target === doc.path || seenTargets.has(target)) return;
      seenTargets.add(target);
      let context = "";
      if (line != null && lines[line - 1]) {
        context = toText(parseMd(lines[line - 1]));
        if (context.length > 180) context = context.slice(0, 177) + "…";
      }
      (map[target] ??= []).push({
        fromPath: doc.path,
        fromTitle: doc.title,
        fromArea: areaOf(doc.path),
        context,
      });
    };
    visit(root, "link", (node: Link) => {
      const resolved = resolveLink(doc.path, node.url);
      if (resolved && resolved.endsWith(".md")) {
        add(resolved, node.position?.start.line ?? null);
      }
    });
    // bare-bracket citations, found per line for context
    lines.forEach((lineText, i) => {
      for (const m of lineText.matchAll(/\[((?:ingestion|source)\/[^\]\n]+\.md)\](?!\()/g)) {
        add(m[1], i + 1);
      }
    });
  }
  return map;
}
