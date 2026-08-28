# Dialog Only Switch

Dialog Only Switch is a free, private viewer for language learners, caption
readers, and classrooms. It plays a local video alongside a WebVTT file and
lets the viewer switch between the complete accessibility captions and a
dialogue-only view without modifying the source track.

Live: <https://dialog-only-switch.sociobot.in>

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
- Installs as an offline PWA. There are no accounts, analytics, uploads,
  third-party scripts, or CDN fonts.

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

## Browser support and files

Evergreen Chrome, Edge, Firefox, and Safari are the target. Actual video codec
support comes from the browser; MP4/H.264 and WebM are the safest choices. The
caption parser accepts standard WebVTT timestamps, cue identifiers, settings,
multiline cues, and common inline markup. Caption files are limited to 5 MB.

## Privacy and deployment

All product logic is static and local-first. Any ordinary static host can serve
`dist/`; HTTPS is required for installation and service-worker offline use
(localhost is exempt). The production policies are available at `/privacy/`
and `/terms/`.

The visual system and generated-art provenance are in
[`.factory/design.md`](.factory/design.md); implementation and verification
notes are in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [LICENSE](LICENSE).
