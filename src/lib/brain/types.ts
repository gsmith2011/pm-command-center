// Core types for the parsed PM Brain workspace.
// The dashboard is 1:1 with the brain: same statuses, same tags, same lifecycle.
// Parsers are tolerant — missing fields become null/[] and render as honest gaps.

export type SourceKind = "interviews" | "meetings" | "market" | "adhoc";

export type RiskArea = "value" | "usability" | "feasibility" | "viability" | "other";

export type HypothesisStatus = "active" | "promoted" | "demoted" | "killed";
export type HypothesisFileStatus =
  | "active"
  | "partially-validated"
  | "promoted"
  | "demoted"
  | "archived";
export type DecisionStatus = "pending" | "decided" | "superseded";
export type Confidence = "low" | "medium" | "high";

/** One provenance tag, as found on an evidence row or load-bearing claim. */
export type ProvenanceTag =
  | {
      kind: "path";
      /** which layer the citation points into */
      area: "ingestion" | "source";
      /** workspace-relative path of the cited artifact */
      path: string;
      sourceKind: SourceKind | null;
      /** whether the cited file exists in the workspace */
      resolved: boolean;
      raw: string;
    }
  | { kind: "stakeholder-verbal"; name: string; date: string | null; raw: string }
  | { kind: "intuition"; date: string | null; raw: string }
  | { kind: "industry-knowledge"; raw: string }
  | { kind: "chat"; raw: string };

/** A claim row under Evidence for / Evidence against / Explicitly NOT doing. */
export interface EvidenceRow {
  /** markdown of the claim with the trailing tag(s) stripped */
  md: string;
  /** plain text of the claim (for search/snippets) */
  text: string;
  tags: ProvenanceTag[];
  /** true = no tag found = epistemic debt, rendered visibly */
  orphan: boolean;
}

export interface Hypothesis {
  /** `<fileSlug>#<code>`, e.g. "sync-field-mapping-breakage#H-U1" */
  id: string;
  fileSlug: string;
  code: string; // H-U1
  riskArea: RiskArea;
  belief: string;
  origin: string | null;
  confidence: Confidence | null;
  evidenceFor: EvidenceRow[];
  evidenceAgainst: EvidenceRow[];
  /** markdown bullets — commentary/caveats, provenance not required here */
  openQuestions: string[];
  test: string | null;
  decisionTrigger: string | null;
  status: HypothesisStatus | null;
  /** full status line after the enum value, e.g. "(2026-07-14) — met its promotion bar…" */
  statusNote: string | null;
  /** date the status line carries, if any */
  statusDate: string | null;
  resolution: string | null;
}

export interface FeaturePointer {
  raw: string;
  /** workspace-relative path it points to */
  path: string | null;
  exists: boolean;
  /** e.g. "canonical feature file not yet created" */
  note: string | null;
}

export interface HypothesisFile {
  slug: string;
  title: string;
  path: string;
  feature: FeaturePointer | null;
  status: HypothesisFileStatus | null;
  created: string | null;
  lastUpdated: string | null;
  riskAreas: Partial<Record<RiskArea, Hypothesis[]>>;
  /** sections beyond the schema (e.g. "Adjudication vs. rivals"), rendered as prose */
  extraSections: MdSection[];
}

export interface MdSection {
  title: string;
  md: string;
}

export interface Decision {
  slug: string;
  title: string;
  path: string;
  status: DecisionStatus | null;
  /** raw status line incl. inline comment, for honest rendering */
  statusNote: string | null;
  date: string | null;
  context: string | null;
  options: string[];
  decision: string | null;
  why: string | null;
  evidence: EvidenceRow[];
  notDoing: EvidenceRow[];
  /** "What would reverse this" — elevated in the UI */
  reversal: { md: string; items: string[] };
  ambiguities: string[];
  pending: {
    blockerImpact: string | null;
    deadline: string | null;
    owner: string | null;
    missingEvidence: string | null;
  } | null;
  linkedMd: string | null;
  extraSections: MdSection[];
}

export interface Stakeholder {
  slug: string;
  name: string;
  role: string | null;
  path: string;
  influence: string | null;
  friction: string | null;
  lastTouched: string | null;
  /** all body sections in order, rendered as prose with chips */
  sections: MdSection[];
}

export interface StakeholderIndexRow {
  slug: string;
  name: string;
  role: string;
  influence: string;
  friction: string;
  lastTouched: string;
}

export interface Artifact {
  /** "source" | "ingestion" */
  layer: "source" | "ingestion";
  kind: SourceKind;
  date: string | null;
  slug: string;
  title: string;
  path: string;
  md: string;
  /** for ingestion records: the matching source anchor, if it exists */
  sourcePath: string | null;
  /** outbound links into the durable/active layers (what it routed to) */
  routedTo: LinkRef[];
}

export interface LinkRef {
  /** workspace-relative target path (may include #fragment) */
  path: string;
  /** display label */
  label: string;
  area: string; // top-level dir: hypotheses | decisions | knowledge | stakeholders | ingestion | source | maintenance | other
  exists: boolean;
}

export interface Backlink {
  fromPath: string;
  fromTitle: string;
  fromArea: string;
  /** short plain-text context around the citation */
  context: string;
}

export interface Tension {
  id: string; // T1
  title: string;
  md: string;
  status: string | null;
  /** dates found in "Update YYYY-MM-DD" markers */
  updates: { date: string; md: string }[];
  /** forcing/deadline dates found in the body */
  forcingDate: string | null;
}

export interface Strategy {
  path: string;
  northStar: string | null;
  priorities: string[];
  nonGoals: string[];
  lastReviewed: string | null;
  tensions: Tension[];
}

export interface InsightTheme {
  title: string;
  md: string;
  promotedDate: string | null;
  evidence: EvidenceRow[];
  relevance: string | null;
}

export interface Contradiction {
  title: string;
  md: string;
  sides: { label: string; md: string; tags: ProvenanceTag[] }[];
  whyPreserved: string | null;
}

export interface RetiredTheme {
  title: string;
  md: string;
  date: string | null;
}

export interface Insights {
  path: string;
  themes: InsightTheme[];
  contradictions: Contradiction[];
  retired: RetiredTheme[];
}

export interface Persona {
  title: string;
  status: string | null; // active | candidate | …
  md: string;
  lastRevised: string | null;
}

export interface MetricStage {
  name: string; // Acquisition …
  current: string | null;
  definition: string | null;
  source: string | null;
  watchItems: string[]; // markdown bullets flagged as watch items
  otherMd: string[];
}

export interface Metrics {
  path: string;
  northStar: string | null;
  stages: MetricStage[];
  otherTracked: string[];
  recentMovements: string[];
}

export interface Feature {
  slug: string;
  title: string;
  path: string;
  owner: string | null;
  status: string | null;
  priority: string | null;
  lastUpdated: string | null;
  sections: MdSection[];
}

export interface RoadmapBucket {
  name: string; // Now | Next | Later …
  items: { md: string; links: LinkRef[] }[];
}

export interface MaintenanceLog {
  slug: string;
  date: string | null;
  title: string;
  path: string;
  md: string;
  sections: MdSection[];
}

export interface Command {
  command: string; // "/ingest interview <file>"
  name: string; // "/ingest"
  description: string;
}

export type BrainEventType =
  | "ingest"
  | "promotion"
  | "demotion"
  | "decision"
  | "sweep"
  | "tension-update"
  | "insight-promoted"
  | "theme-retired"
  | "persona-promoted";

export interface BrainEvent {
  date: string; // YYYY-MM-DD (in-world)
  type: BrainEventType;
  title: string;
  detail: string | null;
  /** app route to jump to */
  href: string;
}

export interface HealthFinding {
  check: string;
  severity: "info" | "attention" | "debt";
  md: string;
  href: string | null;
}

export interface KnowledgeStub {
  area: string;
  path: string;
  title: string;
  sections: MdSection[];
}

export interface SyncMeta {
  /** ISO timestamp the snapshot was taken; null = live filesystem reads */
  syncedAt: string | null;
  live: boolean;
  workspaceName: string | null;
}

export interface SearchEntry {
  title: string;
  subtitle: string;
  href: string;
  group: string;
}

export interface Brain {
  meta: SyncMeta;
  /** the anchor date for relative time ("as of last sync") — YYYY-MM-DD */
  asOf: string;
  strategy: Strategy | null;
  hypotheses: HypothesisFile[];
  decisions: Decision[];
  stakeholders: Stakeholder[];
  stakeholderIndex: StakeholderIndexRow[];
  insights: Insights | null;
  personas: Persona[];
  metrics: Metrics | null;
  features: Feature[];
  roadmap: RoadmapBucket[];
  artifacts: Artifact[]; // ingestion + source, all kinds
  maintenanceLogs: MaintenanceLog[];
  commands: Command[];
  events: BrainEvent[];
  health: HealthFinding[];
  /** knowledge files without a dedicated parser (market/org/segments) */
  knowledgeStubs: KnowledgeStub[];
  /** target path -> backlinks pointing at it */
  backlinks: Record<string, Backlink[]>;
  /** every markdown file present, workspace-relative */
  files: string[];
  search: SearchEntry[];
}
