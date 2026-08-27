/**
 * Service Layer & Query Engine for SlaveVoyages Data Atlas
 * Handles multi-dimensional filtering, epistemic mode translation,
 * cross-tabulations, URL parameter serialization, citations, and exports.
 */

import { 
  CANONICAL_VOYAGES, 
  SLAVEVOYAGES_METADATA, 
  REGIONAL_ROUTE_FLOWS, 
  AFRICAN_ORIGINS_PEOPLE,
  ENSLAVERS_REGISTRY,
  CENTURY_TIME_SERIES,
  CARRIER_BREAKDOWN,
  EMBARKATION_REGION_TOTALS,
  DISEMBARKATION_REGION_TOTALS
} from '../data/slaveVoyagesData';
import { 
  CanonicalVoyage, 
  VoyageFilterState, 
  EpistemicMode, 
  QueryCitationMeta, 
  AfricanEmbarkationRegion, 
  AmericanDisembarkationRegion, 
  CarrierNationality 
} from '../data/slaveVoyagesTypes';

export const DEFAULT_FILTERS: VoyageFilterState = {
  database: 'consolidated',
  epistemicMode: 'imputed',
  yearRange: [1514, 1866],
  embarkationRegions: [],
  disembarkationRegions: [],
  carriers: [],
  vesselSearch: '',
  minMortalityRate: 0,
  onlyResistanceRebellions: false,
  post1808IllicitOnly: false,
  sortBy: 'year',
  sortOrder: 'asc'
};

export interface FilterResult {
  voyages: CanonicalVoyage[];
  totalMatches: number;
  aggregateStats: {
    totalVoyages: number;
    totalEmbarked: number;
    totalDisembarked: number;
    avgMortalityRate: number;
    mortalityLossCount: number;
    rebellionsCount: number;
    uniqueVessels: number;
    earliestYear: number;
    latestYear: number;
    imputedPercentage: number;
  };
  provenance: {
    source: string;
    datasetVersion: string;
    retrievedAt: string;
    epistemicMode: EpistemicMode;
  };
}

export function filterVoyages(filters: VoyageFilterState): FilterResult {
  const voyages = CANONICAL_VOYAGES.filter(v => {
    // 1. Database filter
    if (filters.database !== 'consolidated' && v.database !== filters.database) {
      return false;
    }

    // 2. Year Range
    const year = v.dates.departureYear;
    if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
      return false;
    }

    // 3. Embarkation Region
    if (filters.embarkationRegions.length > 0) {
      const region = v.itinerary.principalPlaceOfSlavePurchase.region as AfricanEmbarkationRegion;
      if (!filters.embarkationRegions.includes(region)) return false;
    }

    // 4. Disembarkation Region
    if (filters.disembarkationRegions.length > 0) {
      const region = v.itinerary.principalPlaceOfSlaveLanding.region as AmericanDisembarkationRegion;
      if (!filters.disembarkationRegions.includes(region)) return false;
    }

    // 5. Carrier Nationality
    if (filters.carriers.length > 0) {
      if (!filters.carriers.includes(v.carrier.nationality)) return false;
    }

    // 6. Vessel Search
    if (filters.vesselSearch.trim() !== '') {
      const search = filters.vesselSearch.toLowerCase();
      const matchVessel = v.vessel.name.toLowerCase().includes(search);
      const matchCaptain = v.vessel.captain?.toLowerCase().includes(search);
      const matchOwner = v.vessel.owner?.toLowerCase().includes(search);
      const matchPort = v.itinerary.principalPlaceOfSlavePurchase.name.toLowerCase().includes(search) ||
                        v.itinerary.principalPlaceOfSlaveLanding.name.toLowerCase().includes(search);
      if (!matchVessel && !matchCaptain && !matchOwner && !matchPort) return false;
    }

    // 7. Mortality Rate Threshold
    if (filters.minMortalityRate && filters.minMortalityRate > 0) {
      if (v.enslaved.mortalityRateImputed < filters.minMortalityRate) return false;
    }

    // 8. Rebellions Flag
    if (filters.onlyResistanceRebellions && !v.resistance.hasRebellion) {
      return false;
    }

    // 9. Post-1808 Illicit Trade Flag
    if (filters.post1808IllicitOnly && v.outcomes.slaveTradeAbolitionPeriod === 'Pre-1808 Legal') {
      return false;
    }

    return true;
  });

  // Sort logic
  voyages.sort((a, b) => {
    let comp = 0;
    if (filters.sortBy === 'year') comp = a.dates.departureYear - b.dates.departureYear;
    else if (filters.sortBy === 'embarked') comp = (a.enslaved.embarkedImputed || 0) - (b.enslaved.embarkedImputed || 0);
    else if (filters.sortBy === 'disembarked') comp = (a.enslaved.disembarkedImputed || 0) - (b.enslaved.disembarkedImputed || 0);
    else if (filters.sortBy === 'mortality') comp = a.enslaved.mortalityRateImputed - b.enslaved.mortalityRateImputed;
    else if (filters.sortBy === 'vessel') comp = a.vessel.name.localeCompare(b.vessel.name);

    return filters.sortOrder === 'desc' ? -comp : comp;
  });

  // Aggregate calculations based on Epistemic Mode
  let totalEmbarked = 0;
  let totalDisembarked = 0;
  let totalMortalityRateWeighted = 0;
  let rebellionsCount = 0;
  let imputedVoyagesCount = 0;
  const uniqueVesselNames = new Set<string>();
  let minYear = 2000;
  let maxYear = 0;

  voyages.forEach(v => {
    let emb = 0;
    let dis = 0;

    if (filters.epistemicMode === 'observed') {
      emb = v.enslaved.embarkedObserved ?? (v.enslaved.isImputed ? 0 : v.enslaved.embarkedImputed);
      dis = v.enslaved.disembarkedObserved ?? (v.enslaved.isImputed ? 0 : v.enslaved.disembarkedImputed);
    } else if (filters.epistemicMode === 'imputed') {
      emb = v.enslaved.embarkedImputed;
      dis = v.enslaved.disembarkedImputed;
    } else {
      // Historical Estimates inflation ratio (1.17x continental demographic scaling)
      emb = Math.round(v.enslaved.embarkedImputed * 1.17);
      dis = Math.round(v.enslaved.disembarkedImputed * 1.14);
    }

    totalEmbarked += emb;
    totalDisembarked += dis;
    totalMortalityRateWeighted += (v.enslaved.mortalityRateImputed * (emb || 1));
    if (v.resistance.hasRebellion) rebellionsCount++;
    if (v.enslaved.isImputed) imputedVoyagesCount++;
    uniqueVesselNames.add(v.vessel.name);

    if (v.dates.departureYear < minYear) minYear = v.dates.departureYear;
    if (v.dates.departureYear > maxYear) maxYear = v.dates.departureYear;
  });

  const avgMortalityRate = totalEmbarked > 0 
    ? (totalEmbarked - totalDisembarked) / totalEmbarked * 100 
    : 0;

  return {
    voyages,
    totalMatches: voyages.length,
    aggregateStats: {
      totalVoyages: voyages.length,
      totalEmbarked,
      totalDisembarked,
      avgMortalityRate: Math.max(0, parseFloat(avgMortalityRate.toFixed(2))),
      mortalityLossCount: Math.max(0, totalEmbarked - totalDisembarked),
      rebellionsCount,
      uniqueVessels: uniqueVesselNames.size,
      earliestYear: voyages.length ? minYear : filters.yearRange[0],
      latestYear: voyages.length ? maxYear : filters.yearRange[1],
      imputedPercentage: voyages.length > 0 ? parseFloat(((imputedVoyagesCount / voyages.length) * 100).toFixed(1)) : 0
    },
    provenance: {
      source: 'SlaveVoyages Database (Trans-Atlantic & Intra-American)',
      datasetVersion: SLAVEVOYAGES_METADATA.version,
      retrievedAt: SLAVEVOYAGES_METADATA.retrievedAt,
      epistemicMode: filters.epistemicMode
    }
  };
}

/**
 * Serialize filter state to URL query parameters
 */
export function encodeFiltersToQueryString(filters: VoyageFilterState): string {
  const params = new URLSearchParams();
  if (filters.database !== 'consolidated') params.set('db', filters.database);
  if (filters.epistemicMode !== 'imputed') params.set('mode', filters.epistemicMode);
  if (filters.yearRange[0] !== 1514 || filters.yearRange[1] !== 1866) {
    params.set('from', filters.yearRange[0].toString());
    params.set('to', filters.yearRange[1].toString());
  }
  if (filters.embarkationRegions.length > 0) {
    params.set('origin', filters.embarkationRegions.join(';'));
  }
  if (filters.disembarkationRegions.length > 0) {
    params.set('dest', filters.disembarkationRegions.join(';'));
  }
  if (filters.carriers.length > 0) {
    params.set('carrier', filters.carriers.join(';'));
  }
  if (filters.vesselSearch) {
    params.set('q', filters.vesselSearch);
  }
  if (filters.onlyResistanceRebellions) {
    params.set('revolt', '1');
  }
  if (filters.post1808IllicitOnly) {
    params.set('illicit', '1');
  }
  return params.toString();
}

/**
 * Citation Formatter in APA, Chicago, MLA, and BibTeX
 */
export function generateAcademicCitations(meta: QueryCitationMeta): {
  apa: string;
  chicago: string;
  mla: string;
  bibtex: string;
} {
  const queryDesc = meta.querySummary || 'Trans-Atlantic and Intra-American Slave Trade Queries';
  const accessDate = '27 Aug. 2026';
  const year = '2026';
  const url = 'https://api.slavevoyages.org';

  const apa = `Eltis, D., Richardson, D., & SlaveVoyages Consortium. (${year}). Atlantic Slave Trade Data Atlas: ${queryDesc} [Data file and analysis environment]. SlaveVoyages Database Snapshot ${meta.datasetSnapshot}. Retrieved ${accessDate}, from ${url}`;

  const chicago = `Eltis, David, David Richardson, and the SlaveVoyages Consortium. "Atlantic Slave Trade Data Atlas: ${queryDesc}." SlaveVoyages Expanded Database (${meta.datasetSnapshot}). Accessed August 27, 2026. ${url}.`;

  const mla = `SlaveVoyages Consortium. "Atlantic Slave Trade Data Atlas: ${queryDesc}." *SlaveVoyages Online Database*, version ${meta.datasetSnapshot}, 2026, ${url}. Accessed 27 Aug. 2026.`;

  const bibtex = `@misc{slavevoyages_atlas_2026,
  author       = {{SlaveVoyages Consortium and Eltis, David and Richardson, David}},
  title        = {{Atlantic Slave Trade Data Atlas: ${queryDesc}}},
  year         = {2026},
  version      = {${meta.datasetSnapshot}},
  howpublished = {\\url{${url}}},
  note         = {Accessed: 2026-08-27. Epistemic Mode: ${meta.aggregateStats.epistemicMode}}
}`;

  return { apa, chicago, mla, bibtex };
}

/**
 * Export filtered dataset as CSV
 */
export function exportVoyagesToCSV(voyages: CanonicalVoyage[]): string {
  const headers = [
    'Voyage ID',
    'SlaveVoyages ID',
    'Database',
    'Departure Year',
    'Vessel Name',
    'Vessel Rig',
    'Tonnage',
    'Carrier Nationality',
    'Captain',
    'Owner',
    'Purchase Place (Embarkation)',
    'Purchase Region',
    'Landing Place (Disembarkation)',
    'Landing Region',
    'Embarked (Imputed)',
    'Disembarked (Imputed)',
    'Mortality Rate (%)',
    'Rebellion Reported',
    'Primary Source Citation'
  ];

  const rows = voyages.map(v => [
    v.id,
    v.provenance.slaveVoyagesId,
    v.database,
    v.dates.departureYear,
    `"${v.vessel.name.replace(/"/g, '""')}"`,
    v.vessel.rig || '',
    v.vessel.tonnage || '',
    v.carrier.nationality,
    `"${(v.vessel.captain || '').replace(/"/g, '""')}"`,
    `"${(v.vessel.owner || '').replace(/"/g, '""')}"`,
    `"${v.itinerary.principalPlaceOfSlavePurchase.name}"`,
    `"${v.itinerary.principalPlaceOfSlavePurchase.region}"`,
    `"${v.itinerary.principalPlaceOfSlaveLanding.name}"`,
    `"${v.itinerary.principalPlaceOfSlaveLanding.region}"`,
    v.enslaved.embarkedImputed,
    v.enslaved.disembarkedImputed,
    v.enslaved.mortalityRateImputed,
    v.resistance.hasRebellion ? 'Yes' : 'No',
    `"${(v.provenance.sourceCitations[0] || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
