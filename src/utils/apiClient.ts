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
 * Fetch wrapper with guaranteed AbortController timeout cleanup and optional caller signal chaining.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 6000, signal: callerSignal, ...fetchOptions } = options;

  if (typeof AbortController === 'undefined') {
    return fetch(url, {
      ...fetchOptions,
      ...(callerSignal ? { signal: callerSignal } : {}),
    });
  }

  const controller = new AbortController();
  let onCallerAbort: (() => void) | undefined;

  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort(callerSignal.reason);
    } else {
      onCallerAbort = () => {
        if (callerSignal.reason !== undefined) {
          controller.abort(callerSignal.reason);
        } else {
          controller.abort();
        }
      };
      callerSignal.addEventListener('abort', onCallerAbort, { once: true });
    }
  }

  const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    return await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
  } finally {
    if (timer !== null) {
      clearTimeout(timer);
    }
    if (callerSignal && onCallerAbort) {
      callerSignal.removeEventListener('abort', onCallerAbort);
    }
  }
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
      const res = await fetchWithTimeout(resolveApiUrl('/api/health'), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        timeoutMs: 1500,
      });
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
