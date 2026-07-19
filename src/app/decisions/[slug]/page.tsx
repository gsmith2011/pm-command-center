import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { hrefFor } from "@/lib/brain/routes";
import { PageHeader, Panel, RailLink, SectionLabel } from "@/components/ui";
import { StatusChip, Chip } from "@/components/chips";
import { ClaimRow } from "@/components/evidence";
import { Prose } from "@/components/prose";
import { Gloss, Tip } from "@/components/tip";
import { Icons } from "@/components/icons";

export const dynamicParams = false;

export async function generateStaticParams() {
  const brain = await loadBrain();
  return brain.decisions.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brain = await loadBrain();
  const d = brain.decisions.find((x) => x.slug === slug);
  return { title: d ? d.title : "Decision" };
}

export default async function DecisionDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brain = await loadBrain();
  const d = brain.decisions.find((x) => x.slug === slug);
  if (!d) notFound();

  const backlinks = brain.backlinks[d.path] ?? [];
  const reversalDates = d.reversal.items
    .map((i) => i.match(/\d{4}-\d{2}-\d{2}/)?.[0])
    .filter(Boolean) as string[];

  return (
    <div>
      <PageHeader
        eyebrow="Decisions · append-only record"
        title={d.title}
        filePath={`decisions/${d.slug}.md`}
        right={<StatusChip status={d.status} />}
        intro={
          <span className="font-mono text-[12px] text-ink-subtle">
            {formatDate(d.date)} · {relativeToSync(d.date, brain.asOf)}
          </span>
        }
      />

      {/* The record's own status nuance — unmissable, in the file's words */}
      {d.statusNote ? (
        <div className="rise rise-2 mb-6 flex items-start gap-3 rounded-lg border border-sem-yellow/30 bg-sem-yellow/[0.06] px-4 py-3">
          <Icons.alert className="mt-0.5 shrink-0 text-sem-yellow" />
          <div>
            <div className="text-eyebrow !text-sem-yellow">Status nuance — from the record</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
              {d.statusNote.replace(/^·\s*/, "")}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-7">
          {d.context ? (
            <section className="rise rise-2">
              <SectionLabel>Context</SectionLabel>
              <Prose md={d.context} from={d.path} />
            </section>
          ) : null}

          {d.options.length ? (
            <section className="rise rise-3">
              <SectionLabel count={d.options.length}>Options considered</SectionLabel>
              <ol className="space-y-2">
                {d.options.map((o, i) => {
                  const chosen = /←\s*chosen|\bchosen\b/i.test(o);
                  return (
                    <li
                      key={i}
                      className={`flex gap-3 rounded-lg border px-4 py-2.5 ${
                        chosen
                          ? "border-sem-green/30 bg-sem-green/[0.05]"
                          : "border-hairline bg-surface-1"
                      }`}
                    >
                      <span
                        className={`font-mono text-[12px] ${chosen ? "text-sem-green" : "text-ink-faint"}`}
                      >
                        {i + 1}
                      </span>
                      <Prose
                        md={o.replace(/←\s*chosen/i, "")}
                        from={d.path}
                        className="!text-[13.5px]"
                      />
                      {chosen ? (
                        <span className="ml-auto shrink-0">
                          <Chip sem="green" icon="check">
                            chosen
                          </Chip>
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          {d.decision ? (
            <section className="rise rise-3">
              <SectionLabel>The decision</SectionLabel>
              <Panel className="border-l-2 !border-l-accent">
                <Prose md={d.decision} from={d.path} />
              </Panel>
            </section>
          ) : null}

          {d.why ? (
            <section className="rise rise-4">
              <SectionLabel>Why</SectionLabel>
              <Prose md={d.why} from={d.path} />
            </section>
          ) : null}

          {d.evidence.length ? (
            <section className="rise rise-4">
              <SectionLabel count={d.evidence.length}>
                Evidence — every row wears its provenance
              </SectionLabel>
              <Panel pad={false} className="px-5 py-2">
                <ul className="divide-y divide-hairline">
                  {d.evidence.map((r, i) => (
                    <ClaimRow key={i} row={r} from={d.path} />
                  ))}
                </ul>
              </Panel>
            </section>
          ) : null}

          {d.notDoing.length ? (
            <section className="rise rise-5">
              <SectionLabel count={d.notDoing.length}>Explicitly not doing</SectionLabel>
              <Panel pad={false} className="border-dashed px-5 py-2">
                <ul className="divide-y divide-hairline">
                  {d.notDoing.map((r, i) => (
                    <ClaimRow key={i} row={r} from={d.path} />
                  ))}
                </ul>
              </Panel>
            </section>
          ) : null}

          {d.ambiguities.length ? (
            <section className="rise rise-5">
              <SectionLabel count={d.ambiguities.length}>Remaining ambiguities</SectionLabel>
              <ul className="space-y-2.5 border-l-2 border-hairline pl-4">
                {d.ambiguities.map((a, i) => (
                  <li key={i}>
                    <Prose md={a} from={d.path} className="!text-[13px]" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {d.extraSections.map((s) => (
            <section key={s.title}>
              <SectionLabel>{s.title}</SectionLabel>
              <Prose md={s.md} from={d.path} />
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          {/* Reversal conditions — elevated, first thing in the rail */}
          <div className="rise rise-3">
            <Panel className="border-sem-orange/25 bg-sem-orange/[0.04]">
              <div className="mb-2 flex items-center gap-2">
                <Icons.scale className="text-sem-orange" />
                <Gloss term="reversal condition">
                  <span className="text-eyebrow !text-sem-orange">What would reverse this</span>
                </Gloss>
              </div>
              {d.reversal.items.length ? (
                <ol className="space-y-3">
                  {d.reversal.items.map((r, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="font-mono text-[11px] text-sem-orange/80">{i + 1}</span>
                      <Prose md={r} from={d.path} className="!text-[12.5px]" />
                    </li>
                  ))}
                </ol>
              ) : d.reversal.md ? (
                <Prose md={d.reversal.md} from={d.path} className="!text-[12.5px]" />
              ) : (
                <p className="text-[12.5px] italic text-ink-faint">
                  No reversal condition written — the schema calls this the most valuable field.
                </p>
              )}
              {reversalDates.map((date) => (
                <div key={date} className="mt-3">
                  <Tip content="A date inside a reversal condition acts as a forcing function — if the condition isn't met by then, the decision supersedes itself.">
                    <span>
                      <Chip sem="orange" icon="clock">
                        forcing date {formatDate(date)} ·{" "}
                        {relativeToSync(date, brain.asOf)?.replace(" ago", " past") ??
                          ""}
                      </Chip>
                    </span>
                  </Tip>
                </div>
              ))}
            </Panel>
          </div>

          {d.pending ? (
            <div className="rise rise-4">
              <Panel className="border-sem-yellow/25">
                <div className="text-eyebrow mb-2 !text-sem-yellow">Pending — open fork</div>
                <dl className="space-y-2 text-[12.5px]">
                  {(
                    [
                      ["Blocker impact", d.pending.blockerImpact],
                      ["Deadline", d.pending.deadline],
                      ["Owner", d.pending.owner],
                      ["Missing evidence", d.pending.missingEvidence],
                    ] as const
                  ).map(([k, v]) =>
                    v ? (
                      <div key={k}>
                        <dt className="text-ink-faint">{k}</dt>
                        <dd className="text-ink-muted">{v}</dd>
                      </div>
                    ) : null
                  )}
                </dl>
              </Panel>
            </div>
          ) : null}

          {d.linkedMd ? (
            <div className="rise rise-4">
              <SectionLabel>Connected</SectionLabel>
              <Prose md={d.linkedMd} from={d.path} className="!text-[12.5px]" />
            </div>
          ) : null}

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
        </aside>
      </div>
    </div>
  );
}
