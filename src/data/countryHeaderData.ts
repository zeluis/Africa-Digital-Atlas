/**
 * countryHeaderData.ts - Curated Country Header Metadata for African Nations
 * Detailed records for all 54 sovereign African states + Western Sahara:
 * - Capital city (with administrative/legislative distinctions if applicable)
 * - Type of government
 * - Exact Independence date & UN admission date
 * - Languages (official and most spoken)
 * - Religion demographics
 * - IANA Timezone, GMT offset, and Climatological temperature baseline
 */

import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface CountryHeaderMetadata {
  id: string; // ISO3
  name: string;
  capital: string;
  capitalType?: string; // e.g. "Administrative & Constitutional"
  governmentType: string;
  independenceDate: string;
  independenceFrom?: string;
  unMemberDate: string;
  unStatus: string;
  languages: {
    official: string[];
    mostSpoken: string[];
    nationalWorking?: string[];
  };
  religion: {
    primary: string;
    breakdown: string;
    details?: string[];
  };
  timeZone: string;
  timeZoneAbbr: string;
  utcOffset: string;
  climate: {
    baseTempC: number;
    tempRangeC: [number, number]; // [min, max] seasonal
    condition: string;
    icon: 'sun' | 'sun-cloud' | 'cloud' | 'rain' | 'wind' | 'tropical';
    description: string;
  };
}

const countryHeaderDataUrl = new URL('./countryHeaderData.json', import.meta.url).href;

export const COUNTRY_HEADER_DATA: Record<string, CountryHeaderMetadata> = {};

const countryHeaderDataStore = createLazyAssetStore<Record<string, CountryHeaderMetadata>>(
  [countryHeaderDataUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      Object.assign(COUNTRY_HEADER_DATA, payload);
    }
    return COUNTRY_HEADER_DATA;
  },
  () => COUNTRY_HEADER_DATA
);

export const ensureCountryHeaderDataLoaded = countryHeaderDataStore.ensureLoaded;
export const isCountryHeaderDataLoaded = countryHeaderDataStore.isLoaded;
export const subscribeCountryHeaderData = countryHeaderDataStore.subscribe;
export const useCountryHeaderDataLoaded = countryHeaderDataStore.useLoaded;

export function getCountryHeaderData(iso3: string): CountryHeaderMetadata {
  return COUNTRY_HEADER_DATA[iso3] || {
    id: iso3,
    name: iso3,
    capital: 'Capital City',
    governmentType: 'Republic',
    independenceDate: '1960',
    unMemberDate: '1960',
    unStatus: 'Member State',
    languages: {
      official: ['Official Language'],
      mostSpoken: ['Vernacular Languages']
    },
    religion: {
      primary: 'Diverse Religions',
      breakdown: 'Christianity, Islam & Traditional'
    },
    timeZone: 'UTC',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 25,
      tempRangeC: [18, 32],
      condition: 'Tropical',
      icon: 'sun-cloud',
      description: 'Tropical climate.'
    }
  };
}
