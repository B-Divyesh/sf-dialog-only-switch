# Independent verification — FAIL

**Work order:** `dialog-only-switch-verify-1`  
**Candidate commit:** `15ddf0ddd08b126031cbfa9383612c5ec2b92683`  
**Live URL tested:** <https://dialog-only-switch.sociobot.in/>  
**Date:** 2026-08-28 UTC  
**Verdict:** **FAIL — do not release.**

The deployed JavaScript, CSS, and service worker are byte-for-byte identical
to the production build of the candidate, so the findings apply to both the
candidate and the live deployment.

## Mandatory claims and demo gate

**FAIL (release-blocking):** `.factory/claims.json` is absent from the clean
checkout. Therefore there are no declared claims, no required
`@claim:<id>` tests, and no claim tests that can be run through a demo entry
point. The required first action was consequently impossible to perform.

**FAIL (release-blocking):** the one-click isolated demo required for every
product is not implemented.

- The live first screen offers **“Try sample captions”**, not “Try it with
  sample data.” It loads only four hard-coded captions, not a realistic
  local-video-plus-WebVTT sample that demonstrates the central job.
- `https://dialog-only-switch.sociobot.in/demo` returns the ordinary landing
  page with `0 cues`; it does not enter demo mode. No `?demo=1` behavior was
  found either.
- There is no persistent “Demo — sample data, nothing is saved” banner, no
  Reset demo control, and no Start for real control.
- After the sample button is used, the app writes to IndexedDB database
  `dialog-only-switch`, store `sessions`, key `current`—the same real-session
  namespace in `src/storage.ts`; no `demo:` namespace exists.
- `.factory/demo.md` is absent.

### Cold first-read test

Observed without prior state at the live URL:

> “Hear the line. Lower the noise.”  
> “Watch a video you own with a reversible dialogue-only caption track.”

It communicates roughly what the viewer does, but the first screen does not
say who it is for in plain words (language learners, caption readers, or
classrooms appear only later in the footer). The apparent first step is to
choose two local files; the secondary “Try sample captions” action is neither
the required sample-data wording nor a complete one-click product demo. This
fails the explicit first-read acceptance gate.

## Test evidence

All commands below ran from the supplied clean checkout at the stated commit.

| Check | Result | Evidence |
| --- | --- | --- |
| Required `.factory/claims.json` tests | **FAIL** | Manifest missing; no tests can be enumerated or run. |
| `npm ci` | PASS | 60 packages installed; `npm audit` reported 0 vulnerabilities. |
| `npm test` | PASS | 9 Vitest tests; build; 7 Playwright passes, 5 intentional project skips. |
| `npm run test:unit` | PASS | 9/9 Vitest tests. |
| `npm run test:e2e` | PASS | 7 passes, 5 intentional project skips (desktop/mobile suite). |
| `npm run build` | PASS | `tsc --noEmit` and Vite build complete; `dist/` produced. |
| Live core flow | PASS | Sample has 4 cues; dialogue mode suppresses environmental cues; hold `R` reveals them; practice flow works. |
| Invalid/recovery paths | PASS | Missing `WEBVTT`, >5 MB file, malformed section, and malformed JSON produce recoverable status messages; no page errors. |
| Desktop + 390 px mobile | PASS | No horizontal overflow (1440/1440 and 393/393 CSS px); no console or page errors. |
| Keyboard | PASS (smoke) | Skip link, file controls, sample control, caption radio, import, and footer links are tabbable; every focused control had a solid visible focus outline. |
| Axe live scan | PASS | No serious or critical violations after sample load on desktop or Pixel-5/390px profile. |
| Privacy/outbound requests | PASS for normal demo-like flow | Fresh live flow made only same-origin requests; no analytics/auth/API request observed. |
| PWA offline reload | PASS | After first live visit and service-worker readiness, reload while offline rendered the h1 and “Offline-ready.” |
| Deployment identity | PASS | SHA-256 exact matches: JS `97e635…e942`, CSS `e8db4c…d18a`, SW `c8d542…3ee1`. |

This is a static PWA with no server-side product API or sign-in endpoint;
rate-limit and Entra-tenant checks are therefore not applicable.

## Live response-policy evidence

`GET /` returned HTTP 200 with HSTS, `Referrer-Policy:
strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`.
It did **not** return a Content-Security-Policy. Hashed JS and CSS also have
only `Cache-Control: public, must-revalidate, max-age=30`, rather than
long-lived immutable asset caching. `/robots.txt` and `/sitemap.xml` return
404; an arbitrary route falls back to the landing app rather than a designed
404 page. `manifest.webmanifest` is served as `application/octet-stream`.

## Defects

### P0 — release blockers

1. **Missing required claims contract and executable claim tests.**
   `.factory/claims.json` does not exist. The landing page, README, privacy
   page, and UI make testable claims such as offline operation, no uploads,
   local-only data, editable/reversible filtering, export/import, and no
   third-party runtime requests, but none are registered and tested through
   the mandated demo entry point.
2. **No compliant isolated one-click demo.**
   There is no `/demo`/`?demo=1` demo state, complete video+caption sample,
   demo banner, reset/start-real actions, or demo storage namespace. The
   sample button writes into normal IndexedDB and cannot exercise the core
   local-video workflow in one click.
3. **First-read contract failure.**
   The first screen does not plainly name the intended people and does not
   provide the required one-click “Try it with sample data” demonstration.

### P1 — required release quality gaps

4. **Missing CSP on the live deployment.** The deployment response lacks a
   Content-Security-Policy despite the required security-header contract.
5. **Asset cache policy misses the PWA performance/caching requirement.**
   Hashed static assets are revalidated every 30 seconds instead of being
   long-lived immutable resources.
6. **Missing demo documentation.** `.factory/demo.md` is not shipped, so the
   entry URL, sample, reset behavior, and storage isolation are undocumented.

### P2 — structure/metadata gaps

7. **Required site-discovery and not-found artifacts are absent.**
   `/robots.txt` and `/sitemap.xml` return 404, and there is no product-styled
   404 route; unknown paths return the landing app.
8. **Manifest MIME type is incorrect.** `/manifest.webmanifest` returns
   `application/octet-stream`, not a web-manifest MIME type.

## Positive notes

The core implementation is otherwise solid in the exercised paths: local
files are processed in-browser, the original VTT text is retained separately,
mode changes are reversible, errors are legible, offline shell reload works,
and the live build matches the exact candidate. These results do not override
the mandatory claims, first-read, and demo failures.

## Required remediation before re-verification

1. Add `.factory/claims.json`, enumerate every visitor-facing claim, and add
   one observable `@claim:<id>` test per claim that starts at `/demo` or
   `?demo=1` from a fresh context.
2. Implement a direct, one-click, local-video-plus-WebVTT demo in a distinct
   `demo:` storage namespace, with the mandated persistent banner, Reset demo
   and Start for real controls; add `.factory/demo.md`.
3. Rewrite the first screen to name language learners/caption readers and
   present “Try it with sample data” with an accurate outcome description.
4. Configure CSP, immutable caching for hashed assets, correct manifest MIME,
   robots/sitemap, and a real 404 page; then rerun all checks above.
