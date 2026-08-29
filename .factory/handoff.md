# Dialog Only Switch — repair handoff

## Outcome

**Released repair:** `c48ecdd20feb1f28f7469aa4e0f319b73e555702`
(`fix: close verifier privacy and cache blockers`). It is pushed to `main` and
the production build is deployed to
<https://dialog-only-switch.sociobot.in>.

The verifier's requested SHA
`443d40468b66408c98ee376fe88b87fae7b2bbef` was not a Git object locally or
on the remote. A pre-existing object ID cannot be recreated with different
content, so the repair uses the verifier's available base lineage and a new,
fetchable release commit. `origin/main` resolved to the repair SHA after push.

## Verifier findings repaired

1. **No-upload privacy promise now has an exact claim and regression.**
   `no-uploads` is listed in `.factory/claims.json`, and its browser test
   performs filtering and practice, loads uniquely named local WebM and
   WebVTT files, then proves every observed HTTP request is same-origin GET
   with no body or local filename/content in traffic. The first-screen browser
   privacy fact now points to this claim. README wording matches the promise.
2. **Demo isolation protects an existing real session.** The
   `isolated-demo` regression seeds a complete `current` IndexedDB record,
   enters demo mode, changes and resets the sample, leaves demo, then asserts
   the exact real record remains and is restored. The separate `demo:current`
   storage behavior remains unchanged.
3. **Immutable caching no longer includes stable public media.** Vite output
   now uses `assets/v5/`, which contains content-hashed JS and CSS and gets
   `max-age=31536000, immutable`. Stable public assets, including the demo
   WebM/VTT and images, get `max-age=300, must-revalidate`. The service-worker
   cache and manifest revision are v5.

## Verification

Ran from a clean dependency install:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

- `npm ci`: 60 packages installed; audit reported 0 vulnerabilities.
- `npm test`: passed. 19 Vitest tests passed; Playwright completed 60 desktop
  and 390 px project executions with 51 passes and 9 documented device-scope
  skips. This includes all 16 declared claim regressions.
- Focused exact commands passed for the repaired claims:
  `npm run test:e2e -- --grep @claim:isolated-demo` and
  `npm run test:e2e -- --grep @claim:no-uploads`.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed. `dist/`
  contains its root `index.html`; generated JS is 29.25 KB (10.11 KB gzip)
  and generated CSS is 21.31 KB (5.29 KB gzip).
- Keyboard, desktop, mobile, offline reload, and accessibility are covered in
  the browser suite. Playwright Axe found zero violations on the app, demo,
  privacy, terms, and 404 routes. The update regression replaces v5 with a
  simulated v6 worker, exposes the update notice, installs it, and confirms
  only the new cache remains.
- `/opt/fleet/lib/verify-url.sh` passed locally and live for `/` and
  `/?demo=1`: HTTP 200, no console errors, title/lang/one h1/main/alt checks
  pass. The live demo loaded in 747 ms in that smoke test.
- The Static Web Apps emulator returned the intended response policy:
  `/assets/v5/index-BkTgbKgg.js` is immutable for one year, while
  `/assets/harbor-dialogue-demo.webm` is `max-age=300, must-revalidate`.
  CSP, HSTS, Referrer Policy, `nosniff`, and `X-Frame-Options` are present.
- Local Lighthouse mobile on `/?demo=1`: Performance 98, Accessibility 100,
  Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.3 s, CLS 0.004, TBT 150 ms.

## Deployment and identity

Deployment used the production Static Web App `sf-dialog-only-switch` in the
`sociobot` resource group. Live artifact parity was checked after deployment:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `b65b29e475cd6a304269881d3e8b317ef3e4851e817ccac7522db1713538e69e` |
| `sw.js` | `e13889c8dc83e64a41f382489e7c491d99d102123a0b2ff3c13ec45fa5da7715` |
| `assets/v5/index-BkTgbKgg.js` | `6402261195ffa746b4c1704b105ded813526ae383c42cbdd2eac5c137642c5f5` |
| `assets/v5/index-C8U4qh6V.css` | `d6ad060b606be0d8179dbd02142dbcb238c60c1e25f2ab2c666e609773ab905b` |

The live page references the expected v5 JS and CSS paths and has the repaired
cache headers. The product remains a static, local-first PWA; no package,
backend, payment, sign-in, AI, or consumer-library checks apply.

## Known gaps and next steps

No known product gaps remain from verification 4. The old unavailable SHA is
preserved in the verifier report for audit history; releases should use an
existing pushed commit, such as this repair, as the candidate identifier.
