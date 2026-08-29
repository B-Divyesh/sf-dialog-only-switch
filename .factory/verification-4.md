# Independent verification 4 — FAIL

**Work order:** `dialog-only-switch-verify-4`  
**Requested candidate:** `443d40468b66408c98ee376fe88b87fae7b2bbef`  
**Only available repository tip tested:** `443d406dc8cf47f75a56da1e8e8db95e2e4847f9`  
**Live URL:** <https://dialog-only-switch.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**FAIL — do not release this candidate.** The requested candidate commit does
not exist in the supplied clone or the remote repository, so it cannot be
checked out, built, or matched to production. `git fetch origin
443d40468b66408c98ee376fe88b87fae7b2bbef` returned `not our ref`, and
`git cat-file -e ...^{commit}` returned status 128. A full fetch and
`git ls-remote origin HEAD refs/heads/main` both identify
`443d406dc8cf47f75a56da1e8e8db95e2e4847f9` as the available tip.

The public deployment is byte-identical to a production build of that
available tip, not to the unavailable requested SHA. The available product is
functionally sound in the exercised flows, but that cannot establish the
identity or behavior of the requested candidate.

A second release blocker exists in the claims contract. Visitor copy promises
“Files stay in your browser”, “We do not upload your video, captions, cue
labels, or practice activity”, and “Nothing from the viewer.” The nearest
listed claim only says data is not sent **to third parties**, and its test only
checks that requests remain same-origin. It would pass a same-origin upload.
The stronger no-upload/nothing-leaves-device promise is therefore unlisted and
not proved by a claim test, which fails the attached claims acceptance rule.

## Mandatory first actions

### Claims gate

`.factory/claims.json` exists. The checkout initially had no `node_modules`
and a clean worktree. After the requested SHA could not be fetched, I ran every
listed `test` command exactly against the only available tip. All 15 commands
exited 0:

| Claim | Result |
| --- | --- |
| `isolated-demo`, `drag-drop`, `reversible-filter` | PASS on desktop and mobile |
| `cue-classification`, `seekable-transcript`, `line-replay` | PASS on desktop and mobile |
| `refresh-persistence`, `local-only` | PASS on desktop and mobile |
| `video-not-saved` | PASS on desktop; repository test skips mobile |
| `session-export-import`, `webvtt-export` | PASS on desktop and mobile |
| `caption-size-limit`, `supplied-captions-only`, `free-use` | PASS on desktop and mobile |
| `offline-reload` | PASS on desktop; repository test skips mobile |

The formal claim tests have two proof gaps:

1. `@claim:local-only` records origins but not methods or bodies, so it cannot
   prove the stronger no-upload copy.
2. `@claim:isolated-demo` starts without a real session and expects the real
   key to remain absent. It does not pre-seed a real session, so it cannot
   detect a demo flow that deletes or overwrites existing real data.

Independent live observation found only GET requests and no upload in both the
sample and local-file flows, and source review found no upload path. The issue
is claim enumeration and regression proof, not an observed live leak.

### Cold first-read and one-click demo

This gate passes at 1440×900 and 390×844 in fresh browser contexts:

- What it does: “Focus on dialogue in your captions.”
- For whom: language learners, caption readers, and classrooms.
- What to click: “Try it with sample data”, above the fold.
- The same screen shows free, browser-local, and offline facts.
- One click opens `/?demo=1`, displays “Demo — sample data, nothing is saved”,
  and immediately loads the harbor video and six realistic timed cues.

Evidence: `verification-artifacts/first-read-desktop.png`,
`first-read-mobile.png`, and `one-click-demo-mobile.png`.

## Clean local gates on the available tip

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 60 packages installed, 0 vulnerabilities |
| every `.factory/claims.json` command | PASS; 15/15 exited 0 |
| `npm test` | PASS; 18 Vitest tests, 47 Playwright passes, 9 documented project skips |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS; currently aliases `tsc --noEmit` |
| `npm run build` | PASS; `dist/` produced |

Production output is 29.25 KB JavaScript (10.08 KB gzip), plus 1.35 KB
route-focus JavaScript (0.62 KB gzip), and 21.31 KB CSS (5.31 KB gzip). There
are no font files. The largest responsive hero is 24.90 KB WebP. All are below
the supplied static-product budgets.

## End-to-end live product evidence

The smallest useful product works on the available deployment:

- Demo storage initially and finally contained only `demo:current`.
- Dialogue-only mode hid three environmental cues; holding `R` revealed them.
- Relabeling one cue changed the summary from 3/3 to 4/2.
- Selecting the 0:01 line moved video time to 1.6 seconds.
- Practice selection opened the line-practice controls.
- Dialogue-only export contained four cues and preserved spoken text.
- Reset restored the sample to 3 dialogue and 3 environmental cues.
- A `.txt`, a 5 MB + 1 byte VTT, a missing-WEBVTT file, an empty track, an
  invalid session JSON, and a non-video file each produced a specific recovery
  message. A valid file loaded after each error path.
- An exactly 5,242,880-byte valid VTT was accepted and loaded one cue.
- A valid local WebM recovered after the invalid-video case.

No console or page error occurred during the main, demo, invalid-input, and
recovery flows. The expected browser resource error appears only when directly
navigating to the intentionally nonexistent route that returns the designed
404 page.

## Privacy, headers, and deployment identity

The complete live sample flow made eight initial requests, all same-origin,
all GET, and all with empty request bodies. Loading local WebM and VTT files
created only a local `blob:` media request; it made no HTTP request. There are
no analytics, AI, account, payment, or sign-in paths in source or observed
traffic.

Playwright response headers and independent `curl` checks agree:

- HTML is `public, must-revalidate, max-age=30`.
- Hashed JS/CSS are `public, max-age=31536000, immutable`.
- CSP is response-delivered and restricts scripts, styles, connections, fonts,
  workers, and frames to the declared local policy.
- HSTS, `Referrer-Policy`, `X-Content-Type-Options: nosniff`, and
  `X-Frame-Options: DENY` are present.
- The manifest is `application/manifest+json`.
- Privacy, terms, robots, sitemap, and every rendered link return 200.
- An unknown route returns the designed page with status 404.

Local/live SHA-256 parity for the **available** tip:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `cd7120e358eda3ec86ccaf4e3b1fa1d44368f55d651822dc059ad9c2897fe16f` |
| `assets/index-CujsiuyO.js` | `08549d4959862331265ae97c5226c6619d995d46185460f0676e28b5ed452051` |
| `assets/index-C8U4qh6V.css` | `d6ad060b606be0d8179dbd02142dbcb238c60c1e25f2ab2c666e609773ab905b` |
| `sw.js` | `e9a178061a705139fbb6841e85eb6c03590fbf8cbf01a814ffd0d7baba37a590` |
| demo WebM | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |

## Accessibility, mobile, and performance

- The supplied `verify-url.sh` passed `/` and `/?demo=1`: HTTP 200, title,
  `lang=en`, one h1, main landmark, alt text, labels, and no browser errors.
- Playwright Axe found zero violations, therefore zero serious/critical
  findings, on `/`, the demo, privacy, terms, and 404 at 390 px.
- Keyboard-only use reached and operated the skip link and sample action. The
  skip link moved focus to `main` and had a 3 px solid visible focus outline.
- The 390 px demo had no horizontal overflow and no measured interactive
  target below 44×44 px.
- Reduced-motion emulation produced 0.00001-second transitions/animations and
  automatic scrolling.
- Lighthouse 12.8.2 mobile scored Performance 96, Accessibility 100, and Best
  Practices 100. FCP was 0.94 s, LCP 1.09 s, CLS 0.004, and TBT 231 ms.

## PWA checks

Chrome reported a valid manifest with no errors, 192/512/maskable icons,
standalone display, and an active service worker. A fresh live context cached
`dialog-switch-v4`, then reloaded the six-cue sample and video offline without
console errors.

An isolated harness served an unmodified production build, then changed only
the service-worker cache revision from v4 to v5. The update notice appeared;
“Install update” reloaded the app; v4 was removed and only v5 remained.

One caching defect remains: `/assets/*` is given a one-year immutable header,
but that path contains stable, unhashed files such as the demo WebM/VTT, hero
images, and social preview. Updating one at the same URL can leave existing
clients with stale content despite a service-worker revision. Immutable
caching should be restricted to content-hashed URLs or those public assets
should receive versioned names.

## Applicability

This is a static PWA, not a library, CLI, or backend. It has no product API,
unlock call, or server-side endpoint, so consumer-package checks, concurrency,
persistence health, and 429/`Retry-After` enforcement are not applicable. It
does not require sign-in, so Entra authority validation is not applicable.
The brief explicitly excludes machine-generated dialogue labels, so no missing
AI feature was found.

## Defects by severity

### P0 — release blockers

1. **Requested candidate is unavailable.** The exact SHA cannot be fetched or
   resolved, while the live bytes match a different commit (`443d406…`). The
   requested candidate cannot be independently reproduced or approved.
2. **The stronger privacy promise is absent from the claim registry and is not
   proved by the listed same-origin test.** “Nothing leaves this device/no
   uploads” is materially stronger than “nothing is sent to third parties.”
3. **The demo-isolation claim test does not protect an existing real session.**
   It must pre-seed `current`, exercise/reset/leave demo, and assert that exact
   record remains unchanged.

### P1 — required quality gap

4. **Immutable caching covers unhashed public assets.** This risks stale demo
   media/captions and imagery after an update.

No additional functional, accessibility, privacy-observation, bundle-budget,
or live-runtime defect was found on the available `443d406…` deployment.

## Evidence

Fresh screenshots, verifier reports, and the Lighthouse JSON are in
`.factory/verification-artifacts/`.
