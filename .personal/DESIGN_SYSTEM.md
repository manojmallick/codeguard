# 🎨 UNIFIED DESIGN SYSTEM — "ComplianceOS" (all 6 tracks)

One design language, six partner skins. This file is the **shared spine** so every
screen across RegQuery, CodeGuard, DynaCompliance, AuditLens, IncidentIQ, and
RegPipeline looks like one product family — and bakes in the **agent-approval /
human-in-the-loop** pattern the judges are explicitly told to reward.

How to use it:
1. Read **§1–§4** once (tokens, components, screen flow, the agent pattern).
2. For any screen, prepend the **§7 Stitch master preamble**, then paste that
   track's existing screen prompt from its `CLAUDE_*.md`, then append the
   **§6 partner accent block** for that bucket. Result: consistent system, partner-branded.

---

## 1. DESIGN TOKENS (shared across all tracks)

### Typography
- **Family:** Inter (UI), JetBrains Mono (code / IDs / ES|QL / pipelines).
- **Scale (px / line-height / weight):**
  - Display 32 / 40 / 700 — hero numbers, classification verdicts (MAJOR/PASS/FAIL)
  - H1 24 / 32 / 700 — page titles
  - H2 18 / 28 / 600 — section headers
  - Body-L 16 / 24 / 400 — primary answer text
  - Body 14 / 20 / 400 — default UI
  - Caption 12 / 16 / 500 — labels, metadata, timestamps (often uppercase + 0.04em tracking)
  - Mono 13 / 20 / 450 — IDs, code, queries

### Spacing & layout
- **4-pt grid.** Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64.
- **Card padding:** 20. **Card gap:** 16. **Section gap:** 32.
- **Max content width:** 1280, centered. **Sidebar:** 320–340. **Header height:** 56.
- **12-column** responsive grid; collapses to 1-col < 768.

### Shape & elevation
- **Radius:** sm 6 (chips/badges) · md 10 (cards/inputs) · lg 16 (modals/hero) · pill 999.
- **Borders do the work, not shadows** (dark UI): `1px solid {border}` on every surface.
- **Elevation** = subtle inner glow on focus + `2px` accent left-border for state, not drop shadows.

### Motion
- **Durations:** 120ms (hover) · 200ms (state) · 320ms (panel/route).
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` (standard) for enter; ease-out for exit.
- **Signature motions:** status pill pulse (2s loop), countdown tick, agent-step "typewriter" reveal in the activity log, approve-button success ripple.

### Neutral ramp (theme-agnostic, shared by all skins)
The neutrals are constant; only the **accent** changes per partner (§6).
```
--bg-0   : #07090F   /* app background, deepest */
--bg-1   : #0E1220   /* surface / cards */
--bg-2   : #151B2E   /* raised surface / table header */
--border : #1F2A40   /* 1px card + divider */
--text-0 : #F2F6FF   /* primary text */
--text-1 : #93A1B8   /* secondary text */
--text-2 : #5C6B82   /* muted / disabled */
```

### Semantic colors (constant across all skins)
```
--success : #10B981   --success-bg : #0C1F1A
--warning : #F5A623   --warning-bg : #221A0B
--danger  : #FF4D6D   --danger-bg  : #1F0C12
--info    : #4285F4   /* Gemini/Google blue — used for AI elements everywhere */
```
> Rule: **partner accent = brand identity; semantic colors = state.** Never use the
> partner accent to signal danger/success — that's what the semantic ramp is for.
> The Gemini blue `#4285F4` always marks "this was done by the AI/agent."

---

## 2. COMPONENT LIBRARY (build once, reuse on every screen)

| Component | Spec |
|---|---|
| **AppHeader** | 56px, `--bg-2`, bottom `1px --border`. Left: product logo (icon in partner accent + wordmark). Center: live status pill `● <STATE>` (pulse). Right: "<Partner> Connected" badge (accent border) + Gemini-3 badge (`--info`) + settings. |
| **StatBadge / HeroStat** | Card with Caption label, Display number, sub-caption. Number colored by semantic meaning (count=text-0, danger=danger, speed=success). Optional progress bar/ring. |
| **DataTable** | `--bg-2` header row, `--bg-1` body, row hover `--bg-2`. Status cells use **Pills**. Row left-border 2px when in a state (danger row = `--danger`). |
| **Pill / Badge** | Radius pill, 12px caption, `bg = semantic-bg`, `text = semantic`, optional leading dot/icon. (MAJOR ●, PASS ✓, BLOCKED 🚫, Analyzing ⟳). |
| **VerdictBlock** | The big classification box. `semantic-bg` tint, 4px `semantic` left-border, Display verdict, confidence bar, "triggered by" list with check/cross icons. |
| **ConfidenceBar** | 10-segment bar OR ring; fill colored by threshold (≥85 success, 60–85 warning, <60 danger). ALWAYS paired with a one-line reason (transparency). |
| **AgentActivityLog** | Mono, streaming list of agent steps with durations: `Agent · action · 340ms`. Typewriter reveal. This is the "it's an agent" proof — present on every track. |
| **ApprovalBar** ⭐ | The human-in-the-loop control (see §4). Sticky bottom bar: action summary + "Approve & Execute" (accent) + "Edit" + "Reject". |
| **CodePanel** | `--bg-0`, JetBrains Mono, syntax-highlighted; green=added/compliant, red=removed/violation. Used for diffs, ES|QL, pipelines, MCP calls. |
| **CountdownTimer** | Mono Display, `--warning` when <4h, `--danger` when <1h. For DORA deadlines. |
| **PartnerBadge** | "Powered by <Partner> MCP + Gemini 3" — bottom-right of every screen. Reinforces the required stack for judges. |

---

## 3. SCREEN-FLOW MODEL (the navigation spine — same for all 6 tracks)

Every track tells the **same 4-beat story**, which also maps 1:1 to the **4 required
Devpost screenshots**. This consistency is what makes it feel like a product, not 6 demos.

```
  ┌─────────────┐   select    ┌─────────────┐   agent proposes   ┌──────────────┐   approve   ┌───────────────┐
  │ 1. COMMAND  │ ──────────▶ │ 2. ANALYSIS │ ─────────────────▶ │ 3. ACTION    │ ──────────▶ │ 4. CONFIRM    │
  │   CENTER    │   an item   │   DETAIL    │   evidence+verdict │   (approval) │  human=yes  │   + AUDIT     │
  └─────────────┘             └─────────────┘                    └──────────────┘             └───────────────┘
   dashboard / list            deep-dive on one                  what the agent WANTS          done + trail
   live stats + feed           item: agent evidence,             to do, awaiting your          (screenshot #4,
   (screenshot #1)             reasoning, verdict                 approval (screenshot #3)      the audit story)
                               (screenshot #2)
```

Mapping to existing per-track screens (reuse what's written, just slot it into the flow):

| Beat | RegQuery | CodeGuard | DynaCompliance | AuditLens | IncidentIQ | RegPipeline |
|---|---|---|---|---|---|---|
| 1 Command | Q&A interface | Compliance dashboard | Main dashboard | EU AI Act dashboard | Search center | Pipeline health |
| 2 Analysis | Atlas search details | MR review detail | Incident deep-dive | Trace analysis | DORA classification | Regulatory impact |
| 3 Action ⭐ | **(NEW)** "File this answer to compliance profile?" approval | Block-MR approval | "Submit to DNB?" approval | "Deploy Prompt B?" approval | "Submit early warning?" approval | "Apply schema change / send digest?" approval |
| 4 Confirm | Profile updated + history | CI pipeline view + label applied | Monthly report / audit trail | Experiment results | Workflow trace + reminder set | Sync history |

> **Gap to fix:** most tracks currently jump from analysis straight to a result and
> skip **beat 3 (explicit human approval)**. Add the ApprovalBar (§4) between analysis
> and confirm on every track. That single pattern is the strongest judge signal here.

---

## 4. THE AGENT-APPROVAL PATTERN ⭐ (the differentiator)

The rules say: *"the agent can plan the steps and use the tools at its disposal to
finish the job, **while keeping you in control**."* Make "in control" a literal UI.

**ApprovalBar — sticky bottom, on every consequential action:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⚡ Agent proposes:  Submit DORA Art.17 early-warning to DNB                   │
│  ├ writes event back to Dynatrace · drafts EBA notification · sets 72h reminder │
│  ⏱ Deadline 14:17 CET (3h 54m)        [ Edit draft ]  [ Reject ]  [ Approve & Execute ▸ ] │
└──────────────────────────────────────────────────────────────────────────────┘
```
Rules for the pattern:
- The agent **never executes a consequential MCP write** (push event, create issue,
  submit notification, deploy prompt, trigger sync) **without an Approve click.**
- The bar lists **exactly which tools fire** on approve (transparency).
- Read-only steps (search, classify, score) run automatically and stream into the
  **AgentActivityLog** — no approval needed.
- On approve: button shows success ripple → action executes → **beat 4** shows the
  result + a permanent **audit entry** (`who/agent · what · when · result`).
- "Edit" lets the human tweak the draft before it's sent (real oversight).

This pattern, shown once in each ~3-min video, is your clearest "this is an agent,
not a chatbot, and it keeps the human in control" proof.

---

## 5. ACCESSIBILITY & POLISH (cheap points)
- Contrast ≥ 4.5:1 for body text on all skins (the neutral ramp already passes).
- Never encode state by color alone — pair with icon/text (●/✓/✗, PASS/FAIL).
- Focus rings: 2px `--info` outline, visible on keyboard nav.
- All numbers right-aligned in tables; monospace for IDs/times so columns align.
- Empty states + loading skeletons for the live feeds (judges will see them).

---

## 6. PARTNER ACCENT BLOCKS (the only thing that changes per skin)

Drop the matching block into a screen prompt to brand it. Everything else (neutrals,
semantics, components, flow) stays identical.

```
RegQuery   — MongoDB   : --accent #00ED64  (logo: document-search)   tagline "Atlas Vector Search + Gemini 3"
CodeGuard  — GitLab    : --accent #FC6D26  (logo: shield)            tagline "GitLab MCP + Gemini 3"
DynaComp.  — Dynatrace : --accent #00B4D8  (logo: shield)            tagline "Dynatrace MCP + Gemini 3"
AuditLens  — Arize     : --accent #7C3AED  (logo: eye)               tagline "Phoenix MCP + Gemini 3"
IncidentIQ — Elastic   : --accent #00BFB3  (logo: lightning)         tagline "Elastic Agent Builder + Gemini 3"
RegPipeline— Fivetran  : --accent #0073E6  (logo: pipeline/flow)     tagline "Fivetran MCP + Gemini 3"
```
Accent usage: primary buttons, logo glyph, active nav, focus highlights, links,
progress fills that represent *brand* (not state), and the PartnerBadge. Nothing else.

---

## 7. STITCH MASTER PREAMBLE (prepend to every screen prompt)

Paste this **before** any track's existing screen prompt, then paste the §6 accent
block. It forces every generated screen onto the shared system.

```
You are designing one screen of "ComplianceOS", a family of EU-compliance agent
apps. Use this EXACT design system; only the accent color changes per app.

THEME: dark, professional financial-services SaaS. Backgrounds: app #07090F,
cards #0E1220, raised #151B2E, borders 1px #1F2A40. Text: primary #F2F6FF,
secondary #93A1B8, muted #5C6B82. Semantic: success #10B981, warning #F5A623,
danger #FF4D6D; AI/agent elements use Google blue #4285F4. Accent color: {ACCENT}
(brand only — buttons, logo, active states, links; never for status).

TYPE: Inter for UI, JetBrains Mono for IDs/code/queries. Display numbers 32px/700,
H1 24/700, H2 18/600, body 14–16, caption 12 uppercase tracked. 4-pt spacing grid,
card padding 20, radius: chips 6 / cards 10 / modals 16 / pills 999. Borders not
shadows. Header bar 56px. Max width 1280 centered.

REQUIRED ELEMENTS on every screen: (a) AppHeader with product logo, a live status
pill, a "<Partner> Connected" badge and a "Gemini 3" badge; (b) a streaming
AgentActivityLog in mono showing agent steps with millisecond timings; (c) a
"Powered by <Partner> MCP + Gemini 3" badge bottom-right. For any consequential
action, include a sticky bottom ApprovalBar: it summarizes what the agent will do,
lists exactly which tools fire, and has [Edit] [Reject] [Approve & Execute] —
the agent must wait for human approval (keep-human-in-control).

Now design the following screen within that system:
---
{PASTE THE TRACK'S EXISTING SCREEN PROMPT HERE}
```

---

## 8. WHAT TO ACTUALLY GENERATE (per bucket = 4 screens)
Beat 1 (Command) · Beat 2 (Analysis) · Beat 3 (Action+ApprovalBar) · Beat 4 (Confirm+Audit).
These become the 4 Devpost screenshots and the spine of the ~3-min video.
The existing `CLAUDE_*.md` prompts already cover beats 1, 2, and 4 — you mainly need
to add **beat 3 (the ApprovalBar action screen)** for each track, using §4 + §7.
