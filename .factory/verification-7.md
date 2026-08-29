# Independent verification 7 — PASS

**Candidate:** `7257118e4c3f94067a4d72ed1f23f52a6ed0f8e5`  
**Live URL:** https://dialog-only-switch.sociobot.in  
**Verified:** 2026-08-29 from a clean checkout

## Verdict

**PASS.** The live static PWA matches the tested candidate byte-for-byte for
the application bundle, stylesheet, service worker, bundled sample video, and
sample WebVTT. It fulfils the researched job: a learner can open local video
and supplied WebVTT, switch reversibly between all captions and dialogue only,
temporarily reveal hidden environmental cues, use the timed transcript, and
practise a selected line. No release-blocking defect was found.

## Required first-read and demo gates

A cold desktop visit showed, without scrolling:

- **What:** “Focus on dialogue in your captions.”
- **For whom:** “For language learners, caption readers, and classrooms who
  want spoken lines while keeping the original caption track.”
- **First action:** “Try it with sample data,” with the adjacent plain result:
  “Opens a harbor video and six labelled captions.”

The one-click action opens `/?demo=1` with a visible six-cue video/transcript
and persistent “Demo — sample data, nothing is saved” banner, Reset demo, and
Start for real controls. This passes the plain-words and demo-sandbox gates.

## Claim contract

`.factory/claims.json` exists and has 16 claims. After `npm ci`, every exact
command declared there was run independently against the production-built demo
entry point. All passed:

| Claim IDs | Result |
| --- | --- |
| `isolated-demo`, `drag-drop`, `reversible-filter`, `cue-classification` | PASS |
| `seekable-transcript`, `line-replay`, `refresh-persistence` | PASS |
| `local-only`, `no-uploads`, `video-not-saved` | PASS |
| `session-export-import`, `webvtt-export` | PASS |
| `caption-size-limit`, `supplied-captions-only`, `offline-reload`, `free-use` | PASS |

This covered the isolated IndexedDB namespace, bundled six-cue sample,
simultaneous local video/WebVTT drop, reversible filter and hold-to-reveal,
editable classifications, timed seek and line replay, persistence,
JSON/WebVTT export-import, malformed-input recovery, 5 MiB + 1 byte WebVTT
rejection, no-upload request capture, and offline reload.

## Local quality gates

| Check | Evidence | Result |
| --- | --- | --- |
| Install | `npm ci`: 60 packages, 0 reported vulnerabilities | PASS |
| Unit/static | `npm run test:unit`: 20/20 tests | PASS |
| Full suite | `npm test`: 52 passed, 10 documented project-specific skips | PASS |
| Type/lint | `npm run typecheck` and `npm run lint` (`tsc --noEmit`) | PASS |
| Production build | `npm run build` created `dist/` | PASS |
| Initial bundle budget | JS 29.52 kB / 10.16 kB gzip; CSS 21.52 kB / 5.36 kB gzip | PASS |

The full suite also exercised the service-worker update path by changing the
worker cache version, accepting the waiting update, reloading, and confirming
the old cache was removed.

## Independent live checks

- Desktop end-to-end sample flow passed: selecting Dialogue only hid the
  environmental cues; holding `R` revealed the waves cue; selecting and
  completing a practice line produced `Practiced ✓`.
- Live Playwright request capture over the whole normal flow recorded only
  same-origin `GET` requests, all bodyless. There were no third-party
  requests, uploads, console errors, or page errors.
- A fresh live PWA context registered and controlled `/sw.js`; after an online
  reload, an offline reload retained the six-cue sample, video, “Filter this
  sample to spoken lines” heading, and visible `Offline-ready` state. Calling
  `registration.update()` found no waiting worker, as expected for the current
  deployed version.
- On 390 × 844 mobile, the sample action bottom was 501.58 px (in the first
  viewport), landing and demo widths were both `390 == 390`, and every visible
  interactive target measured at least 44 × 44 px.
- Keyboard testing reached the skip link, Enter moved focus to `#main`, and
  focused primary and demo controls had a designed `rgb(255, 217, 154)` solid
  3 px outline. Reduced-motion emulation matched the media query.
- Fresh axe scans of `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`
  found zero serious or critical violations. Each page had exactly one `h1` and
  no console/page errors.
- All landing-page internal links (`/`, `/?demo=1`, `/privacy/`, `/terms/`)
  returned 200; the designed `/404.html` route rendered correctly.

## Deployment identity, privacy, and headers

Fresh local `dist/` files and live responses had identical SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `assets/v5/index-l7TXEEMF.js` | `36c98c53b6291599c6613ac8ce778579a567bb601270a6aac67da987d8287f54` |
| `assets/v5/index-CqcTMUnj.css` | `39a6025bb10294f2c3f2dfccbdc517c16952b59ec6d05a32ec1c7b91b670226d` |
| `sw.js` | `11c357a0a7624cc8df2cb40abf920c2962b8079b67926079cb6c48f4a64f1ac9` |
| `assets/harbor-dialogue-demo.webm` | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |
| `assets/harbor-dialogue-demo.vtt` | `00f9e71555f204b94af28ecd1970b4bf6f05a43fa2a076f1ab9e148824a06981` |

Live headers on the shell, assets, service worker, manifest, and privacy page
included HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer
policy, `X-Frame-Options: DENY`, and CSP with `connect-src 'self'` and
header-delivered `frame-ancestors 'none'`. Hashed JS/CSS use
`max-age=31536000, immutable`; HTML, manifest, and service worker revalidate
at 30 seconds. The manifest MIME type is `application/manifest+json`.

This is a static, local-first product: no server-side product endpoint,
authentication, payment, unlock request, or external API exists. The request
allowance/429 and Entra-tenant checks are therefore not applicable.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |
