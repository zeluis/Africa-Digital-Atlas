/**
 * slaveVoyagesPorts.ts
 * Comprehensive Registry of African Embarkation Ports, Forts, and Coastal Enclaves
 * Geographically mapped across the 8 coastal regions of the Atlantic Slave Trade.
 */

import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface AfricanEmbarkationPort {
  id: string;
  name: string;
  historicalAliases: string[];
  region: 'Senegambia' | 'Sierra Leone' | 'Windward Coast' | 'Gold Coast' | 'Bight of Benin' | 'Bight of Biafra' | 'West Central Africa' | 'Southeast Africa';
  countryModern: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  svgCoordinates?: {
    x: number;
    y: number;
  };
  fortOrType: 'Masonry Castle / Fort' | 'Factory / Roadstead' | 'River Estuary / Barracoon' | 'Island Entrepôt';
  europeanPowers: ('Portugal' | 'Great Britain' | 'France' | 'Netherlands' | 'Denmark' | 'Brandenburg/Prussia' | 'Spain' | 'United States' | 'Sweden' | 'Brazil' | 'Germany')[];
  indigenousPolity: string;
  activeCentury: ('16th' | '17th' | '18th' | '19th')[];
  estimatedEmbarkations: number;
  primaryEthnicGroups: string[];
  primaryDestinations: string[];
  historicalDescription: string;
  unescoWorldHeritage: boolean;
}

/**
 * Calibrated Coastal Vector Coordinates:
 * Directly extracted from public/africa-final.svg (incorporating transform "translate(-216.0198 -66.614)").
 */
export const CALIBRATED_PORT_SVG_COORDINATES: Record<string, { x: number; y: number }> = {
  'port-goree': { x: 504, y: 1848 },
  'port-saint-louis': { x: 568, y: 1695 },
  'port-james-island': { x: 558, y: 1952 },
  'port-albreda': { x: 558, y: 1946 },
  'port-cacheu': { x: 538, y: 2035 },
  'port-bissau': { x: 556, y: 2060 },
  'port-rio-pongo': { x: 720, y: 2200 },
  'port-bunce-island': { x: 777, y: 2356 },
  'port-sherbro': { x: 831, y: 2420 },
  'port-gallinas': { x: 891, y: 2467 },
  'port-cape-mount': { x: 946, y: 2510 },
  'port-grand-bassa': { x: 1028, y: 2564 },
  'port-cape-palmas': { x: 1183, y: 2682 },
  'port-grand-bassam': { x: 1490, y: 2620 },
  'port-fort-san-antonio': { x: 1568, y: 2630 },
  'port-gross-friedrichsburg': { x: 1580, y: 2638 },
  'port-metal-cross': { x: 1595, y: 2630 },
  'port-elmina': { x: 1630, y: 2621 },
  'port-cape-coast': { x: 1642, y: 2618 },
  'port-anomabu': { x: 1653, y: 2613 },
  'port-fort-amsterdam': { x: 1665, y: 2612 },
  'port-christiansborg': { x: 1749, y: 2566 },
  'port-fort-prinzenstein': { x: 1805, y: 2542 },
  'port-little-popo': { x: 1888, y: 2521 },
  'port-grand-popo': { x: 1917, y: 2518 },
  'port-ouidah': { x: 1965, y: 2516 },
  'port-porto-novo': { x: 2000, y: 2513 },
  'port-badagry': { x: 2018, y: 2515 },
  'port-lagos': { x: 2034, y: 2518 },
  'port-gwato': { x: 2159, y: 2534 },
  'port-brass': { x: 2114, y: 2619 },
  'port-new-calabar': { x: 2235, y: 2665 },
  'port-bonny': { x: 2257, y: 2672 },
  'port-old-calabar': { x: 2402, y: 2514 },
  'port-bimbia': { x: 2520, y: 2692 },
  'port-sao-tome': { x: 2223, y: 2965 },
  'port-loango': { x: 2527, y: 3336 },
  'port-cabinda': { x: 2567, y: 3415 },
  'port-mpinda': { x: 2594, y: 3490 },
  'port-ambriz': { x: 2660, y: 3669 },
  'port-luanda': { x: 2660, y: 3792 },
  'port-benguela': { x: 2690, y: 4037 },
  'port-lamu': { x: 4700, y: 3120 },
  'port-mombasa': { x: 4640, y: 3340 },
  'port-zanzibar': { x: 4600, y: 3535 },
  'port-kilwa': { x: 4556, y: 3783 },
  'port-ibo-island': { x: 4620, y: 3964 },
  'port-mozambique-island': { x: 4615, y: 4122 },
  'port-angoche': { x: 4540, y: 4290 },
  'port-quelimane': { x: 4370, y: 4466 },
  'port-sofala': { x: 4230, y: 4660 },
  'port-inhambane': { x: 4150, y: 4890 },
  'port-delagoa-bay': { x: 3950, y: 5120 },
  'port-majunga': { x: 5040, y: 4230 },
  'port-sainte-marie': { x: 5410, y: 4420 }
};

const slaveVoyagesPortsUrl = new URL('./slaveVoyagesPorts.json', import.meta.url).href;

export const AFRICAN_EMBARKATION_PORTS: AfricanEmbarkationPort[] = [];

const slaveVoyagesPortsStore = createLazyAssetStore<AfricanEmbarkationPort[]>(
  [slaveVoyagesPortsUrl],
  ([payload]) => {
    if (Array.isArray(payload)) {
      const bound = payload.map((port: AfricanEmbarkationPort) =>
        CALIBRATED_PORT_SVG_COORDINATES[port.id]
          ? { ...port, svgCoordinates: CALIBRATED_PORT_SVG_COORDINATES[port.id] }
          : port
      );
      AFRICAN_EMBARKATION_PORTS.splice(0, AFRICAN_EMBARKATION_PORTS.length, ...bound);
    }
    return AFRICAN_EMBARKATION_PORTS;
  },
  () => AFRICAN_EMBARKATION_PORTS
);

export const ensureSlaveVoyagesPortsLoaded = slaveVoyagesPortsStore.ensureLoaded;
export const isSlaveVoyagesPortsLoaded = slaveVoyagesPortsStore.isLoaded;
export const subscribeSlaveVoyagesPorts = slaveVoyagesPortsStore.subscribe;
export const useSlaveVoyagesPortsLoaded = slaveVoyagesPortsStore.useLoaded;

/**
 * Calibrated Continental Projection:
 * Converts Geographic (lat, lng) to the 5,796 × 5,867 Coordinate Space of public/africa-final.svg.
 * Checks the curated calibrated coordinate dictionary by port ID first.
 */
export const projectPortToSvg = (lat: number, lng: number, portId?: string): { x: number; y: number } => {
  if (portId && CALIBRATED_PORT_SVG_COORDINATES[portId]) {
    return CALIBRATED_PORT_SVG_COORDINATES[portId];
  }
  return {
    x: Math.round(61.8 * lng + 1804),
    y: Math.round(-71.8 * lat + 3081)
  };
};
