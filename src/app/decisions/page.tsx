import Link from "next/link";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, EmptyState, SectionLabel } from "@/components/ui";
import { StatusChip } from "@/components/chips";
import { Gloss } from "@/components/tip";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "Decisions" };

export default async function DecisionsPage() {
  const brain = await loadBrain();
  const groups: { key: string; label: string; note: string }[] = [
    { key: "pending", label: "Pending", note: "open forks — pending >14 days becomes decision debt" },
    { key: "decided", label: "Decided", note: "committed, with written reversal conditions" },
    { key: "superseded", label: "Superseded", note: "reversed by a later decision; both stay in the log" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Active work"
        title="Decisions"
        intro={
          <>
            The append-only record of committed choices. Every decision wears its evidence, what
            it explicitly is <em>not</em> doing, and — most valuable — its{" "}
            <Gloss term="reversal condition">reversal conditions</Gloss>. Reversal happens only
            by a new decision that supersedes the old.
          </>
        }
      />
      <div className="space-y-8">
        {groups.map((g, gi) => {
          const items = brain.decisions.filter((d) => (d.status ?? "pending") === g.key);
          return (
            <section key={g.key} className={`rise rise-${gi + 2}`}>
              <SectionLabel count={items.length}>{g.label}</SectionLabel>
              {items.length ? (
                <div className="space-y-4">
                  {items.map((d) => (
                    <Panel key={d.slug} className="transition-colors hover:border-hairline-strong">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <Link
                          href={`/decisions/${d.slug}`}
                          className="max-w-[64ch] text-[15.5px] font-semibold leading-snug tracking-tight text-ink hover:text-accent-hover"
                        >
                          {d.title}
                        </Link>
                        <div className="flex shrink-0 items-center gap-2">
                          <StatusChip status={d.status} />
                          <span className="font-mono text-[11px] text-ink-faint">
                            {formatDate(d.date)} · {relativeToSync(d.date, brain.asOf)}
                          </span>
                        </div>
                      </div>
                      {d.statusNote ? (
                        <p className="mt-2 flex items-start gap-1.5 text-[13px] text-sem-yellow/90">
                          <Icons.alert className="mt-[3px] shrink-0" />
                          <span>
                            <span className="text-ink-subtle">The record&apos;s own caveat:</span>{" "}
                            {d.statusNote.replace(/^·\s*/, "")}
                          </span>
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11.5px] text-ink-faint">
                        <span>{d.evidence.length} evidence rows</span>
                        <span>{d.notDoing.length} explicit not-doings</span>
                        <span className="text-ink-subtle">
                          {d.reversal.items.length} reversal conditions
                        </span>
                      </div>
                    </Panel>
                  ))}
                </div>
              ) : (
                <EmptyState
                  what={`${g.label} decisions live here — ${g.note}.`}
                  why={
                    g.key === "pending"
                      ? "Nothing is currently waiting on a call."
                      : g.key === "superseded"
                        ? "No decision has been reversed yet — reversals land here with both records intact."
                        : "No commitments logged yet."
                  }
                  command={g.key !== "superseded" ? "/decide <slug>" : undefined}
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
