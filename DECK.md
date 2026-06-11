# CodeGuard — Pitch Deck

> DORA Article 9 merge-request review agent. Gemini 3 · Google Cloud Agent Builder · GitLab MCP · Cloud Run.
> **Live:** https://codeguard-908307939543.europe-west1.run.app · PDF: [DECK.pdf](DECK.pdf)

---

## 1 · The Problem

Under the EU **Digital Operational Resilience Act (DORA) Article 9**, every change to a financial
system must protect ICT: **encryption at rest, structured logging, authorization, audit trails,
safe error handling.**

Today that review is **manual, late, and inconsistent**:
- ~**23 minutes** of a senior engineer's time *per merge request*
- Happens **after** the code is written — or not at all
- A single missed unencrypted card field is a **regulatory breach**

---

## 2 · The Solution

**CodeGuard** reviews every GitLab merge request for DORA Art.9 — **in ~45 seconds, before production, with a human in control.**

It doesn't just lint. It **reasons** (Gemini 3), **proves** its fixes, **acts** through GitLab
(gated on approval), and **opens the remediation MR** itself.

> **31× faster. Audit-ready. An agent that closes the loop.**

---

## 3 · Demo (90 seconds)

1. Paste a project + MR → **Review**.
2. Watch two sub-agents run a 5-step mission; verdict: **BLOCK**.
3. Each finding cites the article + a **fix-verified** before/after.
4. **Approve** → CodeGuard comments, labels, blocks, opens a training issue — via GitLab.
5. **Approve Auto-Fix** → it pushes a branch and opens a **remediation MR**.
6. A real **CI pipeline goes red**; an **evidence hash** + **compliance ledger** close it out.

*Or click 🎬 **Judge Mode** — the whole story, self-driving, zero credentials.*

---

## 4 · How it works

```
Browser / CI / Webhook ─► CodeGuard (Cloud Run)
   1 read MR + diffs        → GitLab (MCP/REST)
   2 pre-scan rules         → checks.js
   3 reason + confirm       → Gemini 3
   4 decide pass/warn/block
   5 fix-verify (re-scan)
        │  human approves ▼
   execute  → comment · label · block · training issue · ledger
   remediate→ fix branch + remediation MR
```

Two agents — **GitLabReader** (reads) and **DORAAuditor** (scans, reasons, decides, proposes).
See [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 5 · Why it wins — differentiators

- 🔧 **Auto-remediation** — detect *and* fix; opens a real MR.
- 🔁 **Blocking CI gate** — non-compliant code can't merge; pipeline turns red automatically.
- ✅ **Fix-verification loop** — never claims a fix it can't prove (re-scanned clean).
- 🔐 **Tamper-evident evidence pack** — SHA-256 audit artifact per scan.
- 📒 **Compliance-debt ledger** — violations become tracked obligations, CSV for auditors.
- 🙋 **Human-in-the-loop** — every consequential write is server-enforced behind approval.

---

## 6 · Built on the required stack

| Requirement | CodeGuard |
|---|---|
| **Gemini 3** | `gemini-3-flash-preview` (AI Studio / Vertex auto-detect) |
| **Google Cloud Agent Builder** | `agent-builder/agent.json` — GitLab MCP + humanInTheLoop |
| **GitLab via MCP** | judged agent uses MCP; hosted app mirrors over REST |
| **Cloud Run** | deployed, public, europe-west1 |
| Agent (multi-step) | 5-step loop, 2 sub-agents |
| Reproducible eval | `npm run eval` → **100%** recall / **100%** fix-verification |

---

## 7 · Proof it's real

- **Live URL** you can click and run against a real MR — not a slideshow.
- **`[TESTED: YES]`** — real GitLab MR → BLOCK with 3 confirmed DORA/GDPR/NIS2 findings, ~8s.
- A **red CI pipeline** with CodeGuard's verdict in the build log.
- A real **auto-fix MR** opened by the agent.

---

## 8 · Market & impact

- **Who:** banks, insurers, fintechs, and their ICT third parties — all in DORA scope (in force Jan 2025).
- **Where it fits:** GitLab MR review + CI, the existing developer workflow — zero new tools to learn.
- **Value:** ~23 min → ~45 s per MR, consistent enforcement, and an **examiner-ready audit trail** by default.
- **Beyond DORA:** the same engine maps to NIS2, GDPR Art.32, PCI-DSS.

---

## 9 · What's next

- Persist the ledger (Firestore) + dashboards over time.
- Per-language rule packs; org-specific policy editor.
- Auto-remediation for multi-file fixes with test generation.
- SOC2 / NIS2 / PCI rule packs on the same agent.

---

## 10 · Ask

CodeGuard turns DORA Article 9 from a 23-minute manual chore into a **45-second, human-controlled,
audit-ready gate** on every merge request — and it **fixes** what it finds.

**Try it:** https://codeguard-908307939543.europe-west1.run.app → click **🎬 Judge Mode**.

> *Compliance isn't a vibe — it's a hash.* 🛡️
