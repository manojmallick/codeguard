# 🔬 APP-BY-APP IMPROVEMENT PLAN — 6 DORA/Compliance Agents

**Goal:** Make each agent *more useful* — better at solving its real purpose, with hidden angles
that lift it from "hackathon demo" to "a compliance team would actually deploy this."
**Constraint:** Stay on the required stack (Gemini 3 + Agent Builder + partner MCP), hosted URL,
public repo, ~3-min demo. Deadline June 11, 2026.

> ⚠️ **Accuracy guardrail (applies to all 6):** Verify every regulation article→obligation
> mapping against the *final DORA RTS/ITS and the EU AI Act consolidated text* before shipping.
> The source docs use "DORA Art.17/Art.23" loosely. The real spine is **Art.17 (incident-management
> process) · Art.18 (classification) · Art.19 (reporting of major ICT incidents)**, thresholds set
> by the RTS. A wrong article number is the one unforgivable bug in a compliance tool. `[MED]`

---

## 🧭 THE UNIFYING INSIGHT (read first)

These are **not 6 apps — they are one DORA/EU-compliance operating system**, split across 6 partner
buckets. Seeing that unlocks the highest-value improvements:

```
RegPipeline (Fivetran)  → INGEST    : keeps the rulebook current
RegQuery (MongoDB)      → KNOW       : what the rules mean (Q&A + gaps)
CodeGuard (GitLab)      → PREVENT    : ICT risk in code  (DORA Art.9 risk mgmt)
DynaCompliance (Dynatrace)→ DETECT   : an incident is happening NOW
IncidentIQ (Elastic)    → REPORT     : DORA Art.18/19 classification + filing
AuditLens (Arize)       → ASSURE     : EU AI Act conformity of AI systems
```

Three things they should **share** (even if submitted as 6 separate entries — demonstrating a shared
spine is the strongest "this is a platform, not a demo" signal a judge can see):

1. **One Obligation/Control data model** — `{obligation_id, regulation, article, trigger, deadline,
   authority, owner, evidence[]}`. Every app reads/writes it. RegPipeline updates it, RegQuery
   explains it, IncidentIQ acts on it.
2. **A shared evidence/audit ledger** — every consequential action (a filed report, a deployed
   prompt, an MR comment) is logged with who/what/why/when. This is what makes any of them
   *deployable* in a regulated firm.
3. **The agentic loop, not the chatbot.** Each agent must **trigger autonomously → reason → ACT →
   verify**, with a human-in-the-loop gate on consequential actions. Judges reward autonomy + action
   over "ask it a question, it answers." This single reframe is worth more than any feature.

---

## 1 · RegQuery (MongoDB) — *the regulatory brain*

**Purpose (real job):** A compliance officer needs the *exact, current, citable* answer to a
specific obligation question — and needs to trust it enough to act.

**Honest gap:** As specced it's a well-built RAG chatbot. Judges have seen a thousand RAG chatbots.
The "compliance profile over sessions" is the real differentiator but it's *passive*. Three things
turn it from "smart search" into "irreplaceable":

**Improvements (buildable on Atlas):**
1. **Point-in-time / version-aware retrieval.** Store `effective_date`, `superseded_date`,
   `version` on every article chunk. Answer *"What was the DORA reporting timeline on 12 March 2026?"*
   vs *"…today?"*. **Almost no RAG tool does point-in-time compliance** — and it's exactly what an
   auditor asks ("what rule applied when the incident happened?"). High-value, low-effort metadata.
2. **Pre-computed cross-regulation graph** via `$graphLookup`. Don't *prompt* multi-hop — *store* the
   edges (DORA Art.28 ⇄ GDPR Art.32 ⇄ NIS2 security). Multi-hop becomes a traversal, not a hope.
3. **Obligation extraction → exportable, trackable checklist.** Every answer also emits a structured
   obligation `{who, what, deadline, authority}` that drops into the shared Obligation model — the
   bridge to RegPipeline/IncidentIQ. Turns "an answer" into "a task."
4. **Calibrated abstention.** If top vectorSearch score < threshold, **refuse / escalate** instead of
   answering. *Knowing when it doesn't know* is the #1 trust signal for a compliance tool — and a
   direct counter to "ChatGPT hallucinates regulations."

**Hidden angles:**
- **Reverse RegQuery (the interview agent).** Flip "suggested next questions" into an agent that
  *proactively interrogates the company* to surface gaps it didn't know it had. Gap-discovery as a
  product, not a byproduct.
- **NL jurisdiction overlay (your moat).** Layer DNB/AFM local enforcement nuance on top of the EU
  base text. This is precisely what a generic model lacks and what a Dutch ZZP knows cold.
- **Liability framing built in.** Every answer carries "decision-support, not legal advice" + an
  audit log entry. The meta-compliance that makes it safe to deploy.

**Partner-MCP depth (scored):** Atlas Change Streams to live-update embeddings when RegPipeline
pushes a change; Atlas Charts for the compliance-score-over-time view.

**Demo hook:** Ask the same question "as of" two dates that straddle a threshold change → two
correctly different, correctly cited answers. No generic chatbot can do that.

---

## 2 · CodeGuard (GitLab) — *preventive ICT control*

**Purpose (real job):** Stop ICT risk from shipping — and prove you did, for DORA Art.9.

**Honest gap:** This is the **most crowded space** (Snyk, Semgrep, CodeQL, GitHub Advanced Security).
"We find CVEs" will *lose* a head-to-head against tools with 100× the resources. The plan's own
benchmark ambition (beat Snyk) is a trap. **The wedge is not detection — it's the compliance
translation no security scanner does.**

**Improvements:**
1. **Vuln → regulatory-exposure mapping.** Don't stop at "SQL injection, CVE-X, CVSS 9.8." Add:
   *"→ DORA Art.9 ICT risk-management failing; if exploited, likely a major ICT incident under
   Art.18 thresholds."* **No commercial scanner speaks regulation.** This is your unique lane and it
   ties the whole portfolio together.
2. **MR-native agentic action.** The agent comments *on the GitLab merge request* with the fix + a
   test, gated behind approval. It *acts in the workflow*, not in a dashboard.
3. **Fix-verification loop.** Generate fix → generate test → **run it** → only propose if green.
   State `[TESTED: yes/no]`. Closes the loop = genuinely agentic.
4. **Reachability triage.** The real pain is alert fatigue, not detection. Down-rank vulns whose code
   path isn't reachable. Fewer, truer alerts beats more alerts every time.

**Hidden angles:**
- **DORA Art.28 third-party / supply-chain lens.** Scan *dependencies* and frame them as ICT
  third-party risk — feeding RegQuery's "third-party register" gap. Connects two apps.
- **Auditor evidence pack.** Every scan emits a signed artifact ("on date X, commit Y was scanned,
  N risks, all remediated"). Converts a dev tool into *audit evidence* for a DORA examination.
- **"Compliance-debt ledger."** Track open vulns as quantified regulatory liability over time —
  CISO/CFO language, not engineer language.

**Partner-MCP depth:** GitLab MCP for MR comments, pipeline gates, and issue creation — the agent
operates GitLab, doesn't just read it.

**Demo hook:** Push a vulnerable commit → agent comments on the MR with fix + passing test + "this
maps to DORA Art.9" → reviewer clicks approve. Detection *and* action *and* compliance in one shot.

---

## 3 · DynaCompliance (Dynatrace) — *real-time detection & the regulatory clock*

**Purpose (real job):** The instant something breaks, know (a) what/why, and (b) **is this becoming a
DORA-reportable event?**

**Honest gap:** Big overlap risk with IncidentIQ (both classify DORA incidents). If they duplicate,
both look thin. **Resolve it by position:** DynaCompliance owns *real-time detection + triage at the
moment of incident*; IncidentIQ owns *the retrospective classification decision + the filing*.
DynaCompliance *feeds* IncidentIQ.

**Improvements:**
1. **The DORA clock starts at detection — automatically.** The killer feature: the moment Dynatrace
   (Davis AI) detects, start the Art.19 reporting timers (e.g. early-warning / intermediate / final
   — exact windows per RTS). Today the clock effectively starts at human triage; you reclaim *hours*
   of regulatory exposure. **This is the single most valuable thing in the whole portfolio.** `[MED]`
2. **Don't reinvent RCA — translate it.** Use Dynatrace **Davis AI** root cause as *grounding* for
   Gemini; Gemini's job is to turn it into compliance language + the next action, not to re-derive
   the root cause. Faster, more accurate, and honest about what's doing the work.
3. **Blast-radius → client-impact estimate.** Dynatrace knows the service topology. Estimate
   *% clients affected* and *transaction value at risk* — the exact numbers that decide DORA
   materiality and that humans struggle to produce under pressure.
4. **Action, gated.** Trigger the runbook remediation via webhook/Dynatrace with one-click approval —
   not just a text suggestion.

**Hidden angles:**
- **SLO→regulation bridge.** Map technical SLOs to regulatory thresholds so observability data feeds
  DORA criteria with no human translation step.
- **"Reportability gate" as a service.** A single real-time signal — *green / amber (watch) / red
  (DORA clock running)* — that any incident tool can consume. That gate is the product.

**Partner-MCP depth:** Dynatrace MCP to pull Davis problems, entity topology, and SLOs; push
classification back as a problem comment/event.

**Demo hook:** Trigger a synthetic outage → Davis detects → DynaCompliance starts the DORA clock,
estimates 12% client impact, flags "amber → red," and hands off to IncidentIQ — live, in seconds.

---

## 4 · IncidentIQ (Elastic) — *the DORA reporting machine*

**Purpose (real job):** Decide, defensibly, whether an incident is **major** under DORA, then produce
the *actual* regulatory submission — the 2-hour manual task.

**Honest gap:** The plan over-weights "precedent search" (nice, but secondary) and under-weights the
two things that are the real value: **the filled-in report** and **the defensibility of the
classification decision** (a regulator can challenge it).

**Improvements:**
1. **Auto-draft the real submission**, in the competent authority's format (DNB / national CSIRT).
   The deliverable is the *filled form*, not a summary. That's the job.
2. **Decision-defensibility record.** Store *why* it was classified major/minor, with the evidence
   and thresholds applied, version-stamped — because the regulator will ask. The audit trail of the
   *decision* is itself the product.
3. **Aggregation of recurring incidents.** DORA: recurring minor incidents can be **major in
   aggregate**. Elasticsearch aggregations are perfect for this rule — and most tools miss it
   entirely. A genuine hidden DORA requirement, trivially yours with ES|QL `STATS`.
4. **Deadline orchestration.** Kibana Watches → escalating reminders → named owner per report stage.
   Project-manage the obligation, don't just flag it.

**Hidden angles:**
- **"Would-have-been-major" near-miss detection.** Incidents just under threshold = early signal of
  systemic risk. Boards and regulators both reward this; nobody surfaces it.
- **Anonymized cross-entity benchmarking.** "Your incident profile vs peers." Network effect + data
  moat — the thing that compounds.

**Partner-MCP depth:** Elastic MCP for ES|QL + hybrid vector search; Elastic Workflows for the
classification pipeline; Kibana Watches as the autonomous trigger (true agent, not on-demand).

**Demo hook:** Feed a borderline incident → IncidentIQ applies thresholds, shows the *aggregation*
that pushes 3 minors into a major, drafts the DNB submission, and sets the 3 deadline reminders.

---

## 5 · AuditLens (Arize) — *EU AI Act conformity layer*

**Purpose (real job):** Prove a production AI system is — and *stays* — EU AI Act compliant.

**Honest gap:** Most AI-native and judge-pleasing of the six — but two risks. (a) "LLM judges LLM"
is a reliability hole. (b) Per-response transparency checks are a *sliver* of EU AI Act high-risk
obligations, which are mostly *system-level*.

**Improvements:**
1. **Cover system-level obligations, not just per-message.** EU AI Act high-risk needs a risk-
   management system (Art.9), data governance (Art.10), logging (Art.12), technical documentation
   (Art.11 / Annex IV), human oversight (Art.14). **Auto-generate the Annex IV technical
   documentation** from trace evidence — that's the artifact a notified body wants. `[MED: verify
   article/Annex numbers against consolidated AI Act text]`
2. **Calibrate the evaluator (eval the evals).** The judge-LLM must be validated against human labels
   — show agreement / accuracy. This is *literally Arize's wheelhouse* and is your reliability moat;
   it directly answers "how do we know the compliance score is real?"
3. **Drift → compliance-regression alarm.** When a model/prompt changes, transparency compliance can
   silently regress. Tie Phoenix drift detection to the compliance score = *continuous* conformity,
   not a point-in-time check.
4. **AI Act serious-incident reporting (Art.73).** The AI Act *also* mandates incident reporting.
   AuditLens detects reportable AI malfunctions → connects to the same incident/reporting spine as
   IncidentIQ.

**Hidden angles:**
- **GPAI / deployer obligations (Art.53/55).** Gemini is a GPAI; document the downstream-deployer
  duties. Timely as the AI Act phases in. `[LOW: confirm current phase-in dates]`
- **Dogfood: AuditLens monitors the *other 5 agents*.** They are all LLM systems. AuditLens becomes
  the conformity layer for the whole platform — the recursive meta-angle judges remember.

**Partner-MCP depth:** Phoenix MCP for traces/spans/annotations; `create_dataset` from failures →
`run_experiment` (A/B prompts) → `update_prompt` = a real self-improvement loop, not a static eval.

**Demo hook:** Show a financial-advice trace failing Art.13 → AuditLens datasets it, runs the
experiment, the fixed prompt passes, and the *evaluator's own accuracy vs human labels* is displayed.

---

## 6 · RegPipeline (Fivetran) — *the spine that keeps everything current*

**Purpose (real job):** Never miss a regulatory change — and know *what to do* about it.

**Honest gap:** A "daily digest" is *informational* — weak "so what." It tells you something changed
but doesn't drive action. Also: the **FIFA / World Cup angle dilutes** the financial-services story —
cut it from the core demo (or keep it only as a 10-second "domain-agnostic" proof). `[MED — judgment call]`

**Improvements:**
1. **Change → impact → task.** A change must auto-diff against your *current* obligations and emit
   tracked remediation tasks (owner, deadline). From "FYI newsletter" to "your updated to-do list."
2. **Regulatory diff + retroactive re-classification.** When a delegated act moves a threshold
   (e.g. 10%/2h → 8%/1.5h), compute the precise delta **and re-run it against historical incidents**
   — "8 past incidents would now be major." Screen 2 hints at this; make it *the* feature. Gold for a
   demo, and a real board-level insight.
3. **Horizon scanning / lifecycle tracking.** Track each rule through consultation → draft → adopted →
   effective. Compliance teams need *lead time*, not just "it's law now."
4. **Provenance & freshness SLA.** "Detected within X hours of publication; here's the source URL."
   Defensibility + trust.

**Hidden angles:**
- **RegPipeline is the source-of-truth updater for the whole platform.** Its change feed *pushes*
  into RegQuery (re-embed changed articles), IncidentIQ (update thresholds), AuditLens (update AI Act
  criteria). The integration that makes 6 apps one living system.
- **"Cost of the miss" counter.** Quantify avoided fines per detected change (the €850K DNB example,
  generalized). CFO-grade framing.

**Partner-MCP depth:** Fivetran MCP for connector health, `trigger_sync`, schema-change detection;
Cloud Scheduler as the autonomous daily trigger; BigQuery as the warehouse the agent queries.

**Demo hook:** A new delegated act lands → RegPipeline diffs the threshold, re-classifies 8 historical
incidents as now-major, and files remediation tasks — all before 08:00 CET, zero human hours.

---

## 🔁 CROSS-CUTTING IMPROVEMENTS (apply to all 6, highest ROI)

| # | Improvement | Why it wins | Effort |
|---|-------------|-------------|--------|
| 1 | **Agentic loop** (autonomous trigger → reason → act → verify) | Judges reward autonomy + action over Q&A | Med |
| 2 | **Eval harness** (golden set + measured accuracy) per agent | The "irrefutable proof" the master plan demands | Med |
| 3 | **Human-in-the-loop gate** on consequential actions | Makes each one *deployable* in a regulated firm | Low |
| 4 | **Calibrated abstention** ("I'm not sure → escalate") | The trust signal that beats generic LLMs | Low |
| 5 | **Shared Obligation/Control model + audit ledger** | Turns 6 demos into one platform story | Med |

**Priority order if time is short (before Jun 11):**
1. Make each agent *act*, not just answer (loop + HITL gate). — biggest perceived leap
2. Add the eval harness to the 2–3 strongest (RegQuery, IncidentIQ, AuditLens). — proof
3. Wire the one cross-app handoff that demos best: **DynaCompliance → IncidentIQ** (detect → report)
   and **RegPipeline → RegQuery** (change → updated knowledge). — platform signal

**What to cut / de-risk:**
- CodeGuard "beat Snyk" benchmark → replace with the regulatory-mapping wedge (don't fight on
  detection).
- RegPipeline FIFA angle → cut from core demo.
- Any fabricated CVE IDs / testimonials / "99% win" numbers → produce real or delete (per the master
  plan's own banner).

---

## 📌 Per-app one-line "north star"

- **RegQuery** → *the only compliance answer engine that tells you the rule as it was on any date, and
  knows when to stay silent.*
- **CodeGuard** → *the only scanner that tells you which regulation each vulnerability breaks — and
  fixes it in the MR.*
- **DynaCompliance** → *starts the DORA reporting clock the instant the incident does.*
- **IncidentIQ** → *files the major-incident report for you, and can defend the decision to a regulator.*
- **AuditLens** → *continuous EU AI Act conformity — and it proves its own evaluations are accurate.*
- **RegPipeline** → *the rulebook that updates itself, re-checks your history, and hands you the to-do list.*
