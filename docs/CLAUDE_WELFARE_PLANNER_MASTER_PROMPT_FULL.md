# CLAUDE MASTER PROMPT — WELFARE PLANNER VISUAL SYSTEM + IMPLEMENTATION

You are continuing an existing Welfare Planner generator in VS Code. The generator already has date-driven/page-generation logic. Your task is NOT to redesign the planner from scratch and NOT to copy an AI mockup literally as a functional layout.

Your job is to reconstruct and implement the APPROVED VISUAL THEME as a real reusable design system, then apply that system to each planner page type according to that page type's own approved functional structure.

The user has only locked ONE exact page layout in this current visual-design process: the standard Monday two-page daily spread. All other page types must use the SAME visual language but keep THEIR OWN approved structures and field layouts from the planner specification / generator. Do not force Monday's content structure onto other page types.

---

## 0. CRITICAL CORRECTION BEFORE YOU START

The previously supplied generated PNG/SVG decorative assets are NOT visually approved.

They were structural approximations and do NOT match the painterly, layered watercolor/ink look of the approved mockup closely enough.

DO NOT use those earlier decorative images as the visual authority.

You may reuse:
- the implementation rules,
- structural rules,
- color-token ideas,
- row-count rules,
- dynamic-generation rules,

but RECREATE the actual visual assets so they match the approved mockup/theme much more faithfully.

The approved reference image(s) / mockup control the LOOK ONLY.

The existing planner structure / approved page structure controls:
- content,
- section order,
- fields,
- row counts,
- which page type is one page vs two pages,
- functional writing space.

Do not merge these two roles.

---

# 1. SOURCE-OF-TRUTH PRIORITY

Use this order when there is any conflict:

1. Approved functional planner structure / structure specification
2. The latest locked page-specific instructions from the user
3. Approved visual reference/mockup for visual language
4. Existing generator/calendar logic where it does not conflict with #1–#3
5. Old generated proofs/assets only as historical reference, never as authority

The AI mockup is a THEME reference, not an exact field-layout blueprint.

Do not copy incorrect mockup wording, invented columns, slogans, quotes, page numbers, or fields simply because they appear in the picture.

---

# 2. CORE BUILD PRINCIPLE

Build every planner page in this order:

1. FUNCTIONAL PAGE STRUCTURE
2. PHYSICAL PAGE GEOMETRY
3. REUSABLE VISUAL ASSETS
4. LIVE TYPOGRAPHY/TEXT
5. GENERATED DATE/WEEK/TERM/DAY DATA
6. OVERFLOW / PRINT QA

Do NOT make the planner as flattened images.

The final planner pages must remain real HTML/CSS/JS layouts with reusable image/vector assets layered into them.

---

# 3. VISUAL DIRECTION TO MATCH

The visual style is:

- elegant
- editorial
- mature
- polished
- slightly edgy
- feminine without being floral or cute
- moody enough to have contrast
- practical and readable
- premium stationery rather than a corporate form
- white/cream space is important
- decorative artwork is restrained and peripheral

The edge comes from contrast and material quality, NOT from large blocks of purple.

Use:
- deep plum
- charcoal / smoky black-grey
- stone grey
- mauve
- musty/dusty pink in small doses
- warm cream/off-white
- fine muted gold linework and tiny splatter

Avoid:
- bright purple
- lavender-heavy pages
- pink behind every heading
- pastel-cute stationery
- botanicals / flowers / leaves
- app-card design
- heavy boxed tables
- generic minimalist office forms
- thick technical geometry
- repeated four-corner framing

---

# 4. COLOR SYSTEM — RGB + HEX

Use these as THEME ANCHORS.

These are not instructions to make flat blocks everywhere. Watercolor/ink assets should blend these colors naturally.

Page / paper:
- Warm paper: RGB 255, 252, 249 — #FFFCF9

Dark structure:
- Deep plum: RGB 74, 38, 62 — #4A263E
- Ink: RGB 41, 38, 43 — #29262B
- Charcoal: RGB 55, 51, 58 — #37333A

Muted color:
- Mauve: RGB 164, 130, 146 — #A48292
- Musty pink: RGB 195, 154, 166 — #C39AA6
- Soft blush: RGB 239, 230, 233 — #EFE6E9
- Stone: RGB 200, 189, 184 — #C8BDB8
- Warm grey: RGB 170, 168, 167 — #AAA8A7

Structure/rules:
- Line grey: RGB 203, 198, 201 — #CBC6C9
- Very light grey: RGB 245, 241, 243 — #F5F1F3

Accent:
- Muted gold: RGB 196, 154, 88 — #C49A58

White:
- RGB 255, 255, 255 — #FFFFFF

Important:
- Plum is the signature color but must NOT dominate every table/heading.
- Gold is a fine accent only.
- Table lines should be much lighter than body text.
- Musty pink is an undertone, not a repeated section-header block.

---

# 5. TYPOGRAPHY

The user rejected the overly cursive heading direction.

Use highly readable typography.

Recommended:
- Main page/day titles: Cormorant Garamond Medium/Semibold OR another contemporary editorial serif that visually matches better.
- Section headings: readable editorial serif or refined semi-serif; NOT handwritten/cursive.
- Operational text, table labels, dates, metadata: Source Sans 3 / Inter / another clean sans.

Do NOT:
- use script/calligraphy for table-section headings,
- use overly traditional heavy serif,
- use excessive letter spacing on every heading,
- bake heading words into graphics.

Font files must not be copied/distributed in the project.

Use web/installed fonts and document the chosen stacks.

---

# 6. HEADING ASSET SYSTEM — VERY IMPORTANT

Heading graphics are BACKGROUNDS ONLY.

Create reusable blank watercolor/ink wash assets in several widths, for example:
- short
- medium
- long
- page-title wash

THEY MUST CONTAIN NO WORDS.

The actual heading text must be live HTML/CSS text placed over the blank graphic.

Reason:
- heading text changes from page to page,
- the same visual element needs to be reused across many page types,
- dynamic layouts should not require a new image for every label.

Correct construction:

BLANK WATERCOLOUR WASH
+
LIVE TEXT OVER IT
+
THIN TABLE LEFT ACCENT STRIP BELOW

Never:
- `heading_sentrals.png` with the word Sentrals baked in
- `heading_notes.png` with Notes baked in
- finished page-header screenshots used as components

---

# 7. PROPER GRAPHIC-ASSET REQUIREMENTS

Recreate the painterly assets to match the reference image more faithfully.

The earlier vector approximations looked too synthetic.

## 7.1 Watercolor heading washes

Primary master should be:
- transparent PNG
- high resolution
- real painterly/ink texture
- irregular natural watercolor edges
- subtle stone/mauve/musty-pink layering
- slightly smoky rather than sugary pink
- no text
- no hard rectangular edge
- enough transparent margin so it is NOT tight-cropped

Also provide:
- SVG only where a vector version is genuinely appropriate
- do not pretend a flat vector shape is visually equivalent to the painterly PNG

Suggested master canvases:
- Short wash: 1000 × 220 px transparent
- Medium wash: 1400 × 220 px transparent
- Long wash: 1800 × 220 px transparent
- Main-title wash: approx 1600 × 320 px transparent

Do not auto-trim/crop transparent margins.

## 7.2 Operational corner artwork

Create individual:
- top-left
- top-right
- bottom-left
- bottom-right

Each:
- transparent background
- its own full canvas
- not cropped from a larger mockup
- no words
- layered charcoal/plum/mauve/stone
- fine gold organic line(s)
- restrained gold/ink speckling
- painterly irregular edges
- not floral
- not a hard wedge
- not a picture frame

Operational page art must be much smaller than the dramatic divider/cover art.

It must remain near the outside edge/corner.

## 7.3 Gold accents

Create separately:
- fine gold horizontal rule
- thin curved gold line if useful
- small gold splatter cluster

Do not combine them permanently into every page.

## 7.4 Table-left strip

Create or code:
- long thin mauve/plum strip
- subtle
- approximately 1–1.5 mm on A4
- acts as a visual anchor at the left of the structured section

This is not a purple box beside the heading.

## 7.5 Checkbox

Use:
- clean outlined square
- approx 4–5 mm on A4
- charcoal/light-plum outline
- no fill

Can be CSS or SVG.

---

# 8. NO CROPPING RULE — STRICT

Do not crop reusable assets.

Do not:
- crop one generated image into multiple graphic assets,
- auto-trim transparent pixels tightly,
- crop divider/cover backgrounds to force-fit a new aspect ratio,
- create four corner assets by chopping a finished page image.

Each asset must be created as an individual asset on its own intended canvas.

If another size/aspect ratio is required:
- deliberately adapt/rebuild the master,
- preserve the full composition.

Do not solve sizing by cropping away artwork.

---

# 9. PAGE BACKGROUND ARTWORK / DECORATION RULE

On operational planner pages:
- decoration belongs on OUTER edges
- do not decorate the inner gutter
- facing pages should balance each other
- do not put equal art in all four corners
- protect writing space
- graphics should feel like part of one spread, not separate templates

If decoration conflicts with functional space:
1. reduce decoration
2. move decoration farther outward
3. reduce unnecessary decorative whitespace
4. only then adjust rows within the approved row-count range

Functional writing space wins.

---

# 10. TABLE DESIGN — LOCKED DIRECTION

The user specifically rejected heavy square tables.

Tables must feel OPEN.

Use:
- light horizontal rules
- only essential vertical dividers
- subtle, very light header tint if useful
- thin long accent strip on left
- writing cells as the writing space
- fine rule weight

Do NOT:
- enclose tables in thick outer boxes
- use heavy rounded rectangles
- use dark spreadsheet grids
- add handwriting lines inside table cells
- make pale header bands too prominent

The eye should see WRITING SPACE FIRST, STRUCTURE SECOND.

---

# 11. PRIOR CSS BUG — FIX FIRST IF PRESENT

The current/previous `index.html` had a stray extra line caused by:

`.ruled { border-top: ... }`

where `.ruled` was used immediately under a section/table header that already had its own border.

If this still exists:
REMOVE the `border-top` from `.ruled`.

Do not change anything else in that narrow fix.

Verify two representative pages after the fix.

---

# 12. DYNAMIC GENERATION RULES

Dates and planner metadata must remain generated by JS/code.

Do not bake the following into image files:
- Monday / Tuesday / etc.
- date
- week
- term
- year
- date range
- student week number
- monthly label if generated
- report dates
- dynamically calculated period information

These are live text fields.

The graphics are visual backgrounds/components only.

---

# 13. TWO-PAGE SPREAD MAIN-HEADING RULE

For standard two-page spreads:

PAGE 1:
- gets the large main page/day heading

PAGE 2:
- does NOT repeat another giant heading
- gets compact generated day/date/week/term reference only, where appropriate

For the Monday daily spread specifically:
- `MONDAY` is the large page heading on Page 1
- DO NOT add a large `Welfare Operations` heading on Page 2

This rule is part of the visual hierarchy.

Do not create a second competing title just because Page 2 has a different function.

---

# 14. MONDAY TWO-PAGE STRUCTURE — THE ONLY CURRENTLY LOCKED EXACT LAYOUT IN THIS DESIGN ROUND

This structure is exact.

Do not add the removed `Today` section.

## PAGE 1

Large generated weekday title/date area, then:

### Appointments / Meetings
Row range:
- 3 rows minimum
- 4 rows if room permits

Preferred reference default:
- 4

Suggested fields:
- Time
- Details / Purpose

### Students to Follow Up
Row range:
- 3–5

Preferred reference default:
- 5

### Life Skills GO
Row range:
- 5–7

Preferred reference default:
- 6

### Tasks / Admin
Row range:
- 5–7

Preferred reference default:
- 6

This can use a practical checklist layout. Do not cram it merely to keep decoration.

## PAGE 2

Compact generated day/date/week/term reference only.

NO large second page heading.

Then:

### Sentrals
Row range:
- 8–12

Preferred reference default:
- 10

This is intended to be the largest structured section on Page 2.

### Calls / Email / Messages
Row range:
- 5–7

Preferred reference default:
- 6

### Notes / Overflow
- intentionally smaller than the earlier large Notes area
- approximately half the previous size
- it must stop before the large bottom-right artwork
- line lengths/widths may reduce progressively or terminate earlier so the writing area HUGS the decorative graphic rather than running under/through it

Important:
Do not let notes rules draw over the corner graphic.
Do not let them continue beneath it.
The notes region should be intentionally shaped around the artwork.

### End of Day
Exactly:
- ☐ Everything completed
- ☐ Incomplete tasks moved to Friday backlog

This belongs on Page 2 in the current locked Monday layout.

---

# 15. CRITICAL RULE: MONDAY IS NOT THE TEMPLATE STRUCTURE FOR EVERY OTHER PAGE

The Monday spread defines:
- the visual system,
- spacing language,
- heading construction,
- table style,
- decoration restraint,
- typography hierarchy,
- implementation method.

It does NOT define the content layout for all planner pages.

Every other page type must use its OWN approved functional structure.

Do NOT:
- add Sentrals to every spread,
- force four Monday sections onto Weekly Overview,
- make Staff Meeting look like a Monday page structurally,
- copy Monday row counts onto Friday,
- turn every page into identical stacked tables.

The common system is VISUAL, not FUNCTIONAL.

---

# 16. OTHER PAGE TYPES — HOW TO HANDLE THEM

Inspect the existing generator and the approved planner structure specification.

For each distinct page type:

1. identify its functional purpose
2. keep its approved sections/fields/order
3. design a page-specific composition for those fields
4. apply the same visual system:
   - blank watercolor heading washes
   - live typography
   - light rules
   - thin left accent strips
   - restrained outer-edge art
   - same palette
   - same type hierarchy
   - same spacing rhythm
5. verify the page has enough real writing space
6. do not invent extra sections

Representative page types may include:
- Weekly Overview two-page spread
- standard Mon–Thu daily spread
- Friday backlog/catch-up spread
- Weekly Sentral Review
- Weekly Closure
- Staff Meeting
- Manager Catch-Up
- HOS / Welfare
- NSW Monthly Meeting
- Monthly Review / Report Prep
- Welfare Inbox
- Staff Interactions
- Welfare Program Planning
- non-student / admin days
- non-student Friday / catch-up
- end-of-period / handover
- divider pages
- front cover

Do not assume this list overrides the actual generator.
Use the existing generator/approved specification to determine the final page-type inventory.

---

# 17. WEEKLY SENTRAL REVIEW — IMPORTANT EXISTING LOCK

The Weekly Sentral Review must use EXACTLY FOUR LARGE ENTRIES.

Do not convert it into 10–13 small cramped rows.

The visual design should give those four entries substantial writing room.

Use the approved functional fields from the planner structure specification.

Do not invent fields from an old AI mockup.

---

# 18. STAFF MEETING — IMPORTANT EXISTING LOCK

Keep the simple agreed structure from the planner specification.

Do not make Staff Meeting structurally resemble Monday.

Apply the same visual theme while keeping its own meeting-specific layout.

---

# 19. DIVIDER PAGE BACKGROUNDS — NO WORDS

Create large, rich background artwork matching the visual theme, inspired by the supplied divider references.

These divider backgrounds should:
- use the same plum/charcoal/mauve/stone/cream/gold palette
- be more dramatic than operational-page corner art
- have layered watercolor/ink masses
- fine gold arcs/veins
- controlled speckle
- plenty of intentional negative space for future live text
- contain NO wording

The divider background file is just the background.

Text such as:
- TERM 1
- REPORTING
- MONTHLY REVIEW
- etc.

must be placed separately by the generator/design later.

## Physical divider stock is NOT decided

The actual divider pages are intended to be printed/generated onto printable blank divider stock.

The following are currently NOT decided:
- paper stock
- final sheet size
- tab style
- tab position
- tab dimensions
- bleed
- printer method
- whether the final stock exactly matches A4

Therefore:
- do not hard-code A4 as the permanent divider-background format
- create a scalable SVG/composition master
- a high-resolution PNG reference may use A-series portrait proportions only as a temporary master/reference
- when actual stock is selected, deliberately adapt the full composition to that stock
- DO NOT crop the art to fit

---

# 20. FRONT COVER — SAME RULE AS DIVIDERS

Create blank front-cover background masters in the same theme.

No wording baked in.

The cover wording will be live/separate later.

Final:
- material
- paper size
- binding
- stock
- bleed
- trim

are not locked yet.

Do not assume final dimensions.

Do not crop to adapt.

---

# 21. ASSET DELIVERY REQUIREMENTS

For painterly raster graphics:
- supply transparent PNG masters at high resolution
- 300 dpi-equivalent working resolution
- preserve transparent margins
- no auto-crop

For genuinely vector elements:
- supply SVG
- e.g. accent strips, checkboxes, fine gold rules, simple curves

Where useful:
- provide both SVG and PNG

But do not create a fake flat vector version of watercolor art and claim it visually matches the PNG.

Suggested asset folders:

assets/
  heading_backgrounds/
    blank_heading_short.png
    blank_heading_medium.png
    blank_heading_long.png
    blank_page_title_wash.png

  operational_art/
    corner_top_left.png
    corner_top_right.png
    corner_bottom_left.png
    corner_bottom_right.png

  accents/
    gold_rule.svg
    gold_curve.svg
    gold_splatter.png
    table_left_strip.svg
    checkbox.svg

  divider_backgrounds/
    divider_light_master.svg/png
    divider_dark_master.svg/png

  cover_backgrounds/
    cover_light_master.svg/png
    cover_dark_master.svg/png

Do not create asset filenames tied to wording if the image has no wording.

---

# 22. A4 OPERATIONAL PAGE GEOMETRY

Operational planner pages:
- A4 portrait
- 210 mm × 297 mm
- no bleed unless final printing method later requires it
- mirrored gutter margins

Recommended starting margins:
Left page:
- outer left approx 14 mm
- inner right approx 17–18 mm

Right page:
- inner left approx 17–18 mm
- outer right approx 14 mm

Do not allow artwork into the binding gutter.

The screen preview can scale a wrapper.

The printable page DOM itself must remain at physical size.

Do not use CSS transform scaling on the printable page to force content to fit.

---

# 23. OVERFLOW / OVERLAP — ZERO TOLERANCE

This is mandatory QA.

No:
- overflow
- overlapping
- clipped text
- clipped tables
- hidden rows
- headings touching tables
- notes rules crossing artwork
- decoration covering writing areas
- footer collision
- content beyond page height
- unexpected extra print pages

Implement browser QA.

At minimum, inspect:
- scrollHeight vs clientHeight
- scrollWidth vs clientWidth
- child bounding boxes vs page bounding box

If content does not fit:
1. confirm correct structure
2. confirm row count is within approved range
3. reduce decorative footprint
4. reduce unnecessary whitespace/gaps
5. choose a lower row count inside the approved range

Never allow collision.

---

# 24. MOCKUP / DESIGN REVIEW WORKFLOW

Do not go back to blind CSS tuning across the whole generator.

Work page-type by page-type.

Recommended process:

PHASE A — visual system
- rebuild proper assets from reference
- show/review the reusable theme

PHASE B — Monday coded reference
- exact locked Monday structure
- real HTML/CSS + real assets
- generated metadata
- browser render + PDF
- no overflow

PHASE C — distinct page-type prototypes
Create representative artboards/pages for each major page type using its own approved structure.

Do not generate every week/date yet.

PHASE D — approval
User reviews visual consistency and functional writing space.

PHASE E — generator rollout
Only after the major page types are approved:
- apply components across the generator
- generate full dated planner runs

---

# 25. COMPONENT ARCHITECTURE

Prefer reusable components/styles such as:

- PageShell
- MainPageHeading
- CompactPage2Metadata
- SectionHeadingWash
- StructuredTable
- RuledChecklist
- NotesArea
- OuterEdgeArtwork
- GoldRule
- Checkbox
- DividerBackground
- CoverBackground

The visual system should be tokenized.

Do not paste custom one-off CSS for every page unless the page structure genuinely requires it.

Each page type can have its own layout CSS while sharing visual components.

---

# 26. REQUIRED QA OUTPUTS

For each page type prototype, save:
- browser screenshot
- print/PDF proof
- page-size/page-count check
- overflow QA result

For two-page spreads:
- also save a side-by-side spread screenshot

Before full rollout, produce a review set including at least:
- Weekly Overview spread
- Monday/daily spread
- Friday spread
- Weekly Sentral Review
- Weekly Closure
- Staff Meeting
- non-student/admin page
- one divider background
- one cover background

Use actual approved functional structures for each.

---

# 27. WHAT NOT TO DO

Do not:
- use the old generated decorative PNG/SVG pack as visual authority
- copy incorrect AI mockup fields
- bake wording into headings
- bake dates into images
- repeat large headings on Page 2
- turn every page into Monday
- use heavy purple boxes
- use dark spreadsheet grids
- add motivational phrases
- add botanical/floral motifs
- crop reusable assets
- crop divider/cover backgrounds
- generate the complete planner before prototypes are approved
- silently reduce writing space to preserve decoration
- declare success just because the HTML compiles

---

# 28. FIRST ACTIONS — DO THESE IN ORDER

1. Inspect the existing repo.
2. Create a safe checkpoint/branch.
3. Locate the duplicate `.ruled` border-top bug and fix only that narrow issue if still present.
4. Read the approved functional structure/specification.
5. Treat Monday's structure in this prompt as the current exact daily-spread lock.
6. Rebuild the visual graphic assets so they ACTUALLY resemble the approved mockup/theme.
7. Do not use text-baked heading assets.
8. Implement the exact Monday two-page coded reference.
9. Verify generated metadata.
10. Verify no overflow/overlap/clipping.
11. Render screenshot + PDF.
12. STOP for visual review.
13. Then create the remaining distinct page types using THEIR OWN structures but the SAME visual system.
14. Do not generate the full planner until those page types are approved.

---

# 29. SUCCESS CRITERIA

Success is NOT:
- "the CSS looks cleaner"
- "the code compiles"
- "it uses the same colors"

Success means:

- the visual design clearly belongs to the approved planner theme,
- painterly graphic assets look like the reference rather than flat approximations,
- text is live and reusable,
- page structures remain correct,
- Monday matches its exact locked layout,
- other page types retain their own structures,
- dates/week/term remain generated,
- Page 2 does not duplicate the main heading,
- tables are light/open,
- decoration is refined and slightly edgy without taking working space,
- divider/cover backgrounds are blank scalable masters,
- no assets are cropped,
- there is no overflow, overlap, or clipping,
- and the full generator is only rolled out after page-type prototypes are approved.
