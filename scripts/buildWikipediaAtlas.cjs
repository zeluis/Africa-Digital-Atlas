const fs = require('fs');
const https = require('https');

function cleanWiki(str) {
  if (!str) return '';
  return str
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\[\[([^|\]]+\|)?([^\]]+)\]\]/g, (m, p1, p2) => p2 || (p1 ? p1.replace(/\|$/, '') : ''))
    .replace(/''+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFirstWikiLink(str) {
  if (!str) return null;
  const m = str.match(/\[\[([^|\]#]+)(?:#[^|\]]+)?(?:\|([^\]]+))?\]\]/);
  if (m) {
    return {
      target: m[1].trim(),
      display: m[2] ? m[2].trim() : m[1].trim()
    };
  }
  return null;
}

const wikitext = fs.readFileSync('wiki_temp.txt', 'utf8');
const tableStart = wikitext.indexOf('{| class="wikitable');
const tableEnd = wikitext.indexOf('|}', tableStart);
const tableBody = wikitext.slice(tableStart, tableEnd);

const rawRows = tableBody.split(/\n\|-[^\n]*/);
console.log('Raw rows:', rawRows.length);

const entries = [];
for (let i = 1; i < rawRows.length; i++) {
  const row = rawRows[i].trim();
  if (!row) continue;
  const lines = row.split('\n');
  const cells = [];
  let currentCell = '';
  for (let line of lines) {
    if (line.trim().startsWith('|')) {
      if (currentCell) cells.push(currentCell.trim());
      currentCell = line.replace(/^\s*\|\s*/, '');
    } else {
      currentCell += ' ' + line.trim();
    }
  }
  if (currentCell) cells.push(currentCell.trim());

  if (cells.length >= 3) {
    const rawEth = cells[0];
    const rawLang = cells[1];
    const rawHome = cells[2];
    const rawSub = cells[3] || '';
    const rawRel = cells[4] || '';

    const firstLink = getFirstWikiLink(rawEth);
    const ethName = firstLink?.display || cleanWiki(rawEth);
    let article = firstLink?.target;
    if (!article) {
      article = ethName.includes('people') || ethName.includes('peoples') ? ethName : (ethName + ' people');
    }

    if (ethName && !ethName.startsWith('!')) {
      entries.push({
        name: ethName,
        article: article,
        languages: cleanWiki(rawLang),
        homeland: cleanWiki(rawHome),
        subgroups: cleanWiki(rawSub),
        religion: cleanWiki(rawRel)
      });
    }
  }
}

console.log('Total entries extracted from table:', entries.length);

// Also let's extract all ethnic labels from the SVG so we can cross-index them
const svg = fs.readFileSync('public/africalia-ethnic-tree.svg', 'utf8');
const allTexts = [...svg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)];
const svgLabels = new Set();
for (let m of allTexts) {
  const inner = m[2].replace(/<[^>]+>/g, '').trim();
  const idM = m[1].match(/id="([^"]+)"/);
  const id = idM ? idM[1] : '';
  if (inner && inner.length > 1 && !inner.startsWith('#') && (id.includes('ethnic') || id.includes('label'))) {
    svgLabels.add(inner);
  }
}
console.log('Unique SVG ethnic labels:', svgLabels.size);

// Save structured JSON
fs.writeFileSync('src/data/wikipediaTableEntries.json', JSON.stringify(entries, null, 2));
console.log('Saved src/data/wikipediaTableEntries.json');
