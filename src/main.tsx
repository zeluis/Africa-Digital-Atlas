import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/noto-serif-display';
import '@fontsource-variable/noto-serif';
import '@fontsource-variable/noto-sans';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';
import { initArchivalPrecache } from './utils/imagePrecache';
import './index.css';

// Proactively pre-warm UNESCO heritage sites and archival media during idle time
initArchivalPrecache();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

// PWA Service Worker Management
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  const isDevEnvironment = import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.includes('run.app');

  if (isDevEnvironment) {
    // In development mode and Cloud Run preview, actively unregister any existing service worker
    // to prevent it from intercepting dynamically imported Vite modules (.tsx/.ts)
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().catch(() => {});
      }
    }).catch(() => {});
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) {
          if (k.startsWith('africa-atlas-')) caches.delete(k).catch(() => {});
        }
      }).catch(() => {});
    }
  } else {
    // Production Service Worker registration
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service worker registered successfully with scope:', reg.scope);
          
          // Listen for new worker installed
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available, triggering skipWaiting...');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration ignored/failed:', err);
        });

      // When the active worker changes, refresh to sync new assets
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('[PWA] Controller changed, updating client assets...');
        }
      });
    });
  }
}

