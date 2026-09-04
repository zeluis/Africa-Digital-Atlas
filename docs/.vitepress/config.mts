import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Africa Digital Atlas',
  description: 'A pan-African data and cartography platform — 54 countries, 90+ indicators, 16 institutional data sources.',
  base: process.env.DOCS_BASE || '/Africa-Digital-Atlas/docs/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/Africa-Digital-Atlas/docs/hero-preview.jpg' }],
    ['meta', { name: 'theme-color', content: '#d97706' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Africa Digital Atlas Documentation' }],
    ['meta', { property: 'og:site_name', content: 'Africa Digital Atlas Docs' }],
    ['meta', { property: 'og:image', content: 'https://zeluis.github.io/Africa-Digital-Atlas/hero-preview.jpg' }],
  ],

  themeConfig: {
    logo: '/hero-preview.jpg',
    siteTitle: 'Africa Digital Atlas',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/guide/cartography-map' },
      { text: 'Data & Methodology', link: '/data/data-sources-catalog' },
      { text: 'Developer Guide', link: '/developer/architecture' },
      { text: 'FAQ', link: '/faq' },
      { 
        text: 'Live Atlas App ↗', 
        link: 'https://zeluis.github.io/Africa-Digital-Atlas/' 
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
            { text: 'Slave Voyages 3D Globe', link: '/guide/slave-voyages' }
          ]
        }
      ],
      '/data/': [
        {
          text: 'Data & Methodology',
          items: [
            { text: 'Data Sources Catalog', link: '/data/data-sources-catalog' },
            { text: 'SVG Geography Engine', link: '/data/svg-geography-engine' },
            { text: 'Citations & Licensing', link: '/data/citations-licensing' }
          ]
        }
      ],
      '/developer/': [
        {
          text: 'Developer Guide',
          items: [
            { text: 'Architecture & Tech Stack', link: '/developer/architecture' },
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Africa Digital Atlas'
    },

    search: {
      provider: 'local'
    }
  }
});
