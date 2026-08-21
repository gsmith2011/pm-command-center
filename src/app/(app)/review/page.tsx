import Link from "next/link";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, EmptyState, SectionLabel } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Prose } from "@/components/prose";
import { Gloss, Tip } from "@/components/tip";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "Review / Health" };

const CHECK_LABELS: Record<string, { label: string; gloss: string }> = {
  "index-drift": {
    label: "INDEX drift",
    gloss: "A roster INDEX disagrees with the file it points at. Files are the source of truth; drift is surfaced, not silently fixed.",
  },
  "broken-link": {
    label: "Link rot",
    gloss: "A cross-link points at a file that doesn't exist. Broken links rot the brain silently — the sweep hunts them.",
  },
  "feature-pointer": {
    label: "Feature file gaps",
    gloss: "A hypothesis names its canonical feature file before the file exists — a known gap the workspace tracks openly.",
  },
  "untagged-evidence": {
    label: "Epistemic debt",
    gloss: "Evidence rows without provenance tags. Rendered visibly, never hidden.",
  },
  "decision-debt": {
    label: "Decision debt",
    gloss: "Pending decisions older than 14 days — unresolved forks.",
  },
  "orphan-promotion": {
    label: "Promotion hygiene",
    gloss: "A promoted hypothesis must always have its paired decision record.",
  },
  "relationship-debt": {
    label: "Relationship debt",
    gloss: "High-influence stakeholders untouched beyond the 3-week cadence.",
  },
  "forcing-date": {
    label: "Forcing dates",
    gloss: "Deadlines inside tensions and reversal conditions — they make decisions self-superseding, not decorative.",
  },
  "stale-knowledge": {
    label: "Stale knowledge",
    gloss: "Files past their staleness window (knowledge 6w, market 30–60d, interviews 90d, stakeholder assumptions 30d).",
  },
};

const SEV_META = {
  attention: { sem: "orange" as const, label: "needs attention" },
  debt: { sem: "red" as const, label: "debt" },
  info: { sem: "gray" as const, label: "info" },
};

export default async function ReviewPage() {
  const brain = await loadBrain();
  const byCheck = new Map<string, typeof brain.health>();
  for (const h of brain.health) {
    byCheck.set(h.check, [...(byCheck.get(h.check) ?? []), h]);
  }

  return (
    <div>
      <PageHeader
        eyebrow="People & pipeline"
        title="Review / Health"
        intro={
          <>
            The always-on version of the weekly <Gloss term="sweep">sweep</Gloss>: the checks
            below are computed from the files on every load, using the brain&apos;s own
            thresholds. Below them, the full history of past sweeps —{" "}
            <Gloss term="drift">drift</Gloss> cited signal-by-signal, never paraphrased away.
          </>
        }
      />

      <section className="rise rise-2 mb-10">
        <SectionLabel count={brain.health.length}>Always-on checks</SectionLabel>
        {brain.health.length ? (
          <div className="space-y-4">
            {[...byCheck.entries()].map(([check, findings]) => {
              const meta = CHECK_LABELS[check] ?? { label: check, gloss: "" };
              return (
                <Panel key={check} pad={false}>
                  <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                    <Tip content={meta.gloss}>
                      <span className="text-eyebrow gloss">{meta.label}</span>
                    </Tip>
                    <span className="font-mono text-[11px] text-ink-faint">
                      {findings.length}
                    </span>
                  </div>
                  <ul className="divide-y divide-hairline">
                    {findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                        <Chip sem={SEV_META[f.severity].sem}>{SEV_META[f.severity].label}</Chip>
                        <div className="min-w-0 flex-1">
                          <Prose md={f.md} from="INDEX.md" className="!text-[13.5px]" />
                        </div>
                        {f.href ? (
                          <Link
                            href={f.href}
                            className="mt-0.5 shrink-0 text-ink-faint transition-colors hover:text-ink"
                            aria-label="open"
                          >
                            <Icons.arrowRight />
                          </Link>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Panel>
              );
            })}
          </div>
        ) : (
          <EmptyState
            what="Live findings from the brain's own hygiene rules: staleness, debt, drift, link rot."
            why="Everything checks out right now — nothing needs attention."
            command="/review"
          />
        )}
      </section>

      <section className="rise rise-3">
        <SectionLabel count={brain.maintenanceLogs.length}>Sweep history</SectionLabel>
        {brain.maintenanceLogs.length ? (
          <div className="space-y-5">
            {brain.maintenanceLogs.map((log) => (
              <Panel key={log.slug} pad={false} className="scroll-mt-16" >
                <div id={log.slug}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-5 py-3.5">
                  <h3 className="text-[14.5px] font-semibold tracking-tight text-ink">
                    {log.title}
                  </h3>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {formatDate(log.date)} · {relativeToSync(log.date, brain.asOf)}
                  </span>
                </div>
                <div className="space-y-5 px-5 py-4">
                  {log.sections.length ? (
                    log.sections.map((s) => (
                      <div key={s.title}>
                        <div className="text-eyebrow mb-1.5">{s.title}</div>
                        <Prose md={s.md} from={log.path} className="!text-[13.5px]" />
                      </div>
                    ))
                  ) : (
                    <Prose md={log.md} from={log.path} className="!text-[13.5px]" />
                  )}
                </div>
                </div>
              </Panel>
            ))}
          </div>
        ) : (
          <EmptyState
            what="Dated reports from each maintenance pass — what was fixed directly, what needs the PM, what gaps exist."
            why="No sweep has run yet. The weekly review is where memory systems live or die."
            command="/review"
          />
        )}
      </section>
    </div>
  );
}
