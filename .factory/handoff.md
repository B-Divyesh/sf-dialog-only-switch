# Dialog Only Switch — polish 2 handoff

## Outcome

Polish 2 closes every finding in `review-1.md` and `review-2.md`. Repair
commit: `39f8a5ab7aeb66168916c5a9ebff8d4fb0ef0d80`.

The static build was deployed through `/opt/fleet/lib/deploy-static.sh` to
<https://dialog-only-switch.sociobot.in>. Azure deployment ID:
`e00f57c6-34eb-4dac-a8f5-fae4484ddef9`.

## Verification evidence

- Fresh-clone install: `npm ci` installed 60 packages and reported zero
  vulnerabilities.
- Fresh-clone claim contract: every one of the 16 exact commands listed in
  `.factory/claims.json` passed independently at commit `39f8a5a`. Each ran
  from the production build against the isolated demo entry point.
- Full local suite: `npm test` passed 20 unit/static tests and 52 Playwright
  checks; 10 project-specific duplicate checks were intentionally skipped.
- Type and build: `npm run typecheck` and `npm run build` passed. `dist/` was
  produced with 29.52 kB JavaScript (10.16 kB gzip) and 21.52 kB CSS
  (5.36 kB gzip).
- Live cold checks: `/opt/fleet/lib/verify-url.sh` passed `/`, `/?demo=1`, and
  `/privacy/` with HTTP 200, no console errors, `lang="en"`, one h1, a main
  landmark, and no image without alt. Evidence is in
  `.factory/qa-artifacts/polish-2/live-{root,demo,privacy}/`.
- Live axe, using Playwright at 390 px, reported zero WCAG 2 A/AA violations
  and zero console errors on `/`, `/?demo=1`, `/privacy/`, and `/terms/`.
- Live demo recheck: one click put the sample video at y=402.2 in an 844 px
  viewport. The banner showed “Leave sample mode”, the old label was absent,
  no forbidden review-copy phrase remained, and `/privacy/`, `/terms/`, and a
  missing route returned 200, 200, and 404 respectively.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://localhost:4173/?demo=1` for the isolated sample. See
`.factory/demo.md` for reset and storage details.

## Known gaps

None. The product remains a static, local-first PWA with no account, payment,
or runtime backend.
