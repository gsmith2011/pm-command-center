import type { Metadata } from "next";

// Marketing landing page — lives at "/" (outside the (app) group, so no shell).
// This is a scaffold; full sections land in the next implementation batch.
export const metadata: Metadata = {
  title: "PM Command Center — see your product thinking on one screen",
  description:
    "PM Command Center reads your strategy, decisions, and user evidence from plain markdown and lays them out on one screen — what's believed, how strong the evidence is, and what needs your attention. Built on PM Brain OS.",
};

export default function Landing() {
  return (
    <main
      data-site="marketing"
      className="grid min-h-screen place-items-center bg-white p-10 text-neutral-900"
    >
      <div className="max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
          Built on PM Brain OS
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          See where your product thinking stands, on one screen.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
          Landing page scaffold — sections coming next. The app lives at{" "}
          <a href="/overview" className="underline underline-offset-4">
            /overview
          </a>
          .
        </p>
      </div>
    </main>
  );
}
