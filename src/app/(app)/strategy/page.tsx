import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, EmptyState, SectionLabel } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Prose } from "@/components/prose";
import { Gloss, Tip } from "@/components/tip";

export const metadata: Metadata = { title: "Strategy" };

export default async function StrategyPage() {
  const brain = await loadBrain();
  const s = brain.strategy;

  if (!s) {
    return (
      <div>
        <PageHeader eyebrow="Knowledge" title="Strategy" />
        <EmptyState
          what="The north star: the one metric everything serves, quarter priorities, explicit non-goals, and open tensions."
          why="knowledge/strategy.md hasn't been written yet."
          command="edit knowledge/strategy.md, then /strategy-check keeps work honest against it"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Strategy"
        filePath="knowledge/strategy.md"
        intro={
          <>
            Loaded before any prioritization or review. Updated only deliberately —{" "}
            <Gloss term="tension">drift is surfaced as tensions</Gloss>, never silently
            absorbed.
          </>
        }
        right={
          s.lastReviewed ? (
            <Chip sem="gray" icon="clock" title="Strategy assumptions are reviewed quarterly per the sweep's staleness windows.">
              reviewed {formatDate(s.lastReviewed)}
            </Chip>
          ) : undefined
        }
      />

      <div className="space-y-8">
        <section className="rise rise-2">
          <SectionLabel>North-star metric</SectionLabel>
          <Panel className="border-l-2 !border-l-accent">
            <Gloss term="north-star metric">
              <span className="text-eyebrow">the one metric everything serves</span>
            </Gloss>
            <div className="mt-2">
              <Prose md={s.northStar ?? ""} from={s.path} className="!text-[15px]" />
            </div>
          </Panel>
        </section>

        <section className="rise rise-3">
          <SectionLabel count={s.priorities.length}>1–2 quarter priorities</SectionLabel>
          <ol className="space-y-3">
            {s.priorities.map((p, i) => (
              <li key={i} className="panel flex gap-4 p-4">
                <span className="text-display text-[22px] text-ink-faint">{i + 1}</span>
                <Prose md={p} from={s.path} />
              </li>
            ))}
          </ol>
        </section>

        <section className="rise rise-4">
          <SectionLabel count={s.nonGoals.length}>
            Explicit non-goals
            <Tip content="What is deliberately NOT being done this period — the file calls this its most valuable section, because unwritten non-goals silently un-decide themselves.">
              <span className="gloss ml-2 normal-case tracking-normal">
                why this section matters
              </span>
            </Tip>
          </SectionLabel>
          {s.nonGoals.length ? (
            <ul className="space-y-3">
              {s.nonGoals.map((n, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-dashed border-hairline-strong bg-surface-1/60 px-4 py-3"
                >
                  <span className="mt-1 font-mono text-[12px] text-ink-faint">✕</span>
                  <Prose md={n} from={s.path} className="!text-[13.5px]" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              what="What the team is deliberately not doing."
              why="No non-goals written — the most valuable section is empty."
            />
          )}
        </section>

        <section className="rise rise-5">
          <SectionLabel count={s.tensions.length}>
            Tensions — held open, resolved deliberately
          </SectionLabel>
          {s.tensions.length ? (
            <div className="space-y-4">
              {s.tensions.map((t) => (
                <Panel key={t.id} className="border-sem-yellow/25">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="flex items-baseline gap-2.5 text-[15px] font-semibold tracking-tight text-ink">
                      <span className="font-mono text-[12px] text-sem-yellow">{t.id}</span>
                      {t.title}
                    </h3>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {t.forcingDate ? (
                        <Tip content="A forcing date: if the tension isn't resolved by then, a linked decision self-supersedes. Deadlines here are real, not decorative.">
                          <span>
                            <Chip sem="orange" icon="clock">
                              forcing {formatDate(t.forcingDate)} ·{" "}
                              {relativeToSync(t.forcingDate, brain.asOf)?.startsWith("in")
                                ? relativeToSync(t.forcingDate, brain.asOf)
                                : "past"}
                            </Chip>
                          </span>
                        </Tip>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Prose md={t.md} from={s.path} />
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <EmptyState
              what="Conflicts between real signals and stated strategy, held open until the PM resolves them."
              why="No tensions right now — only recurring, decision-relevant conflicts earn an entry, so an empty section is a good sign, not a blind spot."
              command="/strategy-check"
            />
          )}
        </section>
      </div>
    </div>
  );
}
