# 📸 Screenshot & Gallery Guide

Everything you need to produce a polished project gallery (for the README, the submission page,
and the deck). Most of it is **already automated** — the rest is a 5-minute manual capture.

## A. Auto-generated app shots (already done)

A headless-Chrome script drives the **running local app** and captures every state into
`docs/screenshots/`. To (re)generate:

```bash
npm run dev                 # or: node --env-file=.env src/server.js   (must be on :8080)
node docs/shoot.mjs         # writes docs/screenshots/*.png at 2× retina
```

| File | What it shows | How it's captured |
|---|---|---|
| `01-dashboard.png` | The DevSecOps dashboard (landing) | page load |
| `02-review.png` | Verdict **BLOCK** + findings + fix-verified | runs the `demo/payments` sandbox |
| `03-approval.png` | The human approval bar (proposed actions) | after review |
| `04-autofix.png` | "Auto-remediation MR opened" card | clicks **Approve Auto-Fix MR** |
| `05-evidence.png` | Tamper-evident evidence pack | after approve |
| `06-judge-mode.png` | Judge Mode coach + spotlight | clicks 🎬 Judge Mode |
| `07-ledger.png` | Compliance-debt ledger + CSV export | after approve |

> Uses the always-on `demo/...` sandbox so shots are instant and deterministic — no credentials,
> no GitLab/Gemini latency. Point at the live deploy instead with
> `SHOOT_URL=https://codeguard-908307939543.europe-west1.run.app node docs/shoot.mjs`.

## B. Manual captures (worth doing — they prove it's real)

These live in GitLab/Agent Builder where you're logged in, so capture them by hand
(⌘⇧4 on macOS) and drop them into `docs/screenshots/`:

| Suggested file | Where | Why it matters |
|---|---|---|
| `08-pipeline-red.png` | GitLab → the demo MR → **Pipelines** → the failed `dora_compliance` job | The "shift-left" money shot — a real red pipeline with CodeGuard's verdict in the log |
| `09-mr-comment.png` | The demo MR → the CodeGuard review **comment + labels** | Proof of the gated GitLab write |
| `10-remediation-mr.png` | The auto-fix MR diff | Proof the agent *fixes*, not just flags |
| `11-agent-builder.png` | Agent Builder console → the imported CodeGuard agent (MCP tools + humanInTheLoop) | Proof of the required Agent Builder artifact |
| `12-health.png` | `…/health` JSON (`partner_connected:true`) | One-glance "it's wired" |

**Live links to capture from:**
- Demo MR → https://gitlab.com/mmallick1990/codeguard-demo/-/merge_requests/1
- Pipelines → https://gitlab.com/mmallick1990/codeguard-demo/-/pipelines
- App → https://codeguard-908307939543.europe-west1.run.app

## C. Capture tips
- **Retina:** the script already renders at `deviceScaleFactor: 2`. For manual macOS shots, ⌘⇧4 is already retina.
- **Consistent width:** crop manual shots to ~1440px wide to match the auto set.
- **Hide chrome:** for browser captures, full-screen (⌃⌘F) and hide the bookmarks bar for a clean frame.
- **Dark UI:** keep the OS in dark mode so GitLab matches CodeGuard's palette.

## D. The gallery order (for the README / submission)
1. Dashboard → 2. Review/BLOCK → 3. Approval gate → 4. Auto-fix MR → 5. Red pipeline →
6. Evidence + ledger → 7. Judge Mode. Lead with the dashboard, end on Judge Mode (the "try it yourself" hook).

## E. A 20–30s screen-recording (optional, high impact)
Record the **Judge Mode** run end-to-end (QuickTime → File → New Screen Recording, or ⌘⇧5).
It's self-driving, so you just click **Next ▸** through the 9 beats. Export as `docs/demo.mp4` /
a GIF and embed at the top of the README. The whole story in under 30 seconds, no narration needed.
