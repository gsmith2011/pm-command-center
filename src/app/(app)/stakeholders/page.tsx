import Link from "next/link";
import type { Metadata } from "next";
import { loadBrain } from "@/lib/brain";
import type { Stakeholder } from "@/lib/brain/types";
import { formatDateShort, relativeToSync } from "@/lib/semantics";
import { PageHeader, Panel, SectionLabel, EmptyState } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Gloss, Tip } from "@/components/tip";

export const metadata: Metadata = { title: "Stakeholders" };

function level(v: string | null): 0 | 1 | 2 {
  const s = (v ?? "").toLowerCase();
  if (s.startsWith("high") || s.startsWith("medium-high")) return 2;
  if (s.startsWith("medium")) return 1;
  return 0;
}

function TouchCell({ s, asOf }: { s: Stakeholder; asOf: string }) {
  const days = s.lastTouched
    ? Math.round((Date.parse(asOf) - Date.parse(s.lastTouched)) / 86400000)
    : null;
  const overdue = level(s.influence) === 2 && (days === null || days > 21);
  return (
    <span className={`font-mono text-[11.5px] ${overdue ? "text-sem-orange" : "text-ink-faint"}`}>
      {s.lastTouched ? (
        <>
          {formatDateShort(s.lastTouched)} · {relativeToSync(s.lastTouched, asOf)}
        </>
      ) : (
        "never"
      )}
      {overdue ? (
        <Tip content="High-influence stakeholders untouched for 3+ weeks are flagged as relationship debt by the weekly sweep.">
          <span className="gloss ml-1.5">drift</span>
        </Tip>
      ) : null}
    </span>
  );
}

export default async function StakeholdersPage() {
  const brain = await loadBrain();
  const s = brain.stakeholders;

  // influence (rows, high→low) × friction (cols, low→high)
  const cells: Stakeholder[][][] = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ];
  for (const st of s) {
    cells[2 - level(st.influence)][level(st.friction)].push(st);
  }
  const rowLabels = ["high influence", "medium", "low"];
  const colLabels = ["low friction", "medium", "high friction"];

  return (
    <div>
      <PageHeader
        eyebrow="People & pipeline"
        title="Stakeholders"
        intro={
          <>
            One file per person: what they care about, open asks in both directions, and the
            touchpoint log. The grid shows where preparation time matters most — high influence
            × high friction is where the sweep watches for{" "}
            <Gloss term="drift">relationship debt</Gloss>.
          </>
        }
      />

      {s.length === 0 ? (
        <EmptyState
          what="One file per person — concerns, asks, and touchpoint history."
          why="No stakeholders captured yet."
          command="/ingest meeting <file>"
        />
      ) : (
        <>
          <section className="rise rise-2 mb-8">
            <SectionLabel>Influence × friction</SectionLabel>
            <Panel pad={false} className="overflow-hidden">
              <div className="grid grid-cols-[92px_1fr_1fr_1fr] text-[12px]">
                <div className="border-b border-r border-hairline bg-surface-2 px-3 py-2" />
                {colLabels.map((c) => (
                  <div
                    key={c}
                    className="border-b border-hairline bg-surface-2 px-3 py-2 text-center font-mono text-[10.5px] uppercase tracking-wide text-ink-faint"
                  >
                    {c}
                  </div>
                ))}
                {cells.map((row, ri) => (
                  <div key={ri} className="contents">
                    <div className="flex items-center border-b border-r border-hairline bg-surface-2 px-3 py-3 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
                      {rowLabels[ri]}
                    </div>
                    {row.map((cell, ci) => (
                      <div
                        key={ci}
                        className={`min-h-[64px] border-b border-hairline px-2.5 py-2.5 ${
                          ri === 0 && ci === 2 ? "bg-sem-orange/[0.05]" : ""
                        } ${ci > 0 ? "border-l" : ""}`}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {cell.map((st) => (
                            <Link
                              key={st.slug}
                              href={`/stakeholders/${st.slug}`}
                              className="rounded-md border border-hairline bg-surface-2 px-2 py-1 text-[12px] text-ink-muted transition-colors hover:border-hairline-3 hover:text-ink"
                            >
                              {st.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Panel>
            <p className="mt-2 text-[12px] text-ink-faint">
              Placement comes from each person&apos;s file — influence and friction are the
              brain&apos;s own fields, shown as written.
            </p>
          </section>

          <section className="rise rise-3">
            <SectionLabel count={s.length}>Roster</SectionLabel>
            <Panel pad={false} className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-hairline bg-surface-2 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">
                    <th className="px-4 py-2.5 font-medium">Person</th>
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="px-4 py-2.5 font-medium">Influence</th>
                    <th className="px-4 py-2.5 font-medium">Friction</th>
                    <th className="px-4 py-2.5 font-medium">Last touched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {[...s]
                    .sort((a, b) => level(b.influence) - level(a.influence))
                    .map((st) => (
                      <tr key={st.slug} className="transition-colors hover:bg-surface-2/60">
                        <td className="px-4 py-2.5">
                          <Link
                            href={`/stakeholders/${st.slug}`}
                            className="font-medium text-ink hover:text-accent-hover"
                          >
                            {st.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-ink-subtle">{st.role}</td>
                        <td className="px-4 py-2.5">
                          <Chip sem={level(st.influence) === 2 ? "purple" : "gray"}>
                            {(st.influence ?? "—").split("—")[0].trim().slice(0, 14)}
                          </Chip>
                        </td>
                        <td className="px-4 py-2.5">
                          <Chip sem={level(st.friction) === 2 ? "orange" : "gray"}>
                            {(st.friction ?? "—").split("—")[0].trim().slice(0, 14)}
                          </Chip>
                        </td>
                        <td className="px-4 py-2.5">
                          <TouchCell s={st} asOf={brain.asOf} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Panel>
          </section>
        </>
      )}
    </div>
  );
}
