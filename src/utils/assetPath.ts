/**
 * Resolves local and remote asset paths robustly across all hosting platforms:
 * - GitHub Pages (*.github.io/<repo>/)
 * - GitHub Pages with custom domains
 * - Subfolder deployments on any hosting provider
 * - Root-level deployments (Vercel, Netlify, Cloud Run, localhost)
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

  // 1. Check if Vite BASE_URL is configured to a specific subpath (e.g. '/my-repo/')
  const metaBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '';
  let basePath = '/';

  if (metaBase && metaBase !== './' && metaBase !== '/') {
    basePath = metaBase.endsWith('/') ? metaBase : `${metaBase}/`;
  } else if (typeof window !== 'undefined' && window.location) {
    const { hostname, pathname } = window.location;
    
    // GitHub Pages standard subdomain: username.github.io/repository-name/
    if (hostname.endsWith('github.io')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0 && !segments[0].includes('.')) {
        basePath = `/${segments[0]}/`;
      }
    } else {
      // Generic subfolder detection on custom domains or third-party hosting
      const lastSlash = pathname.lastIndexOf('/');
      if (lastSlash > 0) {
        const dir = pathname.slice(0, lastSlash + 1);
        if (dir && dir !== '/') {
          basePath = dir.endsWith('/') ? dir : `${dir}/`;
        }
      }
    }
  }

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

  // For external or data URLs, only return primary
  if (
    primary.startsWith('http://') ||
    primary.startsWith('https://') ||
    primary.startsWith('data:') ||
    primary.startsWith('blob:')
  ) {
    return [primary];
  }

  // Clean relative path without leading slash
  let clean = path.trim();
  while (clean.startsWith('./') || clean.startsWith('/')) {
    if (clean.startsWith('./')) clean = clean.slice(2);
    if (clean.startsWith('/')) clean = clean.slice(1);
  }

  const candidates: string[] = [primary];

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

  return candidates;
};

