# Dialog Only Switch — adversarial review 1 handoff

## Outcome

Review work order `dialog-only-switch-review-1` completed against candidate
`0facc1c583ab5dc174180d73de01a605167e79a9` and the live deployment on
2026-08-29 UTC. Verdict: **FAIL**.

The complete evidence and fixes are in `.factory/review-1.md`. There are four
blocking findings, two major findings, and twelve minor findings. No product
code was changed.

## Main blockers

1. `/demo` loads realistic, isolated sample data, but the working viewer starts
   below the first viewport behind a repeated landing hero.
2. “Editable captions/WebVTT” is promised in live copy and README, but only cue
   classification labels are editable; the broader claim is unlisted.
3. Desktop header Demo and Privacy links are covered by the intro decoration
   and cannot receive pointer clicks.
4. The earlier copy-audit repair is incomplete and stale despite claiming zero
   flags.

## Verification performed

- Opened the live root and demo in fresh 390 × 844 and 1440 × 900 contexts.
- Exercised sample load, cue correction, Reset demo, and a seeded real-session
  sentinel; demo writes stayed under `demo:current` and the real record was
  untouched.
- Recorded live requests for the sample and offline flow; all request origins
  were the product origin. Offline reload retained six cues, the sample video,
  and an active service worker.
- Ran every exact command in `.factory/claims.json`; all 14 passed.
- Ran `npm test` (16 unit/static passes, 40 browser passes, 8 intentional
  skips), `npm run typecheck`, and `npm run lint`; all passed.
- Ran `/opt/fleet/lib/verify-url.sh` against live `/` and `/demo`; both passed.
- Checked all public routes, metadata, internal/external links, response
  headers, 404 status, sitemap, robots, manifest MIME, reduced motion, target
  sizes, and route focus.
- Read `.factory/design.md`, `.factory/demo.md`, `.factory/claims.json`, every
  prior verification report, and the previous handoff. No earlier review or
  polish files existed.

## Files changed

- `.factory/review-1.md` — complete adversarial review, copy inventories,
  claims results, history recheck, and concrete fixes.
- `.factory/handoff.md` — this review handoff.

## Next step

Repair all findings in `.factory/review-1.md`, add regression tests for the
first demo viewport, real header clicks, claim-copy matching, route focus, and
all 44 px targets, then run a fresh full review. The current product build is
testable but does not meet the zero-finding acceptance standard.
