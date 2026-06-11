# Design System — CodeGuard "DevSecOps Intelligence"

A single-file, dependency-free design system (`public/index.html`) tuned for a dark, dense,
operator-grade compliance console. Aesthetic: **Deep Space** — near-black surfaces, GitLab-orange
brand action, Gemini-blue AI accents, semantic compliance colors.

## 1. Color tokens (CSS custom properties)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0b141c` | App background |
| `--surface` | `#182028` | Cards / containers |
| `--surface-low` | `#141c24` | Table headers, insets |
| `--surface-high` | `#222b33` | Raised surfaces, approval bar |
| `--surface-highest` | `#2d363e` | Hover, ring track |
| `--surface-lowest` | `#070f16` | Code blocks |
| `--border` | `#2a3640` | 1px outlines |
| `--text-0` | `#dae3ee` | Primary text |
| `--text-1` | `#94a6b6` | Secondary text |
| `--text-2` | `#67768a` | Muted / captions |
| **`--accent`** | `#fc6d26` | **GitLab orange** — primary brand action |
| `--accent-soft` | `#ffb597` | Accent text on dark |
| **`--info`** | `#4285F4` | **Gemini blue** — AI / Judge Mode |
| `--info-soft` | `#adc6ff` | Info text |
| `--success` | `#6bde80` | Pass / enforced / verified |
| `--warning` | `#f5a623` | Warn / monitored |
| `--danger` | `#ff6b6b` | Block / critical |
| `--danger-soft` | `#ffb4ab` | Danger text |

**Semantic mapping (compliance verdicts):** `pass → --success`, `warn → --warning`, `block → --danger`.
Pills use a `color-mix()` tint of the semantic color at ~12–14% over the surface with a 45% border.

## 2. Typography
- **Sans:** `Inter` (400/500/600/700) — UI, body, headings.
- **Mono:** `JetBrains Mono` (400/500/700) — code, logs, labels, metrics, IDs, badges.
- **Icons:** Material Symbols Outlined (variable `FILL/wght/GRAD/opsz`); `.fill` class flips `FILL` to 1.
- Base: `14px / 1.5`. Page `h1` 24/700; card `h2` 16/600; verdict numeral 32/700; section labels 11–12px mono uppercase, letter-spacing `.04em`.

## 3. Layout
- **Shell:** fixed `header` (64px) + fixed `aside` sidebar (240px) + scrolling `main` (max-width 1280px, 32px padding).
- **Tokens:** `--sidebar: 240px`, `--header: 64px` (used by the approval bar offset and Judge Mode coach positioning).
- **Bento stats:** 4-col grid of stat tiles; collapses to 2-col under 1080px.
- **Two-up rows:** `.grid2` / `.widgets` at `1.6fr / 1fr`.
- **Responsive:** ≤1080px hides the sidebar + top nav, full-bleed main, recenters overlays.

## 4. Core components
| Component | Class | Notes |
|---|---|---|
| Card | `.card` | 12px radius, 1px border, 20px pad |
| Stat tile | `.stat` | metric + icon; hover lifts border to accent; live-updated from real reviews |
| Verdict | `.verdict` + `.pill.{block,pass,warn}` | 32px numeral + semantic pill |
| Diff block | `pre` + `.add` / `.del` | before/after fix snippets |
| Activity log | `.log` | mono, streams agent steps |
| Ledger table | `table.ledger` | obligations + CSV export link |
| Reviews table | `table.rev` | dashboard context; `.res.{block,pass}` status chips |
| Approval bar | `.approval` (`.show`) | fixed, offset by `--sidebar`; Reject / Auto-Fix / Approve |
| Buttons | `button`, `.ghost`, `.judge`, `.runbtn` | accent primary, ghost secondary, info-outline judge |
| Connection chip | `.conn` + pulsing `.dot` | live GitLab status |

## 5. Judge Mode (guided tour) tokens
- **Spotlight:** `.spotlight` — 2px `--info` outline + a `box-shadow: 0 0 0 4000px rgba(...)` scrim that dims everything else, drawing the eye to one element.
- **Coach panel:** `.coach` — fixed, info-bordered card centered over the content column (`left: calc(50% + var(--sidebar)/2)`), with step counter, dots, and Next/Exit.
- **Requirement chips:** `.coach .req` — success-outlined pills tying each step to a hackathon criterion.

## 6. Motion
- Transitions 0.15s on color/border/background; buttons `:active` scale 0.97.
- `@keyframes pulse` (2s) on the live "connected" dot and the critical-violation icon.
- Smooth `scrollIntoView` on nav + Judge Mode steps.

## 7. Accessibility & honesty notes
- Semantic color is always paired with a **text label** (e.g. "BLOCK", "enforced") — never color alone.
- Dashboard stat tiles **update from the real review** (count, critical count, latency) rather than showing fixed marketing numbers.
- Contrast: `--text-0` on `--surface` ≈ AA for body; mono labels use `--text-1/2` for hierarchy.

## 8. Brand voice
Terse, operator-grade, audit-credible. Signature line: **"Compliance isn't a vibe — it's a hash."**
