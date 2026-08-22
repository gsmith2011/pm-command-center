import Link from "next/link";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import type { HypothesisFile } from "@/lib/brain/types";
import { RISK_AREA_META, formatDateShort, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, EmptyState, SectionLabel } from "@/components/ui";
import { StatusChip, ConfidenceChip, Chip } from "@/components/chips";
import { EvidenceTally } from "@/components/evidence";
import { Gloss } from "@/components/tip";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "Hypotheses" };

function FeatureCard({ file, asOf }: { file: HypothesisFile; asOf: string }) {
  const allHyps = Object.values(file.riskAreas).flat();
  const populated = Object.keys(file.riskAreas);
  return (
    <Panel pad={false} className="overflow-hidden">
      {/* feature header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="min-w-0">
          <Link
            href={`/hypotheses/${file.slug}`}
            className="text-[16px] font-semibold tracking-tight text-ink transition-colors hover:text-accent-hover"
          >
            {file.title}
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-faint">
            <span>{file.slug}.md</span>
            {file.created ? <span>opened {formatDateShort(file.created)}</span> : null}
            {file.lastUpdated ? (
              <span>
                updated {formatDateShort(file.lastUpdated)}{" "}
                {relativeToSync(file.lastUpdated, asOf)}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status={file.status} />
        </div>
      </div>

      {/* the 5 risk areas — the file's real internal structure, sparse areas honest */}
      <div className="grid gap-px bg-hairline sm:grid-cols-5">
        {Object.entries(RISK_AREA_META).map(([key, meta]) => {
          const hyps = file.riskAreas[key as keyof typeof file.riskAreas] ?? [];
          return (
            <div key={key} className="bg-surface-1 px-3 py-2.5">
              <Gloss term="risk areas">
                <div className="font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
                  {meta.label}
                  <span className="ml-1 text-ink-faint/60">{meta.code}*</span>
                </div>
              </Gloss>
              {hyps.length ? (
                <div className="mt-1 space-y-1">
                  {hyps.map((h) => (
                    <Link
                      key={h.code}
                      href={`/hypotheses/${file.slug}#${h.code}`}
                      className="block truncate text-[12px] text-ink-muted hover:text-ink"
                    >
                      <span className="font-mono text-[10.5px] text-ink-subtle">{h.code}</span>{" "}
                      {h.belief.slice(0, 60)}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-1 text-[11.5px] italic text-ink-faint/70">
                  not hypothesized
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* per-hypothesis summary rows */}
      <ul className="divide-y divide-hairline border-t border-hairline">
        {allHyps.map((h) =>
          h ? (
            <li key={h.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <Link
                href={`/hypotheses/${file.slug}#${h.code}`}
                className="min-w-0 flex-1 text-[13.5px] leading-snug text-ink-muted hover:text-ink"
              >
                <span className="mr-1.5 font-mono text-[11px] text-ink-subtle">{h.code}</span>
                {h.belief}
              </Link>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <EvidenceTally
                  forCount={h.evidenceFor.length}
                  againstCount={h.evidenceAgainst.length}
                />
                <ConfidenceChip confidence={h.confidence} />
                <StatusChip status={h.status} date={h.statusDate} />
              </div>
            </li>
          ) : null
        )}
      </ul>

      {populated.length === 0 ? (
        <div className="px-5 py-4">
          <EmptyState
            what="This feature file exists but carries no hypotheses yet."
            why="Risk areas get populated when the feature is scanned for risks."
            command={`/risk ${file.slug}`}
          />
        </div>
      ) : null}
    </Panel>
  );
}

export default async function HypothesesPage() {
  const brain = await loadBrain();
  const order = { promoted: 0, "partially-validated": 1, active: 2, demoted: 3, archived: 4 };
  const files = [...brain.hypotheses].sort(
    (a, b) => (order[a.status ?? "active"] ?? 2) - (order[b.status ?? "active"] ?? 2)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Active work"
        title="Hypotheses"
        intro={
          <>
            The bets being tested — one file per feature, each structured by the five{" "}
            <Gloss term="risk areas">risk areas</Gloss>. Status moves through the workflow (
            <code className="font-mono text-[12px]">/hypothesize</code>,{" "}
            <code className="font-mono text-[12px]">/review</code>), never by hand — this
            dashboard is read-only.
          </>
        }
      />
      {files.length ? (
        <div className="space-y-5">
          {files.map((f, i) => (
            <div key={f.slug} className={`rise rise-${Math.min(i + 2, 5)}`}>
              <FeatureCard file={f} asOf={brain.asOf} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          what="Feature-scoped hypothesis files live here — the brain's testable beliefs."
          why="No hypotheses yet: nothing has been risk-scanned or hypothesized."
          command="/hypothesize <feature-slug>"
        />
      )}

      <div className="rise rise-5 mt-8">
        <SectionLabel>Lifecycle</SectionLabel>
        <Panel className="flex flex-wrap items-center gap-2 !py-3.5 text-[12.5px] text-ink-subtle">
          <Chip sem="blue">active</Chip>
          <Icons.arrowRight className="text-ink-faint" />
          <Chip sem="green">promoted</Chip>
          <span className="text-ink-faint">(always paired with a decision)</span>
          <span className="mx-1 text-ink-faint">or</span>
          <Chip sem="orange">demoted</Chip>
          <span className="mx-1 text-ink-faint">or</span>
          <Chip sem="red">killed</Chip>
          <Icons.arrowRight className="text-ink-faint" />
          <Chip sem="gray">archived</Chip>
          <span className="ml-2 text-ink-faint">
            — demoted bets are kept: they stop the same wrong bet being re-run.
          </span>
        </Panel>
      </div>
    </div>
  );
}
