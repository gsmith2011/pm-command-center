import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { hrefFor } from "@/lib/brain/routes";
import { formatDate } from "@/lib/semantics";
import { PageHeader, Panel, EmptyState, SectionLabel, RailLink } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Prose } from "@/components/prose";
import { Gloss } from "@/components/tip";

export const metadata: Metadata = { title: "Product" };

export default async function ProductPage() {
  const brain = await loadBrain();
  const m = brain.metrics;
  const activation = m?.stages.find((s) => /activation/i.test(s.name));
  const northNumber = activation?.current?.match(/~?(\d{1,3})%/)?.[1];

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Product"
        intro={
          <>
            Metrics with their caveats worn openly, the feature roster, and the roadmap. A
            number here is never quietly promoted to a cause —{" "}
            <Gloss term="watch item">watch items</Gloss> stay correlational until the
            methodology says otherwise.
          </>
        }
      />

      <div className="space-y-9">
        <section id="metrics" className="rise rise-2 scroll-mt-16">
          <SectionLabel>Metrics</SectionLabel>
          {m ? (
            <>
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <Panel className="border-l-2 !border-l-accent">
                  <div className="text-eyebrow">North-star</div>
                  <div className="mt-2">
                    <Prose md={m.northStar ?? ""} from={m.path} className="!text-[14px]" />
                  </div>
                </Panel>
                {activation ? (
                  <Panel>
                    <div className="text-eyebrow">Activation — the active OKR</div>
                    <div className="mt-1 flex items-baseline gap-3">
                      {northNumber ? (
                        <span className="text-display text-[34px] text-ink">
                          {northNumber}
                          <span className="text-[20px] text-ink-subtle">%</span>
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1">
                      <Prose
                        md={activation.current ?? ""}
                        from={m.path}
                        className="!text-[12.5px]"
                      />
                    </div>
                    {activation.watchItems.map((w, i) => (
                      <div
                        key={i}
                        className="mt-3 rounded-lg border border-sem-yellow/25 bg-sem-yellow/[0.05] px-3.5 py-2.5"
                      >
                        <Gloss term="watch item">
                          <span className="text-eyebrow !text-sem-yellow">watch item</span>
                        </Gloss>
                        <div className="mt-1">
                          <Prose md={w} from={m.path} className="!text-[12.5px]" />
                        </div>
                      </div>
                    ))}
                  </Panel>
                ) : null}
              </div>

              <Panel pad={false} className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-2 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
                      <th className="px-4 py-2.5 font-medium">Stage</th>
                      <th className="px-4 py-2.5 font-medium">Current</th>
                      <th className="px-4 py-2.5 font-medium">Definition</th>
                      <th className="px-4 py-2.5 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline align-top">
                    {m.stages.map((s) => {
                      const todo = /^TODO/i.test(s.current ?? "");
                      return (
                        <tr key={s.name}>
                          <td className="px-4 py-2.5 font-medium text-ink">{s.name}</td>
                          <td className="max-w-[340px] px-4 py-2.5">
                            {todo ? (
                              <span className="text-ink-faint">
                                not yet tracked —{" "}
                                <span className="italic">
                                  {(s.current ?? "").replace(/^TODO\s*[—–-]?\s*/i, "") ||
                                    "an honest gap, not a hidden one"}
                                </span>
                              </span>
                            ) : (
                              <Prose md={s.current ?? ""} from={m.path} className="!text-[12.5px]" />
                            )}
                          </td>
                          <td className="max-w-[280px] px-4 py-2.5 text-ink-subtle">
                            {/^TODO/i.test(s.definition ?? "") ? (
                              <span className="text-ink-faint">TODO</span>
                            ) : (
                              <Prose
                                md={s.definition ?? "—"}
                                from={m.path}
                                className="!text-[12.5px]"
                              />
                            )}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink-faint">
                            {/^TODO/i.test(s.source ?? "") ? "TODO" : s.source}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Panel>

              {m.recentMovements.length ? (
                <div className="mt-4">
                  <SectionLabel>Recent movements</SectionLabel>
                  <ul className="space-y-2">
                    {m.recentMovements.map((mv, i) => (
                      <li key={i} className="panel px-4 py-2.5">
                        <Prose md={mv} from={m.path} className="!text-[13px]" />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              what="Current metric values with definitions and sources — the AARRR funnel plus the north star."
              why="knowledge/product/metrics.md hasn't been populated."
              command="/ingest adhoc (an analytics snapshot)"
            />
          )}
        </section>

        <section id="features" className="rise rise-3 scroll-mt-16">
          <SectionLabel count={brain.features.length}>Features</SectionLabel>
          {brain.features.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {brain.features.map((f) => (
                <Panel key={f.slug} className="transition-colors hover:border-hairline-strong">
                  <div className="flex items-start justify-between gap-2">
                    <RailLink href={hrefFor(f.path)} label={f.title} meta="" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 px-2">
                    {f.status ? <Chip sem={/ship/i.test(f.status) ? "green" : "blue"}>{f.status.split("—")[0].trim()}</Chip> : null}
                    {f.lastUpdated ? (
                      <span className="font-mono text-[11px] text-ink-faint">
                        updated {formatDate(f.lastUpdated)}
                      </span>
                    ) : null}
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="One canonical file per feature: problem, target users, success metrics, risks, dependencies."
              why="No feature files yet — they get written when work starts."
              command="/risk <feature-slug> scaffolds one"
            />
          )}
        </section>

        <section id="roadmap" className="rise rise-4 scroll-mt-16">
          <SectionLabel>Roadmap</SectionLabel>
          {brain.roadmap.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {brain.roadmap
                .filter((b) => b.items.length || /now|next|later/i.test(b.name))
                .map((b) => (
                  <Panel key={b.name} pad={false}>
                    <div className="border-b border-hairline bg-surface-2 px-4 py-2 font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
                      {b.name}
                    </div>
                    <div className="space-y-2.5 px-4 py-3">
                      {b.items.length ? (
                        b.items.map((it, i) => (
                          <Prose
                            key={i}
                            md={it.md}
                            from="knowledge/product/roadmap.md"
                            className="!text-[12.5px]"
                          />
                        ))
                      ) : (
                        <p className="text-[12px] italic text-ink-faint">empty</p>
                      )}
                    </div>
                  </Panel>
                ))}
            </div>
          ) : (
            <EmptyState
              what="Now / Next / Later, plus what was parked or killed and why."
              why="No roadmap written yet."
            />
          )}
        </section>
      </div>
    </div>
  );
}
