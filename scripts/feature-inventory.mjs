#!/usr/bin/env node
// Guards "all functionality stays" while optimizing.
//   node scripts/feature-inventory.mjs --write   snapshot features into perf/features.json
//   node scripts/feature-inventory.mjs --check   fail if any snapshotted feature disappeared or became unreachable
import fs from 'node:fs';
import path from 'node:path';

function* walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? (f !== 'node_modules' && (yield* walk(p))) : yield p; } }
const src = [...walk('src')].filter((f) => /\.(ts|tsx)$/.test(f));
const read = (f) => fs.readFileSync(f, 'utf8');
const app = fs.existsSync('src/App.tsx') ? read('src/App.tsx') : '';

const views = src.filter((f) => f.startsWith('src/views/')).map((f) => path.basename(f).replace(/\.tsx?$/, '')).sort();
const lazy = [...app.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => path.basename(m[1])).sort();
const exporters = ['academicExport.ts', 'exportUtils.ts'].filter((f) => fs.existsSync('src/utils/' + f))
  .flatMap((f) => [...read('src/utils/' + f).matchAll(/export (?:async )?(?:function|const) (\w+)/g)].map((m) => `${f}:${m[1]}`)).sort();
const langs = fs.existsSync('src/i18n/translations.ts') ? [...read('src/i18n/translations.ts').matchAll(/^  ([a-z]{2}): \{/gm)].map((m) => m[1]) : [];

// reachable = referenced by at least one OTHER source file
const texts = src.map((f) => [f, read(f)]);
const unreachable = views.filter((v) => !texts.some(([f, t]) => !f.endsWith(`/${v}.tsx`) && t.includes(v)));

const now = { views, lazyImports: lazy, exportFunctions: exporters, languages: langs };
if (process.argv.includes('--write')) {
  fs.writeFileSync('perf/features.json', JSON.stringify(now, null, 2) + '\n');
  console.log(`snapshot: ${views.length} views, ${lazy.length} lazy imports, ${exporters.length} export functions, ${langs.length} languages`);
  if (unreachable.length) console.log('note, currently unreachable views:', unreachable.join(', '));
  process.exit(0);
}
const then = JSON.parse(read('perf/features.json'));
let lost = 0;
for (const k of Object.keys(then)) for (const item of then[k]) if (!now[k].includes(item)) { console.error(`LOST ${k}: ${item}`); lost++; }
for (const v of unreachable) if (then.views.includes(v)) { console.error(`UNREACHABLE view: ${v}`); lost++; }
for (const k of Object.keys(now)) for (const item of now[k]) if (!then[k].includes(item)) console.log(`new ${k}: ${item}`);
if (lost) { console.error(`\n${lost} feature(s) lost. Restore them, or say explicitly in the PR that they were removed on purpose and rerun --write.`); process.exit(1); }
console.log('feature inventory intact');
