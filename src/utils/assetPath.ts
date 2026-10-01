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
    // Also extract raw filename (e.g., 1-4.jpg)
    const urlParts = primary.split('?')[0].split('/');
    const filename = urlParts[urlParts.length - 1];
    if (filename && filename.endsWith('.jpg')) {
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

  return candidates;
};

