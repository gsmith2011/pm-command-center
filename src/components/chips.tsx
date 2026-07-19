import Link from "next/link";
import type { ProvenanceTag } from "@/lib/brain/types";
import {
  CONFIDENCE_SEM,
  KIND_LABEL,
  PROVENANCE_META,
  SEM_CLASSES,
  STATUS_SEM,
  formatDateShort,
  type Sem,
} from "@/lib/semantics";
import { hrefFor } from "@/lib/brain/routes";
import { Icons, type IconName } from "./icons";
import { Tip } from "./tip";

export function Chip({
  sem = "gray",
  icon,
  children,
  href,
  title,
  dashed = false,
}: {
  sem?: Sem;
  icon?: IconName;
  children: React.ReactNode;
  href?: string;
  title?: React.ReactNode;
  dashed?: boolean;
}) {
  const c = SEM_CLASSES[sem];
  const Icon = icon ? Icons[icon] : null;
  const cls = `inline-flex max-w-full items-center gap-1.5 rounded border px-1.5 py-[2px] font-mono text-[11px] leading-[1.35] whitespace-nowrap align-middle ${c.text} ${c.bg} ${c.border} ${dashed ? "border-dashed" : ""} ${href ? "transition-colors hover:border-hairline-3 hover:brightness-125" : ""}`;
  const body = (
    <>
      {Icon ? <Icon className="shrink-0 opacity-80" /> : null}
      <span className="truncate">{children}</span>
    </>
  );
  const el = href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <span className={cls} tabIndex={title ? 0 : undefined}>
      {body}
    </span>
  );
  return title ? <Tip content={title}>{el}</Tip> : el;
}

const KIND_ICON: Record<string, IconName> = {
  interviews: "interview",
  meetings: "meeting",
  market: "market",
  adhoc: "adhoc",
};

/** A provenance tag as a typed, walkable chip. Color = family, icon = kind. */
export function ProvenanceChip({ tag }: { tag: ProvenanceTag }) {
  if (tag.kind === "path") {
    const meta = PROVENANCE_META[tag.area];
    const base = tag.path.split("/").pop()?.replace(/\.md$/, "") ?? tag.path;
    const date = base.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
    const slug = base.replace(/^\d{4}-\d{2}-\d{2}-?/, "");
    const kindLabel = tag.sourceKind ? KIND_LABEL[tag.sourceKind] : tag.area;
    const tip = (
      <span>
        <b className="text-ink">{meta.label}</b> · trust: {meta.trust}
        <br />
        {meta.gloss}
        <br />
        <span className="font-mono text-[11px] text-ink-subtle">{tag.path}</span>
        {!tag.resolved && (
          <>
            <br />
            <span className="text-sem-red">This file doesn&apos;t exist in the workspace.</span>
          </>
        )}
      </span>
    );
    return (
      <Chip
        sem={tag.resolved ? meta.sem : "red"}
        icon={tag.sourceKind ? KIND_ICON[tag.sourceKind] : "file"}
        href={tag.resolved ? hrefFor(tag.path) : undefined}
        title={tip}
        dashed={!tag.resolved}
      >
        {kindLabel} · {slug}
        {date ? ` · ${formatDateShort(date)}` : ""}
      </Chip>
    );
  }
  const meta = PROVENANCE_META[tag.kind];
  const tip = (
    <span>
      <b className="text-ink">{meta.label}</b> · trust: {meta.trust}
      <br />
      {meta.gloss}
    </span>
  );
  if (tag.kind === "stakeholder-verbal") {
    return (
      <Chip sem={meta.sem} icon="person" title={tip}>
        heard · {tag.name}
        {tag.date ? ` · ${formatDateShort(tag.date)}` : ""}
      </Chip>
    );
  }
  if (tag.kind === "intuition") {
    return (
      <Chip sem={meta.sem} icon="intuition" title={tip}>
        intuition · PM{tag.date ? ` · ${formatDateShort(tag.date)}` : ""}
      </Chip>
    );
  }
  if (tag.kind === "industry-knowledge") {
    return (
      <Chip sem={meta.sem} icon="book" title={tip}>
        industry knowledge
      </Chip>
    );
  }
  return (
    <Chip sem={meta.sem} icon="chat" title={tip}>
      chat · no artifact
    </Chip>
  );
}

/** The visible epistemic-debt marker for a claim with no tag. */
export function UntaggedChip() {
  const meta = PROVENANCE_META.untagged;
  return (
    <Chip
      sem="red"
      icon="alert"
      dashed
      title={
        <span>
          <b className="text-ink">{meta.label}</b> — {meta.gloss}
        </span>
      }
    >
      untagged
    </Chip>
  );
}

export function StatusChip({ status, date }: { status: string | null; date?: string | null }) {
  if (!status) return null;
  const meta = STATUS_SEM[status] ?? { sem: "gray" as Sem, label: status, gloss: "" };
  return (
    <Chip
      sem={meta.sem}
      title={
        meta.gloss ? (
          <span>
            <b className="text-ink">{status}</b> — {meta.label}
            <br />
            {meta.gloss}
          </span>
        ) : undefined
      }
    >
      {status}
      {date ? ` · ${formatDateShort(date)}` : ""}
    </Chip>
  );
}

export function ConfidenceChip({ confidence }: { confidence: string | null }) {
  if (!confidence) return null;
  return (
    <Chip
      sem={CONFIDENCE_SEM[confidence] ?? "gray"}
      title="Confidence is set by the workflow when evidence accumulates — one correlational signal never bumps it."
    >
      {confidence} confidence
    </Chip>
  );
}

export function KindChip({ kind }: { kind: string }) {
  return (
    <Chip sem="gray" icon={KIND_ICON[kind] ?? "file"}>
      {KIND_LABEL[kind] ?? kind}
    </Chip>
  );
}
