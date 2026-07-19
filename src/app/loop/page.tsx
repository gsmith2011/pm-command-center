import Link from "next/link";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import type { Brain } from "@/lib/brain/types";
import { hrefFor } from "@/lib/brain/routes";
import { formatDate, formatDateShort, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, SectionLabel, EmptyState } from "@/components/ui";
import { Chip, KindChip, StatusChip } from "@/components/chips";
import { Timeline } from "@/components/timeline";
import { Gloss, Tip } from "@/components/tip";
import { Icons } from "@/components/icons";

export const metadata: Metadata = { title: "The Loop" };

function taggedClaimCount(brain: Brain): number {
  let n = 0;
  for (const f of brain.hypotheses)
    for (const hyps of Object.values(f.riskAreas))
      for (const h of hyps ?? [])
        n += [...h.evidenceFor, ...h.evidenceAgainst].filter((r) => !r.orphan).length;
  for (const d of brain.decisions)
    n += [...d.evidence, ...d.notDoing].filter((r) => !r.orphan).length;
  for (const t of brain.insights?.themes ?? [])
    n += t.evidence.filter((r) => !r.orphan).length;
  return n;
}

export default async function LoopPage() {
  const brain = await loadBrain();
  const ingested = brain.artifacts.filter((a) => a.layer === "ingestion");
  const sources = brain.artifacts.filter((a) => a.layer === "source");
  const propagations = ingested.reduce((n, a) => n + a.routedTo.length, 0);
  const tagged = taggedClaimCount(brain);
  const sweeps = brain.maintenanceLogs.length;

  const stages = [
    {
      n: 1,
      name: "Ingest",
      icon: Icons.adhoc,
      count: ingested.length,
      unit: "inputs",
      gloss: "Interviews, meetings, market signals, ad-hoc dumps — everything enters through the same front door.",
      href: "/ingestion",
    },
    {
      n: 2,
      name: "Source + synthesize",
      icon: Icons.file,
      count: sources.length,
      unit: "verbatim anchors",
      gloss: "The original is preserved verbatim in source/ before any synthesis — the audit anchor, never edited again.",
      href: "/ingestion",
    },
    {
      n: 3,
      name: "Propagate",
      icon: Icons.branch,
      count: propagations,
      unit: "file updates",
      gloss: "One artifact typically touches 4–6 files: hypothesis evidence, user themes, stakeholder notes, decisions.",
      href: "/hypotheses",
    },
    {
      n: 4,
      name: "Tag",
      icon: Icons.eye,
      count: tagged,
      unit: "tagged claims",
      gloss: "Every load-bearing claim wears a provenance tag — that's what keeps the trail walkable.",
      href: "/review",
    },
    {
      n: 5,
      name: "Sweep",
      icon: Icons.loop,
      count: sweeps,
      unit: "reviews run",
      gloss: "The weekly /review pass: staleness, hygiene, debt, tensions, compression, archival.",
      href: "/review",
    },
  ];

  const hypStages: { key: string; label: string; empty: string }[] = [
    { key: "active", label: "active", empty: "—" },
    { key: "promoted", label: "promoted", empty: "promotions land here from /hypothesize or /review" },
    { key: "demoted", label: "demoted / killed", empty: "nothing demoted yet — contradicted bets are kept, not deleted" },
    { key: "archived", label: "archived", empty: "shipped-and-measured features retire here" },
  ];
  const allHyps = brain.hypotheses.flatMap((f) =>
    Object.values(f.riskAreas)
      .flat()
      .filter((h) => h != null)
      .map((h) => ({ ...h!, fileTitle: f.title, fileSlug: f.slug }))
  );

  const decStages: { key: string; label: string; empty: string }[] = [
    { key: "pending", label: "pending", empty: "no open forks right now" },
    { key: "decided", label: "decided", empty: "commitments land here via /decide" },
    { key: "superseded", label: "superseded", empty: "reversals keep both records — none yet" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="The system"
        title="The Loop"
        intro={
          <>
            <Gloss term="the loop">Every input runs the same five-step cycle</Gloss> — the brain
            isn&apos;t a pile of notes, it&apos;s this loop running week after week. Counts
            below are live from the workspace.
          </>
        }
      />

      {/* ——— the cycle ——— */}
      <section className="rise rise-2 mb-10">
        <div className="grid gap-2 lg:grid-cols-5">
          {stages.map((s, i) => (
            <div key={s.name} className="relative">
              <Link href={s.href} className="block h-full">
                <Panel className="h-full !p-4 transition-colors hover:border-hairline-strong">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-ink-faint">0{s.n}</span>
                    <s.icon className="text-ink-subtle" width={14} height={14} />
                  </div>
                  <div className="mt-2 text-[13.5px] font-semibold tracking-tight text-ink">
                    {s.name}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-display text-[22px] text-ink">{s.count}</span>
                    <span className="text-[11.5px] text-ink-faint">{s.unit}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-ink-subtle">
                    {s.gloss}
                  </p>
                </Panel>
              </Link>
              {i < stages.length - 1 ? (
                <Icons.arrowRight className="absolute -right-[9px] top-1/2 z-10 hidden -translate-y-1/2 text-ink-faint lg:block" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-faint">
          <Icons.loop />
          the sweep feeds back into what gets ingested next — that&apos;s what makes it a loop,
          not a pipeline
        </p>
      </section>

      {/* ——— follow an artifact through ——— */}
      <section className="rise rise-3 mb-10">
        <SectionLabel count={ingested.length}>
          Follow an artifact through the loop
        </SectionLabel>
        <p className="mb-3 max-w-[70ch] text-[13px] text-ink-subtle">
          Pick any input and see its actual journey: preserved verbatim → synthesized →
          propagated into the files it changed. Every hop is a real citation, walkable to the
          original.
        </p>
        {ingested.length ? (
          <div className="space-y-2">
            {ingested.map((a, idx) => (
              <details
                key={a.path}
                open={idx === 0}
                className="group panel overflow-hidden !p-0"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                  <Icons.arrowRight className="text-ink-faint transition-transform group-open:rotate-90" />
                  <KindChip kind={a.kind} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink-muted group-open:text-ink">
                    {a.title}
                  </span>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {formatDateShort(a.date)} · {a.routedTo.length} files touched
                  </span>
                </summary>
                <div className="border-t border-hairline bg-surface-2/40 px-4 py-4">
                  <div className="grid gap-3 md:grid-cols-[200px_200px_1fr]">
                    {/* hop 1: source */}
                    <div>
                      <div className="text-eyebrow mb-1.5">1 · verbatim anchor</div>
                      {a.sourcePath ? (
                        <Chip sem="teal" icon="file" href={hrefFor(a.sourcePath)}>
                          source/{a.sourcePath.split("/").slice(1).join("/")}
                        </Chip>
                      ) : (
                        <span className="text-[12px] italic text-ink-faint">
                          no source anchor found
                        </span>
                      )}
                    </div>
                    {/* hop 2: synthesis */}
                    <div>
                      <div className="text-eyebrow mb-1.5">2 · synthesized record</div>
                      <Chip sem="blue" icon="file" href={hrefFor(a.path)}>
                        ingestion/{a.path.split("/").slice(1).join("/")}
                      </Chip>
                    </div>
                    {/* hop 3: fan-out */}
                    <div>
                      <div className="text-eyebrow mb-1.5">
                        3 · propagated to {a.routedTo.length} file
                        {a.routedTo.length === 1 ? "" : "s"}
                      </div>
                      {a.routedTo.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {a.routedTo.map((l) => (
                            <Chip
                              key={l.path}
                              sem="gray"
                              href={hrefFor(l.path)}
                              title={<span className="font-mono text-[11px]">{l.path}</span>}
                            >
                              {l.area} · {l.label.length > 34 ? l.label.slice(0, 32) + "…" : l.label}
                            </Chip>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[12px] italic text-ink-faint">
                          no downstream citations yet — it hasn&apos;t changed any beliefs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <EmptyState
            what="Each ingested artifact's walk through the five stages."
            why="Nothing has been ingested yet — the loop hasn't turned."
            command="/ingest interview <file>"
          />
        )}
      </section>

      {/* ——— lifecycle tracks ——— */}
      <section className="rise rise-4 mb-10">
        <SectionLabel>Lifecycle — things moving through statuses</SectionLabel>
        <div className="space-y-4">
          <Panel pad={false}>
            <div className="border-b border-hairline px-4 py-2 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
              hypotheses · active → promoted | demoted | killed → archived
            </div>
            <div className="grid gap-px bg-hairline md:grid-cols-4">
              {hypStages.map((st) => {
                const items = allHyps.filter((h) =>
                  st.key === "demoted"
                    ? h.status === "demoted" || h.status === "killed"
                    : h.status === st.key
                );
                return (
                  <div key={st.key} className="bg-surface-1 px-3.5 py-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <StatusChip status={st.key === "demoted" ? "demoted" : st.key} />
                      <span className="font-mono text-[11px] text-ink-faint">
                        {items.length}
                      </span>
                    </div>
                    {items.length ? (
                      <div className="space-y-2">
                        {items.map((h) => (
                          <Link
                            key={h.id}
                            href={`/hypotheses/${h.fileSlug}#${h.code}`}
                            className="block rounded-md border border-hairline bg-surface-2 px-2.5 py-2 transition-colors hover:border-hairline-3"
                          >
                            <div className="truncate text-[12px] text-ink-muted">
                              {h.fileTitle}
                            </div>
                            <div className="mt-0.5 font-mono text-[10.5px] text-ink-faint">
                              {h.code}
                              {h.statusDate ? (
                                <>
                                  {" · "}
                                  <Tip content={`Moved ${formatDate(h.statusDate)} — relative time is anchored to the sync date.`}>
                                    <span className="gloss">
                                      {st.key === "active" ? "updated" : st.label}{" "}
                                      {relativeToSync(h.statusDate, brain.asOf)}
                                    </span>
                                  </Tip>
                                </>
                              ) : null}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11.5px] italic leading-relaxed text-ink-faint">
                        {st.empty}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel pad={false}>
            <div className="border-b border-hairline px-4 py-2 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
              decisions · pending → decided → superseded (append-only; reversal = a new decision)
            </div>
            <div className="grid gap-px bg-hairline md:grid-cols-3">
              {decStages.map((st) => {
                const items = brain.decisions.filter((d) => (d.status ?? "pending") === st.key);
                return (
                  <div key={st.key} className="bg-surface-1 px-3.5 py-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <StatusChip status={st.key} />
                      <span className="font-mono text-[11px] text-ink-faint">
                        {items.length}
                      </span>
                    </div>
                    {items.length ? (
                      <div className="space-y-2">
                        {items.map((d) => (
                          <Link
                            key={d.slug}
                            href={`/decisions/${d.slug}`}
                            className="block rounded-md border border-hairline bg-surface-2 px-2.5 py-2 transition-colors hover:border-hairline-3"
                          >
                            <div className="line-clamp-2 text-[12px] leading-snug text-ink-muted">
                              {d.title}
                            </div>
                            <div className="mt-0.5 font-mono text-[10.5px] text-ink-faint">
                              {formatDateShort(d.date)} · {relativeToSync(d.date, brain.asOf)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11.5px] italic leading-relaxed text-ink-faint">
                        {st.empty}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* ——— command registry ——— */}
        <section className="rise rise-5">
          <SectionLabel count={brain.commands.length}>
            The commands — parsed from the workspace, not hardcoded
          </SectionLabel>
          {brain.commands.length ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {brain.commands.map((c) => (
                  <div key={c.command} className="panel !rounded-lg px-3.5 py-2.5">
                    <code className="font-mono text-[12.5px] text-ink">{c.command}</code>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-subtle">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 max-w-[64ch] text-[12px] leading-relaxed text-ink-faint">
                This registry renders whatever <span className="font-mono">INDEX.md</span>{" "}
                lists — add a command (or a PM Skills module) to the workspace and it appears
                here. Running commands from the dashboard is Phase 2, localhost-only.
              </p>
            </>
          ) : (
            <EmptyState
              what="The workspace's slash-command set."
              why="No Quick-triggers section found in INDEX.md."
            />
          )}
        </section>

        {/* ——— everything that has moved ——— */}
        <section className="rise rise-5">
          <SectionLabel count={brain.events.length}>Every turn of the loop</SectionLabel>
          <Panel className="max-h-[560px] overflow-y-auto">
            <Timeline events={brain.events} asOf={brain.asOf} dense />
          </Panel>
        </section>
      </div>
    </div>
  );
}
