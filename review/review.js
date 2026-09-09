/* Monday visual review — development only.
   ---------------------------------------------------------------------------
   The spread in the iframe is the real production page: same DOM, same
   planner.css, same monday.js, same assets. Nothing in this file is loaded by
   the planner, and no edit made here reaches production until "Apply approved
   changes" is used and the proposal is moved across by hand.

   Two deliberate choices worth knowing:
   - Zoom scales the iframe element, never the page DOM inside it, so the
     printable geometry stays at true physical size.
   - Selection outlines and annotation pins are drawn in this document, over
     the iframe, so the planner's DOM is never touched by the tool. */

const PX = 96 / 25.4;                       // CSS px per mm
const mm = px => +(px / PX).toFixed(2);
const frame = document.getElementById('frame');
const stage = document.getElementById('stage');
const overlay = document.getElementById('overlay');
const out = document.getElementById('out');

let win, doc, items = [], sel = null, zoom = 1, mode = 'select', view = 'spread';
const state = { overrides: {}, annotations: [] };
let pinSeq = 0;

/* ---------------------------------------------------------------- registry */

const SHORT = {
  'Appointments / Meetings': 'Appointments', 'Students to Follow Up': 'Students',
  'Life Skills GO': 'Life Skills', 'Tasks / Admin': 'Tasks', 'Sentrals': 'Sentrals',
  'Calls / Email / Messages': 'Calls', 'Notes / Overflow': 'Notes'
};

/* A precise selector for the proposal document, anchored on the page id.
   nth-of-type is added only where the classes alone are ambiguous, so the
   common case stays readable. */
function cssPath(el) {
  const parts = [];
  while (el && !el.id) {
    const parent = el.parentElement;
    let s = el.tagName.toLowerCase();
    const cls = [...el.classList].join('.');
    if (cls) s = '.' + cls;
    if (parent && [...parent.children].filter(n => n.matches(s)).length > 1) {
      const sibs = [...parent.children].filter(n => n.tagName === el.tagName);
      s += `:nth-of-type(${sibs.indexOf(el) + 1})`;
    }
    parts.unshift(s);
    el = parent;
  }
  if (el && el.id) parts.unshift('#' + el.id);
  return parts.join(' > ');
}

/* Which offsets the element is actually anchored by, so a move is written
   back as a change to the property the stylesheet already uses. Computed
   style reports used pixel values for all four, which would make a
   right-anchored layer look left-anchored; the Typed OM keeps `auto`. */
function anchorsOf(el) {
  try {
    const m = el.computedStyleMap();
    const isAuto = p => String(m.get(p)) === 'auto';
    return { left: !isAuto('left'), right: !isAuto('right'),
             top: !isAuto('top'), bottom: !isAuto('bottom') };
  } catch (e) {
    const cs = win.getComputedStyle(el);
    return { left: cs.left !== 'auto', right: cs.right !== 'auto',
             top: cs.top !== 'auto', bottom: cs.bottom !== 'auto' };
  }
}

function add(list, key, name, group, el, kind) {
  if (!el) return;
  const cs = win.getComputedStyle(el);
  list.push({
    key, name, group, el, kind,
    selector: cssPath(el),
    style0: el.getAttribute('style') || '',
    baseTransform: cs.transform === 'none' ? '' : cs.transform,
    absolute: cs.position === 'absolute',
    anchors: cs.position === 'absolute' ? anchorsOf(el) : null,
    base: {
      left: cs.left, right: cs.right, top: cs.top, bottom: cs.bottom,
      width: parseFloat(cs.width), height: parseFloat(cs.height),
      fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing),
      lineHeight: cs.lineHeight, opacity: parseFloat(cs.opacity), zIndex: cs.zIndex
    }
  });
}

function buildRegistry() {
  const list = [];
  const q = s => doc.querySelector(s);

  add(list, 'p1.title', 'Main Title — MONDAY', 'Page 1', q('#page1 .main-title'), 'text');
  add(list, 'p1.titleWash', 'Main Title Wash', 'Page 1', q('#page1 .main-title-wash'), 'wash');
  add(list, 'p1.accent', 'Top Left Accent', 'Page 1', q('#page1 .decor.art-tl img'), 'art');
  add(list, 'p1.meta', 'Date / Term / Week', 'Page 1', q('#page1 .main-meta'), 'text');
  add(list, 'p1.rule', 'Gold Rule', 'Page 1', q('#page1 .gold-rule'), 'rule');

  add(list, 'p2.ref', 'Secondary Reference', 'Page 2', q('#page2 .p2-ref'), 'text');
  add(list, 'p2.label', 'Date Label', 'Page 2', q('#page2 .p2-label'), 'text');
  add(list, 'p2.date', 'Main Date', 'Page 2', q('#page2 .p2-date'), 'text');
  add(list, 'p2.rule', 'Gold Rule', 'Page 2', q('#page2 .gold-rule'), 'rule');

  ['page1', 'page2'].forEach(pid => {
    const label = pid === 'page1' ? 'Page 1' : 'Page 2';
    doc.querySelectorAll(`#${pid} .section`).forEach(sec => {
      const h2 = sec.querySelector('h2');
      if (!h2) return;
      const short = SHORT[h2.textContent.trim()] || h2.textContent.trim();
      const slug = short.toLowerCase().replace(/[^a-z]+/g, '');
      add(list, `${pid}.${slug}.wash`, `${short} Heading Wash`, label, sec.querySelector('.wash'), 'wash');
      add(list, `${pid}.${slug}.text`, `${short} Heading Text`, label, h2, 'text');
    });
  });

  add(list, 'p2.notes', 'Notes Area', 'Page 2', q('#notesRows'), 'block');
  add(list, 'p2.art.bracket', 'Bottom Right Artwork — Bracket', 'Page 2 artwork', q('#page2 .art-bracket'), 'art');
  add(list, 'p2.art.strata', 'Bottom Right Artwork — Dark Strata', 'Page 2 artwork', q('#page2 .art-strata'), 'art');
  add(list, 'p2.art.speckle', 'Bottom Right Artwork — Gold Speckle', 'Page 2 artwork', q('#page2 .art-speckle'), 'art');

  // The strips are ::before pseudo-elements, so they are driven by their tokens.
  list.push({
    key: 'tokens.strip', name: 'Left Accent Strips (all sections)', group: 'Tokens',
    el: doc.documentElement, kind: 'token', selector: ':root', style0: '',
    baseTransform: '', absolute: false,
    base: {
      stripW: parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue('--strip-w')),
      stripOp: parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue('--strip-op'))
    }
  });
  return list;
}

/* --------------------------------------------------------------- overrides */

const CONTROLS = {
  text:  ['dx', 'dy', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'opacity'],
  wash:  ['dx', 'dy', 'width', 'height', 'opacity'],
  art:   ['dx', 'dy', 'width', 'scale', 'rotate', 'opacity'],
  rule:  ['dx', 'dy', 'width', 'height', 'opacity'],
  block: ['dx', 'dy', 'opacity'],
  token: ['stripW', 'stripOp']
};

const SPEC = {
  dx:            { label: 'X offset',       unit: 'mm', min: -60, max: 60, step: .5, def: 0 },
  dy:            { label: 'Y offset',       unit: 'mm', min: -60, max: 60, step: .5, def: 0 },
  width:         { label: 'Width',          unit: 'mm', min: 5,  max: 220, step: .5 },
  height:        { label: 'Height',         unit: 'mm', min: 2,  max: 120, step: .5 },
  scale:         { label: 'Scale',          unit: '×',  min: .3, max: 2.5, step: .01, def: 1 },
  rotate:        { label: 'Rotation',       unit: '°',  min: -180, max: 180, step: 1, def: 0 },
  opacity:       { label: 'Opacity',        unit: '',   min: 0,  max: 1,   step: .01 },
  fontSize:      { label: 'Font size',      unit: 'mm', min: 1,  max: 40,  step: .1 },
  fontWeight:    { label: 'Font weight',    unit: '',   min: 300, max: 700, step: 100 },
  letterSpacing: { label: 'Letter spacing', unit: 'em', min: -.05, max: .4, step: .005 },
  lineHeight:    { label: 'Line height',    unit: '',   min: .8, max: 2,   step: .01 },
  stripW:        { label: 'Strip width',    unit: 'mm', min: .2, max: 4,   step: .1 },
  stripOp:       { label: 'Strip opacity',  unit: '',   min: 0,  max: 1,   step: .01 }
};

function currentValue(item, prop) {
  const o = state.overrides[item.key];
  if (o && prop in o.values) return o.values[prop];
  return baseValue(item, prop);
}

function baseValue(item, prop) {
  const b = item.base;
  switch (prop) {
    case 'dx': case 'dy': return 0;
    case 'scale': return 1;
    case 'rotate': return 0;
    case 'width': return mm(b.width);
    case 'height': return mm(b.height);
    case 'opacity': return +b.opacity.toFixed(2);
    case 'fontSize': return mm(b.fontSize);
    case 'fontWeight': return parseInt(b.fontWeight, 10) || 400;
    case 'letterSpacing': return +(b.letterSpacing / b.fontSize).toFixed(3);
    case 'lineHeight': return b.lineHeight === 'normal' ? 1.2
      : +(parseFloat(b.lineHeight) / b.fontSize).toFixed(2);
    case 'stripW': return b.stripW;
    case 'stripOp': return b.stripOp;
  }
}

function setOverride(item, prop, value) {
  const o = state.overrides[item.key] ||
    (state.overrides[item.key] = { name: item.name, selector: item.selector, values: {}, css: {} });
  if (value === null || value === baseValue(item, prop)) delete o.values[prop];
  else o.values[prop] = value;
  if (!Object.keys(o.values).length) delete state.overrides[item.key];
  applyAll();
}

function applyOne(item) {
  const o = state.overrides[item.key];
  const el = item.el;
  el.setAttribute('style', item.style0);          // always start from production
  if (item.kind === 'token') {
    doc.documentElement.style.removeProperty('--strip-w');
    doc.documentElement.style.removeProperty('--strip-op');
  }
  if (!o) return;

  const v = o.values, css = {};
  const px = n => n * PX;

  if (item.kind === 'token') {
    if ('stripW' in v) { doc.documentElement.style.setProperty('--strip-w', v.stripW + 'mm'); css['--strip-w'] = v.stripW + 'mm'; }
    if ('stripOp' in v) { doc.documentElement.style.setProperty('--strip-op', v.stripOp); css['--strip-op'] = String(v.stripOp); }
    o.css = css; return;
  }

  // position: absolutely-placed art moves by its own offsets so the review
  // edit and the eventual CSS are the same thing; in-flow text moves by a
  // transform, which is the only change that cannot disturb the layout.
  const dx = v.dx || 0, dy = v.dy || 0;
  if (dx || dy) {
    if (item.absolute) {
      const b = item.base, a = item.anchors;
      if (dx) {
        if (a.right && !a.left) {
          const r = mm(parseFloat(b.right)) - dx; el.style.right = r + 'mm'; css.right = r + 'mm';
        } else {
          const l = mm(parseFloat(b.left)) + dx; el.style.left = l + 'mm'; css.left = l + 'mm';
        }
      }
      if (dy) {
        if (a.bottom && !a.top) {
          const bo = mm(parseFloat(b.bottom)) - dy; el.style.bottom = bo + 'mm'; css.bottom = bo + 'mm';
        } else {
          const t = mm(parseFloat(b.top)) + dy; el.style.top = t + 'mm'; css.top = t + 'mm';
        }
      }
    } else {
      const t = `translate(${dx}mm, ${dy}mm) ${item.baseTransform}`.trim();
      el.style.transform = t; css.transform = t;
    }
  }

  const extra = [];
  if (v.scale && v.scale !== 1) extra.push(`scale(${v.scale})`);
  if (v.rotate) extra.push(`rotate(${v.rotate}deg)`);
  if (extra.length) {
    const pre = (dx || dy) && !item.absolute ? `translate(${dx}mm, ${dy}mm) ` : '';
    const t = `${pre}${extra.join(' ')} ${item.baseTransform}`.trim();
    el.style.transform = t; css.transform = t;
  }

  if ('width' in v)  { el.style.width  = v.width + 'mm';  css.width  = v.width + 'mm'; }
  if ('height' in v) { el.style.height = v.height + 'mm'; css.height = v.height + 'mm'; }
  if ('opacity' in v){ el.style.opacity = v.opacity;      css.opacity = String(v.opacity); }
  if ('fontSize' in v){ el.style.fontSize = v.fontSize + 'mm'; css['font-size'] = v.fontSize + 'mm'; }
  if ('fontWeight' in v){ el.style.fontWeight = v.fontWeight; css['font-weight'] = String(v.fontWeight); }
  if ('letterSpacing' in v){ el.style.letterSpacing = v.letterSpacing + 'em'; css['letter-spacing'] = v.letterSpacing + 'em'; }
  if ('lineHeight' in v){ el.style.lineHeight = v.lineHeight; css['line-height'] = String(v.lineHeight); }
  o.css = css;
  void px;
}

function applyAll() {
  const showOriginal = document.getElementById('showOriginal').checked;
  items.forEach(item => {
    if (showOriginal) {
      item.el.setAttribute('style', item.style0);
      if (item.kind === 'token') {
        doc.documentElement.style.removeProperty('--strip-w');
        doc.documentElement.style.removeProperty('--strip-op');
      }
    } else applyOne(item);
  });
  // the Notes rules follow the painting, so refit them whenever art moves
  try { win.fitNotesToArtwork(4); } catch (e) { /* production JS not ready */ }
  drawOverlay(); renderTree(); renderInspector(); runQA();
}

/* ------------------------------------------------------------------ layout */

function rectOf(el) { return el.getBoundingClientRect(); }
function pageOf(el) { return el.closest('.page'); }

function setZoom(z) {
  zoom = Math.min(3, Math.max(.15, z));
  stage.style.transform = `scale(${zoom})`;
  document.getElementById('zoomLabel').textContent = Math.round(zoom * 100) + '%';
  const w = frame.offsetWidth * zoom, h = frame.offsetHeight * zoom;
  stage.style.width = w + 'px'; stage.style.height = h + 'px';
}

function fitTo(what) {
  const box = document.getElementById('canvas').getBoundingClientRect();
  const target = what === 'spread' ? doc.querySelector('.spread') : doc.getElementById(what);
  if (!target) return;
  const r = rectOf(target);
  setZoom(Math.min((box.width - 60) / r.width, (box.height - 60) / r.height));
  requestAnimationFrame(() => {
    const c = document.getElementById('canvas');
    c.scrollLeft = r.left * zoom - 20; c.scrollTop = r.top * zoom - 20;
  });
}

/* ----------------------------------------------------------------- overlay */

function drawOverlay() {
  overlay.replaceChildren();

  if (sel && !document.getElementById('showOriginal').checked) {
    const r = rectOf(sel.el);
    const box = document.createElement('div');
    box.className = 'sel-box';
    box.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
    const tag = document.createElement('span');
    tag.className = 'sel-tag';
    tag.textContent = sel.name;
    tag.style.cssText = `left:0;top:0;font-size:${11 / zoom}px`;
    box.appendChild(tag);
    overlay.appendChild(box);
  }

  state.annotations.forEach(p => {
    const page = doc.getElementById('page' + p.page);
    if (!page) return;
    const r = rectOf(page);
    const el = document.createElement('button');
    el.className = 'pin' + (p.n === activePin ? ' active' : '');
    el.textContent = p.n;
    el.style.cssText =
      `left:${r.left + p.xMm * PX}px;top:${r.top + p.yMm * PX}px;` +
      `transform:scale(${1 / zoom});transform-origin:center`;
    el.onclick = ev => { ev.stopPropagation(); activePin = p.n; renderPins(); drawOverlay(); };
    overlay.appendChild(el);
  });
}

function hitTest(x, y) {
  let best = null, bestArea = Infinity;
  for (const item of items) {
    if (item.kind === 'token') continue;
    const r = rectOf(item.el);
    if (r.width < 1 || r.height < 1) continue;
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      const a = r.width * r.height;
      if (a < bestArea) { best = item; bestArea = a; }
    }
  }
  return best;
}

function pageAt(x, y) {
  for (const pid of ['page1', 'page2']) {
    const p = doc.getElementById(pid);
    const r = rectOf(p);
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
      return { page: pid === 'page1' ? 1 : 2, xMm: mm(x - r.left), yMm: mm(y - r.top) };
  }
  return null;
}

/* --------------------------------------------------------------- selection */

function select(item) { sel = item; drawOverlay(); renderTree(); renderInspector(); }

function renderTree() {
  const tree = document.getElementById('tree');
  tree.replaceChildren();
  let group = null;
  items.forEach(item => {
    if (item.group !== group) {
      group = item.group;
      const h = document.createElement('div');
      h.className = 'grp'; h.textContent = group;
      tree.appendChild(h);
    }
    const b = document.createElement('button');
    b.textContent = item.name;
    b.className = (sel && sel.key === item.key ? 'on ' : '') +
                  (state.overrides[item.key] ? 'edited' : '');
    b.onclick = () => select(item);
    tree.appendChild(b);
  });
}

function renderInspector() {
  const body = document.getElementById('selBody');
  document.getElementById('noSel').hidden = !!sel;
  body.hidden = !sel;
  if (!sel) return;

  document.getElementById('selName').textContent = sel.name;

  const geo = document.getElementById('geo');
  geo.replaceChildren();
  const rows = [];
  if (sel.kind !== 'token') {
    const r = rectOf(sel.el), p = rectOf(pageOf(sel.el));
    rows.push(['X from page left', mm(r.left - p.left) + ' mm'],
              ['Y from page top', mm(r.top - p.top) + ' mm'],
              ['Width', mm(r.width) + ' mm'],
              ['Height', mm(r.height) + ' mm']);
    const cs = win.getComputedStyle(sel.el);
    if (sel.kind === 'text') rows.push(
      ['Font size', mm(parseFloat(cs.fontSize)) + ' mm'],
      ['Font weight', cs.fontWeight],
      ['Letter spacing', (cs.letterSpacing === 'normal' ? 0
        : (parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(3)) + ' em'],
      ['Line height', cs.lineHeight === 'normal' ? 'normal'
        : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2)]);
    rows.push(['Opacity', (+cs.opacity).toFixed(2)],
              ['Transform', cs.transform === 'none' ? 'none' : 'set'],
              ['z-index', cs.zIndex]);
  }
  rows.push(['Selector', sel.selector.length > 34 ? '…' + sel.selector.slice(-32) : sel.selector]);
  rows.forEach(([k, v]) => {
    const tr = geo.insertRow();
    tr.insertCell().textContent = k;
    tr.insertCell().textContent = v;
  });

  const wrap = document.getElementById('controls');
  wrap.replaceChildren();
  (CONTROLS[sel.kind] || []).forEach(prop => {
    const spec = SPEC[prop];
    const val = currentValue(sel, prop);
    const row = document.createElement('div');
    row.className = 'ctl';
    row.innerHTML = `<label>${spec.label}</label>`;
    const range = document.createElement('input');
    const num = document.createElement('input');
    Object.assign(range, { type: 'range', min: spec.min, max: spec.max, step: spec.step, value: val });
    Object.assign(num, { type: 'number', min: spec.min, max: spec.max, step: spec.step, value: val });
    const push = v => { setOverride(sel, prop, +v); };
    range.oninput = e => { num.value = e.target.value; push(e.target.value); };
    num.oninput = e => { range.value = e.target.value; push(e.target.value); };
    row.append(range, num);
    const u = document.createElement('span');
    u.className = 'unit'; u.textContent = spec.unit;
    row.appendChild(u);
    wrap.appendChild(row);
  });
}

/* ------------------------------------------------------------- annotations */

let activePin = null;

function renderPins() {
  const ol = document.getElementById('pins');
  ol.replaceChildren();
  document.getElementById('pinCount').textContent = state.annotations.length;
  document.getElementById('pinHint').hidden = state.annotations.length > 0;
  state.annotations.forEach(p => {
    const li = document.createElement('li');
    li.value = p.n;
    li.innerHTML = `${p.text} <span class="where">page ${p.page} · ${p.xMm}mm, ${p.yMm}mm` +
                   (p.element ? ` · ${p.element}` : '') + '</span>';
    const del = document.createElement('button');
    del.textContent = '×';
    del.onclick = () => {
      state.annotations = state.annotations.filter(a => a !== p);
      renderPins(); drawOverlay();
    };
    li.appendChild(del);
    li.onclick = () => { activePin = p.n; renderPins(); drawOverlay(); };
    ol.appendChild(li);
  });
}

function addPin(at, item) {
  const text = prompt('Note for this spot:');
  if (!text) return;
  state.annotations.push({
    n: ++pinSeq, page: at.page, xMm: at.xMm, yMm: at.yMm,
    element: item ? item.name : null, text
  });
  renderPins(); drawOverlay();
}

/* ---------------------------------------------------------------------- QA */

function runQA() {
  const el = document.getElementById('qa');
  const dot = document.getElementById('qaDot');
  let problems = [];
  try { problems = win.assertNoPageOverflow(); } catch (e) { el.textContent = 'QA unavailable'; return; }

  const lines = [];
  const art = [...doc.querySelectorAll('#page2 .decor img')];
  let minGap = Infinity;
  doc.querySelectorAll('#notesRows .note-line').forEach(line => {
    const b = line.getBoundingClientRect();
    const left = Math.min(...art.map(a => win.inkSpanIn(a, b.top, b.bottom).left));
    if (isFinite(left)) minGap = Math.min(minGap, mm(left - b.right));
  });
  lines.push(`Notes safety gap: ${isFinite(minGap) ? minGap.toFixed(1) + ' mm' : 'no art in band'}`);

  ['page1', 'page2'].forEach(pid => {
    const p = doc.getElementById(pid);
    const last = [...p.querySelectorAll('.page-inner .section')].pop();
    const bottom = mm(last.getBoundingClientRect().bottom - p.getBoundingClientRect().top);
    lines.push(`${pid} content bottom: ${bottom.toFixed(1)} mm of 283`);
  });

  el.innerHTML = lines.map(l => `<div>${l}</div>`).join('') +
    (problems.length
      ? problems.map(p => `<div class="bad">⚠ ${p}</div>`).join('')
      : '<div>No overflow, overlap or clipping.</div>');
  dot.textContent = problems.length ? problems.length + ' issue' + (problems.length > 1 ? 's' : '') : 'clear';
  dot.className = 'dot ' + (problems.length ? 'bad' : 'ok');
}

/* --------------------------------------------------------------- transport */

async function post(path, body) {
  const r = await fetch(path, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

document.getElementById('save').onclick = async () => {
  const payload = { ...state, page: 'monday', savedAt: new Date().toISOString() };
  try {
    const r = await post('/api/save', payload);
    out.textContent = `Saved to ${r.file}\n${Object.keys(state.overrides).length} element override(s), ` +
                      `${state.annotations.length} note(s).`;
  } catch (e) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    a.download = 'monday-review.json'; a.click();
    out.textContent = 'Server not reachable — downloaded monday-review.json instead.\n' +
                      'Move it into review/ yourself, or start review/server.js.';
  }
};

document.getElementById('apply').onclick = async () => {
  if (!Object.keys(state.overrides).length) { out.textContent = 'No overrides to apply.'; return; }
  try {
    const r = await post('/api/apply', state);
    out.textContent = `Proposal written to ${r.file}\n\n${r.css}`;
  } catch (e) { out.textContent = 'Apply failed: ' + e.message; }
};

document.getElementById('resetSel').onclick = () => {
  if (!sel) return;
  delete state.overrides[sel.key];
  applyAll();
};
document.getElementById('resetAll').onclick = () => {
  if (!confirm('Discard all review adjustments? Annotations are kept.')) return;
  state.overrides = {};
  applyAll();
};

/* ------------------------------------------------------------------ events */

document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
  mode = b.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b));
  stage.classList.toggle('annotate', mode === 'annotate');
});
document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => {
  view = b.dataset.view;
  document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('on', x === b));
  fitTo(view);
});
document.querySelectorAll('[data-zoom]').forEach(b => b.onclick = () => {
  const z = b.dataset.zoom;
  if (z === 'fit') fitTo(view);
  else if (z === 'in') setZoom(zoom * 1.25);
  else if (z === 'out') setZoom(zoom / 1.25);
  else setZoom(+z);
  drawOverlay();
});
document.getElementById('showOriginal').onchange = applyAll;

let drag = null;
overlay.addEventListener('mousedown', e => {
  const x = e.offsetX, y = e.offsetY;
  if (mode === 'annotate') {
    const at = pageAt(x, y);
    if (at) addPin(at, hitTest(x, y));
    return;
  }
  const item = hitTest(x, y);
  if (!item) { sel = null; drawOverlay(); renderTree(); renderInspector(); return; }
  select(item);
  if (item.kind === 'token') return;
  drag = { item, x, y, dx0: currentValue(item, 'dx'), dy0: currentValue(item, 'dy') };
});

window.addEventListener('mousemove', e => {
  if (!drag) return;
  const r = overlay.getBoundingClientRect();
  const x = (e.clientX - r.left) / zoom, y = (e.clientY - r.top) / zoom;
  const snap = document.getElementById('snap').checked;
  const round = v => snap ? Math.round(v * 2) / 2 : +v.toFixed(2);
  setOverride(drag.item, 'dx', round(drag.dx0 + mm(x - drag.x)));
  setOverride(drag.item, 'dy', round(drag.dy0 + mm(y - drag.y)));
});
window.addEventListener('mouseup', () => { drag = null; });

/* -------------------------------------------------------------------- boot */

/* Boot is poll-based rather than tied to the iframe's load event. The planner
   pulls its webfonts from a CDN with a render-blocking <link>; if that request
   stalls (offline, or a slow CDN) the document never reaches "complete" and
   load never fires. Polling for the built spread means the tool comes up as
   soon as the page is actually usable, and says something useful if it never
   does. `?src=` points the frame at a variant instead of production. */
const SRC = new URLSearchParams(location.search).get('src');
if (SRC) frame.src = SRC;

function boot() {
  win = frame.contentWindow; doc = frame.contentDocument;
  if (!doc) {
    document.getElementById('bootHint').textContent =
      'Cannot read the spread — open this page over http:// (run: node review/server.js).';
    return;
  }
  // size the iframe to its content so nothing scrolls inside it
  const spread = doc.querySelector('.spread');
  const fit = () => {
    frame.style.width = doc.documentElement.scrollWidth + 'px';
    frame.style.height = doc.documentElement.scrollHeight + 'px';
  };
  fit();

  const start = () => {
    items = buildRegistry();
    document.getElementById('bootHint').remove();
    fit(); fitTo('spread');
    applyAll(); renderPins();
    out.textContent = 'Ready. The spread above is the production page — same DOM, CSS and assets.';
  };
  // Wait for webfonts and artwork, since every measurement depends on them —
  // but never block on them. Offline, the font request simply never settles,
  // and the tool is still useful against the fallback face.
  const ready = Promise.all([
    doc.fonts ? doc.fonts.ready : Promise.resolve(),
    ...[...doc.images].map(i => i.complete ? Promise.resolve()
      : new Promise(r => {
          i.addEventListener('load', r, { once: true });
          i.addEventListener('error', r, { once: true });
        }))
  ]);
  Promise.race([ready, new Promise(r => setTimeout(r, 4000))])
    .then(() => setTimeout(start, 120));
  void spread;
}

let waited = 0;
const poll = setInterval(() => {
  const d = frame.contentDocument;
  waited += 250;
  if (d && d.querySelector('#sentralRows tr')) { clearInterval(poll); boot(); return; }
  if (waited >= 12000) {
    clearInterval(poll);
    const hint = document.getElementById('bootHint');
    if (hint) hint.innerHTML =
      'The spread did not finish loading.<br>' +
      'Most likely the webfont CDN is unreachable — the planner loads Cormorant ' +
      'Garamond and Source Sans 3 from fonts.googleapis.com with a render-blocking ' +
      'link, and the page waits on it. Check your connection and reload.';
  }
}, 250);

window.addEventListener('resize', () => { if (items.length) drawOverlay(); });
