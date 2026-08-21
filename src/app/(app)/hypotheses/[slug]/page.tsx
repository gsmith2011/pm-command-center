import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { RISK_AREA_META, formatDate, relativeToSync } from "@/lib/semantics";
import { hrefFor } from "@/lib/brain/routes";
import { PageHeader, Panel, RailLink, SectionLabel } from "@/components/ui";
import { StatusChip, ConfidenceChip, Chip } from "@/components/chips";
import { EvidenceBalance } from "@/components/evidence";
import { Prose } from "@/components/prose";
import { Gloss, Tip } from "@/components/tip";

export const dynamicParams = false;

export async function generateStaticParams() {
  const brain = await loadBrain();
  return brain.hypotheses.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brain = await loadBrain();
  const file = brain.hypotheses.find((h) => h.slug === slug);
  return { title: file ? file.title : "Hypotheses" };
}

export default async function HypothesisDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brain = await loadBrain();
  const file = brain.hypotheses.find((h) => h.slug === slug);
  if (!file) notFound();

  const backlinks = brain.backlinks[file.path] ?? [];
  const areas = Object.entries(file.riskAreas);

  return (
    <div>
      <PageHeader
        eyebrow="Hypotheses · feature file"
        title={file.title}
        filePath={`hypotheses/${file.slug}.md`}
        right={<StatusChip status={file.status} />}
        intro={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-ink-subtle">
            {file.created ? <span>opened {formatDate(file.created)}</span> : null}
            {file.lastUpdated ? (
              <span>
                last updated {formatDate(file.lastUpdated)} ·{" "}
                {relativeToSync(file.lastUpdated, brain.asOf)}
              </span>
            ) : null}
          </span>
        }
      />

      {/* feature pointer — honest even when the target doesn't exist yet */}
      {file.feature ? (
        <div className="rise rise-2 mb-6">
          {file.feature.exists && file.feature.path ? (
            <Chip sem="gray" icon="file" href={hrefFor(file.feature.path)}>
              feature: {file.feature.path.split("/").pop()}
            </Chip>
          ) : (
            <Tip
              content={
                <span>
                  The file points its feature at{" "}
                  <span className="font-mono text-[11px]">{file.feature.path}</span>
                  {file.feature.note ? (
                    <>
                      {" "}
                      and notes: <i>{file.feature.note}</i>
                    </>
                  ) : null}
                  . The gap is rendered, not hidden — the workspace&apos;s own sweep tracks it.
                </span>
              }
            >
              <span>
                <Chip sem="yellow" icon="file" dashed>
                  feature: {file.feature.path?.split("/").pop() ?? "—"} · not yet created
                </Chip>
              </span>
            </Tip>
          )}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_264px]">
        <div className="min-w-0 space-y-8">
          {areas.map(([areaKey, hyps]) => {
            const meta = RISK_AREA_META[areaKey];
            return (
              <section key={areaKey} className="rise rise-3">
                <Gloss term="risk areas">
                  <SectionLabel>
                    {meta.label} risk · {meta.code}*
                  </SectionLabel>
                </Gloss>
                <div className="space-y-6">
                  {(hyps ?? []).map((h) => (
                    <Panel key={h.code} className="scroll-mt-20" >
                      <div id={h.code}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="max-w-[60ch] text-[15.5px] font-semibold leading-snug tracking-tight text-ink">
                          <span className="mr-2 font-mono text-[12px] font-normal text-ink-subtle">
                            {h.code}
                          </span>
                          {h.belief}
                        </h3>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <ConfidenceChip confidence={h.confidence} />
                          <StatusChip status={h.status} date={h.statusDate} />
                        </div>
                      </div>
                      {h.origin ? (
                        <p className="mt-1.5 font-mono text-[11.5px] text-ink-faint">
                          origin: {h.origin}
                        </p>
                      ) : null}

                      <div className="mt-4">
                        <EvidenceBalance
                          evidenceFor={h.evidenceFor}
                          evidenceAgainst={h.evidenceAgainst}
                          from={file.path}
                        />
                      </div>

                      {h.openQuestions.length ? (
                        <div className="mt-5">
                          <div className="text-eyebrow mb-2">
                            Open questions &amp; caveats
                            <Tip content="Meta-commentary about the evidence — gaps, inferences, sample-size caveats. Kept apart from Evidence so the trail stays falsifiable.">
                              <span className="gloss ml-1.5 normal-case tracking-normal">
                                why separate?
                              </span>
                            </Tip>
                          </div>
                          <ul className="space-y-2.5 border-l-2 border-hairline pl-4">
                            {h.openQuestions.map((q, i) => (
                              <li key={i}>
                                <Prose md={q} from={file.path} className="!text-[13.5px]" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="mt-5 grid gap-3 text-[13px] sm:grid-cols-2">
                        {h.test ? (
                          <div className="rounded-lg bg-surface-2 px-3.5 py-2.5">
                            <div className="text-eyebrow mb-1">Test</div>
                            <Prose md={h.test} from={file.path} className="!text-[13.5px]" />
                          </div>
                        ) : null}
                        {h.decisionTrigger ? (
                          <div className="rounded-lg bg-surface-2 px-3.5 py-2.5">
                            <div className="text-eyebrow mb-1">
                              Decision trigger
                              <Tip content="Written before the evidence arrives: what result promotes this, what demotes it. The bar the hypothesis must clear — set in advance so the call isn't made after the fact.">
                                <span className="gloss ml-1.5 normal-case tracking-normal">?</span>
                              </Tip>
                            </div>
                            <Prose
                              md={h.decisionTrigger}
                              from={file.path}
                              className="!text-[13.5px]"
                            />
                          </div>
                        ) : null}
                      </div>

                      {h.resolution ? (
                        <div className="mt-4 rounded-lg border border-sem-green/25 bg-sem-green/[0.05] px-3.5 py-2.5">
                          <div className="text-eyebrow mb-1 !text-sem-green">Resolution</div>
                          <Prose md={h.resolution} from={file.path} className="!text-[13.5px]" />
                        </div>
                      ) : null}
                      </div>
                    </Panel>
                  ))}
                </div>
              </section>
            );
          })}

          {file.extraSections.map((s) => (
            <section key={s.title} className="rise rise-4">
              <SectionLabel>{s.title}</SectionLabel>
              <Panel>
                <Prose md={s.md} from={file.path} />
              </Panel>
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rise rise-4">
            <SectionLabel>How this changes</SectionLabel>
            <p className="text-[12.5px] leading-relaxed text-ink-subtle">
              Status reflects the workflow, not edits here. Evidence lands via{" "}
              <code className="font-mono text-[11.5px]">/ingest</code>, promotion happens in{" "}
              <code className="font-mono text-[11.5px]">/hypothesize</code> or{" "}
              <code className="font-mono text-[11.5px]">/review</code> — and a promotion always
              creates its paired decision record.
            </p>
          </div>
          {backlinks.length ? (
            <div className="rise rise-5">
              <SectionLabel count={backlinks.length}>Cited by</SectionLabel>
              <div className="space-y-0.5">
                {backlinks.map((b, i) => (
                  <RailLink
                    key={i}
                    href={hrefFor(b.fromPath)}
                    label={b.fromTitle}
                    meta={b.fromArea}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div className="rise rise-5">
            <SectionLabel>Rivals in this investigation</SectionLabel>
            <div className="space-y-0.5">
              {brain.hypotheses
                .filter((h) => h.slug !== file.slug)
                .map((h) => (
                  <RailLink
                    key={h.slug}
                    href={`/hypotheses/${h.slug}`}
                    label={h.title}
                    meta={h.status ?? ""}
                  />
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
