#!/usr/bin/env node
/**
 * Build a self-contained static FTP upload directory (`dist-ftp/`)
 * with Node server files removed and Apache/cPanel `.htaccess` configured
 * for the target mount path (defaults to `/africa-atlas/`).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const FTP_DIR = path.join(ROOT, 'dist-ftp');

function normalizeSlashBase(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function parseArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const rawBase =
  parseArg('base') ??
  process.env.FTP_BASE_PATH ??
  process.env.BASE_URL ??
  '/africa-atlas/';

const baseUrl = normalizeSlashBase(rawBase);
const docsBase = normalizeSlashBase(
  parseArg('docs-base') ??
    process.env.DOCS_BASE ??
    (baseUrl === '/' ? '/docs/' : `${baseUrl}docs/`)
);

const buildEnv = {
  ...process.env,
  NODE_ENV: 'production',
  BASE_URL: baseUrl,
  DOCS_BASE: docsBase,
  VITE_STATIC_ONLY: 'true',
};

console.log(`=== Afriata FTP Static Bundle ===`);
console.log(`Target App Base : ${baseUrl}`);
console.log(`Target Docs Base: ${docsBase}`);

execSync('npx vite build', { cwd: ROOT, env: buildEnv, stdio: 'inherit' });
execSync('npm run docs:build', { cwd: ROOT, env: buildEnv, stdio: 'inherit' });

if (!fs.existsSync(DIST_DIR)) {
  throw new Error('Expected dist/ to exist after build.');
}

fs.rmSync(FTP_DIR, { recursive: true, force: true });
fs.mkdirSync(FTP_DIR, { recursive: true });

const EXCLUDED_FILES = new Set(['server.cjs', 'server.cjs.map']);

function copyDirClean(srcDir, destDir, isTopLevel = false) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (isTopLevel && EXCLUDED_FILES.has(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirClean(srcPath, destPath, false);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirClean(DIST_DIR, FTP_DIR, true);

// Ensure static hosting metadata files exist
const nojekyllPath = path.join(FTP_DIR, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
}

const notFoundPath = path.join(FTP_DIR, '404.html');
if (!fs.existsSync(notFoundPath)) {
  const src404 = path.join(ROOT, 'public/404.html');
  const raw404 = fs.readFileSync(src404, 'utf8').replace(/__AFRIATA_BASE__/g, baseUrl);
  fs.writeFileSync(notFoundPath, raw404);
}

const escapedBaseRegex = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Generate Apache / cPanel / LiteSpeed .htaccess for SPA deep links, PWA updates & MIME types
const htaccessContent = `# Afriata: Africa Data Atlas — Static Hosting Configuration
# Generated for mount path: ${baseUrl}

DirectoryIndex index.html

ErrorDocument 404 ${baseUrl}404.html

<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest
  AddType image/webp .webp
  AddType image/svg+xml .svg
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "^(index\\.html|404\\.html|sw\\.js|registerSW\\.js|manifest\\.webmanifest)$">
    Header set Cache-Control "no-cache, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${baseUrl}

  # Serve existing files and directories directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Do not rewrite documentation routes to the SPA root
  RewriteCond %{REQUEST_URI} !^${escapedBaseRegex}docs(/|$)
  RewriteRule ^ index.html [L]
</IfModule>
`;

fs.writeFileSync(path.join(FTP_DIR, '.htaccess'), htaccessContent, 'utf8');

// Verify critical output invariants
const requiredFiles = [
  'index.html',
  '404.html',
  'sw.js',
  'manifest.webmanifest',
  '.htaccess',
  '.nojekyll',
  'docs/index.html',
  'africa-final.svg',
];

for (const rel of requiredFiles) {
  const full = path.join(FTP_DIR, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing required FTP bundle file: dist-ftp/${rel}`);
  }
}

for (const excluded of EXCLUDED_FILES) {
  if (fs.existsSync(path.join(FTP_DIR, excluded))) {
    throw new Error(`Excluded server file unexpectedly present in dist-ftp/: ${excluded}`);
  }
}

const docsHtml = fs.readFileSync(path.join(FTP_DIR, 'docs/index.html'), 'utf8');
if (!docsHtml.includes(docsBase)) {
  throw new Error(`dist-ftp/docs/index.html does not contain expected docsBase (${docsBase}).`);
}

const indexHtml = fs.readFileSync(path.join(FTP_DIR, 'index.html'), 'utf8');
if (!indexHtml.includes(`<meta name="afriata-base" content="${baseUrl}"`)) {
  throw new Error(`dist-ftp/index.html afriata-base meta tag does not match ${baseUrl}.`);
}

// Cross-platform filesystem & GitHub Actions upload-artifact validation
// Ensures zero invalid characters (", *, :, <, >, |, ?, \r, \n) across the bundle
const ILLEGAL_CHARS = ['"', '*', ':', '<', '>', '|', '?', '\r', '\n'];
function auditDirFilenames(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ILLEGAL_CHARS.some(c => entry.name.includes(c))) {
      throw new Error(`Invalid filesystem character in dist-ftp file path: ${path.join(dir, entry.name)}`);
    }
    if (entry.isDirectory()) {
      auditDirFilenames(path.join(dir, entry.name));
    }
  }
}
auditDirFilenames(FTP_DIR);

console.log(`✓ FTP bundle verified cleanly at dist-ftp/ (base=${baseUrl}, docs=${docsBase})`);

