# ✅ SUBMISSION READINESS CHECKLIST — Google Cloud Rapid Agent Hackathon

**Deadline:** June 11, 2026 @ 23:00 GMT+2 · **Per-bucket prizes:** 🥇$5,000 🥈$3,000 🥉$2,000
**Buckets (one per partner):** Arize · Elastic · Fivetran · GitLab · MongoDB · Dynatrace

This checklist maps **directly to the official rules**. Anything marked 🔴 is a
hard qualification gate — miss it and the entry is disqualified regardless of quality.
Run this checklist per submission (one per partner bucket you enter).

---

## 0. HARD QUALIFICATION GATES (🔴 do not submit without these)

- [ ] 🔴 **Built with Gemini 3** (the rules say "built with Gemini 3" — NOT Gemini 2.0/Flash). Verify every config, env var, and on-screen label says Gemini 3.
- [ ] 🔴 **Built on Google Cloud Agent Builder** (the agent orchestration must run here, not a hand-rolled script pretending to be an agent).
- [ ] 🔴 **Meaningful partner MCP integration** — the partner's MCP server must do real work the agent depends on (not a decorative call). One partner per submission.
- [ ] 🔴 **Hosted project URL** — a live, reachable deployment (Cloud Run). Test it from an incognito window / different network.
- [ ] 🔴 **Public open-source repo** with a **detectable LICENSE file** visible in the GitHub *About* sidebar (use a standard SPDX license: MIT or Apache-2.0). GitHub only shows the license badge if the file is named `LICENSE`/`LICENSE.md` and is a recognized license.
- [ ] 🔴 **~3-minute demo video** (not 90 seconds). Public/unlisted URL that plays without login.
- [ ] 🔴 **Track selected** on the Devpost form (the correct partner bucket).
- [ ] 🔴 **Devpost submission form** complete and actually *submitted* (saved ≠ submitted).
- [ ] 🔴 **Eligibility:** above age of majority in your country; not in an excluded country/territory (NL is eligible — verify on the rules page).

---

## 1. "IT'S AN AGENT, NOT A CHATBOT" (the explicit judging theme)

The brief repeats this: *reason → plan → execute → keep human in control.* Judges
are told to reward agents that **take action**, not answer questions. Prove it:

- [ ] The agent **plans multi-step** (visible steps / tool calls), not a single Q&A turn.
- [ ] The agent **takes a real action via a tool** (writes back, creates a ticket/issue, pushes an event, drafts+files a notification, updates a record) — not just prints text.
- [ ] **Human-in-the-loop** is visible: a preview/approve step before consequential actions. (This is your differentiator — see `DESIGN_SYSTEM.md` → Agent-Approval pattern.)
- [ ] There is an **audit trail** of what the agent did (great for the compliance angle and screenshots).
- [ ] The demo video shows the agent **finishing a job**, end to end, with the human approving once.

---

## 2. PER-TRACK MCP "MEANINGFUL INTEGRATION" PROOF

For each bucket you enter, the partner MCP must be load-bearing. Confirm the
specific tool calls below actually run in your demo:

- [ ] **MongoDB — RegQuery:** Atlas Vector Search `$vectorSearch` retrieval + `insert/update` writing the Q&A/compliance-profile record via MongoDB MCP.
- [ ] **GitLab — CodeGuard:** `get_merge_request_changes` read + `create_merge_request_note` / label / `create_issue` write-back via GitLab MCP (the action = blocking/commenting on a real MR).
- [ ] **Dynatrace — DynaCompliance:** `get_problem_details` / Davis AI read + `push_event` / annotation write-back via Dynatrace MCP.
- [ ] **Arize — AuditLens:** Phoenix `get_traces`/`get_spans` read + `create_annotation` / `run_experiment` write via Phoenix MCP.
- [ ] **Elastic — IncidentIQ:** ES|QL search + hybrid vector retrieval + index write via Elastic MCP / Agent Builder endpoint.
- [ ] **Fivetran — RegPipeline:** connector status read + `trigger_sync` + BigQuery analysis via Fivetran MCP.

---

## 3. REPOSITORY HYGIENE (judges clone and run it)

- [ ] `LICENSE` (MIT or Apache-2.0) at repo root, detected by GitHub.
- [ ] `README.md` with: what it does, architecture diagram, the **exact stack** (Gemini 3 + Agent Builder + partner MCP), setup steps, env-var list, and the hosted demo link.
- [ ] `.env.example` (NO real secrets) — every secret referenced is listed.
- [ ] No committed secrets/tokens (scan: `git log -p | grep -i token`).
- [ ] Repo is **public** before the deadline.
- [ ] A clear **Architecture** section naming the 2 agents and their tools.
- [ ] Health endpoint returns `partner_mcp_connected: true` (already specified per track).

---

## 4. DEMO VIDEO (~3 min) — script skeleton

- [ ] 0:00–0:20 — The problem, in money/time terms (e.g. "47 min → 8 sec; one missed DORA report = €X fine").
- [ ] 0:20–0:50 — The stack on screen: "Gemini 3, Google Cloud Agent Builder, <Partner> MCP."
- [ ] 0:50–2:20 — **Live multi-step run**: agent plans → calls partner MCP → proposes action → **human approves** → agent executes → audit trail appears.
- [ ] 2:20–2:50 — Before/after benchmark + the partner's role made explicit.
- [ ] 2:50–3:00 — One-line close + hosted URL on screen.
- [ ] 1080p, captions, plays without login. Keep under ~3:00.

---

## 5. DEVPOST WRITE-UP (per submission)

- [ ] Title + one-line tagline.
- [ ] Inspiration / problem (tie to a theme: Financial Services, World Cup, or Retail).
- [ ] What it does (action verbs).
- [ ] How we built it — name Gemini 3 + Agent Builder + partner MCP explicitly.
- [ ] Challenges, accomplishments, what's next.
- [ ] Hosted URL + repo URL + ~3-min video embedded.
- [ ] Correct **track** selected.
- [ ] Screenshots (4): use the 4 from `DESIGN_SYSTEM.md` screen flow.

---

## 6. STRATEGIC NOTE (read this)

With 9 days solo, **six fully-shipped, winning-quality submissions is not realistic.**
The honest ranking by judge-appeal × build-risk × demo-wow:

1. **MongoDB / RegQuery** — lowest risk, best instant demo, biggest theme fit. Ship this first, completely.
2. **GitLab / CodeGuard** — strong "agent blocks bad code" action; reuses most infra.
3. **Dynatrace / DynaCompliance** — good action (push event + draft report).
4. **Arize / AuditLens**, **Elastic / IncidentIQ**, **Fivetran / RegPipeline** — higher setup cost.

**Recommendation:** ship #1 to a winning bar (hosted + repo + video) before touching
#2. A polished single entry beats six half-built ones. Every track shares the same
spine (`DESIGN_SYSTEM.md`) and the same scaffold (`regquery-starter/`), so each
additional bucket is mostly re-skinning + swapping the MCP — but only after #1 is done.

---

## 7. SIGN-OFF (per bucket)

| Gate | RegQuery (Mongo) | CodeGuard (GitLab) | DynaCompliance (Dyna) | AuditLens (Arize) | IncidentIQ (Elastic) | RegPipeline (Fivetran) |
|---|---|---|---|---|---|---|
| Gemini 3 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Agent Builder | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Partner MCP load-bearing | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Hosted URL live | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Public repo + LICENSE | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| ~3-min video | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Human-in-loop shown | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Devpost submitted | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
