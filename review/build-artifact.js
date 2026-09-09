#!/usr/bin/env node
/* Builds the phone review page from the real planner source.
   ---------------------------------------------------------------------------
   The desktop tool (review/monday.html) iframes monday/index.html directly. A
   hosted page cannot, so this generates a self-contained copy — but generates
   it, every time, from monday/index.html, monday/planner.css, monday/monday.js
   and the asset PNGs. Nothing is hand-maintained, so the review page cannot
   drift from what the planner actually renders. Rebuild after changing any of
   those files.

   Assets are re-encoded to WebP at their native pixel dimensions: no crop, no
   trim, no resize — the same picture at a size a phone can download. Print
   output still uses the untouched PNGs.

   Usage: node review/build-artifact.js */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = '/opt/pw-browsers/chromium';
const OUT = path.join(__dirname, 'monday-review-artifact.html');

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---- pull the spread out of the production page ------------------------- */
const page = read('monday/index.html');
const spread = page.match(/<div class="spread">[\s\S]*?\n<\/div>/);
if (!spread) throw new Error('could not find the spread markup in monday/index.html');

const assets = [...new Set([...spread[0].matchAll(/src="\.\.\/([^"]+)"/g)].map(m => m[1]))];
console.log('assets to inline:', assets.length);

/* ---- re-encode each asset to WebP via headless Chromium ----------------- */
async function encodeAssets() {
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--allow-file-access-from-files', '--remote-debugging-port=10251', 'about:blank'],
    { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1500));
  const list = await (await fetch('http://127.0.0.1:10251/json/list')).json();
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  });
  await new Promise(r => ws.addEventListener('open', r));
  const call = (method, params) => new Promise(r => {
    const i = ++id; pend.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const ev = async expr => {
    const m = await call('Runtime.evaluate',
      { expression: expr, returnByValue: true, awaitPromise: true });
    const d = m.result.exceptionDetails;
    if (d) throw new Error(d.exception ? d.exception.description : d.text);
    return m.result.result.value;
  };
  // A file:// document, so the canvas may read the local asset files: images
  // loaded from about:blank are cross-origin and taint the canvas.
  await call('Page.enable', {});
  await call('Page.navigate', { url: 'file://' + path.join(ROOT, 'monday/index.html') });
  await new Promise(r => setTimeout(r, 1200));

  const map = {};
  for (const rel of assets) {
    const uri = await ev(`(async()=>{
      const img=new Image(); img.src='file://${path.join(ROOT, rel)}'; await img.decode();
      const c=document.createElement('canvas');
      c.width=img.naturalWidth; c.height=img.naturalHeight;   // native size, no resize
      c.getContext('2d').drawImage(img,0,0);
      return c.toDataURL('image/webp',0.92);})()`);
    const png = fs.statSync(path.join(ROOT, rel)).size;
    map[rel] = uri;
    console.log(`  ${path.basename(rel).padEnd(28)} ${(png/1024).toFixed(0)}K png -> ` +
                `${(uri.length*0.75/1024).toFixed(0)}K webp`);
  }
  ws.close(); chrome.kill();
  return map;
}

/* ---- assemble ----------------------------------------------------------- */
(async () => {
  const uris = await encodeAssets();

  let markup = spread[0];
  for (const [rel, uri] of Object.entries(uris))
    markup = markup.split(`../${rel}`).join(uri);

  const commit = require('child_process')
    .execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();

  // Function replacements throughout: a string replacement would treat $& and
  // friends in the planner's own source as substitution patterns.
  const put = (s, token, value) => {
    if (!s.includes(token)) throw new Error('placeholder missing: ' + token);
    return s.replace(token, () => value);
  };

  let html = read('review/artifact-shell.html');
  html = put(html, '"__PLANNER_CSS__"', JSON.stringify(read('monday/planner.css')));
  html = put(html, '"__SPREAD_HTML__"', JSON.stringify(markup));
  html = put(html, '"__BUILT_FROM__"', JSON.stringify(
    `${commit} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`));
  // monday.js goes in as source, inside the runPlanner() wrapper.
  html = put(html, '/*__PLANNER_JS__*/', read('monday/monday.js'));

  fs.writeFileSync(OUT, html);
  console.log(`\nwrote ${path.relative(ROOT, OUT)}  (${(html.length/1048576).toFixed(2)} MB)`);
})();
