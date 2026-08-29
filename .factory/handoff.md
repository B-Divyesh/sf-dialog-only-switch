# Dialog Only Switch — repair handoff

## Release status

Repair of the independent verifier's failure report at
`e381e87ede2d94b5e7c5ee6df5fcb295205e2e3e`. The static PWA remains a Vite +
TypeScript local-first product and still builds to `dist/index.html`.

## What changed

- Added the required claims contract at `.factory/claims.json`: six executable
  browser regressions cover the isolated demo, reversible filtering, same-origin
  privacy, local-video non-persistence, session export/import, and offline
  reload.
- Added a direct `/demo` (also `?demo=1`) sandbox. It loads an original
  12-second harbor WebM and six-cue WebVTT sample, persists only under the
  IndexedDB key `demo:current`, and shows the persistent mandated banner with
  working **Reset demo** and **Start for real** controls. Normal sessions stay
  at the separate `current` key.
- Rewrote the first screen for language learners, caption readers, and
  classrooms. Its primary sample action now says **Try it with sample data**
  and states that it opens a harbor video and captions.
- Added `.factory/demo.md`, `.factory/copy-audit.md`, original demo-media and
  social-preview provenance, plus regression tests for all verifier findings.
- Added Static Web Apps policy and discovery artifacts: CSP as a response
  header, immutable `/assets/*` cache policy, manifest MIME mapping,
  `robots.txt`, `sitemap.xml`, and a styled `404.html`. The service-worker cache
  version is updated and precaches the demo media.

## Verification run on 2026-08-29 UTC

```sh
npm ci
npm run typecheck
npm run lint
npm test
for claim_id in isolated-demo reversible-filter local-only video-not-saved session-export-import offline-reload; do
  npm run test:e2e -- --grep "@claim:${claim_id}"
done
npm run build
```

- `npm test`: 11 Vitest tests passed; Playwright desktop + Pixel 5 ran 15
  passes with 5 intentional single-project skips. It includes `@axe-core`
  (zero serious/critical violations), keyboard Reset-demo Enter activation,
  390 px overflow, local media, invalid WebVTT recovery, storage recovery, and
  a real service-worker offline reload.
- Every claim command passed. The local-video and offline claim each run in
  Chromium and intentionally skip the duplicate Pixel 5 project.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <tempdir>` passed:
  HTTP 200, title, `lang=en`, one h1, main landmark, no missing image alt,
  no unlabeled buttons, and no console/page errors.
- Lighthouse mobile against `/demo`: Performance **100**, Accessibility
  **100**, Best Practices **100**; FCP **1.0 s**, LCP **1.4 s**, CLS **0.002**.
- Production build: JavaScript 24.85 KB raw / 8.90 KB gzip; CSS 18.45 KB raw
  / 4.80 KB gzip. The original hero WebP remains 25 KB and the new original
  demo WebM is 204 KB; both are inside their relevant budgets.

## Deploy

Deploy class: static PWA. Build with `npm run build`; publish `dist/`.
`public/staticwebapp.config.json` is copied to the output root and supplies the
required response policy on Azure Static Web Apps. The production recheck must
confirm the response headers and manifest MIME from the deployed host after
this commit is published.

## Known constraints

- The bundled WebM is the one-click demo video. User-provided playback still
  depends on browser codec support; MP4/H.264 and WebM are the recommended
  inputs.
- Cue classification remains intentionally rule-based and reversible. It does
  not transcribe audio or retrieve protected streaming captions.
