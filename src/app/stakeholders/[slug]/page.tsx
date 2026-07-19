import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { hrefFor } from "@/lib/brain/routes";
import { PageHeader, Panel, RailLink, SectionLabel } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Prose } from "@/components/prose";

export async function generateStaticParams() {
  const brain = await loadBrain();
  return brain.stakeholders.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brain = await loadBrain();
  const s = brain.stakeholders.find((x) => x.slug === slug);
  return { title: s ? s.name : "Stakeholder" };
}

export default async function StakeholderDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brain = await loadBrain();
  const s = brain.stakeholders.find((x) => x.slug === slug);
  if (!s) notFound();

  const backlinks = brain.backlinks[s.path] ?? [];
  const days = s.lastTouched
    ? Math.round((Date.parse(brain.asOf) - Date.parse(s.lastTouched)) / 86400000)
    : null;
  const highInfluence = (s.influence ?? "").toLowerCase().startsWith("high");
  const overdue = highInfluence && (days === null || days > 21);
  // decisions where this person is named in the Linked section
  const involvedDecisions = brain.decisions.filter((d) =>
    (d.linkedMd ?? "").includes(s.slug)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Stakeholders"
        title={s.name}
        filePath={`stakeholders/${s.slug}.md`}
        intro={s.role ?? undefined}
        right={
          <div className="flex flex-wrap items-center gap-2">
            {overdue ? (
              <Chip
                sem="orange"
                icon="clock"
                title="High-influence stakeholders untouched for 3+ weeks are relationship debt — the weekly sweep flags them."
              >
                {days === null ? "never touched" : `untouched ${days}d`}
              </Chip>
            ) : s.lastTouched ? (
              <Chip sem="gray" icon="clock">
                touched {relativeToSync(s.lastTouched, brain.asOf)}
              </Chip>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_264px]">
        <div className="min-w-0 space-y-6">
          {s.sections.map((sec, i) => (
            <section key={sec.title} className={`rise rise-${Math.min(i + 2, 5)}`}>
              <SectionLabel>{sec.title}</SectionLabel>
              <Panel>
                <Prose md={sec.md} from={s.path} />
              </Panel>
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rise rise-3">
            <SectionLabel>At a glance</SectionLabel>
            <dl className="space-y-2.5 text-[12.5px]">
              <div>
                <dt className="text-ink-faint">Influence on the work</dt>
                <dd className="text-ink-muted">{s.influence ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Friction</dt>
                <dd className="text-ink-muted">{s.friction ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Last touched</dt>
                <dd className="font-mono text-ink-muted">
                  {s.lastTouched ? formatDate(s.lastTouched) : "never"}
                </dd>
              </div>
            </dl>
          </div>

          {involvedDecisions.length ? (
            <div className="rise rise-4">
              <SectionLabel count={involvedDecisions.length}>Named in decisions</SectionLabel>
              <div className="space-y-0.5">
                {involvedDecisions.map((d) => (
                  <RailLink
                    key={d.slug}
                    href={`/decisions/${d.slug}`}
                    label={d.title}
                    meta={d.status ?? ""}
                  />
                ))}
              </div>
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

          <div className="rise rise-5">
            <SectionLabel>Prep for a touchpoint</SectionLabel>
            <p className="text-[12.5px] leading-relaxed text-ink-subtle">
              <code className="font-mono text-[11.5px]">/prep {s.slug}</code> assembles this
              file, recent touchpoints, and any open decisions naming{" "}
              {s.name.split(" ")[0]} into a one-page brief.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
