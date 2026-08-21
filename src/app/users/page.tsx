import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { PageHeader, Panel, EmptyState, SectionLabel } from "@/components/ui";
import { Chip, ProvenanceChip } from "@/components/chips";
import { ClaimRow } from "@/components/evidence";
import { Prose } from "@/components/prose";
import { Gloss } from "@/components/tip";
import { formatDate } from "@/lib/semantics";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const brain = await loadBrain();
  const insights = brain.insights;
  const segments = brain.knowledgeStubs.find((k) => k.path === "knowledge/users/segments.md");

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Users"
        intro={
          <>
            Durable user knowledge — themes that crossed the promotion bar (recurring,
            decision-relevant, multi-source), <Gloss term="contradiction">preserved
            disagreements</Gloss>, personas, and what was weighed and set aside.
          </>
        }
      />

      <div className="space-y-9">
        {/* Active themes */}
        <section className="rise rise-2">
          <SectionLabel count={insights?.themes.length}>Active themes</SectionLabel>
          {insights?.themes.length ? (
            <div className="space-y-4">
              {insights.themes.map((t) => (
                <Panel key={t.title}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="max-w-[62ch] text-[15px] font-semibold leading-snug tracking-tight text-ink">
                      {t.title}
                    </h3>
                    {t.promotedDate ? (
                      <Chip
                        sem="teal"
                        icon="pulse"
                        title="Promoted into durable knowledge when it recurred across independent sources — one-off observations stay in working memory."
                      >
                        promoted {formatDate(t.promotedDate)}
                      </Chip>
                    ) : null}
                  </div>
                  {t.evidence.length ? (
                    <div className="mt-3">
                      <div className="text-eyebrow mb-1">
                        Evidence — one row per source, each named
                      </div>
                      <ul className="divide-y divide-hairline">
                        {t.evidence.map((r, i) => (
                          <ClaimRow key={i} row={r} from={insights.path} />
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {t.relevance ? (
                    <div className="mt-3 rounded-lg bg-surface-2 px-3.5 py-2.5">
                      <div className="text-eyebrow mb-1">Why it matters now</div>
                      <Prose md={t.relevance} from={insights.path} className="!text-[13.5px]" />
                    </div>
                  ) : null}
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="Synthesized user themes shaping current work."
              why="Nothing has crossed the promotion bar yet — themes need to recur across independent sources."
              command="/ingest interview <file>"
            />
          )}
        </section>

        {/* Contradictions — two-sided, never flattened */}
        <section className="rise rise-3">
          <SectionLabel count={insights?.contradictions.length}>
            Contradictions — preserved, not averaged
          </SectionLabel>
          {insights?.contradictions.length ? (
            <div className="space-y-4">
              {insights.contradictions.map((c) => (
                <Panel key={c.title}>
                  <h3 className="max-w-[62ch] text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {c.sides.map((side) => (
                      <div
                        key={side.label}
                        className="rounded-lg border border-hairline bg-surface-2/70 px-4 py-3"
                      >
                        <div className="text-eyebrow mb-1.5">{side.label}</div>
                        <Prose md={side.md} from={insights.path} className="!text-[13.5px]" />
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {side.tags.map((t, i) => (
                            <ProvenanceChip key={i} tag={t} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {c.whyPreserved ? (
                    <div className="mt-3 border-l-2 border-sem-purple/40 pl-3.5">
                      <div className="text-eyebrow mb-1 !text-sem-purple">Why both sides stay</div>
                      <Prose md={c.whyPreserved} from={insights.path} className="!text-[13.5px]" />
                    </div>
                  ) : null}
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="Where users genuinely disagree — both sides kept with their own evidence."
              why="No preserved contradictions yet. When evidence conflicts, it lands here instead of being averaged into false consensus."
            />
          )}
        </section>

        {/* Personas */}
        <section className="rise rise-4">
          <SectionLabel count={brain.personas.length}>Personas</SectionLabel>
          {brain.personas.length ? (
            <div className="space-y-4">
              {brain.personas.map((p) => (
                <Panel key={p.title}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <div className="flex gap-2">
                      {p.status ? (
                        <Chip
                          sem={p.status === "active" ? "teal" : "gray"}
                          title={
                            p.status === "candidate"
                              ? "A possible distinct segment, not yet supported by enough independent evidence to be active."
                              : "Supported by 2+ independent accounts."
                          }
                        >
                          {p.status}
                        </Chip>
                      ) : null}
                      {p.lastRevised ? (
                        <span className="font-mono text-[11px] text-ink-faint">
                          revised {formatDate(p.lastRevised)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Prose md={p.md} from="knowledge/users/personas.md" />
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="Motivational archetypes with jobs-to-be-done, observed behaviors, and sourced pains."
              why="No personas yet — they form when interviews reveal a coherent segment."
              command="/ingest interview <file>"
            />
          )}
        </section>

        {/* Retired */}
        <section className="rise rise-5">
          <SectionLabel count={insights?.retired.length}>
            Retired — weighed and set aside
          </SectionLabel>
          {insights?.retired.length ? (
            <div className="space-y-4">
              {insights.retired.map((r) => (
                <Panel key={r.title} className="border-dashed opacity-90">
                  <h3 className="text-[14px] font-medium tracking-tight text-ink-muted">
                    {r.title}
                  </h3>
                  <div className="mt-2.5">
                    <Prose md={r.md} from={insights.path} className="!text-[13.5px]" />
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="Themes that didn't hold — kept with the reason and a revival condition, so they aren't re-litigated."
              why="Nothing retired yet."
            />
          )}
        </section>

        {/* Segments — honest stub */}
        {segments ? (
          <section className="rise rise-5">
            <SectionLabel>Segments</SectionLabel>
            <Panel>
              <Prose md={segments.sections.map((s) => s.md).join("\n\n")} from={segments.path} />
            </Panel>
          </section>
        ) : null}
      </div>
    </div>
  );
}
