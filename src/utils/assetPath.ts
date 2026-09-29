/**
 * Resolves local and remote asset paths robustly across all hosting platforms
 * (GitHub Pages subpaths, Vercel, Netlify, custom domains, and local development).
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

  // 1. Check if Vite BASE_URL is configured to a specific subpath (e.g. '/my-repo/')
  const metaBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '';
  if (metaBase && metaBase !== './' && metaBase !== '/') {
    const cleanBase = metaBase.endsWith('/') ? metaBase : `${metaBase}/`;
    return `${cleanBase}${clean}`;
  }

  // 2. Browser runtime detection for GitHub Pages (e.g. https://username.github.io/repo-name/...)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || '';
    const pathname = window.location.pathname || '';
    
    // GitHub Pages standard subdomain: username.github.io/repository-name/
    if (hostname.endsWith('github.io')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0 && !segments[0].includes('.')) {
        const repoName = segments[0];
        return `/${repoName}/${clean}`;
      }
    }
  }

  // 3. Default to root-relative path for standard domains and dev server
  return `/${clean}`;
};
