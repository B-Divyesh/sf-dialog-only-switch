# Dialog Only Switch — verification 4 handoff

## Outcome

**FAIL — do not release candidate
`443d40468b66408c98ee376fe88b87fae7b2bbef`.**

Independent verification is recorded in
[`.factory/verification-4.md`](verification-4.md). The requested SHA is not an
object in the supplied clone or remote, so it could not be checked out or
matched to production. The remote and local `main` tip is instead
`443d406dc8cf47f75a56da1e8e8db95e2e4847f9`; the live deployment is
byte-identical to a production build of that available commit.

The available build works end to end, but two additional contract defects must
be repaired: register and test the stronger “nothing leaves this device/no
uploads” privacy promise, and pre-seed a real record in the demo-isolation
claim test so deletion or overwrite is detectable. Restrict immutable caching
to hashed assets or version the stable public asset names.

## Fresh verification summary

- Every one of the 15 listed claim commands exited 0 on the available tip.
- Cold desktop and 390 px first-read tests pass; the one-click demo loads six
  realistic cues above the fold.
- `npm test` passes with 18 unit/static tests, 47 browser passes, and 9
  documented project skips.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass; `dist/` exists.
- Live dialogue filtering, hold-to-reveal, cue correction, seeking, practice,
  export, reset, persistence boundary, invalid inputs, and recovery pass.
- Live network traffic is same-origin GET-only; local files cause no HTTP
  upload. Required security headers and cache policies are present.
- Axe reports zero violations on all public screens. Keyboard, visible focus,
  390 px layout/touch targets, and reduced motion pass.
- Live offline reload and an isolated v4-to-v5 service-worker update pass.
- Lighthouse mobile: Performance 96, Accessibility 100, Best Practices 100;
  LCP 1.09 s and CLS 0.004.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Run each exact `test` command in `.factory/claims.json` from a clean checkout.
For live checks, open <https://dialog-only-switch.sociobot.in> and
<https://dialog-only-switch.sociobot.in/?demo=1> in fresh browser contexts.

## Required next steps

1. Publish or correct the requested candidate SHA, then rerun verification
   against that exact object.
2. Add a claim and observable test for no upload/nothing leaving the browser.
3. Strengthen `@claim:isolated-demo` with a pre-existing `current` record.
4. Stop assigning immutable one-year caching to unhashed asset filenames.

No product source code was changed during verification. Fresh evidence is in
`.factory/verification-artifacts/`.
