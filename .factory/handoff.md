# Dialog Only Switch — verification handoff

## Release status: FAIL

Independent work order `dialog-only-switch-verify-2` tested candidate
`f1d74847e8188f6293cb3639436de7f24f8df059` and the live deployment at
<https://dialog-only-switch.sociobot.in> on 2026-08-29 UTC.

**Do not release this candidate.** All six commands declared in
`.factory/claims.json` fail from a clean checkout because they start
`vite preview` without first creating ignored `dist/`. The 390×844 cold first
screen also hides the mandatory one-click sample action below the fold. These
are explicit release blockers even though the built app works.

The full evidence, defect severity, live hashes, screenshots, Lighthouse
reports, and remediation criteria are in
[`.factory/verification-2.md`](verification-2.md).

## What was verified

- Clean archive install and every exact claim command: **all six FAIL**.
- `npm run test:unit`, `typecheck`, `lint`, `build`, and full `npm test`: pass
  after the build exists (`npm test`: 12 unit/static passes, 15 browser
  passes, 5 intended skips).
- Live normal, boundary, invalid, and recovery journeys: pass.
- Same-origin request log, security headers, caching, 404, manifest, and
  local/live build identity: pass.
- Desktop/390 px, keyboard focus, reduced motion, axe, service-worker update,
  and offline reload: functionally pass, with 32 px transcript touch targets
  recorded as a P1 defect.
- Lighthouse mobile: 89/94/91 performance (median 91), 100 accessibility,
  100 best practices.

This static PWA has no backend, sign-in, payment, AI runtime, or server API;
rate-limit and Entra checks are not applicable.

## Reproduce the blocking claim result

From a fresh clone with no `dist/`:

```sh
npm ci
npm run test:e2e -- --grep @claim:isolated-demo
```

The desktop and mobile tests cannot find the `/demo` h1. The same failure
pattern occurs for every other command listed in `.factory/claims.json`.
Running `npm run build` first makes the functional tests pass, but that is not
part of the declared claim commands.

## Known gaps / next steps

1. Make every claim test command build or serve the candidate itself from a
   truly clean checkout.
2. Move “Try it with sample data” into the first 390 px viewport and include
   the required three short facts.
3. Register and test the unlisted README/UI claims.
4. Raise mobile action targets to at least 44 px and complete the required
   landing skeleton, copy audit, and per-route metadata.
5. Run a fresh independent verification before release.
