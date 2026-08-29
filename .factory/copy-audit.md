# Copy audit — 2026-08-29

This inventory covers every visitor-facing sentence in the app, parser errors,
legal pages, 404 page, and README. Hyphenated terms, filenames, and URLs count
as one word. Headings, labels, facts, and actions are listed separately.

The source hashes make this audit enforceable. `tests/static.test.ts` fails when
one of these copy surfaces changes without a matching audit update.

| Source | SHA-256 |
| --- | --- |
| `index.html` | `4b3646630193fe49c0470ac92a00a23dba780545decdb773b39a59509fec39ec` |
| `src/main.ts` | `a5b6d334912b5c532711a45bbd90802ea6961bdda3934a508547f4abf5b32a7a` |
| `src/model.ts` | `4d987d258fd5ee50df27bf12f511d5ca3d626693fb246d205f4032078e35969a` |
| `public/route-focus.js` | `34c1a362861d93aa34e8ecc479f97e37e9a766d389f4141b04dafcaea9725022` |
| `README.md` | `9d275f3bd93042852cce13f34a8c9493efabd5645b9eaf2a4b06b1c8390a45eb` |
| `public/privacy/index.html` | `8dc6d61c89c3619357dacdc6227ce0bc3804361ec020fc9b08102e476980deb6` |
| `public/terms/index.html` | `178a0ce5c5b162d6e491cf61b9d05c6e10ec64c32b6c7d120cec7df4fca7582b` |
| `public/404.html` | `e4167ef6e7802c75da7eba6f7e3e97c79e3e4fd4b9655fae58fff056d02a2298` |

## Landing and demo — complete sentence inventory

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

## Dynamic status and error copy

Variables such as a filename, cue count, duration, or time count as one word.

| Sentence | Words | Result |
| --- | ---: | --- |
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

## Headings, labels, facts, and actions

| Text | Kind | Result |
| --- | --- | --- |
| Focus on dialogue in your captions | h1 | Pass |
| Filter this sample to spoken lines | demo h1 | Pass |
| Try it with sample data | Action | Pass |
| Free to use · Files stay in your browser · Sample video and captions load offline after the first visit | Facts | Pass |
| Open your files · Your private viewer · Transcript | Headings | Pass |
| Save or transfer your caption session · How it works · Limits and privacy | Headings | Pass |
| All cues · Dialogue only · Environmental | Terms | Pass |
| Show hidden environmental cues temporarily | Control help | Pass |
| Reset demo · Leave sample mode · Install update | Actions | Pass |
| Export Dialogue only VTT · Export corrected VTT · Export session | Actions | Pass |

## Privacy, terms, and 404 sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Your video stays yours. | 5 | Pass |
| Dialog Only Switch runs in your browser. | 7 | Pass |
| We do not upload your video, captions, cue labels, or practice activity. | 12 | Pass |
| Your latest WebVTT text, file name, filter, cue changes, and practice results may be saved in browser storage. | 19 | Pass |
| This saved session can survive a refresh. | 7 | Pass |
| Local video files are never saved and must be selected again. | 10 | Pass |
| Nothing from the viewer. | 4 | Pass |
| The app does not contact other websites while you use it. | 10 | Pass |
| Use “Export session” to download your settings. | 7 | Pass |
| Use “Clear saved session” to remove them from this browser. | 10 | Pass |
| For privacy questions, contact the site operator through sociobot.in. | 9 | Pass |
| Effective 29 August 2026. | 4 | Pass |
| Use media you may watch. | 5 | Pass |
| Dialog Only Switch is a free local utility for video and caption files you are allowed to use. | 17 | Pass |
| Only open media you own, license, or have permission to use. | 11 | Pass |
| The app does not bypass streaming protections, obtain third-party subtitles, or grant rights to any media. | 16 | Pass |
| Automatic cue labels may be wrong. | 6 | Pass |
| Review and change any cue with its “Mark as” control. | 10 | Pass |
| The imported WebVTT source is preserved and is not rewritten. | 10 | Pass |
| The software is provided “as is” without warranty. | 8 | Pass |
| Keep your own copies of media and caption files. | 9 | Pass |
| Your browser or device can clear browser storage. | 8 | Pass |
| These terms may change with the product. | 7 | Pass |
| Continued use means you accept the current terms. | 8 | Pass |
| This page was not found. | 5 | Pass |
| Check the address, return to the local caption viewer, or open the sample demo. | 14 | Pass |

## README — complete sentence inventory

Every README sentence is listed below. `[URL]` and linked file paths count as
one word.

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
| The app does not contact other websites while you use it. | 10 | Pass |
| The demo uses demo:current in IndexedDB and never changes the normal current session key; see .factory/demo.md. | 16 | Pass |
| Deploy the contents of dist/ to a static HTTPS host. | 10 | Pass |
| The production policies are available at /privacy/ and /terms/. | 9 | Pass |
| Artwork sources and creation notes are in .factory/design.md. | 8 | Pass |
| Build and test notes are in .factory/handoff.md. | 7 | Pass |

The terms “dialogue-only view”, “suppressed cues”, “local-first”, “executable
visitor-facing claims”, “generated-art provenance”, and “third-party runtime
requests” do not appear in visitor copy. Every use of “change” or “correction”
refers to cue labels, while supplied caption text and timing remain unchanged.

Flagged sentences: **0**. No sentence exceeds 22 words or contains a banned
marketing term.

## Terminology

| Concept | Product term |
| --- | --- |
| Timed text file | WebVTT captions |
| Non-spoken caption | environmental cue |
| Filtered display and export | Dialogue only |
| Bundled try-out | sample demo |
| Stored user work | caption session |
| Editable property | cue label |
| One cue exercise | practice line |
