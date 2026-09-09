# Welfare Planner — Monday

Everything for the planner as it stands. Monday is **not locked** and no other
page type has been started.

## Just want to look at it?

**`proofs/monday-spread.pdf`** — the current two-page Monday spread, true A4.
Print it or open it in any PDF reader. `proofs/page1.png`, `proofs/page2.png`
and `proofs/spread.png` are the same thing as images.

## Want to nudge things around yourself?

**Double-click `review/monday-review-artifact.html`.**

That's it — no install, no server, nothing to run. It opens in your browser and
works offline. It's the same review tool as the hosted page, and it carries the
real planner inside it: same markup, same stylesheet, same code, same artwork.

- **Click** anything — the title, a watercolour wash, the corner artwork, a
  heading — and the panel shows its real position in millimetres.
- **Drag** it to move it. Drag blank paper to slide the page around.
- **+ / −** nudge by 0.5mm; hold them down to run.
- **Note** turns clicks into numbered pins you can type against.
- **Before** flips to the untouched planner so you can compare.
- **Check** runs the print checks — overflow, overlap, the 4mm gap the Notes
  rules keep from the painting, how far each page fills toward its 283mm limit.
- **Reset this** / **Reset all changes** undo without losing your notes.

Nothing you do in it changes the planner. It's a sketchpad for deciding what to
change; tell me what you settled on and I'll make it real.

Your notes save in that browser, on that computer. If you want them to reach
me, copy them out — or use the hosted version, which saves where I can read it.

## The planner itself

**`monday/index.html`** — the actual Monday spread. Double-click to open it;
Ctrl+P prints it at true A4. It needs an internet connection the first time,
for the two typefaces.

- `monday/planner.css` — the whole visual system: palette, type, spacing, the
  artwork placement. Every measurement is in millimetres.
- `monday/monday.js` — builds the rows, generates the date/day/term/week, sizes
  each heading wash to its own wording, and fits the Notes rules to the real
  painted edge of the artwork.
- `assets/` — the painterly artwork, untouched as you supplied it.
- `docs/` — the master prompt and structure specifications.
- `index.html` (top level) — the original generator. Deliberately **not** yet
  updated with the new visual system; that waits until Monday is approved.

## The other review tool

`review/server.js` is a fuller version with an element list, scale and rotation,
and a step that writes out a CSS proposal. It needs Node.js installed, then:

```
node review/server.js
```

and open <http://localhost:5173/review/monday.html>. Only worth it if you want
those extras — the double-click file above covers the review work.

## Current state of Monday

Page 1 — Appointments 3 rows, Students to Follow Up 4, Life Skills GO 5
(Student / Emotion·Context / Checked In / Sentral Note Completed), Tasks 6.
Page 2 — Sentrals 10, Calls 6, Notes 7 ruled lines running to the foot of the
page. No End of Day section.

Every write-in row renders at 9.0mm and the Notes rules at 9.5mm. Both pages
finish within the 283mm limit, and the print checks pass with nothing
overflowing, overlapping or clipped.
