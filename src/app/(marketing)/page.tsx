import type { Metadata } from "next";
import "./landing.css";
import LandingClient from "./LandingClient";

// Marketing landing page — lives at "/" (outside the (app) group, so no shell).
const TITLE = "PM Command Center — see your product thinking on one screen";
const DESCRIPTION =
  "PM Command Center reads your strategy, decisions, and user evidence from plain markdown and lays them out on one screen — what's believed, how strong the evidence is, and what needs your attention. Built on PM Brain OS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "PM Command Center",
  },
};

export default function Landing() {
  return <LandingClient />;
}
