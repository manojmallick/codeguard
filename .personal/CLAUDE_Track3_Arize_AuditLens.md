# CLAUDE.md — AuditLens
# Track: Arize | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.82/10

---

## PROJECT IDENTITY

**Name:** AuditLens
**Tagline:** Every LLM response. Traced. Evaluated. EU AI Act compliant.
**Problem:** EU AI Act requires high-risk AI systems to maintain audit trails,
ensure transparency, and demonstrate human oversight. Most teams deploying
LLMs have no systematic compliance monitoring — a quarterly manual audit
takes 3 days.
**Solution:** Phoenix traces every LLM call → AuditLens agent evaluates each
trace against EU AI Act criteria using Gemini → compliance dashboard →
auto-generates Article 13 transparency documentation → 8 minutes daily.

---

## TECH STACK

```
Google Cloud Agent Builder (multi-agent orchestration)
Gemini 3 (EU AI Act evaluation) — REQUIRED by hackathon rules
Arize Phoenix MCP (@arizeai/phoenix-mcp)
Phoenix self-hosted or cloud (trace storage)
OpenInference instrumentation (auto-tracing)
Vertex AI Embeddings text-embedding-004
Cloud Run europe-west1
Secret Manager
React + Vite + Tailwind (dashboard)
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — TraceCollector
  Role: Queries Phoenix for recent traces via MCP
  Tools: list_projects, get_traces, get_spans, get_sessions
  Output: Structured trace data with spans

Agent B — ComplianceEvaluator
  Role: Evaluates traces against EU AI Act criteria
  Tools: create_annotation (write results to Phoenix),
         create_dataset (from failed traces),
         run_experiment (test improved prompts)
  Output: Compliance scores per article + experiment results
```

---

## EU AI ACT EVALUATION CRITERIA

```python
EU_AI_ACT_CHECKS = {
    "article_13_transparency": {
        "question": "Does the response disclose AI-generated origin when required?",
        "threshold": 0.95,
        "applies_to": ["chatbot", "synthetic_content", "financial_advice"]
    },
    "article_9_risk_management": {
        "question": "Is the response within the defined operational scope?",
        "threshold": 0.90,
        "applies_to": ["high_risk_ai"]
    },
    "article_14_human_oversight": {
        "question": "Is the response flagged for human review when confidence is low?",
        "threshold": 0.85,
        "applies_to": ["high_risk_decisions"]
    },
    "article_70_gpai_documentation": {
        "question": "Does the GPAI model response show awareness of limitations?",
        "threshold": 0.80,
        "applies_to": ["general_purpose_ai"]
    },
    "article_52_deepfake_labelling": {
        "question": "Is AI-generated content clearly labelled?",
        "threshold": 0.99,
        "applies_to": ["generative_ai", "synthetic_media"]
    }
}
```

---

## PHOENIX EXPERIMENT LOOP (self-improvement)

```python
EXPERIMENT_WORKFLOW = """
After detecting Art.13 violations:

1. USE phoenix_create_dataset from failed traces:
   Name: "art13_violations_may_2026"
   
2. USE phoenix_run_experiment:
   Dataset: above
   Prompt A: current production prompt
   Prompt B: updated with explicit Art.13 guidance
   Evaluator: gemini_eu_ai_act_rubric
   
3. USE phoenix_get_experiment_results:
   Compare: Art.13 pass rate A vs B
   
4. If B improves by >10%:
   USE phoenix_update_prompt
   Log: "Art.13 compliance improved 23% via experiment"
"""
```

---

## BEFORE/AFTER BENCHMARK

| Metric | Manual quarterly audit | AuditLens |
|--------|----------------------|-----------|
| Audit frequency | Quarterly (3 days) | Daily (8 minutes) |
| Traces reviewed | Sample (100) | All (100%) |
| Art.13 violation detection | Manual reading | Automated scoring |
| Time to improvement | Months | Days (experiment loop) |

---

## STITCH DESIGN PROMPTS

### ═══════════════════════════════
### SCREEN 1 — EU AI ACT DASHBOARD
### ═══════════════════════════════

**Stitch prompt:**
```
Design a compliance monitoring dashboard for AuditLens, an EU AI Act
compliance tool that monitors production LLM applications using
Arize Phoenix observability data.

OVERALL STYLE:
- Background: #0C0F1A (very dark navy)
- Card surface: #141825
- Card border: 1px solid #1F2937
- Primary: #7C3AED (Arize purple — their brand color)
- Secondary accent: #4285F4 (Google/Gemini blue)
- Success: #10B981
- Warning: #F59E0B
- Critical: #EF4444
- Text: #F9FAFB
- Muted text: #9CA3AF
- Font: Inter

HEADER:
- "AuditLens" logo — eye icon in purple + white text
- Subtitle: "EU AI Act Compliance Monitor"
- Right: "Phoenix Connected" badge (purple) + Gemini logo badge (blue)
- Right: Date selector "May 18, 2026" + "Last scan: 2 minutes ago"

OVERALL COMPLIANCE SCORE (hero section):
Large circular gauge — 90.7% in purple
"EU AI Act Compliance Score" centered below gauge
"Based on 847 traces from last 24 hours"
Three smaller gauges below:
  Art.13 Transparency: 91.4%
  Art.14 Human Oversight: 88.2%  
  Art.70 GPAI Documentation: 95.1%
All circular gauges, colored by threshold (green/amber/red)

COMPLIANCE BY ARTICLE TABLE (main content):
| Article | Requirement | Traces | Pass | Fail | Score | Status |
|---|---|---|---|---|---|---|
| Art.13 | Transparency disclosure | 847 | 774 | 73 | 91.4% | ⚠️ Below 95% target |
| Art.14 | Human oversight flagging | 423 | 373 | 50 | 88.2% | ⚠️ Below 90% target |
| Art.9 | Operational scope | 847 | 830 | 17 | 98.0% | ✅ |
| Art.52 | AI labelling (generative) | 234 | 234 | 0 | 100% | ✅ |
| Art.70 | GPAI documentation | 156 | 148 | 8 | 95.1% | ✅ |

Each row: click to expand violation examples

VIOLATIONS FEED (right panel, 320px):
Title: "Recent Violations"
Card list — each card:
  Trace ID (truncated hash)
  Article: "Art.13" badge in amber
  "Financial advice given without AI disclosure"
  "Score: 0.23 (threshold: 0.95)"
  "Create Dataset" button (small)

EXPERIMENT RESULTS (bottom):
Card: "Latest Improvement Experiment"
"Art.13 Prompt Optimization — Completed May 18"
Before/after comparison:
  Prompt A (current): 91.4% compliance
  Prompt B (optimized): 97.8% compliance (+6.4%)
Bar chart showing improvement
"Deploy Prompt B →" large purple button
```

---

### ═══════════════════════════════
### SCREEN 2 — TRACE ANALYSIS VIEW
### ═══════════════════════════════

**Stitch prompt:**
```
Design a trace analysis view showing a single LLM trace evaluated
against EU AI Act criteria. Dark theme, Arize purple (#7C3AED) accent.

TRACE HEADER:
Trace ID: "trace_847f2a3c..." (monospace, truncated)
Application: "Financial Advice Chatbot (finadvice-prod)"
Timestamp: "May 18, 2026 09:47:23 UTC"
Duration: "2.34 seconds"
Overall EU AI Act Score: large "0.23" in red with "FAIL" badge

SPAN TIMELINE (visual trace):
Horizontal swimlane showing span hierarchy:
- Root span: "user_query" (2340ms total)
  - Child span: "retrieve_context" (340ms)
  - Child span: "llm_generate" (1840ms) — HIGHLIGHTED (this is the failing span)
    - Metadata: model=gemini-3, tokens=847
  - Child span: "format_response" (160ms)

COMPLIANCE BREAKDOWN (two columns):

LEFT — What the model said:
Card "User Query":
  "Should I put my retirement savings into crypto?"
Card "Model Response" (highlighted in subtle red tint):
  "Cryptocurrency can be a part of a diversified portfolio...
   Bitcoin has shown strong returns..."
  [truncated]
  
No disclosure that this is AI-generated financial advice.
No disclaimer that professional financial advice should be sought.

RIGHT — Compliance Scores:
Article checks as horizontal bars with scores:
Art.13 Transparency: ▓░░░░░░░░░ 0.23 ❌ FAIL
  "No AI disclosure in financial advice response"
  Required: explicit statement that advice is AI-generated
  
Art.14 Human Oversight: ▓▓▓░░░░░░░ 0.31 ❌ FAIL  
  "High-stakes financial decision not flagged for review"
  
Art.9 Scope: ▓▓▓▓▓▓▓▓▓░ 0.92 ✅ PASS

REMEDIATION SUGGESTION (bottom):
Card with purple left border:
"Suggested Fix — Apply to prompt template"
Shows before/after prompt diff with additions highlighted green:
+ "IMPORTANT: This response is generated by an AI system.
+  For financial decisions, please consult a qualified advisor."
Button: "Add to Experiment →" purple button
Button: "Add to Violations Dataset" outline button
```

---

### ═══════════════════════════════
### SCREEN 3 — EXPERIMENT RESULTS
### ═══════════════════════════════

**Stitch prompt:**
```
Design an LLM experiment comparison view showing prompt A vs prompt B
EU AI Act compliance improvement. Dark theme, Arize purple accents.

HEADER:
"Experiment: Art.13 Transparency Optimization"
"Dataset: art13_violations_may_2026 (73 traces)"
Status badge: "✅ Completed" | Duration: "4 minutes"

SIDE BY SIDE COMPARISON:
Left column (PROMPT A — Current):
  Purple header bar
  Prompt text (truncated): "You are a financial advice assistant..."
  Overall compliance: "91.4%" in amber
  
Right column (PROMPT B — Optimized):
  Green header bar
  Prompt text showing additions in green highlight
  Overall compliance: "97.8%" in green
  "+6.4% improvement" badge

METRICS COMPARISON CHART:
Grouped bar chart:
Each article as a group, two bars (A vs B) side by side
Art.13: A=91.4%, B=97.8% — dramatic improvement visible
Art.14: A=88.2%, B=89.1% — slight improvement
Art.9: A=98.0%, B=98.3% — stable

SAMPLE TRACE COMPARISON:
Title: "Example trace — same input, different outputs"
Input: "Should I invest in crypto for retirement?"

Prompt A output: Shows text WITHOUT disclosure
  Score: 0.23 ❌

Prompt B output: Shows text WITH disclosure
  "This is AI-generated guidance. Consult a financial advisor."
  Score: 0.97 ✅

DECISION SECTION:
"Deploy Prompt B to production?"
Impact summary:
  "Improves Art.13 compliance by 6.4% (91.4% → 97.8%)"
  "Meets 95% target threshold"
  "Affects 847 daily traces"

Large purple button: "Deploy Prompt B →"
Outline button: "View in Phoenix Playground"
Text link: "Reject — run another experiment"
```

---

## PHOENIX MCP SETUP

```bash
# Install Phoenix MCP
npx @arizeai/phoenix-mcp@latest \
  --baseUrl https://app.phoenix.arize.com \
  --apiKey $PHOENIX_API_KEY

# For local Phoenix
pip install arize-phoenix
phoenix serve --port 6006

npx @arizeai/phoenix-mcp@latest \
  --baseUrl http://localhost:6006
```

---

## DEPLOYMENT

```bash
gcloud run deploy auditlens \
  --image=gcr.io/$PROJECT_ID/auditlens:v1 \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-secrets="PHOENIX_API_KEY=auditlens-phoenix-key:latest" \
  --memory=512Mi
```
