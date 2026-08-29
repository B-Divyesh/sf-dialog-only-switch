# Independent verification 3 — PASS

**Work order:** `dialog-only-switch-verify-3`  
**Candidate:** `d2354b4e659d98f9867506e5f1bb6c6d4e68bab0`  
**Live URL:** <https://dialog-only-switch.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**PASS — release candidate accepted.** The live deployment matches the candidate production output and the local-video/WebVTT viewer works end to end. No release defects were found.

## Cold first-read and demo

Fresh 390 × 844 live browser evidence:

- What it does: “Focus on dialogue in your captions.”
- Who it is for: language learners, caption readers, and classrooms.
- First action: “Try it with sample data”; bottom edge at 502 px within the 844 px viewport. It opens the harbor video and six editable captions.
- First-screen facts: “Free to use”, “Files stay in your browser”, and “Works offline after the first visit.”

Clicking the action opened `/demo`, loaded six cues, and showed the persistent “Demo — sample data, nothing is saved” banner.

## Claims and local gates

`npm ci` installed 60 packages with zero vulnerabilities. Every exact command listed in `.factory/claims.json` exited 0 from this checkout:

| Claims | Result |
| --- | --- |
| `isolated-demo`, `drag-drop`, `reversible-filter`, `cue-classification` | PASS |
| `seekable-transcript`, `line-replay`, `refresh-persistence` | PASS |
| `local-only`, `video-not-saved`, `session-export-import` | PASS |
| `caption-size-limit`, `supplied-captions-only`, `offline-reload`, `free-use` | PASS |

`npm test` passed: 16 unit/static tests, 40 browser tests, and 8 documented desktop-only/mobile-project skips. `npm run typecheck`, `npm run lint`, and `npm run build` also passed. The build produced `dist/`: JS 27.58 KB (9.65 KB gzip) and CSS 20.38 KB (5.13 KB gzip), within the static-product budgets.

## Live behavior, privacy, accessibility, and PWA

- Dialogue only hid three environmental cues; holding `R` revealed the waves cue. Cue correction, seeking, line practice, persistence, export/import, reset, drag/drop, and the 5 MB + 1 byte limit are covered by passing tests.
- A live `.txt` caption upload gave the specific WebVTT recovery message; a following valid one-cue VTT loaded successfully.
- The full live demo request log contained only the product origin (shell, hashed JS/CSS, icon, bundled assets, VTT, and WebM): no third-party request, console error, or page error.
- Playwright Axe reported zero violations on `/`, `/demo`, `/privacy/`, and `/terms/`; thus zero serious/critical findings. The standalone Axe CLI could not run because this container lacks a system Chrome binary, so the pinned Playwright Chromium/Axe integration was used.
- Keyboard testing verified the skip link, 3 px visible focus outline, focus transfer to `main`, the sample action, and caption/reveal controls. At 390 px there was no horizontal overflow and each checked brand/transcript target was at least 44 px high. Reduced motion computed to `0.00001s` duration.
- Live offline reload worked after first visit: six cues, sample video, `Offline-ready`, and an active service-worker controller. An isolated harness served unmodified build files but advanced only the SW cache name from v3 to v4; the update toast appeared, Refresh worked, and only `dialog-switch-v4` remained in Cache Storage.

## Deployment parity and platform checks

Local/live SHA-256 values matched exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `7f6c6fb163c2a53ce4712e1f36482f5cdbcadf1418c4940eb309c217eaa19e1f` |
| `assets/index-zishkDa1.js` | `0de305a917fa87edc2e5a24e62116ea5fa513aa93125b49e9c978818db655686` |
| `assets/index-ByGaqNPC.css` | `57cc9906969a41578faf8bdf18d2d05be3a5e2d680ad2102dc60115dc942ac06` |
| `sw.js` | `21c04acb256944114e3c4b4ff41aa1ca42b39344a03b6f907132b4e81f1f2228` |
| `assets/harbor-dialogue-demo.webm` | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |

Live responses include HSTS, CSP response header with `frame-ancestors 'none'`, Referrer Policy, `X-Content-Type-Options`, and `X-Frame-Options`. Hashed JS is one-year immutable; the manifest has `application/manifest+json`. All rendered links and public routes returned 200; an unknown route returned the designed 404 with status 404.

This static PWA has no server endpoint, account, payment, AI runtime, or backend API; Entra and 429/rate-limit checks do not apply.

## Defects by severity

No P0, P1, P2, or P3 release defects found.

## Evidence

Screenshots and machine verifier output are in `.factory/qa-artifacts/verification-3/`.
