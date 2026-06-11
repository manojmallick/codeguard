# 🟢 BEAT-3 APPROVAL SCREENS — the missing screen for all 6 tracks

This is the **action / human-in-the-loop** screen (beat 3 of the screen flow in
`DESIGN_SYSTEM.md` §3–§4). Every track's existing `CLAUDE_*.md` already covers
beats 1 (command), 2 (analysis) and 4 (confirm) — but **skips the explicit approval
step**, which is the single clearest "this is an agent that keeps you in control"
signal the judges are told to reward.

**How to use:** prepend the `DESIGN_SYSTEM.md` §7 Stitch master preamble, paste the
track's block below, append the §6 accent line for that bucket. Generate the screen.
This becomes **Devpost screenshot #3** and the climax of the ~3-min demo video.

Shared anatomy of every beat-3 screen:
- Top: a one-line **agent plan summary** ("Agent has analyzed X and proposes to do Y").
- Middle: the **draft/payload** the agent produced (editable) + the **evidence** it's based on.
- A **tool manifest**: the exact MCP tools that will fire on approve (transparency).
- Sticky bottom **ApprovalBar**: `[Edit] [Reject] [Approve & Execute ▸]` — nothing
  consequential runs until Approve is clicked.
- The AgentActivityLog shows read-only steps already done (auto) vs the pending write (gated).

---

## 1 · RegQuery — MongoDB  (accent #00ED64)

```
Design the ACTION / APPROVAL screen for RegQuery. The agent has answered a
compliance question and now proposes to write the result into the company's
compliance profile — awaiting human approval.

TOP — Agent plan banner (info-blue #4285F4 left border):
  "⚡ Gemini 3 agent proposes: file this answer to Payments Pro BV's compliance profile"
  Sub: "Read-only steps already done automatically · 1 write pending your approval"

CENTER — two columns:
LEFT "What will be saved" (editable card):
  Question: "What is the DORA major incident reporting timeline?"
  Answer (editable text area): "Early warning 4h, intermediate 72h, final 1 month…"
  Cited articles as chips: "DORA Art.23 ¶3"  "DORA Art.23 ¶4"  "NIS2 Art.23"
  Tags it will add to the gap register: "incident_reporting"  "third_party_risk"
RIGHT "Evidence (read-only, already run)":
  Atlas vectorSearch top-5 with similarity scores (mini table)
  Confidence bar 94% + reasoning lines

TOOL MANIFEST (mono panel):
  On approve, these MongoDB MCP tools fire:
    mongodb.insert_one  → sessions   (the Q&A turn)
    mongodb.update_one  → profiles   (compliance score + gaps)

AgentActivityLog (mono, streaming):
  RegSearcher · embedded question · 120ms ✓
  RegSearcher · vectorSearch → 5 chunks · 340ms ✓
  RegSynthesizer · synthesized + verified answer · 7.4s ✓
  RegSynthesizer · PENDING write — awaiting approval ⏸

STICKY APPROVALBAR (bottom):
  "Save to compliance profile?  2 writes · sessions + profiles"
  [ Edit answer ]  [ Reject ]  [ Approve & Execute ▸ ]  (accent button)
```

---

## 2 · CodeGuard — GitLab  (accent #FC6D26)

```
Design the ACTION / APPROVAL screen for CodeGuard. The agent reviewed MR !247,
found a critical DORA Art.9 violation, and proposes to BLOCK the merge, comment,
label it, and open a training issue — all GitLab writes, awaiting approval.

TOP — plan banner:
  "⚡ Agent proposes: block MR !247 and post a compliance review (1 critical violation)"
  Sub: "Code analysis ran automatically · 4 GitLab writes pending your approval"

CENTER — two columns:
LEFT "Draft MR comment" (editable):
  Markdown preview of the review comment CodeGuard will post:
  "🚫 DORA Art.9 — Critical: unencrypted card data at PaymentService.java:47"
  Code diff (CodePanel): red current line, green required fix
LEFT below — "Labels to apply": chips "compliance-blocked" (danger) "dora-review"
RIGHT "Why (read-only checks)":
  Checks table — Encryption ❌ CRITICAL · Logging ✅ · Auth ✅ · Audit ⚠️ · Errors ✅
  "@sarah.kim — 3rd encryption violation in 30 days → training issue proposed"

TOOL MANIFEST:
  On approve, GitLab MCP tools fire:
    gitlab.create_merge_request_note     → post review comment
    gitlab.update_merge_request          → label compliance-blocked
    gitlab.create_merge_request_approval_rule → block merge
    gitlab.create_issue                  → "#1247 DORA training — encryption"

APPROVALBAR:
  "Block MR !247 & post review?  4 writes to GitLab"
  [ Edit comment ]  [ Reject ]  [ Approve & Block ▸ ]  (GitLab orange)
  Secondary text link: "Report false positive"
```

---

## 3 · DynaCompliance — Dynatrace  (accent #00B4D8)

```
Design the ACTION / APPROVAL screen for DynaCompliance. The agent classified
incident INC-2026-047 as DORA MAJOR and proposes to push the classification back
to Dynatrace and submit the EBA early-warning notification to the regulator (DNB)
— time-critical, awaiting approval.

TOP — plan banner (danger tint, this is high-stakes):
  "⚡ Agent proposes: submit DORA Art.17 early-warning to DNB + write classification to Dynatrace"
  Sub: "⏰ Deadline 14:17 CET — 3h 54m remaining"

CENTER — two columns:
LEFT "EBA notification draft" (editable form, pre-filled by agent):
  Entity, Incident start 10:17 CET, Classification MAJOR,
  Impact 15.2% clients / €8.3M, Root cause: third-party DB (also Art.28)
RIGHT "Evidence (read-only, from Dynatrace MCP)":
  VerdictBlock: MAJOR · confidence 94%
  Triggered: "15.2% > 10% ✗"  "€8.3M > €5M ✗"
  Davis AI root cause 97%

TOOL MANIFEST:
  On approve, Dynatrace MCP + reporting tools fire:
    dynatrace.push_event           → DORA_MAJOR_2026_047 on the entity
    dynatrace.create_annotation    → classification + reasoning
    notify.submit_eba              → early-warning to DNB (the regulatory action)
  Also auto-sets 72h + 1-month reminders.

APPROVALBAR (warning/danger emphasis, countdown visible):
  "Submit to DNB & write back to Dynatrace?  3 actions · deadline 3h 54m"
  [ Edit draft ]  [ Reject ]  [ Approve & Submit ▸ ]  (cyan)
```

---

## 4 · AuditLens — Arize  (accent #7C3AED)

```
Design the ACTION / APPROVAL screen for AuditLens. The agent ran an experiment
showing Prompt B raises EU AI Act Art.13 compliance 91.4% → 97.8%, and proposes
to deploy Prompt B to the production app — awaiting approval.

TOP — plan banner:
  "⚡ Agent proposes: deploy Prompt B to finadvice-prod (Art.13 +6.4%)"
  Sub: "Experiment ran automatically on 73 failing traces · 1 deploy pending approval"

CENTER — two columns:
LEFT "Prompt B (editable diff)":
  CodePanel showing the additions in green:
  + "This response is AI-generated; consult a qualified financial advisor."
RIGHT "Evidence (read-only, from Phoenix MCP)":
  Grouped bars A vs B per article (Art.13 dramatic, Art.14 slight, Art.9 stable)
  Sample trace: A score 0.23 ❌ → B score 0.97 ✅
  "Affects 847 daily traces"

TOOL MANIFEST:
  On approve, Phoenix MCP tools fire:
    phoenix.update_prompt   → promote Prompt B to production tag
    phoenix.create_annotation → log "Art.13 +6.4% via experiment exp_0518"

APPROVALBAR:
  "Deploy Prompt B to production?  Updates the live prompt for 847 traces/day"
  [ Edit prompt ]  [ Reject — run another experiment ]  [ Approve & Deploy ▸ ]  (purple)
```

---

## 5 · IncidentIQ — Elastic  (accent #00BFB3)

```
Design the ACTION / APPROVAL screen for IncidentIQ. The agent searched 847
incidents, classified INC-2026-047 as DORA MAJOR using historical precedents,
and proposes to store the classification, set deadline alerts, and open the
early-warning draft — awaiting approval.

TOP — plan banner:
  "⚡ Agent proposes: store MAJOR classification + create deadline alerts for INC-2026-047"
  Sub: "ES|QL search + threshold checks ran automatically · 2 writes pending approval"

CENTER — two columns:
LEFT "Reporting draft + deadlines" (editable):
  Early warning 14:17 CET (countdown), intermediate 72h, final 1 month
RIGHT "Elastic evidence (read-only)":
  "3 similar incidents in 90 days — 100% were MAJOR" (mini bar)
  "clients 15.2% > 10% ✗"  "€8.3M > €5M ✗"
  CodePanel: the ES|QL query that found the precedents

TOOL MANIFEST:
  On approve, Elastic MCP / workflow tools fire:
    elastic.esql_index        → update ict-incidents: dora_classification=MAJOR
    kibana.create_alert        → 3 deadline reminders (4h / 72h / 1mo)

AgentActivityLog (mono):
  ElasticSearcher · find_similar → 340ms ✓
  DORAAnalyst · check_client_threshold → EXCEEDED ✓
  DORAAnalyst · check_financial_threshold → EXCEEDED ✓
  DORAAnalyst · PENDING index write — awaiting approval ⏸

APPROVALBAR:
  "Store classification & set alerts?  2 writes to Elasticsearch"
  [ Edit deadlines ]  [ Reject ]  [ Approve & Store ▸ ]  (Elastic teal)
```

---

## 6 · RegPipeline — Fivetran  (accent #0073E6)

```
Design the ACTION / APPROVAL screen for RegPipeline. The agent detected a new
HIGH-impact EUR-Lex regulation (DORA threshold change) plus a DNB schema change,
and proposes to send the daily digest, re-sync the delayed connector, and update
2 affected downstream queries — awaiting approval.

TOP — plan banner:
  "⚡ Agent proposes: send digest + resync DNB + patch 2 affected queries"
  Sub: "Pipeline health + impact analysis ran automatically · 3 actions pending approval"

CENTER — two columns:
LEFT "Daily digest draft" (editable):
  🔴 HIGH "DORA incident threshold 10%→8% — action by July 1" (EUR-Lex)
  🟡 MED "EBA ICT concentration risk guidance" (EBA)
  Schema change: DNB new field 'enforcement_priority'
RIGHT "Evidence (read-only, from Fivetran MCP)":
  Connector grid: EUR-Lex ✅ · DNB ⚠️ delayed · others ✅
  "8 past incidents would reclassify as MAJOR under new threshold"

TOOL MANIFEST:
  On approve, Fivetran MCP + downstream tools fire:
    fivetran.trigger_sync       → resync DNB connector
    bigquery.patch_queries      → compliance_score_calc, alert_threshold_check
    notify.send_digest          → email/Slack 08:00 digest

APPROVALBAR:
  "Send digest, resync DNB, patch 2 queries?  3 actions"
  [ Edit digest ]  [ Reject ]  [ Approve & Run ▸ ]  (Fivetran blue)
```

---

## Why this screen wins points
- It is the literal embodiment of the rules' phrase *"finish the job, while keeping
  you in control."* Most submissions will show an agent that just acts; yours pauses
  and asks — visibly, with a tool manifest.
- It makes the **partner MCP write** explicit and central (judges want "meaningful
  integration", not a decorative read).
- It gives you a dramatic 15-second beat in the demo video: *agent proposes → you
  approve → it executes → audit trail appears.*
```
