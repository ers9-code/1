/* Monday two-page reference.
   Row counts per docs/MONDAY_STRUCTURE_LOCK.md ("Default coded-reference row counts").
   All day/date/week/term values are generated here — never baked into an asset. */

const config = {
  dateISO: "2026-10-05",
  term: "TERM 4",
  week: 1,

  // approved ranges: appointments 3-4, students 3-5, lifeSkills 5-7,
  // tasks 5-7, sentrals 8-12, calls 5-7
  appointments: 4,
  students: 5,
  lifeSkills: 6,
  tasks: 6,
  sentrals: 10,
  calls: 6,
  notesLines: 4
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

function fillTable(tbodyId, rows, cols) {
  const tbody = document.getElementById(tbodyId);
  tbody.replaceChildren();
  for (let r = 0; r < rows; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < cols; c++) tr.appendChild(document.createElement("td"));
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
   less a safety gap, so the block follows the diagonal instead of a box. */
function fitNotesToArtwork(gapMm) {
  const page = document.getElementById("page2");
  const art = page && page.querySelector(".decor img");
  const shell = document.getElementById("notesRows");
  if (!art || !shell || !art.naturalWidth) return;

  const PX = 96 / 25.4;
  const gap = gapMm * PX;
  const shellRect = shell.getBoundingClientRect();

  shell.querySelectorAll(".note-line").forEach(line => {
    const b = line.getBoundingClientRect();
    const { left } = inkSpanIn(art, b.top, b.bottom);
    const limit = isFinite(left) ? left - gap : shellRect.right;
    const widthPx = Math.max(40 * PX, Math.min(shellRect.right, limit) - b.left);
    line.style.width = (widthPx / PX).toFixed(1) + "mm";
  });
}

/* Measures the actual painted extent of a decorative PNG, ignoring the
   transparent margin the assets are required to keep (§7.1). Without this,
   a canvas-box overlap test can never pass for a correctly-margined asset. */
const inkCache = new Map();
function inkRectOf(img) {
  const r = img.getBoundingClientRect();
  let frac = inkCache.get(img.src);
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
    inkCache.set(img.src, frac);
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
    page.querySelectorAll(".table-shell, .list-shell, .note-line, .end-options, .section-heading h2, .main-title").forEach(el => {
      const b = el.getBoundingClientRect();
      decorImgs.forEach(img => {
        const span = inkSpanIn(img, b.top, b.bottom);
        if (!isFinite(span.left)) return;
        const overlapX = Math.min(b.right, span.right) - Math.max(b.left, span.left);
        if (overlapX > 1) {
          problems.push(`${id}: content overlaps ${img.src.split("/").pop()} by ${Math.round(overlapX)}px`);
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
  fillTable("lifeSkillsRows", config.lifeSkills, 3);
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

/* Notes rules are fitted once the artwork has decoded, so they follow its
   real edge. 4mm safety gap between the longest rule and the nearest paint. */
const NOTES_SAFETY_GAP_MM = 4;
function fitWhenArtReady() {
  const art = document.querySelector("#page2 .decor img");
  if (!art) return;
  const run = () => fitNotesToArtwork(NOTES_SAFETY_GAP_MM);
  if (art.complete && art.naturalWidth) run();
  else art.addEventListener("load", run, { once: true });
}
fitWhenArtReady();
window.addEventListener("load", () => fitNotesToArtwork(NOTES_SAFETY_GAP_MM));

window.assertNoPageOverflow = assertNoPageOverflow;
window.inkReport = inkReport;
window.fitNotesToArtwork = fitNotesToArtwork;
window.inkSpanIn = inkSpanIn;
