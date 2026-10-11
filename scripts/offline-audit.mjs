#!/usr/bin/env node
// Offline readiness audit. Run after `vite build`.
//   node scripts/offline-audit.mjs          report
//   node scripts/offline-audit.mjs --check  exit 1 if any app JS/CSS/font is not precached, or a perf/offline.json rule fails
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = 'dist';
const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
const precached = new Set([...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]));
const cfg = fs.existsSync('perf/offline.json') ? JSON.parse(fs.readFileSync('perf/offline.json', 'utf8')) : { mustPrecache: [] };
function* walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? yield* walk(p) : yield p; } }
const files = [...walk(DIST)].map((f) => path.relative(DIST, f));
const mb = (n) => (n / 1048576).toFixed(1);
const size = (f) => fs.statSync(path.join(DIST, f)).size;
const transfer = (f) => (/\.(js|css|html|svg|json)$/.test(f) ? zlib.gzipSync(fs.readFileSync(path.join(DIST, f))).length : size(f));

let problems = 0;
const section = (t) => console.log(`\n${t}`);

// 1. App code must work offline
const code = files.filter((f) => /^assets\/.*\.(js|css|woff2)$/.test(f) || f === 'index.html');
const missing = code.filter((f) => !precached.has(f));
section(`1. App code in the service-worker precache: ${code.length - missing.length}/${code.length}`);
missing.forEach((f) => console.log(`   NOT PRECACHED  ${f}  (${mb(size(f))} MB)  -> this view/feature fails offline until visited`));
problems += missing.length;

// 2. Rules from perf/offline.json
section('2. Required offline files');
for (const pat of cfg.mustPrecache) {
  const re = new RegExp(pat);
  const hit = [...precached].some((u) => re.test(u));
  console.log(`   ${hit ? 'ok     ' : 'MISSING'}  ${pat}`);
  if (!hit) problems++;
}

// 3. Cost
const pre = [...precached].filter((u) => files.includes(u));
section('3. Precache cost');
console.log(`   ${pre.length} files, storage ${mb(pre.reduce((s, u) => s + size(u), 0))} MB, approx first-visit transfer ${mb(pre.reduce((s, u) => s + transfer(u), 0))} MB`);

// 4. Local media that is neither precached nor covered by a runtime rule
const cfgTs = fs.existsSync('vite.config.ts') ? fs.readFileSync('vite.config.ts', 'utf8') : '';
const runtimeHosts = [...cfgTs.matchAll(/urlPattern:\s*\/\^https:\\\/\\\/(.+?)\\\//g)].map((m) => m[1].replace(/\\\./g, '.'));
const sameOriginRule = /urlPattern:\s*\(\s*\{\s*url\s*\}\s*\)/.test(cfgTs);
const media = files.filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !precached.has(f));
const mediaBytes = media.reduce((s, f) => s + size(f), 0);
section(`4. Local images not precached: ${media.length} files, ${mb(mediaBytes)} MB`);
console.log(sameOriginRule ? '   A same-origin runtime cache rule exists: images work offline after they have been viewed.'
  : '   No same-origin runtime cache rule: these images are NOT available offline (unless a custom cache such as the archival prewarm holds them).');

// 5. Remote hosts the UI depends on
const srcText = [...walk('src')].filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const hosts = {};
for (const m of srcText.matchAll(/https:\/\/([a-z0-9.-]+)\//g)) hosts[m[1]] = (hosts[m[1]] || 0) + 1;
const ignore = /doi\.org|creativecommons|w3\.org|github|orcid|zenodo|schema\.org|iconify|googleapis|gstatic/;
section('5. Remote hosts referenced in src/ (count) and whether a runtime cache rule covers them');
Object.entries(hosts).filter(([h]) => !ignore.test(h)).sort((a, b) => b[1] - a[1]).slice(0, 12)
  .forEach(([h, n]) => console.log(`   ${runtimeHosts.includes(h) ? 'cached  ' : 'NOT cached'}  ${h}  (${n})`));

if (process.argv.includes('--check') && problems) { console.error(`\n${problems} offline problem(s).`); process.exit(1); }
console.log(problems ? `\n${problems} problem(s) found.` : '\nOffline audit passed for app code.');
