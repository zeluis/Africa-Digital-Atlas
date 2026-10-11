#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const rootDir = process.cwd();
const updateBaseline = process.argv.includes('--update-baseline');

const factsPath = path.join(rootDir, 'research/facts.json');
const rulesPath = path.join(rootDir, 'research/rules.json');
const datasetsPath = path.join(rootDir, 'research/datasets.json');
const hashesPath = path.join(rootDir, 'research/hashes.json');
const checksumsPath = path.join(rootDir, 'research/checksums.json');
const baselinePath = path.join(rootDir, 'research/lint-baseline.json');

const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const datasets = JSON.parse(fs.readFileSync(datasetsPath, 'utf8'));
const hashes = fs.existsSync(hashesPath) ? JSON.parse(fs.readFileSync(hashesPath, 'utf8')) : {};
const checksums = fs.existsSync(checksumsPath) ? JSON.parse(fs.readFileSync(checksumsPath, 'utf8')) : null;
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : { warnings: {} };

const TARGETS = [
  'src',
  'docs',
  'documentation',
  'help-center',
  'api-reference',
  'home',
  'README.md'
];

const EXT_REGEX = /\.(ts|tsx|md|mts)$/;

function collectFiles(targetPath, acc = []) {
  const fullPath = path.join(rootDir, targetPath);
  if (!fs.existsSync(fullPath)) return acc;
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    if (EXT_REGEX.test(fullPath)) acc.push(targetPath);
    return acc;
  }
  for (const entry of fs.readdirSync(fullPath)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const relChild = path.join(targetPath, entry);
    const fullChild = path.join(rootDir, relChild);
    if (fs.statSync(fullChild).isDirectory()) {
      collectFiles(relChild, acc);
    } else if (EXT_REGEX.test(entry)) {
      acc.push(relChild);
    }
  }
  return acc;
}

const files = [];
for (const t of TARGETS) collectFiles(t, files);

let errorCount = 0;
let warningCount = 0;

console.log(`=== Africa Data Atlas Research & Provenance Check ===`);
console.log(`Scanning ${files.length} files across ${TARGETS.join(', ')}...\n`);

// 1. Check text error rules
for (const errRule of rules.errors || []) {
  const regex = new RegExp(errRule.match, 'gi');
  for (const relFile of files) {
    const content = fs.readFileSync(path.join(rootDir, relFile), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (regex.test(line)) {
        errorCount++;
        console.error(`[ERROR] ${relFile}:${idx + 1} matches "${errRule.match}"`);
        console.error(`        Fix: ${errRule.fix}`);
      }
      regex.lastIndex = 0;
    });
  }
}

// 2. Check code pattern rules
for (const codeRule of rules.codePatterns || []) {
  const regex = new RegExp(codeRule.regex, 'g');
  for (const relFile of files) {
    if (!/\.(ts|tsx)$/.test(relFile)) continue;
    const content = fs.readFileSync(path.join(rootDir, relFile), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (regex.test(line)) {
        if (codeRule.level === 'error') {
          errorCount++;
          console.error(`[CODE ERROR] ${relFile}:${idx + 1} matches /${codeRule.regex}/`);
          console.error(`             ${codeRule.message}`);
        } else {
          warningCount++;
          console.warn(`[CODE WARN]  ${relFile}:${idx + 1} matches /${codeRule.regex}/`);
          console.warn(`             ${codeRule.message}`);
        }
      }
      regex.lastIndex = 0;
    });
  }
}

// 3. Check warnings and enforce ratchet against research/lint-baseline.json
const newBaselineWarnings = {};
for (const warnRule of rules.warnings || []) {
  const regex = new RegExp(warnRule.match, 'gi');
  const matchedFiles = [];
  let totalMatches = 0;
  for (const relFile of files) {
    const content = fs.readFileSync(path.join(rootDir, relFile), 'utf8');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      matchedFiles.push(relFile);
      totalMatches += matches.length;
    }
  }
  newBaselineWarnings[warnRule.match] = {
    maxFiles: matchedFiles.length,
    maxOccurrences: totalMatches
  };

  const baselineEntry = baseline.warnings?.[warnRule.match];
  if (matchedFiles.length > 0) {
    warningCount += matchedFiles.length;
    console.warn(`[WARN] "${warnRule.match}" found in ${matchedFiles.length} file(s) (${totalMatches} occurrence(s)) — Fix: ${warnRule.fix}`);
  }
  if (!updateBaseline && baselineEntry) {
    if (matchedFiles.length > baselineEntry.maxFiles) {
      errorCount++;
      console.error(`[RATCHET ERROR] Warning "${warnRule.match}" file count increased from baseline ${baselineEntry.maxFiles} to ${matchedFiles.length}.`);
    }
  }
}

if (updateBaseline) {
  const updated = {
    _readme: baseline._readme || 'Ratchet baseline for warning rules in research/rules.json.',
    updatedAt: new Date().toISOString(),
    warnings: newBaselineWarnings
  };
  fs.writeFileSync(baselinePath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log(`\n✓ Updated research/lint-baseline.json with current warning counts.`);
}

// 4. Verify dataset SHA-256 checksums against research/hashes.json, research/checksums.json, and methodologyDossierData.ts
const dossierPath = path.join(rootDir, 'src/data/methodologyDossierData.ts');
const dossierContent = fs.existsSync(dossierPath) ? fs.readFileSync(dossierPath, 'utf8') : '';

console.log(`\nVerifying SHA-256 checksums for ${datasets.length} tracked datasets...`);
for (const ds of datasets) {
  const fullDsPath = path.join(rootDir, ds);
  if (!fs.existsSync(fullDsPath)) {
    errorCount++;
    console.error(`[ERROR] Tracked dataset missing: ${ds}`);
    continue;
  }
  const buf = fs.readFileSync(fullDsPath);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  const expectedHash = hashes[ds]?.sha256;
  const expectedChecksum = checksums?.datasets?.[ds]?.sha256;

  if (expectedHash && expectedHash !== sha256) {
    errorCount++;
    console.error(`[ERROR] SHA-256 mismatch in research/hashes.json for ${ds}: expected ${expectedHash}, computed ${sha256}`);
  } else if (expectedChecksum && expectedChecksum !== sha256) {
    errorCount++;
    console.error(`[ERROR] SHA-256 mismatch in research/checksums.json for ${ds}: expected ${expectedChecksum}, computed ${sha256}`);
  } else {
    console.log(`  ✓ ${ds} (${buf.length.toLocaleString()} bytes) -> ${sha256.slice(0, 16)}...`);
  }
  if (dossierContent && !dossierContent.includes(sha256)) {
    errorCount++;
    console.error(`[ERROR] Published hash in src/data/methodologyDossierData.ts does not include ${ds} (${sha256})`);
  }
}

console.log(`\nHeadline facts (${facts.name}): ${facts.states} states, ${facts.pillars} pillars, ${facts.voyages.documented.toLocaleString()} voyages (${facts.voyages.yearsObserved}), ${facts.ethnicGroupList.entries} ethnic groups, DOI: ${facts.doi}.`);
console.log(`Result: ${errorCount} error(s), ${warningCount} warning(s).`);

if (errorCount > 0) {
  process.exit(1);
}
