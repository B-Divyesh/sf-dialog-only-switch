# Demo sandbox

Open [the demo](/?demo=1) or visit `https://dialog-only-switch.sociobot.in/?demo=1`.

It immediately loads an original 12-second silent harbor WebM and the bundled
`harbor-dialogue-demo.vtt` file. The six cues include spoken lines, waves,
gulls, and music, so the dialogue filter, temporary reveal, correction, and
practice controls all have useful sample data.

Demo state uses the IndexedDB key `demo:current` in the existing
`dialog-only-switch` database. Real sessions use the separate `current` key.
The persistent banner says “Demo — sample data, nothing is saved”. **Reset
demo** discards and reloads the demo key. **Leave sample mode** discards it and
returns to the normal viewer, which restores a separate real session if one
exists. The sample video and VTT are precached, so the sample video and
captions load offline after the first visit.
