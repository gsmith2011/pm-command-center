"use client";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { GLOSSARY } from "@/lib/semantics";

export function TipProvider({ children }: { children: ReactNode }) {
  return <Tooltip.Provider delayDuration={150}>{children}</Tooltip.Provider>;
}

/** Hover/focus tooltip on any child. */
export function Tip({
  content,
  children,
  asChild = true,
}: {
  content: ReactNode;
  children: ReactNode;
  asChild?: boolean;
}) {
  if (!content) return <>{children}</>;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-w-[320px] rounded-md border border-hairline-strong bg-surface-3 px-3 py-2 text-[12.5px] leading-relaxed text-ink-muted shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
        >
          {content}
          <Tooltip.Arrow className="fill-surface-3" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** A brain-vocabulary term with its plain-language gloss on hover. */
export function Gloss({ term, children }: { term: string; children?: ReactNode }) {
  const gloss = GLOSSARY[term.toLowerCase()];
  if (!gloss) return <>{children ?? term}</>;
  return (
    <Tip content={gloss}>
      <span className="gloss" tabIndex={0}>
        {children ?? term}
      </span>
    </Tip>
  );
}
