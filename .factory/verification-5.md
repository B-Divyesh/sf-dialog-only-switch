# Independent verification 5 — FAIL

**Work order:** `dialog-only-switch-verify-5`  
**Candidate commit:** `c13f28d1381e9ca62bd6b44785c7e008bf14da4a`  
**Live URL:** <https://dialog-only-switch.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**FAIL — do not release this candidate.** One mandatory claim test fails on
both desktop and mobile, and `npm test` consequently exits 1. The deployed
application is byte-identical to the candidate build and reproduces the same
real-session mutation. The first-read/demo gate passes and the core viewer is
otherwise useful, private in observed traffic, accessible, and offline-ready.

## Mandatory first actions

### Claims gate — FAIL

`.factory/claims.json` exists and declares 16 claims. Before other repository
inspection, every declared command was invoked from the clean checkout. The
initial pre-install invocation stopped at the missing local toolchain
(`tsc: not found`). After the required `npm ci`, every exact command was run
again through the production demo entry point.

| Claim | Exact command result |
| --- | --- |
| `isolated-demo` | **FAIL** — 2 failed, desktop and mobile |
| `drag-drop` | PASS — 2 passed |
| `reversible-filter` | PASS — 2 passed |
| `cue-classification` | PASS — 2 passed |
| `seekable-transcript` | PASS — 2 passed |
| `line-replay` | PASS — 2 passed |
| `refresh-persistence` | PASS — 2 passed |
| `local-only` | PASS — 2 passed |
| `no-uploads` | PASS — 2 passed |
| `video-not-saved` | PASS — 1 passed, 1 documented mobile skip |
| `session-export-import` | PASS — 2 passed |
| `webvtt-export` | PASS — 2 passed |
| `caption-size-limit` | PASS — 2 passed |
| `supplied-captions-only` | PASS — 2 passed |
| `offline-reload` | PASS — 1 passed, 1 documented mobile skip |
| `free-use` | PASS — 2 passed |

The failed assertion pre-seeds this real session:

```text
savedAt: 2026-08-29T00:00:00.000Z
vttName: real-session.vtt
```

After entering the demo, resetting it, and choosing **Open an empty viewer**,
the `current` record instead contained a fresh `savedAt` timestamp. The first
focused run wrote `2026-08-29T19:24:43.230Z`; the consolidated suite wrote
`2026-08-29T19:30:02.829Z`. All caption content remained the same, but the
real record was still changed, contrary to the exact claim.

Independent production reproduction showed the real record was byte-equivalent
while the demo was open, then changed after leaving it:

```text
before/during demo savedAt: 2026-08-29T00:00:00.000Z
after leaving demo savedAt: 2026-08-29T19:33:03.739Z
```

Source diagnosis: restoring the real session calls `loadCaptionText`, which
calls `setMode`, which queues a save after 250 ms. That save rebuilds the
record with `new Date().toISOString()`. The regression can race this delayed
write, explaining how a faster prior run could report a pass.

### Cold first-read gate — PASS

Fresh 1440×900 and 390×844 production contexts answered all three required
questions in the first screen:

- What it does: **“Focus on dialogue in your captions.”**
- Who it is for: language learners, caption readers, and classrooms.
- What to click first: **“Try it with sample data.”** The adjacent text says
  it opens a harbor video and six labelled captions.

At 390 px, the sample action ended at 502 px and the three free/privacy/offline
facts were also visible. One keyboard-only activation opened `/?demo=1`, with
the video, six cues, caption switch, and persistent demo banner already in the
first viewport.

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages, 0 vulnerabilities |
| every claim command | **FAIL — 15 passed, 1 failed** |
| `npm test` | **FAIL — 19 unit/static pass; Playwright 48 pass, 10 skip, 2 fail** |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS; aliases `tsc --noEmit` |
| `npm run build` | PASS; `dist/` produced |

Build output is 29.25 KB JavaScript (10.11 KB gzip) and 21.31 KB CSS
(5.29 KB gzip), with no font files. The 24.90 KB WebP hero is below the
300 KB image budget. The demo's total Lighthouse transfer was about 242 KB,
including its 208 KB video.

## Live end-to-end evidence

The smallest useful workflow otherwise passed in fresh production contexts:

- The one-click sample loaded a 12-second local-style WebM and six WebVTT cues,
  initially split into three dialogue and three environmental cues.
- Dialogue-only mode hid three cues; holding `R` revealed them. Relabelling one
  cue changed the summary to four dialogue and two environmental cues.
- Selecting the 0:01 transcript row moved playback to 1.6 seconds. Practice
  completion persisted and the action changed to “Practiced ✓”.
- Dialogue-only WebVTT export contained spoken lines and the relabelled wave
  cue, and excluded the still-environmental gull cue.
- An exactly 5,242,880-byte valid VTT loaded one cue. A file one byte larger
  was rejected with the documented recovery instruction.
- Wrong extension, missing `WEBVTT`, empty captions, one malformed section,
  wrong session shape, and non-video input were exercised. Valid captions and
  video loaded after the errors. No console or page error occurred.

One error-copy defect remains: malformed JSON displays raw parser jargon
(`Expected property name or '}' in JSON at position 1...`) and gives no next
step. Other tested validation errors are plain and actionable.

## Privacy, headers, and deployment identity

The full filtering, practice, export, and local-input flow produced eight HTTP
requests. Every request was a same-origin GET with no body; there was no
third-party request, upload, analytics, account, payment, AI, or sign-in call.

Browser response inspection found CSP, HSTS, `Referrer-Policy`,
`X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`. The CSP limits
connections to self and delivers `frame-ancestors 'none'` as a header. Hashed
JS/CSS use one-year immutable caching; stable images and demo media use
five-minute revalidation. HTML and the service worker revalidate after 30
seconds. Manifest, privacy, terms, robots, sitemap, and every rendered link
returned 200; an unknown route returned the designed 404 with status 404.

Candidate and production bytes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `b65b29e475cd6a304269881d3e8b317ef3e4851e817ccac7522db1713538e69e` |
| `assets/v5/index-BkTgbKgg.js` | `6402261195ffa746b4c1704b105ded813526ae383c42cbdd2eac5c137642c5f5` |
| `assets/v5/index-C8U4qh6V.css` | `d6ad060b606be0d8179dbd02142dbcb238c60c1e25f2ab2c666e609773ab905b` |
| `sw.js` | `e13889c8dc83e64a41f382489e7c491d99d102123a0b2ff3c13ec45fa5da7715` |
| demo WebM | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |

## Accessibility, mobile, and PWA

- Playwright Axe found zero violations, including zero serious/critical
  findings, on home, demo, privacy, terms, and 404 at desktop and 390 px.
- Keyboard traversal reached the skip link, header, and sample action in
  logical order. Each had a visible 3 px amber focus outline. Enter opened the
  sample. The repository keyboard regressions for filtering and reveal passed.
- The 390 px page had no horizontal overflow. Every measured visible action
  was at least 44×44 px. Reduced-motion emulation matched and reduced motion to
  0.01 ms with automatic scrolling.
- `/opt/fleet/lib/verify-url.sh` passed home and demo: HTTP 200, title,
  `lang=en`, one h1, main landmark, alt/label checks, and no browser errors.
- Chrome reported a valid standalone manifest with 192, 512, and maskable
  icons and no manifest errors.
- Live cache `dialog-switch-v5` controlled the page. A fresh offline reload
  retained the six cues, video, and “Offline-ready” state without errors.
  The local v5→v6 update regression also passed in the full browser suite.

Three fresh Lighthouse 12.8.2 mobile runs on the live demo scored Performance
**80, 92, 83** (median **83**), Accessibility **100**, Best Practices **100**,
and SEO **100**. Median LCP was 1.06 s, CLS 0.004, and TBT 694 ms. The median
misses the required ≥90 performance target despite passing the bundle budgets.

## Applicability

This is a static PWA, not a library, CLI, or backend. It has no product API or
unlock endpoint, so package-consumer, backend concurrency/persistence, health,
and 429/`Retry-After` checks do not apply. It does not require sign-in, so the
Entra authority check does not apply. The brief explicitly makes automated
dialogue generation a non-goal, so no missing AI feature was found.

## Defects by severity

### P0 — release blocker

1. **The declared demo-isolation claim fails on desktop and mobile, causing
   `npm test` to fail.** Leaving demo rewrites the existing real session's
   `savedAt` field. This violates the mandatory claims gate and the README
   promise that demo never changes `current`. The button also says “Open an
   empty viewer” but restores that existing session.

### P1 — required quality gap

2. **Live mobile Lighthouse misses the ≥90 performance target.** Three runs
   have a median of 83, driven by a median 694 ms Total Blocking Time.

### P2 — correctness and polish

3. **Malformed imported JSON exposes parser jargon without recovery advice.**
   The error should identify an invalid session file and tell the user to pick
   a valid exported session.
4. **The designed 404 footer has stale build identity.** It says Build
   `2026.08.29.4`, while the app, privacy, and terms pages say
   `2026.08.29.5`.

## Evidence and required re-verification

Fresh local screenshots, Lighthouse JSON, and verifier output are under the
ignored `.factory/evidence/` directory. No product code was modified.

Stop the restore path from writing unchanged real data, make the isolation
test wait past any queued save before asserting, and make “Open an empty
viewer” match its behavior or use the required “Start for real” action. Then
rerun all 16 exact claim commands, the full suite, and live parity checks.
