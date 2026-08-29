# Dialog Only Switch

Dialog Only Switch is a free, private viewer for language learners, caption
readers, and classrooms. It plays a local video alongside a WebVTT file and
lets the viewer switch between the complete accessibility captions and a
dialogue-only view without modifying the source track.

Live: <https://dialog-only-switch.sociobot.in>

Try the complete bundled sample at
<https://dialog-only-switch.sociobot.in/demo>. It opens an original harbor
video and editable WebVTT captions in an isolated demo session.

## What it does

- Opens user-owned or explicitly authorized local video and `.vtt` files.
- Detects likely dialogue and environmental cues such as `[MUSIC]`, while
  letting the viewer correct every decision.
- Switches reversibly between “All cues” and “Dialogue only”. Hold `R` (or the
  on-screen reveal control) to temporarily show suppressed cues.
- Keeps a synchronized, seekable transcript visible beside the video.
- Provides a focused line-replay exercise with local completion tracking.
- Saves caption text and corrections in IndexedDB, with JSON export/import.
  Video files are held only in memory and must be selected after a refresh.
- Exports and imports the editable caption session as JSON.
- The complete sample demo works offline after its first visit. There are no
  accounts, analytics, uploads, third-party scripts, or CDN fonts.

Automatic classification is a starting point, not a claim of perfect semantic
understanding. The original WebVTT source is retained separately and never
rewritten.

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

The full gate runs unit tests, the exact production build, Chromium/mobile
browser journeys, axe accessibility checks, and an explicit service-worker
offline reload. The deploy command is:

```sh
npm run build
```

It writes the static site to `dist/`, with `dist/index.html` at its root.

The executable visitor-facing claims are listed in
[`.factory/claims.json`](.factory/claims.json). Run an individual claim from a
fresh build, for example:

```sh
npm run test:e2e -- --grep @claim:offline-reload
```

## Browser support and files

Evergreen Chrome, Edge, Firefox, and Safari are the target. Actual video codec
support comes from the browser; MP4/H.264 and WebM are the safest choices. The
caption parser accepts standard WebVTT timestamps, cue identifiers, settings,
multiline cues, and common inline markup. Caption files are limited to 5 MB.

## Privacy and deployment

All product logic is static and local-first. The sample and session data stay
in the browser, and the viewer makes no third-party runtime requests. The demo
uses `demo:current` in IndexedDB and never reads or writes the normal `current`
session key; see [`.factory/demo.md`](.factory/demo.md). Any ordinary static
host can serve `dist/`; HTTPS is required for installation and service-worker
offline use (localhost is exempt). The production policies are available at
`/privacy/` and `/terms/`.

The visual system and generated-art provenance are in
[`.factory/design.md`](.factory/design.md); implementation and verification
notes are in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [LICENSE](LICENSE).
