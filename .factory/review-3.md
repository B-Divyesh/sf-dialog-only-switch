# Adversarial first-read review 3 — Dialog Only Switch

**Work order:** `dialog-only-switch-review-3`  
**Reviewed commit:** `caea5ca45dfdce5fb4b0e05af92f1bf9c0d116f2`  
**Live site:** <https://dialog-only-switch.sociobot.in>  
**Reviewed:** 2026-08-29 UTC  
**Verdict:** **PASS**

There are no findings. This review used fresh Chromium contexts at 390 × 844
and 1440 × 900, the deployed site, and a clean dependency install in this
checkout. `.factory/brief.json` is absent; scope was therefore checked against
the product, README, claims contract, demo contract, design thesis, handoff,
and the complete prior review/polish history.

## Cold first read

Before scrolling, both fresh contexts made the purpose, audience, and first
action clear.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does it do? | It filters supplied captions so a viewer can focus on spoken dialogue. | “Focus on dialogue in your captions”. |
| For whom? | Language learners, caption readers, and classrooms. | The next sentence names all three. |
| What should I click first? | “Try it with sample data”. | Its adjacent result says it opens a harbor video and six labelled captions. |

The mobile action ends at 501.58 px; the desktop action ends at 625.17 px.
The three short facts are also visible in the initial mobile screen. No cold
load console or page error occurred.

## Copy audit

Word counts treat hyphenated terms, filenames, paths, and URLs as one word.
Every landing and README sentence is at or below 22 words. No sentence uses a
banned marketing adjective, unexplained jargon, inconsistent product term, or
a non-result-naming button. Headings name their sections; the first-screen
headline names the job in six words. Labels and actions such as “Try it with
sample data”, “Leave sample mode”, “Export corrected VTT”, “Limits and
privacy”, and “Save or transfer your caption session” were also checked and
need no rewrite.

### Landing and demo sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Try the harbor video without changing your session. | 8 | Pass |
| Free to use. | 3 | Pass |
| For language learners, caption readers, and classrooms who want spoken lines while keeping the original caption track. | 16 | Pass |
| Opens a harbor video and six labelled captions. | 8 | Pass |
| Choose a local video and its .vtt captions. | 8 | Pass |
| They never leave this browser. | 5 | Pass |
| Or drop both files into this page. | 7 | Pass |
| Choose a video and WebVTT caption file. | 8 | Pass |
| Your local viewer is ready. | 5 | Pass |
| Open a local video above. | 5 | Pass |
| You can review captions without one. | 6 | Pass |
| Load a WebVTT file to seek, review, and practice each timed line. | 12 | Pass |
| Your timed transcript will appear here. | 6 | Pass |
| WebVTT text and cue-label changes survive a refresh. | 8 | Pass |
| Video files are never saved. | 5 | Pass |
| Choose a local video and WebVTT captions from your device. | 10 | Pass |
| The viewer marks bracketed sounds and music as environmental cues. | 10 | Pass |
| Change any label that is wrong. | 6 | Pass |
| Switch views, seek a cue, practice a line, then export a WebVTT file. | 13 | Pass |
| Add WebVTT captions yourself. | 4 | Pass |
| The viewer does not transcribe video or retrieve captions from other services. | 12 | Pass |
| Caption files must be WebVTT and no larger than 5 MB. | 11 | Pass |
| The app does not contact other websites while you use it. | 10 | Pass |
| Video files stay in memory and are not saved. | 9 | Pass |
| Free caption controls for learners and classrooms. | 7 | Pass |
| Files stay in this browser. | 5 | Pass |
| An app update is ready. | 5 | Pass |
| This local caption viewer needs JavaScript to read your video and WebVTT files in the browser. | 15 | Pass |
| Page loaded: [heading]. | 3 | Pass |

Dynamic errors and status lines were also checked against
`.factory/copy-audit.md`. They are specific and actionable, including invalid
VTT, over-5-MB files, malformed JSON, offline use, and browser-storage
recovery.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Dialog Only Switch is a free, private viewer for language learners, caption readers, and classrooms. | 15 | Pass |
| It plays local video with supplied WebVTT captions. | 8 | Pass |
| The viewer can switch between all cues and “Dialogue only” without rewriting the source captions. | 15 | Pass |
| Live: [URL]. | 2 | Pass |
| Try the bundled sample at [URL]. | 6 | Pass |
| It opens a harbor video and six supplied WebVTT cues in an isolated demo session. | 15 | Pass |
| Opens local video and supplied .vtt files. | 7 | Pass |
| Labels bracketed sounds and music as environmental cues. | 8 | Pass |
| You can change each cue label. | 6 | Pass |
| Switches reversibly between “All cues” and “Dialogue only”. | 8 | Pass |
| Hold R (or the on-screen reveal control) to show hidden environmental cues temporarily. | 13 | Pass |
| Keeps a timed transcript beside the video. | 7 | Pass |
| Selecting a cue seeks to its line. | 7 | Pass |
| Replays one selected dialogue line and stops at its cue end. | 11 | Pass |
| Saves WebVTT text, filter choice, cue changes, and practice results in IndexedDB so they survive a refresh. | 17 | Pass |
| Keeps video files only in memory, so they must be selected after a refresh. | 14 | Pass |
| Exports Dialogue only and corrected WebVTT files. | 7 | Pass |
| It also transfers sessions as JSON. | 6 | Pass |
| The sample video and captions load offline after the first visit. | 10 | Pass |
| You do not need an account, and the viewer uploads nothing. | 11 | Pass |
| It never uploads video, captions, cue labels, or practice activity. | 10 | Pass |
| Limits caption files to 5 MB and gives a recovery message for larger files. | 14 | Pass |
| Uses supplied WebVTT captions. | 4 | Pass |
| It does not transcribe video or retrieve captions from other services. | 11 | Pass |
| Automatic cue labels are a starting point and may be wrong. | 11 | Pass |
| The original WebVTT source is retained separately and never rewritten. | 10 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Vite prints the local development URL. | 6 | Pass |
| Production preview: | 2 | Pass |
| Tests cover the production build, desktop, a 390 px phone, and accessibility. | 12 | Pass |
| They also reload the sample without a network connection. | 9 | Pass |
| The build command is: | 4 | Pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass |
| Product claims and their tests are listed in .factory/claims.json. | 9 | Pass |
| Each command builds the product before its browser test, so it also works from a clean checkout. | 17 | Pass |
| For example: | 2 | Pass |
| Video playback depends on codecs available in the browser. | 9 | Pass |
| The bundled sample uses WebM. | 5 | Pass |
| Caption files must use WebVTT and may be no larger than 5 MB. | 13 | Pass |
| The app runs in your browser. | 6 | Pass |
| The app does not contact other websites while you use it. | 10 | Pass |
| The demo uses demo:current in IndexedDB and never changes the normal current session key; see .factory/demo.md. | 16 | Pass |
| Deploy the contents of dist/ to a static HTTPS host. | 10 | Pass |
| The production policies are available at /privacy/ and /terms/. | 9 | Pass |
| Artwork sources and creation notes are in .factory/design.md. | 8 | Pass |
| Build and test notes are in .factory/handoff.md. | 7 | Pass |
| MIT — see LICENSE. | 3 | Pass |

## Demo and privacy sandbox

One click from the home CTA opened `/?demo=1`. Its initial mobile and desktop
screens show the persistent “Demo — sample data, nothing is saved” banner,
Reset demo, Leave sample mode, a loaded harbor video, three dialogue cues,
three environmental cues, and the caption mode control. It is product use,
not another sales screen. Reset restored the three/three summary and All cues.

The declared isolation test passed from the clean checkout. It verifies the
separate `demo:current` IndexedDB key and byte-stable real `current` record.
The deployed JS matches the tested local JS byte-for-byte. A fresh live request
log for home, demo, reset, filtering, and sample media contained only
same-origin bodyless `GET` requests and no console errors. A fresh controlled
service-worker context reloaded the demo offline with the six-cue summary,
visible video, and “Offline-ready” status.

## Claims

All 16 exact commands listed in `.factory/claims.json` passed independently
after `npm ci`:

| Claim IDs | Result |
| --- | --- |
| isolated-demo, drag-drop, reversible-filter, cue-classification | Pass |
| seekable-transcript, line-replay, refresh-persistence | Pass |
| local-only, no-uploads, video-not-saved | Pass |
| session-export-import, webvtt-export | Pass |
| caption-size-limit, supplied-captions-only, offline-reload, free-use | Pass |

The live landing and README claim-like sentences were mapped to these entries:
demo isolation to `isolated-demo`; opening local files to `drag-drop`; labels
to `cue-classification`; filtering and reveal to `reversible-filter`; seeking
and practice to `seekable-transcript` and `line-replay`; persistence to
`refresh-persistence`; exports to `session-export-import` and `webvtt-export`;
the 5 MB limit to `caption-size-limit`; supplied captions to
`supplied-captions-only`; local privacy/no uploads/video-memory behavior to
`local-only`, `no-uploads`, and `video-not-saved`; offline sample behavior to
`offline-reload`; and free/no-account behavior to `free-use`. No unlisted
visitor claim was found.

## Earlier findings rechecked

Every earlier review, polish report, and handoff was read. The deployed
application HTML, JS, and CSS match this checkout exactly, so each item was
checked in both live behavior and source.

| Earlier finding | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | The loaded demo workspace is in the first viewport at both sizes. | Fixed |
| F-1-2 | Visitor copy says supplied WebVTT and changeable cue labels, not editable captions. | Fixed |
| F-1-3 | Desktop primary-nav links accept ordinary pointer clicks. | Fixed |
| F-1-4 | The audited inventory, source hashes, dynamic strings, and all README sentences are present and tested. | Fixed |
| F-1-5 | Forward and Back focus the destination h1 and update the polite announcer. | Fixed |
| F-1-6 | Corrected and Dialogue only WebVTT exports download and parse. | Fixed |
| F-1-7 | Visible mobile controls, including skip navigation, meet the 44 px minimum. | Fixed |
| F-1-8 | The generic ready slogan is absent; file-selection copy gives the next step. | Fixed |
| F-1-9 | The session heading names saving and transfer. | Fixed |
| F-1-10 | The decorative “Before you begin” label is absent. | Fixed |
| F-1-11 | The demo-exit control is “Leave sample mode” and discards only demo data. | Fixed |
| F-1-12 | The update action is “Install update”. | Fixed |
| F-1-13 | UI and README consistently use Environmental and Dialogue only. | Fixed |
| F-1-14 | Visitor copy uses “hidden environmental cues”, not “suppressed”. | Fixed |
| F-1-15 | Visitor privacy copy explains browser-local behavior without “local-first”. | Fixed |
| F-1-16 | README test wording is short and plain. | Fixed |
| F-1-17 | README says “Product claims and their tests”. | Fixed |
| F-1-18 | README says “Artwork sources and creation notes”. | Fixed |
| F-2-1 | Unlisted “original harbor video” provenance wording is absent from visitor copy. | Fixed |
| F-2-2 | The README limits privacy wording to registered no-account/no-upload claims. | Fixed |
| F-2-3 | “Third-party runtime requests” was replaced with plain language. | Fixed |
| F-2-4 | Offline wording is bounded to the sample video and captions. | Fixed |

## Structure, accessibility, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and a missing
  route were checked live. The unknown route returns the designed 404 with HTTP
  404. Each route has the correct title, one h1, one main landmark, description,
  canonical, Open Graph/Twitter metadata, favicon, and Apple icon.
- The home title is “Dialog Only Switch — dialogue captions”; legal and demo
  titles follow their required route patterns. Header and footer navigation,
  deep links, back navigation, Privacy, Terms, robots, sitemap, manifest,
  social image, and the source link resolved successfully.
- Live Axe WCAG 2 A/AA scans reported zero violations on home, demo, Privacy,
  Terms, and 404. Keyboard route focus worked. No horizontal overflow or console
  error was observed at 390 px.
- The dark screening-room treatment is product-specific: the warm editorial
  caption typography, amber projection controls, film-perforation transcript,
  and original harbor sample are not a generic SaaS card-and-gradient template.

## Verification

| Check | Result |
| --- | --- |
| `npm ci` | Pass — 60 packages, 0 reported vulnerabilities |
| 16 exact claim commands | Pass |
| `npm test` | Pass — 20 unit/static and 52 browser checks; 10 documented project skips |
| `npm run build` | Pass — `dist/` produced |
| Live/local asset parity | Pass — HTML, JS, and CSS SHA-256 values match |
| Live offline reload, request log, route crawl, Axe | Pass |

## What would make this perfect

Keep this exact standard on future releases: rerun the complete claim contract
from a clean checkout, verify the deployed hashes before relying on local test
results, and repeat the cold mobile/desktop, reset, request-log, offline,
route, and accessibility checks after any copy or deployment change. No product
change is required for this review.
