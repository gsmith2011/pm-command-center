import { loadBrain } from "@/lib/brain";
import { EmptyState, PageHeader, Panel, SectionLabel } from "@/components/ui";
import { Prose } from "@/components/prose";

export default async function MarketPage() {
  const brain = await loadBrain();
  const stubs = brain.knowledgeStubs.filter((s) => s.path.startsWith("knowledge/market/"));

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Market"
        intro="Competitive landscape and trends, refreshed via /ingest market."
      />

      {stubs.length === 0 ? (
        <div className="rise rise-2">
          <EmptyState
            what="Competitor and trend intelligence lives here."
            why="No market signals have been ingested yet."
            command="/ingest market <url-or-file>"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {stubs.map((stub, i) => {
            const sections = stub.sections.filter((s) => s.md.trim().length > 0);
            return (
              <Panel key={stub.path} className={`rise rise-${Math.min(i + 2, 5)}`}>
                <SectionLabel>
                  {stub.title}{" "}
                  <span className="font-mono text-[11px] text-ink-faint">{stub.path}</span>
                </SectionLabel>
                <div className="flex flex-col gap-4">
                  {sections.map((s) => (
                    <div key={s.title}>
                      <h3 className="mb-1.5 text-[14px] text-ink">{s.title}</h3>
                      <Prose md={s.md} from={stub.path} />
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <div className="panel rise rise-5 mt-6 p-4 text-[13px] text-ink-subtle">
        Market knowledge refreshes on a 30–60 day staleness window per the weekly sweep.
      </div>
    </div>
  );
}
