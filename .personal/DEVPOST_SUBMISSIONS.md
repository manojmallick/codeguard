# 📝 DEVPOST SUBMISSIONS — copy for all 6 partner tracks

Paste-ready Devpost write-ups, one per partner bucket. Each follows the standard
Devpost section order (Inspiration · What it does · How we built it · Challenges ·
Accomplishments · What we learned · What's next · Built with) plus the required
submission fields. Fill the `<…>` placeholders before submitting.

> Honesty note: the numbers below (47 min → 8 sec, etc.) are the *target* before/after
> framing from the plans. Only state metrics you can actually show in the demo. Delete
> any you haven't measured — judges test claims.

Common "Built with" tags for every track: `Gemini 3`, `Google Cloud Agent Builder`,
`Cloud Run`, `Vertex AI`, plus the partner's tag.

Required per submission: **Hosted URL** · **Public repo (with MIT LICENSE)** ·
**~3-min demo video** · **correct Track selected** · Devpost form.

---

## 1 · RegQuery — MongoDB track

**Elevator:** Ask any DORA/NIS2/GDPR/EU AI Act question, get the exact article with a confidence score, in seconds.

**Inspiration.** Compliance officers at EU financial firms lose ~47 minutes per question digging through hundreds of pages of regulation PDFs — and still risk citing the wrong article. We wanted an agent that answers with the *exact* article and shows its reasoning, not a chatbot that might hallucinate a rule.

**What it does.** RegQuery is an agent that semantically searches the full text of DORA, NIS2, GDPR and the EU AI Act in MongoDB Atlas Vector Search, then uses Gemini 3 to synthesise a grounded answer with cited articles, a confidence score, and the reasoning behind it. For questions spanning multiple regulations it does multi-hop synthesis and flags contradictions. When you ask it to save an answer, it doesn't act silently — it proposes writing to your compliance profile and waits for your approval.

**How we built it.** Two agents in Google Cloud Agent Builder: **RegSearcher** (embeds the question with Vertex AI `text-embedding-004`, runs an Atlas `$vectorSearch` via the MongoDB MCP server) and **RegSynthesizer** (Gemini 3 multi-hop reasoning + citation verification). A thin Express app on Cloud Run serves the UI and mirrors the agent for the demo. Consequential writes (saving to the compliance profile) are gated behind a human-approval step.

**Challenges.** Preventing hallucinated article numbers — we added a citation-verification pass where Gemini re-reads each retrieved article and drops any that doesn't actually answer the question. Chunking regulations cleanly by article boundary also mattered for retrieval quality.

**Accomplishments.** Grounded answers traceable to exact articles; multi-hop cross-regulation synthesis; transparent confidence; and a real human-in-the-loop write-back rather than a silent action.

**What we learned.** For compliance, *verifiable* beats *fluent* — judges and officers trust an answer they can trace to Art.23 ¶3 far more than a confident paragraph.

**What's next.** Atlas Change Streams for live regulatory updates; a downloadable auditor report; more regulations.

**Built with:** Gemini 3 · Google Cloud Agent Builder · MongoDB Atlas Vector Search (MCP) · Vertex AI · Cloud Run · Node/Express.

---

## 2 · CodeGuard — GitLab track

**Elevator:** Every merge request, checked for DORA Article 9 compliance, before it reaches production.

**Inspiration.** In financial services, code that mishandles sensitive data — unencrypted card numbers, missing audit logs, absent authorization — can breach DORA Article 9 and cost real fines. Manual review is ~23 minutes per MR and inconsistent. We wanted an agent that reviews every MR and can actually *block* the bad ones, with a human in control.

**What it does.** When a merge request opens, CodeGuard reads the diff from GitLab, scans it against DORA/NIS2/GDPR code criteria (structured logging, encryption at rest, authorization, audit trail, safe error handling), and uses Gemini 3 to confirm real violations, dismiss false positives, and draft the exact fix. For a confirmed critical issue it proposes to comment, label, block the MR, and open a training issue — then waits for your approval before writing anything to GitLab. It also runs as a blocking CI gate.

**How we built it.** Two agents in Agent Builder: **GitLabReader** (fetches MR + diffs via the GitLab MCP server) and **DORAAuditor** (deterministic pre-scan + Gemini 3 confirmation and fix drafting). Express on Cloud Run adds a `/api/pipeline-check` CI gate and an MR webhook. All consequential GitLab writes require human approval.

**Challenges.** False positives waste engineers' time, so we used a cheap regex pre-scan only as a *signal* and let Gemini 3 make the final call — and tightened patterns (e.g. don't flag `encrypt(cardNumber)`) after testing surfaced a false positive.

**Accomplishments.** A real "block bad code" action, framework-aware checks, and a clean before/after fix in every review — with the human approving the block.

**What we learned.** The valuable part of a code-review agent isn't finding issues, it's *acting* on them safely; the approval gate is what makes that acceptable in a regulated org.

**What's next.** More languages/frameworks; a team DORA scorecard; auto-suggested commits.

**Built with:** Gemini 3 · Google Cloud Agent Builder · GitLab (MCP) · Vertex AI · Cloud Run · Node/Express.

---

## 3 · DynaCompliance — Dynatrace track

**Elevator:** Dynatrace detects the incident; the agent classifies it under DORA Art.17 and drafts the regulator notification — in ~90 seconds.

**Inspiration.** DORA Article 17 requires financial entities to classify major ICT incidents and submit a 4-hour early-warning to the regulator. Done manually it takes ~47 minutes and 23% of major incidents miss the 4-hour deadline. We wanted an agent that turns a Dynatrace problem into a ready-to-submit notification, with a human approving the send.

**What it does.** DynaCompliance pulls a Dynatrace problem (impact metrics, Davis AI root cause), applies the DORA Art.17 major-incident thresholds deterministically, computes the 4h/72h/1-month deadlines from the incident start, and uses Gemini 3 to explain the decision and draft the EBA early-warning notification. If the root cause is a third party it also flags Art.28. It then proposes to push the classification back to Dynatrace and submit to the regulator — and waits for your approval, with the draft editable.

**How we built it.** Two agents in Agent Builder: **DynaWatcher** (Dynatrace MCP reads) and **DORAClassifier** (deterministic Art.17 criteria + Gemini 3 rationale/draft). Express on Cloud Run serves the UI; consequential writes/submissions are approval-gated.

**Challenges.** The classification must be auditable, so thresholds are deterministic code (tested) and Gemini 3 only *explains* and drafts on top — never invents the verdict. Computing deadlines from incident start (not detection) is a subtle but critical detail.

**Accomplishments.** A tested Art.17 classifier (€8.3M incident → MAJOR + Art.28, deadline computed correctly) with an editable, human-approved regulator draft.

**What we learned.** Separating deterministic regulatory logic from the LLM's language work is what makes the output trustworthy for compliance.

**What's next.** Predictive pre-incident warnings; PagerDuty/Slack delivery; multi-jurisdiction templates.

**Built with:** Gemini 3 · Google Cloud Agent Builder · Dynatrace (MCP) · Vertex AI · Cloud Run · Node/Express.

---

## 4 · AuditLens — Arize track

**Elevator:** Every production LLM call, scored against the EU AI Act — daily, automatically.

**Inspiration.** Teams deploying LLMs in regulated contexts have almost no systematic EU AI Act monitoring — transparency (Art.13), human oversight (Art.14), labelling (Art.52). A quarterly manual audit samples ~100 traces and takes 3 days. We wanted an agent that audits *every* trace, daily, and proposes a fix.

**What it does.** AuditLens pulls production LLM traces from Arize Phoenix, uses Gemini 3 to score each against the EU AI Act rubric, rolls up an overall compliance score and a list of violations, and drafts a concrete prompt fix for the worst article. It then proposes to write the evaluation back to Phoenix as annotations and collect failing traces into a dataset for a prompt-improvement experiment — gated on your approval.

**How we built it.** Two agents in Agent Builder: **TraceCollector** (Phoenix MCP reads) and **ComplianceEvaluator** (Gemini 3 rubric scoring + fix drafting). Express on Cloud Run serves the UI; annotation/dataset/experiment writes require approval.

**Challenges.** Turning fuzzy regulatory requirements into a consistent 0–1 rubric Gemini 3 can score reliably, with per-article thresholds.

**Accomplishments.** A tested rollup (a crypto-advice trace scored 68% and correctly flagged Art.13 + Art.14) plus a one-click path from violation → dataset → experiment.

**What we learned.** Compliance for AI is itself an AI-observability problem — Phoenix traces are exactly the substrate an EU AI Act auditor needs.

**What's next.** Auto-deploy improved prompts after an approved experiment; scheduled daily runs; more article coverage.

**Built with:** Gemini 3 · Google Cloud Agent Builder · Arize Phoenix (MCP) · Vertex AI · Cloud Run · Node/Express.

---

## 5 · IncidentIQ — Elastic track

**Elevator:** Find the exact historical precedent that classifies a new incident under DORA — in seconds, not hours.

**Inspiration.** Financial entities hold hundreds of ICT incidents in Elasticsearch. Deciding whether a new one needs DORA Art.17 major-incident reporting takes a compliance analyst ~2 hours of manual precedent search. We wanted an agent that finds the precedents and classifies, instantly.

**What it does.** For a new incident, IncidentIQ runs a hybrid search (kNN vector + keyword) over the incident history in Elasticsearch, aggregates impact metrics with ES|QL, applies the DORA Art.17 thresholds weighted by how those precedents were classified, computes the reporting deadlines, and uses Gemini 3 to explain — citing the matched precedents. It then proposes to store the classification and create Kibana deadline alerts, gated on your approval.

**How we built it.** Two agents in Agent Builder: **ElasticSearcher** (hybrid search + ES|QL via the Elastic MCP endpoint) and **DORAAnalyst** (Art.17 criteria + precedent signal + Gemini 3 rationale). Express on Cloud Run serves the UI; index writes and alert creation require approval.

**Challenges.** Combining a deterministic threshold verdict with a precedent-based signal, and surfacing the ES|QL/precedents so the classification is explainable.

**Accomplishments.** A tested precedent-weighted classifier (MAJOR with a 67% precedent rate) that shows its evidence.

**What we learned.** Past incidents are the best explanation for a new one — retrieval makes the agent's verdict legible, not just correct.

**What's next.** Cold-start fallback tuning; auto-seeding the precedent index; richer Kibana alerting.

**Built with:** Gemini 3 · Google Cloud Agent Builder · Elasticsearch (MCP) · Vertex AI · Cloud Run · Node/Express.

---

## 6 · RegPipeline — Fivetran track

**Elevator:** Never miss a regulation change — a daily, automated regulatory digest with impact analysis.

**Inspiration.** EU regulations change constantly (EBA guidance, ESMA standards, DORA implementing acts). Compliance teams learn about changes from newsletters, not systems — and one missed update can mean a large fine. We wanted an agent that watches the sources and tells you what changed and what to do.

**What it does.** Each morning RegPipeline checks the health of Fivetran connectors syncing 5 regulatory sources (EUR-Lex, EBA, ESMA, DNB, FIFA) into BigQuery, reads the newly-synced documents, uses Gemini 3 to score each for compliance impact (HIGH/MEDIUM/LOW) and name the affected articles + required action, and drafts a daily digest. It then proposes to resync any delayed connectors and send the digest — gated on your approval. (It also covers FIFA 2026 World Cup partner advertising rules, showing it works beyond financial services.)

**How we built it.** Two agents in Agent Builder: **PipelineMonitor** (Fivetran MCP connector health + BigQuery reads) and **RegulatoryAnalyst** (Gemini 3 impact scoring + digest). Express on Cloud Run, triggered daily by Cloud Scheduler; resyncs and digest delivery require approval.

**Challenges.** Detecting schema changes and mapping them to affected downstream queries; keeping the digest grounded only in documents actually synced.

**Accomplishments.** A scheduled, end-to-end monitoring agent that turns raw syncs into an actionable, human-approved digest — including a HIGH-impact DORA threshold change in the demo.

**What we learned.** The pipeline's health and the regulation's content are one problem — an agent that watches both is far more useful than either alone.

**What's next.** Per-company impact profiles; Slack/email delivery; automatic downstream-query patches.

**Built with:** Gemini 3 · Google Cloud Agent Builder · Fivetran (MCP) · BigQuery · Vertex AI · Cloud Run · Cloud Scheduler.

---

## Submission field cheat-sheet (fill before submitting)

| Field | RegQuery | CodeGuard | DynaCompliance | AuditLens | IncidentIQ | RegPipeline |
|---|---|---|---|---|---|---|
| Track | MongoDB | GitLab | Dynatrace | Arize | Elastic | Fivetran |
| Hosted URL | `<cloud-run-url>` | `<…>` | `<…>` | `<…>` | `<…>` | `<…>` |
| Repo URL | `<github>` | `<…>` | `<…>` | `<…>` | `<…>` | `<…>` |
| Video (~3 min) | `<youtube/unlisted>` | `<…>` | `<…>` | `<…>` | `<…>` | `<…>` |
| LICENSE present | ✅ MIT | ✅ | ✅ | ✅ | ✅ | ✅ |
