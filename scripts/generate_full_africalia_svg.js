import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data
import {
  VBW,
  VBH,
  CX,
  CY,
  AFRICALIA_COUNTRY_CONDUITS,
  CENTRAL_LOBE_NODES,
  TAST_COHORTS
} from '../src/data/africaliaMasterTreeData.ts';

function generateFullSvg() {
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VBW} ${VBH}" width="${VBW}" height="${VBH}" id="africalia-master-sovereign-svg">
<defs>
  <style>
    .cls-bg { fill: #f4f1ea; }
    .dark .cls-bg { fill: #121510; }
    .cls-center { fill: #486834; }
    .cls-center-text { fill: #ffffff; font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; text-anchor: middle; }
    .cls-tast-ring { fill: none; stroke-dasharray: 10 10; opacity: 0.85; }
    .cls-tast-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 700; }
    .cls-country-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 800; text-anchor: middle; letter-spacing: 0.05em; }
    .cls-ethnic-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; fill: #2c3e2d; }
    .dark .cls-ethnic-label { fill: #d8e2d4; }
    .cls-central-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; }
    .cls-trunk { fill: none; opacity: 0.85; stroke-linecap: round; }
    .cls-feeder { fill: none; stroke: #999999; stroke-width: 1.2; stroke-dasharray: 4 4; opacity: 0.6; }
    .cls-cabo-box { fill: #ffffff; stroke: #a4723a; stroke-width: 2.5; rx: 12px; }
    .dark .cls-cabo-box { fill: #1c221a; stroke: #c4925a; }
    .cls-cabo-title { font-family: 'Times New Roman', serif; font-size: 16px; font-weight: 800; fill: #a4723a; text-anchor: middle; }
  </style>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="6" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
  </filter>
</defs>

<!-- Background Canvas Layer -->
<rect width="${VBW}" height="${VBH}" class="cls-bg" id="africalia-canvas-bg" />

<!-- TAST Quantitative Ring Overlays -->
<g id="QUANT" class="tast-quant-layer">
  <!-- First Cohort Ring -->
  <circle cx="${CX}" cy="${CY}" r="418.57" class="cls-tast-ring" stroke="#049b4d" stroke-width="3" id="quant--first--circle--totals--5691458" />
  <text x="${CX}" y="${CY - 425}" fill="#049b4d" class="cls-tast-label" text-anchor="middle" id="quant--first--value--totals--5691458">5,694,581</text>
  
  <!-- Second Cohort Ring -->
  <circle cx="${CX}" cy="${CY}" r="627.85" class="cls-tast-ring" stroke="#e06ba1" stroke-width="3.5" id="quant--second--circle--totals--4804369" />
  <text x="${CX}" y="${CY - 635}" fill="#e06ba1" class="cls-tast-label" text-anchor="middle" id="quant--second--value--totals--4804369">4,802,952</text>
  
  <!-- Third Cohort Ring -->
  <circle cx="${CX}" cy="${CY}" r="837.14" class="cls-tast-ring" stroke="#a4723a" stroke-width="3.5" id="quant--third--circle--totals--2025527" />
  <text x="${CX}" y="${CY - 845}" fill="#a4723a" class="cls-tast-label" text-anchor="middle" id="quant--third--value--totals--2025527">2,023,821</text>
</g>

<!-- Central Origin Center -->
<g id="ORIGIN">
  <circle cx="${CX}" cy="${CY}" r="32" class="cls-center" id="node--origin-africa" />
  <circle cx="${CX}" cy="${CY}" r="40" fill="none" stroke="#486834" stroke-width="2" stroke-dasharray="6 6" />
  <text x="${CX}" y="${CY + 5}" class="cls-center-text" id="label--origin--africa">AFRICA</text>
</g>

<!-- Sovereign Country Trunk Conduits & Feeder Branches -->
<g id="CONDUITS">
`;

  // Draw Country Trunks and Feeders
  for (const c of AFRICALIA_COUNTRY_CONDUITS) {
    const strokeW = Math.max(3, Math.min(10, c.tastVolumeShare * 0.4));
    svg += `  <g id="branch--country--${c.id}" class="country-conduit-group" data-country="${c.name}" data-region="${c.region}">\n`;
    svg += `    <!-- Main Trunk -->\n`;
    svg += `    <path d="M${c.trunkStartX},${c.trunkStartY} C${c.controlX1},${c.controlY1} ${c.controlX2},${c.controlY2} ${c.trunkEndX},${c.trunkEndY}" stroke="${c.color}" stroke-width="${strokeW}" class="cls-trunk" id="trunk--${c.id}" />\n`;
    
    // Country Node
    svg += `    <circle cx="${c.trunkEndX}" cy="${c.trunkEndY}" r="8" fill="${c.color}" id="node--country--${c.id}" />\n`;
    
    // Country Label
    svg += `    <text x="${c.labelX}" y="${c.labelY}" fill="${c.color}" class="cls-country-label" id="label--country--${c.id}">${c.name.toUpperCase()}</text>\n`;

    // Ethnic Feeders & Terminal Circles
    for (let i = 0; i < c.ethnicGroups.length; i++) {
      const eg = c.ethnicGroups[i];
      const ethId = `node--ethnic--${c.id}--${eg.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      svg += `    <!-- Feeder to ${eg.name} -->\n`;
      svg += `    <line x1="${c.trunkEndX}" y1="${c.trunkEndY}" x2="${eg.nodeX}" y2="${eg.nodeY}" class="cls-feeder" />\n`;
      svg += `    <circle cx="${eg.nodeX}" cy="${eg.nodeY}" r="${eg.r}" fill="${c.color}" stroke="#ffffff" stroke-width="1.5" id="${ethId}" class="ethnic-terminal-node" />\n`;
      
      // Determine label placement
      const textAnchor = eg.nodeX > CX ? 'start' : 'end';
      const textOffsetX = eg.nodeX > CX ? eg.r + 5 : -(eg.r + 5);
      svg += `    <text x="${eg.nodeX + textOffsetX}" y="${eg.nodeY + 4}" class="cls-ethnic-label" text-anchor="${textAnchor}">${eg.name}</text>\n`;
    }
    svg += `  </g>\n\n`;
  }

  svg += `</g>\n\n<!-- Central Lobe Embarkation Nodes (Brown Circles) -->\n<g id="CENTRAL_LOBES">\n`;

  for (const node of CENTRAL_LOBE_NODES) {
    svg += `  <g id="node--central--${node.id}" class="central-lobe-group" data-cluster="${node.cluster}" data-subregion="${node.subregion}">\n`;
    svg += `    <circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${node.fill}" stroke="#ffffff" stroke-width="1.2" id="${node.id}" />\n`;
    if (node.r >= 13) {
      svg += `    <text x="${node.x}" y="${node.y}" class="cls-central-label">${node.label}</text>\n`;
    }
    svg += `  </g>\n`;
  }

  svg += `</g>\n\n<!-- Cabo Verde Oceanic Crucible Callout -->\n<g id="GEO_CABO_VERDE">\n`;
  svg += `  <line x1="${CX}" y1="${CY}" x2="1380" y2="1860" stroke="#a4723a" stroke-width="3" stroke-dasharray="6 6" id="assoc--cabo-verde--transatlantic-hub" />\n`;
  svg += `  <circle cx="1380" cy="1860" r="32" fill="#a4723a" stroke="#ffffff" stroke-width="3" id="node--geo--cabo-verde" />\n`;
  svg += `  <text x="1380" y="1865" class="cls-center-text">CABO VERDE</text>\n`;
  svg += `  <text x="1380" y="1905" class="cls-cabo-title">Oceanic Crucible &amp; Hub</text>\n`;
  svg += `</g>\n\n</svg>\n`;

  return svg;
}

const outputPath = path.resolve(__dirname, '../public/africalia-ethnic-tree.svg');
const svgContent = generateFullSvg();
fs.writeFileSync(outputPath, svgContent, 'utf-8');
console.log(`Successfully generated full sovereign SVG at ${outputPath} (Size: ${svgContent.length} bytes)`);
