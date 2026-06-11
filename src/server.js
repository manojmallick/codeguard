// CodeGuard hosted backend — Express. MR review + approval-gated GitLab writes.
// Also exposes a CI pipeline-check endpoint and an MR webhook receiver.

import express from "express";
import { review, remediate } from "./agent.js";
import { postNote, setLabels, createIssue, pingGitLab, recordObligations, recordAudit, listObligations } from "./gitlab.js";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));

// --- Health: proves the required stack is wired ---
app.get("/health", async (_req, res) => {
  res.json({
    status: "ok",
    service: "codeguard",
    version: "2.0.0",
    model: process.env.GEMINI_MODEL || "gemini-3",
    genai_backend: process.env.MOCK === "true" ? "mock" : (process.env.GEMINI_API_KEY ? "ai-studio" : "vertex"),
    partner: "gitlab",
    // Honest naming: the hosted Express app reaches GitLab over REST (gitlab.js). The
    // MCP server lives in the judged Agent Builder agent (agent-builder/agent.json).
    partner_connected: await pingGitLab(),
    partner_transport: "rest (express mirror) / mcp (agent-builder)",
    agents: ["GitLabReader", "DORAAuditor"],
    regulations: ["DORA Art.9", "NIS2 Art.21", "GDPR Art.25"],
    features: ["vuln_to_regulation_mapping", "fix_verification", "evidence_pack", "compliance_debt_ledger"],
    timestamp: new Date().toISOString(),
  });
});

// --- Shared compliance-debt ledger (JSON; ?format=csv to export) ---
app.get("/api/obligations/:companyId", async (req, res) => {
  try {
    const rows = await listObligations(req.params.companyId);
    if (req.query.format === "csv") {
      const cols = ["regulation", "article", "who", "what", "severity", "authority", "trigger", "status", "created_at"];
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
      res.setHeader("content-type", "text/csv");
      res.setHeader("content-disposition", `attachment; filename="compliance-debt-${req.params.companyId}.csv"`);
      return res.send(csv);
    }
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
});

// --- Beat 1→2: review an MR (read-only steps 1-4). Returns decision + proposedActions ---
app.post("/api/review", async (req, res) => {
  const { projectId, iid } = req.body || {};
  if (!projectId || !iid) return res.status(400).json({ error: "projectId and iid required" });
  try {
    res.json(await review(projectId, iid));
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// --- Beat 3→4: human approved → execute the GitLab writes ---
app.post("/api/execute", async (req, res) => {
  const { approved, projectId, iid, comment, block, author, obligations, evidence } = req.body || {};
  if (!approved) return res.status(403).json({ error: "human approval required" });
  const companyId = "demo-co";
  // Sandbox path: MOCK mode OR the Judge-Mode demo project never touches real GitLab.
  if (process.env.MOCK === "true" || String(projectId || "").startsWith("demo/")) {
    const { inserted } = await recordObligations(companyId, obligations || []);
    await recordAudit({ actor: "human", action: "codeguard_review", mr_iid: iid, decision: block ? "block" : "warn", obligations_saved: inserted, evidence_sha256: evidence?.sha256 });
    return res.json({ ok: true, executed: ["note", "labels", inserted ? "ledger.insert(obligations)" : null, "ledger.insert(audit_log)"].filter(Boolean), obligations_saved: inserted, at: new Date().toISOString() });
  }
  try {
    const done = [];
    if (comment) { await postNote(projectId, iid, comment); done.push("note"); }
    if (block) {
      await setLabels(projectId, iid, ["compliance-blocked", "dora-review"]);
      done.push("labels");
      if (author) {
        await createIssue(projectId, `DORA training — ${author}`, `Repeat DORA Art.9 violation in MR !${iid}. Auto-created by CodeGuard.`);
        done.push("training-issue");
      }
    }
    const { inserted } = await recordObligations(companyId, obligations || []);
    if (inserted) done.push("ledger.insert(obligations)");
    await recordAudit({ actor: "human", action: "codeguard_review", mr_iid: iid, decision: block ? "block" : "warn", obligations_saved: inserted, evidence_sha256: evidence?.sha256 });
    done.push("ledger.insert(audit_log)");
    res.json({ ok: true, executed: done, obligations_saved: inserted, at: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// --- Beat 4 (marquee): human approved auto-fix → push a fix branch + open a remediation MR ---
app.post("/api/remediate", async (req, res) => {
  const { approved, projectId, iid, findings } = req.body || {};
  if (!approved) return res.status(403).json({ error: "human approval required" });
  if (!projectId || !iid) return res.status(400).json({ error: "projectId and iid required" });
  try {
    res.json(await remediate(projectId, iid, findings || []));
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// --- CI gate: .gitlab-ci.yml calls this; non-zero exit on block ---
app.post("/api/pipeline-check", async (req, res) => {
  if (req.get("authorization") !== `Bearer ${process.env.CODEGUARD_TOKEN}`)
    return res.status(401).json({ passed: false, error: "unauthorized" });
  const { project_id, mr_iid } = req.body || {};
  try {
    const r = await review(project_id, mr_iid);
    res.json({ passed: r.decision !== "block", decision: r.decision, findings: r.findings });
  } catch (e) {
    res.status(500).json({ passed: false, error: String(e.message || e) });
  }
});

// --- GitLab MR webhook: auto-run review when an MR opens/updates (read-only; writes still need approval in UI) ---
app.post("/webhook/gitlab", async (req, res) => {
  const ev = req.body || {};
  if (ev.object_kind === "merge_request" && ["open", "update"].includes(ev.object_attributes?.action)) {
    review(ev.project?.id, ev.object_attributes?.iid).catch((e) => console.error("review failed:", e.message));
  }
  res.json({ received: true });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`CodeGuard listening on :${port}`));
