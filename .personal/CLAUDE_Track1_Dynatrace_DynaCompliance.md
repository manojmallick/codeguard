# CLAUDE.md — DynaCompliance
# Track: Dynatrace | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.87/10

---

## PROJECT IDENTITY

**Name:** DynaCompliance
**Tagline:** Dynatrace detects. Gemini classifies. DORA report drafted. In 90 seconds.
**Problem:** DORA Article 17 requires financial entities to classify ICT incidents
as major/minor and submit a 4-hour early warning notification to regulators.
Currently done manually — takes 47 minutes average.
**Solution:** Dynatrace problem detection → multi-agent Gemini pipeline →
automatic DORA classification → pre-filled regulatory notification → zero manual work.

---

## TECH STACK

```
Google Cloud Agent Builder (orchestration)
Gemini 3 (reasoning) — REQUIRED by hackathon rules
Dynatrace MCP server (observability data)
Cloud Run europe-west1 (hosting)
Secret Manager (API keys)
Vertex AI Embeddings text-embedding-004 (not OpenAI)
Cloud Logging (structured JSON)
React + Vite + Tailwind (frontend)
Node.js + Express (API)
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — DynaWatcher
  Role: Calls Dynatrace MCP, collects incident data
  Tools: get_problems, get_problem_details, get_entities,
         get_metrics, get_davis_ai_analysis
  Output: Structured incident JSON

Agent B — DORAClassifier
  Role: Receives incident data, applies DORA Article 17 criteria
  Tools: classify_incident, calculate_deadlines, draft_notification,
         push_event (Dynatrace), create_annotation
  Output: Classification decision + notification draft
```

---

## AGENT INSTRUCTIONS

### Agent A — DynaWatcher
```
You collect ICT incident data from Dynatrace for compliance analysis.

When triggered with a problem ID:
1. USE get_problem_details to get: duration, severity, affected services
2. USE get_entities to get: service names, client exposure estimates
3. USE get_metrics to get: transaction failure rate, availability %,
   financial transaction volume during incident
4. USE get_davis_ai_analysis to get: root cause entity, impact chain
5. Return structured JSON — do not classify, only collect data
```

### Agent B — DORAClassifier
```
You classify ICT incidents per DORA Article 17 criteria.

MAJOR incident if ANY threshold met:
- >10% of clients affected for >2 hours
- Transaction value affected >€5M
- Any customer data breach
- Core banking unavailable >2 hours
- Payment processing down >30 minutes

When incident data received:
1. Apply each criterion methodically
2. If borderline → classify MAJOR (regulatory principle: when in doubt, report)
3. Identify WHICH criterion triggered MAJOR
4. If root cause = third-party → also triggers DORA Article 28
5. Calculate deadlines from incident START time (not detection)
6. Draft EBA-template early warning notification
7. USE dynatrace_push_event to write classification back
8. USE dynatrace_create_maintenance_window for recovery period
```

---

## BEFORE/AFTER BENCHMARK

| Metric | Manual process | DynaCompliance |
|--------|---------------|----------------|
| Time to classification | 47 minutes | 90 seconds |
| Time to notification draft | +3 hours | +30 seconds |
| Missed 4-hour deadlines | 23% of major incidents | 0% |
| Audit trail completeness | Partial | 100% |

---

## STITCH DESIGN PROMPTS

### ═══════════════════════════════
### SCREEN 1 — MAIN DASHBOARD
### ═══════════════════════════════

**Stitch prompt:**
```
Design a dark-themed compliance operations center dashboard for DynaCompliance,
a DORA regulatory compliance tool for financial services.

OVERALL STYLE:
- Dark background: #0A0E1A (very dark navy blue, not pure black)
- Surface cards: #131929 (slightly lighter navy)
- Accent border on cards: 1px solid #1E2D4A
- Primary accent: #00B4D8 (Dynatrace electric cyan — their brand color)
- Success green: #00C896
- Warning amber: #F5A623
- Danger red: #FF4D6D
- Text primary: #F0F4FF
- Text secondary: #8898AA
- Font: Inter, 14px body

HEADER BAR (fixed top, height 56px):
- Background: #0D1421 with bottom border 1px #1E2D4A
- Left: "DynaCompliance" logo — shield icon in cyan + white text
- Center: Status pill "● MONITORING ACTIVE" in green with pulse animation
- Right: "Dynatrace Connected" badge (cyan border) + Gemini logo + settings gear

HERO STATS ROW (4 equal cards, 2 rows × 2 on mobile):
Card 1 — ACTIVE INCIDENTS
  Large number: "3" in white, 48px bold
  Subtitle: "Requiring DORA classification"
  Bottom: red dot indicator
Card 2 — TODAY'S MAJOR
  Large number: "1" in #FF4D6D, 48px bold
  Subtitle: "Major ICT incidents"
  Bottom: "4h deadline: 14:23 CET" in amber
Card 3 — COMPLIANCE RATE
  Large number: "94%" in #00C896, 48px bold
  Subtitle: "On-time reporting this month"
  Progress bar: 94% filled in green
Card 4 — AVG CLASSIFICATION
  Large number: "90s" in cyan, 48px bold
  Subtitle: "vs 47min manual"
  Bottom: "31× faster" in green

ACTIVE INCIDENTS TABLE (main content area):
Table with columns: Severity | Incident | Started | Duration | DORA Status | Deadline | Action
Row 1 (critical): Red severity dot | "Payment Service Down — 15K transactions" |
  "10:17 CET" | "47m (ongoing)" | "MAJOR ●" in red pill |
  "⏰ Deadline: 14:17 CET — 3h 54m" in amber countdown | "View Report →" cyan button
Row 2 (medium): Amber dot | "API Gateway latency spike" | "09:43 CET" | "12m" |
  "MINOR ✓" in green pill | "No reporting required" | "Details →"
Row 3 (low): Grey dot | "DB connection pool warning" | "08:51 CET" | "3m" |
  "Pending..." grey | — | "Classify →" outline button

NOTIFICATION DRAFT PANEL (right sidebar, 340px wide):
- Header: "📋 EBA Notification Draft" + "DORA Art.17" badge
- Alert: "⚠️ Submit before 14:17 CET — 3h 54m remaining"
- Pre-filled form fields (grayed out, auto-populated):
  Entity name, Incident date/time, Classification: MAJOR,
  Initial impact: 15.2% clients, €8.3M transactions
- Button: "Send to DNB →" full-width cyan button
- Link: "Download PDF" small text below

REAL-TIME ACTIVITY FEED (bottom):
- Header: "Agent Activity Log"
- Live scroll of agent actions:
  "DynaWatcher called get_problem_details — 340ms"
  "DORAClassifier: Criterion 1 met — 15.2% > 10% threshold"
  "Classification: MAJOR | Confidence: HIGH"
  "Notification draft generated"
  "Dynatrace event pushed: DORA_MAJOR_2026_047"
```

---

### ═══════════════════════════════
### SCREEN 2 — INCIDENT DEEP DIVE
### ═══════════════════════════════

**Stitch prompt:**
```
Design a full-page incident analysis view for a DORA compliance tool.
Dark navy theme (#0A0E1A background), cyan accent (#00B4D8).

TOP SECTION — Incident Header:
- Left: Large incident title "Payment Service Unavailability" 24px bold white
- Below title: breadcrumb "Dashboard > Incidents > INC-2026-047"
- Status badge: "MAJOR INCIDENT" in red with border, large
- Right of title: Duration pill "47 minutes (ongoing)" in amber

CLASSIFICATION DECISION BOX (prominent, full width):
- Background: dark red tint #1A0A0E
- Left border: 4px solid #FF4D6D
- Title: "DORA Article 17 Classification" 16px bold
- Result: "MAJOR" in 36px bold red
- Confidence: ████████░░ "HIGH (94%)"
- Triggered by: two items with check icons:
  "✗ Clients affected: 15.2% (>10% threshold)"
  "✗ Financial impact: €8.3M (>€5M threshold)"
- Bottom: "Also triggers DORA Article 28 — root cause: third-party database"

THREE COLUMN LAYOUT below:

LEFT COLUMN — Dynatrace Evidence:
Card "DynaWatcher Data":
  Small header: "Collected via Dynatrace MCP"
  Data rows with labels and values:
  "Services affected: 2 (PaymentProcessing, CardAuth)"
  "Client exposure: 15.2% (47,312 clients)"
  "Transaction failures: 12,847"
  "Financial volume: €8.3M"
  "Root cause: DB connection pool exhaustion"
  "Davis AI confidence: 97%"

CENTER COLUMN — Reporting Deadlines:
Card "Regulatory Timeline":
  Three deadline items with large countdown timers:
  
  Item 1 (URGENT):
  "⏰ EARLY WARNING"
  "14:17 CET TODAY"
  Countdown: "3:54:22" in large amber 32px
  "Submit to: DNB Netherlands"
  
  Item 2:
  "INTERMEDIATE REPORT"
  "May 21 10:17 CET"
  "72 hours from incident start"
  
  Item 3:
  "FINAL REPORT"
  "June 18 10:17 CET"
  "1 month from incident start"

RIGHT COLUMN — Agent Activity:
Card "Classification Reasoning":
  Step-by-step agent reasoning shown as timeline:
  Step 1: "DynaWatcher collected 6 data points"
  Step 2: "Applied Criterion 1: 15.2% > 10% ✗ MAJOR"
  Step 3: "Applied Criterion 2: €8.3M > €5M ✗ MAJOR"
  Step 4: "Davis AI: root cause = AWS RDS → Art.28 triggered"
  Step 5: "Deadlines calculated from 10:17 CET"
  Step 6: "EBA notification draft generated"

BOTTOM — Notification Draft:
Full-width card with EBA template form
Pre-filled fields visible but grayed (auto-populated by agent)
Large cyan button: "Submit to DNB — 3h 54m remaining"
Secondary: "Download PDF" | "Edit Draft" buttons
```

---

### ═══════════════════════════════
### SCREEN 3 — MONTHLY REPORT
### ═══════════════════════════════

**Stitch prompt:**
```
Design a DORA compliance monthly reporting screen. Dark navy theme.
Professional financial services aesthetic — clean, data-dense, trustworthy.

Header: "DORA Compliance Report — May 2026" with month navigation arrows
Export buttons: "Download PDF" and "Export to CSV" top right

TOP METRICS ROW (4 cards):
"Total ICT Incidents: 47"
"Major (DORA reportable): 3"  
"On-time submissions: 3/3 (100%)" in green
"Avg classification time: 90 seconds" vs "47 min benchmark"

TREND CHART (full width, 200px height):
Line chart showing incidents per day this month
Two lines: total incidents (blue) and major (red)
Dark chart background, subtle grid lines
Hover tooltips showing incident names

MAJOR INCIDENTS TABLE:
Columns: Date | Incident | Duration | Classification | Submitted | Deadline | Status
Three rows showing this month's major incidents
Each row: date, name, duration, MAJOR badge, submission time, deadline time, 
On-time badge in green or Overdue in red

ARTICLE COVERAGE (bottom left, 50% width):
DORA articles covered this month:
Article 17: ████████████ 3 classifications
Article 28: ████░░░░░░░ 1 third-party trigger
Article 23: ████████████ 3 notifications submitted

AUDIT TRAIL (bottom right, 50% width):
Compliance log showing all agent actions
Date, action, result, duration
Exportable for regulatory inspection
Filter by: date range, article, severity
```

---

## DYNATRACE MCP SETUP

```bash
# Install Dynatrace MCP
npm install @dynatrace/mcp-server

# Configure
export DT_ENV_URL="https://your-env.live.dynatrace.com"
export DT_API_TOKEN="your-api-token"

# Run
npx @dynatrace/mcp-server

# Google Cloud Agent Builder config
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@dynatrace/mcp-server"],
      "env": {
        "DT_ENV_URL": "${DT_ENV_URL}",
        "DT_API_TOKEN": "${DT_API_TOKEN}"
      }
    }
  }
}
```

---

## DEPLOYMENT

```bash
gcloud run deploy dynacompliance \
  --image=gcr.io/$PROJECT_ID/dynacompliance:v1 \
  --region=europe-west1 \
  --platform=managed \
  --allow-unauthenticated \
  --set-secrets="DT_API_TOKEN=dynacompliance-dt-token:latest" \
  --memory=512Mi
```

## HEALTH ENDPOINT

```json
{
  "status": "ok",
  "service": "dynacompliance",
  "version": "1.0.0",
  "partner": "dynatrace",
  "partner_mcp_connected": true,
  "agents": ["DynaWatcher", "DORAClassifier"],
  "regulations": ["DORA Art.17", "DORA Art.28"],
  "timestamp": "2026-05-18T10:23:00Z"
}
```
