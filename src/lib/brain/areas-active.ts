// Parsers for the active layer: hypotheses/, decisions/, stakeholders/.
import path from "node:path";
import type {
  Decision,
  EvidenceRow,
  FeaturePointer,
  Hypothesis,
  HypothesisFile,
  HypothesisFileStatus,
  HypothesisStatus,
  MdSection,
  RiskArea,
  Stakeholder,
  StakeholderIndexRow,
} from "./types";
import {
  enumValue,
  fieldMap,
  firstDate,
  listItemsRaw,
  parseMd,
  sections,
  stripComments,
  toText,
} from "./md";
import { evidenceRow, isEmptyMarker } from "./provenance";
import { resolveLink } from "./workspace";

type Exists = (p: string) => boolean;

const RISK_AREAS: { re: RegExp; area: RiskArea }[] = [
  { re: /^value risk/i, area: "value" },
  { re: /^usability risk/i, area: "usability" },
  { re: /^feasibility risk/i, area: "feasibility" },
  { re: /^viability risk/i, area: "viability" },
  { re: /^other risk/i, area: "other" },
];

function rows(fragment: string | undefined, file: string, exists: Exists): EvidenceRow[] {
  if (!fragment) return [];
  return listItemsRaw(fragment)
    .filter((r) => !isEmptyMarker(r))
    .map((r) => evidenceRow(r, file, exists));
}

function featurePointer(raw: string, file: string, exists: Exists): FeaturePointer {
  // e.g. `../knowledge/product/features/salesforce-sync.md` (canonical feature file not yet created)
  const pathMatch = raw.match(/([./\w-]+\.md)/);
  const note = raw.match(/\(([^)]*)\)\s*$/)?.[1] ?? null;
  const rel = pathMatch ? resolveLink(file, pathMatch[1]) : null;
  return {
    raw,
    path: rel,
    exists: rel ? exists(rel) : false,
    note,
  };
}

export function parseHypothesisFile(
  filePath: string,
  md: string,
  exists: Exists
): HypothesisFile {
  const slug = path.posix.basename(filePath, ".md");
  const title = toText(parseMd(md.split("\n").find((l) => l.startsWith("# ")) ?? slug))
    .replace(/^Hypotheses\s*—\s*/i, "");
  const secs = sections(md, 2);
  const meta = secs.find((s) => /^meta$/i.test(s.title));
  const fields = meta ? fieldMap(meta.md) : new Map<string, string>();

  const riskAreas: Partial<Record<RiskArea, Hypothesis[]>> = {};
  const extraSections: MdSection[] = [];

  for (const sec of secs) {
    const match = RISK_AREAS.find((r) => r.re.test(sec.title));
    if (!match) {
      if (!/^meta$/i.test(sec.title)) {
        extraSections.push({ title: sec.title, md: stripComments(sec.md) });
      }
      continue;
    }
    const hyps: Hypothesis[] = [];
    for (const h of sections(sec.md, 3)) {
      // "H-U1: <belief>"
      const codeMatch = h.title.match(/^(H-[A-Z]{1,2}\d+)\s*:?\s*(.*)$/);
      const code = codeMatch?.[1] ?? h.title.split(":")[0];
      const belief = codeMatch?.[2]?.trim() || h.title;
      const f = fieldMap(h.md);
      const statusRaw = f.get("status") ?? null;
      hyps.push({
        id: `${slug}#${code}`,
        fileSlug: slug,
        code,
        riskArea: match.area,
        belief,
        origin: f.get("origin") ?? null,
        confidence: (enumValue(f.get("confidence")) as Hypothesis["confidence"]) ?? null,
        evidenceFor: rows(f.get("evidence for"), filePath, exists),
        evidenceAgainst: rows(f.get("evidence against"), filePath, exists),
        openQuestions: f.get("open questions / caveats")
          ? listItemsRaw(f.get("open questions / caveats")!)
          : [],
        test: f.get("test") ?? null,
        decisionTrigger: f.get("decision trigger") ?? null,
        status: (enumValue(statusRaw) as HypothesisStatus) ?? null,
        statusNote: statusRaw
          ? statusRaw.replace(/^[a-zA-Z-]+\s*/, "").trim() || null
          : null,
        statusDate: firstDate(statusRaw),
        resolution: f.get("resolution") ?? null,
      });
    }
    if (hyps.length) riskAreas[match.area] = hyps;
  }

  return {
    slug,
    title,
    path: filePath,
    feature: fields.has("feature")
      ? featurePointer(fields.get("feature")!, filePath, exists)
      : null,
    status: (enumValue(fields.get("status")) as HypothesisFileStatus) ?? null,
    created: firstDate(fields.get("created")),
    lastUpdated: firstDate(fields.get("last updated")),
    riskAreas,
    extraSections,
  };
}

const DECISION_SECTIONS = [
  "status",
  "date",
  "context",
  "options considered",
  "decision",
  "why",
  "evidence",
  "explicitly not doing",
  "what would reverse this",
  "remaining ambiguities",
  "for pending decisions only",
  "linked",
];

export function parseDecision(filePath: string, md: string, exists: Exists): Decision {
  const base = path.posix.basename(filePath, ".md");
  const slug = base;
  const h1 = md.split("\n").find((l) => l.startsWith("# ")) ?? base;
  const title = toText(parseMd(h1)).replace(/^Decision:\s*/i, "");
  const secs = sections(md, 2);
  const sec = (re: RegExp) => secs.find((s) => re.test(s.title));
  const secMd = (re: RegExp) => {
    const s = sec(re);
    return s ? stripComments(s.md) : null;
  };

  // keep the raw status section — Flo's status nuance lives in an inline HTML comment
  const statusRaw = sec(/^status$/i)?.md ?? null;
  const reversalMd = secMd(/^what would reverse/i) ?? "";
  const pendingSec = sec(/^for pending decisions/i);
  const pendingFields = pendingSec ? fieldMap(pendingSec.md) : null;
  const hasPendingContent =
    pendingFields && [...pendingFields.values()].some((v) => v && !/^</.test(v));

  const extraSections: MdSection[] = secs
    .filter((s) => !DECISION_SECTIONS.some((k) => s.title.toLowerCase().startsWith(k)))
    .map((s) => ({ title: s.title, md: stripComments(s.md) }));

  return {
    slug,
    title,
    path: filePath,
    status: (enumValue(statusRaw ? stripComments(statusRaw) : null) as Decision["status"]) ?? null,
    statusNote: statusRaw
      ? stripCommentsKeepText(statusRaw).replace(/^[a-zA-Z-]+\s*/, "").trim() || null
      : null,
    date: firstDate(secMd(/^date$/i) ?? base),
    context: secMd(/^context$/i),
    options: secMd(/^options considered/i)
      ? listItemsRaw(secMd(/^options considered/i)!)
      : [],
    decision: secMd(/^decision$/i),
    why: secMd(/^why$/i),
    evidence: rows(secMd(/^evidence$/i) ?? undefined, filePath, exists),
    notDoing: rows(secMd(/^explicitly not doing/i) ?? undefined, filePath, exists),
    reversal: { md: reversalMd, items: listItemsRaw(reversalMd) },
    ambiguities: secMd(/^remaining ambiguities/i)
      ? listItemsRaw(secMd(/^remaining ambiguities/i)!)
      : [],
    pending: hasPendingContent
      ? {
          blockerImpact: pendingFields!.get("blocker impact") ?? null,
          deadline: pendingFields!.get("deadline") ?? null,
          owner: pendingFields!.get("owner") ?? null,
          missingEvidence: pendingFields!.get("missing evidence") ?? null,
        }
      : null,
    linkedMd: secMd(/^linked$/i),
    extraSections,
  };
}

/** Keep the human comment content of an inline HTML comment (used on Status lines). */
function stripCommentsKeepText(md: string): string {
  return md.replace(/<!--\s*([\s\S]*?)\s*-->/g, "· $1").trim();
}

export function parseStakeholder(filePath: string, md: string): Stakeholder {
  const slug = path.posix.basename(filePath, ".md");
  const h1 = md.split("\n").find((l) => l.startsWith("# ")) ?? slug;
  const titleText = toText(parseMd(h1));
  // "Sam Okafor — Eng Lead, Integrations"
  const [name, role] = titleText.split(/\s+—\s+/, 2);
  const secs = sections(md, 2);
  const snapshot = secs.find((s) => /^snapshot$/i.test(s.title));
  const fields = snapshot ? fieldMap(snapshot.md) : new Map<string, string>();
  const lastTouchedSec = secs.find((s) => /^last touched/i.test(s.title));
  return {
    slug,
    name: name || slug,
    role: role ?? fields.get("role") ?? null,
    path: filePath,
    influence: fields.get("influence on my work") ?? fields.get("influence") ?? null,
    friction: fields.get("friction level") ?? fields.get("friction") ?? null,
    lastTouched: firstDate(lastTouchedSec?.md ?? null),
    sections: secs
      .filter((s) => !/^last touched/i.test(s.title))
      .map((s) => ({ title: s.title, md: stripComments(s.md) })),
  };
}

/** stakeholders/INDEX.md roster table -> rows (the one true INDEX table). */
export function parseStakeholderIndex(md: string): StakeholderIndexRow[] {
  const out: StakeholderIndexRow[] = [];
  for (const line of md.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 7) continue;
    const slugCell = cells[1];
    const m = slugCell.match(/\[([\w-]+)\]/);
    if (!m) continue;
    out.push({
      slug: m[1],
      name: cells[2],
      role: cells[3],
      influence: cells[4],
      friction: cells[5],
      lastTouched: cells[6],
    });
  }
  return out;
}
