import React, { ReactNode } from 'react';

/**
 * Robust lazy import with automatic retry on chunk failure.
 * Retries transient module load failures smoothly before delegating to the ErrorBoundary.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | T>,
  componentName: string = 'Component'
): React.LazyExoticComponent<T> & { preload: () => Promise<any> } {
  let cachedPromise: Promise<{ default: T }> | null = null;

  const load = (retriesLeft = 2, delay = 400): Promise<{ default: T }> => {
    if (cachedPromise) return cachedPromise;

    cachedPromise = factory()
      .then(module => ('default' in module ? module : { default: module as T }))
      .catch(error => {
        cachedPromise = null;
        if (retriesLeft > 0) {
          console.warn(`[Module Loader] Retrying dynamic import for "${componentName}" (${retriesLeft} retries left)...`);
          return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
            load(retriesLeft - 1, delay * 1.5)
          );
        }
        console.error(`[Module Loader] Failed to load component "${componentName}":`, error);
        throw error;
      });

    return cachedPromise;
  };

  const LazyComponent = React.lazy(load) as any;
  LazyComponent.preload = () => load();
  return LazyComponent;
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
