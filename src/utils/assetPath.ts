/**
 * Resolves a local or remote asset path correctly taking into account Vite's BASE_URL 
 * and GitHub Pages subpath deployments. Bulletproof against broken image links across all environments.
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

  // Get base from Vite environment
  const envBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
  
  // Normalize base
  let cleanBase = envBase;
  if (!cleanBase.endsWith('/')) {
    cleanBase = `${cleanBase}/`;
  }

  // Strip leading slash or dot-slash to obtain clean relative path
  let stripped = trimmed;
  if (stripped.startsWith('./')) {
    stripped = stripped.slice(2);
  } else if (stripped.startsWith('/')) {
    stripped = stripped.slice(1);
  }

  // If deployed on GitHub Pages with subpath (e.g. https://owner.github.io/africa-atlas/)
  // and envBase was left at '/' or './', inspect window.location.pathname
  if (typeof window !== 'undefined' && window.location) {
    const pathname = window.location.pathname || '';
    const segments = pathname.split('/').filter(Boolean);
    
    // Check if the first segment is a repository subpath (not a root or html file)
    if (segments.length > 0 && !segments[0].includes('.') && segments[0] !== 'castas') {
      const repoSubpath = `/${segments[0]}/`;
      if (cleanBase === '/' || cleanBase === './') {
        return `${repoSubpath}${stripped}`;
      }
    }
  }

  // Standard relative resolution: if base is './', return `./${stripped}`
  if (cleanBase === './') {
    return `./${stripped}`;
  }

  // If cleanBase is root '/', use relative path `./${stripped}` for maximum portability across subpath hosts
  if (cleanBase === '/') {
    return `./${stripped}`;
  }

  return `${cleanBase}${stripped}`;
};

