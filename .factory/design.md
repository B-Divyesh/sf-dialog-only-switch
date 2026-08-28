# Dialog Only Switch — visual thesis

## Direction: the quiet screening room

The product lives in the moment when a learner turns down the noise and leans
into a line of dialogue. Its visual system is **cinematic environmental art**:
a nearly empty, late-night screening room seen from the back row, with the
interface behaving like a projection desk. The atmosphere makes the local
video workflow feel intentional without pretending to be a streaming service.
The film itself remains the brightest, most important surface.

This is deliberately a single dark treatment. Local video is usually watched
in a dim setting, and changing to a bright shell would compete with the frame.
Every text and control pairing is designed for WCAG AA contrast in this dark
environment.

## Tokens

- `--ink-950: #090d0f` — auditorium background
- `--ink-900: #101719` — projection booth surface
- `--ink-850: #172124` — raised control surface
- `--paper-50: #f5f1e8` — warm projected text
- `--paper-300: #c8c5bb` — secondary copy
- `--amber-400: #e9ad55` — projector-lamp accent
- `--amber-200: #ffd99a` — strong focus and active caption
- `--teal-400: #71b8ac` — confirmed dialogue / success
- `--rust-400: #d47757` — suppressed environmental cue / warning
- `--danger-300: #ff9b8d` — errors

The amber is used sparingly for the primary action and playhead. Teal and rust
always appear with text or an icon, never as the only state signal.

## Type

- Display and captions: Georgia, Cambria, "Times New Roman", serif. The
  editorial shapes evoke a subtitle script and make quoted dialogue distinct.
- Interface: Inter-compatible system stack (`ui-sans-serif`, `system-ui`,
  `Segoe UI`, sans-serif). No font files or third-party requests are needed.
- Scale: 14, 16, 18, 24, 32, and fluid 48–72 px. Body text is never below 16
  px; compact metadata is 14 px with increased contrast and letter spacing.
- Transcript timecodes use tabular figures.

## Spacing and shape

An 8 px base rhythm with 4 px optical corrections. Main content is capped at
1440 px. Controls are at least 44 px high and use compact 10–14 px radii;
the video frame uses a 20 px radius like the soft edge of projected light.
Panels are grouped by proximity and subtle surface changes, not card grids.

## Interaction grammar

- The caption mode is a physical two-position switch: “All cues” and
  “Dialogue only”. The state name remains visible beside it.
- Holding **R** temporarily reveals suppressed cues; releasing it returns to
  the selected mode. This is mirrored by a press-and-hold button for touch.
- Transcript rows carry a narrow left “film perforation” marker. Clicking a
  row seeks; its edit control changes the cue classification without changing
  the imported VTT source.
- Selecting “Practice line” creates a focused rehearsal strip beneath the
  player. Replay returns to the cue origin and pauses at the cue end.
- Feedback is immediate through pressed states, status copy, and live regions.

## Motion policy

UI transitions run 180–240 ms and animate only opacity and transforms. The
active transcript marker slides a few pixels as the playhead enters a cue; the
temporary reveal fades suppressed cues in from their existing position. No
decoration loops. With `prefers-reduced-motion: reduce`, scrolling becomes
instant, transitions are removed, and state changes use static border and
color changes.

## Original asset plan and provenance

One wide environmental illustration anchors the empty player state and install
splash: an empty screening room facing a misty coastal night projected on a
screen, with the projector beam visually separating a calm human conversation
from abstract environmental texture. It communicates “find the spoken line in
the atmosphere” without depicting a media catalog or an automated classifier.
The image is decorative in the app (`alt=""`) because nearby text states the
workflow. Hand-authored SVG icons and app marks use only simple original
geometry.

### Prompt sheet

- **Use case:** stylized-concept
- **Asset:** wide PWA empty-state / hero environment
- **Subject/world:** empty intimate screening room from the back row; a broad
  screen showing a quiet coastal platform at blue hour; two tiny anonymous
  silhouettes in conversation; projection beam catching a few dust particles
- **Materials:** worn charcoal velvet seats, matte black walls, hazy glass,
  subtle film grain, soft paper-like painted texture
- **Light/lens:** 28 mm cinematic wide angle, low eye level, amber projector
  glow crossing cool blue-green night, deep but legible shadows
- **Palette words:** charcoal, petrol teal, warm parchment, projector amber,
  muted rust
- **Composition:** 3:2 landscape; screen and beam centered; open dark lower
  third for UI overlay; silhouettes tiny and non-identifiable
- **Negative list:** no text, no letters, no captions, no watermark, no logos,
  no brands, no real or recognizable people, no film characters, no UI,
  no neon cyberpunk, no generic gradient, no distorted architecture

Generation tool: factory Azure image deployment via
`/opt/fleet/lib/gen-image.sh`; generated 2026-08-28. The selected image is an
original generated work for this product. Its exact prompt is stored beside
the source image in `assets/src/hero-screening-room.json`.
