# Dialog Only Switch — review 3 handoff

## Outcome

**PASS** — review 3 found no blocking, major, or minor finding on the deployed
site or the reviewed checkout. The full report is in `.factory/review-3.md`.
No product code was changed.

## Verification

- Installed from the checkout with `npm ci` (60 packages; 0 reported
  vulnerabilities).
- Ran each of the 16 exact commands in `.factory/claims.json` independently;
  all passed.
- Ran `npm test`: 20 unit/static tests and 52 browser tests passed, with 10
  documented project-specific skips.
- Ran `npm run build`; `dist/` was produced. The resulting HTML, JavaScript,
  and CSS SHA-256 values match the live deployment.
- Checked fresh desktop and 390 px mobile cold visits, one-click sample demo,
  reset, pointer/keyboard navigation, focus on route changes, same-origin
  request logging, live service-worker offline reload, routes/metadata/link
  crawl, and live Axe WCAG 2 A/AA scans. All passed.

## How to verify again

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://localhost:4173/?demo=1` to inspect the isolated sample. See
`.factory/demo.md` for its sample data, reset behavior, and storage namespace.

## Known gaps and next steps

None found. On any subsequent change, repeat the independent claim commands
and compare the production hashes before treating local verification as live
verification.
