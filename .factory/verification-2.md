# Independent verification 2 — FAIL

**Work order:** `dialog-only-switch-verify-2`

**Candidate commit:** `f1d74847e8188f6293cb3639436de7f24f8df059`

**Live URL:** <https://dialog-only-switch.sociobot.in>

**Verified:** 2026-08-29 UTC

**Verdict:** **FAIL — do not release.**

The deployed app is byte-for-byte identical to the candidate production
build and its main viewer works. The candidate nevertheless fails two
explicit, automatic release gates: every command declared in
`.factory/claims.json` fails from a clean checkout, and the one-click sample
action is below the first 390 px mobile screen.

## Mandatory first actions

### Claims gate — FAIL

I created a clean archive checkout of the candidate, confirmed `dist/` was
absent, ran `npm ci`, and then ran every `test` value from
`.factory/claims.json` exactly as written. All six commands exited 1:

| Claim | Clean-clone result | Immediate failure |
| --- | --- | --- |
| `isolated-demo` | **FAIL** | 2 failed; `/demo` had no h1/product UI |
| `reversible-filter` | **FAIL** | 2 failed; `6 cues` absent |
| `local-only` | **FAIL** | 2 failed; `6 cues` absent |
| `video-not-saved` | **FAIL** | 1 failed, 1 intended skip; `6 cues` absent |
| `session-export-import` | **FAIL** | 2 failed; `6 cues` absent |
| `offline-reload` | **FAIL** | 1 failed, 1 intended skip; `6 cues` absent |

Root cause: each declared command invokes `playwright test`; Playwright starts
`vite preview`, but neither the command nor its web-server configuration
builds the ignored `dist/` directory. The commands therefore cannot exercise
the product from a fresh clone. This is release-blocking under the claims
contract regardless of later passes.

For diagnosis, I built the candidate and reran the same six commands. They all
then passed (2, 2, 2, 1+1 skip, 2, and 1+1 skip respectively). This proves the
functional claims work in the built artifact but does not repair the declared
clean-clone tests.

### Cold first-read gate — FAIL

What the page says it does: focus local-video captions on spoken dialogue
without losing the original caption track.

Who it names: language learners, caption readers, and classrooms.

What it says to click first: the first visible actions are **Choose video**
and **Choose captions**. At 390×844, **Try it with sample data** is below the
viewport and requires scrolling; the first screen ends at the captions file
picker. At 1440×900 the sample link starts around y=820, at the very bottom.
The mandatory one-click sample action is therefore not present on the first
mobile screen. The screen also does not present the required three short
privacy/offline/price facts.

Evidence:

- `.factory/qa-artifacts/live-cold-mobile-390.png`
- `.factory/qa-artifacts/live-cold-desktop.png`

## Local quality gates

All commands below ran at the candidate commit after `npm ci`:

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 60 packages, 0 vulnerabilities |
| `npm run test:unit` | PASS; 12/12 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (the script aliases `tsc --noEmit`) |
| `npm run build` | PASS; `dist/` produced |
| `npm test` | PASS; 12 unit/static tests, exact build, 15 browser passes and 5 intentional project skips |

Production output is 24.85 KB JavaScript (8.90 KB gzip) and 18.45 KB CSS
(4.80 KB gzip), within the 200 KB/50 KB budgets. There are no shipped font
files. The largest hero source is 33.47 KB; the bundled demo WebM is 208.35
KB.

## Live end-to-end evidence

The following passed on the public deployment in fresh browser contexts:

- `/demo` loaded the original 12-second WebM and six WebVTT cues with the
  persistent demo banner. It wrote `demo:current` and did not create `current`.
- Dialogue-only mode hid three environmental cues; holding `R` revealed them.
- Manual cue correction, practice completion, JSON export, reset, and
  start-for-real worked. Export retained the original VTT and separate
  overrides.
- Invalid extension, over-5-MB captions, non-WebVTT, non-video input, and an
  invalid session import each produced a specific recovery message. A valid
  VTT loaded after those errors and reported one skipped malformed section.
- The complete exercised demo made eight requests, all to
  `https://dialog-only-switch.sociobot.in`; there were no console or page
  errors.
- Desktop and 390 px layouts had no horizontal overflow. Keyboard traversal
  reached the skip link, header links, demo controls, file inputs, sample
  link, player, filter, and transcript actions with a 3 px visible focus ring.
- Reduced-motion emulation matched and reduced transitions/animations to
  effectively instant states.
- Axe found zero serious or critical issues on `/`, `/demo`, `/privacy/`, and
  `/terms/` at desktop and 390 px.
- A two-revision local service-worker harness showed the update notice,
  refreshed to the new worker, then reloaded the six-cue demo offline with
  `Offline-ready` visible and no browser errors.
- `/opt/fleet/lib/verify-url.sh` passed live `/demo`: HTTP 200, correct title,
  `lang=en`, one h1, a main landmark, complete labels, and no browser errors.

Three fresh Lighthouse 12.8.2 mobile runs scored Performance **89, 94, 91**
(median **91**), Accessibility **100**, and Best Practices **100**. Median LCP
was 1.14 s and CLS was 0.002. Full reports are in
`.factory/qa-artifacts/lighthouse-live*.json`.

## Privacy, headers, caching, and deployment identity

The same-origin request log supports the local-only privacy promise for the
tested flow. There is no sign-in, runtime AI, analytics, backend, or product
API. Entra authority and server rate-limit checks are not applicable.

Live `/` and `/demo` return 200 with HSTS, CSP, `Referrer-Policy`,
`X-Content-Type-Options`, and `X-Frame-Options: DENY`. The CSP limits runtime
connections to self and sends `frame-ancestors` as a response header. Hashed
assets return `public, max-age=31536000, immutable`; the manifest has
`application/manifest+json`; robots and sitemap return 200; an unknown route
returns the designed 404 with status 404.

Local/live SHA-256 values match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `918075a18e1261a8661efa0baf6f66c97beb6f5188774531f4f43d74468addc0` |
| JavaScript | `345a8f9845459799a31656b022190cb3a7a1272da80c4abf2895e5a9597109d1` |
| CSS | `b1afab542593ccdbcc21c334d12d5a838a74db47c9bd7fb01c21f2753e174136` |
| `sw.js` | `5f3edd4adcadafa07b19d455f2b21225ab836f771847f6b36c1f512051891b84` |
| demo WebM | `0fb0bee1ff7dda02cf634035a9b1b80372a3ec495b2961f55c7d8c642f154881` |

## Defects by severity

### P0 — release blockers

1. **All declared claim commands fail from a clean clone.** They preview an
   absent `dist/` instead of building the demo entry point. Every claim is an
   automatic rejection under the supplied contract.
2. **The one-click sample action is not on the first 390×844 screen.** A cold
   mobile visitor sees two real-file pickers but must scroll to discover the
   required sandbox demo.
3. **Visitor-facing claims are missing from `.factory/claims.json`.** README
   and product copy additionally promise a synchronized seekable transcript,
   line replay, refresh persistence, automatic classification, a 5 MB input
   boundary, and evergreen Firefox/Safari support. These are not enumerated by
   claims entries with observable sandbox tests; only Chromium is configured.

### P1 — required quality gaps

4. **Mobile transcript actions miss the 44 px target baseline.** “Mark cue”
   and “Practice line” buttons measure 32 px high; the mobile brand link is 34
   px high. This contradicts the attached accessibility and design contracts.
5. **The required landing skeleton is incomplete.** The page moves from the
   live viewer/session controls directly to the footer. It has no three-step
   “How it works” section, no dedicated limits/privacy section, and no build
   identifier in the footer.
6. **`.factory/copy-audit.md` is incomplete.** It audits only four first-screen
   strings, not every sentence on the landing page as required.

### P2 — polish and metadata

7. **Route metadata is incomplete.** `/demo` retains the root canonical and
   root Open Graph metadata; privacy, terms, and 404 omit route canonical,
   Open Graph/Twitter metadata, and favicons.
8. **Axe reports one moderate landmark issue on the app routes.** The demo
   `<aside>` is nested where `landmark-complementary-is-top-level` expects a
   top-level complementary landmark. There are no serious/critical findings.

## Required re-verification

Make each claims command self-contained from a checkout with no `dist/`, put
the sample action inside the initial 390 px screen, enumerate and test all
visitor claims, then address the 44 px controls. Rerun this full verification;
the current candidate must not be released.
