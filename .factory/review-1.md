# Adversarial first-read review 1 — Dialog Only Switch

**Work order:** `dialog-only-switch-review-1`  
**Reviewed candidate:** `0facc1c583ab5dc174180d73de01a605167e79a9`  
**Live site:** <https://dialog-only-switch.sociobot.in>  
**Reviewed:** 2026-08-29 UTC  
**Verdict:** **FAIL**

There are 18 findings: four blocking, two major, and twelve minor. The product
works once reached, all declared claim commands pass, and the live build is
private/offline as tested. It still fails the required one-screen demo,
honesty, navigation, and prior-finding gates.

`.factory/brief.json` is absent, so the review used the shipped product,
README, `.factory/design.md`, claims contract, demo contract, prior
verification reports, and handoff as scope evidence.

## Cold first read

Fresh contexts were opened at 390 × 844 and 1440 × 900 before scrolling.

| Question | First-screen answer | Result |
| --- | --- | --- |
| What does it do? | It filters supplied video captions so spoken dialogue can be viewed separately from sound and music cues. | Pass: “Focus on dialogue in your captions.” |
| For whom? | Language learners, caption readers, and classrooms. | Pass: the audience is named directly in the next sentence. |
| What should I click first? | “Try it with sample data.” It says this opens a harbor video and six captions. | Pass: action bottom was 502 px on mobile and 625 px on desktop. |

The cold landing screen passes the three-question gate. The demo screen after
that click does not; see F-1-1.

## Findings

### Blocking

#### F-1-1 — The demo opens another landing screen, not the product in use

- **Quote/location:** `/demo`, immediately after “Try it with sample data”:
  “Demo — sample data, nothing is saved”, followed by the full repeated hero,
  “Focus on dialogue in your captions”, another “Try it with sample data”
  action, and the file loader.
- **Evidence:** the loaded viewer heading begins at y=1,413.6 on 390 × 844 and
  y=1,312.6 on 1440 × 900. The video begins at y=1,513.6 and y=1,395.0.
  None of the working sample UI appears in the first viewport.
- **Why this fails:** the demo contains realistic data, but a first-time
  visitor sees a duplicated sales/loader screen and must scroll well past one
  viewport to discover that anything loaded. This fails the explicit rule
  that the first screen after the click already show the product being used.
- **Concrete fix:** on `/demo`, keep the banner and replace or collapse the
  landing intro/file loader so “Your private viewer”, the playing sample, the
  3 dialogue / 3 environmental summary, and the caption switch begin in the
  first viewport. Remove the repeated sample CTA on the demo route. Add a
  390 × 844 and desktop assertion that the video or sample transcript is in
  the initial viewport after one click from `/`.

#### F-1-2 — “Editable captions” is an unlisted and misleading product claim

- **Quote/location:** landing eyebrow “LOCAL VIDEO · EDITABLE WEBVTT ·
  OFFLINE”; CTA result “Opens a harbor video and six editable captions”;
  demo metadata/status “six editable WebVTT cues”; empty state “Your editable
  timed transcript will appear here”; README “editable WebVTT captions”.
- **Evidence:** there is no text or timing editor (`textarea`, text input, or
  `contenteditable`) in the product. A visitor can change only a cue's
  dialogue/environmental label and practice state. `.factory/claims.json`
  lists editable **labels** and an editable JSON **session**, not editable
  caption text or timing.
- **Why this fails:** “editable captions” normally promises that caption text
  or timing can be changed. The demo and first screen promise more than the
  product provides, and the promise has no matching claim entry or test.
- **Concrete fix:** either implement caption text/timing editing with undo,
  persistence, export, and a tagged claim test, or replace every occurrence:
  “Local video · supplied WebVTT · offline”; “Opens a harbor video and six
  labelled captions”; “six supplied WebVTT cues”; “Your timed transcript will
  appear here”; and “caption session with editable cue labels”. Add a static
  cross-check that every occurrence of “editable” maps to the exact tested
  behavior. This also reopens the claims-completeness assurance in handoff
  item 3.

#### F-1-3 — Desktop header navigation is covered by the hero decoration

- **Quote/location:** visible header links “Demo” and “Privacy” on `/` at
  1440 × 900.
- **Evidence:** both links have visible 44 px boxes, but
  `document.elementFromPoint()` at each link center returns
  `<section class="intro">`. A normal Playwright click times out with “intro
  intercepts pointer events”. Direct requests to `/demo` and `/privacy/`
  return 200, so this is an interaction failure rather than a dead URL.
- **Why this fails:** the two primary desktop navigation links cannot be
  activated with a pointer. That is broken routing for a first-time visitor.
- **Concrete fix:** set `pointer-events: none` on `.intro::before` and
  `.intro::after`, or establish the header above those pseudo-elements with an
  explicit stacking context. Add real, non-forced pointer-click tests for
  every header link at desktop width.

#### F-1-4 — The earlier copy-audit finding is only half-fixed

- **Quote/location:** `.factory/copy-audit.md` says “complete sentence
  inventory” and “Flagged sentences: **0**.” It records “Try an MP4 or WebM
  file”, while the product says “Try an MP4 (H.264) or WebM file.”
- **Evidence:** the audit omits visitor-facing parser errors such as “This file
  does not begin with WEBVTT”, “No usable timed cues were found”, and “Check
  that each cue has a start time, an end time, and text.” It also misses the
  flags below: an over-22-word README sentence, vague slogans, jargon,
  inconsistent terms, and the misleading “editable” claim.
- **Why this fails:** handoff item 6 says the prior incomplete-copy-audit
  finding was repaired. The current artifact is stale and its zero-flag claim
  is not true, so the earlier finding is confirmed as half-fixed.
- **Concrete fix:** regenerate the audit from all rendered and dynamic source
  strings plus README text; resolve every flag; and replace the current
  self-attestation test with one that fails when visitor strings change
  without updating the audit. Re-run the prior finding as a release blocker.

### Major

#### F-1-5 — Route changes do not move or announce focus

- **Quote/location:** navigate from `/` to `/demo` with the sample link, then
  use Back.
- **Evidence:** `document.activeElement` is `BODY` after navigation and again
  after Back. It is not the new h1 or `main`; there is no route announcement.
  Deep links and Back otherwise load the correct URLs.
- **Why this matters:** keyboard and screen-reader users are not told that the
  route changed or where the new content begins.
- **Concrete fix:** preserve the real URLs, focus a `tabindex="-1"` h1 on
  in-site route changes, announce its text in a polite live region, and test
  focus after forward and back navigation.

#### F-1-6 — The useful edited result cannot be exported as WebVTT

- **Quote/location:** session tools offer only “Export session”, which
  downloads proprietary `.dialog-switch.json`; README says the source VTT is
  never rewritten.
- **Why this matters:** after correcting labels or choosing Dialogue only, a
  normal caption user will expect a usable caption file, not only an app
  backup. Exporting a new file does not require rewriting the source.
- **Concrete fix:** add “Export dialogue-only VTT” and “Export corrected VTT”.
  Preserve timing and untouched source text, make the filename explicit, and
  add claims/tests that parse the download and verify included/excluded cues.
  No AI feature is warranted for this deterministic local workflow.

### Minor

#### F-1-7 — The skip link is 43 px high

- **Quote/location:** “Skip to main content” on `/` and `/demo` at 390 px.
- **Evidence:** its rendered box is 224.2 × 43 px. All other measured visible
  interactive targets meet 44 px.
- **Concrete fix:** give `.skip-link` a `min-height: 44px` and align its text;
  extend the touch-target test to all interactive elements, including hidden-
  until-focused controls.

#### F-1-8 — “Ready when you are” is a reusable slogan, not an instruction

- **Quote/location:** landing status below the file loader: “Ready when you
  are.”
- **Why this fails:** it carries no product-specific information or next step.
- **Concrete rewrite:** “Choose a video and WebVTT caption file.”

#### F-1-9 — “Your session, your copy” is a mood heading

- **Quote/location:** landing h2 above export/import controls: “Your session,
  your copy”.
- **Why this fails:** out of context it does not name saving, importing, or
  exporting.
- **Concrete rewrite:** “Save or transfer your caption session”.

#### F-1-10 — “Before you begin” is a decorative label

- **Quote/location:** eyebrow above “Limits and privacy”: “BEFORE YOU BEGIN”.
- **Why this fails:** it could appear on any product and adds no information.
- **Concrete fix:** delete it; “Limits and privacy” already names the section.

#### F-1-11 — “Start for real” does not name its result

- **Quote/location:** demo-banner button “Start for real”.
- **Why this fails:** it does not say that the sample is discarded and an
  empty local viewer opens.
- **Concrete rewrite:** “Open an empty viewer”.

#### F-1-12 — “Refresh” does not name the update result

- **Quote/location:** update-toast button “Refresh”.
- **Why this fails:** the surrounding message says an update is ready, but the
  button itself is generic.
- **Concrete rewrite:** “Install update”.

#### F-1-13 — Cue type terminology changes inside the same control

- **Quote/location:** copy uses “environmental cue”, while the badge says
  “Environment”, its action says “Mark as environment”, and README says
  “dialogue-only view” instead of the UI mode “Dialogue only”.
- **Why this fails:** different terms appear to name the same classifications
  and mode.
- **Concrete rewrite:** use “Environmental”, “Mark as environmental”, and the
  exact mode name “Dialogue only” everywhere.

#### F-1-14 — “Suppressed cues” is unexplained jargon

- **Quote/location:** “Show suppressed cues temporarily”, “Suppressed cues are
  temporarily revealed”, and README “temporarily show suppressed cues”.
- **Why this fails:** the rest of the UI already calls these “environmental”
  and “hidden”; “suppressed” introduces an unnecessary third concept.
- **Concrete rewrite:** “Show hidden environmental cues temporarily” and
  “Hidden environmental cues are visible”.

#### F-1-15 — “Local-first” is insider terminology

- **Quote/location:** landing/footer “Free, local-first caption control for
  learners and classrooms”; README “All product logic is static and
  local-first.”
- **Why this fails:** a visitor should not have to know a software design term
  to understand the privacy benefit.
- **Concrete rewrites:** “Free caption controls for learners and classrooms.
  Files stay in this browser.” and “The app runs in your browser.”

#### F-1-16 — One README sentence exceeds 22 words and stacks test jargon

- **Quote/location:** README, Test and build: “The full gate runs unit tests,
  the production build, desktop and 390 px browser journeys, axe checks, and
  an explicit service-worker offline reload.” (23 words)
- **Why this fails:** it exceeds the hard cap and uses “gate”, “browser
  journeys”, “axe”, and “service-worker” without helping the reader.
- **Concrete rewrite:** “Tests cover the production build, desktop, a 390 px
  phone, and accessibility. They also reload the sample without a network
  connection.”

#### F-1-17 — “Executable visitor-facing claims” is README jargon

- **Quote/location:** “The executable visitor-facing claims are listed in
  `.factory/claims.json`.”
- **Concrete rewrite:** “Product claims and their tests are listed in
  `.factory/claims.json`.”

#### F-1-18 — “Generated-art provenance” is README jargon

- **Quote/location:** “The visual system and generated-art provenance are in
  `.factory/design.md`...”
- **Concrete rewrite:** “Artwork sources and creation notes are in
  `.factory/design.md`. Build and test notes are in `.factory/handoff.md`.”

## Copy audit

Word counts treat hyphenated compounds, filenames, and URLs as one word.
Headings and action labels are inventoried separately because many are not
sentences. `F-1-2` marks misleading “editable” wording even when its sentence
length passes.

### Landing and demo template — complete sentence inventory

| Sentence | Words | Result |
| --- | ---: | --- |
| Try the bundled harbor video and captions without changing your session. | 10 | Pass |
| For language learners, caption readers, and classrooms who want spoken lines without losing the original caption track. | 16 | Pass |
| Opens a harbor video and six editable captions. | 8 | F-1-2 |
| Choose a local video and its .vtt captions. | 8 | Pass |
| They never leave this browser. | 5 | Pass |
| Or drop both files into this page. | 7 | Pass |
| Ready when you are. | 4 | F-1-8 |
| Your local viewer is ready. | 5 | Pass |
| Open a local video above. | 5 | Pass |
| You can review captions without one. | 6 | Pass |
| Load a WebVTT file to seek, review, and practice each timed line. | 12 | Pass |
| Your editable timed transcript will appear here. | 7 | F-1-2 |
| Caption text and corrections survive a refresh. | 7 | Pass |
| Video files are never saved. | 5 | Pass |
| Choose a local video and WebVTT captions from your device. | 10 | Pass |
| The viewer marks bracketed sounds and music as environmental cues. | 10 | Pass |
| Change any label that is wrong. | 6 | Pass |
| Switch views, select a cue to seek, practice a line, then export the session. | 14 | Pass |
| Add WebVTT captions yourself. | 4 | Pass |
| The viewer does not transcribe video or retrieve captions from other services. | 12 | Pass |
| Caption files must be WebVTT and no larger than 5 MB. | 11 | Pass |
| The app makes no third-party runtime requests. | 7 | Pass |
| Video files stay in memory and are not saved. | 9 | Pass |
| Free, local-first caption control for learners and classrooms. | 8 | F-1-15 |
| An app update is ready. | 5 | Pass |

### Dynamic status and error sentence inventory

Bracketed values stand for a filename, count, time, duration, or cue type.

| Sentence | Words | Result |
| --- | ---: | --- |
| Your changes work now, but browser storage could not save them. | 10 | Pass |
| Choose a time to seek. | 5 | Pass |
| Classification changes are reversible and never rewrite your VTT file. | 10 | Pass |
| Practice line finished. | 3 | Pass |
| Replay it or mark it complete. | 6 | Pass |
| Selected the line at [time] for practice. | 7 | Pass |
| Loaded [count] timed cues from [file]. | 6 | Pass |
| One malformed section was skipped. | 5 | Pass |
| [count] malformed sections were skipped. | 5 | Pass |
| That caption file is over 5 MB. | 7 | Pass |
| Choose a smaller WebVTT file. | 5 | Pass |
| Choose a .vtt WebVTT caption file. | 6 | Pass |
| Choose a video file supported by your browser, such as MP4 or WebM. | 13 | Pass |
| Opening [file]. | 2 | Pass |
| The sample captions could not be opened. | 7 | Pass |
| Refresh and try again. | 4 | Pass |
| Demo ready: a short harbor video and six editable WebVTT cues are loaded. | 13 | F-1-2 |
| Demo restored. | 2 | Pass |
| Your sample cue changes are ready. | 6 | Pass |
| Something went wrong. | 3 | Pass |
| Try the file again. | 4 | Pass |
| Demo ready — [duration] long. | 4 | Pass |
| Try Dialogue only or hold R to reveal a hidden cue. | 10 | Pass |
| Video ready — [duration] long. | 4 | Pass |
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
| This is not a Dialog Only Switch session file. | 9 | Pass |
| Imported [file]. | 2 | Pass |
| Your video still needs to be selected locally. | 8 | Pass |
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
| This file does not begin with WEBVTT. | 7 | Pass |
| Choose a valid .vtt caption file. | 6 | Pass |
| Skipped unrecognized content near line [number]. | 6 | Pass |
| Skipped an invalid cue near line [number]. | 7 | Pass |
| No usable timed cues were found. | 6 | Pass |
| Check that each cue has a start time, an end time, and text. | 13 | Pass |

### Landing headings, labels, and actions

| Text | Words | Kind | Result |
| --- | ---: | --- | --- |
| Demo — sample data, nothing is saved | 6 | Banner | Pass |
| Local video · editable WebVTT · offline | 5 | Label | F-1-2 |
| Focus on dialogue in your captions | 6 | h1 | Pass |
| Free to use | 3 | Fact | Pass |
| Files stay in your browser | 5 | Fact | Pass |
| Works offline after the first visit | 6 | Fact | Pass |
| Open your files | 3 | h2 | Pass |
| MP4, WebM, or browser-supported video | 5 | File help | Pass |
| WebVTT up to 5 MB | 5 | File help | Pass |
| Video and captions | 3 | Label | Pass |
| Your private viewer | 3 | h2 | Pass |
| No captions loaded | 3 | State | Pass |
| Local only | 2 | Badge | Pass |
| Demo sample | 2 | Badge | Pass |
| Caption mix | 2 | Label | Pass |
| All cues are visible | 4 | State | Pass |
| Environmental cues are suppressed | 4 | State | F-1-14 |
| Suppressed cues are temporarily revealed | 5 | State | F-1-14 |
| Timed captions | 2 | Label | Pass |
| Transcript | 1 | h2 | Pass |
| No captions yet | 3 | Empty heading | Pass |
| Saved on this device | 4 | Label | Pass |
| Your session, your copy | 4 | h2 | F-1-9 |
| Three steps | 2 | Label | Pass |
| How it works | 3 | h2 | Pass |
| Check cue labels | 3 | h3 | Pass |
| Focus and practice | 3 | h3 | Pass |
| Before you begin | 3 | Label | F-1-10 |
| Limits and privacy | 3 | h2 | Pass |
| Selected dialogue | 2 | h3 | Pass |
| Try it with sample data | 5 | Link/action | Pass |
| Choose video | 2 | File action | Pass |
| Choose captions | 2 | File action | Pass |
| All cues | 2 | Radio action | Pass |
| Dialogue only | 2 | Radio action | Pass |
| Hold to reveal | 3 | Button | F-1-14 |
| Show suppressed cues temporarily | 4 | Button help | F-1-14 |
| Export session | 2 | Button | Pass |
| Import session | 2 | File action | Pass |
| Clear saved session | 3 | Button | Pass |
| Mark as environment | 3 | Button | F-1-13 |
| Mark as dialogue | 3 | Button | Pass |
| Environment | 1 | Badge | F-1-13 |
| Practice line | 2 | Button | Pass |
| Replay line | 2 | Button | Pass |
| Mark complete | 2 | Button | Pass |
| Reset demo | 2 | Button | Pass |
| Start for real | 3 | Button | F-1-11 |
| Install app | 2 | Button | Pass |
| Refresh | 1 | Button | F-1-12 |

### README — complete sentence inventory

URLs and link labels count as one word. Headings are shown separately after
the sentences.

| Sentence | Words | Result |
| --- | ---: | --- |
| Dialog Only Switch is a free, private viewer for language learners, caption readers, and classrooms. | 15 | Pass |
| It plays local video with supplied WebVTT captions. | 8 | Pass |
| The viewer can switch between all cues and a dialogue-only view without rewriting the source captions. | 16 | F-1-13: use “Dialogue only” |
| Live: [URL]. | 2 | Pass |
| Try the complete bundled sample at [URL]. | 7 | Pass |
| It opens an original harbor video and editable WebVTT captions in an isolated demo session. | 15 | F-1-2 |
| Opens local video and supplied .vtt files. | 7 | Pass |
| Labels bracketed sounds and music as environmental cues. | 8 | Pass |
| Every label remains editable. | 4 | Pass |
| Switches reversibly between “All cues” and “Dialogue only”. | 8 | Pass |
| Hold R (or the on-screen reveal control) to temporarily show suppressed cues. | 12 | F-1-14 |
| Keeps a timed transcript beside the video. | 7 | Pass |
| Selecting a cue seeks to its line. | 7 | Pass |
| Replays one selected dialogue line and stops at its cue end. | 11 | Pass |
| Saves caption text, filter choice, cue changes, and practice results in IndexedDB so they survive a refresh. | 17 | Pass |
| Keeps video files only in memory, so they must be selected after a refresh. | 14 | Pass |
| Exports and imports the editable caption session as JSON. | 9 | F-1-2: say “session with editable cue labels” |
| The complete sample demo works offline after its first visit. | 10 | Pass |
| There are no accounts, analytics, uploads, third-party scripts, or CDN fonts. | 11 | Pass |
| Limits caption files to 5 MB and gives a recovery message for larger files. | 14 | Pass; `caption-size-limit` verifies both clauses |
| Uses supplied WebVTT captions. | 4 | Pass |
| It does not transcribe video or retrieve captions from other services. | 11 | Pass |
| Automatic cue labels are a starting point and may be wrong. | 11 | Pass |
| The original WebVTT source is retained separately and never rewritten. | 10 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Vite prints the local development URL. | 6 | Pass |
| Production preview: | 2 | Pass as command lead-in |
| The full gate runs unit tests, the production build, desktop and 390 px browser journeys, axe checks, and an explicit service-worker offline reload. | 23 | F-1-16 |
| The build command is: | 4 | Pass as command lead-in |
| It writes the static site to dist/, with dist/index.html at its root. | 13 | Pass |
| The executable visitor-facing claims are listed in .factory/claims.json. | 9 | F-1-17 |
| Each command builds the product before its browser test, so it also works from a clean checkout. | 17 | Pass |
| For example: | 2 | Pass as example lead-in |
| Video playback depends on codecs available in the browser. | 9 | Pass |
| The bundled sample uses WebM. | 5 | Pass |
| Caption files must use WebVTT and may be no larger than 5 MB. | 13 | Pass |
| All product logic is static and local-first. | 7 | F-1-15 |
| The viewer makes no third-party runtime requests. | 7 | Pass |
| The demo uses demo:current in IndexedDB and never changes the normal current session key; see .factory/demo.md. | 17 | Pass |
| Deploy the contents of dist/ to a static HTTPS host. | 10 | Pass |
| The production policies are available at /privacy/ and /terms/. | 9 | Pass |
| The visual system and generated-art provenance are in .factory/design.md; implementation and verification notes are in .factory/handoff.md. | 18 | F-1-18 |
| MIT — see LICENSE. | 3 | Pass |

| README heading | Words | Result |
| --- | ---: | --- |
| Dialog Only Switch | 3 | Pass: document title |
| What it does | 3 | Pass |
| Run locally | 2 | Pass |
| Test and build | 3 | Pass |
| Video and caption files | 4 | Pass |
| Privacy and deployment | 3 | Pass |
| License | 1 | Pass |

No banned marketing word from the supplied plain-words list was found. The
flags are for misleading scope, length, jargon, inconsistent terms, vague
headings/statuses, and non-result action labels.

## Demo and sandbox verification

- One click from `/` opens `/demo` and loads an original harbor WebM plus six
  realistic cues: three dialogue and three environmental.
- The persistent banner, Reset demo, and Start for real controls are present.
- Changing an environmental cue to dialogue writes only `demo:current`. A
  seeded real `current` record named `REAL-SENTINEL.vtt` remained unchanged.
- Reset demo removed the override and restored 3 dialogue / 3 environmental;
  the real sentinel remained unchanged.
- The exercised live flow requested only
  `https://dialog-only-switch.sociobot.in` resources and logged no console
  errors.
- After service-worker readiness and an online reload, an offline reload
  showed `Offline-ready`, six cues, the sample video, and an active controller.
- Functional sandbox behavior passes. First-viewport presentation fails under
  F-1-1.

## Claims audit

Every exact command in `.factory/claims.json` was run independently from this
checkout. Each command built the ignored `dist/` output before testing.

| Claim | Exact test | Result |
| --- | --- | --- |
| `isolated-demo` | `npm run test:e2e -- --grep @claim:isolated-demo` | Pass, 2/2 |
| `drag-drop` | `npm run test:e2e -- --grep @claim:drag-drop` | Pass, 2/2 |
| `reversible-filter` | `npm run test:e2e -- --grep @claim:reversible-filter` | Pass, 2/2 |
| `cue-classification` | `npm run test:e2e -- --grep @claim:cue-classification` | Pass, 2/2 |
| `seekable-transcript` | `npm run test:e2e -- --grep @claim:seekable-transcript` | Pass, 2/2 |
| `line-replay` | `npm run test:e2e -- --grep @claim:line-replay` | Pass, 2/2 |
| `refresh-persistence` | `npm run test:e2e -- --grep @claim:refresh-persistence` | Pass, 2/2 |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | Pass, 2/2 |
| `video-not-saved` | `npm run test:e2e -- --grep @claim:video-not-saved` | Pass, desktop; intended mobile skip |
| `session-export-import` | `npm run test:e2e -- --grep @claim:session-export-import` | Pass, 2/2 |
| `caption-size-limit` | `npm run test:e2e -- --grep @claim:caption-size-limit` | Pass, 2/2 |
| `supplied-captions-only` | `npm run test:e2e -- --grep @claim:supplied-captions-only` | Pass, 2/2 |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | Pass, desktop; intended mobile skip |
| `free-use` | `npm run test:e2e -- --grep @claim:free-use` | Pass, 2/2 |

No declared claim test failed. The live and README cross-check found one
unlisted/overstated claim: editable caption text/timing, F-1-2. All other
visitor-facing behavioral claims map to a declared test.

## Earlier findings and regression check

No `.factory/review-*.md` or `.factory/polish-*.md` existed before this review.
The current handoff and all three earlier verification reports were read. The
eight repairs claimed by the current handoff were checked on both live and
code:

| Earlier handoff item | Current evidence | Result |
| --- | --- | --- |
| 1. Claim commands build before Playwright | All 14 exact commands pass; `test:e2e` starts with `npm run build`. | Confirmed |
| 2. Landing sample action and three facts in first mobile screen | CTA bottom 502 px; facts end at 620 px. | Confirmed |
| 3. All previously unlisted behavior claims are declared | Named seek/replay/persistence/classification/limit/source entries pass, but “editable captions” remains unlisted and unsupported. | **Half-fixed: F-1-2** |
| 4. Mobile brand/transcript targets reach 44 px | Those named targets pass. The separate skip link is 43 px. | Confirmed for earlier targets; new F-1-7 |
| 5. How it works, limits/privacy, attribution, build id | Present live and in source. | Confirmed |
| 6. Complete zero-flag copy audit | Audit is stale, incomplete, and misses current flags. | **Half-fixed: F-1-4** |
| 7. Route metadata | Root, demo, privacy, terms, and 404 have route titles, descriptions, canonicals, OG/Twitter data, SVG favicon, and Apple icon. | Confirmed |
| 8. Landmark repair and zero axe violations | Transcript is a section; full Playwright axe suite passes. | Confirmed |

Earlier verification-1 platform gaps also remain fixed: CSP is a response
header, hashed assets are immutable for one year, demo documentation exists,
robots and sitemap return 200, unknown routes return the designed 404 with
status 404, and the manifest MIME type is `application/manifest+json`.

## Structure, accessibility, and visual checks

| Check | Result |
| --- | --- |
| Route title pattern and one h1 | Pass on `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and a live unknown-path 404. |
| Description, canonical, OG/Twitter, favicon | Pass on every route above; social image is 1200 × 630. |
| Deep links and Back | Correct URLs and content load; focus fails under F-1-5. |
| Dead-link crawl | All internal links and the GitHub/sociobot.in external links return 200; pointer navigation fails under F-1-3. |
| Header/footer skeleton | Required wordmark, nav, one-liner, Privacy, Terms, factory credit, and build id are present. |
| Designed 404 | Unknown path returns the product-styled page with HTTP 404 and two routes back. |
| Console | No error on cold root, demo, exercised sample, or verifier runs. |
| Automated accessibility | Full Playwright axe run passes on app and legal routes; 40 browser tests pass with 8 intentional project skips. |
| Keyboard | Existing skip, demo, mode, reset, and reveal tests pass; route focus remains F-1-5. |
| Touch targets | Checked controls pass except the 43 px skip link, F-1-7. |
| Reduced motion | Transition/animation duration is `0.00001s`; scroll behavior is `auto`. |
| Mobile layout | No horizontal overflow at 390 px. |
| Privacy/offline | Same-origin request log and live offline reload pass. |
| Visual identity | Pass: the charcoal screening-room system, amber/teal controls, editorial type, original harbor art, and film-strip transcript are product-specific rather than a generic SaaS template. |
| Runtime AI/key safety | Pass: no AI feature, provider endpoint, or embedded provider key exists. AI is not needed for the deterministic core job. |

Local gates run during this review:

- `npm test`: 16/16 unit/static tests; 40 browser tests passed; 8 intentional
  project skips.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- Production build: 27.58 KB JavaScript (9.65 KB gzip), 20.38 KB CSS
  (5.13 KB gzip), with `dist/index.html` produced.
- `/opt/fleet/lib/verify-url.sh` passes live `/` and `/demo` with no console
  errors.

## What would make this perfect

Resolve every finding; there is no acceptable remainder. Put the working
sample viewer in the first demo viewport, remove or implement the editable-
caption promise, restore clickable header navigation, and make the copy audit
truthful and generated from current strings. Then add route-focus behavior,
44 px coverage, plain copy, and WebVTT result export. Re-run every claim,
full test, live request/offline check, link interaction, metadata route, and
cold 390 px/desktop review from fresh contexts. A perfect next round has zero
findings and no untested or ambiguous claim.
