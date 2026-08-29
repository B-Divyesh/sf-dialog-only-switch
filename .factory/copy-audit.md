# Copy audit — 2026-08-29

This inventory covers every visitor-facing sentence in the app, parser errors,
legal pages, 404 page, and README. Hyphenated terms, filenames, and URLs count
as one word. Headings, labels, facts, and actions are listed separately.

The source hashes make this audit enforceable. `tests/static.test.ts` fails when
one of these copy surfaces changes without a matching audit update.

| Source | SHA-256 |
| --- | --- |
| `index.html` | `4b3646630193fe49c0470ac92a00a23dba780545decdb773b39a59509fec39ec` |
| `src/main.ts` | `2f0d71335f7097986feb26015b05c643d0553b07a4cf25c87e6139badb284ea0` |
| `src/model.ts` | `4d987d258fd5ee50df27bf12f511d5ca3d626693fb246d205f4032078e35969a` |
| `public/route-focus.js` | `34c1a362861d93aa34e8ecc479f97e37e9a766d389f4141b04dafcaea9725022` |
| `README.md` | `0d5b119d8e061fcde1894d750a0b34d0c122f4b7ad964417e598cb4aca903465` |
| `public/privacy/index.html` | `d1cc902666ab77275bec6c8f0d5f22d2e3a27e47980ce6882b8d444d95d17842` |
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
| Caption text and cue-label changes survive a refresh. | 8 | Pass |
| Video files are never saved. | 5 | Pass |
| Choose a local video and WebVTT captions from your device. | 10 | Pass |
| The viewer marks bracketed sounds and music as environmental cues. | 10 | Pass |
| Change any label that is wrong. | 6 | Pass |
| Switch views, seek a cue, practice a line, then export a WebVTT file. | 13 | Pass |
| Add WebVTT captions yourself. | 4 | Pass |
| The viewer does not transcribe video or retrieve captions from other services. | 12 | Pass |
| Caption files must be WebVTT and no larger than 5 MB. | 11 | Pass |
| The app makes no third-party runtime requests. | 7 | Pass |
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
| This file does not begin with WEBVTT. | 7 | Pass |
| Choose a valid .vtt caption file. | 6 | Pass |
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
| Try Dialogue only or hold R to reveal a hidden cue. | 10 | Pass |
| Video ready. | 2 | Pass |
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
| Browser storage is unavailable. | 4 | Pass |
| Files still work for this tab. | 6 | Pass |

## Headings, labels, facts, and actions

| Text | Kind | Result |
| --- | --- | --- |
| Focus on dialogue in your captions | h1 | Pass |
| Filter this sample to spoken lines | demo h1 | Pass |
| Try it with sample data | Action | Pass |
| Free to use · Files stay in your browser · Works offline after the first visit | Facts | Pass |
| Open your files · Your private viewer · Transcript | Headings | Pass |
| Save or transfer your caption session · How it works · Limits and privacy | Headings | Pass |
| All cues · Dialogue only · Environmental | Terms | Pass |
| Show hidden environmental cues temporarily | Control help | Pass |
| Reset demo · Start for real · Install update | Actions | Pass |
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
| This version has no accounts, analytics, advertising, trackers, or third-party runtime requests. | 12 | Pass |
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

## README sentence check

Every README sentence was read aloud and checked. The longest are listed here;
all remaining sentences are 12 words or fewer.

| Sentence | Words | Result |
| --- | ---: | --- |
| Dialog Only Switch is a free, private viewer for language learners, caption readers, and classrooms. | 14 | Pass |
| The viewer can switch between all cues and “Dialogue only” without rewriting the source captions. | 15 | Pass |
| It opens an original harbor video and six supplied WebVTT cues in an isolated demo session. | 16 | Pass |
| Saves caption text, filter choice, cue changes, and practice results in IndexedDB so they survive a refresh. | 17 | Pass |
| Keeps video files only in memory, so they must be selected after a refresh. | 14 | Pass |
| Limits caption files to 5 MB and gives a recovery message for larger files. | 14 | Pass |
| Each command builds the product before its browser test, so it also works from a clean checkout. | 17 | Pass |
| Video playback depends on codecs available in the browser. | 9 | Pass |
| Caption files must use WebVTT and may be no larger than 5 MB. | 13 | Pass |
| It never uploads video, captions, cue labels, or practice activity. | 10 | Pass |
| The demo uses `demo:current` in IndexedDB and never changes the normal `current` session key. | 14 | Pass |

The former 23-word test sentence is now two sentences of ten and nine words.
The terms “dialogue-only view”, “suppressed cues”, “local-first”, “executable
visitor-facing claims”, and “generated-art provenance” no longer appear.

Flagged sentences: **0**. No sentence exceeds 22 words or contains a banned
marketing term. Every use of “change” or “correction” refers to cue labels,
while supplied caption text and timing remain unchanged.

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
