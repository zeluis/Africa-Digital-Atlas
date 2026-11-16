import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './fonts.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';
import { resolveAssetPath } from './utils/assetPath';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

// PWA Service Worker Management
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  const isDevEnvironment = Boolean(import.meta.env.DEV);

  if (isDevEnvironment) {
    // In development mode, actively unregister any existing service worker
    // to prevent it from intercepting dynamically imported Vite modules (.tsx/.ts)
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().catch(() => {});
      }
    }).catch(() => {});
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) {
          if (k.startsWith('africa-') || k.startsWith('afriata-') || k.startsWith('workbox-')) {
            caches.delete(k).catch(() => {});
          }
        }
      }).catch(() => {});
    }
  } else {
    // Production Service Worker registration
    window.addEventListener('load', () => {
      let pendingRegistration: ServiceWorkerRegistration | null = null;
      let shouldReloadOnControllerChange = false;

      const notifyUpdateAvailable = (reg: ServiceWorkerRegistration) => {
        pendingRegistration = reg;
        window.dispatchEvent(
          new CustomEvent('afriata-sw-update-available', { detail: { registration: reg } })
        );
      };

      window.addEventListener('afriata-sw-apply-update', () => {
        if (pendingRegistration?.waiting) {
          shouldReloadOnControllerChange = true;
          pendingRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });

      navigator.serviceWorker
        .register(resolveAssetPath('sw.js'))
        .then((reg) => {
          console.log('[PWA] Service worker registered successfully with scope:', reg.scope);

          if (reg.waiting && navigator.serviceWorker.controller) {
            notifyUpdateAvailable(reg);
          }

          // Listen for new worker installed
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  notifyUpdateAvailable(reg);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration ignored/failed:', err);
        });

      // When the active worker changes after user approval, refresh to sync new assets
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing && shouldReloadOnControllerChange) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

