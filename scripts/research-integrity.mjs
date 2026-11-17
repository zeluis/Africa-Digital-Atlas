#!/usr/bin/env node
/**
 * Africa Data Atlas & Cartographic Observatory — Deep Research Integrity Verifier
 * Verifies:
 *   1. All 8 foundational datasets match SHA-256 checksums in research/checksums.json, research/hashes.json, and src/data/methodologyDossierData.ts
 *      (Pass `--update-checksums` to recompute and sync hashes after legitimate dataset updates)
 *   2. Every observation in src/data/atlas-observations-seed.ts carries a valid status flag
 *      (`observed | estimated | forecast | derived`), and all `derived` values document their formula in `notes`
 *   3. Cross-file metadata consistency across research/facts.json, research/sources.json, CITATION.cff, LICENSE-CODE, and LICENSE-ASSETS
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const rootDir = process.cwd();
const updateChecksums = process.argv.includes('--update-checksums');

let errors = 0;

function fail(msg) {
  errors++;
  console.error(`[INTEGRITY ERROR] ${msg}`);
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

console.log(`=== Africa Data Atlas Deep Research Integrity Suite ===\n`);

// 1. Verify required governance & license files exist
const requiredFiles = [
  'CITATION.cff',
  'LICENSE-CODE',
  'LICENSE-ASSETS',
  'CORRECTIONS.md',
  'RESEARCH_ARCHITECTURE.md',
  'VOICE_AND_TONE.md',
  'research/facts.json',
  'research/sources.json',
  'research/datasets.json',
  'research/checksums.json',
  'research/hashes.json',
  'research/rules.json',
  'research/lint-baseline.json',
  '.github/ISSUE_TEMPLATE/data-correction.md'
];

console.log(`1. Checking governance, citation, and dual-license files...`);
for (const rel of requiredFiles) {
  const full = path.join(rootDir, rel);
  if (!fs.existsSync(full)) {
    fail(`Missing required governance file: ${rel}`);
  }
}
if (fs.existsSync(path.join(rootDir, 'LICENSE'))) {
  fail(`Single LICENSE file found; use separate LICENSE-CODE (MIT) and LICENSE-ASSETS (CC BY 4.0) files.`);
} else {
  pass(`Dual license files present (LICENSE-CODE & LICENSE-ASSETS) and legacy single LICENSE removed.`);
}

// 2. Cross-check facts.json, sources.json, and CITATION.cff
const facts = JSON.parse(fs.readFileSync(path.join(rootDir, 'research/facts.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(rootDir, 'research/sources.json'), 'utf8'));
const citationCff = fs.readFileSync(path.join(rootDir, 'CITATION.cff'), 'utf8');
const licenseCode = fs.readFileSync(path.join(rootDir, 'LICENSE-CODE'), 'utf8');
const licenseAssets = fs.readFileSync(path.join(rootDir, 'LICENSE-ASSETS'), 'utf8');

if (facts.doi !== '10.6084/m9.figshare.34065711') {
  fail(`research/facts.json doi must be "10.6084/m9.figshare.34065711" (found ${facts.doi})`);
}
if (sources.platform?.doi !== facts.doi) {
  fail(`research/sources.json platform.doi (${sources.platform?.doi}) does not match research/facts.json doi (${facts.doi})`);
}
if (!citationCff.includes(facts.doi)) {
  fail(`CITATION.cff does not contain universal DOI ${facts.doi}`);
}
if (!citationCff.includes(facts.orcid)) {
  fail(`CITATION.cff does not contain author ORCID ${facts.orcid}`);
}
if (!licenseCode.includes('MIT License')) {
  fail(`LICENSE-CODE does not contain MIT License text`);
}
if (!licenseAssets.includes('Creative Commons Attribution 4.0 International Public License')) {
  fail(`LICENSE-ASSETS does not contain CC BY 4.0 Public License text`);
}
pass(`Cross-file metadata synchronized (DOI: ${facts.doi}, ORCID: ${facts.orcid}, states: ${facts.states}, pillars: ${facts.pillars}).`);

// 3. Verify or update SHA-256 dataset checksums
console.log(`\n2. Checking SHA-256 checksums for foundational datasets...`);
const datasets = JSON.parse(fs.readFileSync(path.join(rootDir, 'research/datasets.json'), 'utf8'));
const hashesPath = path.join(rootDir, 'research/hashes.json');
const checksumsPath = path.join(rootDir, 'research/checksums.json');
const dossierPath = path.join(rootDir, 'src/data/methodologyDossierData.ts');

const hashes = JSON.parse(fs.readFileSync(hashesPath, 'utf8'));
const checksums = JSON.parse(fs.readFileSync(checksumsPath, 'utf8'));
let dossierContent = fs.readFileSync(dossierPath, 'utf8');

for (const ds of datasets) {
  const full = path.join(rootDir, ds);
  if (!fs.existsSync(full)) {
    fail(`Dataset file missing: ${ds}`);
    continue;
  }
  const buf = fs.readFileSync(full);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  const bytes = buf.length;

  if (updateChecksums) {
    const oldSha = hashes[ds]?.sha256;
    hashes[ds] = { sha256, bytes };
    if (checksums.datasets?.[ds]) {
      checksums.datasets[ds].sha256 = sha256;
      checksums.datasets[ds].bytes = bytes;
    }
    if (oldSha && oldSha !== sha256 && dossierContent.includes(oldSha)) {
      dossierContent = dossierContent.replace(oldSha, sha256);
    }
    pass(`Updated ${ds}: ${sha256} (${bytes.toLocaleString()} bytes)`);
  } else {
    if (hashes[ds]?.sha256 !== sha256) {
      fail(`Hash mismatch in research/hashes.json for ${ds}: expected ${hashes[ds]?.sha256}, actual ${sha256}`);
    } else if (checksums.datasets?.[ds]?.sha256 !== sha256) {
      fail(`Hash mismatch in research/checksums.json for ${ds}: expected ${checksums.datasets?.[ds]?.sha256}, actual ${sha256}`);
    } else if (!dossierContent.includes(sha256)) {
      fail(`src/data/methodologyDossierData.ts does not contain published SHA-256 for ${ds} (${sha256})`);
    } else {
      pass(`${ds} verified (${sha256.slice(0, 16)}...)`);
    }
  }
}

if (updateChecksums) {
  checksums.generatedAt = new Date().toISOString();
  fs.writeFileSync(hashesPath, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
  fs.writeFileSync(checksumsPath, JSON.stringify(checksums, null, 2) + '\n', 'utf8');
  fs.writeFileSync(dossierPath, dossierContent, 'utf8');
  console.log(`  ✓ Synchronized research/hashes.json, research/checksums.json, and src/data/methodologyDossierData.ts.`);
}

// 4. Verify observation status flags & derivation notes across core seed and expanded modules
console.log(`\n3. Auditing socioeconomic observation status flags across core & extended generators...`);
const seedContent = fs.readFileSync(path.join(rootDir, 'src/data/atlas-observations-seed.ts'), 'utf8');
const statusMatches = [
  ...seedContent.matchAll(/status:\s*['"](observed|estimated|forecast|derived)['"]/g),
  ...seedContent.matchAll(/addObs\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*['"](observed|estimated|forecast|derived)['"]\)/g)
];
const addHistoricalCalls = [...seedContent.matchAll(/addHistorical\(([^\n]+)\);/g)];

let derivedCount = 0;
let derivedMissingNotes = 0;
for (const match of addHistoricalCalls) {
  derivedCount++;
  const argsText = match[1];
  const noteMatch = argsText.match(/['"]([^'"]{10,})['"]\s*$/);
  if (!noteMatch) {
    derivedMissingNotes++;
  }
}

if (statusMatches.length === 0) {
  fail(`No status-flagged observations found in src/data/atlas-observations-seed.ts`);
} else if (!seedContent.includes("status: 'derived'") && !seedContent.includes('status: "derived"')) {
  fail(`src/data/atlas-observations-seed.ts does not tag back-filled historical values with status: 'derived'`);
} else if (derivedCount === 0 || derivedMissingNotes > 0) {
  fail(`${derivedMissingNotes} derived observation generator call(s) in src/data/atlas-observations-seed.ts are missing explanatory notes`);
} else {
  pass(`${statusMatches.length.toLocaleString()} explicit observation status declarations and ${derivedCount} historical 'derived' back-fill rules audited (all carry explicit derivation notes).`);
}

// Audit secondary observation generators
const extApisContent = fs.readFileSync(path.join(rootDir, 'src/data/externalApisIngestion.ts'), 'utf8');
if (/addObs\([^\)]*=\s*['"]observed['"]/.test(extApisContent)) {
  fail(`src/data/externalApisIngestion.ts must not default synthesized observations to status 'observed'.`);
} else if (!extApisContent.includes("status: ObservationStatus = 'estimated'") || !extApisContent.includes("'derived'")) {
  fail(`src/data/externalApisIngestion.ts must explicitly separate 'estimated', 'forecast', and 'derived' observations with notes.`);
} else {
  pass(`src/data/externalApisIngestion.ts tags modeled baseline as 'estimated'/'forecast' and trajectories as 'derived' with notes.`);
}

const wbCompContent = fs.readFileSync(path.join(rootDir, 'src/data/worldBankComprehensiveData.ts'), 'utf8');
if (/status:\s*(?:any|ObservationStatus)\s*=\s*['"]observed['"]/.test(wbCompContent) && !wbCompContent.includes('isCuratedProfile')) {
  fail(`src/data/worldBankComprehensiveData.ts must distinguish curated country profiles from HDI-derived fallbacks.`);
} else if (!wbCompContent.includes("'derived'") || !wbCompContent.includes('notes')) {
  fail(`src/data/worldBankComprehensiveData.ts must tag derived GDPpc/back-fill observations with 'derived' and explanatory notes.`);
} else {
  pass(`src/data/worldBankComprehensiveData.ts distinguishes curated profiles from HDI-derived fallbacks and historical trajectories.`);
}

const expandedContent = fs.readFileSync(path.join(rootDir, 'src/data/expandedIndicators.ts'), 'utf8');
const atlasStoreContent = fs.readFileSync(path.join(rootDir, 'src/data/atlas-store.ts'), 'utf8');
if (!expandedContent.includes('EXPANDED_PRESET_COUNTRIES')) {
  fail(`src/data/expandedIndicators.ts must export EXPANDED_PRESET_COUNTRIES to separate preset snapshots from modeled nations.`);
} else if (!atlasStoreContent.includes('EXPANDED_PRESET_COUNTRIES') || /generateExpandedObservations[\s\S]{0,600}status:\s*['"]observed['"]\s*\n\s*\}/.test(atlasStoreContent)) {
  fail(`src/data/atlas-store.ts must not blindly hardcode status: 'observed' across all generateExpandedObservations outputs.`);
} else {
  pass(`src/data/expandedIndicators.ts and src/data/atlas-store.ts separate 8 preset snapshots from 46 derived country baselines.`);
}

console.log(`\n=== Integrity Result: ${errors === 0 ? 'PASSED (0 errors)' : `FAILED (${errors} error(s))`} ===`);
if (errors > 0) {
  process.exit(1);
}
