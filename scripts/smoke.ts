// Parser smoke test against a real workspace: BRAIN_DIR=../pm-brain-workspace npx tsx scripts/smoke.ts
import { loadBrain } from "../src/lib/brain";

const b = loadBrain();
const j = (x: unknown) => JSON.stringify(x, null, 1);
console.log("files:", b.files.length, "| asOf:", b.asOf, "| live:", b.meta.live);
console.log("commands:", b.commands.map((c) => c.command).join(" · "));
console.log("\n== strategy ==");
console.log("northStar:", b.strategy?.northStar?.slice(0, 80));
console.log("priorities:", b.strategy?.priorities.length, "| nonGoals:", b.strategy?.nonGoals.length);
console.log("tensions:", j(b.strategy?.tensions.map((t) => ({ id: t.id, title: t.title.slice(0, 50), status: t.status?.slice(0, 60), forcing: t.forcingDate, updates: t.updates.map((u) => u.date) }))));
console.log("\n== hypotheses ==");
for (const h of b.hypotheses) {
  console.log(`- ${h.slug} [${h.status}] feature=${h.feature?.path} exists=${h.feature?.exists} created=${h.created} updated=${h.lastUpdated}`);
  for (const [area, hyps] of Object.entries(h.riskAreas)) {
    for (const hyp of hyps ?? []) {
      console.log(`   ${hyp.code} (${area}) [${hyp.status} @ ${hyp.statusDate}] conf=${hyp.confidence} for=${hyp.evidenceFor.length} against=${hyp.evidenceAgainst.length} oq=${hyp.openQuestions.length} orphans=${[...hyp.evidenceFor, ...hyp.evidenceAgainst].filter((r) => r.orphan).length}`);
      for (const r of hyp.evidenceFor) console.log(`     FOR tags=[${r.tags.map((t) => t.kind + (t.kind === "path" ? ":" + t.path.split("/").pop() : "")).join(",")}] ${r.text.slice(0, 60)}`);
    }
  }
  console.log(`   extraSections: ${h.extraSections.map((s) => s.title).join(" | ")}`);
}
console.log("\n== decisions ==");
for (const d of b.decisions) {
  console.log(`- ${d.slug} [${d.status}] date=${d.date} evidence=${d.evidence.length} notDoing=${d.notDoing.length} reversalItems=${d.reversal.items.length} ambiguities=${d.ambiguities.length} options=${d.options.length} pending=${!!d.pending}`);
  console.log(`  statusNote: ${d.statusNote?.slice(0, 90)}`);
  for (const r of d.evidence) console.log(`   EV tags=[${r.tags.map((t) => t.kind).join(",")}] orphan=${r.orphan} ${r.text.slice(0, 55)}`);
}
console.log("\n== stakeholders ==", b.stakeholders.length, "indexRows:", b.stakeholderIndex.length);
for (const s of b.stakeholders) console.log(`- ${s.slug}: ${s.name} | ${s.role} | infl=${s.influence?.slice(0, 20)} | frict=${s.friction?.slice(0, 20)} | touched=${s.lastTouched}`);
console.log("\n== insights ==");
console.log("themes:", b.insights?.themes.map((t) => `${t.title.slice(0, 40)} [promoted=${t.promotedDate}] ev=${t.evidence.length}`));
console.log("contradictions:", b.insights?.contradictions.map((c) => `${c.title.slice(0, 40)} sides=${c.sides.length} why=${!!c.whyPreserved}`));
console.log("retired:", b.insights?.retired.map((r) => `${r.title.slice(0, 40)} [${r.date}]`));
console.log("personas:", b.personas.map((p) => `${p.title.slice(0, 40)} [${p.status}] revised=${p.lastRevised}`));
console.log("\n== metrics ==");
console.log("stages:", b.metrics?.stages.map((s) => `${s.name}: current=${(s.current ?? "").slice(0, 40)} watch=${s.watchItems.length}`));
console.log("movements:", b.metrics?.recentMovements.length);
console.log("\n== features ==", b.features.map((f) => `${f.slug} [${f.status}]`));
console.log("roadmap:", b.roadmap.map((r) => `${r.name}: ${r.items.length}`));
console.log("\n== artifacts ==", b.artifacts.length);
for (const a of b.artifacts.filter((a) => a.layer === "ingestion")) console.log(`- [${a.kind}] ${a.date} ${a.slug} routedTo=${a.routedTo.length} src=${!!a.sourcePath}`);
console.log("\n== events ==", b.events.length);
for (const e of b.events) console.log(`- ${e.date} [${e.type}] ${e.title.slice(0, 70)}`);
console.log("\n== health ==", b.health.length);
for (const h of b.health) console.log(`- [${h.severity}] ${h.check}: ${h.md.slice(0, 100)}`);
console.log("\n== search ==", b.search.length, "entries | backlink targets:", Object.keys(b.backlinks).length);
console.log("backlinks for lena source:", j(b.backlinks["source/interviews/2026-07-01-lena-whitfield.md"]?.map((x) => x.fromPath)));
