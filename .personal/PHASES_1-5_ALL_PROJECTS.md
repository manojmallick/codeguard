# 🚀 PHASES 1–5 — Build/Ship Plan Mapped Across All 6 Projects

Maps the official Google Cloud Rapid Agent Hackathon resource phases onto each of the
six agents. Deadline **June 11, 2026**. Required stack on every project: **Gemini 3 +
Google Cloud Agent Builder + partner MCP**, a hosted URL, public repo + OSS LICENSE, ~3-min demo.

> Naming note: the program's console is referred to in the resource list as the *Gemini
> Enterprise Agent Platform* / *Agent Builder*. Treat those as the same managed agent
> surface; "Agent Builder" is used below. `[MED — verify exact console/SDK names at build time]`

**Status legend:** ✅ done · 🔶 partial/scaffold · ⬜ not started

| Project | Partner | MCP server | Accent | Code status |
|---------|---------|-----------|--------|-------------|
| RegQuery | MongoDB | `@mongodb-js/mcp-server-mongodb` | `#00ED64` | ✅ v2 (point-in-time, abstention, obligations) |
| IncidentIQ | Elastic | Elastic MCP / Agent Builder endpoint | `#00BFB3` | ✅ v2 (recurrence, DNB draft, defensibility, handoff) |
| DynaCompliance | Dynatrace | Dynatrace MCP | `#1496FF` | ✅ handoff sender + clock-at-detection |
| AuditLens | Arize | `@arizeai/phoenix-mcp` | `#7C3AED` | ✅ v2 (evaluator calibration κ=0.83) |
| RegPipeline | Fivetran | `@fivetran/mcp-server` | `#0073E6` | 🔶 scaffold |
| CodeGuard | GitLab | GitLab MCP | `#FC6D26` | 🔶 scaffold |

---

## PHASE 1 — Core Frameworks & Environment

**Goal:** one GCP project, Gemini 3 on Vertex, Agent Builder enabled, credits claimed.

**Shared (do once, all 6):**
- [ ] Create/confirm GCP project; claim no-cost trial or the $100 credit form.
- [ ] `gcloud auth application-default login` · set project · region `europe-west1` (EU data residency — matters for a DORA story).
- [ ] Enable APIs: Vertex AI, Agent Builder / Gemini Enterprise Agent Platform, Cloud Run, Secret Manager, Cloud Scheduler (RegPipeline), BigQuery (RegPipeline).
- [ ] Pin models: `GEMINI_MODEL=gemini-3`, `EMBEDDING_MODEL=text-embedding-004`, `GOOGLE_GENAI_USE_VERTEXAI=true`.

**Per-project:** all six already carry `.env.example` + `agent-builder/agent.json`. Action = fill `.env`, confirm `npm install` + `MOCK=true npm run dev` boots (verified for RegQuery, IncidentIQ, DynaCompliance, AuditLens).

**Exit criteria:** `gemini-3` responds via Vertex in each repo; Agent Builder project exists.

---

## PHASE 2 — Action Mechanisms & Data Connectivity (Tools + Grounding)

**Goal:** each agent can *know* (grounded data) and *do* (tools), via its partner MCP.

| Project | Grounding / "source of truth" | Action tools (consequential = approval-gated) |
|---------|------------------------------|----------------------------------------------|
| RegQuery | Atlas Vector Search over DORA/NIS2/GDPR/AI-Act, **version-stamped** for point-in-time | `insert(sessions)`, `insert_many(obligations)`, `insert(audit_log)` |
| IncidentIQ | ES hybrid search over `ict-incidents` + ES\|QL recurrence aggregation | `esql_index(classification)`, `index(defensibility/obligations)`, `kibana.create_alert` |
| DynaCompliance | Dynatrace problems + **Davis AI** root cause + topology | `push_event`, `notify.submit_eba`, **`forward → IncidentIQ /api/ingest`** |
| AuditLens | Phoenix traces/spans | `create_annotation`, `create_dataset`, `run_experiment`, `update_prompt` |
| RegPipeline | BigQuery warehouse (EUR-Lex/EBA/ESMA/DNB via Fivetran) | `trigger_sync`, write digest, create remediation tasks |
| CodeGuard | Repo/CVE context | `gitlab.comment_mr`, `create_issue`, pipeline gate |

**Shared pattern (already implemented in the 4 built apps):** read steps run automatically;
the consequential write is returned as a `proposedAction` and only runs after the
ApprovalBar approves (`POST /api/execute`, 403 without `approved`). Replicate verbatim in
RegPipeline + CodeGuard.

**Exit criteria:** `/health` shows `partner_mcp_connected: true`; one real read + one
approval-gated write succeed end-to-end.

---

## PHASE 3 — Partner Integration & Infrastructure

**Goal:** the partner MCP is wired in Agent Builder (the *judged* path), mirrored by the
hosted web app (the *demo* path). Keep both in sync (same store, same index).

Per-project checklist (each `agent-builder/agent.json` already declares 2 agents + tools):
- [ ] **RegQuery / MongoDB** — Atlas cluster + `regulatory_vector_index` (vector + filter fields `regulation`, `effective_date`, `superseded_date`); MongoDB MCP connected.
- [ ] **IncidentIQ / Elastic** — `ict-incidents` (+ `obligations`, `audit_log`) indices; hybrid kNN; Elastic MCP/Agent Builder endpoint; Kibana Watch as autonomous trigger.
- [ ] **DynaCompliance / Dynatrace** — API token (problems read, events ingest); set `INCIDENTIQ_URL` to enable the detect→report handoff.
- [ ] **AuditLens / Arize** — Phoenix (cloud or self-host) + OpenInference instrumentation; Phoenix MCP; load `golden-labels.json` for calibration.
- [ ] **RegPipeline / Fivetran** — connectors (EUR-Lex/EBA/ESMA/DNB) → BigQuery; Fivetran MCP; schema-change detection on.
- [ ] **CodeGuard / GitLab** — project access token; GitLab MCP; `.gitlab-ci.yml` job calls the agent on MR.

**Exit criteria:** partner data visible in the agent; partner-specific superpower demonstrable
(point-in-time / recurrence-aggregation / Davis-grounding / calibration / schema-diff / MR-comment).

---

## PHASE 4 — Reasoning, State & Logic Hosting

**Goal:** memory + a home for code; the agent loop + the platform spine.

- **Agent loop (all 6):** autonomous trigger → reason (Gemini 3) → ACT (gated) → verify. ✅ in 4; ⬜ RegPipeline (Cloud Scheduler 08:00 CET), ⬜ CodeGuard (MR webhook).
- **State / spine (cross-app):** the shared **Obligation model** + **audit ledger** —
  `{regulation, article, who, what, deadline, authority, trigger, status}` + immutable audit.
  Implemented in RegQuery (Atlas) and IncidentIQ (Elastic). Port the same schema to the rest.
- **Secrets:** Secret Manager for every partner key (`--set-secrets` on deploy). Never commit `.env`.
- **Hosting:** Cloud Run per app (custom backend + web UI). Optional: Agent Runtime for any
  Python/LangChain orchestration.
- **Proof (eval harness):** ✅ IncidentIQ `npm run eval` (100% on 12 cases), ✅ RegQuery
  `npm run eval`, ✅ AuditLens `npm run calibrate` (κ=0.826). ⬜ add a deterministic eval to
  RegPipeline (diff correctness) + CodeGuard (vuln→regulation mapping recall).

**Exit criteria:** each app runs its loop unattended once; eval/calibration report committed.

---

## PHASE 5 — Deployment & Safety

**Goal:** hosted URL, guardrails, submission assets.

**Deploy (all 6):**
```bash
gcloud run deploy <service> --source . --region=europe-west1 --allow-unauthenticated \
  --set-secrets="<PARTNER_KEY>=<secret>:latest" \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=true,GEMINI_MODEL=gemini-3"
```
- [ ] RegPipeline also: Cloud Scheduler daily 08:00 CET → `/api/daily-run`.
- [ ] DynaCompliance also: `--set-env-vars INCIDENTIQ_URL=<incidentiq cloud-run url>`.

**Safety & guardrails (all 6):**
- [ ] Agent Builder safety settings (content filters) ON.
- [ ] **Human-in-the-loop gate** on every consequential write (already enforced: 403 without approval).
- [ ] **Calibrated abstention / defensibility** — RegQuery abstains below threshold; IncidentIQ
      stamps a version + evidence record; AuditLens reports evaluator κ. Carry the "decision-support,
      not legal advice" disclaimer + audit log on all.
- [ ] Verify every regulation **article number** against the final DORA RTS / AI Act text.

**Submission assets (per project):**
- [ ] Hosted URL + `/health` returning `partner_mcp_connected: true`.
- [ ] Public repo + OSS LICENSE (present).
- [ ] ~3-min demo video hitting the partner superpower + the approval gate.
- [ ] Devpost: problem, architecture, the eval/calibration screenshot (real numbers), ROI.

**Exit criteria:** all 6 submitted ≥4h before deadline with confirmation screenshots.

---

## CRITICAL PATH (given June 11)

1. **Finish the two scaffolds** to v2 parity (RegPipeline diff+tasks, CodeGuard vuln→regulation+MR) — same loop/gate/ledger pattern as the four done.
2. **Phase 3 for each** — the partner wiring is the longest pole; do it per app right after its build.
3. **One cross-app demo** — DynaCompliance→IncidentIQ (built ✅) and RegPipeline→RegQuery — the "platform, not 6 demos" signal.
4. **Record demos + Devpost** with the real eval/calibration artifacts (these already exist for 3 apps).
5. **Submit early.**

---

## What's already DONE (verified this session, MOCK mode)

- RegQuery v2: point-in-time retrieval, calibrated abstention, obligation ledger + CSV, audit log. `npm run eval` PASS.
- IncidentIQ v2: recurrence aggregation, DNB submission draft, defensibility record, obligation ledger, `/api/ingest` handoff. `npm run eval` 100%.
- DynaCompliance: clock-at-detection (`detected_at` anchor), `forwardToIncidentIQ`, `/api/handoff`. Live cross-service handoff verified.
- AuditLens v2: evaluator calibration (Cohen's κ, confusion, MAE) — `npm run calibrate` κ=0.826, `/api/calibration` live.

> All four boot in `MOCK=true` for credential-free demo rehearsal. `[TESTED: yes — MOCK]`
> Live partner paths are wired but not yet run against real Atlas/Elastic/Dynatrace/Phoenix `[TESTED: NO — live]`.
