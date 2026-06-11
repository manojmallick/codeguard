# 🎬 CodeGuard — 3-Minute Judge Demo Script

**Live app:** https://codeguard-908307939543.europe-west1.run.app
**Live demo MR:** https://gitlab.com/mmallick1990/codeguard-demo/-/merge_requests/1
**Red pipeline (proof):** https://gitlab.com/mmallick1990/codeguard-demo/-/pipelines (newest `dora_compliance` job)

> Two ways to run it: click **🎬 Judge Mode** for the unattended guided tour, or follow the
> manual beats below. Both use real Gemini 3 + GitLab. The `demo/...` sandbox is scripted so
> it never fails on stage; a real project path (e.g. `mmallick1990/codeguard-demo` !1) hits live APIs.

---

## The one-liner (say this first)
> "Every merge request in a bank has to pass DORA Article 9 — encryption, logging, authorization,
> audit trail. That review takes a senior engineer ~23 minutes. **CodeGuard does it in ~45 seconds,
> keeps a human in control, and doesn't just flag the violation — it opens the fix.**"

## Beat 1 — The problem (0:00–0:25)
- Open the app. Point at the dashboard. "This is a DevSecOps compliance command center wired to GitLab."
- Type `mmallick1990/codeguard-demo` and `1` → **Review**.

## Beat 2 — The agent runs (0:25–1:00)
- Watch the **Agent Activity Log**: GitLabReader fetches the MR via GitLab MCP → DORAAuditor pre-scans → **Gemini 3** confirms findings + drafts fixes → fix-verification re-scans.
- "Two sub-agents, a five-step mission. This is an agent, not a chatbot."
- Verdict lands: **BLOCK**, ~8s, the stat tiles update to the *real* numbers.

## Beat 3 — The findings (1:00–1:30)
- Each finding cites the article (DORA Art. 9, GDPR Art. 32, NIS2 Art. 21), severity, and a
  before/after fix marked **✅ fix verified** — re-scanned clean by the rule engine.
- "Not a model guessing — every fix is proven against the rules. Our eval is **100% recall**, reproducible, no creds."

## Beat 4 — Human in the loop (1:30–1:50)
- Point at the **Approval Bar**. "The agent has only *read* so far. It will not comment, label,
  block, or open issues until I approve. Enforced server-side — `/api/execute` 403s without it."

## Beat 5 — It acts, then it FIXES (1:50–2:30) ★ the moment
- Click **Approve & Execute** → posts the review, labels `compliance-blocked`, blocks the MR, opens a training issue. Show it on GitLab.
- Then click **🔧 Approve Auto-Fix MR** → "It just pushed a verified fix branch and opened a
  **remediation MR**." Open that MR on GitLab. **This is the line judges remember:**
  > "The reviewer became the fixer. That's an agent that closes the loop."

## Beat 6 — Shift-left proof: the red pipeline (2:30–2:50)
- Switch to the GitLab **pipeline** tab. Show the `dora_compliance` job **failed (red)** with:
  `❌ DORA Art.9 compliance check FAILED — merge blocked by CodeGuard`
- "Same agent, wired as a blocking CI gate. Non-compliant code can't merge — automatically."

## Beat 7 — Audit-ready close (2:50–3:00)
- Point at the **Evidence Pack** (SHA-256) and **Compliance-Debt Ledger** (CSV export).
- "Tamper-evident audit trail and a tracked obligation ledger for the examiner. **Compliance isn't a vibe — it's a hash.**"

---

## Requirements scorecard (have this on a slide)
| Requirement | Evidence |
|---|---|
| Gemini 3 | `gemini-3-flash-preview`, live, `/health → genai_backend: ai-studio` |
| Google Cloud Agent Builder | `agent-builder/agent.json` (GitLab MCP + humanInTheLoop) |
| GitLab via MCP | judged agent uses MCP; hosted app mirrors over REST |
| Cloud Run | deployed, public URL |
| Agent (multi-step) | 5-step loop, 2 sub-agents |
| Human-in-the-loop | server-enforced approval gate |
| Reproducible eval | `npm run eval` → 100% / 100% |
| Beyond the brief | **auto-remediation MR**, **live CI gate**, evidence pack, compliance ledger |

## If a judge pushes back
- *"Is it really live?"* → `curl <url>/health` and run a real MR in front of them.
- *"Did it really fix it?"* → open the auto-fix MR; show the diff.
- *"Numbers real?"* → the tiles update from the actual review; the ledger exports CSV.
- *"Gemini 3?"* → `/health` shows the model; note `gemini-3-pro-preview` is deprecated, `gemini-3-flash-preview` serves.

## Pre-demo checklist
- [ ] Import `agent-builder/agent.json` into the Agent Builder console (the one manual judged artifact).
- [ ] `curl <url>/health` returns `partner_connected: true`.
- [ ] Optional: reset to a clean MR `!2` for a pristine recording.
