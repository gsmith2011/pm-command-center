// Minimal 12–14px stroke icons — geometric, quiet, no emoji.
import type { SVGProps } from "react";

function I(props: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  interview: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <rect x="6" y="1.5" width="4" height="8" rx="2" />
      <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5" />
    </I>
  ),
  meeting: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="5.5" cy="5" r="2" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M2 13c0-2.2 1.6-3.7 3.5-3.7S9 10.8 9 13M9.8 12.9c.2-1.8 1.4-3 2.9-2.9 1 .1 1.8.7 2.2 1.6" />
    </I>
  ),
  market: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c-3.5 3.8-3.5 8.2 0 12M8 2c3.5 3.8 3.5 8.2 0 12" />
    </I>
  ),
  adhoc: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M2.5 9.5 8 2.5l5.5 7M2.5 9.5V13a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9.5M2.5 9.5H6l1 1.5h2l1-1.5h3.5" />
    </I>
  ),
  file: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M4 1.5h5L13 5v9a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V1.5ZM9 1.5V5h4" />
    </I>
  ),
  person: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="8" cy="5" r="2.6" />
      <path d="M3 14c.5-3 2.5-4.5 5-4.5s4.5 1.5 5 4.5" />
    </I>
  ),
  intuition: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" />
      <circle cx="8" cy="8" r="2.2" />
    </I>
  ),
  book: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M8 3.5C6.5 2.3 4.5 2 2 2v11c2.5 0 4.5.3 6 1.5 1.5-1.2 3.5-1.5 6-1.5V2c-2.5 0-4.5.3-6 1.5ZM8 3.5v11" />
    </I>
  ),
  chat: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M2 3.5h12v8H8.5L5 14v-2.5H2v-8Z" />
    </I>
  ),
  alert: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M8 1.5 15 14H1L8 1.5ZM8 6.5v3.5M8 12v.5" />
    </I>
  ),
  arrowRight: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </I>
  ),
  pulse: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M1.5 8h3l1.5-4 3 8 1.5-4h4" />
    </I>
  ),
  clock: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.5V8l2.5 1.8" />
    </I>
  ),
  check: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="m3 8.5 3.2 3L13 4.5" />
    </I>
  ),
  branch: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="4.5" cy="3.5" r="1.8" />
      <circle cx="4.5" cy="12.5" r="1.8" />
      <circle cx="11.5" cy="6" r="1.8" />
      <path d="M4.5 5.3v5.4M11.5 7.8c0 2.5-2.5 3-5 3" />
    </I>
  ),
  search: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3.5 3.5" />
    </I>
  ),
  scale: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M8 2v12M3 14h10M8 3.5 3.5 5.2c0 2 .9 3.3 2.2 3.3S8 7.2 8 5.2M8 3.5l4.5 1.7c0 2-.9 3.3-2.2 3.3S8 7.2 8 5.2" />
    </I>
  ),
  loop: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.5v3h-3" />
    </I>
  ),
  eye: (p: SVGProps<SVGSVGElement>) => (
    <I {...p}>
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="1.8" />
    </I>
  ),
};

export type IconName = keyof typeof Icons;
