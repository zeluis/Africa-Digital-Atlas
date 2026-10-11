import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  if (command === 'build') {
    process.env.NODE_ENV = 'production';
  }
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'optimize-tailwind-css-output',
        enforce: 'post',
        generateBundle(_options, bundle) {
          for (const [fileName, asset] of Object.entries(bundle)) {
            if (!fileName.endsWith('.css') || asset.type !== 'asset' || typeof asset.source !== 'string') continue;
            let css = asset.source;
            const marker = '@supports (color:color-mix(in lab,red,red))';
            let pos = 0;
            let stripped = '';
            let last = 0;
            while ((pos = css.indexOf(marker, last)) !== -1) {
              let depth = 0;
              let i = pos;
              while (i < css.length) {
                if (css[i] === '{') depth++;
                else if (css[i] === '}') {
                  depth--;
                  if (depth === 0) {
                    i++;
                    break;
                  }
                }
                i++;
              }
              stripped += css.slice(last, pos);
              last = i;
            }
            stripped += css.slice(last);

            const dedupBlock = (inner: string): string => {
              let p = 0;
              const byBody = new Map<string, string[]>();
              const atBlocks: string[] = [];
              const addRule = (sel: string, body: string) => {
                let list = byBody.get(body);
                if (!list) {
                  list = [];
                  byBody.set(body, list);
                }
                if (!list.includes(sel)) list.push(sel);
              };
              while (p < inner.length) {
                const bStart = inner.indexOf('{', p);
                if (bStart === -1) {
                  atBlocks.push(inner.slice(p));
                  break;
                }
                const sel = inner.slice(p, bStart).trim();
                let d = 0;
                let bEnd = bStart;
                while (bEnd < inner.length) {
                  if (inner[bEnd] === '{') d++;
                  else if (inner[bEnd] === '}') {
                    d--;
                    if (d === 0) {
                      bEnd++;
                      break;
                    }
                  }
                  bEnd++;
                }
                const body = inner.slice(bStart + 1, bEnd - 1);
                if (sel.startsWith('@media')) {
                  atBlocks.push(`${sel}{${dedupBlock(body)}}`);
                } else if (!sel.startsWith('@') && !body.includes('{') && !sel.includes('::')) {
                  if (body.includes('--tw-gradient-') && body.includes(';')) {
                    for (const part of body.split(';')) {
                      if (part.trim()) addRule(sel, part.trim());
                    }
                  } else {
                    addRule(sel, body);
                  }
                } else {
                  atBlocks.push(inner.slice(p, bEnd));
                }
                p = bEnd;
              }
              let out = '';
              for (const [body, sels] of byBody.entries()) {
                out += `${sels.join(',')}{${body}}`;
              }
              return out + atBlocks.join('');
            };

            const uStart = stripped.indexOf('@layer utilities{');
            if (uStart !== -1) {
              let depth = 0;
              let uEnd = uStart;
              while (uEnd < stripped.length) {
                if (stripped[uEnd] === '{') depth++;
                else if (stripped[uEnd] === '}') {
                  depth--;
                  if (depth === 0) {
                    uEnd++;
                    break;
                  }
                }
                uEnd++;
              }
              const uInner = stripped.slice(uStart + '@layer utilities{'.length, uEnd - 1);
              stripped = stripped.slice(0, uStart) + '@layer utilities{' + dedupBlock(uInner) + '}' + stripped.slice(uEnd);
            }
            asset.source = stripped;
          }
        },
      },
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
          globPatterns: [
            'index.html',
            'manifest.webmanifest',
            'favicon.svg',
            'icon.svg',
            'africa-final.svg',
            'assets/**/*.{js,css,woff2,json}',
          ],
          globIgnores: [
            '**/africalia-ethnic-tree.svg',
            '**/castas/**',
            '**/cartography/**',
            '**/archives/**',
            '**/assets/images/**',
            '**/docs/**',
          ],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === self.location.origin && /\.(?:png|jpe?g|webp|avif|gif|svg)$/i.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'local-media',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 60,
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/thumb\.wikimedia\.org\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wikimedia-thumbs',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'unsplash-images-cache',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/en\.wikipedia\.org\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wikipedia-rest-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
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
            {
              urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'flagcdn-flags-cache',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'wikimedia-media-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/si\.regeneratedidentities\.org\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'archival-iconography-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
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
      cssTarget: ['chrome115', 'safari16.4', 'firefox115'],
      modulePreload: {
        resolveDependencies: (_filename, deps) => deps.filter((d) => !/\/data-/.test(d)),
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('/d3-') || id.includes('/d3/')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react') || id.includes('@iconify') || id.includes('motion')) {
                return 'vendor-ui';
              }
              if (id.includes('topojson-client') || id.includes('world-atlas')) {
                return 'vendor-geo';
              }
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                return 'vendor-framework';
              }
            }
            if (
              id.includes('src/data/atlas-raw-data') ||
              id.includes('src/data/atlas-observations-seed') ||
              id.includes('src/data/expandedIndicators')
            ) {
              return 'data-atlas-raw';
            }
            if (id.includes('src/data/slaveVoyages')) {
              return 'data-slave-voyages';
            }
            if (id.includes('src/data/slaveTradeIllustrations')) {
              return 'data-slave-trade-illustrations';
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
