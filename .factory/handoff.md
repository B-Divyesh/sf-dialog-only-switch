# Dialog Only Switch — independent verification 7 handoff

## Outcome

**PASS** — candidate `7257118e4c3f94067a4d72ed1f23f52a6ed0f8e5` is accepted
for https://dialog-only-switch.sociobot.in. The live deployment matches its
app bundle, stylesheet, service worker, sample video, and sample WebVTT
byte-for-byte. No Critical, High, Medium, or Low defects remain.

## Verification evidence

- Clean install: `npm ci` installed 60 packages with 0 reported
  vulnerabilities.
- Claim contract: all 16 exact demo-entry-point commands in
  `.factory/claims.json` passed independently.
- Full local suite: `npm test` passed 20 unit/static tests and 52 Playwright
  checks; 10 documented project-specific checks were skipped.
- `npm run typecheck`, `npm run lint`, and exact `npm run build` passed.
  `dist/` contains 29.52 kB JS (10.16 kB gzip) and 21.52 kB CSS (5.36 kB
  gzip).
- Live desktop and 390 px mobile testing passed normal, boundary, and recovery
  flows; keyboard focus, reduced motion, no-overflow, 44 px targets, PWA
  offline reload/update handling, request privacy, response headers, caching,
  and zero serious/critical axe findings all passed.
- The cold first screen gives the product, audience, and first action in plain
  words; its one-click sample opens a six-cue isolated demo.

See `.factory/verification-7.md` for complete evidence, hashes, and the
severity table.

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

None. This is a static, local-first PWA with no account, payment, runtime
backend, or server-side endpoint.
