import Link from "next/link";
import { loadBrain } from "@/lib/brain";
import type { HealthFinding } from "@/lib/brain/types";
import { formatDate, relativeToSync } from "@/lib/semantics";
import { Panel, SectionLabel, StatTile, EmptyState } from "@/components/ui";
import { StatusChip, Chip } from "@/components/chips";
import { EvidenceTally } from "@/components/evidence";
import { Timeline } from "@/components/timeline";
import { Prose } from "@/components/prose";
import { Gloss } from "@/components/tip";
import { Icons } from "@/components/icons";

const ATTENTION_ORDER: Record<string, number> = {
  "forcing-date": 0,
  "decision-debt": 1,
  "relationship-debt": 2,
  "orphan-promotion": 3,
  "untagged-evidence": 4,
  "index-drift": 5,
};

const ATTENTION_TITLES: Record<string, string> = {
  "forcing-date": "A deadline is forcing a call",
  "decision-debt": "A decision has been open too long",
  "relationship-debt": "Someone important has gone quiet",
  "orphan-promotion": "A promotion is missing its decision",
  "untagged-evidence": "Claims are missing their provenance",
  "index-drift": "An index disagrees with its files",
};

export default async function Overview() {
  const brain = await loadBrain();

  const needsYou = brain.health
    .filter((h) => h.check in ATTENTION_ORDER)
    .sort((a, b) => ATTENTION_ORDER[a.check] - ATTENTION_ORDER[b.check])
    .slice(0, 3);

  const allHyps = brain.hypotheses.flatMap((f) =>
    Object.values(f.riskAreas)
      .flat()
      .filter((h) => h != null)
      .map((h) => ({ ...h!, fileTitle: f.title, fileSlug: f.slug }))
  );
  const counts = {
    testing: allHyps.filter((h) => h.status === "active").length,
    promoted: allHyps.filter((h) => h.status === "promoted").length,
    withCounter: allHyps.filter((h) => h.evidenceAgainst.length > 0).length,
  };
  const latestDecision = brain.decisions[0];
  const activation = brain.metrics?.stages.find((s) => /activation/i.test(s.name));
  const activationPct = activation?.current?.match(/~?(\d{1,3})%/)?.[1];
  const tension = brain.strategy?.tensions[0];
  const ingestedCount = brain.artifacts.filter((a) => a.layer === "ingestion").length;

  return (
    <div>
      {/* hero */}
      <header className="rise rise-1 mb-8">
        <div className="text-eyebrow mb-2">
          {brain.meta.workspaceName ?? "PM Brain"} · mission control
        </div>
        <h1 className="text-display max-w-[26ch] text-balance text-[32px] text-ink">
          Where things stand, and what needs you
        </h1>
        <p className="mt-2 max-w-[74ch] text-[14px] leading-relaxed text-ink-subtle">
          A product mind, made legible: what&apos;s believed, how well the evidence supports
          it, where people disagree, and what&apos;s been decided — read live from plain
          markdown. Nothing here is invented by the dashboard;{" "}
          <Gloss term="provenance">every claim walks back to its source</Gloss>.
        </p>
      </header>

      {/* north star + counters */}
      <section className="rise rise-2 mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={<Gloss term="north-star metric">north-star metric</Gloss>}
          value={
            <span className="text-[16px] leading-snug">
              {brain.strategy?.northStar?.split(".")[0] ?? "not set"}
            </span>
          }
          href="/strategy"
        />
        <StatTile
          label="activation — the active OKR"
          value={
            activationPct ? (
              <>
                {activationPct}
                <span className="text-[17px] text-ink-subtle">%</span>
              </>
            ) : (
              <span className="text-[16px]">not tracked</span>
            )
          }
          sub={
            activation?.watchItems.length
              ? "correlational watch item — cause unknown, honestly flagged"
              : undefined
          }
          href="/product#metrics"
        />
        <StatTile
          label="bets in play"
          value={counts.testing + counts.promoted}
          sub={`${counts.promoted} validated → decision · ${counts.testing} testing · ${counts.withCounter} with evidence against`}
          href="/hypotheses"
        />
        <StatTile
          label="the loop"
          value={ingestedCount}
          sub={`inputs ingested · ${brain.maintenanceLogs.length} sweeps run · ${brain.events.length} recorded moves`}
          href="/loop"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-8">
          {/* what needs you */}
          <section className="rise rise-3">
            <SectionLabel count={needsYou.length}>
              What needs you — the always-on sweep
            </SectionLabel>
            {needsYou.length ? (
              <div className="space-y-3">
                {needsYou.map((f: HealthFinding, i) => {
                  // forcing-date findings get the same countdown pill Strategy uses,
                  // instead of the "(N days away)" plain text inside the prose
                  const forcingDate =
                    f.check === "forcing-date"
                      ? (f.md.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null)
                      : null;
                  const bodyMd = forcingDate
                    ? f.md.replace(/\s*\(\d+\s*days?\s*(?:away|past)\)/i, "")
                    : f.md;
                  return (
                  <Panel
                    key={i}
                    className={
                      i === 0 ? "border-sem-orange/30 bg-sem-orange/[0.04]" : undefined
                    }
                  >
                    <div className="flex items-start gap-3">
                      <Icons.alert
                        className={`mt-1 shrink-0 ${i === 0 ? "text-sem-orange" : "text-ink-subtle"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-[14px] font-semibold tracking-tight text-ink">
                            {ATTENTION_TITLES[f.check] ?? f.check}
                          </span>
                          {forcingDate ? (
                            <Chip sem="orange" icon="clock">
                              forcing {formatDate(forcingDate)} ·{" "}
                              {relativeToSync(forcingDate, brain.asOf)}
                            </Chip>
                          ) : null}
                        </div>
                        <div className="mt-1">
                          <Prose md={bodyMd} from="INDEX.md" className="!text-[13.5px]" />
                        </div>
                      </div>
                      {f.href ? (
                        <Link
                          href={f.href}
                          className="mt-1 flex shrink-0 items-center gap-1 text-[12px] text-ink-subtle transition-colors hover:text-ink"
                        >
                          open <Icons.arrowRight />
                        </Link>
                      ) : null}
                    </div>
                  </Panel>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                what="The few things worth your attention right now, computed from the brain's own hygiene rules."
                why="Nothing needs you — no debt, no forcing dates, no drift. The loop is healthy."
                command="/review"
              />
            )}
          </section>

          {/* where the work stands */}
          <section className="rise rise-4">
            <SectionLabel>Where the work stands</SectionLabel>
            <div className="space-y-3">
              {allHyps
                .filter((h) => h.status === "promoted")
                .map((h) => (
                  <Panel key={h.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-eyebrow">leading bet — validated</span>
                      <StatusChip status={h.status} date={h.statusDate} />
                    </div>
                    <Link
                      href={`/hypotheses/${h.fileSlug}#${h.code}`}
                      className="mt-1.5 block text-[14.5px] font-medium leading-snug text-ink hover:text-accent-hover"
                    >
                      {h.fileTitle}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <EvidenceTally
                        forCount={h.evidenceFor.length}
                        againstCount={h.evidenceAgainst.length}
                      />
                      <span className="text-[12px] text-ink-faint">
                        {h.confidence} confidence
                      </span>
                    </div>
                  </Panel>
                ))}

              {latestDecision ? (
                <Panel>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-eyebrow">latest decision</span>
                    <span className="flex items-center gap-2">
                      <StatusChip status={latestDecision.status} />
                      <span className="font-mono text-[11px] text-ink-faint">
                        {formatDate(latestDecision.date)}
                      </span>
                    </span>
                  </div>
                  <Link
                    href={`/decisions/${latestDecision.slug}`}
                    className="mt-1.5 block max-w-[64ch] text-[14.5px] font-medium leading-snug text-ink hover:text-accent-hover"
                  >
                    {latestDecision.title}
                  </Link>
                  {latestDecision.statusNote ? (
                    <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-sem-yellow/90">
                      <Icons.alert className="mt-[2px] shrink-0" />
                      {latestDecision.statusNote.replace(/^·\s*/, "")}
                    </p>
                  ) : null}
                </Panel>
              ) : (
                <EmptyState
                  what="The most recent committed choice."
                  why="No decisions logged yet."
                  command="/decide <slug>"
                />
              )}

              {tension ? (
                <Panel className="border-sem-yellow/25">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Gloss term="tension">
                      <span className="text-eyebrow !text-sem-yellow">
                        open strategy tension
                      </span>
                    </Gloss>
                    {tension.forcingDate ? (
                      <Chip sem="orange" icon="clock">
                        forcing {formatDate(tension.forcingDate)}
                      </Chip>
                    ) : null}
                  </div>
                  <Link
                    href="/strategy"
                    className="mt-1.5 block text-[14.5px] font-medium leading-snug text-ink hover:text-accent-hover"
                  >
                    {tension.id}: {tension.title}
                  </Link>
                </Panel>
              ) : null}
            </div>
          </section>
        </div>

        {/* what's moving */}
        <aside className="rise rise-5">
          <div className="mb-3 flex items-baseline justify-between">
            <SectionLabel className="!mb-0">What&apos;s moving</SectionLabel>
            <Link
              href="/loop"
              className="flex items-center gap-1 text-[12px] text-ink-subtle transition-colors hover:text-ink"
            >
              see the loop <Icons.arrowRight />
            </Link>
          </div>
          <Panel>
            <Timeline events={brain.events} asOf={brain.asOf} limit={10} />
          </Panel>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
            Derived from dated facts in the files — ingests, promotions, decisions, sweeps.
            Relative times anchor to the sync date, {formatDate(brain.asOf)}.
          </p>
        </aside>
      </div>
    </div>
  );
}
