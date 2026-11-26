import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface CountryHistoricalDevelopmentDossier {
  id: string;
  countryName: string;
  countryCode: string;
  region: string;
  historicalTastRegion: string;
  portsOfEmbarkation: string[];
  tastVolumeEstimate: string;
  colonialPower: string;
  editorialLead: string;
  foundationsSummary: {
    preColonialEpoch: string;
    colonialExtractionMethod: string;
    modernInstitutionalLegacy: string;
  };
  wikiArticles: {
    title: string;
    url: string;
    description: string;
  }[];
  molecularReportTopic: string;
  foundationsReportTopic: string;
}

const countryHistoricalUrl = new URL('./countryHistoricalDevelopmentData.json', import.meta.url).href;

export const COUNTRY_HISTORICAL_DOSSIERS: Record<string, CountryHistoricalDevelopmentDossier> = {};

const countryHistoricalStore = createLazyAssetStore<Record<string, CountryHistoricalDevelopmentDossier>>(
  [countryHistoricalUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(COUNTRY_HISTORICAL_DOSSIERS, payload);
    }
    return COUNTRY_HISTORICAL_DOSSIERS;
  },
  () => COUNTRY_HISTORICAL_DOSSIERS
);

export const ensureCountryHistoricalLoaded = countryHistoricalStore.ensureLoaded;
export const isCountryHistoricalLoaded = countryHistoricalStore.isLoaded;
export const subscribeCountryHistorical = countryHistoricalStore.subscribe;
export const useCountryHistoricalLoaded = countryHistoricalStore.useLoaded;

/**
 * Universal fallback builder for any country without an explicit manual override.
 * Generates an academically grounded narrative connecting TAST,
 * colonial extraction, and modern development foundations.
 */
export function getCountryHistoricalDevelopmentDossier(
  countryNameOrCode: string,
  fallbackRegion?: string
): CountryHistoricalDevelopmentDossier {
  const query = countryNameOrCode.toLowerCase().trim();
  const normalizedKey = query.replace(/[^a-z0-9]+/g, '-');

  // Direct exact match in dictionary
  if (COUNTRY_HISTORICAL_DOSSIERS[normalizedKey]) {
    return COUNTRY_HISTORICAL_DOSSIERS[normalizedKey];
  }

  // Search by countryName or countryCode
  const entry = Object.values(COUNTRY_HISTORICAL_DOSSIERS).find(
    d => d.countryName.toLowerCase() === query || d.countryCode.toLowerCase() === query || d.id === normalizedKey
  );
  if (entry) return entry;

  // Synthesize an academically grounded dossier tailored to the region
  const name = countryNameOrCode.charAt(0).toUpperCase() + countryNameOrCode.slice(1);
  const region = fallbackRegion || 'African Continent';

  let tastRegion = 'Trans-Atlantic and Regional African Mercantile Networks';
  let ports = ['Regional Coastal Entrepôts & River Confluences'];
  let volume = 'Documented regional demographic flows and migration corridors';
  let power = 'European Colonial Partition (Post-Berlin Conference 1884–85)';

  if (region.includes('Western')) {
    tastRegion = 'Western African Littoral & Savanna Feeder Corridors';
    ports = ['Gulf of Guinea Coast', 'Bight Littorals', 'Riverine Confluences'];
    volume = 'Direct feeder embarkations and internal captive trade dynamics';
    power = 'British / French West African Colonial Administration (AOF / Direct Concessions)';
  } else if (region.includes('Central')) {
    tastRegion = 'West Central African Congo Basin & Atlantic Coastline';
    ports = ['Loango Coast', 'Congo River Estuary', 'Atlantic Termini'];
    volume = 'Significant human demographic extractions funneled to Atlantic sugar and mining colonies';
    power = 'French Equatorial Africa (AEF) / Belgian / Portuguese Concessionary Charters';
  } else if (region.includes('Eastern')) {
    tastRegion = 'Indian Ocean, Swahili Coast & Red Sea Maritime Networks';
    ports = ['Swahili Coast', 'Zanzibar Corridor', 'Mozambique Channel'];
    volume = 'Indian Ocean and Atlantic clandestine human trade flows';
    power = 'British East Africa / German East Africa / Portuguese East Africa';
  } else if (region.includes('Southern')) {
    tastRegion = 'Southern African Mineral and Agrarian Labor Corridors';
    ports = ['Delagoa Bay', 'Cape Maritime Route', 'Atlantic Ports'];
    volume = 'Regional forced labor migration and settler-colonial land appropriations';
    power = 'British South Africa Company / Afrikaner / German Protectorates';
  } else if (region.includes('Northern')) {
    tastRegion = 'Trans-Saharan Caravan Highways & Mediterranean Basin';
    ports = ['Mediterranean Ports', 'Oasis Caravan Termini', 'Nile Valley'];
    volume = 'Trans-Saharan trade in gold, salt, manuscripts, and human capital';
    power = 'French / British / Italian Colonial Hegemony & Ottoman Sovereignty';
  }

  return {
    id: normalizedKey,
    countryName: name,
    countryCode: name.slice(0, 3).toUpperCase(),
    region,
    historicalTastRegion: tastRegion,
    portsOfEmbarkation: ports,
    tastVolumeEstimate: volume,
    colonialPower: power,
    editorialLead: `Throughout the compounding structural epochs of modern African history, ${name} has occupied a vital position within the broader geopolitical transformations of the continent. From pre-colonial trade confluences and the demographic disruptions of the Atlantic and regional mercantile eras to the institutional disruptions imposed by late 19th-century European partition, the territory’s economic institutions were systematically configured for primary commodity extraction. The legacy of colonial chartered monopolies, dual legal systems, and export-oriented infrastructure corridors continues to shape contemporary developmental dynamics. Today, ${name} is actively advancing sovereign institutional reforms, regional economic integration under the African Continental Free Trade Area (AfCFTA), and strategic value-addition across its natural and human capital endowments.`,
    foundationsSummary: {
      preColonialEpoch: `Diverse indigenous governance systems, customary land tenures, and regional commerce across ${region}.`,
      colonialExtractionMethod: `Extractive administrative centralization, agricultural/mineral concession regimes, and transport links oriented exclusively to export hubs.`,
      modernInstitutionalLegacy: `Institutional modernization, resource value-chain beneficiation, and civic democratization under pan-African development agendas.`
    },
    wikiArticles: [
      { title: `History of ${name}`, url: `https://en.wikipedia.org/wiki/History_of_${encodeURIComponent(name)}`, description: `Historical epochs, pre-colonial kingdoms, and decolonization milestones.` },
      { title: 'Economic history of Africa', url: 'https://en.wikipedia.org/wiki/Economic_history_of_Africa', description: 'Comprehensive survey of pre-colonial, colonial, and post-independence development.' },
      { title: 'Decolonization of Africa', url: 'https://en.wikipedia.org/wiki/Decolonisation_of_Africa', description: 'The sovereign struggle for continental independence and self-determination.' }
    ],
    molecularReportTopic: `${name} Genomic Lineages & Continental Genetic Diversity`,
    foundationsReportTopic: `${name} in the Long-Run Institutional & Economic Development Paradigm`
  };
}
