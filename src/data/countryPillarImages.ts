/**
 * countryPillarImages.ts - Dedicated Thematic Pillar Photography System
 * 
 * Provides topic-specific, curated, high-resolution photography for all 8 thematic pillars:
 * 1. Geography: Topography, mountain massifs, waterways, littoral geography
 * 2. History: Ancient monuments, archaeological ruins, pyramids, historic citadels
 * 3. People: Demographics, ethnic communities, cultural crowds, youth vitality, assemblies
 * 4. Languages: Manuscripts, scripts, epigraphy, oral traditions, linguistic heritage
 * 5. Culture: UNESCO heritage, traditional textiles, music, festivals, performing arts
 * 6. Climate: National parks, wildlife sanctuaries, biosphere reserves, equatorial ecosystems
 * 7. Economy: Financial districts, deepwater ports, AfCFTA trade hubs, industrial corridors
 * 8. Future: Modern skylines, digital innovation hubs, solar/wind infrastructure, technology parks
 */

import { ThematicPillarId } from '../services/wikipediaService';
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface PillarThematicImage {
  id: string; // ISO3
  country: string;
  pillarId: ThematicPillarId;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  credit: string;
}

const countryPillarImagesUrl = new URL('./countryPillarImages.json', import.meta.url).href;

export const COUNTRY_PILLAR_IMAGERY: Record<string, Partial<Record<ThematicPillarId, PillarThematicImage>>> = {};

const countryPillarImagesStore = createLazyAssetStore<Record<string, Partial<Record<ThematicPillarId, PillarThematicImage>>>>(
  [countryPillarImagesUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(COUNTRY_PILLAR_IMAGERY, payload);
    }
    return COUNTRY_PILLAR_IMAGERY;
  },
  () => COUNTRY_PILLAR_IMAGERY
);

export const ensureCountryPillarImagesLoaded = countryPillarImagesStore.ensureLoaded;
export const isCountryPillarImagesLoaded = countryPillarImagesStore.isLoaded;
export const subscribeCountryPillarImages = countryPillarImagesStore.subscribe;
export const useCountryPillarImagesLoaded = countryPillarImagesStore.useLoaded;

/**
 * Universal Pillar Thematic Archetypes (High-resolution, contextual fallbacks for any African nation)
 */
export const GENERIC_PILLAR_THEMES: Record<ThematicPillarId, {
  titleTemplate: (country: string) => string;
  category: string;
  imageUrl: string;
  captionTemplate: (country: string) => string;
  creditTemplate: (country: string) => string;
}> = {
  geography: {
    titleTemplate: (c) => `${c} Continental Topography & Waterways`,
    category: 'Physical Geography & Territoriality',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Natural physical landscape, mountain contours, river basins, and sovereign territory of ${c}.`,
    creditTemplate: () => 'African Geographic & Spatial Survey'
  },
  history: {
    titleTemplate: (c) => `${c} Historical Epochs & Liberation Milestones`,
    category: 'Historiography & Liberation Chronologies',
    imageUrl: 'https://images.unsplash.com/photo-1546816401-44754ab4d623?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Archaeological foundations, dynastic kingdoms, anti-colonial liberation triumphs, and national sovereignty in ${c}.`,
    creditTemplate: () => 'African Union Historic Archives'
  },
  people: {
    titleTemplate: (c) => `${c} Civic Society & Demographic Vitality`,
    category: 'Demography & Human Development',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Citizens, vibrant youth demographic vanguard, ethnic communities, and human capital across ${c}.`,
    creditTemplate: () => 'United Nations Population Division / National Census'
  },
  languages: {
    titleTemplate: (c) => `${c} Linguistic Diversity & Phyla Matrix`,
    category: 'Linguistic Geography & Phyla',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Indigenous language families, classical orthographies, community assemblies, and oral traditions in ${c}.`,
    creditTemplate: () => 'African Academy of Languages (ACALAN)'
  },
  culture: {
    titleTemplate: (c) => `${c} UNESCO Heritage & Material Culture`,
    category: 'Material Culture, Heritage & Arts',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Living cultural practices, UNESCO World Heritage monuments, artisanal crafts, and architectural traditions of ${c}.`,
    creditTemplate: () => 'UNESCO World Heritage Centre'
  },
  climate: {
    titleTemplate: (c) => `${c} National Parks & Biosphere Sanctuaries`,
    category: 'Biomes, Climate & Ecological Resilience',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Protected national reserves, tropical rainforests, savanna ecosystems, and biodiversity conservation in ${c}.`,
    creditTemplate: () => 'African Parks & Wildlife Conservation Authority'
  },
  economy: {
    titleTemplate: (c) => `${c} Commercial Hubs, Trade & Industrial Corridors`,
    category: 'Macroeconomics, Sovereignty & Trade',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Strategic ports, regional financial centers, agricultural logistics, and AfCFTA commerce in ${c}.`,
    creditTemplate: () => 'African Development Bank (AfDB)'
  },
  future: {
    titleTemplate: (c) => `${c} Capital Skyline & Digital Transformation`,
    category: 'Agenda 2063 & Future Horizons',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    captionTemplate: (c) => `Modern skyline architecture, digital innovation corridors, renewable energy investments, and future development in ${c}.`,
    creditTemplate: () => 'African Union Agenda 2063 Commission'
  }
};

/**
 * Get pillar-specific high-resolution curated imagery for any African country
 */
export function getPillarThematicImage(
  entityId: string, 
  pillarId: ThematicPillarId, 
  countryName?: string
): PillarThematicImage {
  const code = entityId.toUpperCase();
  const country = countryName || code;

  // 1. Check if we have an explicit country + pillar curated match
  const countryRecord = COUNTRY_PILLAR_IMAGERY[code];
  if (countryRecord && countryRecord[pillarId]) {
    return countryRecord[pillarId]!;
  }

  // 2. Generate specialized thematic archetype tailored to this country
  const template = GENERIC_PILLAR_THEMES[pillarId] || GENERIC_PILLAR_THEMES.geography;
  return {
    id: code,
    country: country,
    pillarId: pillarId,
    title: template.titleTemplate(country),
    category: template.category,
    imageUrl: template.imageUrl,
    caption: template.captionTemplate(country),
    credit: template.creditTemplate(country)
  };
}

/**
 * Get prioritized Wikipedia search queries for a specific pillar and country
 */
export function getPillarWikiSearchCandidates(countryName: string, pillarId: ThematicPillarId): string[] {
  const clean = countryName.trim();
  switch (pillarId) {
    case 'people':
      return [
        `Demographics of ${clean}`,
        `People of ${clean}`,
        `Ethnic groups in ${clean}`,
        clean
      ];
    case 'climate':
      return [
        `Wildlife of ${clean}`,
        `Protected areas of ${clean}`,
        `Geography of ${clean}`,
        `National parks of ${clean}`,
        clean
      ];
    case 'future':
      return [
        `Science and technology in ${clean}`,
        `Telecommunications in ${clean}`,
        `Economy of ${clean}`,
        clean
      ];
    case 'history':
      return [
        `History of ${clean}`,
        clean
      ];
    case 'culture':
      return [
        `Culture of ${clean}`,
        `Art of ${clean}`,
        `Architecture of ${clean}`,
        clean
      ];
    case 'economy':
      return [
        `Economy of ${clean}`,
        `Transport in ${clean}`,
        clean
      ];
    case 'languages':
      return [
        `Languages of ${clean}`,
        clean
      ];
    case 'geography':
    default:
      return [
        `Geography of ${clean}`,
        clean
      ];
  }
}
