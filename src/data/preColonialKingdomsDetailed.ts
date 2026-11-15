import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface DynasticNode {
  id: string;
  name: string;
  title: string;
  reign: string;
  century: number;
  type: 'monarch' | 'queen_mother' | 'constitutional_milestone' | 'co_ruler';
  feat: string;
  predecessorId?: string;
  constitutionalImpact?: string;
  regalia?: string;
}

export interface Artifact3DRecord {
  id: string;
  title: string;
  nativeTitle: string;
  period: string;
  material: 'cast_bronze' | 'hammered_gold' | 'granite_stone' | 'illuminated_parchment' | 'carved_ivory' | 'terracotta' | 'kente_silk';
  dimensions: string;
  provenance: string;
  currentLocation: string;
  description: string;
  materialDetails: string;
  historicalSignificance: string;
  shaderType: 'bronze_patina' | 'gold_specular' | 'granite_grain' | 'aged_manuscript' | 'ivory_sheen';
  accentColor: string;
}

export interface TradeCorridorPath {
  id: string;
  name: string;
  commodity: 'gold' | 'salt' | 'cowries' | 'textiles' | 'kola' | 'copper' | 'ivory';
  color: string;
  startName: string;
  endName: string;
  points: [number, number][]; // SVG map coordinates in native 5796x5867 space
  flowDirection: 'north' | 'south' | 'east' | 'west' | 'bidirectional';
  volumeDescription: string;
  activeCenturies: number[];
  kingdomId?: string;
  kingdomName?: string;
  transportMode?: 'maritime_dhow' | 'camel_caravan' | 'riverine_flotilla' | 'cavalry_corridor' | 'forest_porters';
  historicalPeriod?: string;
  keyStops?: { name: string; role: string; modernCountry?: string }[];
  economicSignificance?: string;
  historicalQuote?: { text: string; author: string; source: string; year?: string };
  cargoTypes?: string[];
  modernLegacy?: string;
}

export interface ToponymConcordanceItem {
  antiqueName: string;
  plateSource: string;
  indigenousName: string;
  modernName: string;
  modernCountry: string;
  category: 'polity' | 'metropolis' | 'river' | 'coast' | 'mountain';
  coordinates: [number, number];
  svgCoordinates: [number, number];
  note: string;
}

export interface ModernEconomicBridge {
  historicalCommodity: string;
  modernEquivalentSector: string;
  modernValueMetric: string;
  modernKeyCountries: { iso3: string; name: string; shareOfGlobalMarket?: string }[];
  heritagePreservationStatus: string;
}

export interface RulerProfile {
  name: string;
  reign: string;
  feat: string;
}

export interface ScholarlyPublication {
  title: string;
  author: string;
  year: number;
  publisher: string;
  doiOrUrl?: string;
}

export interface KingdomDetailedRecord {
  id: string;
  name: string;
  nativeName: string;
  period: string;
  peakCentury: string;
  peakYear: number;
  region: string;
  regionBadge: string;
  color: string;
  capital: string;
  coordinates: [number, number];
  svgCoordinates: [number, number];
  territoryPolygonPath: string; // SVG path data in 5796x5867 coordinates
  modernCountries: string[];
  modernIso3Codes: string[];
  royalTitle: string;
  dynasty: string;
  indigenousScript: {
    scriptName: string;
    nativeCharacters: string;
    phoneticSpelling: string;
    historicalUsage: string;
  };
  foundingNarrative: string;
  famousRulers: RulerProfile[];
  dynasticTree: DynasticNode[];
  artifacts3D: Artifact3DRecord[];
  governanceSystem: string;
  stateCouncil: string;
  militaryStructure: string;
  currencySystem: string;
  majorCommodities: string[];
  tradeRoutes: string[];
  tradeCorridorPaths: TradeCorridorPath[];
  architecturalMonuments: string[];
  metallurgyAndArts: string[];
  unescoHeritageSites?: string[];
  historicalQuote?: {
    text: string;
    author: string;
    source: string;
    year?: string;
  };
  scholarlyPublications: ScholarlyPublication[];
  wikipediaUrl: string;
  summaryNarrative: string;
  economicBridge: ModernEconomicBridge;
}

const detailedKingdomsUrl = new URL('./preColonialKingdomsDetailed.json', import.meta.url).href;

export const DETAILED_KINGDOMS_DATA: Record<string, KingdomDetailedRecord> = {};
export const TOPONYM_CONCORDANCE_INDEX: ToponymConcordanceItem[] = [];
export const ALL_TRADE_CORRIDORS: TradeCorridorPath[] = [];

const detailedKingdomsStore = createLazyAssetStore<Record<string, KingdomDetailedRecord>>(
  [detailedKingdomsUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (payload.detailedKingdoms && typeof payload.detailedKingdoms === 'object') {
        Object.assign(DETAILED_KINGDOMS_DATA, payload.detailedKingdoms);
      }
      if (Array.isArray(payload.toponymConcordanceIndex)) {
        TOPONYM_CONCORDANCE_INDEX.splice(0, TOPONYM_CONCORDANCE_INDEX.length, ...payload.toponymConcordanceIndex);
      }
      const corridors = Object.values(DETAILED_KINGDOMS_DATA).flatMap(k => k.tradeCorridorPaths || []);
      ALL_TRADE_CORRIDORS.splice(0, ALL_TRADE_CORRIDORS.length, ...corridors);
    }
    return DETAILED_KINGDOMS_DATA;
  },
  () => DETAILED_KINGDOMS_DATA
);

export const ensureDetailedKingdomsLoaded = detailedKingdomsStore.ensureLoaded;
export const isDetailedKingdomsLoaded = detailedKingdomsStore.isLoaded;
export const subscribeDetailedKingdoms = detailedKingdomsStore.subscribe;
export const useDetailedKingdomsLoaded = detailedKingdomsStore.useLoaded;

export function getTradeCorridorById(id: string): TradeCorridorPath | undefined {
  return ALL_TRADE_CORRIDORS.find(c => c.id === id);
}
