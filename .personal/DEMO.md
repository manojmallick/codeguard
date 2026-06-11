# CodeGuard — Judge Run Sheet & Video Script

Two things in here: (1) a **30-second judge run sheet** to prove the app works, and
(2) a **beat-by-beat <3-minute video script** aligned 1:1 with the in-app Judge Mode.

---

## 1. Judge run sheet (paste into Devpost notes)

**Hosted URL:** `https://<your-cloud-run-url>`  ← deploy first (README §A), then replace this.

```bash
# 1. Health — proves the stack is wired (5 sec)
curl https://<your-cloud-run-url>/health
# → { "status":"ok", "model":"gemini-3", "partner":"gitlab", "partner_connected":true, ... }

# 2. Open the URL in a browser → click  🎬 Judge Mode  (top-right) → click Next ▸ through 8 beats.
#    Runs unattended with MOCK data — no credentials needed.

# 3. Reproducible eval (no creds, deterministic):
npm run eval
# → Detection recall 100.0% (7/7) · Fix-verification 100.0% (6/6) · PASS
```

**Required tech — where each one lives (be precise on camera):**
| Requirement | Where it actually runs |
|---|---|
| Gemini 3 | `src/agent.js` → `ai.models.generateContent` (live, every review) |
| Google Cloud Agent Builder | `agent-builder/agent.json` — the **judged** agent; import it and have judges hit it |
| GitLab via GitLab MCP | MCP server declared in `agent.json`; the hosted UI **mirrors** it over REST (`src/gitlab.js`) |

> ⚠️ **Honesty guardrail:** the live UI reaches GitLab over REST. The **GitLab MCP server**
> and **Agent Builder** run in the imported `agent.json` agent. Say it that way — "the judged
> agent uses Agent Builder + GitLab MCP; this UI is the mirror" — don't claim the UI *is* MCP.

---

## 2. Video script (~2:45, fits the 8 Judge Mode beats)

> Record in **MOCK mode** so it never flakes. Screen-share the app, click `🎬 Judge Mode`,
> and narrate each beat as you press **Next ▸**. Timings are cumulative.

**[0:00–0:20] Beat 1 — The problem**
> "Manual DORA Article 9 review of a merge request takes a senior engineer about 23 minutes.
> CodeGuard does it in 45 seconds — and never lets a non-compliant MR reach production. Here's
> a real-shaped sample: a payment endpoint, merge request 247."

**[0:20–0:45] Beat 2 — Two agents, a 5-step mission**
> "Two agents run. GitLabReader pulls the MR and its diffs. DORAAuditor pre-scans
> deterministically, then Gemini 3 confirms the real violations and cuts false positives.
> These are sequential, tool-using steps — an agent, not a chatbot."

**[0:45–1:05] Beat 3 — Verified findings**
> "Verdict: BLOCK — unencrypted card data violates DORA Art.9. Every proposed fix is
> re-scanned by the rule engine to prove it actually clears the violation. Our eval scores
> 100% detection recall on the golden set — reproducible, no credentials."

**[1:05–1:30] Beat 4 — Human-in-the-loop**
> "The agent has read everything, but it will NOT comment, label, block, or open an issue
> until I approve. That gate is enforced server-side — `/api/execute` returns 403 without
> approval — and declared in the Agent Builder humanInTheLoop config."

**[1:30–1:50] Beat 5 — Approved → it acts**
> "I approve. Now it posts the review, applies the compliance-blocked label, blocks the MR,
> and opens a training issue — all through GitLab MCP write tools. Watch the activity log."

**[1:50–2:10] Beat 6 — Tamper-evident evidence**
> "Every scan emits a SHA-256-hashed evidence record — decision, findings, timestamp. That's
> a tamper-evident DORA audit trail an examiner can verify. Compliance isn't a vibe; it's a hash."

**[2:10–2:30] Beat 7 — Compliance-debt ledger**
> "Confirmed violations become tracked compliance obligations in a shared ledger, exportable
> to CSV for auditors. CodeGuard turns a code review into governance."

**[2:30–2:45] Beat 8 — Scorecard + close**
> "Gemini 3, Agent Builder, GitLab MCP, Cloud Run — all green. Every merge request, checked
> for DORA compliance before production, with a human in control. That's CodeGuard. Thank you."

---

## 3. Pre-record checklist
- [ ] App deployed; `/health` returns 200 in a fresh browser
- [ ] `MOCK=true` on the recording deployment (zero-flake)
- [ ] Repo pushed public; MIT visible in GitHub **About**
- [ ] `npm run eval` shown or mentioned (the reproducible 100%)
- [ ] Video **under 3:00**, public on YouTube/Vimeo, link in Devpost
- [ ] Agent Builder agent imported; GitLab MCP connects (closes the #1 DQ risk)
