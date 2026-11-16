import { resolveAppBasePath } from './assetPath';

const STATIC_HOST_SUFFIXES = ['.github.io', '.pages.dev', '.netlify.app'];

let apiAvailabilityPromise: Promise<boolean> | null = null;

/**
 * Resolves a backend `/api/*` endpoint relative to the mounted application base path,
 * enabling Node/Express deployments mounted behind subpath reverse proxies (e.g. `/atlas/api/...`).
 */
export function resolveApiUrl(apiPath: string): string {
  const cleanPath = apiPath.trim().replace(/^\/+/, '');
  const basePath = resolveAppBasePath();
  return `${basePath}${cleanPath}`;
}

export function isStaticHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return STATIC_HOST_SUFFIXES.some((suffix) => host === suffix.slice(1) || host.endsWith(suffix));
}

/**
 * Determines whether this build or runtime host is a static-only host with no Express API backend.
 */
export function isStaticOnlyDeployment(): boolean {
  const env = typeof import.meta !== 'undefined' ? (import.meta.env as Record<string, any> | undefined) : undefined;
  if (env?.VITE_ENABLE_API === 'true' || env?.VITE_ENABLE_API === '1') {
    return false;
  }
  if (env?.VITE_STATIC_ONLY === 'true' || env?.VITE_STATIC_ONLY === '1') {
    return true;
  }
  if (typeof window !== 'undefined' && window.location && !env?.DEV) {
    if (isStaticHost(window.location.hostname)) {
      return true;
    }
  }
  return false;
}

/**
 * Memoized capability probe for the optional Express backend (`/api/health`).
 * Prevents red 404/405 console noise and timeout delays on GitHub Pages and static CDNs.
 */
export async function isBackendApiAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return false;
  }
  if (isStaticOnlyDeployment()) {
    return false;
  }
  if (apiAvailabilityPromise) {
    return apiAvailabilityPromise;
  }

  apiAvailabilityPromise = (async () => {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 1500) : null;
      const res = await fetch(resolveApiUrl('/api/health'), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        ...(controller ? { signal: controller.signal } : {}),
      });
      if (timer) clearTimeout(timer);
      if (!res.ok) return false;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return false;
      const payload = await res.json();
      return payload?.status === 'ok';
    } catch {
      return false;
    }
  })();

  return apiAvailabilityPromise;
}

/**
 * Resets cached backend capability probe (primarily for automated tests).
 */
export function resetApiAvailabilityCache(): void {
  apiAvailabilityPromise = null;
}
