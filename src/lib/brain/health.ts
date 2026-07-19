// Always-on health signals — the dashboard's rendering of the brain's own
// /review semantics (INDEX drift, link rot, epistemic debt, decision debt,
// relationship cadence, forcing dates). Facts surfaced, never auto-resolved.
import type { Brain, HealthFinding } from "./types";
import { listItemsRaw, sections } from "./md";
import { outboundLinks } from "./links";
import type { FileDoc } from "./links";
import { hrefFor } from "./routes";

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

export function buildHealth(
  brain: Pick<
    Brain,
    "hypotheses" | "decisions" | "stakeholders" | "stakeholderIndex" | "strategy" | "asOf"
  >,
  docs: FileDoc[],
  fileExists: (p: string) => boolean
): HealthFinding[] {
  const out: HealthFinding[] = [];
  const asOf = brain.asOf;

  // ---- INDEX drift: the roster INDEXes vs. what the files actually say ----
  const hypIndex = docs.find((d) => d.path === "hypotheses/INDEX.md");
  if (hypIndex) {
    const statusOf = new Map(brain.hypotheses.map((h) => [h.slug, h.status]));
    for (const sec of sections(hypIndex.md, 2)) {
      const indexStatus = sec.title.toLowerCase().includes("active")
        ? "active"
        : sec.title.toLowerCase().includes("promoted")
          ? "promoted"
          : sec.title.toLowerCase().includes("demoted")
            ? "demoted"
            : sec.title.toLowerCase().includes("archived")
              ? "archived"
              : null;
      if (!indexStatus) continue;
      for (const item of listItemsRaw(sec.md)) {
        const slug = item.match(/^\[([\w-]+)\]/)?.[1];
        if (!slug) continue;
        const fileStatus = statusOf.get(slug);
        if (fileStatus && fileStatus !== indexStatus) {
          out.push({
            check: "index-drift",
            severity: "attention",
            md: `\`hypotheses/INDEX.md\` lists **${slug}** under *${indexStatus}*, but the file says \`${fileStatus}\`. The file is the source of truth; the INDEX has drifted.`,
            href: `/hypotheses/${slug}`,
          });
        }
      }
    }
  }
  const stakeStatus = new Map(brain.stakeholders.map((s) => [s.slug, s.lastTouched]));
  for (const row of brain.stakeholderIndex) {
    const fileTouched = stakeStatus.get(row.slug);
    const idxTouched = /\d{4}-\d{2}-\d{2}/.test(row.lastTouched) ? row.lastTouched : null;
    if (fileTouched !== undefined && idxTouched !== (fileTouched ?? null)) {
      out.push({
        check: "index-drift",
        severity: "attention",
        md: `\`stakeholders/INDEX.md\` last-touched for **${row.name}** (${idxTouched ?? "—"}) doesn't match the file (${fileTouched ?? "—"}).`,
        href: `/stakeholders/${row.slug}`,
      });
    }
  }

  // ---- Link rot (excluding _SCHEMA.md — its DO/DON'T examples are fictional) ----
  for (const doc of docs) {
    if (doc.path.includes("_SCHEMA")) continue;
    for (const link of outboundLinks(doc, fileExists)) {
      if (!link.exists) {
        out.push({
          check: "broken-link",
          severity: "attention",
          md: `\`${doc.path}\` links to \`${link.path}\`, which doesn't exist.`,
          href: hrefFor(doc.path),
        });
      }
    }
  }

  // ---- Feature pointers not yet created (rendered as honest gaps, tracked here) ----
  for (const h of brain.hypotheses) {
    if (h.feature && h.feature.path && !h.feature.exists) {
      out.push({
        check: "feature-pointer",
        severity: "info",
        md: `**${h.slug}** points at \`${h.feature.path}\`${h.feature.note ? ` — the file notes: *${h.feature.note}*` : ""}. The canonical feature file hasn't been created yet.`,
        href: `/hypotheses/${h.slug}`,
      });
    }
  }

  // ---- Epistemic debt: untagged evidence rows ----
  for (const h of brain.hypotheses) {
    for (const hyps of Object.values(h.riskAreas)) {
      for (const hyp of hyps ?? []) {
        const orphans =
          hyp.evidenceFor.filter((r) => r.orphan).length +
          hyp.evidenceAgainst.filter((r) => r.orphan).length;
        if (orphans > 0) {
          out.push({
            check: "untagged-evidence",
            severity: "debt",
            md: `**${hyp.code}** in ${h.slug} has ${orphans} evidence row(s) without a provenance tag — epistemic debt.`,
            href: `/hypotheses/${h.slug}`,
          });
        }
      }
    }
  }
  for (const d of brain.decisions) {
    const orphans =
      d.evidence.filter((r) => r.orphan).length + d.notDoing.filter((r) => r.orphan).length;
    if (orphans > 0) {
      out.push({
        check: "untagged-evidence",
        severity: "debt",
        md: `Decision **${d.slug}** has ${orphans} evidence row(s) without a provenance tag — epistemic debt.`,
        href: `/decisions/${d.slug}`,
      });
    }
  }

  // ---- Decision debt: pending > 14 days ----
  for (const d of brain.decisions) {
    if (d.status === "pending" && d.date && daysBetween(d.date, asOf) > 14) {
      out.push({
        check: "decision-debt",
        severity: "attention",
        md: `**${d.title}** has been pending for ${daysBetween(d.date, asOf)} days${d.pending?.blockerImpact ? ` — blocker: ${d.pending.blockerImpact}` : ""}.`,
        href: `/decisions/${d.slug}`,
      });
    }
  }

  // ---- Promoted hypothesis without a decision ----
  for (const h of brain.hypotheses) {
    for (const hyps of Object.values(h.riskAreas)) {
      for (const hyp of hyps ?? []) {
        if (hyp.status === "promoted") {
          const cited = brain.decisions.some((d) =>
            [d.linkedMd ?? "", d.decision ?? "", d.context ?? ""].some((s) =>
              s.includes(h.slug)
            )
          );
          if (!cited) {
            out.push({
              check: "orphan-promotion",
              severity: "debt",
              md: `**${hyp.code}** in ${h.slug} is promoted but no decision record references it — the promotion rule requires the pair.`,
              href: `/hypotheses/${h.slug}`,
            });
          }
        }
      }
    }
  }

  // ---- Relationship cadence: high influence, not touched in 3+ weeks ----
  for (const s of brain.stakeholders) {
    const influence = (s.influence ?? "").toLowerCase();
    if (!influence.startsWith("high")) continue;
    const days = s.lastTouched ? daysBetween(s.lastTouched, asOf) : null;
    if (days === null || days > 21) {
      out.push({
        check: "relationship-debt",
        severity: "attention",
        md: `**${s.name}** (${s.role ?? "high influence"}) — ${days === null ? "never touched" : `last touched ${days} days ago`}. High-influence cadence is 3 weeks.`,
        href: `/stakeholders/${s.slug}`,
      });
    }
  }

  // ---- Forcing dates on tensions & reversal conditions ----
  for (const t of brain.strategy?.tensions ?? []) {
    if (t.forcingDate) {
      const days = daysBetween(asOf, t.forcingDate);
      if (days >= -7) {
        out.push({
          check: "forcing-date",
          severity: days <= 14 ? "attention" : "info",
          md: `**${t.id} — ${t.title}** carries a forcing date of ${t.forcingDate}${days >= 0 ? ` (${days} days away)` : ` (${-days} days past)`}.`,
          href: "/strategy",
        });
      }
    }
  }

  // ---- Stale strategy review ----
  if (brain.strategy?.lastReviewed && daysBetween(brain.strategy.lastReviewed, asOf) > 42) {
    out.push({
      check: "stale-knowledge",
      severity: "info",
      md: `\`knowledge/strategy.md\` § Last reviewed is ${brain.strategy.lastReviewed} — more than 6 weeks before the sync date. The sweep's stale-knowledge window is 6 weeks.`,
      href: "/strategy",
    });
  }

  const sevRank = { attention: 0, debt: 1, info: 2 } as const;
  return out.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
}
