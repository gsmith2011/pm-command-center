// Capture README screenshots from a running build: node scripts/screenshots.mjs [baseUrl]
// Uses the local Chrome install via puppeteer-core — no browser download.
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:3001";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "shell",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
const shots = [
  ["/", "overview.png"],
  ["/loop", "loop.png"],
  ["/hypotheses/sync-field-mapping-breakage", "hypothesis-detail.png"],
  ["/decisions/2026-07-14-sync-health-detection-v1", "decision-detail.png"],
  ["/stakeholders", "stakeholders.png"],
];
for (const [path, name] of shots) {
  await page.goto(base + path, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 700)); // let the entrance stagger finish
  await page.screenshot({
    path: "docs/media/" + name,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  console.log("captured", name);
}
await browser.close();
