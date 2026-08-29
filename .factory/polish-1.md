# Perfection loop polish 1 — finding closure

**Work order:** `dialog-only-switch-polish-1`

**Reviewed report:** `.factory/review-1.md` at `00eb353`

**Repair commit deployed:** `4d1d55fea361dc261b100767bec7bbf092367b56`

**Live URL:** <https://dialog-only-switch.sociobot.in>

**Cold live recheck:** 2026-08-29 UTC

All 18 findings are closed. The live screenshots are
`qa-artifacts/polish-1/live-demo-desktop.png` and
`qa-artifacts/polish-1/live-demo-mobile-390.png`. Machine-readable live results
are in `qa-artifacts/polish-1/live-cold-check.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/demo` and `/?demo=1` now place the loaded sample viewer, 3/3 cue summary, video, and mode switch before the optional file loader. The repeated hero and sample CTA are absent. | `opens the working sample in the first viewport after one click`; live mobile video 402–604 px and switch 618–808 px; both live screenshots. |
| F-1-2 | Replaced every broad “editable captions/WebVTT” promise with “supplied WebVTT”, “labelled captions”, or the exact changeable property, “cue label”. | Static test `keeps claims precise...`; source-backed `.factory/copy-audit.md`; cold live body-copy scan in `live-cold-check.json`. |
| F-1-3 | Gave the header a higher stacking context and disabled pointer events on both hero pseudo-elements. | `allows real pointer clicks on every desktop header link`; cold live center-point hit tests for Demo, Privacy, and Terms. |
| F-1-4 | Rebuilt the audit with landing, demo, parser errors, statuses, README, legal, 404, labels, and terminology. SHA-256 checks fail if any audited source changes. | `records a complete landing-page copy audit...`; 102+ passing inventory rows; source-hash regression in `tests/static.test.ts`. |
| F-1-5 | Added route-change storage, h1 focus on forward and back navigation, and a polite route announcer on app, legal, and 404 pages. | `moves focus to the new h1 after forward and back route navigation`; live `forwardH1: true`, `backH1: true`. |
| F-1-6 | Added corrected and Dialogue only WebVTT downloads. The exporter preserves cue timing and untouched source text; Dialogue only follows cue-label changes. | `@claim:webvtt-export`; `exports parseable WebVTT...`; live downloads parse as 6 corrected and 4 dialogue cues. |
| F-1-7 | Set both app and legal skip links to a measured 44 px minimum height. Expanded mobile testing to every visible link, button, file label, and radio target. | `gives every mobile interactive control at least a 44px touch target`; 35 live visible targets passed at 390 px. |
| F-1-8 | Replaced “Ready when you are” with “Choose a video and WebVTT caption file.” | Static stale-copy regression and `.factory/copy-audit.md`; absent on live scan. |
| F-1-9 | Replaced the mood heading with “Save or transfer your caption session”. | Landing skeleton/browser checks; visible on both live demo screenshots. |
| F-1-10 | Removed the decorative “Before you begin” eyebrow. | Static stale-copy regression; absent on live scan. |
| F-1-11 | Renamed “Start for real” to “Open an empty viewer”. It clears `demo:current` and returns to the separate real namespace. | `@claim:isolated-demo`; `operates the demo reset control with the keyboard`. |
| F-1-12 | Renamed the update action to “Install update”. | Static stale-copy and copy-audit checks; service-worker v4 offline test. |
| F-1-13 | Standardized the badge and action to “Environmental” and “Mark as environmental”; kept the exact mode “Dialogue only”. | `@claim:cue-classification`; terminology table in `.factory/copy-audit.md`. |
| F-1-14 | Replaced visitor-facing “suppressed” with “hidden environmental”. | `@claim:reversible-filter`; static stale-copy regression and cold live scan. |
| F-1-15 | Replaced “local-first” with “The app runs in your browser” and “Files stay in this browser.” | `@claim:local-only`; static stale-copy regression and live same-origin request log. |
| F-1-16 | Split the 23-word README test sentence into two plain sentences and removed test jargon. | README section of `.factory/copy-audit.md`; source-hash freshness test. |
| F-1-17 | Replaced “Executable visitor-facing claims” with “Product claims and their tests”. | README audit and source-hash freshness test. |
| F-1-18 | Replaced “generated-art provenance” with “Artwork sources and creation notes”. | README audit and source-hash freshness test. |

## Cumulative earlier findings

No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed. The three
verification reports were also re-read. Their earlier demo, claims, first-fold,
touch-target, structure, copy, metadata, and landmark defects remain fixed and
are covered by the current full suite.

## Acceptance evidence

- Fresh clone `4d1d55f`: every exact command in `.factory/claims.json` passed.
- `npm test`: 18 unit/static passes; 47 browser passes; 9 intentional
  cross-project skips.
- Playwright Axe: zero violations on the ready demo and all public routes.
- Live cold requests: only `https://dialog-only-switch.sociobot.in`.
- Live offline reload: six cues, sample video, and `Offline-ready`.
- Live routes: root, query demo, `/demo`, privacy, terms, robots, and sitemap
  return 200; a missing route returns the designed 404 with status 404.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100;
  LCP 1.06 s; CLS 0.

There are no unresolved findings.
