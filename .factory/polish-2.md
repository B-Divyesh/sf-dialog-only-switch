# Perfection loop polish 2 — cumulative finding closure

**Work order:** `dialog-only-switch-polish-2`  
**Base reviewed:** `0aee6d92b9bb5c3c0874cf154e95848bd7d06f2b`  
**Repair commit:** `39f8a5ab7aeb66168916c5a9ebff8d4fb0ef0d80`  
**Deployment:** `e00f57c6-34eb-4dac-a8f5-fae4484ddef9`  
**Live URL:** <https://dialog-only-switch.sociobot.in>

All blocking, major, and minor findings in the cumulative review history are
closed. The live cold checks and screenshots are under
`.factory/qa-artifacts/polish-2/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The `?demo=1` and `/demo` routes start in the loaded sample workspace, with the banner, six cues, video, and switch before the optional loader. | `opens the working sample in the first viewport after one click`; live video y=402.2 at 390×844; `live-demo/screenshot-mobile.png`. |
| F-1-2 | Removed broad editable-caption promises. Copy says supplied WebVTT and cue labels. | `keeps claims precise and ships route-focus support`; copy audit; live body-copy scan. |
| F-1-3 | The header remains above the hero decoration and its links accept ordinary pointer clicks. | `allows real pointer clicks on every desktop header link`. |
| F-1-4 | Rebuilt the audit as a complete README and dynamic-copy inventory. New static checks require every audited README sentence, reviewed dynamic string, correct 15-word first sentence count, and current hashes. | `records every README sentence and reviewed dynamic string in the copy audit`; `records a complete landing-page copy audit...`. |
| F-1-5 | Route focus and polite announcement support remain on app and static routes. | `moves focus to the new h1 after forward and back route navigation`. |
| F-1-6 | Corrected and Dialogue only VTT exports remain available and parseable. | `@claim:webvtt-export`. |
| F-1-7 | Skip link and interactive mobile targets retain 44 px sizing. | `gives every mobile interactive control at least a 44px touch target`. |
| F-1-8 | Replaced the generic ready slogan with a concrete file-selection instruction. | Copy audit and stale-copy regression. |
| F-1-9 | Retained “Save or transfer your caption session” as the export/import heading. | Landing skeleton browser check. |
| F-1-10 | Removed the decorative “Before you begin” label. | `keeps claims precise and ships route-focus support`. |
| F-1-11 | Renamed the demo exit button to **Leave sample mode**. It still deletes only `demo:current`, returns to `/`, and restores any real session. | `@claim:isolated-demo`; fresh-clone claim command; live cold recheck. |
| F-1-12 | Kept the specific **Install update** label. | Service-worker update test and copy audit. |
| F-1-13 | Retained one vocabulary: Environmental, Mark as environmental, and Dialogue only. | `@claim:cue-classification`; terminology table. |
| F-1-14 | Retained plain “hidden environmental cues” language. | `@claim:reversible-filter`; stale-copy regression. |
| F-1-15 | Retained plain browser/privacy wording rather than “local-first”. | `@claim:local-only`; live request and axe checks. |
| F-1-16 | README test wording remains split into short plain sentences. | Complete README inventory and static audit check. |
| F-1-17 | README uses “Product claims and their tests”. | Complete README inventory. |
| F-1-18 | README uses “Artwork sources and creation notes”. | Complete README inventory. |
| F-2-1 | Removed “original harbor video” and the public footer provenance promise; provenance remains documented in `design.md`. | `keeps claims precise and ships route-focus support`; live forbidden-copy scan. |
| F-2-2 | Replaced bundled untested dependency/tracking language with tested statements: no account is needed and the viewer uploads nothing. | `@claim:free-use`, `@claim:no-uploads`; fresh-clone claim commands. |
| F-2-3 | Replaced developer jargon with “The app does not contact other websites while you use it.” on app, README, and privacy page. | `@claim:local-only`; live axe and copy scan. |
| F-2-4 | Bounded offline wording to the cached sample video and captions. The first-screen fact, README, and `offline-reload` claim now match. | `@claim:offline-reload`; fresh-clone command and live demo verification. |

## Complete verification

- `npm ci`, `npm test`, `npm run typecheck`, and `npm run build` passed.
- Each of the 16 exact claim commands was run independently from a clean clone
  of `39f8a5a`; all passed.
- Cold deployed root, demo, privacy, terms, and 404 checks passed. `verify-url`
  evidence is in `.factory/qa-artifacts/polish-2/`.
- Playwright axe scans at 390 px returned zero WCAG 2 A/AA violations on every
  public route. There were zero live console errors.

No finding remains unresolved.
