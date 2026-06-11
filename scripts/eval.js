// CodeGuard eval — detection recall (vuln → regulation mapping) + fix-verification rate.
// Deterministic via src/checks.js, so it's real and reproducible with no creds.
//
//   node scripts/eval.js

import { readFile, writeFile } from "node:fs/promises";
import { scanDiff, verifyFix } from "../src/checks.js";

const TARGET = Number(process.env.EVAL_TARGET ?? 0.85);

async function main() {
  const gold = JSON.parse(await readFile(new URL("../evals/golden-mapping.json", import.meta.url)));
  let detectOk = 0, fixOk = 0, fixTotal = 0;
  const rows = [];
  for (const c of gold.cases) {
    const found = scanDiff(c.vulnerable).map((f) => f.id);
    const detected = c.expect_rule ? found.includes(c.expect_rule) : found.length === 0;
    if (detected) detectOk++;
    let fixVerified = null;
    if (c.expect_rule) {
      fixTotal++;
      fixVerified = verifyFix(c.expect_rule, c.fixed).verified;
      if (fixVerified) fixOk++;
    }
    rows.push({ name: c.name, expect_rule: c.expect_rule, found, detected, fixVerified });
  }
  const recall = detectOk / gold.cases.length;
  const fixRate = fixTotal ? fixOk / fixTotal : 1;

  console.log("\nCodeGuard — detection mapping + fix-verification eval\n");
  for (const r of rows)
    console.log(`  ${r.detected ? "✅" : "❌"} ${r.name.padEnd(36)} → ${r.expect_rule || "(clean)"}${r.fixVerified != null ? `  fix ${r.fixVerified ? "verified ✅" : "NOT verified ❌"}` : ""}`);
  console.log(`\n  Detection recall ${(recall * 100).toFixed(1)}%  (${detectOk}/${gold.cases.length})  ·  Fix-verification ${(fixRate * 100).toFixed(1)}%  (${fixOk}/${fixTotal})`);

  const report = { ran_at: new Date().toISOString(), target: TARGET, detection_recall: recall, fix_verification_rate: fixRate, rows };
  await writeFile(new URL("../evals/report.json", import.meta.url), JSON.stringify(report, null, 2));
  const passed = recall >= TARGET && fixRate >= TARGET;
  console.log(`  ${passed ? "✅ PASS" : "❌ FAIL"} — target ${(TARGET * 100).toFixed(0)}%  (report → evals/report.json)\n`);
  process.exit(passed ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(2); });
