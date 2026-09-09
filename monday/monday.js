/* Monday two-page reference.
   Row counts per docs/MONDAY_STRUCTURE_LOCK.md ("Default coded-reference row counts").
   All day/date/week/term values are generated here — never baked into an asset. */

const config = {
  dateISO: "2026-10-05",
  term: "TERM 4",
  week: 1,

  // Page 1 is 3/4/5/6 by decision: fewer rows so each row can carry a
  // practical handwriting height (~9mm) instead of being squashed.
  appointments: 3,
  students: 4,
  lifeSkills: 5,
  tasks: 6,
  sentrals: 10,
  calls: 6,
  // Notes takes the rest of page 2 — the count is what fits at 9.5mm spacing
  // once Sentrals and Calls are placed. Verify against the rendered page.
  notesLines: 7
};

const dateOf = iso => new Date(iso + "T12:00:00");

function bindMetadata(c) {
  const d = dateOf(c.dateISO);
  const values = {
    weekday: d.toLocaleDateString("en-AU", { weekday: "long" }).toUpperCase(),
    "date-long": d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }).toUpperCase(),
    term: c.term,
    week: String(c.week)
  };
  document.querySelectorAll("[data-bind]").forEach(el => {
    el.textContent = values[el.getAttribute("data-bind")] ?? "";
  });
}

/* tickCols lists column indexes that record a yes/no rather than writing:
   those cells get one centred empty checkbox and no writing space. */
function fillTable(tbodyId, rows, cols, tickCols = []) {
  const tbody = document.getElementById(tbodyId);
  tbody.replaceChildren();
  for (let r = 0; r < rows; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < cols; c++) {
      const td = document.createElement("td");
      if (tickCols.includes(c)) {
        td.className = "tick";
        const box = document.createElement("span");
        box.className = "check";
        td.appendChild(box);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function fillChecklist(containerId, rows) {
  const el = document.getElementById(containerId);
  el.replaceChildren();
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.className = "check-row";
    const box = document.createElement("span");
    box.className = "check";
    row.appendChild(box);
    el.appendChild(row);
  }
}

function fillNotes(containerId, lines) {
  const el = document.getElementById(containerId);
  el.replaceChildren();
  for (let i = 0; i < lines; i++) {
    const line = document.createElement("div");
    line.className = `note-line n${i + 1}`;
    el.appendChild(line);
  }
}

/* Per-scanline profile of where a decorative PNG is actually painted.
   A single bounding box is too blunt for a diagonal edge: it reserves the
   whole rectangle, so writing lines stop far short of the real silhouette.
   This records the leftmost/rightmost painted pixel for each row instead,
   mirrored to match any CSS transform on the image. */
const profileCache = new Map();
function inkProfile(img) {
  const flip = img.dataset.flip || "";
  const key = img.src + "|" + flip;
  let cached = profileCache.get(key);
  if (cached) return cached;

  const W = 260, H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;

  let rows = new Array(H);
  for (let y = 0; y < H; y++) {
    let l = -1, r = -1;
    for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 12) { if (l < 0) l = x; r = x; }
    }
    rows[y] = l < 0 ? null : { l: l / W, r: (r + 1) / W };
  }
  if (flip.includes("x")) rows = rows.map(v => v && { l: 1 - v.r, r: 1 - v.l });
  if (flip.includes("y")) rows = rows.slice().reverse();

  cached = { rows, H };
  profileCache.set(key, cached);
  return cached;
}

/* Painted span of an image across a horizontal band of the page, in page px. */
function inkSpanIn(img, yTop, yBottom) {
  const r = img.getBoundingClientRect();
  const { rows, H } = inkProfile(img);
  let left = Infinity, right = -Infinity;
  for (let i = 0; i < H; i++) {
    const rowTop = r.top + (i / H) * r.height;
    const rowBottom = r.top + ((i + 1) / H) * r.height;
    if (rowBottom < yTop || rowTop > yBottom) continue;
    const v = rows[i];
    if (!v) continue;
    left = Math.min(left, r.left + v.l * r.width);
    right = Math.max(right, r.left + v.r * r.width);
  }
  return { left, right };
}

/* Runs each Notes rule out to the artwork's real edge for its own band,
   less a safety gap, so the block follows the diagonal instead of a box.
   The lower-right composition is layered, so the limit is the leftmost paint
   of any layer in that band — the rules clear the whole silhouette. */
function fitNotesToArtwork(gapMm) {
  const page = document.getElementById("page2");
  const shell = document.getElementById("notesRows");
  if (!page || !shell) return;
  const art = [...page.querySelectorAll(".decor img")].filter(i => i.naturalWidth);
  if (!art.length) return;

  const PX = 96 / 25.4;
  const gap = gapMm * PX;
  const shellRect = shell.getBoundingClientRect();

  shell.querySelectorAll(".note-line").forEach(line => {
    const b = line.getBoundingClientRect();
    const left = Math.min(...art.map(img => inkSpanIn(img, b.top, b.bottom).left));
    const limit = isFinite(left) ? left - gap : shellRect.right;
    const widthPx = Math.max(40 * PX, Math.min(shellRect.right, limit) - b.left);
    line.style.width = (widthPx / PX).toFixed(1) + "mm";
  });
}

/* ---- heading washes sized to their own live wording --------------------
   Measured profile of the masters: pigment is strongest over the first ~80%
   of the canvas and fades away over the last ~20%, and the swipe itself
   occupies only the middle 40% of the canvas height. So sizing the wash from
   the rendered heading width puts the strong part immediately behind the
   wording and leaves the fade as a short tail just past it, instead of
   stretching every heading across a fixed banner. Height is capped so a long
   heading gets a longer swipe, not a taller one. Text stays live HTML; the
   masters stay blank. */
const HEADING_WASH_MASTERS = [
  { maxMm: 30, file: "blank_heading_short.png" },
  { maxMm: 50, file: "blank_heading_medium.png" },
  { maxMm: Infinity, file: "blank_heading_long.png" }
];
const WASH_LEAD_MM = 4;       // paint starts this far left of the first letter
const WASH_BODY_FRAC = 0.8;   // the strong part of each master
const WASH_MIN_MM = 36, WASH_MAX_MM = 84;
const WASH_H_FRAC = 0.42, WASH_MIN_H_MM = 16, WASH_MAX_H_MM = 22;

function fitHeadingWashes() {
  const PX = 96 / 25.4;
  document.querySelectorAll(".section-heading").forEach(head => {
    const h2 = head.querySelector("h2");
    const wash = head.querySelector(".wash");
    if (!h2 || !wash) return;
    const span = WASH_LEAD_MM + h2.getBoundingClientRect().width / PX;
    const widthMm = Math.min(WASH_MAX_MM, Math.max(WASH_MIN_MM, span / WASH_BODY_FRAC));
    const master = HEADING_WASH_MASTERS.find(m => span <= m.maxMm);
    wash.src = wash.src.replace(/blank_heading_[a-z]+\.png$/, master.file);
    // The painted swipe occupies only the middle ~40% of each master's canvas,
    // so height is set from the wash's own length rather than left at the
    // natural 3:1 — a short heading would otherwise get a swipe too slight to
    // read as watercolour, and a long one a swipe deep enough to look like a
    // banner. Held between bounds so every heading gets a comparable body.
    const heightMm = Math.min(WASH_MAX_H_MM, Math.max(WASH_MIN_H_MM, widthMm * WASH_H_FRAC));
    wash.style.width = widthMm.toFixed(1) + "mm";
    wash.style.height = heightMm.toFixed(1) + "mm";
    wash.style.top = "50%";
    wash.style.transform = "translateY(-50%)";
  });
}

/* The title wash is measured against the word, not the header block: centred
   on MONDAY's own letters (the metadata line used to drag the centre down)
   and only modestly longer than the word, so the body sits behind the letters
   instead of trailing off past the Y. Opacity is untouched. */
/* Sized so the master's strong region spans the whole word plus the lead-in,
   with the fade left as a tail rather than the wash petering out mid-word;
   TITLE_CENTRE places the painted band through the middle-to-lower part of
   the lettering instead of across its optical centre. */
const TITLE_LEAD_MM = 12, TITLE_BODY_FRAC = 0.84, TITLE_H_FRAC = 0.50,
      TITLE_CENTRE = 0.58;
function fitTitleWash() {
  const PX = 96 / 25.4;
  const title = document.querySelector(".main-title");
  const wash = document.querySelector(".main-title-wash");
  const wrap = document.querySelector(".main-title-wrap");
  if (!title || !wash || !wrap) return;

  // Width of the word itself: the h1 is a block, so measure a range over its text.
  const range = document.createRange();
  range.selectNodeContents(title);
  const textRect = range.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  const titleRect = title.getBoundingClientRect();

  const widthMm = (TITLE_LEAD_MM + textRect.width / PX) / TITLE_BODY_FRAC;
  const heightMm = widthMm * TITLE_H_FRAC;
  wash.style.width = widthMm.toFixed(1) + "mm";
  wash.style.height = heightMm.toFixed(1) + "mm";

  const capCentre = textRect.height ? textRect.top + textRect.height * TITLE_CENTRE
                                    : titleRect.top + titleRect.height * TITLE_CENTRE;
  // ...but never far enough up to push the wash off the sheet: the header sits
  // only one top margin below the trim.
  const page = wash.closest(".page").getBoundingClientRect();
  const headroomMm = (wrapRect.top - page.top) / PX;
  const topMm = Math.max(0.6 - headroomMm,
                         (capCentre - wrapRect.top) / PX - heightMm / 2);
  wash.style.top = topMm.toFixed(1) + "mm";
  wash.style.transform = "none";
}

/* Measures the actual painted extent of a decorative PNG, ignoring the
   transparent margin the assets are required to keep (§7.1). Without this,
   a canvas-box overlap test can never pass for a correctly-margined asset. */
const inkCache = new Map();
function inkRectOf(img) {
  const r = img.getBoundingClientRect();
  // Keyed by src *and* flip: the same master is used in two orientations
  // across the spread, so the cached box has to be orientation-specific.
  const cacheKey = img.src + "|" + (img.dataset.flip || "");
  let frac = inkCache.get(cacheKey);
  if (!frac) {
    const W = 240, H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (d[(y * W + x) * 4 + 3] > 12) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    frac = x1 < 0 ? { x0: 0, y0: 0, x1: 1, y1: 1 }
                  : { x0: x0 / W, y0: y0 / H, x1: (x1 + 1) / W, y1: (y1 + 1) / H };
    // The bbox is measured on the unrotated bitmap; mirror it to match the
    // CSS transform actually applied, so the QA tests where the paint lands.
    const flip = img.dataset.flip || "";
    if (flip.includes("x")) frac = { ...frac, x0: 1 - frac.x1, x1: 1 - frac.x0 };
    if (flip.includes("y")) frac = { ...frac, y0: 1 - frac.y1, y1: 1 - frac.y0 };
    inkCache.set(cacheKey, frac);
  }
  return {
    left:   r.left + frac.x0 * r.width,
    right:  r.left + frac.x1 * r.width,
    top:    r.top  + frac.y0 * r.height,
    bottom: r.top  + frac.y1 * r.height
  };
}

/* ---- QA (§8): no overflow, no overlap, nothing under the corner art ---- */
function assertNoPageOverflow() {
  const problems = [];

  document.querySelectorAll(".page").forEach(page => {
    const id = page.id;
    const pageBox = page.getBoundingClientRect();

    // Content overflow is measured on .page-inner. Decorative art is allowed
    // to bleed past the trimmed edge and is clipped by the page (§7, §9);
    // measuring .page would count that intentional bleed as a failure.
    const inner = page.querySelector(".page-inner");
    if (inner.scrollHeight > inner.clientHeight + 1)
      problems.push(`${id}: content vertical overflow (${inner.scrollHeight} > ${inner.clientHeight})`);
    if (inner.scrollWidth > inner.clientWidth + 1)
      problems.push(`${id}: content horizontal overflow (${inner.scrollWidth} > ${inner.clientWidth})`);

    // every content element must sit inside the page box
    page.querySelectorAll(".page-inner *").forEach(el => {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) return;
      if (b.bottom > pageBox.bottom + 1 || b.top < pageBox.top - 1 ||
          b.right > pageBox.right + 1 || b.left < pageBox.left - 1) {
        problems.push(`${id}: "${(el.textContent || el.className || el.tagName).toString().trim().slice(0, 34)}" outside page box`);
      }
    });

    // Content must not sit on the artwork. Tested per horizontal band against
    // the painted pixels themselves, so a diagonal edge is judged by where the
    // paint actually is rather than by the rectangle enclosing it.
    // .note-line rather than .notes-shell: the shell is a full-width layout
    // box, while the rules inside it are what actually step around the art.
    const decorImgs = [...page.querySelectorAll(".decor img")];
    page.querySelectorAll(".table-shell, .list-shell, .note-line, .section-heading h2, .main-title").forEach(el => {
      const b = el.getBoundingClientRect();
      decorImgs.forEach(img => {
        const span = inkSpanIn(img, b.top, b.bottom);
        if (!isFinite(span.left)) return;
        const overlapX = Math.min(b.right, span.right) - Math.max(b.left, span.left);
        if (overlapX > 1) {
          const what = (el.className || el.tagName).toString().trim().slice(0, 24);
          problems.push(`${id}: "${what}" overlaps ${img.src.split("/").pop()} by ${Math.round(overlapX)}px`);
        }
      });
    });
  });

  return problems;
}

function build() {
  bindMetadata(config);
  fillTable("appointmentsRows", config.appointments, 2);
  fillTable("studentRows", config.students, 3);
  // Life Skills GO: student, emotion/context, then two tick columns
  fillTable("lifeSkillsRows", config.lifeSkills, 4, [2, 3]);
  fillChecklist("taskRows", config.tasks);   // one full-width column
  fillTable("sentralRows", config.sentrals, 2);
  fillTable("callRows", config.calls, 3);
  fillNotes("notesRows", config.notesLines);
}

/* Reports where each asset's painted area actually lands, in mm from the page
   edges — used to place peripheral art clear of the writing space. */
function inkReport() {
  const PX = 96 / 25.4;
  return [...document.querySelectorAll(".page")].map(page => {
    const p = page.getBoundingClientRect();
    return {
      page: page.id,
      art: [...page.querySelectorAll(".decor img")].map(img => {
        const k = inkRectOf(img);
        return {
          asset: img.src.split("/").pop(),
          leftMm: +((k.left - p.left) / PX).toFixed(1),
          rightMm: +((k.right - p.left) / PX).toFixed(1),
          topMm: +((k.top - p.top) / PX).toFixed(1),
          bottomMm: +((k.bottom - p.top) / PX).toFixed(1)
        };
      }),
      contentBottomMm: +(([...page.querySelectorAll(".page-inner .section")].pop()
        ?.getBoundingClientRect().bottom - p.top) / PX).toFixed(1)
    };
  });
}

build();

/* Washes are sized from rendered text, so they wait for the web fonts;
   re-run on load in case a fallback measured first. */
function fitType() { fitHeadingWashes(); fitTitleWash(); }
fitType();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitType);

/* Notes rules are fitted once the artwork has decoded, so they follow its
   real edge. 4mm safety gap between the longest rule and the nearest paint. */
const NOTES_SAFETY_GAP_MM = 4;
function fitWhenArtReady() {
  const layers = [...document.querySelectorAll("#page2 .decor img")];
  if (!layers.length) return;
  const run = () => fitNotesToArtwork(NOTES_SAFETY_GAP_MM);
  layers.forEach(img => {
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener("load", run, { once: true });
  });
}
fitWhenArtReady();
window.addEventListener("load", () => {
  fitType();
  fitNotesToArtwork(NOTES_SAFETY_GAP_MM);
});

window.assertNoPageOverflow = assertNoPageOverflow;
window.fitHeadingWashes = fitHeadingWashes;
window.fitTitleWash = fitTitleWash;
window.inkProfileFor = inkProfile;
window.inkReport = inkReport;
window.fitNotesToArtwork = fitNotesToArtwork;
window.inkSpanIn = inkSpanIn;
