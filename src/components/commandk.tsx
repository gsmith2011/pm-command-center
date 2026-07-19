"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import type { SearchEntry } from "@/lib/brain/types";
import { Icons } from "./icons";

/** Basic jump-to-anything: titles/names only, grouped. (Full-text is Phase 2+.) */
export function CommandK({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const groups = [...new Set(entries.map((e) => e.group))];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-hairline bg-surface-1 px-2.5 py-1.5 text-[12.5px] text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink-muted"
      >
        <Icons.search />
        <span>Jump to…</span>
        <kbd className="rounded border border-hairline bg-surface-2 px-1 font-mono text-[10px] text-ink-faint">
          ⌘K
        </kbd>
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Dialog.Content className="fixed left-1/2 top-[18%] z-50 w-[min(560px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-hairline-strong bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
            <Dialog.Title className="sr-only">Jump to anything</Dialog.Title>
            <Command label="Jump to anything">
              <div className="flex items-center gap-2 border-b border-hairline px-3">
                <Icons.search className="text-ink-faint" />
                <Command.Input
                  autoFocus
                  placeholder="Jump to a hypothesis, decision, stakeholder, source…"
                  className="h-11 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
              <Command.List className="max-h-[320px] overflow-y-auto p-1.5">
                <Command.Empty className="px-3 py-6 text-center text-[13px] text-ink-faint">
                  Nothing with that name.
                </Command.Empty>
                {groups.map((g) => (
                  <Command.Group
                    key={g}
                    heading={g}
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-faint"
                  >
                    {entries
                      .filter((e) => e.group === g)
                      .map((e) => (
                        <Command.Item
                          key={e.href + e.title}
                          value={`${e.title} ${e.subtitle}`}
                          onSelect={() => {
                            setOpen(false);
                            router.push(e.href);
                          }}
                          className="flex cursor-pointer items-baseline justify-between gap-3 rounded-md px-2.5 py-2 text-[13.5px] text-ink-muted data-[selected=true]:bg-surface-2 data-[selected=true]:text-ink"
                        >
                          <span className="truncate">{e.title}</span>
                          <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                            {e.subtitle}
                          </span>
                        </Command.Item>
                      ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
