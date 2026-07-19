import Link from "next/link";
import type { BrainEvent } from "@/lib/brain/types";
import { formatDate, relativeToSync, type Sem, SEM_CLASSES } from "@/lib/semantics";
import { Icons, type IconName } from "./icons";
import { Tip } from "./tip";

const EVENT_META: Record<
  BrainEvent["type"],
  { sem: Sem; icon: IconName; label: string; gloss: string }
> = {
  ingest: {
    sem: "blue",
    icon: "adhoc",
    label: "ingested",
    gloss: "A new input entered the loop: preserved verbatim, synthesized, routed.",
  },
  promotion: {
    sem: "green",
    icon: "check",
    label: "promoted",
    gloss: "A hypothesis met its own decision trigger and was promoted — always paired with a decision record.",
  },
  demotion: {
    sem: "orange",
    icon: "alert",
    label: "demoted",
    gloss: "Evidence contradicted a hypothesis; it's kept for the record, not deleted.",
  },
  decision: {
    sem: "green",
    icon: "branch",
    label: "decision",
    gloss: "A committed choice entered the append-only decision log.",
  },
  sweep: {
    sem: "purple",
    icon: "loop",
    label: "sweep",
    gloss: "A /review maintenance pass — six checks for staleness, hygiene, debt, and tensions.",
  },
  "tension-update": {
    sem: "yellow",
    icon: "scale",
    label: "tension",
    gloss: "A strategy tension changed — a live conflict the PM resolves deliberately.",
  },
  "insight-promoted": {
    sem: "teal",
    icon: "pulse",
    label: "theme",
    gloss: "A recurring pattern crossed the promotion bar into durable user knowledge.",
  },
  "theme-retired": {
    sem: "gray",
    icon: "eye",
    label: "retired",
    gloss: "A theme was weighed and set aside — kept so it isn't re-litigated.",
  },
  "persona-promoted": {
    sem: "teal",
    icon: "person",
    label: "persona",
    gloss: "A candidate persona earned enough independent evidence to become active.",
  },
};

export function Timeline({
  events,
  asOf,
  limit,
  dense = false,
}: {
  events: BrainEvent[];
  asOf: string;
  limit?: number;
  dense?: boolean;
}) {
  const shown = limit ? events.slice(0, limit) : events;
  return (
    <ol className="relative ml-1.5 border-l border-hairline">
      {shown.map((e, i) => {
        const meta = EVENT_META[e.type];
        const c = SEM_CLASSES[meta.sem];
        const showDate = i === 0 || e.date !== shown[i - 1].date;
        const Icon = Icons[meta.icon];
        return (
          <li key={i} className={`relative pl-5 ${dense ? "pb-3" : "pb-4"} last:pb-0`}>
            <span
              className={`absolute -left-[5px] top-[5px] h-[9px] w-[9px] rounded-full border-2 border-canvas ${c.dot}`}
            />
            {showDate ? (
              <div className="mb-1 font-mono text-[11px] text-ink-faint">
                {formatDate(e.date)}
                <span className="ml-1.5 text-ink-faint/70">
                  {relativeToSync(e.date, asOf)}
                </span>
              </div>
            ) : null}
            <div className="flex items-start gap-2">
              <Tip
                content={
                  <span>
                    <b className="text-ink">{meta.label}</b> — {meta.gloss}
                  </span>
                }
              >
                <span
                  tabIndex={0}
                  className={`mt-px inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-px font-mono text-[10.5px] ${c.text} ${c.bg} ${c.border}`}
                >
                  <Icon />
                  {meta.label}
                </span>
              </Tip>
              <div className="min-w-0">
                <Link
                  href={e.href}
                  className={`block truncate text-[13px] text-ink-muted transition-colors hover:text-ink ${dense ? "" : "leading-snug"}`}
                >
                  {e.title}
                </Link>
                {!dense && e.detail ? (
                  <div className="truncate text-[12px] text-ink-faint">{e.detail}</div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
