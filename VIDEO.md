# 🎥 CodeGuard — Demo Video Script & Storyboard

A ready-to-record plan for a **~2:45 hackathon demo video**. Voiceover is timed at ~150 words/min
(word counts noted per beat). Shoot in order; edit is mostly cuts.

- **Live app:** https://codeguard-908307939543.europe-west1.run.app
- **Demo MR:** https://gitlab.com/mmallick1990/codeguard-demo/-/merge_requests/1
- **Pipelines:** https://gitlab.com/mmallick1990/codeguard-demo/-/pipelines
- **Repo:** https://github.com/manojmallick/codeguard

---

## 0 · Recording specs
- **Length target:** 2:30–3:00 (most hackathons cap at 3:00 — do not go over).
- **Resolution:** 1920×1080, 30/60 fps. Browser at 100% zoom, hide bookmarks bar, full-screen the page.
- **Capture:** macOS ⌘⇧5 (or QuickTime → New Screen Recording). Record a clean mic track separately if narrating live; otherwise record silent and add VO in edit.
- **Cursor:** enable "show mouse clicks" so taps are visible.
- **OS dark mode ON** so GitLab matches CodeGuard's palette.

## 1 · Pre-flight checklist (before you hit record)
- [ ] App open and loaded: the live URL (or `npm run dev` locally). Confirm `/health` is green.
- [ ] A second tab open on the **Demo MR**, a third on **Pipelines** (with the red `dora_compliance` job visible).
- [ ] Inputs empty; page scrolled to top.
- [ ] Do one dry run of **Judge Mode** end-to-end so it's warm.
- [ ] Close notifications / Slack / anything that can pop up.

---

## 2 · Shot-by-shot storyboard

### Shot 1 — Hook & problem · 0:00–0:22  *(~52 words)*
**On screen:** CodeGuard dashboard (landing). Slow cursor over the stat tiles.
**Caption (lower third):** `DORA Article 9 · every financial-services merge request`
**VO:**
> "Under the EU's DORA regulation, every change to a banking system has to be checked for Article 9
> compliance — encryption, logging, authorization, audit trails. Today a senior engineer does that by
> hand: about twenty-three minutes per merge request. This is CodeGuard. It does it in forty-five seconds."

### Shot 2 — Run a real review · 0:22–0:52  *(~62 words)*
**On screen:** Type `mmallick1990/codeguard-demo` + `1`, click **Review**. Let the Agent Activity Log stream. Verdict lands: **BLOCK**.
**Caption:** `Two agents · 5-step mission · Gemini 3`
**VO:**
> "I'll point it at a real GitLab merge request that adds a payment endpoint. Two agents go to work:
> GitLabReader pulls the diff through the GitLab MCP server; DORAAuditor pre-scans it, then has
> Gemini 3 confirm the real violations and draft fixes. Eight seconds later — blocked. Three critical
> issues: an unencrypted card number, a hardcoded secret, a swallowed exception."

### Shot 3 — Findings are *verified* · 0:52–1:10  *(~38 words)*
**On screen:** Scroll through the findings — article citations, the before/after diff, the green **✅ fix verified** badge.
**Caption:** `Every fix re-scanned clean · 100% eval recall`
**VO:**
> "Each finding cites the exact article and comes with a fix — and notice the green badge: every fix is
> re-scanned by the rule engine, so CodeGuard never proposes a fix it can't prove. This isn't a model guessing."

### Shot 4 — Human in the loop · 1:10–1:28  *(~38 words)*
**On screen:** Point cursor at the bottom Approval Bar — read the proposed tools. Hover, don't click yet.
**Caption:** `Consequential writes are 403'd until a human approves`
**VO:**
> "It has only read so far. It will not comment, label, block, or open an issue until I approve —
> that gate is enforced on the server and declared in the Agent Builder agent. The human stays in control."

### Shot 5 — It acts, then it FIXES · 1:28–2:05  *(~74 words)* ⭐ the moment
**On screen:** Click **Approve & Execute** → cut to the Demo MR tab showing the posted comment + `compliance-blocked` label. Cut back, click **🔧 Approve Auto-Fix MR** → cut to the opened remediation MR diff.
**Caption:** `Detect → reason → prove → FIX`
**VO:**
> "I approve. CodeGuard posts the review, blocks the merge request, labels it, and opens a training issue —
> all through GitLab. And then the part I'm proud of: I approve the auto-fix, and CodeGuard pushes a
> verified fix branch and opens a remediation merge request — the encryption wrapper, the secret pulled
> from the vault, the exception logged. The reviewer just became the fixer."

### Shot 6 — Shift-left: red pipeline · 2:05–2:25  *(~42 words)*
**On screen:** Switch to the **Pipelines** tab → open the failed `dora_compliance` job → show the log line `❌ DORA Art.9 compliance check FAILED — merge blocked by CodeGuard`.
**Caption:** `Same agent, as a blocking CI gate`
**VO:**
> "And it's not just the UI. Wired into GitLab CI, the same agent becomes a blocking gate — here's a
> real pipeline going red, with CodeGuard's verdict right in the build log. Non-compliant code simply
> can't merge."

### Shot 7 — Audit-ready close · 2:25–2:45  *(~42 words)*
**On screen:** Back in the app — scroll to the **Evidence Pack** (SHA-256) and the **Compliance-Debt Ledger**; click the CSV export. End on the CodeGuard logo / Judge Mode button.
**Caption:** `Evidence hash + obligation ledger · github.com/manojmallick/codeguard`
**VO:**
> "Every scan emits a tamper-evident, hashed evidence record, and confirmed violations become tracked
> obligations you can export for auditors. CodeGuard turns a code review into governance. Compliance
> isn't a vibe — it's a hash. Try it yourself: it's live, with a one-click Judge Mode."

---

## 3 · The lazy path (zero narration)
Short on time? **Just screen-record Judge Mode.** It's self-driving — click **🎬 Judge Mode**, then
**Next ▸** through all 9 beats (~50 seconds). Add the captions above as text overlays in edit, drop a
music bed, done. It hits every beat in order with the spotlight doing the "pointing" for you.

## 4 · Caption / lower-third cheat sheet (for the editor)
```
0:00  DORA Article 9 · every financial-services merge request
0:22  Two agents · 5-step mission · Gemini 3
0:52  Every fix re-scanned clean · 100% eval recall
1:10  Consequential writes are 403'd until a human approves
1:28  Detect → reason → prove → FIX
2:05  Same agent, as a blocking CI gate
2:25  Evidence hash + obligation ledger
2:40  github.com/manojmallick/codeguard · LIVE — click Judge Mode
```

## 5 · Title & end cards
- **Title card (0:00, 2s):** 🛡️ CodeGuard — *DORA Art.9 review agent* · Gemini 3 · Agent Builder · GitLab MCP · Cloud Run. (Use `docs/thumbnail.png`.)
- **End card (last 3s):** the live URL + "🎬 Judge Mode" + the GitHub repo.

## 6 · Tech-stack callouts to flash on screen (build credibility)
`Gemini 3 (gemini-3-flash-preview)` · `Google Cloud Agent Builder` · `GitLab MCP` · `Cloud Run` ·
`Human-in-the-loop` · `Auto-remediation` · `100% eval`

---

### One-line description (for the YouTube/Vimeo upload)
> CodeGuard reviews every GitLab merge request for DORA Article 9 compliance with Gemini 3 — human-gated GitLab writes, auto-remediation, and a blocking CI gate. Built on Google Cloud Agent Builder + Cloud Run. Live: https://codeguard-908307939543.europe-west1.run.app
