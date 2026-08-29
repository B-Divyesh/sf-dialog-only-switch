# Dialog Only Switch — polish round 1 handoff

## Outcome

All 18 findings in `.factory/review-1.md` are fixed and deployed at
<https://dialog-only-switch.sociobot.in>. The static PWA and its quiet
screening-room visual identity are preserved. There are no known gaps or
deferred items.

Implementation commit: `4d1d55fea361dc261b100767bec7bbf092367b56`

Azure deployment: `17844a69-3c87-42af-96f0-ecb48562cfbb`

Deployed and cold-checked: 2026-08-29 UTC

## What changed

- `/?demo=1` and `/demo` open the isolated six-cue sample directly into the
  working viewer. The persistent banner provides Reset demo and Open an empty
  viewer; demo state uses only `demo:current`.
- First-screen, state, control, footer, and README copy now names the exact
  behavior. Broad “editable captions” and all flagged jargon or slogans are
  gone.
- The useful result can be downloaded as corrected WebVTT or Dialogue only
  WebVTT. Cue timing and source text are preserved, and the filtered export
  follows changed cue labels.
- Header pointer interception is fixed. Real routes have individual titles,
  metadata, focus transfer, announcements, legal links, and a status-404 page.
- Mobile keeps the product navigation and presents the loaded video and caption
  switch inside the initial 390×844 viewport. All visible targets measure at
  least 44×44 px.
- `.factory/claims.json` now includes the WebVTT result. The copy audit is tied
  to SHA-256 hashes of every visitor-copy source.
- The PWA cache is version 4 and precaches the query demo plus route-focus
  support.

Every finding-to-change-to-evidence mapping is in `.factory/polish-1.md`.

## Verification

From a clean clone at `4d1d55f`, `npm ci` completed with zero vulnerabilities.
Every one of the 15 exact claim commands in `.factory/claims.json` passed:
14 ran in desktop and mobile projects; the desktop-only local-video and offline
checks each passed once with their documented mobile skip.

Local quality results:

- `npm test`: 18 unit/static passes, 47 browser passes, 9 intentional skips.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm run build`: pass; `dist/index.html` exists.
- Production output: 29.25 KB JavaScript (10.10 KB gzip) and 21.31 KB CSS
  (5.29 KB gzip). No font files or third-party runtime scripts are shipped.
- Playwright Axe: zero violations on `/`, demo, privacy, terms, and 404.
- Local URL verifier: root and query demo pass with one h1, `lang=en`, a main
  landmark, complete labels, and zero console errors.
- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100;
  LCP 1.36 s; CLS 0.

Live cold results:

- Root sample action bottom: 625 px at 1440×900 and 502 px at 390×844.
- Demo video: 286–789 px desktop and 402–604 px mobile. Caption switch:
  803–888 px desktop and 618–808 px mobile.
- Demo summary: 3 dialogue and 3 environmental cues. WebVTT downloads parse as
  4 Dialogue only cues after one correction and 6 corrected cues.
- Forward and Back both focus the new h1. Every desktop header center point
  resolves to its link. All 35 visible mobile targets meet 44×44 px.
- The complete cold flow makes only same-origin requests and logs no console or
  page errors. Live Axe reports zero violations.
- Offline reload restores six cues and the sample video with `Offline-ready`.
- `/`, `/?demo=1`, `/demo`, `/privacy/`, `/terms/`, `robots.txt`, and
  `sitemap.xml` return 200. `/missing-polish-check` returns the designed page
  with status 404.
- Local and live SHA-256 hashes match for `index.html`, JS, CSS, `sw.js`, and
  `route-focus.js`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100;
  LCP 1.06 s; CLS 0.

Evidence is under `.factory/qa-artifacts/polish-1/`, including cold screenshots,
URL-verifier reports, WebVTT downloads, the live check JSON, and Lighthouse
reports.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` through the static work-order path:

```sh
/opt/fleet/lib/deploy-static.sh dialog-only-switch dist
```

## Known gaps and next steps

None for the reviewed scope. Infrastructure, DNS, billing, and external service
work are not required by this local static product.
