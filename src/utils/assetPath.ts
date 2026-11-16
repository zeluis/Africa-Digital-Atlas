const KNOWN_APP_ROUTE_PREFIXES = new Set([
  'overview',
  'explore',
  'countries',
  'country',
  'regions',
  'region',
  'analytics',
  'map',
  'compare',
  'languages',
  'heritage',
  'provenance',
  'privacy',
  'pillars',
  'blocs',
  'slave-trade',
  'iconography',
  'archival-cartography',
  'molecular-legacies',
  'african-development-foundations',
  'ethnic-tree',
  'research-directory',
  'style-guide',
  'docs',
]);

function normalizeBaseSlash(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function isKnownAppRouteSegment(segment: string): boolean {
  const lower = segment.toLowerCase();
  if (KNOWN_APP_ROUTE_PREFIXES.has(lower)) return true;
  return /^(region-|report-|rep-|wp-|wkp-|afriata-working-paper-)/.test(lower);
}

export function inferMountBaseFromLocation(hostname: string, pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  // If any segment matches an internal app route (from pre-redirect deep link), base precedes it
  const routeIdx = segments.findIndex((seg) => isKnownAppRouteSegment(seg));
  if (routeIdx === 0) {
    return '/';
  }
  if (routeIdx > 0) {
    return `/${segments.slice(0, routeIdx).join('/')}/`;
  }

  // GitHub Pages project site (*.github.io/<repo>/...)
  if (hostname.endsWith('.github.io') || hostname === 'github.io') {
    if (!segments[0].includes('.')) {
      return `/${segments[0]}/`;
    }
    return '/';
  }

  // If path already ends in a slash, treat full directory as mount root
  if (pathname.endsWith('/')) {
    return normalizeBaseSlash(pathname);
  }

  // If last segment is a file (e.g. index.html), use parent directory;
  // otherwise treat '/subdir' (missing trailing slash) as the mount directory.
  const lastSeg = segments[segments.length - 1];
  if (lastSeg.includes('.')) {
    const parent = segments.slice(0, -1).join('/');
    return parent ? `/${parent}/` : '/';
  }
  return `/${segments.join('/')}/`;
}

/**
 * Determines the mounted application base path (always starts and ends with '/').
 * Works reliably on:
 * - GitHub Pages project sites (*.github.io/<repo>/) and user/org/CNAME root sites
 * - Any subdirectory host (/atlas, /team/atlas/) even without a trailing slash
 * - Root hosts (Cloud Run, Vercel, Netlify, Cloudflare Pages, localhost)
 */
export const resolveAppBasePath = (): string => {
  // 1. Explicit Vite BASE_URL when configured for root or a fixed subpath
  const metaBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '';
  if (metaBase && metaBase !== './' && metaBase !== '.') {
    return normalizeBaseSlash(metaBase);
  }

  // 2. HTML <meta name="afriata-base"> injected at build time if explicit
  if (typeof document !== 'undefined') {
    const metaTag = document.querySelector('meta[name="afriata-base"]')?.getAttribute('content');
    if (metaTag && metaTag !== './' && metaTag !== '.' && !metaTag.includes('%BASE_URL%')) {
      return normalizeBaseSlash(metaTag);
    }
  }

  // 3. Canonical script directory derived from compiled Vite bundle URL (<base>/assets/<chunk>.js)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url && import.meta.url.startsWith('http')) {
      const scriptPath = new URL(import.meta.url).pathname;
      const assetsMarker = scriptPath.lastIndexOf('/assets/');
      if (assetsMarker !== -1 && !scriptPath.includes('/src/utils/')) {
        const mountedDir = scriptPath.slice(0, assetsMarker + 1);
        return normalizeBaseSlash(mountedDir);
      }
    }
  } catch {
    // Fall through to window.location detection
  }

  // 4. Fallback window.location detection (used in dev/test when base is './')
  if (typeof window !== 'undefined' && window.location) {
    return inferMountBaseFromLocation(window.location.hostname, window.location.pathname);
  }

  return '/';
};

/**
 * Returns a stable, URL-safe deployment scope identifier for CacheStorage & IndexedDB isolation
 * when multiple apps share the same origin (e.g., username.github.io/app-a vs app-b).
 */
export const getDeploymentCacheScope = (): string => {
  const base = resolveAppBasePath().replace(/^\/|\/$/g, '');
  if (!base) return 'root';
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'root';
};

/**
 * Resolves a link targeting the built VitePress documentation bundle (`./docs/`).
 * Works safely even if the active app URL lacks a trailing slash (e.g. `/atlas`).
 */
export const resolveDocsPath = (subpath: string = ''): string => {
  const basePath = resolveAppBasePath();
  let cleanSub = subpath.trim().replace(/^\/+/, '');
  if (cleanSub.endsWith('.md')) {
    cleanSub = `${cleanSub.slice(0, -3)}.html`;
  }
  return `${basePath}docs/${cleanSub}`;
};

/**
 * Resolves local and remote asset paths robustly across all hosting platforms:
 * - GitHub Pages (*.github.io/<repo>/) and CNAME/User sites
 * - Subfolder deployments on any hosting provider (with or without trailing slash)
 * - Root-level deployments (Vercel, Netlify, Cloudflare Pages, Cloud Run, localhost)
 *
 * Guarantees 100% idempotency: calling resolveAssetPath() multiple times on an
 * already-resolved path will NEVER duplicate repository or subpath prefixes.
 */
export const resolveAssetPath = (path: string | undefined | null): string => {
  if (!path || typeof path !== 'string') return '';

  const trimmed = path.trim();
  if (!trimmed) return '';

  // Return absolute URLs, data URIs, blob URLs, or protocol-relative URLs as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('//')
  ) {
    return trimmed;
  }

  // Strip all leading './' and '/' to get pure relative asset path
  let clean = trimmed;
  while (clean.startsWith('./') || clean.startsWith('/')) {
    if (clean.startsWith('./')) clean = clean.slice(2);
    if (clean.startsWith('/')) clean = clean.slice(1);
  }

  const basePath = resolveAppBasePath();

  // Idempotency check: Strip any already-prepended base segments to prevent duplication
  const cleanBase = basePath.replace(/^\/|\/$/g, '');
  if (cleanBase) {
    while (clean.startsWith(`${cleanBase}/`)) {
      clean = clean.slice(cleanBase.length + 1);
    }
  }

  return `${basePath}${clean}`;
};

/**
 * Returns an ordered array of candidate URLs for an asset to guarantee zero broken images.
 * Useful for fallback handling in <img> onError event handlers.
 */
export const getAssetCandidateUrls = (path: string | undefined | null): string[] => {
  if (!path || typeof path !== 'string') return [];
  const primary = resolveAssetPath(path);
  if (!primary) return [];

  // Data or blob URLs don't have fallbacks
  if (primary.startsWith('data:') || primary.startsWith('blob:')) {
    return [primary];
  }

  const candidates: string[] = [primary];

  // For external remote URLs (e.g., si.regeneratedidentities.org)
  if (primary.startsWith('http://') || primary.startsWith('https://')) {
    // Check if this is a Slavery Images archival record (SI-OB-...)
    const regMatch = primary.match(/SI-OB-(\d+)/i);
    if (regMatch) {
      const regId = `SI-OB-${regMatch[1]}`;
      const localByRegId = resolveAssetPath(`/assets/archives/${regId}.jpg`);
      const relByRegId = `./assets/archives/${regId}.jpg`;
      const rootByRegId = `/assets/archives/${regId}.jpg`;
      if (!candidates.includes(localByRegId)) candidates.push(localByRegId);
      if (!candidates.includes(relByRegId)) candidates.push(relByRegId);
      if (!candidates.includes(rootByRegId)) candidates.push(rootByRegId);
    }
    // Extract raw filename (e.g., 1-4.jpg) and resolve to canonical SI-OB-{id}.jpg if numeric
    const urlParts = primary.split('?')[0].split('/');
    const filename = urlParts[urlParts.length - 1];
    if (filename && filename.endsWith('.jpg')) {
      const numMatch = filename.match(/^(\d+)-\d+\.jpg$/i);
      if (numMatch && !regMatch) {
        const canonicalName = `SI-OB-${numMatch[1]}.jpg`;
        const localCanonical = resolveAssetPath(`/assets/archives/${canonicalName}`);
        if (!candidates.includes(localCanonical)) candidates.push(localCanonical);
      }
      const localByName = resolveAssetPath(`/assets/archives/${filename}`);
      const relByName = `./assets/archives/${filename}`;
      const rootByName = `/assets/archives/${filename}`;
      if (!candidates.includes(localByName)) candidates.push(localByName);
      if (!candidates.includes(relByName)) candidates.push(relByName);
      if (!candidates.includes(rootByName)) candidates.push(rootByName);
    }
    return candidates;
  }

  // Clean relative path without leading slash
  let clean = path.trim();
  while (clean.startsWith('./') || clean.startsWith('/')) {
    if (clean.startsWith('./')) clean = clean.slice(2);
    if (clean.startsWith('/')) clean = clean.slice(1);
  }

  // Candidate 2: Relative to current HTML document (e.g. './castas/...')
  const relativeCandidate = `./${clean}`;
  if (!candidates.includes(relativeCandidate)) {
    candidates.push(relativeCandidate);
  }

  // Candidate 3: Root-relative (e.g. '/castas/...')
  const rootCandidate = `/${clean}`;
  if (!candidates.includes(rootCandidate)) {
    candidates.push(rootCandidate);
  }

  // Candidate 4: Castas thumbnail cross-fallback
  if (clean.includes('castas/thumbs/')) {
    const fullImg = resolveAssetPath(clean.replace('castas/thumbs/', 'castas/'));
    if (!candidates.includes(fullImg)) {
      candidates.push(fullImg);
    }
  } else if (clean.includes('castas/')) {
    const thumbImg = resolveAssetPath(clean.replace('castas/', 'castas/thumbs/'));
    if (!candidates.includes(thumbImg)) {
      candidates.push(thumbImg);
    }
  }

  // Candidate 5: WebP <-> JPG extension fallback for local optimized plates
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) {
    const webpPath = resolveAssetPath(clean.replace(/\.(jpe?g)$/i, '.webp'));
    if (!candidates.includes(webpPath)) {
      candidates.unshift(webpPath);
    }
  } else if (clean.endsWith('.webp')) {
    const jpgPath = resolveAssetPath(clean.replace(/\.webp$/i, '.jpg'));
    if (!candidates.includes(jpgPath)) {
      candidates.push(jpgPath);
    }
  }

  return candidates;
};

