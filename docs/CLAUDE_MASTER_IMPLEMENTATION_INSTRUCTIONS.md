# CLAUDE — WELFARE PLANNER VISUAL IMPLEMENTATION MASTER INSTRUCTIONS

This pack is the implementation source-of-truth for the planner's current visual system and the Monday two-page reference.

## 1. THE MOST IMPORTANT RULE

The supplied PNG/SVG files are **reusable visual elements**, NOT flattened finished page designs.

Build in this order:

1. approved page structure
2. exact physical page layout
3. reusable graphic elements
4. live HTML/CSS text placed over those graphic elements
5. dynamically generated dates/week/term/day metadata
6. print/overflow QA

Do not design the page as one flattened picture.

---

## 2. HEADING GRAPHICS MUST HAVE NO WORDS

All files in:

`assets/heading_backgrounds/`

are deliberately BLANK watercolour banner/wash backgrounds.

NEVER bake:
- Appointments / Meetings
- Students to Follow Up
- Life Skills GO
- Sentrals
- Monday
- Notes / Overflow
- or any other page-specific wording

into a PNG/SVG.

The live heading text must sit over the blank wash in HTML/CSS.

Reason: heading wording changes between page types.

---

## 3. GENERATED INFORMATION MUST STAY GENERATED

Do not bake generated metadata into graphic assets.

The planner generator supplies:
- weekday / page day
- date
- week number
- term
- year
- date ranges
- other calendar-derived labels

The Monday coded reference demonstrates this in `monday-reference.js`.

---

## 4. TWO-PAGE SPREAD HEADING RULE

For a two-page daily spread:

- PAGE 1 gets the large main heading/day heading.
- PAGE 2 does NOT get another large page heading.
- Page 2 receives compact generated day/date/week/term information only.

Do not reintroduce a large `Welfare Operations` heading on page 2.

This rule should be carried to other two-page spreads unless a later approved page-specific structure explicitly overrides it.

---

## 5. VISUAL SYSTEM

Required feel:
- elegant
- slightly edgy
- professional
- mature
- refined
- not childish
- not floral
- not overly soft/sweet
- not generic corporate
- not app-card styling

Use contrast from:
- deep plum
- charcoal
- smoky/neutral grey
- controlled mauve
- restrained musty pink
- fine gold linework/speckle

Do not make every heading pale pink.
Do not use purple everywhere.

Exact current RGB/HEX values are in:
`docs/COLOUR_PALETTE_RGB_HEX.json`

---

## 6. TABLE RULES

Tables must feel OPEN and light.

Use:
- light horizontal rules
- only essential vertical dividers
- very light header tint
- long thin mauve strip on left edge

Do NOT:
- use heavy enclosing rectangles
- use dark grid lines
- create large rounded box cards
- add a second rule immediately below a table header

IMPORTANT narrow CSS fix from prior implementation:
If the current generator has:
`.ruled { border-top: ... }`
remove the border-top if it creates the stray duplicate line underneath table/section headers.

---

## 7. DECORATIVE ART RULES

Decoration is subordinate to functionality.

- keep art on outer/peripheral edges
- protect writing space
- no inner-gutter decoration
- no four-corner picture-frame treatment on operational pages
- no slogans / quotes / motivational filler
- no floral or leaf motifs

If decoration and functional content conflict:
REDUCE OR MOVE THE DECORATION FIRST.
Do not shrink practical writing areas first.

---

## 8. STRICT OVERFLOW / OVERLAP RULE

There must be:
- no overflow
- no overlap
- no clipping
- no content under decorative graphics
- no hidden rows
- no section touching the footer
- no text collision

The coded reference includes `assertNoPageOverflow()` as a browser QA check.

If a page does not fit:
1. verify the correct approved row-count range
2. reduce unnecessary gaps
3. reduce decorative footprint
4. only then choose a lower row count within the approved range

Never solve fit by letting content collide.

---

## 9. MONDAY TWO-PAGE APPROVED STRUCTURE

### Page 1
1. Appointments / Meetings — 3 rows minimum, 4 if room permits
2. Students to Follow Up — 3–5 rows
3. Life Skills GO — 5–7 rows
4. Tasks / Admin — 5–7 rows

Reference defaults:
- Appointments = 4
- Students = 5
- Life Skills GO = 6
- Tasks/Admin = 6

There is NO separate `Today` section.

### Page 2
1. Sentrals — 8–12 rows
2. Calls / Email / Messages — 5–7 rows
3. Notes / Overflow — deliberately reduced, approximately half the earlier notes area
4. End of Day

Reference defaults:
- Sentrals = 10
- Calls = 6
- Notes = 4 ruled lines

End of Day has exactly:
- Everything completed
- Incomplete tasks moved to Friday backlog

---

## 10. DIVIDER PAGE BACKGROUNDS

Files:
`assets/divider_backgrounds/`

These are BLANK background artwork only.
They contain NO wording.

Intended use:
- printable blank page-divider stock

Important:
The following have NOT been decided yet:
- exact divider paper/stock
- final paper size
- tab shape
- tab position
- printer constraints
- final trim/bleed method

Therefore:
- DO NOT hard-code final divider dimensions into the generator.
- Treat the SVG as a scalable visual master only.
- The included PNG is a high-resolution reference raster, NOT a commitment to A4 stock.

When the actual divider stock is chosen:
- create/adapt a correctly sized version deliberately
- preserve the full composition
- DO NOT crop the existing background to force it onto a different aspect ratio

---

## 11. FRONT COVER BACKGROUNDS

Files:
`assets/cover_backgrounds/`

Same rule as dividers:
- blank background artwork only
- no wording baked in
- exact final cover material/stock/size is not decided
- SVG is the scalable visual master
- overlay cover wording separately once the final cover design/size is approved
- do not crop to fit another aspect ratio

---

## 12. ASSET RULE — NO CROPPING

Every PNG and SVG in this pack is a complete individual asset on its own canvas.

DO NOT:
- crop the files
- auto-trim transparent pixels
- extract pieces from another image
- bake multiple unrelated assets together
- crop full-background artwork for a different page ratio

Use the matching asset or generate a deliberately adapted master if another ratio is required.

---

## 13. TYPOGRAPHY

Current implementation direction:
- Page titles / section headings: `Cormorant Garamond`
- Operational/table text: `Source Sans 3`

The user previously rejected:
- very cursive section headings
- overly traditional/heavy serif appearance

Therefore:
- section headings must be easy to read
- no handwritten/cursive heading fonts
- title hierarchy can be editorial but readable

Font files are NOT part of this pack and must not be distributed.

---

## 14. FIRST IMPLEMENTATION TASK

Before rebuilding the entire generator:

1. Apply the narrow `.ruled` duplicate-line fix if still present.
2. Recreate the exact Monday two-page reference using this pack.
3. Use live generated metadata.
4. Render both pages.
5. Verify there is no overflow or overlap.
6. Compare structure to `docs/MONDAY_STRUCTURE_LOCK.md`.
7. STOP and review before applying the theme to other page types.

Do not use an AI mockup's exact page contents as the functional specification.
The approved structure files control functionality.
