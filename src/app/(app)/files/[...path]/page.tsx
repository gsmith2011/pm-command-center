import Link from "next/link";
import { notFound } from "next/navigation";
import { loadBrain, readWorkspaceFile } from "@/lib/brain";
import { hrefFor } from "@/lib/brain/routes";
import { PageHeader, Panel, RailLink } from "@/components/ui";
import { Chip } from "@/components/chips";
import { Prose } from "@/components/prose";

export const dynamicParams = false;

export async function generateStaticParams() {
  const brain = await loadBrain();
  return brain.files.map((f) => ({ path: f.replace(/\.md$/, "").split("/") }));
}

function h1Title(md: string, fallback: string): string {
  const line = md.split("\n").find((l) => l.startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : fallback;
}

/** Strip a leading H1 line — PageHeader already renders the title. */
function stripLeadingH1(md: string): string {
  const lines = md.split("\n");
  if (lines[0]?.startsWith("# ")) {
    return lines.slice(1).join("\n").replace(/^\s+/, "");
  }
  return md;
}

export default async function FilePage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path: segments } = await params;
  const wsPath = `${decodeURIComponent(segments.join("/"))}.md`;

  const brain = await loadBrain();
  // brain.files is the whitelist — anything not in it (including any ".." traversal) 404s.
  if (wsPath.includes("..") || !brain.files.includes(wsPath)) {
    notFound();
  }

  const content = readWorkspaceFile(wsPath);
  if (content == null) notFound();

  const parts = wsPath.replace(/\.md$/, "").split("/");
  const eyebrow = parts.length > 1 ? parts.slice(0, -1).join(" / ") : "root";
  const title = h1Title(content, parts[parts.length - 1]);
  const body = stripLeadingH1(content);

  const isSource = wsPath.startsWith("source/");
  const backlinks = brain.backlinks[wsPath] ?? [];

  let counterpart: { path: string; label: string } | null = null;
  if (wsPath.startsWith("source/")) {
    const candidate = wsPath.replace(/^source\//, "ingestion/");
    if (brain.files.includes(candidate)) {
      counterpart = { path: candidate, label: "synthesized record" };
    }
  } else if (wsPath.startsWith("ingestion/")) {
    const candidate = wsPath.replace(/^ingestion\//, "source/");
    if (brain.files.includes(candidate)) {
      counterpart = { path: candidate, label: "verbatim source" };
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        filePath={wsPath}
        right={
          isSource ? (
            <Chip
              sem="teal"
              title="The audit anchor — a verbatim copy of the original, never edited after capture."
            >
              verbatim source — never edited after capture
            </Chip>
          ) : undefined
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <Panel className="rise rise-2">
          <Prose md={body} from={wsPath} />
        </Panel>

        <div className="rise rise-3 flex flex-col gap-5">
          <div>
            <div className="mb-2 text-eyebrow">Cited by</div>
            {backlinks.length === 0 ? (
              <p className="text-[13px] text-ink-faint">Nothing cites this file yet.</p>
            ) : (
              <div className="flex flex-col">
                {backlinks.map((b) => (
                  <RailLink
                    key={b.fromPath}
                    href={hrefFor(b.fromPath)}
                    label={b.fromTitle}
                    meta={b.fromArea}
                  />
                ))}
              </div>
            )}
          </div>

          {counterpart ? (
            <div>
              <Link
                href={hrefFor(counterpart.path)}
                className="text-[13px] text-ink-subtle underline decoration-dotted underline-offset-2 hover:text-ink"
              >
                {counterpart.label}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
