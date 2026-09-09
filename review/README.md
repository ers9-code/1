# Monday visual review — development tool

A browser tool for pointing at what's wrong on the Monday spread instead of
describing it in prose, and for trying small positioning/typography changes
before they go anywhere near production.

**This is a development tool.** It is not part of the planner, it never appears
in a printed PDF, and nothing you do here changes the production planner until
you deliberately apply a proposal.

## Run it

```
node review/server.js
```

Then open <http://localhost:5173/review/monday.html>.

The server is zero-dependency Node. It exists for two reasons: a `file://`
iframe is an opaque origin the tool cannot inspect, and saving review state
needs somewhere to write. `PORT=8080 node review/server.js` if 5173 is taken.

## What you are looking at

The spread is the real `monday/index.html` in an iframe — same DOM, same
`planner.css`, same `monday.js`, same painterly assets. Nothing is recreated.

Zoom scales the iframe element, never the page inside it, so the printable
geometry stays at true physical A4 while you work.

## Selecting and editing

- **Select** mode: click any design element on the spread, or pick it from the
  Elements list. The Inspector shows its name, its X/Y/width/height in
  millimetres from the page corner, its type properties, and its selector.
- Drag a selected element to move it. Tick **Snap 0.5mm** for rounded steps.
  Only design elements are selectable — table rows, checkboxes and generated
  content are not in the registry and cannot be moved.
- Sliders and number fields adjust position, size, scale, rotation, opacity and
  typography, all in millimetres (or em / ×, where that is the natural unit).
- Move the page-2 artwork and the Notes rules refit to its real painted edge
  live, exactly as they do in production.

## Notes (annotations)

Switch to **Annotate**, click anywhere on a page, type the note. Each pin
records the page, X/Y in mm, the element under the cursor if there was one, and
your text. Pins show on the spread and in the Notes list; click a pin or a list
row to highlight it, `×` to delete.

## Print QA

The QA panel runs the production checks — page overflow, elements outside A4,
content overlapping painted pixels, the Notes safety gap and each page's
content bottom — after every change. A red count means an edit broke something.

## Saving

**Save review** writes `review/monday-review.json` (overrides + annotations +
timestamp). If the server isn't running, the file downloads instead.

## Applying changes

**Apply approved changes** writes `review/proposed-changes.css` and shows it in
the Output pane. That file is a proposal: nothing loads it, and the production
planner is untouched until the rules are moved into `monday/planner.css` by
hand. Values the planner computes at runtime — the title wash, the heading
washes, the Notes rules — are emitted as commented notes naming the parameter
in `monday/monday.js` to change instead, because a plain CSS rule would be
overwritten on load.

## Resetting

- **Reset selected** — clears overrides on the current element.
- **Reset all** — clears every override (annotations are kept).
- **Show original** — temporarily strips all overrides so you can compare
  against production, then restores them when unticked.

## What it will not let you change

Row counts, Life Skills GO's columns, the generated date logic, the Notes
silhouette algorithm, A4 geometry and table structure stay code-controlled and
are not exposed here. The tool is for artwork, title composition, heading
washes, typography, spacing, metadata hierarchy and visual position.

## On a phone

`review/monday-review-artifact.html` is the same tool as a single hosted page —
built by `node review/build-artifact.js` from `monday/index.html`,
`monday/planner.css`, `monday/monday.js` and the artwork, so it cannot drift
from what the planner renders. **Rebuild it after changing any of those files,
then republish**, or the phone will show a stale spread; the page prints the
commit it was built from in the Check tab.

Differences from the desktop tool, all forced by being a standalone page:

- The artwork is re-encoded to WebP at its native pixel dimensions (no crop, no
  trim, no resize) so the page is ~3MB rather than ~9MB. Print output still uses
  the untouched PNGs.
- The webfonts are attached from script rather than linked in the markup. A
  stylesheet that is still loading blocks every script on the page, so a slow
  font host would otherwise leave the tool stuck at "loading".
- Adjustments and notes save to the artifact's own store, so they survive
  reloads and can be read back here. Without that store they fall back to the
  phone's local storage and stay on that device.

Tap to select; the sheet shows the element's real millimetres and steppers in
0.5mm increments — press and hold to repeat. Drag a selected element to move
it. One finger pans, two pinch. "Note" turns taps into pins. "Before" flips to
the unmodified planner.

Value changes update the panel's numbers in place rather than re-rendering it.
That is not a micro-optimisation: rebuilding the panel resets its scroll to the
top, which moves the button out from under the thumb and makes the steppers
feel dead after a single press.
