// The event stream — lifecycle movement derived from dated facts in the files.
// No git required: filename dates, promotion dates, decision dates, sweep logs,
// tension updates, insight promotions. Honest by construction.
import type { Brain, BrainEvent } from "./types";
import { hrefFor } from "./routes";

const TYPE_ORDER: Record<string, number> = {
  sweep: 0,
  decision: 1,
  promotion: 2,
  demotion: 3,
  "tension-update": 4,
  "insight-promoted": 5,
  "persona-promoted": 6,
  "theme-retired": 7,
  ingest: 8,
};

export function buildEvents(
  brain: Pick<
    Brain,
    | "artifacts"
    | "hypotheses"
    | "decisions"
    | "maintenanceLogs"
    | "strategy"
    | "insights"
    | "personas"
  >
): BrainEvent[] {
  const events: BrainEvent[] = [];

  // 1. Ingests — one per artifact date+slug (prefer the ingestion record; fall back to source)
  const seenIngest = new Set<string>();
  const ordered = [...brain.artifacts].sort((a) => (a.layer === "ingestion" ? -1 : 1));
  for (const a of ordered) {
    const key = `${a.kind}/${a.date}-${a.slug}`;
    if (!a.date || seenIngest.has(key)) continue;
    seenIngest.add(key);
    events.push({
      date: a.date,
      type: "ingest",
      title: a.title.replace(/^Ingestion\s*[—–-]\s*/i, ""),
      detail: `via /ingest ${a.kind === "interviews" ? "interview" : a.kind === "meetings" ? "meeting" : a.kind}`,
      href: hrefFor(a.path),
    });
  }

  // 2. Hypothesis lifecycle moves
  for (const file of brain.hypotheses) {
    for (const hyps of Object.values(file.riskAreas)) {
      for (const h of hyps ?? []) {
        if ((h.status === "promoted" || h.status === "demoted" || h.status === "killed") && h.statusDate) {
          events.push({
            date: h.statusDate,
            type: h.status === "promoted" ? "promotion" : "demotion",
            title: `${h.code} ${h.status}: ${file.title}`,
            detail: h.statusNote,
            href: `/hypotheses/${file.slug}`,
          });
        }
      }
    }
  }

  // 3. Decisions
  for (const d of brain.decisions) {
    if (!d.date) continue;
    events.push({
      date: d.date,
      type: "decision",
      title: d.title,
      detail: d.status ? `status: ${d.status}` : null,
      href: `/decisions/${d.slug}`,
    });
  }

  // 4. Maintenance sweeps
  for (const log of brain.maintenanceLogs) {
    if (!log.date) continue;
    events.push({
      date: log.date,
      type: "sweep",
      title: log.title,
      detail: null,
      href: `/review#${log.slug}`,
    });
  }

  // 5. Strategy tension updates
  for (const t of brain.strategy?.tensions ?? []) {
    for (const u of t.updates) {
      events.push({
        date: u.date,
        type: "tension-update",
        title: `${t.id} updated: ${t.title}`,
        detail: null,
        href: "/strategy",
      });
    }
  }

  // 6. Insight promotions + retired themes
  for (const theme of brain.insights?.themes ?? []) {
    if (theme.promotedDate) {
      events.push({
        date: theme.promotedDate,
        type: "insight-promoted",
        title: `Theme promoted: ${theme.title}`,
        detail: null,
        href: "/users",
      });
    }
  }
  for (const r of brain.insights?.retired ?? []) {
    if (r.date) {
      events.push({
        date: r.date,
        type: "theme-retired",
        title: `Theme retired: ${r.title.replace(/\s*[—–-]\s*WEIGHED.*$/i, "")}`,
        detail: null,
        href: "/users",
      });
    }
  }

  // 7. Persona promotions ("Promoted from candidate YYYY-MM-DD")
  for (const p of brain.personas) {
    const m = p.md.match(/promoted from candidate\s+(\d{4}-\d{2}-\d{2})/i);
    if (m) {
      events.push({
        date: m[1],
        type: "persona-promoted",
        title: `Persona promoted: ${p.title}`,
        detail: null,
        href: "/users",
      });
    }
  }

  return events.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9)
  );
}
