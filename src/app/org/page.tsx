import { loadBrain } from "@/lib/brain";
import { EmptyState, PageHeader, Panel, SectionLabel } from "@/components/ui";
import { Prose } from "@/components/prose";

export default async function OrgPage() {
  const brain = await loadBrain();
  const stubs = brain.knowledgeStubs.filter((s) => s.path.startsWith("knowledge/org/"));

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge"
        title="Org"
        intro="Team shape, rituals, tools — the org context the brain operates in."
      />

      {stubs.length === 0 ? (
        <div className="rise rise-2">
          <EmptyState
            what="Team structure, rituals, and tooling context lives here."
            why="No org knowledge has been captured yet."
            command="edit knowledge/org/ files directly, or /ingest meeting"
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
    </div>
  );
}
