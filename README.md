# Dialog Only Switch

Dialog Only Switch is a free, private viewer for language learners, caption
readers, and classrooms. It plays local video with supplied WebVTT captions.
The viewer can switch between all cues and “Dialogue only” without
rewriting the source captions.

Live: <https://dialog-only-switch.sociobot.in>

Try the complete bundled sample at
<https://dialog-only-switch.sociobot.in/?demo=1>. It opens an original harbor
video and six supplied WebVTT cues in an isolated demo session.

## What it does

- Opens local video and supplied `.vtt` files.
- Labels bracketed sounds and music as environmental cues. You can change each
  cue label.
- Switches reversibly between “All cues” and “Dialogue only”. Hold `R` (or the
  on-screen reveal control) to show hidden environmental cues temporarily.
- Keeps a timed transcript beside the video. Selecting a cue seeks to its line.
- Replays one selected dialogue line and stops at its cue end.
- Saves caption text, filter choice, cue changes, and practice results in
  IndexedDB so they survive a refresh.
- Keeps video files only in memory, so they must be selected after a refresh.
- Exports Dialogue only and corrected WebVTT files. It also transfers sessions
  as JSON.
- The complete sample demo works offline after its first visit. There are no
  accounts, analytics, uploads, third-party scripts, or CDN fonts.
- It never uploads video, captions, cue labels, or practice activity.
- Limits caption files to 5 MB and gives a recovery message for larger files.
- Uses supplied WebVTT captions. It does not transcribe video or retrieve
  captions from other services.

Automatic cue labels are a starting point and may be wrong. The original
WebVTT source is retained separately and never rewritten.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. Production preview:

```sh
npm run build
npm run preview
```

## Test and build

```sh
npm test
```

Tests cover the production build, desktop, a 390 px phone, and accessibility.
They also reload the sample without a network connection. The build command is:

```sh
npm run build
```

It writes the static site to `dist/`, with `dist/index.html` at its root.

Product claims and their tests are listed in
[`.factory/claims.json`](.factory/claims.json). Each command builds the product
before its browser test, so it also works from a clean checkout. For example:

```sh
npm run test:e2e -- --grep @claim:offline-reload
```

## Video and caption files

Video playback depends on codecs available in the browser. The bundled sample
uses WebM. Caption files must use WebVTT and may be no larger than 5 MB.

## Privacy and deployment

The app runs in your browser. The viewer makes no third-party runtime requests.
The demo uses `demo:current` in IndexedDB and never changes
the normal `current` session key; see [`.factory/demo.md`](.factory/demo.md).
Deploy the contents of `dist/` to a static HTTPS host. The production policies
are available at `/privacy/` and `/terms/`.

Artwork sources and creation notes are in
[`.factory/design.md`](.factory/design.md). Build and test notes are in
[`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [LICENSE](LICENSE).
