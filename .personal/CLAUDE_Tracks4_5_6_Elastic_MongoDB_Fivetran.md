# CLAUDE.md — IncidentIQ
# Track: Elastic | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.82/10

---

## PROJECT IDENTITY

**Name:** IncidentIQ
**Tagline:** Search 847 incidents. Find DORA precedents. Report in time.
**Problem:** Financial entities have hundreds of ICT incidents in Elasticsearch
logs. Determining which require DORA Article 17 major incident reporting takes
a compliance analyst 2 hours per incident — manual search for precedents,
manual criteria application, manual notification drafting.
**Solution:** New incident → IncidentIQ agent searches Elasticsearch for similar
precedents using ES|QL + hybrid vector search → Gemini classifies per DORA criteria
→ auto-generates reporting timeline + notification. 12 seconds.

---

## TECH STACK

```
Google Cloud Agent Builder (multi-agent)
Gemini 3 (DORA classification reasoning) — REQUIRED by hackathon rules
Elastic Agent Builder MCP endpoint
Elasticsearch (incident data + DORA regulations + enforcement history)
Kibana Watches (autonomous trigger)
Elastic Workflows (classification pipeline)
Vertex AI Embeddings text-embedding-004
Cloud Run europe-west1
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — ElasticSearcher
  Role: Queries Elasticsearch for incident data and precedents
  Tools: esql_query (similar incidents), search (hybrid vector),
         esql_aggregation (impact metrics)
  Output: Structured incident + precedent data

Agent B — DORAAnalyst
  Role: Applies DORA Article 17 criteria, generates reporting requirements
  Tools: esql_index (store classification),
         elastic_workflow (dora_classification_workflow),
         kibana_alert (create deadline reminders)
  Output: Classification + reporting timeline + draft
```

---

## ELASTICSEARCH INDEXES

### ict-incidents
```json
{
  "properties": {
    "timestamp": {"type": "date"},
    "incident_id": {"type": "keyword"},
    "description": {"type": "text"},
    "description_vector": {"type": "dense_vector", "dims": 768},
    "severity": {"type": "keyword"},
    "affected_systems": {"type": "keyword"},
    "clients_affected_pct": {"type": "float"},
    "transaction_value_eur": {"type": "float"},
    "dora_classification": {"type": "keyword"},
    "reporting_deadline_4h": {"type": "date"},
    "status": {"type": "keyword"}
  }
}
```

### ELASTIC WORKFLOW: DORA Classification Pipeline
```json
{
  "name": "dora_classification_workflow",
  "steps": [
    {"name": "find_similar", "tool": "esql",
     "query": "FROM ict-incidents | WHERE ... | SORT _score DESC | LIMIT 5"},
    {"name": "check_thresholds", "tool": "esql",
     "query": "FROM impact-metrics | WHERE incident_id = :id | STATS ..."},
    {"name": "store_result", "tool": "esql",
     "query": "POST ict-incidents/_update/:id SET dora_classification = :result"}
  ]
}
```

---

## BEFORE/AFTER BENCHMARK

| Metric | Manual | IncidentIQ |
|--------|--------|-----------|
| Time to find precedents | 2 hours | 12 seconds |
| Criteria application | Manual reading | Automated ES|QL |
| Reporting deadline calculation | Manual | Automatic |
| Missed deadlines | 23% of majors | 0% |

---

## STITCH DESIGN PROMPTS — INCIDENTIQ

### ═══════════════════════════════
### SCREEN 1 — INCIDENT SEARCH CENTER
### ═══════════════════════════════

**Stitch prompt:**
```
Design a dark-themed incident intelligence center for IncidentIQ,
a DORA compliance tool built on Elasticsearch.

OVERALL STYLE:
- Background: #07080D (near black)
- Surface: #0F1218
- Card border: 1px solid #1D2433
- Primary: #00BFB3 (Elastic teal — their brand color)
- Secondary: #4285F4 (Google/Gemini blue)
- Critical: #FF4D6D
- Warning: #FFA500
- Success: #00C896
- Text: #EDF0F5
- Muted: #8895A7
- Font: Inter

HEADER:
"IncidentIQ" logo — lightning bolt in teal
"Powered by Elastic Agent Builder + Gemini" subtitle in small text
Right: "Elasticsearch: 847 incidents indexed" live badge
Right: "Last sync: 30 seconds ago" with green dot

SEARCH BAR (prominent, full width):
Large search input — Elasticsearch style:
Placeholder: "Search incidents... (ES|QL powered)"
Below: Quick filters as pills:
  [All] [Critical] [DORA Major] [Pending Classification] [Today]
Hybrid search toggle: "Keyword" ○—● "Semantic"

LIVE METRICS ROW (4 cards):
"Open Incidents: 3" (critical number, red tint card)
"DORA Major Today: 1" (amber tint)  
"Classified in <1min: 94%" (green, showing speed metric)
"Precedents Found: 847 indexed" (teal)

INCIDENT LIST (main content):
Each incident is an expandable row:

Row 1 (MAJOR, expanded):
  Red severity bar on left edge
  "INC-2026-047 — Payment Service Unavailability"
  Started: 10:17 CET | Duration: 47m (ongoing) | Impact: 15.2% clients, €8.3M
  
  Expanded content shows:
  Similar precedents found: 
  "INC-2025-112: Card Processing Outage → MAJOR (100% similar incidents were MAJOR)"
  "INC-2025-089: Payment Gateway Down → MAJOR"
  
  ES|QL behind this: small code block showing the query
  
  Classification: "MAJOR ●" red badge
  Deadline: "⏰ 14:17 CET — 3:54 remaining" amber countdown
  Action: "View Full Report →" teal button

Row 2 (MINOR, collapsed):
  Grey bar | "INC-2026-046 — API latency spike" | MINOR ✓ green | Details →

Row 3 (PENDING, analyzing):
  Amber bar | "INC-2026-048 — DB warning" | ⟳ Analyzing... | —

ESQL QUERY PANEL (right sidebar, 300px):
Title: "Last ES|QL Query"
Dark code block showing the actual ES|QL:
  FROM ict-incidents
  | WHERE severity = "critical"
  | STATS count BY dora_classification
  | SORT count DESC
"Results: 3 critical, 1 classified MAJOR"
```

---

### ═══════════════════════════════
### SCREEN 2 — DORA CLASSIFICATION
### ═══════════════════════════════

**Stitch prompt:**
```
Design a DORA incident classification result page. Elastic teal (#00BFB3)
on dark (#07080D) background. Data-dense, professional financial services.

CLASSIFICATION HEADER:
Incident: "Payment Service Unavailability — INC-2026-047"
Status: "MAJOR" — very large, 48px, red, centered
Confidence: ████████░░ "HIGH (91%)"
Triggered by: 2 criteria met (shown as tags)

ELASTIC EVIDENCE SECTION (shows what ES found):
Title: "Elasticsearch Evidence" with Elastic logo
Three-column grid of evidence cards:

Card "Similar Incidents (ES|QL search)":
  Found 3 similar incidents in last 90 days
  All 3 classified as MAJOR
  "Historical precedent strongly suggests MAJOR"
  Mini bar: ███████████ 100% MAJOR rate

Card "Client Impact (hybrid search)":
  Query: "clients_affected_pct > 10"
  Result: 15.2% affected
  Threshold: 10%
  Status: "THRESHOLD EXCEEDED ✗"

Card "Financial Impact (ES|QL aggregate)":
  "SELECT SUM(transaction_value) WHERE incident_id=..."
  Result: €8.3M blocked
  Threshold: €5M
  Status: "THRESHOLD EXCEEDED ✗"

REPORTING REQUIREMENTS (below):
Three deadline cards in a row:

Card 1 (URGENT — glowing red/amber border):
  "⏰ EARLY WARNING"
  Large countdown: "3:54:22"
  "Due: 14:17 CET today"
  "Submit to: DNB Netherlands"
  Large button: "Open Draft →"

Card 2:
  "INTERMEDIATE REPORT"
  "May 21, 2026 10:17 CET"
  "72 hours from incident start"
  Small button: "Set reminder"

Card 3:
  "FINAL REPORT"
  "June 18, 2026 10:17 CET"  
  "1 month from incident start"
  Small button: "Set reminder"

ELASTIC WORKFLOW TRACE (bottom):
Shows the dora_classification_workflow execution steps
Step indicators with checkmarks and timing:
  ① find_similar_incidents — 340ms ✓
  ② check_client_threshold — 120ms ✓ EXCEEDED
  ③ check_financial_threshold — 89ms ✓ EXCEEDED
  ④ store_classification — 45ms ✓
  Total: 594ms
```

---

---

# ═══════════════════════════════════════════════════════
# CLAUDE.md — RegQuery
# Track: MongoDB | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.80/10
# ═══════════════════════════════════════════════════════

## PROJECT IDENTITY

**Name:** RegQuery
**Tagline:** Ask any compliance question. Get the exact article. In 8 seconds.
**Problem:** Compliance officers spend 47 minutes searching PDFs and regulatory
websites to answer specific DORA/NIS2/GDPR questions. "What's the reporting
timeline? Does Article 28 apply to our cloud provider?"
**Solution:** MongoDB Atlas Vector Search stores all EU regulations as embeddings.
RegQuery agent does semantic retrieval + Gemini reasoning → grounded answer
with exact article citations + confidence score. 8 seconds.

---

## TECH STACK

```
Google Cloud Agent Builder (multi-agent)
Gemini 3 (regulatory reasoning) — REQUIRED by hackathon rules
MongoDB Atlas Vector Search (semantic retrieval)
MongoDB MCP server (@mongodb-js/mcp-server-mongodb)
Atlas Change Streams (real-time regulatory updates)
Vertex AI Embeddings text-embedding-004 (768-dim)
Cloud Run europe-west1
Atlas Charts (compliance dashboard)
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — RegSearcher
  Role: Semantic search over Atlas vector index
  Tools: aggregate (vectorSearch pipeline), find (filter by regulation)
  Output: Top-5 ranked article chunks with scores

Agent B — RegSynthesizer
  Role: Multi-hop reasoning across retrieved articles
  Tools: aggregate (cross-regulation pipeline),
         insert_one (store Q&A session),
         update_one (build compliance profile over sessions)
  Output: Grounded answer + citations + confidence + follow-ups
```

---

## ATLAS VECTOR SEARCH PIPELINE

```python
VECTOR_SEARCH_PIPELINE = [
    {
        "$vectorSearch": {
            "index": "regulatory_vector_index",
            "queryVector": embed(question),
            "path": "text_embedding",
            "numCandidates": 100,
            "limit": 5
        }
    },
    {
        "$project": {
            "regulation": 1,
            "article_number": 1,
            "article_title": 1,
            "text": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    }
]
```

---

## BEFORE/AFTER BENCHMARK

| Metric | Manual search | RegQuery |
|--------|--------------|---------|
| Time per question | 47 minutes | 8 seconds |
| Source accuracy | Varies | Article citations always |
| Cross-regulation | Rarely | Automatic |
| Audit trail | None | Full session history |

---

## STITCH DESIGN PROMPTS — REGQUERY

### ═══════════════════════════════
### SCREEN 1 — Q&A INTERFACE
### ═══════════════════════════════

**Stitch prompt:**
```
Design a semantic regulatory Q&A interface for RegQuery, a MongoDB Atlas
Vector Search powered compliance tool. Clean, professional, trustworthy.

OVERALL STYLE:
- Background: #0B1120 (dark navy)
- Surface: #131F35
- Card border: 1px solid #1E3050
- Primary: #00ED64 (MongoDB green — their brand color)
- Secondary: #4285F4 (Google blue)
- High confidence: #10B981
- Medium confidence: #F59E0B
- Low confidence: #EF4444
- Text: #F0F6FF
- Muted: #7B8FA6
- Font: Inter

HEADER:
"RegQuery" logo — document search icon in MongoDB green
Subtitle: "EU Regulatory Intelligence — Powered by Atlas Vector Search"
Right: "DORA · NIS2 · GDPR · EU AI Act" tags in small pills
Right: "3,247 articles indexed" green badge

SEARCH INPUT (large, central, prominent):
Large search box (like a Google search bar but dark):
Placeholder: "Ask any compliance question..."
Example below: "e.g. What is the DORA major incident reporting timeline?"

Regulation filter pills below search:
[All] [DORA] [NIS2] [GDPR] [EU AI Act]

Q&A RESULT (after search):

ANSWER CARD (full width):
Top row: Question repeated | "Answered in 8 seconds" | 
"Confidence: ████████░░ 94%" green

Main answer text (well formatted):
"Under DORA Article 23(3), financial entities must submit:"

Numbered list:
1. Early Warning — within 4 hours
   "notify national competent authority"
2. Intermediate Report — within 72 hours
3. Final Report — within 1 month

"Cross-reference: NIS2 Article 23 has 24h/72h timelines..."

CITATION CHIPS below answer:
"DORA Art.23 ¶3 — 94% match" green chip
"DORA Art.23 ¶4 — 87% match" green chip
"NIS2 Art.23 — 71% match" yellow chip
Click each to expand the exact article text

ATLAS VECTOR SEARCH PROOF (expandable):
Small collapsed section: "How Atlas found this answer ▾"
When expanded shows:
  Query vector similarity scores
  Top 5 results with scores
  "MongoDB Atlas vectorSearch with cosine similarity"
  Code snippet showing the pipeline

FOLLOW-UP SUGGESTIONS (bottom of result):
"Related questions:"
→ "What qualifies as a 'major' incident under DORA?"
→ "Which authority do I notify in the Netherlands?"
→ "How does this interact with GDPR Article 33?"
Each as a clickable chip
```

---

### ═══════════════════════════════
### SCREEN 2 — COMPLIANCE PROFILE
### ═══════════════════════════════

**Stitch prompt:**
```
Design a compliance journey profile page for RegQuery. Shows a company's
Q&A history and compliance gaps identified over sessions.
Dark theme, MongoDB green (#00ED64) accents.

PROFILE HEADER:
Company: "Payments Pro BV — Amsterdam, Netherlands"
Industry: FinTech | Size: 11-50 | Country: NL
Sessions: 12 | Questions asked: 47 | Gaps identified: 3

COMPLIANCE SCORE RING (large, centered):
Circular ring gauge showing 67/100
Green at top fading to red
"Compliance Score" centered
"Based on 47 questions across 3 sessions"

IDENTIFIED GAPS (card list):
Each card has left colored border by regulation:

Card 1 (Red border — DORA):
  "DORA Article 28: No ICT third-party risk register"
  Identified: 3 questions referenced this requirement
  Confidence: HIGH
  Action: "Register all cloud providers" with link →

Card 2 (Amber border — NIS2):
  "NIS2 Article 21: Incident response plan undocumented"
  Identified: 2 questions about incident procedures
  Action: "Document incident classification process"

Card 3 (Amber border — GDPR):
  "GDPR Article 30: Records of processing incomplete"
  Action: "Maintain processing activity register"

SESSION HISTORY (bottom):
Timeline of Q&A sessions:
Each session: date, number of questions, regulations queried, gaps found
Most recent sessions at top
Click to expand and see all questions asked

SUGGESTED NEXT QUESTIONS (sidebar):
"Based on your profile, ask:"
→ "Have you completed a TLPT assessment?"
→ "Do you have contracts with all ICT providers?"
→ "What is your DPO's contact information?"
Each with confidence indicator of likely gap
```

---

### ═══════════════════════════════
### SCREEN 3 — ATLAS SEARCH DETAILS
### ═══════════════════════════════

**Stitch prompt:**
```
Design a technical view showing how MongoDB Atlas Vector Search retrieved
the regulatory answer. For developer/technical users. Dark theme.

Title: "How RegQuery Found Your Answer"
Subtitle: "MongoDB Atlas Vector Search — cosine similarity"

QUERY VISUALIZATION:
Show as a diagram:
User question (text) → Vertex AI Embeddings → 768-dim vector → 
Atlas vectorSearch → 5 results ranked by score

TOP 5 RESULTS TABLE:
| Rank | Article | Regulation | Similarity Score | Confidence |
|------|---------|-----------|-----------------|-----------|
| 1 | Art.23, ¶3 | DORA | 0.94 | ████████ HIGH |
| 2 | Art.23, ¶4 | DORA | 0.87 | ███████░ HIGH |
| 3 | Art.23, ¶2 | DORA | 0.81 | ██████░░ MED |
| 4 | Art.23 | NIS2 | 0.71 | █████░░░ MED |
| 5 | Art.33 | GDPR | 0.43 | ███░░░░░ LOW |

AGGREGATE PIPELINE (code view):
Dark code block showing the actual MongoDB aggregation pipeline used
Syntax highlighted, with comments

PERFORMANCE METRICS:
"Search completed in 8 seconds"
Vector search: 340ms
Gemini reasoning: 7.2s
Total: 7.54s
"47 minutes saved"

MongoDB Atlas logo + "Powered by Atlas Vector Search" footer
```

---

## MONGODB MCP SETUP

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": ["@mongodb-js/mcp-server-mongodb"],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "${ATLAS_CONNECTION_STRING}"
      }
    }
  }
}
```

---

## DEPLOYMENT

```bash
gcloud run deploy regquery \
  --image=gcr.io/$PROJECT_ID/regquery:v1 \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-secrets="ATLAS_CONNECTION_STRING=regquery-atlas:latest" \
  --memory=512Mi
```

---

---

# ═══════════════════════════════════════════════════════
# CLAUDE.md — RegPipeline
# Track: Fivetran | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.70/10
# ═══════════════════════════════════════════════════════

## PROJECT IDENTITY

**Name:** RegPipeline
**Tagline:** Never miss a regulation update. Automated. Every morning. Free.
**Problem:** EU regulations change constantly — new EBA guidance, ESMA standards,
DORA implementing acts, GDPR rulings. Compliance teams learn about changes from
newsletters, not automated systems. One missed update cost a Dutch firm €850K.
**Solution:** Fivetran syncs 5 regulatory sources into BigQuery daily → RegPipeline
agent monitors pipeline health + analyzes new content → daily digest with
impact analysis delivered at 08:00 CET. Zero manual hours.

**World Cup angle:** Also monitors FIFA commercial partner regulations and
advertising compliance for brands sponsoring the 2026 World Cup — demonstrating
the agent works beyond just financial services.

---

## TECH STACK

```
Google Cloud Agent Builder (multi-agent)
Gemini 3 (regulatory impact analysis) — REQUIRED by hackathon rules
Fivetran MCP server
BigQuery (regulatory data warehouse)
Fivetran connectors: EUR-Lex, EBA, ESMA, DNB, FIFA
Vertex AI Embeddings text-embedding-004
Cloud Scheduler (daily 08:00 CET trigger)
Cloud Run europe-west1
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — PipelineMonitor
  Role: Checks Fivetran connector health
  Tools: list_connectors, get_connector_status,
         trigger_sync, get_schema, get_sync_history
  Output: Pipeline health report + new records count

Agent B — RegulatoryAnalyst
  Role: Analyzes new content for compliance impact
  Tools: BigQuery queries for new documents,
         Gemini classification by regulation type,
         impact scoring against company profile
  Output: Daily digest + alerts for HIGH impact items
```

---

## DATA SOURCES (Fivetran connectors)

```
EUR-Lex RSS → BigQuery: regulatory.eurlex
  New EU regulations, directives, implementing acts
  Updated: daily at 04:00 CET

EBA Publications → BigQuery: regulatory.eba
  Banking regulatory guidance, supervisory convergence
  Updated: daily at 05:00 CET

ESMA News → BigQuery: regulatory.esma  
  Securities regulation, reporting standards
  Updated: daily at 05:30 CET

DNB (Netherlands) → BigQuery: regulatory.dnb
  Dutch local enforcement, guidance
  Updated: daily at 06:00 CET

FIFA Commercial Regulations → BigQuery: regulatory.fifa
  World Cup 2026 partner compliance requirements
  Updated: weekly
```

---

## BEFORE/AFTER BENCHMARK

| Metric | Manual monitoring | RegPipeline |
|--------|------------------|------------|
| Monitoring hours/week | 5 hours | 0 hours |
| Sources monitored | 2-3 (inconsistent) | 5 (complete) |
| Time to detect new regulation | 1-3 days | 6 hours max |
| Schema change detection | Never | Automatic |
| Cost of missed update (example) | €850K (DNB fine) | €0 |

---

## STITCH DESIGN PROMPTS — REGPIPELINE

### ═══════════════════════════════
### SCREEN 1 — PIPELINE HEALTH CENTER
### ═══════════════════════════════

**Stitch prompt:**
```
Design a data pipeline monitoring dashboard for RegPipeline, a regulatory
data intelligence tool built on Fivetran. Dark theme, Fivetran blue accents.

OVERALL STYLE:
- Background: #080C14 (very dark)
- Surface: #101828
- Card border: 1px solid #1C2C42
- Primary: #0073E6 (Fivetran blue — their brand color)
- Secondary: #4285F4 (Google blue)
- Healthy: #22C55E
- Warning: #F59E0B
- Failed: #EF4444
- Text: #F0F5FF
- Muted: #8497A8
- Font: Inter

HEADER:
"RegPipeline" logo — pipeline/flow icon in Fivetran blue
"Regulatory Data Intelligence" subtitle
Right: "5 Fivetran connectors" blue badge
Right: "Last run: Today 07:47 CET" green dot
Right: Manual trigger button "Run Now"

DAILY DIGEST CARD (prominent, full width at top):
Background: subtle dark blue gradient
"📋 Daily Regulatory Digest — May 18, 2026"
Generated at: 08:03 CET

Key findings listed:
🔴 HIGH: "DORA incident threshold update — action required by July 1"
   Source: EUR-Lex | Affects: DORA Art.17, Art.23 | Action needed
   
🟡 MEDIUM: "EBA ICT concentration risk guidance published"
   Source: EBA | Affects: DORA Art.28

🟢 LOW: "FIFA 2026 commercial partner advertising guidelines updated"
   Source: FIFA | Affects: World Cup sponsors

Compliance score delta: "-2 points (new DORA requirement)"
Button: "View Full Digest →" blue

CONNECTOR STATUS GRID (5 connectors):
Each connector as a card with status indicator:

Card 1 — EUR-Lex:
  Status: ✅ HEALTHY
  Last sync: "07:45 CET (32 min ago)"
  Records today: "3 new publications"
  Next sync: "Tomorrow 04:00 CET"
  Schema: "No changes"

Card 2 — EBA:
  Status: ✅ HEALTHY
  Last sync: "07:50 CET"
  Records: "1 new guidance"
  Schema: "No changes"

Card 3 — DNB:
  Status: ⚠️ DELAYED
  Last sync: "YESTERDAY 21:33 CET"
  Alert: "Auto-resync triggered at 08:01 CET"
  Status update: "Resyncing... (2 min remaining)"
  Schema: "⚠️ New field detected: 'enforcement_priority'"

Card 4 — ESMA:
  Status: ✅ HEALTHY
  Records: "0 new today"

Card 5 — FIFA:
  Status: ✅ HEALTHY
  Records: "0 new today (weekly sync)"
  Next: "Monday 06:00 CET"

SCHEMA CHANGES ALERT (if any):
Card with amber left border:
"⚠️ Schema Change Detected — DNB Connector"
"New field: 'enforcement_priority' (STRING)"
"Added: May 18, 2026 at 21:33 CET"
"Impact: 2 downstream queries may need updating"
"Affected queries: compliance_score_calc, alert_threshold_check"
Buttons: "View Queries" | "Dismiss"
```

---

### ═══════════════════════════════
### SCREEN 2 — REGULATORY IMPACT VIEW
### ═══════════════════════════════

**Stitch prompt:**
```
Design a regulatory document impact analysis page for RegPipeline.
Dark theme, Fivetran blue (#0073E6). Shows what Fivetran synced and
what Gemini analyzed about its compliance impact.

DOCUMENT HEADER:
Source badge: "EUR-Lex" blue tag
"Delegated Regulation amending DORA incident classification thresholds"
Published: May 18, 2026 | Document ID: C/2026/3421
Classification: DORA | Impact Level: HIGH badge in red

FIVETRAN SYNC INFO (small card):
"Synced via Fivetran EUR-Lex connector at 07:45 CET"
Records synced: 1 | Sync ID: sync_abc123
"View in Fivetran →" link

IMPACT ANALYSIS (main content, two columns):

LEFT — Gemini Analysis:
Card "Regulatory Analysis"
"Affects: DORA Article 17, Article 23"
Impact: "HIGH — changes major incident reporting threshold"

Key changes detected:
  Old threshold: "10% of clients affected for >2 hours"
  New threshold: "8% of clients affected for >1.5 hours"
  Effective: "July 1, 2026"
  
Implication: "Your current major incident classification may need updating.
               8 incidents in last 6 months would have been reclassified
               as MAJOR under new threshold."

RIGHT — Affected Companies/Profiles:
Card "Companies Affected"
Shows profiles that this impacts:
  "Payments Pro BV — HIGH impact (currently at 9% threshold)"
  "DataFlow GmbH — MEDIUM impact"

Action required section:
  "Update incident classification criteria by July 1, 2026"
  "Review last 6 months of MINOR incidents"
  "Update DORA Art.17 documentation"

COMPLIANCE SCORE DELTA:
Before: 89/100
After applying new requirement: 87/100 (-2 points)
"2-point score reduction until threshold updated"
```

---

### ═══════════════════════════════
### SCREEN 3 — PIPELINE HISTORY
### ═══════════════════════════════

**Stitch prompt:**
```
Design a pipeline sync history page for RegPipeline. Shows historical
Fivetran sync data in a clean timeline. Professional data ops aesthetic.
Dark theme, blue accents.

HEADER:
"Sync History — EUR-Lex Connector"
Date range picker: "Last 30 days"
"Total syncs: 30 | Success: 29 | Failed: 1 | Schema changes: 0"

TIMELINE CHART:
Calendar-style heatmap (like GitHub contributions)
Each day is a colored square:
  Dark green: successful sync, many records
  Light green: successful sync, few records
  Red: failed sync
  Grey: no sync scheduled
Hover tooltip: date, records synced, duration

SYNC LOG TABLE:
Columns: Date | Time | Status | Records | Schema | Duration | Source

Rows showing recent syncs:
May 18 | 07:45 | ✅ Success | 3 new | No change | 2.3s | EUR-Lex
May 17 | 07:43 | ✅ Success | 1 new | No change | 1.8s | EUR-Lex
May 16 | 07:51 | ✅ Success | 0 new | No change | 1.2s | EUR-Lex
May 15 | 07:46 | ✅ Success | 2 new | New field! | 2.1s | EUR-Lex
  ↳ Schema change row expanded: field name, type, downstream impact

RECORDS TIMELINE:
Line chart: new regulatory records per day
Rolling 30-day average shown as dotted line
Annotations for major regulatory events (DORA implementing acts, etc.)
```

---

## FIVETRAN MCP SETUP

```json
{
  "mcpServers": {
    "fivetran": {
      "command": "npx",
      "args": ["@fivetran/mcp-server"],
      "env": {
        "FIVETRAN_API_KEY": "${FIVETRAN_API_KEY}",
        "FIVETRAN_API_SECRET": "${FIVETRAN_API_SECRET}"
      }
    }
  }
}
```

---

## DEPLOYMENT

```bash
gcloud run deploy regpipeline \
  --image=gcr.io/$PROJECT_ID/regpipeline:v1 \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-secrets="FIVETRAN_API_KEY=regpipeline-ft-key:latest" \
  --memory=512Mi

# Cloud Scheduler: daily 08:00 CET trigger
gcloud scheduler jobs create http regpipeline-daily \
  --schedule="0 6 * * *" \
  --uri="https://[CLOUD_RUN_URL]/api/daily-run" \
  --time-zone="Europe/Amsterdam"
```
