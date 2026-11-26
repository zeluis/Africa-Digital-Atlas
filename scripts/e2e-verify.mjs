#!/usr/bin/env node
/**
 * Automated E2E verification script for Afriata (Africa Data Atlas).
 *
 * Tests built `dist/` served at both `/` and `/Africa-Digital-Atlas/`:
 *  1. Build artifact checks (index.html, 404.html, docs/index.html, sw.js precache & runtimeCaching)
 *  2. Production Node server (`dist/server.cjs`) checks (/api/health, /docs -> /docs/, /api/* JSON 404)
 *  3. Static-only hosting simulation (GitHub Pages style 404.html + no /api/* backend):
 *     - Service Worker registration, activation, and controller takeover
 *     - Deep links: `#slave-trade?...`, `?tab=slave-trade&...`, and `/countries/NGA` via `404.html`
 *     - `./docs/` navigation (and docs subpage) with Service Worker active
 *     - Zero console 404/405 errors and zero `/api/*` requests on static-only mode
 *
 * Usage:
 *   node scripts/e2e-verify.mjs             # Builds & verifies `/` and `/Africa-Digital-Atlas/`, then restores default build
 *   node scripts/e2e-verify.mjs --no-restore
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const NO_RESTORE = process.argv.includes('--no-restore');
const SKIP_BUILD = process.argv.includes('--skip-build');
const ROOT_ONLY = process.argv.includes('--root-only');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function logStep(msg) {
  console.log(`\n[E2E] ${msg}`);
}

function logPass(msg) {
  console.log(`  ✓ ${msg}`);
}

function runBuild(envOverrides) {
  const label = `BASE_URL=${envOverrides.BASE_URL ?? '(default)'} DOCS_BASE=${envOverrides.DOCS_BASE ?? '(default)'} VITE_STATIC_ONLY=${envOverrides.VITE_STATIC_ONLY ?? '(default)'}`;
  logStep(`Building dist/ (${label})...`);
  execSync('npm run build', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...envOverrides,
    },
  });
}

function verifyBuildArtifacts(expectedBase, expectedDocsBase) {
  logStep(`Verifying build artifacts for base="${expectedBase}", docsBase="${expectedDocsBase}"...`);
  const required = ['index.html', '404.html', 'sw.js', 'manifest.webmanifest', 'docs/index.html', '.nojekyll'];
  for (const rel of required) {
    assert(fs.existsSync(path.join(DIST_DIR, rel)), `Missing dist/${rel}`);
  }

  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  assert(
    indexHtml.includes(`<meta name="afriata-base" content="${expectedBase}"`),
    `dist/index.html missing meta afriata-base="${expectedBase}"`
  );
  assert(
    indexHtml.includes(`${expectedBase}assets/index-`),
    `dist/index.html missing asset URL prefix "${expectedBase}assets/"`
  );

  const notFoundHtml = fs.readFileSync(path.join(DIST_DIR, '404.html'), 'utf8');
  assert(
    notFoundHtml.includes(`var configuredBase = '${expectedBase}'`),
    `dist/404.html missing configuredBase='${expectedBase}'`
  );

  const docsHtml = fs.readFileSync(path.join(DIST_DIR, 'docs/index.html'), 'utf8');
  assert(
    docsHtml.includes(`${expectedDocsBase}assets/`),
    `dist/docs/index.html missing docs asset prefix "${expectedDocsBase}assets/"`
  );

  const swJs = fs.readFileSync(path.join(DIST_DIR, 'sw.js'), 'utf8');
  assert(swJs.includes('precacheAndRoute'), 'dist/sw.js missing precacheAndRoute');
  assert(swJs.includes('"index.html"'), 'dist/sw.js missing index.html precache entry');
  assert(swJs.includes('"africa-final.svg"'), 'dist/sw.js missing africa-final.svg precache entry');
  assert(swJs.includes('un-data-cache'), 'dist/sw.js missing un-data-cache runtimeCaching rule');
  assert(swJs.includes('wikimedia-commons-cache'), 'dist/sw.js missing wikimedia-commons-cache runtimeCaching rule');

  logPass('All build artifacts, base metadata, docs links, and SW caches verified.');
}

function startStaticPagesServer(distDir, mountBase) {
  const normalizedMount = mountBase === '/' ? '/' : `/${mountBase.replace(/^\/+|\/+$/g, '')}/`;
  const mountNoSlash = normalizedMount === '/' ? '' : normalizedMount.slice(0, -1);

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(reqUrl.pathname);

      if (normalizedMount !== '/') {
        if (pathname === mountNoSlash) {
          res.writeHead(301, { Location: `${normalizedMount}${reqUrl.search}` });
          res.end();
          return;
        }
        if (!pathname.startsWith(normalizedMount)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found (outside mount base)');
          return;
        }
        pathname = '/' + pathname.slice(normalizedMount.length);
      }

      // Static-only host has no /api/* backend
      if (pathname === '/api' || pathname.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Not found on static host' }));
        return;
      }

      const safeRel = path.posix.normalize(pathname).replace(/^\/+/, '');
      let candidate = path.join(distDir, safeRel);

      if (pathname.endsWith('/')) {
        candidate = path.join(distDir, safeRel, 'index.html');
      } else if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        res.writeHead(301, { Location: `${normalizedMount}${safeRel}/${reqUrl.search}` });
        res.end();
        return;
      }

      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        const ext = path.extname(candidate).toLowerCase();
        const headers = {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        };
        if (path.basename(candidate) === 'sw.js') {
          headers['Cache-Control'] = 'no-cache';
        }
        res.writeHead(200, headers);
        fs.createReadStream(candidate).pipe(res);
        return;
      }

      // GitHub Pages serves dist/404.html with status 404 for unknown routes
      const notFoundPath = path.join(distDir, '404.html');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPath).pipe(res);
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({
        server,
        port: addr.port,
        origin: `http://127.0.0.1:${addr.port}`,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = http.createServer();
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on('error', reject);
  });
}

async function verifyNodeServer(mountBase) {
  const prefix = mountBase === '/' ? '' : `/${mountBase.replace(/^\/+|\/+$/g, '')}`;
  const port = await getFreePort();
  logStep(`Verifying dist/server.cjs at mount="${prefix || '/'}" (port ${port})...`);

  const child = spawn(process.execPath, [path.join(DIST_DIR, 'server.cjs')], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      BASE_PATH: prefix,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    const base = `http://127.0.0.1:${port}${prefix}`;
    let healthy = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`${base}/api/health`);
        if (res.ok) {
          const json = await res.json();
          if (json?.status === 'ok') {
            healthy = true;
            break;
          }
        }
      } catch {
        // Server still booting
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    assert(healthy, `dist/server.cjs failed /api/health at ${base}/api/health`);
    logPass(`${prefix || ''}/api/health -> 200 JSON { status: "ok" }`);

    const rootRes = await fetch(`${base}/`);
    assert(rootRes.status === 200, `Expected 200 at ${base}/, got ${rootRes.status}`);
    assert(rootRes.headers.get('x-frame-options') === null, `Expected X-Frame-Options unset on ${base}/, got ${rootRes.headers.get('x-frame-options')}`);
    const rootCsp = rootRes.headers.get('content-security-policy') || '';
    const rootScriptSrc = rootCsp.split(';').find((d) => d.trim().startsWith('script-src')) || '';
    assert(rootScriptSrc.includes("'self'"), `Missing script-src in SPA CSP: ${rootCsp}`);
    assert(!rootScriptSrc.includes("'unsafe-inline'"), `Unexpected unsafe-inline in production SPA script-src: ${rootScriptSrc}`);
    const rootHtml = await rootRes.text();
    assert(rootHtml.includes('<div id="root"></div>'), 'Root HTML missing #root');
    logPass(`${prefix || ''}/ -> 200 SPA HTML (strict CSP, X-Frame-Options unset)`);

    const docsRedirectRes = await fetch(`${base}/docs`, { redirect: 'manual' });
    assert(docsRedirectRes.status === 301, `Expected 301 at ${base}/docs, got ${docsRedirectRes.status}`);
    assert(
      docsRedirectRes.headers.get('location') === `${prefix}/docs/`,
      `Expected Location ${prefix}/docs/, got ${docsRedirectRes.headers.get('location')}`
    );
    logPass(`${prefix || ''}/docs -> 301 ${prefix}/docs/`);

    const docsRes = await fetch(`${base}/docs/`);
    assert(docsRes.status === 200, `Expected 200 at ${base}/docs/, got ${docsRes.status}`);
    const docsHtml = await docsRes.text();
    assert(docsHtml.includes('Afriata'), 'Docs HTML missing Afriata title');
    logPass(`${prefix || ''}/docs/ -> 200 VitePress HTML`);

    const api404Res = await fetch(`${base}/api/nonexistent-route`);
    assert(api404Res.status === 404, `Expected 404 at ${base}/api/nonexistent-route, got ${api404Res.status}`);
    const api404Json = await api404Res.json();
    assert(api404Json.error === 'API endpoint not found', 'Expected structured JSON 404 for unknown /api/*');
    logPass(`${prefix || ''}/api/nonexistent-route -> 404 JSON`);
  } finally {
    child.kill('SIGTERM');
    await new Promise((r) => child.once('exit', r));
  }
}

function loadPlaywright() {
  const candidates = [
    'playwright',
    'playwright-core',
    '/usr/local/share/bun-global/node_modules/playwright-core',
  ];
  for (const mod of candidates) {
    try {
      const pw = require(mod);
      if (pw?.chromium) return pw;
    } catch {
      // Try next
    }
  }
  return null;
}

function resolveChromiumExecutable(chromium) {
  const explicit = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell',
    '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
  ].filter(Boolean);

  for (const p of explicit) {
    if (fs.existsSync(p)) return p;
  }

  try {
    const def = chromium.executablePath();
    if (def && fs.existsSync(def)) return def;
  } catch {
    // Ignore
  }
  return undefined;
}

async function runHttpFallbackChecks(origin, mountBase) {
  logStep(`Running HTTP static checks for ${origin}${mountBase} (Playwright unavailable)...`);
  const homeRes = await fetch(`${origin}${mountBase}`);
  assert(homeRes.status === 200, `Expected 200 at ${mountBase}`);
  const docsRes = await fetch(`${origin}${mountBase}docs/`);
  assert(docsRes.status === 200, `Expected 200 at ${mountBase}docs/`);
  const notFoundRes = await fetch(`${origin}${mountBase}countries/NGA`);
  assert(notFoundRes.status === 404, `Expected 404 with 404.html at ${mountBase}countries/NGA`);
  const notFoundBody = await notFoundRes.text();
  assert(notFoundBody.includes(`configuredBase = '${mountBase}'`), '404.html missing configuredBase');
  logPass('HTTP static-host checks passed.');
}

async function runBrowserSuite(origin, mountBase) {
  const pw = loadPlaywright();
  const executablePath = pw ? resolveChromiumExecutable(pw.chromium) : undefined;
  if (!pw || !executablePath) {
    await runHttpFallbackChecks(origin, mountBase);
    return;
  }

  logStep(`Running headless Chromium E2E suite against static server at ${origin}${mountBase}...`);
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'afriata-e2e-'));
  const context = await pw.chromium.launchPersistentContext(userDataDir, {
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    viewport: { width: 1280, height: 800 },
  });

  try {
    const page = context.pages()[0] || (await context.newPage());

    let sameOriginErrors = [];
    let apiRequests = [];
    let console404Or405 = [];
    let pageErrors = [];
    let allowIntentional404Path = null;

    const resetMonitors = (intentional404 = null) => {
      sameOriginErrors = [];
      apiRequests = [];
      console404Or405 = [];
      pageErrors = [];
      allowIntentional404Path = intentional404;
    };

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (allowIntentional404Path && text.includes('status of 404')) {
          return;
        }
        if (/\b404\b|\b405\b|Not Found|Method Not Allowed/i.test(text)) {
          console404Or405.push(text);
        }
      }
    });

    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.origin === origin && /\/api(?:\/|$)/.test(url.pathname)) {
        apiRequests.push(req.url());
      }
    });

    page.on('response', (res) => {
      const url = new URL(res.url());
      if (url.origin === origin && res.status() >= 400) {
        if (allowIntentional404Path && url.pathname === allowIntentional404Path && res.status() === 404) {
          return;
        }
        sameOriginErrors.push(`${res.status()} ${url.pathname}`);
      }
    });

    const assertCleanMonitors = (label) => {
      assert(apiRequests.length === 0, `${label}: unexpected /api/* requests on static-only mode: ${apiRequests.join(', ')}`);
      assert(sameOriginErrors.length === 0, `${label}: same-origin HTTP errors: ${sameOriginErrors.join(', ')}`);
      assert(console404Or405.length === 0, `${label}: console 404/405 errors: ${console404Or405.join(' | ')}`);
      assert(pageErrors.length === 0, `${label}: uncaught page errors: ${pageErrors.join(' | ')}`);
    };

    // 1. Initial load + Service Worker activation & takeover
    resetMonitors();
    await page.goto(`${origin}${mountBase}`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });

    const swInfo = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return null;
      const reg = await navigator.serviceWorker.ready;
      const active = reg.active;
      if (active && active.state !== 'activated') {
        await new Promise((resolve) => {
          const onChange = () => {
            if (active.state === 'activated' || active.state === 'redundant') {
              active.removeEventListener('statechange', onChange);
              resolve();
            }
          };
          active.addEventListener('statechange', onChange);
        });
      }
      return {
        scope: new URL(reg.scope).pathname,
        state: reg.active?.state || null,
      };
    });
    assert(swInfo && swInfo.state === 'activated', `Service worker failed to activate: ${JSON.stringify(swInfo)}`);
    assert(swInfo.scope === mountBase, `Expected SW scope "${mountBase}", got "${swInfo.scope}"`);

    await page.reload({ waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });
    const hasController = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));
    assert(hasController, 'Service worker did not control page after reload');
    assertCleanMonitors('Home load & SW activation');
    logPass(`SW activated & controlling scope "${swInfo.scope}" with 0 errors and 0 /api/* calls`);

    try {
      await page.waitForSelector('main h1', { timeout: 15000 });
      await page.waitForTimeout(1400);
      await page.waitForFunction(
        () => {
          const btns = Array.from(document.querySelectorAll('[role="dialog"] button'));
          return btns.every((btn) => {
            let cur = btn;
            while (cur && cur !== document.body) {
              if (parseFloat(getComputedStyle(cur).opacity || '1') < 0.99) return false;
              cur = cur.parentElement;
            }
            return true;
          });
        },
        undefined,
        { timeout: 5000 }
      ).catch(() => {});
      const { AxeBuilder } = require('@axe-core/playwright');
      const axeResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = axeResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      assert(
        blocking.length === 0,
        `WCAG serious/critical violations on ${mountBase}: ${blocking
          .map((v) => `${v.id}(${v.impact}, ${v.nodes.length} nodes: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('; ')})`)
          .join(', ')}`
      );
      logPass(
        `@axe-core/playwright WCAG 2.0 AA check passed (0 critical/serious violations across ${axeResults.passes.length} rules)`
      );
    } catch (axeErr) {
      if (axeErr?.code === 'MODULE_NOT_FOUND') {
        console.warn('  ! @axe-core/playwright not installed; skipping WCAG browser scan.');
      } else {
        throw axeErr;
      }
    }

    // 2. Deep link: #slave-trade?...
    resetMonitors();
    await page.goto(
      `${origin}${mountBase}#slave-trade?from=1700&to=1800&origin=Bight%20of%20Benin`,
      { waitUntil: 'load', timeout: 30000 }
    );
    await page.waitForFunction(
      () => /Atlantic Slave Trade|Trans-Atlantic/i.test(document.body.innerText),
      { timeout: 15000 }
    );
    const hashAfterSlaveTrade = await page.evaluate(() => window.location.hash);
    assert(
      hashAfterSlaveTrade.startsWith('#slave-trade?'),
      `Expected hash to preserve #slave-trade?..., got "${hashAfterSlaveTrade}"`
    );
    assertCleanMonitors('Deep link #slave-trade?...');
    logPass(`Deep link ${hashAfterSlaveTrade} rendered SlaveTradeView cleanly`);

    // 3. Deep link: ?tab=slave-trade&...
    resetMonitors();
    await page.goto(
      `${origin}${mountBase}?tab=slave-trade&from=1750&to=1820`,
      { waitUntil: 'load', timeout: 30000 }
    );
    await page.waitForFunction(
      () => /Atlantic Slave Trade|Trans-Atlantic/i.test(document.body.innerText),
      { timeout: 15000 }
    );
    assertCleanMonitors('Deep link ?tab=slave-trade&...');
    logPass('Deep link ?tab=slave-trade&... rendered SlaveTradeView cleanly');

    // 4a. Deep link: /countries/NGA with SW active (clean-path fallback in App.tsx)
    resetMonitors();
    await page.goto(`${origin}${mountBase}countries/NGA`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      (expectedPath) =>
        window.location.pathname === expectedPath &&
        window.location.hash === '#countries/NGA' &&
        /Nigeria/i.test(document.body.innerText),
      mountBase,
      { timeout: 15000 }
    );
    assertCleanMonitors('Deep link /countries/NGA with SW active');
    logPass(`SW-controlled ${mountBase}countries/NGA normalized to ${mountBase}#countries/NGA and rendered Nigeria dossier`);

    // 4b. Deep link: /countries/NGA via 404.html redirect in fresh cold context (no SW registered yet)
    const coldBrowser = await pw.chromium.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    try {
      const coldContext = await coldBrowser.newContext({ viewport: { width: 1280, height: 800 } });
      const coldPage = await coldContext.newPage();
      const coldErrors = [];
      const coldApiRequests = [];
      coldPage.on('pageerror', (err) => coldErrors.push(err.message));
      coldPage.on('request', (req) => {
        const u = new URL(req.url());
        if (u.origin === origin && /\/api(?:\/|$)/.test(u.pathname)) coldApiRequests.push(req.url());
      });
      coldPage.on('response', (res) => {
        const u = new URL(res.url());
        if (u.origin === origin && res.status() >= 400 && !(u.pathname === `${mountBase}countries/NGA` && res.status() === 404)) {
          coldErrors.push(`${res.status()} ${u.pathname}`);
        }
      });
      await coldPage.goto(`${origin}${mountBase}countries/NGA`, { waitUntil: 'load', timeout: 30000 });
      await coldPage.waitForFunction(
        (expectedPath) =>
          window.location.pathname === expectedPath &&
          window.location.hash === '#countries/NGA' &&
          /Nigeria/i.test(document.body.innerText),
        mountBase,
        { timeout: 15000 }
      );
      assert(coldApiRequests.length === 0, `404.html cold context made /api/* calls: ${coldApiRequests.join(', ')}`);
      assert(coldErrors.length === 0, `404.html cold context errors: ${coldErrors.join(', ')}`);
      await coldContext.close();
      logPass(`Cold 404.html redirected ${mountBase}countries/NGA -> ${mountBase}#countries/NGA and rendered Nigeria dossier`);
    } finally {
      await coldBrowser.close();
    }

    // 5. ./docs/ navigation with SW active
    resetMonitors();
    await page.goto(`${origin}${mountBase}`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });
    const docsUrl = await page.evaluate(() => new URL('./docs/', window.location.href).href);
    await page.goto(docsUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => Boolean(document.querySelector('.VPHome, .VPDoc, #VPContent, .Layout')) && !document.querySelector('#root'),
      { timeout: 15000 }
    );
    const docsPath = await page.evaluate(() => window.location.pathname);
    assert(docsPath === `${mountBase}docs/`, `Expected docs pathname "${mountBase}docs/", got "${docsPath}"`);

    // Also navigate to a specific guide page inside docs with SW still active
    const guideUrl = await page.evaluate(() => new URL('./guide/cartography-map.html', window.location.href).href);
    await page.goto(guideUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => Boolean(document.querySelector('.VPDoc, #VPContent')) && /Cartography|Map/i.test(document.body.innerText),
      { timeout: 15000 }
    );
    assertCleanMonitors('./docs/ navigation with SW active');
    logPass(`./docs/ and guide page rendered VitePress docs (bypassing SPA SW fallback) with 0 errors`);

    // 6. Initial English load defers Google Translate injection
    resetMonitors();
    await page.goto(`${origin}${mountBase}`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });
    const hasTranslateOnEnglish = await page.evaluate(() => Boolean(document.getElementById('google-translate-script')));
    assert(!hasTranslateOnEnglish, 'Google Translate script should not load on initial English boot');
    assertCleanMonitors('Deferred translation bridge on English load');
    logPass('Google Translate bridge deferred on initial English load');

    // 7. #map interactive metric/layer toggle + country navigation
    resetMonitors();
    await page.evaluate(() => {
      try { localStorage.setItem('afriata_onboarding_v1', 'true'); } catch {}
    });
    await page.goto(`${origin}${mountBase}#map`, { waitUntil: 'load', timeout: 30000 });
    await page.reload({ waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#country-group-NGA path[id]', { timeout: 20000 });
    await page.getByRole('button', { name: /Choropleth/i }).first().click();
    await page.waitForFunction(
      () => /Choropleth|GDP|Population|HDI/i.test(document.body.innerText),
      undefined,
      { timeout: 10000 }
    );
    await page.locator('#country-group-NGA path[id]').first().evaluate((el) => {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    await page.getByRole('button', { name: /Open Country Dossier|Inspect Country Details/i }).click();
    await page.waitForFunction(
      () => window.location.hash.includes('countries/NGA') && /Nigeria/i.test(document.body.innerText),
      undefined,
      { timeout: 15000 }
    );
    assertCleanMonitors('#map interactive toggle & country navigation');
    logPass('#map Choropleth toggle & Nigeria country navigation passed');

    // 8. #ethnic-tree clean render & SVG vector display
    resetMonitors();
    await page.goto(`${origin}${mountBase}#ethnic-tree`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('main svg')).some((svg) => {
        const r = svg.getBoundingClientRect();
        return r.width > 100 && r.height > 100;
      }),
      undefined,
      { timeout: 20000 }
    );
    assertCleanMonitors('#ethnic-tree render');
    logPass('#ethnic-tree clean render & SVG vector display passed');

    // 9. #compare non-observed observation-status labels (Derived / Estimated / Forecast)
    resetMonitors();
    await page.goto(`${origin}${mountBase}#compare`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => /\b(derived|estimated|forecast)\b/i.test(document.body.innerText),
      undefined,
      { timeout: 15000 }
    );
    assertCleanMonitors('#compare observation-status labels');
    logPass('#compare rendered non-observed observation-status labels (Derived/Estimated/Forecast)');

    // 10. #provenance export headers (DOI + CC BY 4.0 + CORRECTIONS.md), Extended Offline Archive pinning, & offline navigation
    resetMonitors();
    await page.goto(`${origin}${mountBase}#provenance`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => /Empirical Data & Citation Export Engine/i.test(document.body.innerText),
      undefined,
      { timeout: 15000 }
    );

    const readDownload = async (trigger) => {
      const [download] = await Promise.all([page.waitForEvent('download'), trigger()]);
      const stream = await download.createReadStream();
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      return Buffer.concat(chunks).toString('utf8');
    };

    const csvText = await readDownload(() => page.getByRole('button', { name: /Download CSV \(\.csv\)/i }).first().click());
    assert(csvText.includes('10.6084/m9.figshare.34065711'), 'CSV export missing DOI');
    assert(csvText.includes('CC BY 4.0'), 'CSV export missing CC BY 4.0');
    assert(csvText.includes('CORRECTIONS.md'), 'CSV export missing CORRECTIONS.md');

    const jsonText = await readDownload(() => page.getByRole('button', { name: /Download JSON \(\.json\)/i }).click());
    assert(jsonText.includes('10.6084/m9.figshare.34065711'), 'JSON export missing DOI');
    assert(/CC[- ]BY[- ]4\.0/i.test(jsonText), 'JSON export missing CC BY 4.0');
    assert(jsonText.includes('CORRECTIONS.md'), 'JSON export missing CORRECTIONS.md');

    const bibText = await readDownload(() => page.getByRole('button', { name: /Download BibTeX \(\.bib\)/i }).click());
    assert(bibText.includes('10.6084/m9.figshare.34065711'), 'BibTeX export missing DOI');
    assert(bibText.includes('CC BY 4.0'), 'BibTeX export missing CC BY 4.0');
    assert(bibText.includes('CORRECTIONS.md'), 'BibTeX export missing CORRECTIONS.md');
    logPass('CSV, JSON, and BibTeX exports verified with DOI, CC BY 4.0, and CORRECTIONS.md lineage');

    const pinArchiveBtn = page.getByRole('button', { name: /Pin Extended Offline Archive/i });
    await pinArchiveBtn.scrollIntoViewIfNeeded();
    await pinArchiveBtn.click();
    await page.getByRole('button', { name: /Pinned \(Ready Offline\)/i }).waitFor({ state: 'visible', timeout: 30000 });
    const cachePinned = await page.evaluate(async () => {
      const cache = await caches.open('afriata-pinned-archive');
      const keys = await cache.keys();
      return keys.some((req) => req.url.includes('africa-final.svg')) && keys.some((req) => req.url.includes('afriata-ethnic-tree.svg'));
    });
    assert(cachePinned, 'Extended Field Offline Archive failed to pin required SVGs into caches');
    assertCleanMonitors('#provenance archive pin & exports');
    logPass('#provenance Extended Field Offline Archive pinned vectors into Cache Storage');

    // Offline navigation resilience
    resetMonitors();
    await context.setOffline(true);
    try {
      await page.goto(`${origin}${mountBase}#countries/NGA`, { waitUntil: 'load', timeout: 20000 });
      await page.reload({ waitUntil: 'load', timeout: 20000 });
      await page.waitForFunction(
        () => /Nigeria/i.test(document.body.innerText),
        undefined,
        { timeout: 15000 }
      );
      await page.goto(`${origin}${mountBase}#compare`, { waitUntil: 'load', timeout: 20000 });
      await page.waitForFunction(
        () => /\b(derived|estimated|forecast)\b/i.test(document.body.innerText),
        undefined,
        { timeout: 15000 }
      );
      assertCleanMonitors('Offline navigation resilience');
      logPass('Offline navigation resilience verified under context.setOffline(true)');
    } finally {
      await context.setOffline(false);
    }

  } finally {
    await context.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

async function runSuiteForMount({ label, buildEnv, expectedBase, expectedDocsBase, mountBase }) {
  console.log(`\n============================================================`);
  console.log(`E2E SUITE: ${label}`);
  console.log(`============================================================`);

  if (!SKIP_BUILD) {
    runBuild(buildEnv);
  }
  verifyBuildArtifacts(expectedBase, expectedDocsBase);

  execSync('node scripts/offline-audit.mjs --check', { cwd: ROOT_DIR, stdio: 'inherit' });
  execSync('node scripts/perf-budget.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });

  await verifyNodeServer(mountBase);

  const staticSrv = await startStaticPagesServer(DIST_DIR, mountBase);
  try {
    await runBrowserSuite(staticSrv.origin, mountBase);
  } finally {
    await staticSrv.close();
  }
}

async function main() {
  try {
    await runSuiteForMount({
      label: 'Root Deployment (/) — Static-Only + Node Server',
      buildEnv: {
        BASE_URL: '/',
        DOCS_BASE: '/docs/',
        VITE_STATIC_ONLY: 'true',
      },
      expectedBase: '/',
      expectedDocsBase: '/docs/',
      mountBase: '/',
    });

    if (!ROOT_ONLY) {
      await runSuiteForMount({
        label: 'GitHub Pages Subpath (/Africa-Digital-Atlas/) — Static-Only + Node Server',
        buildEnv: {
          BASE_URL: '/Africa-Digital-Atlas/',
          DOCS_BASE: '/Africa-Digital-Atlas/docs/',
          VITE_STATIC_ONLY: 'true',
        },
        expectedBase: '/Africa-Digital-Atlas/',
        expectedDocsBase: '/Africa-Digital-Atlas/docs/',
        mountBase: '/Africa-Digital-Atlas/',
      });
    }

    if (!NO_RESTORE && !SKIP_BUILD) {
      logStep('Restoring default root build (Cloud Run / Node production)...');
      runBuild({
        BASE_URL: './',
        DOCS_BASE: '/docs/',
        VITE_STATIC_ONLY: '',
      });
      await verifyNodeServer('/');
    }

    console.log('\nALL E2E VERIFICATION SUITES PASSED.');
  } catch (err) {
    console.error('\nE2E VERIFICATION FAILED:', err);
    process.exit(1);
  }
}

main();
