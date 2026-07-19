import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadBrain } from "@/lib/brain";
import { resolveLink } from "@/lib/brain/workspace";
import { hrefFor } from "@/lib/brain/routes";
import { Tip } from "./tip";

const EPISTEMIC_TYPES = new Set([
  "observation",
  "interpretation",
  "hypothesis",
  "assumption",
  "decision",
]);

const EPISTEMIC_GLOSS: Record<string, string> = {
  observation: "Directly verifiable — what the world actually said or showed.",
  interpretation: "An inference from observations. Labeled so it never masquerades as fact.",
  hypothesis: "A testable belief — evidence can promote or demote it.",
  assumption: "An unverified premise being operated on, flagged as such.",
  decision: "A committed choice, logged in decisions/.",
};

/**
 * Renders brain markdown. Workspace-relative links become app links (chips
 * handle evidence rows; this handles running prose). Broken targets render
 * as visibly-dashed "not yet created" references — honest gaps, not 404s.
 * Epistemic labels like **[observation]** become typed badges.
 */
export async function Prose({
  md,
  from,
  className = "",
}: {
  md: string;
  from: string;
  className?: string;
}) {
  const brain = await loadBrain();
  const fileSet = new Set(brain.files);
  return (
    <div className={`prose-brain ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;
            if (/^https?:/.test(href)) {
              return (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              );
            }
            const resolved = resolveLink(from, href);
            if (resolved && fileSet.has(resolved)) {
              return <Link href={hrefFor(resolved)}>{children}</Link>;
            }
            return (
              <Tip
                content={
                  <span>
                    Referenced file{" "}
                    <span className="font-mono text-[11px]">{resolved ?? href}</span> doesn&apos;t
                    exist in the workspace yet — an honest gap, kept visible.
                  </span>
                }
              >
                <span
                  tabIndex={0}
                  className="cursor-help border-b border-dashed border-sem-red/50 text-ink-subtle"
                >
                  {children}
                </span>
              </Tip>
            );
          },
          strong: ({ children }) => {
            const text = Array.isArray(children) ? children.join("") : String(children ?? "");
            const m = text.match(/^\[([a-z-]+)\]$/i);
            if (m && EPISTEMIC_TYPES.has(m[1].toLowerCase())) {
              const t = m[1].toLowerCase();
              return (
                <Tip content={EPISTEMIC_GLOSS[t]}>
                  <span
                    tabIndex={0}
                    className="mr-1 inline-block rounded border border-hairline-strong bg-surface-3 px-1.5 py-px align-middle font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle"
                  >
                    {t}
                  </span>
                </Tip>
              );
            }
            return <strong>{children}</strong>;
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
