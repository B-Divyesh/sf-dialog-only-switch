# Dialog Only Switch — verification 5 handoff

## Outcome

**FAIL — do not release candidate
`c13f28d1381e9ca62bd6b44785c7e008bf14da4a`.**

Independent verification is recorded in
[`.factory/verification-5.md`](verification-5.md). The live deployment at
<https://dialog-only-switch.sociobot.in> is byte-identical to this candidate's
production build.

## Release blocker

The exact `@claim:isolated-demo` command fails on desktop and mobile. A seeded
real `current` session remains unchanged while demo is open, but leaving demo
restores it and queues an unnecessary save. After 250 ms, its `savedAt` value
is replaced with the current time. This violates the declared isolation claim,
README promise, and mandatory claims gate. It also makes `npm test` exit 1.

The user-facing **Open an empty viewer** action does not open an empty viewer
when a real session exists; it restores that session.

## Verification summary

- First-read gate: PASS at 1440×900 and 390×844. The first screen plainly says
  what the viewer does, names its users, and exposes the one-click sample.
- Exact claims: **15 passed, 1 failed** (`isolated-demo`).
- `npm test`: **FAIL** — 19 unit/static pass; Playwright 48 pass, 10 skip,
  2 fail (the same isolation regression in both projects).
- `npm run typecheck`, `npm run lint`, and `npm run build`: PASS.
- Live core workflow, invalid-input recovery, privacy request log, headers,
  caching, keyboard, 390 px layout, Axe, manifest, service-worker update, and
  offline reload were exercised. Details and hashes are in the report.
- Production requests observed during the complete flow were same-origin GETs
  with no bodies. There is no backend/API, account, payment, AI, or sign-in.
- Lighthouse mobile performance runs were 80/92/83 (median 83), below the
  required 90; Accessibility, Best Practices, and SEO were 100.

## Additional defects

1. Malformed session JSON exposes raw parser syntax and no next step.
2. The 404 footer says Build `2026.08.29.4`; other public pages say
   `2026.08.29.5`.

## Reproduce

```sh
npm ci
npm run test:e2e -- --grep @claim:isolated-demo
npm test
npm run typecheck
npm run lint
npm run build
```

The first two test commands reproduce the release blocker. Fresh local
screenshots, Lighthouse reports, and verifier output are in the ignored
`.factory/evidence/` directory.

## Next steps

1. Prevent session restoration from saving an unchanged `current` record.
2. Make the isolation assertion wait past queued persistence so it cannot
   race the mutation.
3. Align the demo exit action's label and behavior with “Start for real”.
4. Reduce live main-thread blocking and rerun three mobile Lighthouse checks.
5. Replace raw JSON parser errors with a plain recovery message and update the
   404 build identifier.

No product code was changed during this verification.
