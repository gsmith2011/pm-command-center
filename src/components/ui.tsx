import Link from "next/link";
import type { ReactNode } from "react";
import { Icons } from "./icons";

export function Panel({
  children,
  className = "",
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={`panel ${pad ? "p-5" : ""} ${className}`}>{children}</section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-eyebrow">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  right,
  filePath,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  right?: ReactNode;
  filePath?: string;
}) {
  return (
    <header className="rise rise-1 mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[72ch]">
        <div className="mb-2 flex items-center gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          {filePath ? (
            <span className="font-mono text-[11px] text-ink-faint">{filePath}</span>
          ) : null}
        </div>
        <h1 className="text-display text-[28px] text-ink">{title}</h1>
        {intro ? (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-subtle">{intro}</p>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </header>
  );
}

/**
 * The empty-state doctrine: every blank answers three questions —
 * what lives here, why it's empty, and the command that fills it.
 */
export function EmptyState({
  what,
  why,
  command,
}: {
  what: string;
  why: string;
  command?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-hairline-strong bg-surface-1/50 px-5 py-6">
      <p className="text-[13.5px] font-medium text-ink-muted">{what}</p>
      <p className="text-[13px] text-ink-subtle">{why}</p>
      {command ? (
        <p className="mt-1 text-[13px] text-ink-subtle">
          Fills from{" "}
          <code className="rounded border border-hairline bg-surface-2 px-1.5 py-0.5 font-mono text-[12px] text-ink-muted">
            {command}
          </code>
        </p>
      ) : null}
    </div>
  );
}

export function SectionLabel({
  children,
  count,
  className = "",
}: {
  children: ReactNode;
  count?: number;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-baseline gap-2 ${className}`}>
      <h2 className="text-eyebrow">{children}</h2>
      {count !== undefined ? (
        <span className="font-mono text-[11px] text-ink-faint">{count}</span>
      ) : null}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  href,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-eyebrow">{label}</div>
      <div className="text-display mt-2 text-[26px] text-ink">{value}</div>
      {sub ? <div className="mt-1 text-[12.5px] leading-snug text-ink-subtle">{sub}</div> : null}
    </>
  );
  return href ? (
    <Link
      href={href}
      className="panel block p-4 transition-colors hover:border-hairline-strong"
    >
      {inner}
    </Link>
  ) : (
    <div className="panel p-4">{inner}</div>
  );
}

export function RailLink({
  href,
  label,
  meta,
}: {
  href: string;
  label: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:border-hairline hover:bg-surface-2"
    >
      <span className="truncate text-[13px] text-ink-muted group-hover:text-ink">{label}</span>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-ink-faint">
        {meta}
        <Icons.arrowRight className="opacity-0 transition-opacity group-hover:opacity-60" />
      </span>
    </Link>
  );
}
