// The UI's semantic vocabulary: status colors, provenance families, and the
// glossary that keeps every surface legible to a cold reader.
// 1:1 rule: these map the brain's own enums; they never invent states.

export type Sem = "green" | "blue" | "yellow" | "orange" | "red" | "purple" | "teal" | "gray";

export const STATUS_SEM: Record<string, { sem: Sem; label: string; gloss: string }> = {
  // hypothesis / per-hypothesis lifecycle
  active: { sem: "blue", label: "being tested", gloss: "Evidence is still accumulating. The brain's status: active." },
  "partially-validated": { sem: "teal", label: "partially validated", gloss: "Some hypotheses in this file have met their bar; others are still open." },
  promoted: { sem: "green", label: "validated → decision", gloss: "Met its own decision trigger. Promotion always creates a paired decision record — never an orphan." },
  demoted: { sem: "orange", label: "demoted", gloss: "Contradicted by evidence, kept for the record so the same wrong bet isn't re-run." },
  killed: { sem: "red", label: "killed", gloss: "No longer relevant — feature reshaped or market moved." },
  archived: { sem: "gray", label: "archived", gloss: "Feature shipped and measured; moved out of active work." },
  // decisions
  pending: { sem: "yellow", label: "pending", gloss: "An open fork. Pending >14 days becomes decision debt and the weekly sweep flags it." },
  decided: { sem: "green", label: "decided", gloss: "Committed. Reversal happens only by a new decision that supersedes this one." },
  superseded: { sem: "gray", label: "superseded", gloss: "Reversed by a later decision. Both records stay in the log — the history is the point." },
};

export const CONFIDENCE_SEM: Record<string, Sem> = {
  low: "gray",
  medium: "yellow",
  high: "green",
};

export const RISK_AREA_META: Record<string, { label: string; code: string; gloss: string }> = {
  value: { label: "Value", code: "H-V", gloss: "Will anyone want it? The risk that the problem isn't real or the solution isn't valuable." },
  usability: { label: "Usability", code: "H-U", gloss: "Can people actually use it? Friction, comprehension, workflow fit." },
  feasibility: { label: "Feasibility", code: "H-F", gloss: "Can we build it with the time, team, and technology we have?" },
  viability: { label: "Viability", code: "H-B", gloss: "Does it work for the business — pricing, cost, channel, legal?" },
  other: { label: "Other", code: "H-O", gloss: "Real risks that don't fit the canonical four: regulatory, partnership, security, internal-political." },
};

export const PROVENANCE_META: Record<
  string,
  { sem: Sem; label: string; gloss: string; trust: string }
> = {
  ingestion: {
    sem: "blue",
    label: "synthesized record",
    gloss: "Went through the ingestion pipeline; the record links back to a verbatim source anchor.",
    trust: "highest",
  },
  source: {
    sem: "teal",
    label: "source artifact",
    gloss: "Direct citation to the verbatim original — the audit anchor, never edited after capture.",
    trust: "high",
  },
  "stakeholder-verbal": {
    sem: "yellow",
    label: "heard verbally",
    gloss: "Heard from a person; no recording or document. Trust depends on the stakeholder.",
    trust: "medium",
  },
  intuition: {
    sem: "purple",
    label: "PM intuition",
    gloss: "The PM's own read, no external evidence yet. Legitimate input — it just wears its provenance.",
    trust: "low (externally)",
  },
  "industry-knowledge": {
    sem: "gray",
    label: "industry knowledge",
    gloss: "Accepted background, not specific to this product. Flagged for replacement by product-specific evidence.",
    trust: "low",
  },
  chat: {
    sem: "gray",
    label: "chat, no artifact",
    gloss: "Synthesized in conversation; nothing written down yet. Often a precursor to a future ingestion record.",
    trust: "low",
  },
  untagged: {
    sem: "red",
    label: "untagged",
    gloss: "This claim carries no provenance tag — epistemic debt. The brain's audit would flag it as an orphan.",
    trust: "unknown",
  },
};

export const KIND_LABEL: Record<string, string> = {
  interviews: "interview",
  meetings: "meeting",
  market: "market signal",
  adhoc: "ad-hoc",
};

/** Chip / text / border classes per semantic color (14% tint on dark). */
export const SEM_CLASSES: Record<Sem, { text: string; bg: string; border: string; dot: string }> = {
  green: { text: "text-sem-green", bg: "bg-sem-green/12", border: "border-sem-green/30", dot: "bg-sem-green" },
  blue: { text: "text-sem-blue", bg: "bg-sem-blue/12", border: "border-sem-blue/30", dot: "bg-sem-blue" },
  yellow: { text: "text-sem-yellow", bg: "bg-sem-yellow/12", border: "border-sem-yellow/30", dot: "bg-sem-yellow" },
  orange: { text: "text-sem-orange", bg: "bg-sem-orange/12", border: "border-sem-orange/30", dot: "bg-sem-orange" },
  red: { text: "text-sem-red", bg: "bg-sem-red/12", border: "border-sem-red/30", dot: "bg-sem-red" },
  purple: { text: "text-sem-purple", bg: "bg-sem-purple/12", border: "border-sem-purple/30", dot: "bg-sem-purple" },
  teal: { text: "text-sem-teal", bg: "bg-sem-teal/12", border: "border-sem-teal/30", dot: "bg-sem-teal" },
  gray: { text: "text-ink-subtle", bg: "bg-surface-3", border: "border-hairline-strong", dot: "bg-ink-faint" },
};

/** Terms glossed inline so no card requires insider vocabulary. */
export const GLOSSARY: Record<string, string> = {
  "watch item": "Interesting but not yet actionable — logged with its caveats (sample size, correlation-only) so it can't quietly inflate confidence.",
  drift: "Something unchanged for long enough that the weekly sweep questions it — a hypothesis with no new evidence, a stale assumption, an untouched relationship.",
  contradiction: "Two signals genuinely pointing opposite ways. The brain preserves both sides with their evidence — never averages them into false consensus.",
  "audit trail": "Every load-bearing claim walks back to its original artifact: claim → provenance tag → synthesized record → verbatim source.",
  "reversal condition": "The specific, observable condition under which a decision gets revisited — written down at decision time, not reconstructed later.",
  tension: "A conflict between a real signal and stated strategy, held open deliberately until the PM resolves it. Only recurring, decision-relevant signals earn one.",
  provenance: "Where a claim came from, as a typed tag: a documented artifact, a person's word, the PM's intuition, industry background, or an untagged gap.",
  "decision debt": "Pending decisions older than 14 days — unresolved forks the sweep surfaces prominently.",
  "epistemic debt": "Claims without provenance tags. The system renders them visibly rather than hiding them.",
  "north-star metric": "The one metric the whole strategy serves; every priority should trace to it.",
  "the loop": "Every input runs the same cycle: ingest → source + synthesize → propagate → tag → sweep. The brain is this loop running, not a pile of files.",
  sweep: "The weekly /review pass: six checks for staleness, hygiene, debt, tensions, compression, and archival.",
  "risk areas": "The five lenses every feature is hypothesized under: value, usability, feasibility, viability, other.",
  "co-equal": "Two problems with equally strong evidence. Choosing one is a prioritization call, not an evidence verdict — the brain records it that way.",
  floor: "A number known to undercount (e.g. support tickets only capture users who filed one). Rendered as a floor, never as incidence.",
  "same-population": "Two channels reporting the same users. Corroborates scale but is never double-counted as independent confirmation.",
};

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Relative time anchored to the sync date — honest time on a frozen snapshot. */
export function relativeToSync(iso: string | null | undefined, asOf: string): string | null {
  if (!iso) return null;
  const days = Math.round((Date.parse(asOf) - Date.parse(iso)) / 86400000);
  if (isNaN(days)) return null;
  if (days < 0) return `in ${-days}d`;
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 28) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}
