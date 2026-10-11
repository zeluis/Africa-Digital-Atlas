#!/usr/bin/env node
// Writes WebP copies (max 1600px wide) next to the originals and prints the savings. Originals are never deleted.
//   node scripts/optimize-images.mjs public/assets/images public/cartography public/castas
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp'; // already a devDependency

const MAX_W = 1600, QUALITY = 78;
function* walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? yield* walk(p) : yield p; } }
let before = 0, after = 0, n = 0;
for (const dir of process.argv.slice(2)) {
  if (!fs.existsSync(dir)) { console.error(`skip (missing): ${dir}`); continue; }
  for (const f of walk(dir)) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const out = f.replace(/\.(jpe?g|png)$/i, '.webp');
    if (fs.existsSync(out)) continue;
    await sharp(f).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    before += fs.statSync(f).size; after += fs.statSync(out).size; n++;
  }
}
console.log(`${n} files: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB (${before ? Math.round((1 - after / before) * 100) : 0}% smaller). Now update references from .jpg/.png to .webp, then delete originals only after checking.`);
