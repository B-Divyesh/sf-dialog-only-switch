# Dialog Only Switch — adversarial review 2 handoff

## Outcome

**FAIL** on candidate `6fd67d70fe8b29ebf654fe427d15f3f65052a25a`.

The complete report is in [`review-2.md`](review-2.md). Six findings remain:
two blocking, two major, and two minor. Blocking findings are the still-
incomplete copy audit (F-1-4) and the regressed “Start for real” action
(F-1-11). No product code was changed.

## What was verified

- Cold live first reads at 390 × 844 and 1440 × 900.
- One-click demo visibility, realistic sample, Reset, separate IndexedDB
  namespace, seeded real-session integrity, request log, and offline reload.
- Every one of the 16 exact commands in `.factory/claims.json`.
- Every earlier finding in review 1 against both live behavior and source.
- Titles, h1/main counts, metadata, canonical/OG/favicon, designed 404, deep
  links, Back/focus announcement, all links, headers/footers, and visual identity.
- Live Axe scans on all public routes and the loaded demo.
- Full landing/app and README copy inventory with word counts.
- Import/export/sync/AI missed-leverage review.

## Commands and results

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` passed 19 unit/static tests and 52 Playwright tests, with 10
documented duplicate-project skips. Every declared claim command passed when
run separately. The production output is 29.53 KB JavaScript (10.18 KB gzip)
and 21.52 KB CSS (5.36 KB gzip). Live HTML, JavaScript, and CSS hashes match the
local build.

## Known gaps and next steps

Resolve F-1-4, F-1-11, and F-2-1 through F-2-4 exactly as specified in the
review. Then repeat the complete review rather than checking only the diff.
