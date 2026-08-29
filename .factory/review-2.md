# Adversarial first-read review 2 — Dialog Only Switch

**Work order:** `dialog-only-switch-review-2`

**Reviewed candidate:** `6fd67d70fe8b29ebf654fe427d15f3f65052a25a`

**Live site:** <https://dialog-only-switch.sociobot.in>

**Reviewed:** 2026-08-29 UTC

**Verdict:** **FAIL**

There are six findings: two blocking, two major, and two minor. The live
product is clear on first read, its sample works in one click, all 16 declared
claim commands pass, and the core experience works privately and offline.
It still fails because two findings from review 1 have regressed or remain
half-fixed, and several README promises are either unlisted or too vague.

`.factory/brief.json` is absent. The review therefore used the live product,
README, `.factory/design.md`, the demo and claims contracts, and the complete
review/polish/handoff history as scope evidence.

## Cold first read

Fresh browser contexts were opened at 390 × 844 and 1440 × 900. Nothing was
scrolled before recording these answers.

| Question | Answer from the first screen | Evidence | Result |
| --- | --- | --- | --- |
| What does it do? | It filters a local video's supplied captions so I can focus on spoken dialogue. | “Focus on dialogue in your captions” and “Local video · supplied WebVTT · offline”. | Pass |
| For whom? | Language learners, caption readers, and classrooms. | The audience sentence names all three. | Pass |
| What should I click first? | “Try it with sample data”. | The adjacent result says it opens a harbor video and six labelled captions. | Pass |

On mobile, the sample action ended at 502 px and all three plain facts ended at
620 px. On desktop, they ended at 625 px and 659 px. Both fit the initial
viewport. No console error occurred on the cold landing page.

## Findings

### Blocking

#### F-1-4 — The claimed complete copy audit is still incomplete

- **Quote/location:** `.factory/copy-audit.md:3`: “This inventory covers every
  visitor-facing sentence in the app, parser errors, legal pages, 404 page, and
  README.” Its README section then says only “The longest are listed here”.
- **Evidence:** the README table omits 36 of the 47 README sentences. It counts
  “Dialog Only Switch is a free, private viewer for language learners, caption
  readers, and classrooms.” as 14 words; it has 15. It also omits possible app
  copy such as “Clear the saved caption session … from this browser?” and “The
  saved caption session could not be restored.” The static regression checks
  for a heading, 30 `Pass` cells, and matching source hashes; it does not prove
  that every sentence is present or correctly counted. The audit also marks
  “Start for real” as a passing action despite F-1-11.
- **Why this fails:** review 1 already made the incomplete audit blocking, and
  polish 1 claimed it was rebuilt. The current artifact remains a partial
  inventory with an inaccurate zero-flag conclusion. Under the history rule,
  a half-fixed earlier finding is blocking again with the same id.
- **Concrete fix:** generate the inventory from every rendered/static/dynamic
  string and every README sentence, calculate lexical word counts, and fail a
  test on missing or duplicate source strings. Resolve the flags in this
  review before restoring “Flagged sentences: 0”.

#### F-1-11 — “Start for real” regressed after being fixed

- **Quote/location:** live demo banner and `src/main.ts`: “Start for real”.
- **Evidence:** review 1 found that this button did not name its result. Polish
  1 records the repair as “Open an empty viewer”. The current live page, source,
  copy audit, tests, demo documentation, and handoff use “Start for real” again.
  A prior real session may now be restored, so the old replacement would also
  be inaccurate.
- **Why this fails:** “real” does not tell a first-time visitor whether the
  action saves the sample, opens an empty viewer, or returns to existing work.
  It violates the result-naming action rule and is a confirmed regression of
  an earlier finding.
- **Concrete fix:** rename it **“Leave sample mode”**. Keep the existing behavior:
  delete `demo:current`, return to `/`, and restore the separate real session if
  one exists. Update the demo, isolation, keyboard, copy-audit, and history
  regression checks to require the exact result-naming label.

### Major

#### F-2-1 — “Original harbor video” is an unlisted provenance claim

- **Quote/location:** README demo paragraph: “It opens an **original harbor
  video** and six supplied WebVTT cues in an isolated demo session.” The live
  footer similarly says “Artwork and sample media made for this product”.
- **Why this fails:** `.factory/claims.json` proves that a bundled video loads,
  not that it is original or was made for this product. The design document
  records provenance, but no claims entry or executable test covers the public
  promise. This is an unlisted claim.
- **Concrete fix:** remove the unnecessary provenance adjective from visitor
  copy: “It opens a harbor video and six supplied WebVTT cues in an isolated
  demo session.” Keep provenance in `.factory/design.md`, where it can be
  documented rather than presented as a runtime claim.

#### F-2-2 — The README bundles three unlisted privacy/dependency claims

- **Quote/location:** README, What it does: “There are no accounts, analytics,
  uploads, third-party scripts, or CDN fonts.”
- **Why this fails:** `free-use` covers the absence of an account/payment step,
  `no-uploads` covers uploads, and the request log covers third-party network
  traffic. No claim entry says there is no analytics code, no third-party
  script, or no CDN font; the same-origin request test would not detect
  first-party analytics. Three parts of the sentence are therefore unlisted.
- **Concrete fix:** either reduce the sentence to registered claims — “You do
  not need an account, and the viewer uploads nothing.” — or add a
  `no-tracking-or-external-assets` claim whose test scans built scripts for
  analytics/tracker code, checks script/font origins, and records the full
  runtime request log.

### Minor

#### F-2-3 — “Third-party runtime requests” is developer jargon

- **Quote/location:** landing Limits and privacy and README Privacy and
  deployment: “The app/viewer makes no third-party runtime requests.”
- **Why this fails:** a visitor should not need to interpret “runtime requests”
  to understand the privacy result.
- **Concrete rewrite:** “The app does not contact other websites while you use
  it.” Keep the existing `local-only` same-origin request test.

#### F-2-4 — “Complete” is vague and overstates two sample claims

- **Quote/location:** README: “Try the **complete** bundled sample…” and “The
  **complete** sample demo works offline after its first visit.”
- **Why this fails:** “complete” does not identify a capability. The offline
  test verifies that the six cues and video reload, but does not exercise every
  sample action after the network is disabled.
- **Concrete rewrite:** “Try the bundled sample…” and “The sample video and
  captions load offline after the first visit.” Change the `offline-reload`
  claim to the same bounded wording, or extend its offline phase through
  filtering, temporary reveal, practice, and export.

## Copy audit

Word counts treat hyphenated compounds, file paths, and URLs as one word and do
not count punctuation-only marks. No sentence exceeds 22 words and no banned
marketing word appears. The failures concern one vague action, jargon, vague
scope, unlisted claims, and the prior audit's completeness.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
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
| Caption text and cue-label changes survive a refresh. | 8 | Pass |
| Video files are never saved. | 5 | Pass |
| Choose a local video and WebVTT captions from your device. | 10 | Pass |
| The viewer marks bracketed sounds and music as environmental cues. | 10 | Pass |
| Change any label that is wrong. | 6 | Pass |
| Switch views, seek a cue, practice a line, then export a WebVTT file. | 13 | Pass |
| Add WebVTT captions yourself. | 4 | Pass |
| The viewer does not transcribe video or retrieve captions from other services. | 12 | Pass |
| Caption files must be WebVTT and no larger than 5 MB. | 11 | Pass |
| The app makes no third-party runtime requests. | 7 | F-2-3 |
| Video files stay in memory and are not saved. | 9 | Pass |
| Free caption controls for learners and classrooms. | 7 | Pass |
| Files stay in this browser. | 5 | Pass |

### Demo, status, error, and route sentences available from the landing app

Variables such as a filename, count, duration, time, line number, or cue type
count as one word.

| Sentence | Words | Result |
| --- | ---: | --- |
| Try the harbor video without changing your session. | 8 | Pass |
| Free to use. | 3 | Pass |
| Your changes work now, but browser storage could not save them. | 10 | Pass |
| Choose a time to seek. | 5 | Pass |
| Cue-label changes are reversible and never rewrite your VTT file. | 9 | Pass |
| Environmental cue hidden. | 3 | Pass |
| Hold R to reveal. | 4 | Pass |
| Practice line finished. | 3 | Pass |
| Replay it or mark it complete. | 6 | Pass |
| Selected the line at [time] for practice. | 7 | Pass |
| Loaded [count] timed cues from [file]. | 6 | Pass |
| One malformed section was skipped. | 5 | Pass |
| [count] malformed sections were skipped. | 5 | Pass |
| This file does not begin with WEBVTT. | 7 | Pass |
| Choose a valid .vtt caption file. | 6 | Pass |
| Skipped unrecognized content near line [number]. | 6 | Pass |
| Skipped an invalid cue near line [number]. | 7 | Pass |
| No usable timed cues were found. | 6 | Pass |
| Check that each cue has a start time, an end time, and text. | 13 | Pass |
| That caption file is over 5 MB. | 7 | Pass |
| Choose a smaller WebVTT file. | 5 | Pass |
| Choose a .vtt WebVTT caption file. | 6 | Pass |
| Choose a video file supported by your browser, such as MP4 or WebM. | 13 | Pass |
| Opening [file]. | 2 | Pass |
| The sample captions could not be opened. | 7 | Pass |
| Refresh and try again. | 4 | Pass |
| Demo ready: a short harbor video and six supplied WebVTT cues are loaded. | 13 | Pass |
| Demo restored. | 2 | Pass |
| Your sample cue changes are ready. | 6 | Pass |
| Something went wrong. | 3 | Pass |
| Try the file again. | 4 | Pass |
| Demo ready — [duration] long. | 5 | Pass |
| Try Dialogue only or hold R to reveal a hidden cue. | 10 | Pass |
| Video ready — [duration] long. | 5 | Pass |
| Add captions or press play. | 5 | Pass |
| This browser could not play that video. | 7 | Pass |
| Try an MP4 (H.264) or WebM file. | 7 | Pass |
| This cue begins at [time]. | 5 | Pass |
| Open a video to seek to it. | 7 | Pass |
| Marked the cue at [time] as [kind]. | 7 | Pass |
| Open a video before replaying this timed line. | 8 | Pass |
| Playback could not start. | 4 | Pass |
| Press play in the video, then try again. | 8 | Pass |
| Practice complete. | 2 | Pass |
| Your progress is saved on this device. | 7 | Pass |
| Session exported. | 2 | Pass |
| The original VTT text and your separate cue decisions are in the download. | 13 | Pass |
| Dialogue only WebVTT exported with [count] cues. | 7 | Pass |
| Corrected WebVTT exported with all [count] cues. | 7 | Pass |
| This is not a Dialog Only Switch session file. | 9 | Pass |
| This session file is not valid JSON. | 7 | Pass |
| Choose a session file exported by Dialog Only Switch. | 9 | Pass |
| Imported [file]. | 2 | Pass |
| Your video still needs to be selected locally. | 8 | Pass |
| Clear the saved caption session “[file]” and all cue corrections from this browser? | 13 | Pass |
| Your original file will not be changed. | 7 | Pass |
| Saved captions and cue corrections were cleared from this browser. | 10 | Pass |
| Demo reset. | 2 | Pass |
| The bundled video and captions are ready again. | 8 | Pass |
| No video or .vtt caption file was found in that drop. | 11 | Pass |
| You are offline. | 3 | Pass |
| The viewer and saved captions still work here. | 8 | Pass |
| Offline installation is unavailable in this browser, but local files still stay private. | 13 | Pass |
| Restored [file]. | 2 | Pass |
| Select the local video again to continue. | 7 | Pass |
| The saved caption session could not be restored. | 8 | Pass |
| Browser storage is unavailable. | 4 | Pass |
| Files still work for this tab. | 6 | Pass |
| An app update is ready. | 5 | Pass |
| This local caption viewer needs JavaScript to read your video and WebVTT files in the browser. | 15 | Pass |
| Page loaded: [heading]. | 3 | Pass |

### Headings, labels, facts, and actions

| Text | Words | Kind | Result |
| --- | ---: | --- | --- |
| Demo — sample data, nothing is saved | 6 | banner | Pass: required sandbox disclosure |
| Local video · supplied WebVTT · offline | 5 | first-screen label | Pass |
| Focus on dialogue in your captions | 6 | h1 | Pass |
| Filter this sample to spoken lines | 6 | demo h1 | Pass |
| Open your files | 3 | h2 | Pass |
| Your private viewer | 3 | h2 | Pass |
| Transcript | 1 | h2 | Pass |
| Save or transfer your caption session | 6 | h2 | Pass |
| How it works | 3 | h2 | Pass |
| Limits and privacy | 3 | h2 | Pass |
| Check cue labels | 3 | h3 | Pass |
| Focus and practice | 3 | h3 | Pass |
| Selected dialogue | 2 | h3 | Pass |
| Video and captions | 3 | label | Pass |
| Caption mix | 2 | label | Pass |
| Timed captions | 2 | label | Pass |
| Saved on this device | 4 | label | Pass |
| Three steps | 2 | label | Pass |
| Line practice | 2 | label | Pass |
| No captions loaded | 3 | empty state | Pass |
| No captions yet | 3 | empty state | Pass |
| Local only | 2 | badge | Pass |
| Demo sample | 2 | badge | Pass |
| All cues are visible | 4 | state | Pass |
| Environmental cues are hidden | 4 | state | Pass |
| Hidden environmental cues are visible | 5 | state | Pass |
| Online | 1 | state | Pass |
| Offline-ready | 1 | state | Pass |
| Try it with sample data | 5 | primary action | Pass |
| Free to use | 3 | fact | Pass |
| Files stay in your browser | 5 | fact | Pass |
| Works offline after the first visit | 6 | fact | Pass |
| Choose video | 2 | file action | Pass |
| Choose captions | 2 | file action | Pass |
| All cues | 2 | mode | Pass |
| Dialogue only | 2 | mode | Pass |
| Hold to reveal | 3 | action | Pass |
| Show hidden environmental cues temporarily | 5 | help | Pass |
| Mark as dialogue | 3 | action | Pass |
| Mark as environmental | 3 | action | Pass |
| Practice line | 2 | action | Pass |
| Replay line | 2 | action | Pass |
| Mark complete | 2 | action | Pass |
| Close line practice | 3 | action label | Pass |
| Export Dialogue only VTT | 4 | action | Pass |
| Export corrected VTT | 3 | action | Pass |
| Export session | 2 | action | Pass |
| Import session | 2 | action | Pass |
| Clear saved session | 3 | action | Pass |
| Reset demo | 2 | action | Pass |
| Start for real | 3 | action | **F-1-11** |
| Install app | 2 | action | Pass |
| Install update | 2 | action | Pass |
| Drop video + WebVTT | 3 | drop action | Pass |

### README — complete sentence inventory

`[URL]` and linked file paths count as one word.

| Sentence | Words | Result |
| --- | ---: | --- |
| Dialog Only Switch is a free, private viewer for language learners, caption readers, and classrooms. | 15 | Pass |
| It plays local video with supplied WebVTT captions. | 8 | Pass |
| The viewer can switch between all cues and “Dialogue only” without rewriting the source captions. | 15 | Pass |
| Live: [URL]. | 2 | Pass |
| Try the complete bundled sample at [URL]. | 7 | F-2-4 |
| It opens an original harbor video and six supplied WebVTT cues in an isolated demo session. | 16 | F-2-1 |
| Opens local video and supplied .vtt files. | 7 | Pass |
| Labels bracketed sounds and music as environmental cues. | 8 | Pass |
| You can change each cue label. | 6 | Pass |
| Switches reversibly between “All cues” and “Dialogue only”. | 8 | Pass |
| Hold R (or the on-screen reveal control) to show hidden environmental cues temporarily. | 13 | Pass |
| Keeps a timed transcript beside the video. | 7 | Pass |
| Selecting a cue seeks to its line. | 7 | Pass |
| Replays one selected dialogue line and stops at its cue end. | 11 | Pass |
| Saves caption text, filter choice, cue changes, and practice results in IndexedDB so they survive a refresh. | 17 | Pass |
| Keeps video files only in memory, so they must be selected after a refresh. | 14 | Pass |
| Exports Dialogue only and corrected WebVTT files. | 7 | Pass |
| It also transfers sessions as JSON. | 6 | Pass |
| The complete sample demo works offline after its first visit. | 10 | F-2-4 |
| There are no accounts, analytics, uploads, third-party scripts, or CDN fonts. | 11 | F-2-2 |
| It never uploads video, captions, cue labels, or practice activity. | 10 | Pass |
| Limits caption files to 5 MB and gives a recovery message for larger files. | 14 | Pass |
| Uses supplied WebVTT captions. | 4 | Pass |
| It does not transcribe video or retrieve captions from other services. | 11 | Pass |
| Automatic cue labels are a starting point and may be wrong. | 11 | Pass |
| The original WebVTT source is retained separately and never rewritten. | 10 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Vite prints the local development URL. | 6 | Pass |
| Production preview: | 2 | Command lead-in; pass |
| Tests cover the production build, desktop, a 390 px phone, and accessibility. | 12 | Pass |
| They also reload the sample without a network connection. | 9 | Pass |
| The build command is: | 4 | Command lead-in; pass |
| It writes the static site to dist/, with dist/index.html at its root. | 12 | Pass |
| Product claims and their tests are listed in .factory/claims.json. | 9 | Pass |
| Each command builds the product before its browser test, so it also works from a clean checkout. | 17 | Pass |
| For example: | 2 | Example lead-in; pass |
| Video playback depends on codecs available in the browser. | 9 | Pass |
| The bundled sample uses WebM. | 5 | Pass |
| Caption files must use WebVTT and may be no larger than 5 MB. | 13 | Pass |
| The app runs in your browser. | 6 | Pass |
| The viewer makes no third-party runtime requests. | 7 | F-2-3 |
| The demo uses demo:current in IndexedDB and never changes the normal current session key; see .factory/demo.md. | 16 | Pass |
| Deploy the contents of dist/ to a static HTTPS host. | 10 | Pass |
| The production policies are available at /privacy/ and /terms/. | 9 | Pass |
| Artwork sources and creation notes are in .factory/design.md. | 8 | Pass |
| Build and test notes are in .factory/handoff.md. | 7 | Pass |
| MIT — see LICENSE. | 3 | Pass |

README headings — “Dialog Only Switch”, “What it does”, “Run locally”, “Test
and build”, “Video and caption files”, “Privacy and deployment”, and “License”
— all name their sections and pass.

## Demo and sandbox

- One click from `/` opens `/?demo=1` with the working sample already visible.
- At 390 × 844, the video occupies y=402–604 and the caption mode occupies
  y=618–808. At 1440 × 900, the video occupies y=286–789 and the mode starts at
  y=803. The optional loader is below the initial viewport.
- The persistent demo banner is visible. Six realistic cues load: three
  dialogue and three environmental.
- A seeded `current` record named `REAL-SENTINEL.vtt` remained byte-stable
  while the demo wrote `demo:current`, after changing mode, and after Reset.
- Reset restored All cues and the original 3/3 classification.
- The exercised flow made 16 requests, all same-origin GETs with no body, and
  logged no console or page errors.
- After service-worker readiness, `/demo` reloaded offline with six cues, a
  visible video, the demo h1, and `Offline-ready`.

The demo behavior passes. The banner's exit action remains blocking under
F-1-11.

## Claims audit

Every exact `test` command in `.factory/claims.json` was run independently from
this clean checkout. Each command rebuilt the product before Playwright.

| Claim id | Result | Browser evidence |
| --- | --- | --- |
| `isolated-demo` | Pass | 2 passed |
| `drag-drop` | Pass | 2 passed |
| `reversible-filter` | Pass | 2 passed |
| `cue-classification` | Pass | 2 passed |
| `seekable-transcript` | Pass | 2 passed |
| `line-replay` | Pass | 2 passed |
| `refresh-persistence` | Pass | 2 passed |
| `local-only` | Pass | 2 passed |
| `no-uploads` | Pass | 2 passed |
| `video-not-saved` | Pass | desktop passed; documented mobile skip |
| `session-export-import` | Pass | 2 passed |
| `webvtt-export` | Pass | 2 passed |
| `caption-size-limit` | Pass | 2 passed |
| `supplied-captions-only` | Pass | 2 passed |
| `offline-reload` | Pass | desktop passed; documented mobile skip |
| `free-use` | Pass | 2 passed |

No declared command failed. F-2-1 and F-2-2 are unlisted claims; F-2-4 makes
the offline wording broader than its direct assertions.

## Earlier findings rechecked from scratch

The full `.factory/review-1.md`, `.factory/polish-1.md`, and
`.factory/handoff.md` were read. The live build is byte-identical to the local
production build for HTML, JavaScript, and CSS, so both live behavior and
source were checked for every earlier item.

| Earlier id | Live and code result | Status |
| --- | --- | --- |
| F-1-1 | One-click demo puts loaded video and mode controls in the first viewport at both widths. | Fixed |
| F-1-2 | “Editable captions/WebVTT/timed transcript” is absent; only cue labels are changeable. | Fixed |
| F-1-3 | Demo, Privacy, and Terms accept real pointer clicks on desktop. | Fixed |
| F-1-4 | Audit still omits sentences, miscounts copy, and approves a known bad action. | **Half-fixed; blocking** |
| F-1-5 | Forward and Back focus the new h1 and update the polite route announcer. | Fixed |
| F-1-6 | Corrected and Dialogue only WebVTT exports download and parse. | Fixed |
| F-1-7 | Mobile interactive targets, including the skip link, are at least 44 px. | Fixed |
| F-1-8 | “Ready when you are” is absent; the status names the files to choose. | Fixed |
| F-1-9 | Heading is “Save or transfer your caption session”. | Fixed |
| F-1-10 | “Before you begin” is absent. | Fixed |
| F-1-11 | “Start for real” returned after polish 1 replaced it. | **Regressed; blocking** |
| F-1-12 | Update action is “Install update”. | Fixed |
| F-1-13 | Visitor copy consistently uses Environmental and Dialogue only. | Fixed |
| F-1-14 | Visitor copy says hidden environmental cues; “suppressed” remains only in internal identifiers/tests. | Fixed |
| F-1-15 | Visitor copy explains browser-local behavior without “local-first”. | Fixed |
| F-1-16 | The former 23-word README sentence is split and plain. | Fixed |
| F-1-17 | README says “Product claims and their tests”. | Fixed |
| F-1-18 | README says “Artwork sources and creation notes”. | Fixed |

## Structure, routing, accessibility, and visual identity

| Check | Result |
| --- | --- |
| Titles | Pass: `Dialog Only Switch — dialogue captions`, `Demo — Dialog Only Switch`, `Privacy — Dialog Only Switch`, `Terms — Dialog Only Switch`, and `Page not found — Dialog Only Switch`; all are under 60 characters. |
| Headings and landmarks | Pass: exactly one h1 and one main on `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and an unknown route. Heading order and header/footer landmarks pass Axe. |
| Metadata | Pass: descriptions, canonicals, OG/Twitter metadata, SVG favicon, Apple icon, theme color, and the 1200 × 630 social image are present. |
| 404 | Pass: an unknown URL returns HTTP 404 with the designed page and routes back to the viewer and demo. `/404.html` itself returns 200. |
| Deep links and history | Pass: `/demo`, legal deep links, reload, browser Back, h1 focus, and the polite route announcement work. |
| Link crawl | Pass: all internal destinations, GitHub source, sociobot.in, robots, sitemap, and social image return 200. |
| Header/footer | Pass: consistent wordmark/navigation and legal links; footer includes the one-line purpose, Privacy, Terms, factory credit, and build id. |
| Console | Pass on normal routes and exercised flows. Chromium reports the expected main-document 404 when deliberately opening an unknown URL; no subresource or script error occurs. |
| Accessibility | Pass: zero Axe violations on all public routes and the loaded demo, keyboard operation, visible route focus, 44 px mobile targets, reduced-motion rules, and no 390 px overflow. |
| Visual identity | Pass: the charcoal screening-room palette, warm editorial captions, film-strip transcript, amber/teal controls, and original coastal sample presentation are recognizably product-specific rather than a generic SaaS template. |
| Performance/build | Pass: 29.53 KB JavaScript (10.18 KB gzip) and 21.52 KB CSS (5.36 KB gzip). The live core files match the local build byte-for-byte. |

## Missed leverage

No finding. The product already imports/exports JSON, exports corrected and
Dialogue only WebVTT, supports drag-and-drop, saves locally, and works offline.
Cloud sync would weaken the stated local workflow. AI is not needed for this
deterministic label-and-filter job and would add privacy/cost complexity without
an obvious user benefit.

## Verification summary

- All 16 exact claim commands: pass.
- `npm test`: 19 unit/static tests and 52 browser tests pass; 10 documented
  duplicate-project skips.
- Live Axe: zero violations across the app, demo, legal pages, and 404.
- Live request log: same-origin GET only, no bodies.
- Live offline reload: pass.
- Link/status/metadata crawl: pass.
- Live/local hashes: HTML, JavaScript, and CSS match.

## What would make this perfect

There must be nothing left. Rename the regressed demo exit action to “Leave
sample mode”; replace the self-attesting partial copy audit with a genuinely
complete generated inventory; remove the untestable “original” claim; either
register and test the analytics/script/font promise or narrow it; replace
“runtime requests” with plain language; and remove or bound “complete”. Then
rerun every claim command, the full suite, the live one-click demo, isolated
storage/reset, request log, offline reload, route crawl, Axe, and the cold
390 px/desktop read from fresh contexts. A passing next round has zero findings
and no unlisted or weakly tested claim.
