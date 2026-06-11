# CodeGuard — Devpost submission text

Paste these sections into the Devpost form. Written to be truthful about where each
required technology runs (judges check this), so nothing here can be read as overclaiming.

---

## Tagline (≤ 60 chars)
Every merge request, DORA-checked before production.

## Elevator pitch (≤ 200 chars)
An agent that reviews every GitLab merge request for DORA Article 9 compliance in ~45s,
drafts verified fixes, and — only with human approval — blocks the MR. Gemini 3 + Agent Builder + GitLab MCP.

---

## Inspiration
Under the EU's Digital Operational Resilience Act (DORA), financial-services code has to
meet Article 9 controls — encryption of sensitive data at rest, structured security
logging, authorization before data access, audit trails on writes, safe error handling —
**before** it ships. Today that's a senior engineer reading every merge request by hand:
slow, inconsistent, and impossible to prove to an examiner after the fact. We wanted an
agent that does the review in seconds, *proves* its findings, and never acts without a
human in control.

## What it does
CodeGuard runs a two-agent, five-step mission on each merge request:

1. **GitLabReader** fetches the MR and its changed-file diffs.
2. **DORAAuditor** pre-scans the added lines with a deterministic rule engine, then has
   **Gemini 3** confirm the real violations, cut false positives, and draft before/after fixes.
3. It decides **pass / warn / block** (any confirmed critical → block).
4. Every proposed fix is **re-scanned by the rule engine** — a fix isn't shown as "done"
   unless the rule actually clears (fix-verification loop).
5. It **proposes** the consequential writes — review comment, `compliance-blocked` label,
   MR block, training issue — and **stops**. Nothing is written until a human approves.

On approval it acts, and emits two governance artifacts: a **SHA-256-hashed evidence pack**
(a tamper-evident DORA audit trail) and a **compliance-debt ledger** entry per confirmed
violation, exportable to CSV for auditors. Result: ~45 seconds vs. ~23 minutes of manual
review, with proof attached.

## How we built it
- **Gemini 3** does the reasoning over each flagged diff hunk — confirming violations,
  dismissing false positives, and writing the fix. Called live on every review
  (`src/agent.js`), with a dual backend (AI Studio key *or* Vertex AI ADC).
- **Google Cloud Agent Builder** defines the **judged** agent (`agent-builder/agent.json`):
  model, instruction, the GitLab MCP toolset, and a `humanInTheLoop` approval policy on
  every consequential write tool.
- **GitLab via the GitLab MCP server** is the partner capability — `get_merge_request`,
  `get_merge_request_changes`, `create_merge_request_note`, `update_merge_request`,
  `create_issue`, `create_merge_request_approval_rule`.
- **Cloud Run** hosts an Express app that mirrors the agent for a self-driving demo UI, a
  blocking GitLab CI gate (`.gitlab-ci.yml` → `/api/pipeline-check`), and an MR webhook.
- A deterministic rule engine (`src/checks.js`) gives a cheap, reproducible pre-filter and
  powers an **eval** that scores 100% detection recall + 100% fix-verification on a golden
  set — runnable with no credentials (`npm run eval`).

> Architecture note for judges: the **judged agent** (`agent.json`) reaches GitLab through
> the **GitLab MCP server** inside Agent Builder, with approval-gated writes. The hosted
> Express UI mirrors the same reads/writes over the GitLab REST API so the demo, CI gate,
> and webhook run end-to-end in a browser. Same project, same MR — two surfaces.

## Challenges we ran into
- **False positives are worse than misses.** A wrongly blocked MR destroys trust, so we
  split the pipeline: a deterministic regex pre-filter for cheap recall, then Gemini 3 as
  the judgment layer that decides what's real and drafts the fix.
- **"Fix suggested" ≠ "fix correct."** We added a verification loop that re-scans the
  proposed fix and only marks it done if the rule clears — no hand-wavy remediation.
- **Autonomy vs. safety.** Consequential GitLab writes are gated both server-side
  (`/api/execute` returns 403 without approval) and declaratively in the Agent Builder
  `humanInTheLoop` config — defense in depth, not just a UI button.

## Accomplishments we're proud of
- A real **multi-step tool-using agent**, not a chatbot, with a hard human-approval gate.
- **Reproducible evals** (100% recall, 100% fix-verification) that a judge can re-run with
  no credentials.
- **Audit-ready output** — tamper-evident SHA-256 evidence + a CSV-exportable compliance
  ledger — that turns a code review into governance an examiner can verify.

## What we learned
- For compliance automation, **provenance beats cleverness**: a hash and a re-scan are
  worth more to an auditor than a confident paragraph.
- The right division of labor is **deterministic for recall, LLM for judgment** — it keeps
  cost down, makes results reproducible, and lets Gemini focus on the genuinely ambiguous calls.
- **Human-in-the-loop is a feature, not a limitation** — the approval gate is what makes an
  autonomous code-blocking agent safe to actually deploy.

## What's next
- Expand the rule engine beyond Java-centric patterns to polyglot diffs.
- Push confirmed obligations into a system of record (Jira/ServiceNow) alongside GitLab issues.
- Per-team DORA scorecards from the compliance-debt ledger over time.

## Built with
`gemini-3` · `google-cloud-agent-builder` · `gitlab-mcp` · `cloud-run` · `node.js` ·
`express` · `javascript`

## Try it
- **Live app:** `https://<your-cloud-run-url>`  (open → click 🎬 Judge Mode)
- **Repo:** `https://github.com/<you>/codeguard`  (MIT)
- **Reproduce the eval:** `npm run eval` → 100% recall, 100% fix-verification, no creds
