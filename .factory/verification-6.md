# Independent verification 6 — PASS

**Candidate:** `3f3719c480b03b45f7c2ca6f730c68385aae099b`  
**Live URL:** https://dialog-only-switch.sociobot.in  
**Verified:** 2026-08-29 (fresh clean checkout)

## Verdict

**PASS.** The public deployment matches the candidate byte-for-byte for the
application shell and implements the researched job: a private local-video and
supplied-WebVTT viewer in which a learner can reversibly hide environmental
caption cues, reveal them temporarily, review a timed transcript, and practise
a dialogue line. No open Critical, High, Medium, or Low defects were found.

## First read and demo contract

Cold-loading the live home page gave this answer without scrolling:

- **What:** “Focus on dialogue in your captions.”
- **For whom:** language learners, caption readers, and classrooms who want
  spoken lines while retaining the original caption track.
- **First action:** “Try it with sample data”; its adjacent explanation says it
  opens a harbour video and six labelled captions.

The action is a one-click link to `/?demo=1`. It opened a working six-cue
sample with the persistent “Demo — sample data, nothing is saved” banner,
Reset demo, and Start for real controls. The first-read and demo-sandbox gates
therefore pass.

## Claim contract — all pass

`.factory/claims.json` is present and declares 16 claims. From the clean
checkout, after `npm ci`, I ran every exact listed command
`npm run test:e2e -- --grep @claim:<id>` against the production demo entry
point. All completed successfully in both Chromium desktop and 390 px mobile
projects. `npm test` then independently re-ran the complete suite.

| Claims exercised | Result |
| --- | --- |
| isolated-demo; drag-drop; reversible-filter; cue-classification | PASS |
| seekable-transcript; line-replay; refresh-persistence | PASS |
| local-only; no-uploads; video-not-saved | PASS |
| session-export-import; webvtt-export | PASS |
| caption-size-limit; supplied-captions-only; offline-reload; free-use | PASS |

The evidence includes the sandboxed local-file flow, the 5 MiB + 1 byte
caption rejection and recovery message, malformed VTT/JSON recovery,
export/import, six-cue demo, demo/real IndexedDB namespace separation, and
offline reload.

## Local candidate quality gates

| Check | Evidence | Result |
| --- | --- | --- |
| Install | `npm ci`: 60 packages; audit reported 0 vulnerabilities | PASS |
| Unit/static | `npm run test:unit`: 19/19 tests passed | PASS |
| Full test | `npm test`: 52 Playwright checks passed; 10 documented duplicate-project skips | PASS |
| Type/lint | `npm run typecheck` and `npm run lint` (`tsc --noEmit`) | PASS |
| Production build | `npm run build` produced `dist/` | PASS |
| Bundle budget | JS 29.53 kB / 10.18 kB gzip; CSS 21.52 kB / 5.36 kB gzip | PASS |
| Lighthouse 12.8.2 mobile, production preview | Performance 99; Accessibility 100; Best practices 100; SEO 100. FCP 342 ms, LCP 397 ms, TBT 113 ms, CLS 0.004 | PASS |

The browser suite also passed the service-worker update path: it installs a
waiting update, exposes the update control, reloads, and removes the prior
cache. Reduced motion was independently emulated on the live app; the media
query matched and control transition/animation durations became `0.00001s`.

## Live behaviour, privacy, accessibility, and PWA

- Normal live demo flow passed: Dialogue only hid three environmental cues;
  holding `R` revealed them; changing a cue produced 4 dialogue / 2
  environmental; marking a selected line complete worked.
- Live request capture for that flow recorded only eight same-origin,
  bodyless GETs: HTML, JS, CSS, route-focus script, icon, decorative hero,
  bundled VTT, and bundled WebM. There were no console errors, page errors,
  failed responses, third-party requests, uploads, or account/payment UI.
- Fresh live PWA context registered and controlled `sw.js`, created only
  `dialog-switch-v6`, then successfully reloaded the six-cue demo and video
  while offline with the visible `Offline-ready` state.
- Fresh axe scans at WCAG 2 A/AA on the active desktop and 390 px demo had
  zero violations, including zero serious/critical findings. The mobile page
  had no horizontal overflow (`390 == 390`), all visible interactive targets
  measured at least 44 px in both dimensions, and keyboard testing reached
  the skip link with a designed 3 px amber focus ring and moved focus to
  `#main`.
- Cold live pages `/`, `/?demo=1`, `/demo`, `/privacy/`, and `/terms/` return
  200. The designed unknown route returns 404. Each checked app route has one
  h1 and a main landmark with no console/page errors; all internal links and
  the repository link resolved successfully.

## Deployment identity and headers

Fresh candidate build files matched production SHA-256 exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0ee1ad5e0b2aee578c4732a5d2bc600569ea8065196ceb4028d5e4f12dfc0f11` |
| `sw.js` | `11c357a0a7624cc8df2cb40abf920c2962b8079b67926079cb6c48f4a64f1ac9` |
| `assets/v5/index-B-mtXwZg.js` | `cac946d9695a25a6831d55e7ed605995cd2ee288d54ecd3dfa1db99021ecb388` |
| `assets/v5/index-CqcTMUnj.css` | `39a6025bb10294f2c3f2dfccbdc517c16952b59ec6d05a32ec1c7b91b670226d` |

Live responses supplied CSP with header-delivered `frame-ancestors 'none'`,
`connect-src 'self'`, `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and HSTS. The
hashed JS is `max-age=31536000, immutable`; the manifest has the required
`application/manifest+json` MIME type; dynamic shell and service-worker
responses are revalidated every 30 seconds. No server-side endpoint, sign-in,
payment, or product-unlock request exists, so request allowance/429 and Entra
checks are not applicable.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

