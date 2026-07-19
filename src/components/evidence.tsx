import type { EvidenceRow } from "@/lib/brain/types";
import { ProvenanceChip, UntaggedChip } from "./chips";
import { Prose } from "./prose";
import { Gloss } from "./tip";

/** A single claim row: the claim, then its provenance chip(s). */
export function ClaimRow({ row, from }: { row: EvidenceRow; from: string }) {
  return (
    <li className="flex flex-col gap-1.5 py-2.5">
      <Prose md={row.md} from={from} className="!text-[13.5px]" />
      <div className="flex flex-wrap gap-1.5">
        {row.tags.map((t, i) => (
          <ProvenanceChip key={i} tag={t} />
        ))}
        {row.orphan ? <UntaggedChip /> : null}
      </div>
    </li>
  );
}

/**
 * Contested-ness made visible: evidence-for and evidence-against side by side,
 * each side wearing its own weight. Absence renders as an honest "none yet".
 */
export function EvidenceBalance({
  evidenceFor,
  evidenceAgainst,
  from,
}: {
  evidenceFor: EvidenceRow[];
  evidenceAgainst: EvidenceRow[];
  from: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-sem-green/20 bg-sem-green/[0.04] px-4 py-3">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-eyebrow !text-sem-green">Evidence for</span>
          <span className="font-mono text-[11px] text-ink-faint">{evidenceFor.length}</span>
        </div>
        {evidenceFor.length ? (
          <ul className="divide-y divide-hairline">
            {evidenceFor.map((r, i) => (
              <ClaimRow key={i} row={r} from={from} />
            ))}
          </ul>
        ) : (
          <p className="py-2 text-[13px] italic text-ink-faint">none yet</p>
        )}
      </div>
      <div className="rounded-lg border border-sem-red/20 bg-sem-red/[0.04] px-4 py-3">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-eyebrow !text-sem-red">Evidence against</span>
          <span className="font-mono text-[11px] text-ink-faint">{evidenceAgainst.length}</span>
        </div>
        {evidenceAgainst.length ? (
          <ul className="divide-y divide-hairline">
            {evidenceAgainst.map((r, i) => (
              <ClaimRow key={i} row={r} from={from} />
            ))}
          </ul>
        ) : (
          <p className="py-2 text-[13px] italic text-ink-faint">
            none yet — absence recorded honestly, not as confirmation
          </p>
        )}
      </div>
    </div>
  );
}

/** Compact for/against tally, for cards. */
export function EvidenceTally({
  forCount,
  againstCount,
}: {
  forCount: number;
  againstCount: number;
}) {
  return (
    <Gloss term="contradiction">
      <span className="font-mono text-[11.5px] text-ink-subtle">
        <span className={forCount ? "text-sem-green" : ""}>{forCount} for</span>
        {" · "}
        <span className={againstCount ? "text-sem-red" : ""}>{againstCount} against</span>
      </span>
    </Gloss>
  );
}
