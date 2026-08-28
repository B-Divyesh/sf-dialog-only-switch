# Dialog Only Switch — build handoff

## Independent verification status — FAIL

Verified 2026-08-28 UTC against candidate
`15ddf0ddd08b126031cbfa9383612c5ec2b92683` and
<https://dialog-only-switch.sociobot.in/>. **Do not release this candidate.**

The live JS, CSS, and service worker exactly match this commit, and local
unit/e2e/build checks pass. Release is blocked because the mandatory
`.factory/claims.json` is missing, there are no executable claim tests, and
the required isolated one-click sample-data demo is not implemented. `/demo`
is only the normal landing page; it has no demo banner/reset/start-real
controls and the existing “Try sample captions” writes to the normal
IndexedDB session. The cold first screen also does not plainly say that the
product is for language learners/caption readers or provide the mandated
“Try it with sample data” action. Additional live gaps are missing CSP,
short non-immutable asset caching, missing `.factory/demo.md`, and missing
robots/sitemap/designed 404 artifacts.

See [`.factory/verification.md`](verification.md) for commands, exact
evidence, severity-ranked defects, and remediation required before a new
verification.

Work order: `dialog-only-switch-build-1`

Completed: 2026-08-28

Deploy type: static PWA; output is `dist/` with `dist/index.html` at its root.

## What was built

- A complete local video + WebVTT workflow with file pickers and two-file drag
  and drop. Media uses a short-lived object URL and is never uploaded or saved.
- A resilient WebVTT parser for identifiers, cue settings, multiline text,
  common inline markup, malformed-section warnings, and clear invalid-file
  errors. Caption input is capped at 5 MB.
- A rule-based starting classification for dialogue versus environmental cues,
  plus a per-cue “Mark as…” correction. Overrides are stored separately; the
  imported WebVTT text is retained unchanged.
- Reversible “All cues” and “Dialogue only” modes. Holding `R`, Space/Enter on
  the reveal control, or pressing it on touch temporarily reveals suppressed
  cues. The custom caption overlay and always-visible transcript share the same
  state.
- A synchronized transcript with seek controls, active-cue tracking, readable
  hidden-cue placeholders, type labels, and a focused line-practice workflow
  with replay-to-cue-end and completion tracking.
- IndexedDB session recovery for caption text, file name, mode, corrections,
  and practice completions. JSON export/import and a confirmed clear action let
  users own or remove that data. Local video is intentionally reselected after
  refresh.
- Installable PWA manifest with 192/512/maskable icons, versioned app-shell
  caching, immediate worker activation (`skipWaiting` + `clients.claim`),
  runtime asset caching, offline navigation fallback, connectivity status, and
  an update toast.
- Product-specific “quiet screening room” UI at desktop and 390 px, with an
  original generated environmental image, responsive WebP/JPEG sources,
  semantic landmarks, designed focus states, reduced-motion handling, and
  touch targets of at least 44 px.
- Privacy and terms pages, a full README, and the existing MIT license. No
  analytics, accounts, third-party fonts, CDN scripts, API calls, or payments.

## Original artwork

The source and exact prompt are in `assets/src/hero-screening-room.png` and its
JSON sidecars. It was generated with the factory Azure image deployment on
2026-08-28, visually reviewed for text, brands, recognizable people, malformed
architecture, and unintended symbols, then exported at two sizes. The largest
shipped WebP is 25 KB (the mobile WebP is 10 KB). Full art direction and
license/provenance notes are in `.factory/design.md`.

## Verification

The clean-clone commands are:

```sh
npm ci
npm test
npm run build
```

`npm test` passed on 2026-08-28. It includes:

- 9 Vitest parser/classification/time tests.
- Chromium and Pixel 5 Playwright journeys for filter/reveal/practice.
- A real local WebM generated in-browser and opened through the file input.
- Invalid WebVTT error handling and IndexedDB refresh recovery.
- An axe scan with zero serious or critical violations.
- A 390 px horizontal-overflow check.
- An explicit `context.setOffline(true)` service-worker reload.

The factory `verify-url.sh` check passed against the production preview:
HTTP 200, title present, `lang="en"`, exactly one `h1`, a main landmark, zero
images missing alt attributes, zero unlabeled buttons, and zero console/page
errors.

Lighthouse 12.8.2 mobile-class run against `npm run preview`:

- Performance: **100**
- Accessibility: **100**
- Best practices: **100**
- FCP: **0.9 s**
- LCP: **1.4 s**
- Total blocking time: **0 ms**
- CLS: **0.002**

Production transfer/build budgets:

- App JavaScript: 23.4 KB raw / 8.5 KB gzip (budget ≤ 200 KB)
- App CSS: 17.6 KB raw / 4.7 KB gzip (budget ≤ 50 KB)
- Runtime fonts: 0 KB (system stacks; budget ≤ 120 KB)
- Largest hero WebP: 25 KB (budget ≤ 300 KB)
- Total `dist/`: about 276 KB including source map, icons, legal pages, and all
  image variants

`npm audit` reports zero vulnerabilities.

## Known gaps and honest constraints

- Playback codec support comes from the browser. MP4/H.264 and WebM are the
  recommended formats; a browser may reject MKV or uncommon codecs even when
  the file picker accepts them.
- Classification is intentionally transparent and conservative, not machine
  transcription or semantic AI. Ambiguous cues require the supplied manual
  correction.
- The product cannot alter protected streams or retrieve caption tracks from a
  streaming service. It only accepts local, authorized files.
- Success-measure analytics were not added because the privacy contract forbids
  tracking. The 70% mode-switch and reduced-pause hypotheses should be tested
  through consented classroom usability sessions, not silent telemetry.

## Suggested next steps

1. Run learner usability sessions with varied publisher WebVTT styles and add
   only explainable classification rules that users consistently need.
2. Consider optional OPFS media handles if browser support and explicit user
   consent make “reopen last video” valuable; do not silently persist media.
3. Add localized interface strings after validating the first learner
   languages and caption conventions.
