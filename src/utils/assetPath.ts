/**
 * Resolves a local or remote asset path correctly taking into account Vite's BASE_URL 
 * for GitHub Pages and subpath deployments. Future-proof for any asset type or URL scheme.
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

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // If path already starts with the cleanBase, return as is
  if (trimmed.startsWith(cleanBase)) {
    return trimmed;
  }

  // If path starts with base (without trailing slash), check if it matches
  if (base !== '/' && trimmed.startsWith(base)) {
    return trimmed;
  }

  // If path starts with leading slash
  if (trimmed.startsWith('/')) {
    const relativePart = trimmed.slice(1);
    if (cleanBase === '/') {
      return trimmed;
    }
    return `${cleanBase}${relativePart}`;
  }

  // If relative path without leading slash (e.g. 'cartography/foo.jpg' or './foo.jpg')
  const cleanRelative = trimmed.startsWith('./') ? trimmed.slice(2) : trimmed;
  if (cleanBase === '/') {
    return `/${cleanRelative}`;
  }
  return `${cleanBase}${cleanRelative}`;
};

