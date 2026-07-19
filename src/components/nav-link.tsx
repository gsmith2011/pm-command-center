"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
  count,
}: {
  href: string;
  label: string;
  count?: number | string;
}) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-between rounded-md px-2.5 py-[5px] text-[13px] transition-colors ${
        active
          ? "bg-surface-2 text-ink shadow-[inset_2px_0_0_var(--color-accent)]"
          : "text-ink-subtle hover:bg-surface-1 hover:text-ink-muted"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && count !== 0 ? (
        <span className="font-mono text-[10.5px] text-ink-faint">{count}</span>
      ) : null}
    </Link>
  );
}
