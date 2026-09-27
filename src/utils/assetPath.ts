/**
 * Resolves local and remote asset paths robustly across all hosting platforms
 * (GitHub Pages subpaths, Vercel, Netlify, and local development).
 * Converts absolute public paths to portable relative paths (`./...`).
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

  // Strip leading slash or dot-slash to get clean relative asset path
  let clean = trimmed;
  if (clean.startsWith('./')) {
    clean = clean.slice(2);
  }
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';

  // If base is root or relative, use `./` for universal host compatibility
  if (base === './' || base === '' || base === '/') {
    return `./${clean}`;
  }

  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${clean}`;
};
