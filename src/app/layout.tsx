import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Shell } from "@/components/shell";
import { TipProvider } from "@/components/tip";

export const metadata: Metadata = {
  title: {
    default: "PM Command Center",
    template: "%s · PM Command Center",
  },
  description:
    "The visual layer for a PM Brain — beliefs, evidence, disagreements, and decisions, read from a plain-markdown workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <TipProvider>
          <Shell>{children}</Shell>
        </TipProvider>
      </body>
    </html>
  );
}
