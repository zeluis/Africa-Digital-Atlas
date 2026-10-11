#!/usr/bin/env node
// Measures the production build against perf/budget.json.
//   npm run build && node scripts/perf-budget.mjs          report + fail if a ceiling is exceeded
//   node scripts/perf-budget.mjs --init                    write current numbers as ceilings (+5%)
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = 'dist';
const kb = (n) => Math.round(n / 1024);
const gz = (f) => zlib.gzipSync(fs.readFileSync(f)).length;
const size = (f) => fs.statSync(f).size;
const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const rel = (u) => path.join(DIST, u.replace(/^\.\//, ''));

const entry = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
const preloads = [...html.matchAll(/rel="modulepreload"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
const css = [...html.matchAll(/rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
const startup = [entry, ...preloads].filter(Boolean).map(rel);

function* walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? yield* walk(p) : yield p; } }
const all = [...walk(DIST)];
const js = all.filter((f) => f.endsWith('.js') && !f.endsWith('sw.js') && !f.includes('workbox'));
const imgs = all.filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f));
let precacheStorageMB = null, precacheTransferMB = null;
if (fs.existsSync(path.join(DIST, 'sw.js'))) {
  const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
  const urls = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]);
  const have = urls.filter((u) => fs.existsSync(path.join(DIST, u)));
  precacheStorageMB = have.reduce((s, u) => s + size(path.join(DIST, u)), 0) / 1048576;
  precacheTransferMB = have.reduce((s, u) => s + (/\.(js|css|html|svg|json)$/.test(u) ? gz(path.join(DIST, u)) : size(path.join(DIST, u))), 0) / 1048576;
}
const biggestImg = imgs.map((f) => [f, size(f)]).sort((a, b) => b[1] - a[1])[0];

const m = {
  startupJsGzipKB: kb(startup.reduce((s, f) => s + gz(f), 0)),
  startupChunkCount: startup.length,
  entryRawKB: kb(size(rel(entry))),
  cssRawKB: kb(css.reduce((s, u) => s + size(rel(u)), 0)),
  totalJsRawMB: +(js.reduce((s, f) => s + size(f), 0) / 1048576).toFixed(1),
  precacheTransferMB: precacheTransferMB === null ? null : +precacheTransferMB.toFixed(1),
  precacheStorageMB: precacheStorageMB === null ? null : +precacheStorageMB.toFixed(1),
  largestImageKB: kb(biggestImg[1]),
};

if (process.argv.includes('--init')) {
  const ceil = Object.fromEntries(Object.entries(m).filter(([, v]) => v !== null).map(([k, v]) => [k, Math.ceil(v * 1.05 * 10) / 10]));
  const prev = fs.existsSync('perf/budget.json') ? JSON.parse(fs.readFileSync('perf/budget.json', 'utf8')) : {};
  fs.writeFileSync('perf/budget.json', JSON.stringify({ ...prev, ceilings: ceil }, null, 2) + '\n');
  console.log('ceilings written:', ceil); process.exit(0);
}

const budget = JSON.parse(fs.readFileSync('perf/budget.json', 'utf8'));
let fail = 0;
console.log('metric                 now      ceiling   target');
for (const [k, v] of Object.entries(m)) {
  const c = budget.ceilings?.[k], t = budget.targets?.[k];
  const over = c !== undefined && v !== null && v > c;
  if (over) fail++;
  console.log(`${k.padEnd(22)} ${String(v).padEnd(8)} ${String(c ?? '-').padEnd(9)} ${String(t ?? '-').padEnd(7)} ${over ? 'OVER CEILING' : ''}`);
}
console.log(`\nlargest image: ${biggestImg[0]}`);
console.log('startup chunks:\n  ' + startup.map((f) => `${path.basename(f)} (${kb(gz(f))} KB gz)`).join('\n  '));
if (fail) { console.error(`\n${fail} metric(s) over ceiling. Fix the regression, or justify it and update perf/budget.json in the same PR.`); process.exit(1); }
