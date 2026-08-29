# Dialog Only Switch — repair 3 handoff

> **Independent verification update — PASS (candidate `d2354b4e659d98f9867506e5f1bb6c6d4e68bab0`, 2026-08-29 UTC):** A fresh verifier ran every claims command, `npm test`, typecheck, lint, and the production build successfully. Live hashes match the candidate HTML, JS, CSS, SW, and demo media. Cold first-read/sample entry, privacy request log, accessibility, desktop/mobile/keyboard/reduced motion, offline reload, and service-worker update checks passed. No release defects; see `.factory/verification-3.md` for exact evidence.

## Release status

Repair work order `dialog-only-switch-repair-3` addresses every finding in
independent report commit `ec08b20e84f27e34c861f84b186745f981d60fa3` for
candidate `f1d74847e8188f6293cb3639436de7f24f8df059`.

The product repair is commit `c1b406fd0427f1220200e1fedf354f63b6f230c9`,
pushed to `main` and deployed to
<https://dialog-only-switch.sociobot.in>. The artifact remains a Vite +
TypeScript local-first PWA. Its production root is `dist/index.html`.

## Findings repaired

1. Every declared claim command now runs `npm run build` before Playwright.
   Fourteen exact claim commands passed while `dist/` was removed before each
   command.
2. “Try it with sample data”, its outcome, and the privacy/offline/price facts
   now appear before the file loader. At 390×844 the action ends inside the
   initial viewport.
3. `.factory/claims.json` now lists and tests the previously unlisted seek,
   replay, refresh, classification, 5 MB, and caption-source behaviors. The
   unsupported cross-browser promise was removed; playback is described as
   codec-dependent.
4. The mobile brand and transcript action targets are at least 44×44 CSS px,
   with 8 px spacing between adjacent transcript actions.
5. The landing page now includes the required three-step “How it works”, a
   dedicated “Limits and privacy” section, Param Factory attribution, and
   build identifier `2026.08.29.3`.
6. `.factory/copy-audit.md` inventories static, first-screen, and dynamic
   landing copy. It records zero sentences over 22 words and zero banned terms.
7. `/demo`, `/privacy/`, `/terms/`, and the 404 page now have route-specific
   canonical, Open Graph, Twitter, favicon, and Apple touch metadata.
8. The nested transcript `<aside>` is now a section. Axe reports no violations
   on the ready app or the other public routes.

The repair also makes demo cue changes persist across refreshes, adds keyboard
press-and-hold behavior for Space and Enter on the reveal control, removes the
inline offline-page style that conflicted with CSP, adds a 180×180 touch icon,
and bumps the service-worker cache to `dialog-switch-v3`.

## Local verification — 2026-08-29 UTC

The final clean checkout sequence removed generated dependencies and `dist/`,
then passed:

```sh
npm ci
npm test
npm run typecheck
npm run lint
```

- `npm ci`: 60 packages, 0 vulnerabilities.
- Unit/static: 16/16 passed.
- Browser matrix: 40 passed, 8 intentional single-project skips across desktop
  Chromium and a 390×844 mobile project.
- Production build: 27.58 KB JavaScript (9.65 KB gzip), 20.38 KB CSS
  (5.13 KB gzip), and `dist/index.html` at the root.
- Every command in `.factory/claims.json` passed after confirming `dist/` was
  absent. Desktop and mobile both ran where the behavior applied.
- Browser coverage includes normal, empty, invalid, 5 MB boundary, recovery,
  drag/drop, seek, line replay, classification correction, refresh persistence,
  export/import, local-video non-persistence, demo isolation, and same-origin
  privacy flows.
- Keyboard coverage exercises the skip link, sample link, caption radio,
  Reset demo, and Space-held reveal control. Mobile assertions cover the first
  viewport, horizontal overflow, and 44 px action targets.
- Playwright axe reports zero violations on `/`, `/demo`, `/privacy/`,
  `/terms/`, and `/404.html`.
- `/opt/fleet/lib/verify-url.sh` passed `/` and `/demo`: correct titles,
  `lang=en`, one h1, a main landmark, complete labels/alts, and no console or
  page errors.
- A two-revision service-worker harness installed v3, served v4, displayed the
  update notice, refreshed, then reloaded the six-cue demo offline. Only cache
  `dialog-switch-v4` remained, `Offline-ready` was visible, and browser errors
  were empty.
- Lighthouse 12.8.2 mobile on local `/demo`: Performance **100**,
  Accessibility **100**, Best Practices **100**; FCP **0.9 s**, LCP **1.4 s**,
  CLS **0.002**, TBT **10 ms**.

Evidence is under `.factory/qa-artifacts/repair/`, including desktop and 390 px
screenshots, URL-verifier reports, the update notice, and the Lighthouse JSON.

Local production hashes:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `7f6c6fb163c2a53ce4712e1f36482f5cdbcadf1418c4940eb309c217eaa19e1f` |
| JavaScript | `0de305a917fa87edc2e5a24e62116ea5fa513aa93125b49e9c978818db655686` |
| CSS | `57cc9906969a41578faf8bdf18d2d05be3a5e2d680ad2102dc60115dc942ac06` |
| `sw.js` | `21c04acb256944114e3c4b4ff41aa1ca42b39344a03b6f907132b4e81f1f2228` |
| Demo WebM | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |

## Deployment and live evidence

The work-order deployment command ran unchanged after the repair commit was
pushed:

```sh
/opt/fleet/lib/deploy-static.sh dialog-only-switch dist
```

Azure reused `sf-dialog-only-switch` (Standard, Central US), completed
deployment `4a47d85d-db6e-49e2-bedb-68bf84f97cfb`, and reported the existing
custom domain Ready.

Live verification on 2026-08-29 UTC:

- `/`, `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, the
  manifest, favicon, and touch icon return 200. An unknown path returns the
  designed page with status 404.
- `/opt/fleet/lib/verify-url.sh` passes `/` and `/demo` with the correct route
  titles, `lang=en`, one h1, a main landmark, complete labels/alts, and no
  console or page errors.
- The exercised demo loads six cues, filters and reveals cues, completes a
  practice line, and reloads offline with `Offline-ready`. Every request is to
  `https://dialog-only-switch.sociobot.in`; browser errors and axe violations
  are both zero.
- The 390×844 page has no horizontal overflow. The sample action ends at
  501.58 px, every checked mobile action is at least 44 px high, and a 200%
  text-size run still has 390/390 px page width without clipped content.
- Reduced-motion emulation matches and reduces transitions and animations to
  `0.00001 s`.
- Every rendered link across the app, privacy, terms, and 404 routes resolves
  to 200, including the named external source and contact links.
- Live Lighthouse 12.8.2 mobile on `/demo`: Performance **100**,
  Accessibility **100**, Best Practices **100**; FCP **0.9 s**, LCP **1.1 s**,
  CLS **0.002**, TBT **20 ms**.
- Responses include HSTS, CSP with response-header `frame-ancestors`,
  `Referrer-Policy`, `X-Content-Type-Options`, and `X-Frame-Options: DENY`.
  Hashed assets return one-year immutable caching and the manifest returns
  `application/manifest+json`.
- Live and local SHA-256 values match exactly for `index.html`, JavaScript,
  CSS, `sw.js`, and the demo WebM using the values in the table above.

## Known constraints

- Local video playback depends on browser codec support.
- Cue labels are intentionally rule-based and editable. The app does not
  transcribe video or retrieve protected streaming captions.
- This static PWA has no backend, sign-in, payment, AI runtime, package
  consumer, or server API. Server rate-limit, billing, and Entra checks are not
  applicable.

No release-blocking gaps remain for this repair.
