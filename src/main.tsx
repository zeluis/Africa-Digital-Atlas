import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/noto-serif-display';
import '@fontsource-variable/noto-sans';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';
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
  if (import.meta.env.DEV) {
    // In development mode, actively unregister any existing service worker to prevent intercepting Vite modules
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().catch(() => {});
      }
    }).catch(() => {});
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

