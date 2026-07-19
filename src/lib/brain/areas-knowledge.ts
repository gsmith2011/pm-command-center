// Parsers for the durable layer: knowledge/ (strategy, users, product, market, org).
import path from "node:path";
import type {
  Contradiction,
  EvidenceRow,
  Feature,
  Insights,
  InsightTheme,
  KnowledgeStub,
  LinkRef,
  MetricStage,
  Metrics,
  Persona,
  RetiredTheme,
  RoadmapBucket,
  Strategy,
  Tension,
} from "./types";
import {
  fieldMap,
  firstDate,
  firstParagraphRaw,
  listItemsRaw,
  parseMd,
  sections,
  stripComments,
  toText,
} from "./md";
import { evidenceRow, scanTags } from "./provenance";
import { outboundLinks } from "./links";

type Exists = (p: string) => boolean;

function h1Title(md: string, fallback: string): string {
  const line = md.split("\n").find((l) => l.startsWith("# "));
  return line ? toText(parseMd(line)) : fallback;
}

export function parseStrategy(filePath: string, md: string): Strategy {
  const secs = sections(md, 2);
  const sec = (re: RegExp) => secs.find((s) => re.test(s.title));
  const tensionsSec = sec(/^tensions/i);
  const tensions: Tension[] = [];
  if (tensionsSec) {
    for (const t of sections(tensionsSec.md, 3)) {
      const m = t.title.match(/^(T\d+)\s*:?\s*(.*)$/);
      const fields = fieldMap(t.md);
      const updates: Tension["updates"] = [];
      for (const item of listItemsRaw(t.md)) {
        const um = item.match(/^\*\*Update\s+(\d{4}-\d{2}-\d{2})[^*]*\*\*\s*:?\s*([\s\S]*)$/i);
        if (um) updates.push({ date: um[1], md: um[2].trim() });
      }
      // a forcing/deadline date: the latest date mentioned in Update/Status lines
      const statusMd = fields.get("status") ?? "";
      const forcing =
        firstDate(statusMd) ??
        (updates.length ? firstDate(updates[updates.length - 1].md) : null);
      tensions.push({
        id: m?.[1] ?? t.title,
        title: m?.[2] ?? t.title,
        md: stripComments(t.md),
        status: fields.get("status") ?? null,
        updates,
        forcingDate: forcing,
      });
    }
  }
  return {
    path: filePath,
    northStar: sec(/^north-star/i) ? stripComments(sec(/^north-star/i)!.md) : null,
    priorities: sec(/quarter priorities/i)
      ? listItemsRaw(stripComments(sec(/quarter priorities/i)!.md))
      : [],
    nonGoals: sec(/non-goals/i) ? listItemsRaw(stripComments(sec(/non-goals/i)!.md)) : [],
    lastReviewed: firstDate(sec(/^last reviewed/i)?.md),
    tensions,
  };
}

export function parseInsights(filePath: string, md: string, exists: Exists): Insights {
  const secs = sections(md, 2);
  const sec = (re: RegExp) => secs.find((s) => re.test(s.title));

  const themes: InsightTheme[] = [];
  const active = sec(/^active themes/i);
  if (active) {
    for (const t of sections(active.md, 3)) {
      const fields = fieldMap(t.md);
      const evidence: EvidenceRow[] = fields.get("evidence")
        ? listItemsRaw(fields.get("evidence")!).map((r) => evidenceRow(r, filePath, exists))
        : [];
      themes.push({
        title: t.title,
        md: stripComments(t.md),
        promotedDate: firstDate(firstParagraphRaw(t.md)),
        evidence,
        relevance: fields.get("relevance") ?? null,
      });
    }
  }

  const contradictions: Contradiction[] = [];
  const contra = sec(/^contradictions/i);
  if (contra) {
    for (const c of sections(contra.md, 3)) {
      const sides: Contradiction["sides"] = [];
      let whyPreserved: string | null = null;
      for (const item of listItemsRaw(c.md)) {
        const sideMatch = item.match(/^\*\*(Side [^:*]+|[^:*]{0,40}?)\s*:?\*\*\s*:?\s*([\s\S]*)$/);
        if (!sideMatch) continue;
        const label = sideMatch[1].trim();
        const body = sideMatch[2].trim();
        if (/^why preserved/i.test(label)) {
          whyPreserved = body;
        } else if (/^side/i.test(label)) {
          const { tags, displayMd } = scanTags(body, filePath, exists);
          sides.push({ label, md: displayMd, tags });
        }
      }
      contradictions.push({
        title: c.title,
        md: stripComments(c.md),
        sides,
        whyPreserved,
      });
    }
  }

  const retired: RetiredTheme[] = [];
  const ret = sec(/^retired/i);
  if (ret) {
    for (const r of sections(ret.md, 3)) {
      retired.push({
        title: r.title,
        md: stripComments(r.md),
        date: firstDate(r.title) ?? firstDate(firstParagraphRaw(r.md)),
      });
    }
  }

  return { path: filePath, themes, contradictions, retired };
}

export function parsePersonas(md: string): Persona[] {
  const out: Persona[] = [];
  for (const sec of sections(md, 2)) {
    if (!/personas/i.test(sec.title)) continue;
    for (const p of sections(sec.md, 3)) {
      const fields = fieldMap(p.md);
      // status often lives in the heading: "… — `active`"
      const headingStatus = p.title.match(/[—–-]\s*`?(active|candidate|retired)`?\s*$/i);
      out.push({
        title: p.title.replace(/\s*[—–-]\s*`?(active|candidate|retired)`?\s*$/i, ""),
        status: headingStatus?.[1]?.toLowerCase() ?? fields.get("status")?.split(/[\s—]/)[0].toLowerCase() ?? null,
        md: stripComments(p.md),
        lastRevised: firstDate(fields.get("last revised")),
      });
    }
  }
  return out;
}

export function parseMetrics(filePath: string, md: string): Metrics {
  const secs = sections(md, 2);
  const sec = (re: RegExp) => secs.find((s) => re.test(s.title));
  const stages: MetricStage[] = [];
  const aarrr = sec(/^aarrr/i);
  if (aarrr) {
    for (const s of sections(aarrr.md, 3)) {
      const fields = fieldMap(s.md);
      const watch: string[] = [];
      const other: string[] = [];
      for (const item of listItemsRaw(s.md)) {
        if (/^\*\*watch item/i.test(item)) watch.push(item);
        else if (!/^(current|definition|source)\s*:/i.test(item.replace(/\*/g, ""))) other.push(item);
      }
      stages.push({
        name: s.title,
        current: fields.get("current") ?? null,
        definition: fields.get("definition") ?? null,
        source: fields.get("source") ?? null,
        watchItems: watch,
        otherMd: other,
      });
    }
  }
  return {
    path: filePath,
    northStar: sec(/^north-star/i) ? stripComments(sec(/^north-star/i)!.md) : null,
    stages,
    otherTracked: sec(/^other tracked/i) ? listItemsRaw(sec(/^other tracked/i)!.md) : [],
    recentMovements: sec(/^recent movements/i)
      ? listItemsRaw(stripComments(sec(/^recent movements/i)!.md))
      : [],
  };
}

export function parseFeature(filePath: string, md: string): Feature {
  const slug = path.posix.basename(filePath, ".md");
  const secs = sections(md, 2);
  const meta = secs.find((s) => /^meta$/i.test(s.title));
  const fields = meta ? fieldMap(meta.md) : new Map<string, string>();
  return {
    slug,
    title: h1Title(md, slug),
    path: filePath,
    owner: fields.get("owner") ?? null,
    status: fields.get("status") ?? null,
    priority: fields.get("priority") ?? null,
    lastUpdated: firstDate(fields.get("last updated")),
    sections: secs
      .filter((s) => !/^meta$/i.test(s.title))
      .map((s) => ({ title: s.title, md: stripComments(s.md) })),
  };
}

export function parseRoadmap(filePath: string, md: string, exists: Exists): RoadmapBucket[] {
  const out: RoadmapBucket[] = [];
  for (const sec of sections(md, 2)) {
    const items = listItemsRaw(stripComments(sec.md)).map((item) => ({
      md: item,
      links: outboundLinks({ path: filePath, md: item }, exists) as LinkRef[],
    }));
    out.push({ name: sec.title, items });
  }
  return out;
}

/** Generic knowledge file (market/org/segments): title + sections, rendered as prose. */
export function parseKnowledgeStub(filePath: string, md: string): KnowledgeStub {
  const secs = sections(md, 2);
  return {
    area: filePath.split("/").slice(0, 2).join("/"),
    path: filePath,
    title: h1Title(md, path.posix.basename(filePath, ".md")),
    sections: secs.length
      ? secs.map((s) => ({ title: s.title, md: stripComments(s.md) }))
      : [{ title: "", md: stripComments(md.replace(/^#\s.*$/m, "")) }],
  };
}
