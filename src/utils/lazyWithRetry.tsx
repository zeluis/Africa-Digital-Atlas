import React, { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Robust lazy import with automatic retry on chunk failure.
 * When a new version of the app is deployed to GitHub Pages / CDN, older chunks
 * may return 404 (Failed to fetch dynamically imported module).
 * This wrapper catches the error, busts local cache, and gracefully recovers
 * without showing a blank screen.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | T>,
  componentName: string = 'Component'
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const sessionKey = `atlas_chunk_reload_${componentName}`;
    const hasAlreadyRetried = window.sessionStorage.getItem(sessionKey) === 'true';

    try {
      const module = await factory();
      // On success, reset retry flag
      window.sessionStorage.removeItem(sessionKey);
      return 'default' in module ? module : { default: module as T };
    } catch (error: any) {
      console.warn(`[Module Loader] Dynamic import failed for "${componentName}":`, error);

      const errorMessage = String(error?.message || error || '');
      const isChunkLoadError = 
        errorMessage.includes('dynamically imported module') ||
        errorMessage.includes('Loading chunk') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('Importing a module script failed') ||
        errorMessage.includes('404') ||
        error?.name === 'ChunkLoadError' ||
        error?.name === 'TypeError';

      if (!hasAlreadyRetried && isChunkLoadError) {
        console.log(`[Module Loader] New deployment detected or chunk missed. Refreshing cache for "${componentName}"...`);
        window.sessionStorage.setItem(sessionKey, 'true');

        // Clear service worker caches if accessible
        if ('caches' in window) {
          try {
            const cacheKeys = await caches.keys();
            await Promise.all(
              cacheKeys.map(key => {
                if (key.includes('africa-atlas')) {
                  return caches.delete(key);
                }
                return Promise.resolve(false);
              })
            );
          } catch (cErr) {
            console.warn('[Module Loader] Cache purge error:', cErr);
          }
        }

        // Force reload page to fetch fresh index.html and newly hashed asset manifest
        window.location.reload();
        // Return unresolved promise while browser reloads
        return new Promise<{ default: T }>(() => {});
      }

      // If we already tried reloading or it's a code-level error, rethrow to be caught by ErrorBoundary
      window.sessionStorage.removeItem(sessionKey);
      throw error;
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ViewErrorBoundary prevents unhandled view-level or dynamic import errors
 * from causing a blank screen. Displays an elegant recovery interface.
 */
export class ViewErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ViewErrorBoundary] Caught view rendering error:', error, errorInfo);
  }

  handleReload = async () => {
    // Purge service worker caches to ensure fresh assets
    if ('caches' in window) {
      try {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      } catch (e) {}
    }
    // Hard reload
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      const isChunkError = 
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('Failed to fetch');

      return (
        <div className="w-full min-h-[500px] flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-[#FCFAF7] dark:bg-[#181A16] border border-amber-200/80 dark:border-amber-900/40 shadow-xl text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold font-display text-stone-900 dark:text-stone-100 mb-2">
              {isChunkError ? 'Application Updated / Connection Interrupted' : (this.props.fallbackTitle || 'Unable to Load View')}
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
              {isChunkError 
                ? 'A new build of the Africa Data Atlas was recently deployed. Reloading the application will sync all data models and assets.'
                : 'A temporary rendering or data synchronization issue occurred while displaying this module.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:text-stone-950 shadow-sm transition-all"
              >
                Reload & Update Atlas
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 transition-colors"
              >
                Dismiss & Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
