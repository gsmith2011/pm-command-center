import Link from "next/link";
import { loadBrain } from "@/lib/brain";
import { formatDate } from "@/lib/semantics";
import { NavLink } from "./nav-link";
import { CommandK } from "./commandk";
import { Tip } from "./tip";
import { Icons } from "./icons";

export async function Shell({ children }: { children: React.ReactNode }) {
  const brain = await loadBrain();
  const ingestionCount = brain.artifacts.filter((a) => a.layer === "ingestion").length;
  const attention = brain.health.filter((h) => h.severity !== "info").length;

  const nav: { group: string | null; items: { href: string; label: string; count?: number }[] }[] =
    [
      {
        group: null,
        items: [
          { href: "/", label: "Overview" },
          { href: "/loop", label: "The Loop" },
        ],
      },
      {
        group: "Active work",
        items: [
          { href: "/hypotheses", label: "Hypotheses", count: brain.hypotheses.length },
          { href: "/decisions", label: "Decisions", count: brain.decisions.length },
        ],
      },
      {
        group: "Knowledge",
        items: [
          { href: "/strategy", label: "Strategy" },
          { href: "/users", label: "Users" },
          { href: "/product", label: "Product" },
          { href: "/market", label: "Market" },
          { href: "/org", label: "Org" },
        ],
      },
      {
        group: "People & pipeline",
        items: [
          { href: "/stakeholders", label: "Stakeholders", count: brain.stakeholders.length },
          { href: "/ingestion", label: "Ingestion", count: ingestionCount },
          { href: "/review", label: "Review / Health", count: attention },
        ],
      },
    ];

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[228px] flex-col border-r border-hairline bg-canvas">
        <Link href="/" className="flex items-center gap-2.5 px-4 pb-4 pt-5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/90 text-white">
            <Icons.loop width={13} height={13} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13.5px] font-semibold tracking-tight text-ink">
              PM Command Center
            </span>
            <span className="font-mono text-[10.5px] text-ink-faint">
              {brain.meta.workspaceName ?? "pm-brain"} · read-only
            </span>
          </span>
        </Link>
        <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 pb-4">
          {nav.map((g, i) => (
            <div key={i}>
              {g.group ? (
                <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-wider text-ink-faint">
                  {g.group}
                </div>
              ) : null}
              <div className="space-y-px">
                {g.items.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-hairline px-4 py-3">
          <Tip
            content={
              brain.meta.live
                ? "Reading the workspace live from disk — refresh after running a command to see it land."
                : "A frozen snapshot, deliberately synced. Dates are absolute; anything relative is anchored to this sync date."
            }
          >
            <div className="flex items-center gap-2 font-mono text-[10.5px] text-ink-faint">
              <span
                className={`h-1.5 w-1.5 rounded-full ${brain.meta.live ? "bg-sem-green" : "bg-ink-faint"}`}
              />
              {brain.meta.live ? "live workspace" : `synced ${formatDate(brain.asOf)}`}
            </div>
          </Tip>
        </div>
      </aside>
      <div className="ml-[228px] flex-1">
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-hairline bg-canvas/85 px-6 backdrop-blur">
          <div className="text-[12.5px] text-ink-subtle">
            The brain, made visible — beliefs, evidence, disagreements, and decisions,{" "}
            <span className="text-ink-muted">as of {formatDate(brain.asOf)}</span>
          </div>
          <CommandK entries={brain.search} />
        </header>
        <main className="mx-auto max-w-[1140px] px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
