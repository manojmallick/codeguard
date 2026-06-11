# CLAUDE.md — CodeGuard
# Track: GitLab | Google Cloud Rapid Agent Hackathon
# Prize: $5,000 (1st place) | Deadline: June 11, 2026
# Score ceiling: 9.85/10

---

## PROJECT IDENTITY

**Name:** CodeGuard
**Tagline:** Every merge request. DORA Article 9 checked. Before production.
**Problem:** Financial services code reaching production without DORA Article 9
compliance checks — missing logging, unencrypted sensitive data, no auth controls.
Manual review takes 23 minutes per MR and is inconsistent.
**Solution:** GitLab MR opened → CodeGuard agent reviews diff → DORA compliance
comment posted → merge blocked if critical violations found. 45 seconds.

---

## TECH STACK

```
Google Cloud Agent Builder (multi-agent orchestration)
Gemini 3 (code analysis reasoning) — REQUIRED by hackathon rules
GitLab MCP server (@gitlab-org/mcp-server-gitlab)
Cloud Run europe-west1 (API hosting)
GitLab CI/CD integration (pipeline job)
Vertex AI Embeddings (not OpenAI)
Secret Manager (tokens)
React + Vite + Tailwind (dashboard)
Node.js + Express (webhook API)
```

---

## MULTI-AGENT ARCHITECTURE

```
Agent A — GitLabReader
  Role: Fetches MR context from GitLab via MCP
  Tools: get_merge_request, get_merge_request_changes,
         get_repository_file, list_project_issues
  Output: Structured diff + file context

Agent B — DORAAuditor
  Role: Analyzes code against DORA/NIS2 criteria
  Tools: analyze_code, create_merge_request_note,
         update_merge_request (labels), create_issue,
         create_merge_request_approval_rule
  Output: Compliance report comment + label + issue if repeat offender
```

---

## DORA CODE CHECKS

```python
CHECKS = {
    "logging_completeness": {
        "article": "DORA Art.9 + NIS2 Art.21",
        "severity": "critical",
        "required": ["logger.info", "logger.warn", "logger.error", "log."],
        "red_flags": ["System.out.println", "e.printStackTrace", "catch(Exception e) {}"],
        "message": "Security operations must have structured logging"
    },
    "encryption_sensitive_data": {
        "article": "DORA Art.9",
        "severity": "critical",
        "red_flags": ["password.*=.*plain", "store.*unencrypted", ".cardNumber.*save"],
        "message": "Sensitive data must be encrypted before storage"
    },
    "authorization_checks": {
        "article": "DORA Art.9 + GDPR Art.25",
        "severity": "critical",
        "required": ["@PreAuthorize", "hasRole", "checkPermission", "authorize"],
        "red_flags": ["// TODO: add auth", "skipAuthorization"],
        "message": "Authorization must be verified before data access"
    },
    "audit_trail": {
        "article": "DORA Art.9",
        "severity": "high",
        "required": ["auditLog", "AuditEntry", "recordChange", "auditService"],
        "message": "Data modifications must create audit log entries"
    },
    "safe_error_handling": {
        "article": "DORA Art.9",
        "severity": "high",
        "red_flags": ["stack trace.*response", "exception.message.*client",
                      "sqlException.*user"],
        "message": "Error messages must not expose system internals"
    }
}
```

---

## CI PIPELINE INTEGRATION

```yaml
# .gitlab-ci.yml
dora_compliance:
  stage: test
  image: node:20-alpine
  script:
    - |
      RESULT=$(curl -s -X POST $CODEGUARD_URL/api/pipeline-check \
        -H "Authorization: Bearer $CODEGUARD_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
          \"project_id\": \"$CI_PROJECT_ID\",
          \"commit_sha\": \"$CI_COMMIT_SHA\",
          \"branch\": \"$CI_COMMIT_REF_NAME\"
        }")
      EXIT_CODE=$(echo $RESULT | python3 -c "import sys,json; d=json.load(sys.stdin); print(0 if d['passed'] else 1)")
      exit $EXIT_CODE
  rules:
    - if: '$CI_PIPELINE_SOURCE == "push"'
  allow_failure: false
```

---

## STITCH DESIGN PROMPTS

### ═══════════════════════════════
### SCREEN 1 — COMPLIANCE DASHBOARD
### ═══════════════════════════════

**Stitch prompt:**
```
Design a DevSecOps compliance dashboard for CodeGuard, a DORA code review
tool for financial services teams using GitLab.

OVERALL STYLE:
- Background: #0F1117 (very dark, almost black)
- Surface: #1C2030 (dark blue-grey cards)
- Card border: 1px solid #2A3347
- Primary accent: #FC6D26 (GitLab orange — their brand color)
- Gemini accent: #4285F4 (Google blue for AI elements)
- Success: #2DA44E (GitHub/GitLab green)
- Warning: #F4A261
- Critical: #FF4D6D
- Text: #E6EDF3
- Secondary text: #8B949E
- Font: Inter

TOP NAVIGATION:
- "CodeGuard" logo with shield icon (orange + white)
- Nav items: Dashboard | MR Queue | Compliance History | Settings
- Right: "GitLab Connected" badge + project selector "spring-security-samples ▾"
- Right: Avatar/profile

SUMMARY STATS (4 cards in a row):
Card 1: "MRs Reviewed Today: 12"
  Subtext: "8 passed, 3 blocked, 1 pending"
  Icon: merge request icon in orange
Card 2: "Critical Violations: 2"  
  Large "2" in red, subtext "require immediate fix"
  Icon: warning triangle
Card 3: "Avg Review Time: 45s"
  Large "45s" in green, subtext "vs 23min manual"
  Icon: lightning bolt — "31× faster"
Card 4: "Team DORA Score: 87/100"
  Progress ring showing 87% in orange
  Subtext: "+5 from last week"

RECENT MR REVIEWS (main table):
Table header: MR # | Developer | Title | Checks | Result | Action

Row 1 (BLOCKED):
  !247 | @sarah.kim | "Add payment endpoint" | 
  Check badges: ❌ Encrypt | ✅ Log | ✅ Auth | ⚠️ Audit |
  "BLOCKED" red pill | "View Details →" button

Row 2 (PASSED):
  !246 | @manoj.m | "Refactor user service" |
  All green check badges |
  "✅ DORA PASS" green pill | "View →"

Row 3 (PENDING):
  !248 | @alex.chen | "GDPR consent flow" |
  Three grey dots (in progress) |
  "Analyzing..." | grey button

VIOLATION TRENDS CHART (bottom left, 60%):
Line chart — last 30 days
Lines: Total violations (orange), Critical (red), Resolved (green)
Shows improving trend (violations decreasing)
Title: "DORA Violation Trends"

TOP VIOLATORS WIDGET (bottom right, 40%):
Title: "Requires Training"
Card: "@sarah.kim — 3 encryption violations in 30 days"
  "DORA Training Required" badge in amber
  GitLab issue link: "#1247 — Created automatically"
  Button: "Send reminder"
Note at bottom: "Repeat violations automatically create GitLab issues"
```

---

### ═══════════════════════════════
### SCREEN 2 — MR REVIEW DETAIL
### ═══════════════════════════════

**Stitch prompt:**
```
Design a merge request compliance review detail page for a DORA code review tool.
Dark theme (#0F1117), GitLab orange (#FC6D26) accents.

HEADER:
- "MR !247 — Add payment endpoint" — large title
- Author: @sarah.kim | Target: main | 3 files changed, +127 lines
- Status badge (large): "🚫 COMPLIANCE BLOCKED" in red with border
- GitLab link: "View in GitLab ↗" subtle link

COMPLIANCE SUMMARY BOX (prominent, red left border):
Background: very dark red tint #180808
"DORA Article 9 Compliance Review"
Result: "BLOCKED — 1 critical violation found"
Reviewed by: "CodeGuard Agent (Gemini 3)" with Gemini icon
Time: "Analysis completed in 45 seconds"

CHECKS TABLE (full width):
| Check | Article | Result | Location |
|---|---|---|---|
| Structured logging | DORA Art.9 | ✅ PASS | All methods |
| Encryption at rest | DORA Art.9 | ❌ CRITICAL | PaymentService.java:47 |
| Authorization checks | DORA Art.9 + GDPR Art.25 | ✅ PASS | @PreAuthorize present |
| Audit trail | DORA Art.9 | ⚠️ WARNING | Missing in refundPayment() |
| Safe error handling | DORA Art.9 | ✅ PASS | Generic messages used |

Style: Each row colored by result. Red row for CRITICAL.

CRITICAL FINDING DETAIL (prominent box below table):
Dark red background #1A0808, thick red left border 4px
Title: "❌ Critical: Missing Encryption — PaymentService.java:47"
Article: "DORA Article 9: ICT security policies require data encryption"

Code diff showing:
// CURRENT (NON-COMPLIANT) — highlighted red:
repository.save(payment.cardNumber);

// REQUIRED (COMPLIANT) — highlighted green:
repository.save(encryptionService.encrypt(payment.cardNumber));

"Required fix before merge can proceed"

AGENT REASONING TIMELINE (bottom left, 50%):
Card "How CodeGuard analyzed this MR"
Timeline steps:
① "GitLabReader: fetched 3 changed files (127 lines)"
② "DORAAuditor: scanning for logging patterns... ✅"
③ "DORAAuditor: scanning for encryption... ❌ Found unencrypted storage"
④ "DORAAuditor: scanning for auth... ✅ @PreAuthorize detected"
⑤ "Comment posted to MR !247"
⑥ "Label 'compliance-blocked' applied"

ACTIONS PANEL (bottom right, 50%):
"What happens next?"
Step 1: Developer fixes PaymentService.java:47
Step 2: Pushes commit to MR branch
Step 3: CodeGuard automatically re-reviews
Step 4: If all checks pass → 'dora-compliant' label applied
Step 5: MR can be merged

Buttons:
"View MR in GitLab →" (orange, primary)
"Share Report" (outline)
"Report False Positive" (grey text link)
```

---

### ═══════════════════════════════
### SCREEN 3 — CI PIPELINE VIEW
### ═══════════════════════════════

**Stitch prompt:**
```
Design a GitLab CI/CD pipeline integration view showing CodeGuard
as a pipeline stage. Dark theme, GitLab orange accents.

Show a GitLab-style pipeline visualization at the top:
Stage boxes connected by arrows:
"lint" → "test" → "dora_compliance" → "build" → "deploy"
The "dora_compliance" stage is highlighted in orange (the focus stage)
With status indicators: ✅ lint | ✅ test | ❌ dora_compliance | (blocked) build | (blocked) deploy

Below the pipeline: DORA compliance stage details
- Stage name: "dora_compliance"
- Duration: "45 seconds"
- Status: "FAILED — Critical violation found"
- Triggered by: commit abc123f by @sarah.kim

Output log (terminal-style, dark background #0D1117):
Monospace font, green text for normal output, red for failures:
  Running DORA Article 9 compliance check...
  Analyzing 3 changed files...
  ✅ Logging completeness: PASS
  ❌ Encryption at rest: CRITICAL — PaymentService.java:47
  ✅ Authorization checks: PASS
  ⚠️  Audit trail: WARNING — refundPayment() missing
  ✅ Safe error handling: PASS

  RESULT: COMPLIANCE CHECK FAILED
  Critical violations: 1
  Reason: Unencrypted sensitive data storage (DORA Art.9)
  
  Fix required before pipeline can proceed.
  See CodeGuard report: https://codeguard.run/mr/247

  exit code: 1

"Fix violations and push to re-run" instruction below log
Link: "View full CodeGuard report →"
```

---

## GITLAB MCP SETUP

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["@gitlab-org/mcp-server-gitlab"],
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "${GITLAB_TOKEN}",
        "GITLAB_API_URL": "https://gitlab.com"
      }
    }
  }
}
```

---

## DEPLOYMENT

```bash
gcloud run deploy codeguard \
  --image=gcr.io/$PROJECT_ID/codeguard:v1 \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-secrets="GITLAB_TOKEN=codeguard-gitlab-token:latest" \
  --memory=512Mi
```
