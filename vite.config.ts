import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: './',
          name: 'Africalia: Africa Data Atlas',
          short_name: 'Africalia',
          description: 'Authoritative Pan-African data platform featuring 54 sovereign nations, Atlantic Slave Trade research database, ethnic tree cartography, 8 thematic pillars, and investigative monographs.',
          theme_color: '#4e5e51',
          background_color: '#18181b',
          display: 'standalone',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'icon-maskable-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: 'icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,md}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('/d3-') || id.includes('/d3/')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react') || id.includes('@iconify')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('topojson-client') || id.includes('world-atlas')) {
                return 'vendor-geo';
              }
              if (id.includes('react-dom') || id.includes('/react/')) {
                return 'vendor-framework';
              }
            }
            if (id.includes('src/data/svgMaps')) {
              return 'data-svg-schematic-maps';
            }
            if (id.includes('src/data/slaveVoyages')) {
              return 'data-slave-voyages';
            }
            if (id.includes('src/data/molecularLegacies')) {
              return 'data-molecular-legacies';
            }
            if (id.includes('src/data/reportsData')) {
              return 'data-research-reports';
            }
            if (id.includes('src/data/africanDevelopment') || id.includes('src/data/countryHistoricalDevelopment')) {
              return 'data-african-development';
            }
            if (id.includes('src/data/ethnicTree') || id.includes('src/data/authenticEthnicTreeSvg') || id.includes('src/data/africaliaMasterTreeData')) {
              return 'data-ethnic-tree';
            }
            if (id.includes('src/i18n/translations')) {
              return 'i18n-translations';
            }
            if (id.includes('src/data/atlas-raw-data')) {
              return 'data-atlas-raw';
            }
            if (id.includes('src/data/countrySilhouettes')) {
              return 'data-country-silhouettes';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
