# Devpost Submission — copy-paste fields

## Project name  *(49 / 60)*
```
CodeGuard — DORA Art.9 Merge-Request Review Agent
```

## Elevator pitch  *(171 / 200)*
```
GitLab merge requests, checked for DORA Art.9 compliance before production — Gemini 3 reasons, a human approves, and CodeGuard auto-fixes the violation. ~45s, not ~23 min.
```

---

## About the project  *(paste into the Markdown box)*

## Inspiration
The EU's **Digital Operational Resilience Act (DORA)** went into force for financial entities in
January 2025. Article 9 requires that every change to an ICT system protects data — encryption at
rest, structured security logging, authorization before data access, audit trails, and safe error
handling. In practice this is checked by a senior engineer reading each merge request **by hand —
~23 minutes per MR**, inconsistently, and usually *after* the risky code is already written. We
wanted to move that check **left**: onto every merge request, automatically, in seconds, without
taking humans out of the loop on anything consequential.

## What it does
CodeGuard is an autonomous, human-gated compliance reviewer for GitLab merge requests. For each MR it:
1. **Reads** the MR and its changed-file diffs (GitLab MCP / REST).
2. **Pre-scans** the added code with a deterministic DORA/NIS2/GDPR rule engine.
3. **Reasons with Gemini 3** to confirm real violations, cut false positives, and draft a before/after fix with the exact article cited.
4. **Decides** pass / warn / **block**.
5. **Verifies every fix** by re-scanning it — it never shows a fix it can't prove clears the rule.

Then, **only after a human approves**, it acts through GitLab: posts the review comment, applies a
`compliance-blocked` label, blocks the MR, opens a training issue for repeat offenders — and, as the
headline feature, **pushes a verified fix branch and opens a remediation MR**. It also runs as a
**blocking CI gate** (a non-compliant MR turns the pipeline red) and an MR webhook. Every scan emits
a **SHA-256 tamper-evident evidence record**, and confirmed violations become tracked obligations in
a **compliance-debt ledger** exportable to CSV for auditors. A one-click **🎬 Judge Mode** runs the
entire story unattended.

## How we built it
- **Gemini 3** (`gemini-3-flash-preview`) for the reasoning step, via the `@google/genai` SDK. The
  code auto-detects either the **AI Studio (Gemini Developer API)** or **Vertex AI** backend.
- **Google Cloud Agent Builder** holds the judged agent definition (`agent-builder/agent.json`) —
  Gemini 3 + the **GitLab MCP server** as the tool source, with `humanInTheLoop` approval on every write.
- A **Node + Express** service mirrors the agent for the hosted UI, CI gate, webhook, and
  auto-remediation; a single-file dark "DevSecOps" dashboard drives it.
- **Cloud Run** hosts it (built with **Cloud Build**, image in **Artifact Registry**); **Secret
  Manager** holds the Gemini key, GitLab token, and CI shared secret.
- A deterministic golden-set **eval** (`npm run eval`) scores detection + fix-verification with no credentials.

## Challenges we ran into
- **Finding the right Gemini 3 model id.** Our project is an AI Studio (gen-lang-client) project, so
  Vertex returned 404 for every generative model. On the Developer API, `gemini-3-pro-preview` is
  *listed* but responds *"no longer available."* We discovered `gemini-3-flash-preview` serves and
  returns clean JSON — and made the backend auto-detect AI Studio vs Vertex so the same code runs on both.
- **Keeping the demo bulletproof.** Live Gemini + GitLab calls take ~8s and need credentials, which
  is risky on stage. We added a `demo/...` sandbox that the server always serves as canned data, so
  **Judge Mode never fails**, while any real project path hits live APIs.
- **Making a real red CI pipeline fail for the *right* reason.** Our first `.gitlab-ci.yml` used
  `node:20-alpine`, which has no `curl` (exit 127). We switched to `alpine` + `apk add curl` so the
  job fails specifically on the DORA block, with CodeGuard's verdict in the build log.
- **Auto-remediation matching.** Gemini's fix snippets don't always match source whitespace, so we
  apply fixes with tolerant exact-then-trimmed-line matching before committing the fix branch.

## Accomplishments that we're proud of
- It's **genuinely live and tested** — a real GitLab MR returns BLOCK with 3 confirmed
  DORA/GDPR/NIS2 findings in ~8 seconds, and the agent **opens a real auto-fix MR**.
- An **agent that closes the loop**: detect → reason → prove → *fix*, not just lint.
- **Human-in-the-loop is real**, not cosmetic — writes are 403'd server-side until approval.
- **Audit-ready by design**: a verifiable evidence hash per scan and a CSV-exportable obligation ledger.
- **100% / 100%** on our reproducible detection + fix-verification eval.

## What we learned
- Pairing a cheap **deterministic pre-scan** with an **LLM confirmation** step gives high recall *and*
  low false positives — the regex finds candidates, Gemini 3 makes the judgment call.
- Treating a code review as **governance** (evidence + obligations) is what turns a neat demo into
  something a regulated bank could actually adopt.
- The most convincing hackathon proof isn't a slide — it's a **clickable URL** a judge can run themselves.

## What's next for CodeGuard
- Persist the ledger (Firestore) with trend dashboards over time.
- Per-language rule packs and an org-specific policy editor.
- Multi-file auto-remediation with generated tests.
- Additional rule packs on the same engine: NIS2, GDPR Art.32, PCI-DSS, SOC 2.

---

## Built with  *(tags)*
```
node.js, express, javascript, google-cloud, gemini, gemini-3, vertex-ai, ai-studio,
google-cloud-agent-builder, cloud-run, cloud-build, secret-manager, artifact-registry,
gitlab, gitlab-mcp, model-context-protocol, docker, html, css, rest-api
```

## "Try it out" links
```
Live app:   https://codeguard-908307939543.europe-west1.run.app
Source:     https://github.com/manojmallick/codeguard
Demo MR:    https://gitlab.com/mmallick1990/codeguard-demo/-/merge_requests/1
```

## What Google Cloud products did you use?
```
• Gemini 3 (gemini-3-flash-preview) — code-analysis reasoning, via AI Studio / Vertex AI
• Google Cloud Agent Builder — the judged agent (Gemini 3 + GitLab MCP + human-in-the-loop approval)
• Cloud Run — hosts the CodeGuard service (europe-west1)
• Cloud Build — container builds from source
• Artifact Registry — container image storage
• Secret Manager — Gemini API key, GitLab token, CI shared secret
```

## Please list all other tools or products you used
```
• GitLab — the partner platform (merge requests, CI/CD pipelines, issues)
• GitLab MCP server (@gitlab-org/mcp-server-gitlab) — Model Context Protocol tool source for the agent
• Node.js + Express — backend service
• Docker — container image
• HTML/CSS/JS — single-file DevSecOps dashboard UI
• Puppeteer (headless Chrome) — auto-generated documentation screenshots
```
