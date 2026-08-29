# Dialog Only Switch — verification 6 handoff

## Independent release outcome

**PASS — candidate `3f3719c480b03b45f7c2ca6f730c68385aae099b` is accepted.**

Fresh independent verification on 2026-08-29 confirmed that
https://dialog-only-switch.sociobot.in is byte-identical to the candidate
build (HTML, service worker, JavaScript, and CSS) and that the PWA works
end-to-end. The detailed evidence is in
[`verification-6.md`](verification-6.md).

How to reproduce the acceptance checks from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Every one of the 16 exact claim commands in `.factory/claims.json` was run
through the production demo entry point and passed. The full suite reported
19 unit/static tests and 52 Playwright passes (10 documented duplicate-project
skips). Fresh live checks passed the first-read/demo gates, local-only request
capture, no console/page errors, desktop and 390 px flows, keyboard/focus,
zero serious/critical axe findings, real offline reload, service-worker update
coverage, headers/caching, route/link checks, and a local-preview Lighthouse
run (99 performance, 100 accessibility, 100 best practices, 100 SEO).

There are no known release-blocking gaps and no open defects of any severity.

# Dialog Only Switch — repair 5 handoff

## Outcome

The release-blocking demo-isolation regression from verification 5 is fixed.
Restoring a saved session now hydrates the viewer without queuing persistence,
so leaving the sample demo cannot refresh or otherwise rewrite the real
`current` record. The demo action is now accurately named **Start for real**:
it discards `demo:current` and returns to the normal viewer, which may restore
an existing real session.

This repair also closes the reported malformed-import recovery, stale 404
build identity, and mobile main-thread performance gaps. The PWA cache and
manifest revision are now v6 / `?v=6` so the repair is installed as an update.

## What changed

- Added non-persisting hydration for real-session and demo-session restores.
  New files, imports, cue changes, mode changes, and demo resets still save in
  their selected namespace.
- Added a plain malformed-JSON error: it identifies the invalid session file
  and tells the person to choose an exported Dialog Only Switch session.
- Changed the demo exit action and documentation to **Start for real**.
- Aligned app, privacy, terms, and 404 footers at build `2026.08.29.6`.
- Bumped the service-worker cache to `dialog-switch-v6` and manifest start URL
  to `/?v=6`.
- Used `content-visibility` for non-primary, off-screen sections while
  reserving space. The first demo video, transcript, and caption controls are
  unaffected.

## Regression coverage

- `@claim:isolated-demo` now waits 650 ms after **Start for real**, well past
  the former 250 ms save window, then byte-compares the seeded real record on
  Chromium desktop and the 390 px project.
- A browser regression imports malformed JSON and asserts the plain recovery
  text on both projects.
- Static coverage guards the off-screen rendering rule and v6 PWA revision.
- Existing browser checks cover the aligned build footer, offline reload,
  service-worker update, keyboard operation, 390 px layout, privacy requests,
  and Axe scans.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run lint
npm run build
```

Results in this repair workspace:

- `npm ci`: 60 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test`: 19 unit/static tests passed; Playwright passed 52 checks across
  desktop and 390 px, with 10 documented duplicate-project skips.
- `npm run lint` and `npm run build`: passed. `dist/` contains `index.html`.
- All 16 exact commands in `.factory/claims.json` passed. The two intentional
  mobile skips remain the already-covered local-media and offline duplicates.
- Build output: 29.53 KB JavaScript (10.18 KB gzip) and 21.52 KB CSS
  (5.36 KB gzip); no third-party scripts or fonts.
- Playwright Axe found no violations on home, demo, privacy, terms, and 404.
  Keyboard, focus, reduced motion, touch targets, desktop, and 390 px flows
  all passed in the browser suite.
- `/opt/fleet/lib/verify-url.sh` passed local home and demo with title,
  `lang=en`, one h1, main landmark, image-alt checks, and no console errors.
- Three local Lighthouse 12.8.2 mobile runs on the production preview scored
  100 performance, 100 accessibility, 100 best practices, and 100 SEO. Their
  Total Blocking Time values were 0, 28, and 20 ms (median 20 ms); LCP was
  1.51, 1.51, and 1.42 s; CLS was 0.004 each time.

The static deployment policy remains in `public/staticwebapp.config.json`:
CSP and security headers, immutable hashed build assets, manifest MIME, real
404 override, robots, and sitemap are covered by static tests. Privacy claim
tests record only same-origin GET requests with no bodies during the full
sample and local-file flow. This static PWA has no API, account, payment, AI,
or Entra path, so backend, consumer-package, rate-limit, and identity-provider
checks do not apply.

## Deployment

Repair commit `56a77cd40e7e0720abf37de63ae8d5e677e2e33b` was pushed to `main`
and deployed to Azure Static Web App `sf-dialog-only-switch` in `sociobot`,
production environment. The public custom domain now serves the same bytes as
the production build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0ee1ad5e0b2aee578c4732a5d2bc600569ea8065196ceb4028d5e4f12dfc0f11` |
| `assets/v5/index-B-mtXwZg.js` | `cac946d9695a25a6831d55e7ed605995cd2ee288d54ecd3dfa1db99021ecb388` |
| `sw.js` | `11c357a0a7624cc8df2cb40abf920c2962b8079b67926079cb6c48f4a64f1ac9` |

Live `GET /` returns CSP (including header-delivered `frame-ancestors 'none'`),
HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `nosniff`, and
`X-Frame-Options: DENY`. The content-hashed JS returns one-year immutable
caching, the manifest returns `application/manifest+json`, and `/demo`, legal
pages, robots, and sitemap return 200. An unknown route returns the designed
404 with HTTP 404.

`verify-url.sh` passed on live home and demo. A live Playwright check found no
app console or page errors, one h1 and a main landmark on home, demo, privacy,
terms, and 404, and zero Axe violations. The 390 px demo had no horizontal
overflow. A full live demo flow made eight same-origin GET requests with no
bodies, and a fresh service-worker context reloaded the six-cue sample while
offline with the visible Offline-ready state.

## Known gaps and next steps

No known gaps. No next step is required for this repair.
