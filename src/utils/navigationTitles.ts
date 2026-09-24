import React from 'react';
import { CanonicalNavTab } from '../components/NavigationDrawer';
import { AfricanRegion } from '../data/types';
import { atlas } from '../data/atlas-store';
import { getAllReports } from '../data/reportsDataLoader';
import {
  Compass,
  Map as MapIcon,
  BarChart3,
  Layers,
  BookOpen,
  Anchor,
  GitCompare,
  Database,
  Languages as LanguagesIcon,
  Landmark,
  Grid3X3,
  Boxes,
  Dna,
  Scale,
  FileText,
  MapPin,
  LucideIcon
} from 'lucide-react';

export interface PageInfo {
  title: string;
  shortTitle: string;
  fullTitle: string;
  category?: string;
  Icon: LucideIcon;
  badge?: string;
}

const REGION_MAP: Record<string, { title: AfricanRegion; icon: LucideIcon }> = {
  'region-northern': { title: 'Northern Africa', icon: Layers },
  'region-western': { title: 'Western Africa', icon: Layers },
  'region-central': { title: 'Central Africa', icon: Layers },
  'region-eastern': { title: 'Eastern Africa', icon: Layers },
  'region-southern': { title: 'Southern Africa', icon: Layers }
};

export function getPageInfo(
  tab: CanonicalNavTab,
  selectedEntityId?: string,
  activeRegion?: AfricanRegion
): PageInfo {
  // Region Tab
  if (tab.startsWith('region-') && REGION_MAP[tab]) {
    const reg = REGION_MAP[tab];
    return {
      title: reg.title,
      shortTitle: reg.title,
      fullTitle: `${reg.title} — UN M49 Regional Profile`,
      category: 'UN M49 Subregion',
      Icon: reg.icon
    };
  }

  // Country Dossier
  if (tab === 'countries') {
    const entity = selectedEntityId ? atlas.getEntity(selectedEntityId) : null;
    if (entity) {
      return {
        title: entity.name,
        shortTitle: entity.name,
        fullTitle: `${entity.name} (${entity.id}) — Sovereign Country Dossier`,
        category: `${entity.region} • ${entity.id}`,
        Icon: MapPin,
        badge: entity.id
      };
    }
    return {
      title: 'Country Dossier',
      shortTitle: 'Country',
      fullTitle: 'Sovereign Country Dossier & In-Depth Data',
      category: 'Country Profile',
      Icon: MapPin
    };
  }

  // Regional Overview
  if (tab === 'regions') {
    const title = activeRegion || 'Regional Profiles';
    return {
      title: title,
      shortTitle: title,
      fullTitle: `${title} — Continental Geography & Macro Profiles`,
      category: 'UN M49 Subregions',
      Icon: Layers
    };
  }

  // Static Views Mapping
  switch (tab) {
    case 'overview':
      return {
        title: 'Overview',
        shortTitle: 'Overview',
        fullTitle: 'Continental Overview & Macro Synthesis',
        category: 'Africalia Continental Atlas',
        Icon: Compass
      };

    case 'explore':
      return {
        title: 'Explore Africa',
        shortTitle: 'Explore',
        fullTitle: 'Explore Africa — Interactive Cross-Section',
        category: 'Exploration & Geography',
        Icon: Compass
      };

    case 'map':
      return {
        title: 'Interactive Atlas Map',
        shortTitle: 'Atlas Map',
        fullTitle: 'Interactive Vector Atlas Map & Geospatial Cartography',
        category: 'Cartography & Geoscheme',
        Icon: MapIcon
      };

    case 'analytics':
      return {
        title: 'Analytics & Indicators',
        shortTitle: 'Analytics',
        fullTitle: 'Comparative Macro Analytics & Indicator Benchmarks',
        category: 'Comparative Indicators',
        Icon: BarChart3
      };

    case 'slave-trade':
      return {
        title: 'Atlantic Slave Trade',
        shortTitle: 'Slave Trade',
        fullTitle: 'Transatlantic & Regional Slave Trade Legacies (1501–1867)',
        category: 'Historical Legacies',
        Icon: Anchor
      };

    case 'iconography':
      return {
        title: 'Archival Iconography',
        shortTitle: 'Iconography',
        fullTitle: 'Transatlantic & Pan-African Archival Iconography (1,220+ Plates)',
        category: 'Historical Archives',
        Icon: BookOpen
      };

    case 'archival-cartography':
      return {
        title: 'Archival Cartography',
        shortTitle: 'Cartography',
        fullTitle: 'Archival Cartography & Seasonal Maritime Streamlines (16th–19th C.)',
        category: 'Historical Cartography GIS',
        Icon: MapIcon
      };

    case 'molecular-legacies':
      return {
        title: 'Molecular Legacies',
        shortTitle: 'Genomics',
        fullTitle: 'Molecular & Population Genetics of the Transatlantic Diaspora',
        category: 'Population Genomics',
        Icon: Dna
      };

    case 'african-development-foundations':
      return {
        title: 'Development Foundations',
        shortTitle: 'Development',
        fullTitle: 'Historical Foundations of African Economic Development',
        category: 'Economic History',
        Icon: Landmark
      };

    case 'pillars':
      return {
        title: 'Thematic Pillars',
        shortTitle: 'Pillars',
        fullTitle: 'Thematic Strategic Development Pillars',
        category: 'Strategic Framework',
        Icon: Grid3X3
      };

    case 'blocs':
      return {
        title: 'Economic Blocs',
        shortTitle: 'RECs & Blocs',
        fullTitle: 'Regional Economic Communities & Integration Blocs (RECs)',
        category: 'Regional Integration',
        Icon: Boxes
      };

    case 'languages':
      return {
        title: 'Linguistic Heritage',
        shortTitle: 'Languages',
        fullTitle: 'African Language Phyla & Linguistic Demography',
        category: 'Cultural Heritage',
        Icon: LanguagesIcon
      };

    case 'heritage':
      return {
        title: 'UNESCO World Heritage',
        shortTitle: 'Heritage',
        fullTitle: 'UNESCO Cultural & Natural World Heritage Sites in Africa',
        category: 'Cultural Preservation',
        Icon: Landmark
      };

    case 'ethnic-tree':
      return {
        title: 'Ethnic Tree of Life',
        shortTitle: 'Tree of Life',
        fullTitle: 'African Ethnic Phylogeny & Population Genetics Tree',
        category: 'Anthropology & Genetics',
        Icon: Dna
      };

    case 'research-directory':
      return {
        title: 'Research Reports',
        shortTitle: 'Research',
        fullTitle: 'Africalia Academic Research Monographs & Monographs Directory',
        category: 'Monographs & Papers',
        Icon: BookOpen
      };

    case 'compare':
      return {
        title: 'Comparative Analysis',
        shortTitle: 'Compare',
        fullTitle: 'Cross-Country Comparative Matrix & Analytics',
        category: 'Cross-Country Comparison',
        Icon: GitCompare
      };

    case 'provenance':
      return {
        title: 'Data Provenance',
        shortTitle: 'Provenance',
        fullTitle: 'Multilateral Data Sources, Methodologies & Quality Verification',
        category: 'Methodology & Trust',
        Icon: Database
      };

    case 'privacy':
      return {
        title: 'Privacy & Data Terms',
        shortTitle: 'Privacy',
        fullTitle: 'Privacy Policy, Offline Caching & Data Consent',
        category: 'Terms & Compliance',
        Icon: Scale
      };

    default: {
      // Dynamic research reports check
      if (typeof tab === 'string' && (tab.startsWith('report-') || tab.includes('report'))) {
        const reports = getAllReports();
        const report = reports[tab];
        if (report) {
          const reportShortTitle = (report as { shortTitle?: string }).shortTitle || report.title;
          return {
            title: report.title,
            shortTitle: reportShortTitle,
            fullTitle: report.title,
            category: 'Research Monograph',
            Icon: FileText
          };
        }
      }

      // Fallback for custom or unrecognized tabs
      const formattedTitle = String(tab)
        .replace(/^(report-|region-)/, '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      return {
        title: formattedTitle,
        shortTitle: formattedTitle,
        fullTitle: formattedTitle,
        category: 'Africalia Atlas',
        Icon: FileText
      };
    }
  }
}
