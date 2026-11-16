import { defineConfig } from 'vitepress';

function normalizeSlashPath(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '/') return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function resolveDocsBase(): string {
  if (process.env.DOCS_BASE && process.env.DOCS_BASE.trim() !== '') {
    return normalizeSlashPath(process.env.DOCS_BASE);
  }
  const appBase = process.env.BASE_URL || process.env.VITE_BASE_PATH;
  if (appBase && appBase.trim() !== './' && appBase.trim() !== '.') {
    const normalizedApp = normalizeSlashPath(appBase);
    return normalizedApp === '/' ? '/docs/' : `${normalizedApp}docs/`;
  }
  return '/docs/';
}

const docsBase = resolveDocsBase();
const liveAppUrl = process.env.ATLAS_APP_URL || '../';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Afriata: Africa Data Atlas',
  description: 'A pan-African data and cartography platform — 54 countries, 90+ indicators, 16 institutional data sources.',
  base: docsBase,
  
  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: `${docsBase}hero-preview.webp` }],
    ['meta', { name: 'theme-color', content: '#d97706' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Afriata: Africa Data Atlas Documentation' }],
    ['meta', { property: 'og:site_name', content: 'Afriata Docs' }],
    ['meta', { property: 'og:image', content: 'https://zeluis.github.io/Africa-Digital-Atlas/hero-preview.webp' }],
  ],

  themeConfig: {
    logo: '/hero-preview.webp',
    siteTitle: 'Afriata',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/guide/cartography-map' },
      { text: 'Data & Methodology', link: '/data/data-sources-catalog' },
      { text: 'Developer Guide', link: '/developer/architecture' },
      { text: 'FAQ', link: '/faq' },
      { 
        text: 'Live Atlas App ↗', 
        link: liveAppUrl,
        target: '_blank'
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'User Guide',
          items: [
            { text: 'Vector Cartography Map', link: '/guide/cartography-map' },
            { text: 'Country Dossiers', link: '/guide/country-dossiers' },
            { text: 'Regional Blocs (RECs)', link: '/guide/regional-blocs' },
            { text: 'Thematic Pillars', link: '/guide/thematic-pillars' },
            { text: 'Comparative Analytics', link: '/guide/comparative-analytics' },
            { text: 'Languages & i18n', link: '/guide/languages' },
            { text: 'Provenance & Quality Audits', link: '/guide/provenance-quality' },
            { text: 'Slave Voyages Research Suite', link: '/guide/slave-voyages' }
          ]
        }
      ],
      '/data/': [
        {
          text: 'Data & Methodology',
          items: [
            { text: 'Data Sources Catalog', link: '/data/data-sources-catalog' },
            { text: 'SVG Geography Engine', link: '/data/svg-geography-engine' },
            { text: 'Citations & Licensing', link: '/data/citations-licensing' },
            { text: 'Privacy & Academic Terms', link: '/data/privacy-policy' }
          ]
        }
      ],
      '/developer/': [
        {
          text: 'Developer Guide',
          items: [
            { text: 'Architecture & Tech Stack', link: '/developer/architecture' },
            { text: 'Universal Audit Specification', link: '/UNIVERSAL_AUDIT_SPECIFICATION' },
            { text: 'Universal Style Guide', link: '/UNIVERSAL_STYLE_GUIDE' },
            { text: 'Installation & Local Dev', link: '/developer/installation' },
            { text: 'Offline PWA Strategy', link: '/developer/offline-pwa' },
            { text: 'Deployment', link: '/developer/deployment' },
            { text: 'Contributing', link: '/developer/contributing' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zeluis/Africa-Digital-Atlas' }
    ],

    footer: {
      message: 'Released under the MIT and CC BY 4.0 Licenses.',
      copyright: 'Copyright © 2026 Afriata • ZéLuis F. Correia'
    },

    search: {
      provider: 'local'
    }
  }
});
