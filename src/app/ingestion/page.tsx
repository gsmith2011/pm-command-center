import Link from "next/link";
import { loadBrain } from "@/lib/brain";
import { EmptyState, PageHeader, Panel } from "@/components/ui";
import { Chip, KindChip } from "@/components/chips";
import { hrefFor } from "@/lib/brain/routes";
import { KIND_LABEL, formatDate, relativeToSync } from "@/lib/semantics";

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export default async function IngestionPage() {
  const brain = await loadBrain();
  const ingested = brain.artifacts.filter((a) => a.layer === "ingestion");

  const byKind = new Map<string, number>();
  for (const a of ingested) byKind.set(a.kind, (byKind.get(a.kind) ?? 0) + 1);

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="Ingestion"
        intro="Every input enters through the same front door: preserved verbatim in source/, synthesized in ingestion/, then routed to the files it changes. This feed shows each input and where it landed."
      />

      {ingested.length === 0 ? (
        <div className="rise rise-2">
          <EmptyState
            what="The synthesized record of every interview, meeting, or signal."
            why="Nothing has been ingested yet."
            command="/ingest interview <file>"
          />
        </div>
      ) : (
        <>
          <div className="rise rise-2 mb-6 flex flex-wrap items-center gap-4 font-mono text-[12px] text-ink-subtle">
            <span>{ingested.length} ingested</span>
            {[...byKind.entries()].map(([kind, count]) => (
              <span key={kind}>
                {count} {KIND_LABEL[kind] ?? kind}
                {count === 1 ? "" : "s"}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {ingested.map((a, i) => (
              <Panel key={a.path} className={`rise rise-${Math.min(i + 3, 5)}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <KindChip kind={a.kind} />
                    <Link
                      href={hrefFor(a.path)}
                      className="truncate text-[15px] font-semibold text-ink hover:underline"
                    >
                      {a.title}
                    </Link>
                  </div>
                  <div className="shrink-0 whitespace-nowrap font-mono text-[12px] text-ink-faint">
                    {formatDate(a.date)}
                    {a.date ? (
                      <span className="ml-1.5">{relativeToSync(a.date, brain.asOf)}</span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] uppercase tracking-wide text-ink-faint">
                    Routed to
                  </div>
                  {a.routedTo.length === 0 ? (
                    <p className="font-mono text-[12px] text-ink-faint">
                      no downstream citations yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {a.routedTo.map((l) => (
                        <Chip key={l.path} sem="gray" href={hrefFor(l.path)}>
                          {l.area}: {truncate(l.label, 40)}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>

                {a.sourcePath ? (
                  <div className="mt-3">
                    <Link
                      href={hrefFor(a.sourcePath)}
                      className="text-[12.5px] text-ink-subtle underline decoration-dotted underline-offset-2 hover:text-ink"
                    >
                      verbatim source preserved
                    </Link>
                  </div>
                ) : null}
              </Panel>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
