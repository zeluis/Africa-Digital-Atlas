#!/usr/bin/env node
/**
 * Africa Data Atlas & Cartographic Observatory — View & Dynamic Chunk Guardrail
 * 
 * Verifies that:
 * 1. All views in src/views/*.tsx provide both named and standard default exports
 *    to prevent React hook dispatcher corruption during dynamic lazy-loading.
 * 2. Dynamically loaded modal dialogs in src/components provide default exports.
 * 3. vite.config.ts enforces React deduping and pre-bundles core runtime dependencies
 *    without accidentally including pure data packages (e.g. world-atlas).
 */
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
let errors = 0;

function fail(msg) {
  errors++;
  console.error(`[VIEW & CHUNK GUARD ERROR] ${msg}`);
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

console.log('=== Africa Data Atlas View & Dynamic Chunk Guardrail ===\n');

// 1. Verify all views in src/views/*.tsx
const viewsDir = path.join(rootDir, 'src/views');
if (fs.existsSync(viewsDir)) {
  const viewFiles = fs.readdirSync(viewsDir).filter(f => f.endsWith('.tsx'));
  console.log(`1. Auditing ${viewFiles.length} view modules in src/views/...`);
  
  for (const f of viewFiles) {
    const fullPath = path.join(viewsDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const hasDefault = /export\s+default\s+\w+/.test(content);
    const hasNamed = /export\s+(const|function)\s+\w+/.test(content);
    
    if (!hasDefault) {
      fail(`View ${f} is missing "export default <Component>;".`);
    } else if (!hasNamed) {
      fail(`View ${f} is missing a named component export.`);
    } else {
      pass(`src/views/${f} has dual named + default exports.`);
    }
  }
} else {
  fail('src/views directory not found!');
}

// 2. Verify modal components dynamically imported in App.tsx
const requiredModals = [
  'src/components/NavigationDrawer.tsx',
  'src/components/Footer.tsx',
  'src/components/SearchModal.tsx',
  'src/components/MultiSourceApiHubModal.tsx',
  'src/components/OnboardingModal.tsx',
  'src/components/KeyboardShortcutsModal.tsx',
  'src/components/UniversalMonographModal.tsx',
  'src/components/CartographicColophonModal.tsx',
  'src/components/WorkingPapersModal.tsx',
  'src/components/AcademicExportModal.tsx',
  'src/components/MethodologyAuditModal.tsx',
  'src/components/afcfta/AfcftaSimulatorModal.tsx',
  'src/components/EntityBlocsBrowser.tsx'
];

console.log(`\n2. Auditing ${requiredModals.length} lazy-loaded navigation and modal components...`);
for (const rel of requiredModals) {
  const full = path.join(rootDir, rel);
  if (!fs.existsSync(full)) {
    fail(`Component ${rel} does not exist.`);
    continue;
  }
  const content = fs.readFileSync(full, 'utf8');
  if (!/export\s+default\s+\w+/.test(content)) {
    fail(`Component ${rel} is missing "export default <Component>;".`);
  } else {
    pass(`${rel} has verified default export.`);
  }
}

// 3. Verify vite.config.ts configuration
console.log(`\n3. Auditing vite.config.ts optimization and deduplication settings...`);
const viteConfigPath = path.join(rootDir, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (!viteConfig.includes("dedupe: ['react', 'react-dom']")) {
    fail("vite.config.ts must specify resolve.dedupe: ['react', 'react-dom'] to prevent dual-instance React collisions.");
  } else {
    pass("vite.config.ts enforces React instance deduplication.");
  }
  
  const coreDeps = ['react', 'react-dom', 'lucide-react', 'motion', 'recharts', 'd3'];
  for (const dep of coreDeps) {
    if (!viteConfig.includes(`'${dep}'`)) {
      fail(`vite.config.ts optimizeDeps.include is missing '${dep}'.`);
    }
  }
  pass(`vite.config.ts pre-bundles essential UI & visualization dependencies (${coreDeps.join(', ')}).`);
  
  // Guard against non-JS data packages in optimizeDeps
  const optimizeDepsMatch = viteConfig.match(/optimizeDeps:\s*\{[\s\S]*?include:\s*\[([\s\S]*?)\]/);
  const optimizeDepsContent = optimizeDepsMatch ? optimizeDepsMatch[1] : '';
  if (optimizeDepsContent.includes("'world-atlas'")) {
    fail("vite.config.ts optimizeDeps.include must NOT include 'world-atlas' (pure JSON package lacks JS entry point).");
  } else {
    pass("vite.config.ts omits pure data packages from optimizeDeps.include.");
  }
} else {
  fail('vite.config.ts not found!');
}

console.log('\n=== Guardrail Audit Result ===');
if (errors > 0) {
  console.error(`FAILED: ${errors} violation(s) detected.`);
  process.exit(1);
} else {
  console.log('PASSED: All view exports, lazy modules, and bundler configurations verified with zero errors.');
  process.exit(0);
}
