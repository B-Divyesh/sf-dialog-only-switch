# Dialog Only Switch — repair handoff

## Release status

Repair work order `dialog-only-switch-repair-2` is complete. Candidate
`8438ecbbf14c66513e8141561f8cb5b763a4b881` was repaired in
`2f63c952bf6d9cc787540fee21ce3eda17c4f517`, pushed to `main`, and deployed to
the existing static app at <https://dialog-only-switch.sociobot.in>.

The artifact remains a Vite + TypeScript local-first PWA. Its production root
is `dist/index.html`.

## Root cause and repair

The candidate declared `/assets/*` before `/assets/*.js` and `/assets/*.css`
in `public/staticwebapp.config.json`. The first wildcard covered both later
patterns, so Azure correctly rejected them as unreachable.

The repair keeps one immutable `/assets/*` route and removes both redundant
extension routes. `tests/static.test.ts` now compares each route with all
earlier wildcard routes and fails with the shadowing route name if a later
route cannot be reached.

The failure was reproduced directly against the candidate file before the
repair:

```text
/assets/*.js unreachable behind /assets/*
/assets/*.css unreachable behind /assets/*
candidate validation reproduced (expected failure)
```

## Local verification — 2026-08-29 UTC

The exact clean install and production build command passed:

```sh
npm ci && npm run build
```

It produced 24.85 KB JavaScript (8.90 KB gzip), 18.45 KB CSS (4.80 KB gzip),
and `dist/staticwebapp.config.json` with the repaired route list.

Additional gates passed:

```sh
npm run typecheck
npm run lint
npm test
for claim_id in isolated-demo reversible-filter local-only video-not-saved session-export-import offline-reload; do
  npm run test:e2e -- --grep "@claim:${claim_id}"
done
```

- `npm test`: 12 Vitest unit/static tests passed. Playwright desktop and Pixel
  5 projects reported 15 passes and 5 intentional single-project skips.
- Every command declared in `.factory/claims.json` passed from a fresh browser
  context. This covers demo isolation, reversible filtering, same-origin
  privacy, local-video non-persistence, JSON export/import, and offline reload.
- The browser suite covers invalid WebVTT recovery, stored-session recovery,
  keyboard activation, 390 px layout, and a Playwright axe scan with zero
  serious or critical violations.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <evidence-dir>`
  returned 200 with the correct title, `lang=en`, one h1, a main landmark,
  complete image/button labels, and no console or page errors.
- A two-revision service-worker harness confirmed the worker controls the app,
  an update displays the refresh notice, Refresh reloads the page, and the
  complete flow logs no browser errors.
- Lighthouse 12.8.2 mobile on the local `/demo`: Performance **100**,
  Accessibility **100**, Best Practices **100**; FCP **0.90 s**, LCP **1.32 s**,
  CLS **0.002**, TBT **0 ms**.

## Deployment and live evidence

The repair commit was pushed before deployment. The work-order deployment
configuration was then run unchanged:

```sh
/opt/fleet/lib/deploy-static.sh dialog-only-switch dist
```

Azure reused `sf-dialog-only-switch` (Standard, Central US), accepted the
configuration, and completed deployment
`fb8c0f98-15d4-41a3-bc8e-f973f8f2dbb1`. The custom domain was already Ready.

Live verification at 2026-08-29 14:48 UTC:

- `/`, `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, and `/sitemap.xml`
  return 200. `/not-a-real-route` returns 404.
- The worker verifier against the live `/demo` returns 200, reports title
  `Demo — Dialog Only Switch`, `lang=en`, one h1, a main landmark, no missing
  labels, and no console or page errors.
- Desktop keyboard Reset demo works. The live axe scan has zero serious or
  critical violations. Pixel 5 width is 393/393 CSS px with no overflow or
  console errors.
- All requests in the exercised demo flow use only
  `https://dialog-only-switch.sociobot.in`.
- A fresh installed service worker reloads the six-cue video demo offline;
  the `Offline-ready` state is visible and no browser errors occur.
- Live Lighthouse mobile: Performance **100**, Accessibility **100**, Best
  Practices **100**; FCP **0.90 s**, LCP **1.00 s**, CLS **0.002**, TBT **68 ms**.
- The live response includes CSP, `Referrer-Policy`,
  `X-Content-Type-Options`, and `X-Frame-Options`. Hashed JavaScript returns
  `Cache-Control: public, max-age=31536000, immutable`; the manifest returns
  `application/manifest+json`.
- Deployment identity is exact: local and live JavaScript SHA-256 are
  `345a8f9845459799a31656b022190cb3a7a1272da80c4abf2895e5a9597109d1`;
  CSS hashes are
  `b1afab542593ccdbcc21c334d12d5a838a74db47c9bd7fb01c21f2753e174136`;
  service-worker hashes are
  `5f3edd4adcadafa07b19d455f2b21225ab836f771847f6b36c1f512051891b84`.

## Known constraints

- User-provided video playback depends on browser codec support. MP4/H.264 and
  WebM are the recommended inputs.
- Cue classification is intentionally rule-based and reversible. It does not
  transcribe audio or retrieve protected streaming captions.
- No release-blocking gaps remain for this repair.
