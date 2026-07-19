import { cache } from "react";
import type {
  Artifact,
  Brain,
  Decision,
  Feature,
  HypothesisFile,
  KnowledgeStub,
  MaintenanceLog,
  Persona,
  SearchEntry,
  Stakeholder,
} from "./types";
import {
  listMarkdownFiles,
  readFileRaw,
  readSyncMeta,
  workspaceRoot,
} from "./workspace";
import { parseMd, toText } from "./md";
import {
  parseDecision,
  parseHypothesisFile,
  parseStakeholder,
  parseStakeholderIndex,
} from "./areas-active";
import {
  parseFeature,
  parseInsights,
  parseKnowledgeStub,
  parseMetrics,
  parsePersonas,
  parseRoadmap,
  parseStrategy,
} from "./areas-knowledge";
import {
  parseArtifact,
  parseCommands,
  parseMaintenanceLog,
} from "./areas-pipeline";
import { buildBacklinks, type FileDoc } from "./links";
import { buildEvents } from "./events";
import { buildHealth } from "./health";
import { hrefFor } from "./routes";

function h1Title(md: string, fallback: string): string {
  const line = md.split("\n").find((l) => l.startsWith("# "));
  return line ? toText(parseMd(line)) : fallback;
}

function buildSearch(brain: {
  hypotheses: HypothesisFile[];
  decisions: Decision[];
  stakeholders: Stakeholder[];
  artifacts: Artifact[];
  features: Feature[];
}): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const h of brain.hypotheses) {
    out.push({
      title: h.title,
      subtitle: `hypotheses/${h.slug}.md · ${h.status ?? "—"}`,
      href: `/hypotheses/${h.slug}`,
      group: "Hypotheses",
    });
  }
  for (const d of brain.decisions) {
    out.push({
      title: d.title,
      subtitle: `${d.date ?? ""} · ${d.status ?? "—"}`,
      href: `/decisions/${d.slug}`,
      group: "Decisions",
    });
  }
  for (const s of brain.stakeholders) {
    out.push({
      title: s.name,
      subtitle: s.role ?? "",
      href: `/stakeholders/${s.slug}`,
      group: "Stakeholders",
    });
  }
  for (const a of brain.artifacts.filter((a) => a.layer === "ingestion")) {
    out.push({
      title: a.title,
      subtitle: `${a.kind} · ${a.date ?? ""}`,
      href: hrefFor(a.path),
      group: "Ingestion",
    });
  }
  for (const a of brain.artifacts.filter((a) => a.layer === "source")) {
    out.push({
      title: `Source: ${a.title}`,
      subtitle: `${a.kind} · ${a.date ?? ""}`,
      href: hrefFor(a.path),
      group: "Sources",
    });
  }
  for (const f of brain.features) {
    out.push({
      title: f.title,
      subtitle: `feature · ${f.status ?? "—"}`,
      href: hrefFor(f.path),
      group: "Features",
    });
  }
  return out;
}

function load(): Brain {
  const root = workspaceRoot();
  const meta = readSyncMeta(root);
  const files = listMarkdownFiles(root);
  const fileSet = new Set(files);
  const fileExists = (p: string) => fileSet.has(p);
  const read = (p: string) => readFileRaw(root, p);

  const hypotheses: HypothesisFile[] = [];
  const decisions: Decision[] = [];
  const stakeholders: Stakeholder[] = [];
  const artifacts: Artifact[] = [];
  const maintenanceLogs: MaintenanceLog[] = [];
  const features: Feature[] = [];
  const knowledgeStubs: KnowledgeStub[] = [];
  let personas: Persona[] = [];

  const docs: FileDoc[] = [];
  for (const f of files) {
    const md = read(f);
    if (md == null) continue;
    docs.push({ path: f, md, title: h1Title(md, f) });
  }
  const docMap = new Map(docs.map((d) => [d.path, d]));
  const mdOf = (p: string) => docMap.get(p)?.md ?? null;

  for (const { path: f, md } of docs) {
    const isMeta = f.endsWith("INDEX.md") || f.endsWith("_SCHEMA.md");
    if (f.startsWith("hypotheses/") && !isMeta) {
      hypotheses.push(parseHypothesisFile(f, md, fileExists));
    } else if (f.startsWith("decisions/") && !isMeta) {
      decisions.push(parseDecision(f, md, fileExists));
    } else if (f.startsWith("stakeholders/") && !isMeta) {
      stakeholders.push(parseStakeholder(f, md));
    } else if (f.startsWith("source/") || f.startsWith("ingestion/")) {
      const a = parseArtifact(f, md, fileExists);
      if (a) artifacts.push(a);
    } else if (f.startsWith("maintenance/log/")) {
      maintenanceLogs.push(parseMaintenanceLog(f, md));
    } else if (f.startsWith("knowledge/product/features/") && !isMeta && !f.includes("_SCHEMA")) {
      features.push(parseFeature(f, md));
    } else if (
      (f.startsWith("knowledge/market/") ||
        f.startsWith("knowledge/org/") ||
        f === "knowledge/users/segments.md") &&
      !isMeta
    ) {
      knowledgeStubs.push(parseKnowledgeStub(f, md));
    }
  }

  const strategyMd = mdOf("knowledge/strategy.md");
  const strategy = strategyMd ? parseStrategy("knowledge/strategy.md", strategyMd) : null;
  const insightsMd = mdOf("knowledge/users/insights.md");
  const insights = insightsMd
    ? parseInsights("knowledge/users/insights.md", insightsMd, fileExists)
    : null;
  const personasMd = mdOf("knowledge/users/personas.md");
  if (personasMd) personas = parsePersonas(personasMd);
  const metricsMd = mdOf("knowledge/product/metrics.md");
  const metrics = metricsMd ? parseMetrics("knowledge/product/metrics.md", metricsMd) : null;
  const roadmapMd = mdOf("knowledge/product/roadmap.md");
  const roadmap = roadmapMd
    ? parseRoadmap("knowledge/product/roadmap.md", roadmapMd, fileExists)
    : [];
  const indexMd = mdOf("INDEX.md");
  const commands = indexMd ? parseCommands(indexMd) : [];
  const stakeIndexMd = mdOf("stakeholders/INDEX.md");
  const stakeholderIndex = stakeIndexMd ? parseStakeholderIndex(stakeIndexMd) : [];

  // sort: artifacts and logs newest first; decisions newest first
  artifacts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  maintenanceLogs.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  decisions.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  // "as of" anchor: sync date (snapshot) or today (live) — honest time.
  const asOf = meta.syncedAt
    ? meta.syncedAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const partial = {
    artifacts,
    hypotheses,
    decisions,
    maintenanceLogs,
    strategy,
    insights,
    personas,
  };
  const events = buildEvents(partial);
  const health = buildHealth(
    { hypotheses, decisions, stakeholders, stakeholderIndex, strategy, asOf },
    docs,
    fileExists
  );
  const backlinks = buildBacklinks(docs);

  // Routing is proven by citation: an artifact "routed to" the active/durable
  // files that cite it (or its source anchor). Union with any forward links.
  const ROUTED_AREAS = ["hypotheses", "knowledge", "stakeholders", "decisions"];
  for (const a of artifacts) {
    if (a.layer !== "ingestion") continue;
    const citers = [
      ...(backlinks[a.path] ?? []),
      ...(a.sourcePath ? (backlinks[a.sourcePath] ?? []) : []),
    ].filter((b) => ROUTED_AREAS.includes(b.fromArea));
    const byPath = new Map(a.routedTo.map((l) => [l.path, l]));
    for (const c of citers) {
      if (!byPath.has(c.fromPath)) {
        byPath.set(c.fromPath, {
          path: c.fromPath,
          label: c.fromTitle,
          area: c.fromArea,
          exists: true,
        });
      }
    }
    a.routedTo = [...byPath.values()].sort((x, y) => x.area.localeCompare(y.area));
  }

  const search = buildSearch({ hypotheses, decisions, stakeholders, artifacts, features });

  return {
    meta,
    asOf,
    strategy,
    hypotheses,
    decisions,
    stakeholders,
    stakeholderIndex,
    insights,
    personas,
    metrics,
    features,
    roadmap,
    artifacts,
    maintenanceLogs,
    commands,
    events,
    health,
    knowledgeStubs,
    backlinks,
    files,
    search,
  };
}

/** Load and parse the whole workspace. Cached per request; live in dev. */
export const loadBrain = cache(load);

/** Raw markdown of one workspace file (for the artifact viewer). */
export function readWorkspaceFile(relPath: string): string | null {
  return readFileRaw(workspaceRoot(), relPath);
}
