import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        res = res.concat(walk(p));
      }
    } else {
      res.push(p);
    }
  });
  return res;
}

const allSrc = walk('src');
const allPublic = walk('public');
const allDocs = walk('docs');

console.log(`Source files: ${allSrc.length}, Public files: ${allPublic.length}, Docs files: ${allDocs.length}`);

// 1. Gather all URL matches
const urlMap = new Map();
const urlRegex = /https?:\/\/[^\s"'`<>]+/g;

allSrc.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    let u = match[0].replace(/[,\);]+$/, '');
    if (u.match(/\.(png|jpg|jpeg|svg|webp|gif)/i) || u.includes('images.unsplash.com') || u.includes('upload.wikimedia.org')) {
      if (!urlMap.has(u)) urlMap.set(u, []);
      urlMap.get(u).push(f);
    }
  }
});

console.log(`Total unique image/media URLs: ${urlMap.size}`);

// Print domain distribution
const domains = {};
for (const url of urlMap.keys()) {
  try {
    const host = new URL(url).hostname;
    domains[host] = (domains[host] || 0) + 1;
  } catch (e) {}
}
console.log('Domain breakdown:', domains);

// Sample test first 20 URLs with fetch HEAD
async function testUrls() {
  const sample = Array.from(urlMap.keys()).slice(0, 25);
  console.log(`\nTesting sample of ${sample.length} external image URLs...`);
  let okCount = 0;
  let failCount = 0;
  for (const url of sample) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 AfricaDataAtlas/1.0' } });
      clearTimeout(id);
      if (res.ok) {
        okCount++;
      } else {
        failCount++;
        console.log(`[HTTP ${res.status}] ${url}`);
      }
    } catch (err) {
      failCount++;
      console.log(`[ERR: ${err.message}] ${url}`);
    }
  }
  console.log(`URL test results: ${okCount} OK, ${failCount} failed out of ${sample.length}`);
}

await testUrls();
