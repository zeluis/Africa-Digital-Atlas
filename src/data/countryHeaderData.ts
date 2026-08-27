/**
 * countryHeaderData.ts - Authoritative Country Header Metadata for African Nations
 * Detailed records for all 54 sovereign African states + Western Sahara:
 * - Capital city (with administrative/legislative distinctions if applicable)
 * - Type of government
 * - Exact Independence date & UN admission date
 * - Languages (official and most spoken)
 * - Religion demographics
 * - IANA Timezone, GMT offset, and Climatological temperature baseline
 */

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

export const COUNTRY_HEADER_DATA: Record<string, CountryHeaderMetadata> = {
  DZA: {
    id: 'DZA',
    name: 'Algeria',
    capital: 'Algiers',
    governmentType: 'Semi-presidential Constitutional Republic',
    independenceDate: '5 July 1962',
    independenceFrom: 'France',
    unMemberDate: '8 October 1962',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic', 'Tamazight (Berber)'],
      mostSpoken: ['Algerian Arabic (Darja, 90%)', 'Tamazight/Kabyle (25%)', 'French (Lingua Franca)']
    },
    religion: {
      primary: 'Islam (Sunni 99%)',
      breakdown: 'Islam 99.0%, Christianity & Others 1.0%'
    },
    timeZone: 'Africa/Algiers',
    timeZoneAbbr: 'CET',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 22,
      tempRangeC: [12, 34],
      condition: 'Mediterranean Coastal / Saharan Arid',
      icon: 'sun-cloud',
      description: 'Mediterranean north with warm summers and mild winters; hot arid interior.'
    }
  },
  AGO: {
    id: 'AGO',
    name: 'Angola',
    capital: 'Luanda',
    governmentType: 'Presidential Republic',
    independenceDate: '11 November 1975',
    independenceFrom: 'Portugal',
    unMemberDate: '1 December 1976',
    unStatus: 'Full Member State',
    languages: {
      official: ['Portuguese'],
      mostSpoken: ['Portuguese (71%)', 'Umbundu (23%)', 'Kimbundu (8%)', 'Kikongo (8%)', 'Chokwe']
    },
    religion: {
      primary: 'Christianity (93.5%)',
      breakdown: 'Roman Catholic 56.4%, Protestant 37.1%, Traditional/Other 6.5%'
    },
    timeZone: 'Africa/Luanda',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 26,
      tempRangeC: [19, 31],
      condition: 'Tropical Atlantic / Semi-Arid',
      icon: 'sun-cloud',
      description: 'Tropical wet-and-dry with oceanic Benguela cooling along the coast.'
    }
  },
  BEN: {
    id: 'BEN',
    name: 'Benin',
    capital: 'Porto-Novo (Official) / Cotonou (Seat of Govt)',
    governmentType: 'Representative Democratic Presidential Republic',
    independenceDate: '1 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Fon (38%)', 'Yoruba (18%)', 'Bariba (9%)', 'Gun', 'Fula (Fulfulde)']
    },
    religion: {
      primary: 'Christianity (53%) & Islam (27.7%)',
      breakdown: 'Christianity 53.0%, Islam 27.7%, Vodun/Traditional 11.6%, Others 7.7%'
    },
    timeZone: 'Africa/Porto-Novo',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 28,
      tempRangeC: [23, 33],
      condition: 'Tropical Equatorial / Guinean',
      icon: 'tropical',
      description: 'Tropical and humid year-round with two rainy seasons (April–July, Sept–Nov).'
    }
  },
  BWA: {
    id: 'BWA',
    name: 'Botswana',
    capital: 'Gaborone',
    governmentType: 'Unitary Parliamentary Republic',
    independenceDate: '30 September 1966',
    independenceFrom: 'United Kingdom',
    unMemberDate: '17 October 1966',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Setswana (Tswana, 90%)', 'Kalanga (7%)', 'Sekgalagadi', 'English (Business)']
    },
    religion: {
      primary: 'Christianity (79.1%)',
      breakdown: 'Christianity 79.1% (Zionist, Pentecostal, Anglican), Badimo/Indigenous 4.1%, None/Other 16.8%'
    },
    timeZone: 'Africa/Gaborone',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 21,
      tempRangeC: [10, 33],
      condition: 'Semi-Arid Kalahari Subtropical',
      icon: 'sun',
      description: 'Semi-arid subtropical climate with hot sunny summers and clear, crisp winter nights.'
    }
  },
  BFA: {
    id: 'BFA',
    name: 'Burkina Faso',
    capital: 'Ouagadougou',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '5 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Mooré (National)', 'French (Working Language)'],
      mostSpoken: ['Mooré/Mossi (53%)', 'Dioula (Jula, 10%)', 'Fulfulde (Fula, 9%)', 'Gourmanché', 'Bissa']
    },
    religion: {
      primary: 'Islam (63.8%)',
      breakdown: 'Islam (Sunni) 63.8%, Christianity 26.3% (Catholic 20%, Protestant 6%), Traditional Animism 9.0%'
    },
    timeZone: 'Africa/Ouagadougou',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 29,
      tempRangeC: [20, 41],
      condition: 'Tropical Sahelian / Savanna',
      icon: 'sun',
      description: 'Tropical savanna transition to Sahel with hot dry season and monsoon rains (June–Sept).'
    }
  },
  BDI: {
    id: 'BDI',
    name: 'Burundi',
    capital: 'Gitega (Political) / Bujumbura (Economic)',
    governmentType: 'Presidential Republic',
    independenceDate: '1 July 1962',
    independenceFrom: 'Belgium',
    unMemberDate: '18 September 1962',
    unStatus: 'Full Member State',
    languages: {
      official: ['Kirundi', 'French', 'English'],
      mostSpoken: ['Kirundi (98%)', 'Swahili (Lake Tanganyika trade)', 'French']
    },
    religion: {
      primary: 'Christianity (93.9%)',
      breakdown: 'Roman Catholic 59.5%, Protestant/Evangelical 34.4%, Islam 2.5%, Traditional 3.6%'
    },
    timeZone: 'Africa/Bujumbura',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 23,
      tempRangeC: [17, 29],
      condition: 'Equatorial Highland Savanna',
      icon: 'sun-cloud',
      description: 'Temperate highland climate tempered by altitude and Lake Tanganyika breezes.'
    }
  },
  CPV: {
    id: 'CPV',
    name: 'Cabo Verde',
    capital: 'Praia',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '5 July 1975',
    independenceFrom: 'Portugal',
    unMemberDate: '16 September 1975',
    unStatus: 'Full Member State',
    languages: {
      official: ['Portuguese'],
      mostSpoken: ['Cape Verdean Creole (Kriolu, 99%)', 'Portuguese (Administrative/Education)']
    },
    religion: {
      primary: 'Christianity (85.3%)',
      breakdown: 'Roman Catholic 77.3%, Protestant 8.0%, Islam 1.8%, None/Others 12.9%'
    },
    timeZone: 'Atlantic/Cape_Verde',
    timeZoneAbbr: 'CVT',
    utcOffset: 'UTC-1',
    climate: {
      baseTempC: 25,
      tempRangeC: [21, 29],
      condition: 'Oceanic Tropical Semi-Arid',
      icon: 'wind',
      description: 'Mild oceanic tropical climate with constant Northeast trade winds and scarce rainfall.'
    }
  },
  CMR: {
    id: 'CMR',
    name: 'Cameroon',
    capital: 'Yaoundé (Political) / Douala (Economic Hub)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '1 January 1960',
    independenceFrom: 'France (French Cameroon) & UK (Southern Cameroons, 1961)',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French', 'English'],
      mostSpoken: ['Cameroonian Pidgin English', 'Ewondo/Beti', 'Duala', 'Fulfulde (North)', 'Bamileke']
    },
    religion: {
      primary: 'Christianity (70.7%)',
      breakdown: 'Christianity 70.7% (Catholic 38%, Protestant 30%), Islam 24.4%, Traditional Animist 2.3%, Others 2.6%'
    },
    timeZone: 'Africa/Douala',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 25,
      tempRangeC: [20, 31],
      condition: 'Tropical Equatorial / Diverse',
      icon: 'tropical',
      description: 'Microcosm of Africa: humid equatorial rainforest south, savanna plateau, and Sahelian north.'
    }
  },
  CAF: {
    id: 'CAF',
    name: 'Central African Republic',
    capital: 'Bangui',
    governmentType: 'Semi-presidential Republic',
    independenceDate: '13 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Sango', 'French'],
      mostSpoken: ['Sango (92% lingua franca)', 'Banda', 'Gbaya', 'French (Official)']
    },
    religion: {
      primary: 'Christianity (89%)',
      breakdown: 'Protestant 51.0%, Roman Catholic 38.0%, Islam 9.0%, Traditional 2.0%'
    },
    timeZone: 'Africa/Bangui',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 27,
      tempRangeC: [21, 35],
      condition: 'Tropical Wet-and-Dry Savanna',
      icon: 'sun-cloud',
      description: 'Hot tropical savanna with wet season (May–October) and dry winter harmattan winds.'
    }
  },
  TCD: {
    id: 'TCD',
    name: 'Chad',
    capital: "N'Djamena",
    governmentType: 'Presidential Republic',
    independenceDate: '11 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic', 'French'],
      mostSpoken: ['Chadian Arabic (Shuwa, 60%)', 'Sara (South, 30%)', 'Kanembu', 'Maba', 'Daza']
    },
    religion: {
      primary: 'Islam (52.1%) & Christianity (44.1%)',
      breakdown: 'Islam (Sunni/Sufi) 52.1%, Christianity 44.1% (Catholic 24%, Protestant 20%), Animist 3.8%'
    },
    timeZone: 'Africa/Ndjamena',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 29,
      tempRangeC: [17, 42],
      condition: 'Sahelian / Saharan Hot Desert',
      icon: 'sun',
      description: 'Hyper-arid Sahara desert in the north, semiarid Sahel in center, tropical savanna in south.'
    }
  },
  COM: {
    id: 'COM',
    name: 'Comoros',
    capital: 'Moroni',
    governmentType: 'Federal Presidential Republic',
    independenceDate: '6 July 1975',
    independenceFrom: 'France',
    unMemberDate: '12 November 1975',
    unStatus: 'Full Member State',
    languages: {
      official: ['Comorian (Shikomori)', 'Arabic', 'French'],
      mostSpoken: ['Shikomori (Swahili dialect, 96%)', 'French', 'Arabic']
    },
    religion: {
      primary: 'Islam (Sunni 98%)',
      breakdown: 'Sunni Islam (State Religion) 98.0%, Christianity & Others 2.0%'
    },
    timeZone: 'Indian/Comoro',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 26,
      tempRangeC: [22, 30],
      condition: 'Tropical Marine Oceanic',
      icon: 'tropical',
      description: 'Warm tropical maritime climate with kashkasi monsoon rains (Nov–April) and trade winds.'
    }
  },
  COG: {
    id: 'COG',
    name: 'Republic of the Congo',
    capital: 'Brazzaville',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '15 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Lingala (Brazzaville & North)', 'Kituba/Munukutuba (South)', 'Kikongo', 'Teke']
    },
    religion: {
      primary: 'Christianity (88.5%)',
      breakdown: 'Roman Catholic 50.5%, Protestant/Evangelical 37.0%, Islam 2.5%, Traditional 10.0%'
    },
    timeZone: 'Africa/Brazzaville',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 26,
      tempRangeC: [21, 31],
      condition: 'Equatorial Congo Rainforest',
      icon: 'rain',
      description: 'Humid equatorial climate with consistent high temperatures and abundant rainfall.'
    }
  },
  COD: {
    id: 'COD',
    name: 'Democratic Republic of the Congo',
    capital: 'Kinshasa',
    governmentType: 'Semi-presidential Constitutional Republic',
    independenceDate: '30 June 1960',
    independenceFrom: 'Belgium',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Lingala (Kinshasa & Army)', 'Swahili (East/Katanga)', 'Kikongo (West)', 'Tshiluba (Kasai)']
    },
    religion: {
      primary: 'Christianity (95.8%)',
      breakdown: 'Roman Catholic 50.0%, Protestant/Revival 35.0%, Kimbanguist Church 10.0%, Islam 1.5%, Traditional 3.5%'
    },
    timeZone: 'Africa/Kinshasa',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 26,
      tempRangeC: [21, 32],
      condition: 'Equatorial Basin Rainforest',
      icon: 'tropical',
      description: 'Heart of the Congo Basin rainforest; equatorial belt with two rainy seasons annually.'
    }
  },
  CIV: {
    id: 'CIV',
    name: "Côte d'Ivoire",
    capital: 'Yamoussoukro (Political) / Abidjan (Economic)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '7 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Dioula (Commercial trade)', 'Baoulé (23%)', 'Bété', 'Sénoufo', 'Dan (Yacouba)']
    },
    religion: {
      primary: 'Islam (42.9%) & Christianity (39.8%)',
      breakdown: 'Islam 42.9%, Christianity 39.8% (Catholic 17.2%, Evangelical 11.8%), Traditional/None 17.3%'
    },
    timeZone: 'Africa/Abidjan',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [22, 33],
      condition: 'Tropical Atlantic Monsoon',
      icon: 'tropical',
      description: 'Warm and humid tropical south coast transition to drier semi-arid northern savannas.'
    }
  },
  DJI: {
    id: 'DJI',
    name: 'Djibouti',
    capital: 'Djibouti City',
    governmentType: 'Semi-presidential Republic',
    independenceDate: '27 June 1977',
    independenceFrom: 'France',
    unMemberDate: '20 September 1977',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic', 'French'],
      mostSpoken: ['Somali (Issa, 60%)', 'Afar (Danakil, 35%)', 'Arabic', 'French']
    },
    religion: {
      primary: 'Islam (Sunni 94%)',
      breakdown: 'Sunni Islam (State Religion) 94.0%, Christianity 6.0%'
    },
    timeZone: 'Africa/Djibouti',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 31,
      tempRangeC: [23, 43],
      condition: 'Hyper-Arid Red Sea Coastal',
      icon: 'sun',
      description: 'One of the warmest countries on earth; hot desert climate with extreme summer heat.'
    }
  },
  EGY: {
    id: 'EGY',
    name: 'Egypt',
    capital: 'Cairo',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '28 February 1922',
    independenceFrom: 'United Kingdom',
    unMemberDate: '24 October 1945',
    unStatus: 'UN Founding Member State',
    languages: {
      official: ['Arabic'],
      mostSpoken: ['Egyptian Arabic (Masri, 95%)', 'Sa’idi Arabic (Upper Egypt)', 'Bedawi Arabic', 'Siwi Berber']
    },
    religion: {
      primary: 'Islam (Sunni 90%)',
      breakdown: 'Islam (Sunni state religion) 90.0%, Coptic Orthodox Christianity 10.0%'
    },
    timeZone: 'Africa/Cairo',
    timeZoneAbbr: 'EEST',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 24,
      tempRangeC: [12, 36],
      condition: 'Saharan Desert / Mediterranean Fringe',
      icon: 'sun',
      description: 'Arid desert climate with mild Mediterranean winters along the Delta and hot sunny summers.'
    }
  },
  GNQ: {
    id: 'GNQ',
    name: 'Equatorial Guinea',
    capital: 'Malabo (Bioko) / Ciudad de la Paz (Mainland)',
    governmentType: 'Unitary Dominant-party Presidential Republic',
    independenceDate: '12 October 1968',
    independenceFrom: 'Spain',
    unMemberDate: '12 November 1968',
    unStatus: 'Full Member State',
    languages: {
      official: ['Spanish', 'French', 'Portuguese'],
      mostSpoken: ['Fang (Mainland Rio Muni, 80%)', 'Bubi (Bioko Island)', 'Pichinglis (Creole)', 'Spanish']
    },
    religion: {
      primary: 'Christianity (88%)',
      breakdown: 'Roman Catholic 80.0%, Protestant 8.0%, Islam 4.0%, Traditional 8.0%'
    },
    timeZone: 'Africa/Malabo',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 26,
      tempRangeC: [22, 31],
      condition: 'Equatorial Humid Tropical',
      icon: 'rain',
      description: 'Heavy equatorial precipitation, permanent cloud cover, and high ambient humidity.'
    }
  },
  ERI: {
    id: 'ERI',
    name: 'Eritrea',
    capital: 'Asmara',
    governmentType: 'Unitary One-party Presidential Republic',
    independenceDate: '24 May 1993',
    independenceFrom: 'Ethiopia (Referendum April 1993)',
    unMemberDate: '28 May 1993',
    unStatus: 'Full Member State',
    languages: {
      official: ['Tigrinya', 'Arabic', 'English (Working Languages)'],
      mostSpoken: ['Tigrinya (50%)', 'Tigre (30%)', 'Afar', 'Saho', 'Kunama', 'Bilen']
    },
    religion: {
      primary: 'Christianity (50%) & Islam (48%)',
      breakdown: 'Eritrean Orthodox/Christian 50.0%, Sunni Islam 48.0%, Others 2.0%'
    },
    timeZone: 'Africa/Asmara',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 17,
      tempRangeC: [9, 26],
      condition: 'Highland Subtropical / Red Sea Coastal',
      icon: 'sun-cloud',
      description: 'Temperate and pleasant highland climate in Asmara (2,325m); hot desert coast on Red Sea.'
    }
  },
  SWZ: {
    id: 'SWZ',
    name: 'Eswatini',
    capital: 'Mbabane (Executive) / Lobamba (Legislative & Royal)',
    governmentType: 'Unitary Absolute Monarchy (Tinkhundla)',
    independenceDate: '6 September 1968',
    independenceFrom: 'United Kingdom',
    unMemberDate: '24 September 1968',
    unStatus: 'Full Member State',
    languages: {
      official: ['siSwati', 'English'],
      mostSpoken: ['siSwati (Swazi, 95%)', 'English (Government/Business)', 'isiZulu']
    },
    religion: {
      primary: 'Christianity (88.1%)',
      breakdown: 'Zionist/Syncretic 40.0%, Protestant/Evangelical 30.0%, Roman Catholic 18.1%, Traditional 9.9%'
    },
    timeZone: 'Africa/Mbabane',
    timeZoneAbbr: 'SAST',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 19,
      tempRangeC: [10, 27],
      condition: 'Subtropical Highveld / Middleveld',
      icon: 'sun-cloud',
      description: 'Subtropical to temperate variations across the Highveld, Middleveld, and Lowveld.'
    }
  },
  ETH: {
    id: 'ETH',
    name: 'Ethiopia',
    capital: 'Addis Ababa',
    governmentType: 'Federal Parliamentary Republic',
    independenceDate: 'Ancient Sovereign Nation (Restored 5 May 1941)',
    independenceFrom: 'Never Colonized (Defeated Italy at Battle of Adwa 1896)',
    unMemberDate: '24 October 1945',
    unStatus: 'UN Founding Member State',
    languages: {
      official: ['Amharic', 'Afaan Oromoo', 'Tigrinya', 'Somali', 'Afar'],
      mostSpoken: ['Oromo (34%)', 'Amharic (29%)', 'Somali (6%)', 'Tigrinya (5%)', 'Sidama', 'Gurage']
    },
    religion: {
      primary: 'Christianity (67.3%) & Islam (31.3%)',
      breakdown: 'Ethiopian Orthodox Tewahedo 43.8%, Protestant (P’ent’ay) 22.8%, Islam (Sunni) 31.3%, Catholic 0.7%'
    },
    timeZone: 'Africa/Addis_Ababa',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 16,
      tempRangeC: [8, 25],
      condition: 'Highland Subtropical (Woina Dega)',
      icon: 'sun-cloud',
      description: 'Perpetual spring-like highland climate in Addis Ababa (2,355m); distinct Kiremt rainy season.'
    }
  },
  GAB: {
    id: 'GAB',
    name: 'Gabon',
    capital: 'Libreville',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '17 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['French (80% fluent)', 'Fang (32%)', 'Myene', 'Nzebi', 'Bapounou']
    },
    religion: {
      primary: 'Christianity (82%)',
      breakdown: 'Roman Catholic 53.0%, Protestant/Evangelical 29.0%, Islam 10.0%, Bwiti/Traditional 8.0%'
    },
    timeZone: 'Africa/Libreville',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 27,
      tempRangeC: [22, 31],
      condition: 'Equatorial Humid Atlantic',
      icon: 'rain',
      description: '88% forest cover; humid equatorial climate with warm temperatures and high precipitation.'
    }
  },
  GMB: {
    id: 'GMB',
    name: 'The Gambia',
    capital: 'Banjul (Official) / Serekunda (Largest Metro)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '18 February 1965',
    independenceFrom: 'United Kingdom',
    unMemberDate: '21 September 1965',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Mandinka (38%)', 'Fula (Pulaar, 21%)', 'Wolof (18%)', 'Jola (10%)', 'Serahule']
    },
    religion: {
      primary: 'Islam (Sunni 96.4%)',
      breakdown: 'Sunni Islam 96.4%, Christianity 3.5%, Traditional 0.1%'
    },
    timeZone: 'Africa/Banjul',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [18, 34],
      condition: 'Tropical Savanna Coastal',
      icon: 'sun-cloud',
      description: 'Sub-Sahelian tropical climate with rainy season from June to October and dry pleasant winters.'
    }
  },
  GHA: {
    id: 'GHA',
    name: 'Ghana',
    capital: 'Accra',
    governmentType: 'Unitary Constitutional Presidential Republic',
    independenceDate: '6 March 1957',
    independenceFrom: 'United Kingdom (First Sub-Saharan Nation to Gain Independence)',
    unMemberDate: '8 March 1957',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Akan (Twi/Fante, 48%)', 'Ewe (14%)', 'Ga-Dangme (7%)', 'Dagbani', 'Hausa']
    },
    religion: {
      primary: 'Christianity (71.3%)',
      breakdown: 'Pentecostal/Charismatic 31.6%, Protestant 17.4%, Catholic 10.0%, Islam 19.9%, Traditional 3.2%'
    },
    timeZone: 'Africa/Accra',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [23, 33],
      condition: 'Tropical Maritime Coastal',
      icon: 'tropical',
      description: 'Warm tropical maritime south coast with two rainy seasons; dry savanna belt in the north.'
    }
  },
  GIN: {
    id: 'GIN',
    name: 'Guinea',
    capital: 'Conakry',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '2 October 1958',
    independenceFrom: 'France',
    unMemberDate: '12 December 1958',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Pular (Fula, 40%)', 'Maninka (Mandingo, 30%)', 'Susu (20%)', 'Kissi', 'Kpelle']
    },
    religion: {
      primary: 'Islam (Sunni 89.1%)',
      breakdown: 'Islam (Sunni/Sufi) 89.1%, Christianity 6.8%, Indigenous Religions 3.8%'
    },
    timeZone: 'Africa/Conakry',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [22, 33],
      condition: 'Tropical Atlantic Monsoon',
      icon: 'rain',
      description: 'Conakry receives over 4,000mm of annual rainfall; wet monsoon season (June–Nov).'
    }
  },
  GNB: {
    id: 'GNB',
    name: 'Guinea-Bissau',
    capital: 'Bissau',
    governmentType: 'Semi-presidential Republic',
    independenceDate: '24 September 1973',
    independenceFrom: 'Portugal',
    unMemberDate: '17 September 1974',
    unStatus: 'Full Member State',
    languages: {
      official: ['Portuguese'],
      mostSpoken: ['Crioulo (Guinea-Bissau Creole, 90%)', 'Balanta (14%)', 'Fula', 'Mandinka', 'Manjaco']
    },
    religion: {
      primary: 'Islam (46.1%) & Traditional (30.6%)',
      breakdown: 'Islam 46.1%, Traditional Animist 30.6%, Christianity 18.9%, Others 4.4%'
    },
    timeZone: 'Africa/Bissau',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [21, 34],
      condition: 'Tropical Monsoon Coastal',
      icon: 'tropical',
      description: 'Tropical wet-and-dry with Bijagós archipelago influence and monsoon winds.'
    }
  },
  KEN: {
    id: 'KEN',
    name: 'Kenya',
    capital: 'Nairobi',
    governmentType: 'Unitary Presidential Constitutional Republic',
    independenceDate: '12 December 1963',
    independenceFrom: 'United Kingdom',
    unMemberDate: '16 December 1963',
    unStatus: 'Full Member State',
    languages: {
      official: ['Swahili (Kiswahili)', 'English'],
      mostSpoken: ['Swahili (National lingua franca)', 'Kikuyu (20%)', 'Luhya (14%)', 'Kalenjin (12%)', 'Luo (11%)', 'Kamba (10%)']
    },
    religion: {
      primary: 'Christianity (85.5%)',
      breakdown: 'Protestant/Evangelical 53.4%, Roman Catholic 20.6%, Islam 10.9%, Traditional/Others 5.1%'
    },
    timeZone: 'Africa/Nairobi',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 19,
      tempRangeC: [11, 28],
      condition: 'Subtropical Highland (Green City in the Sun)',
      icon: 'sun-cloud',
      description: 'Temperate elevation (1,795m) with pleasant warm days, cool nights, and long rains (March–May).'
    }
  },
  LSO: {
    id: 'LSO',
    name: 'Lesotho',
    capital: 'Maseru',
    governmentType: 'Unitary Parliamentary Constitutional Monarchy',
    independenceDate: '4 October 1966',
    independenceFrom: 'United Kingdom',
    unMemberDate: '17 October 1966',
    unStatus: 'Full Member State',
    languages: {
      official: ['Sesotho (Southern Sotho)', 'English'],
      mostSpoken: ['Sesotho (99%)', 'isiZulu', 'isiXhosa', 'English (Administrative)']
    },
    religion: {
      primary: 'Christianity (90%)',
      breakdown: 'Roman Catholic 45.0%, Protestant/Evangelical 45.0%, Indigenous/Others 10.0%'
    },
    timeZone: 'Africa/Maseru',
    timeZoneAbbr: 'SAST',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 15,
      tempRangeC: [-2, 28],
      condition: 'Alpine Mountain / Subtropical Highland',
      icon: 'sun-cloud',
      description: 'Entirely above 1,400m ("Kingdom in the Sky"); cold winters with snow in the Maloti mountains.'
    }
  },
  LBR: {
    id: 'LBR',
    name: 'Liberia',
    capital: 'Monrovia',
    governmentType: 'Unitary Presidential Constitutional Republic',
    independenceDate: '26 July 1847',
    independenceFrom: 'American Colonization Society (First African Republic)',
    unMemberDate: '2 November 1945',
    unStatus: 'UN Founding Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Liberian English / Kreyol (lingua franca)', 'Kpelle (20%)', 'Bassa (14%)', 'Grebo', 'Gio', 'Mano']
    },
    religion: {
      primary: 'Christianity (85.6%)',
      breakdown: 'Christianity 85.6%, Islam 12.2%, Traditional Animism 0.6%, None/Other 1.6%'
    },
    timeZone: 'Africa/Monrovia',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 26,
      tempRangeC: [22, 31],
      condition: 'Tropical Rainforest Coastal',
      icon: 'rain',
      description: 'Monrovia is one of the wettest capital cities globally with over 4,600mm annual rainfall.'
    }
  },
  LBY: {
    id: 'LBY',
    name: 'Libya',
    capital: 'Tripoli',
    governmentType: 'Parliamentary Republic (Transitional Government of National Unity)',
    independenceDate: '24 December 1951',
    independenceFrom: 'Italy / UN Trusteeship (UK & France)',
    unMemberDate: '14 December 1955',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic'],
      mostSpoken: ['Libyan Arabic (96%)', 'Berber (Tamazight/Nafusi, 4%)', 'Tuareg', 'Tebu', 'Italian (Legacy)']
    },
    religion: {
      primary: 'Islam (Sunni 99%)',
      breakdown: 'Islam (Sunni state religion) 99.0%, Christianity & Others 1.0%'
    },
    timeZone: 'Africa/Tripoli',
    timeZoneAbbr: 'EET',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 22,
      tempRangeC: [9, 36],
      condition: 'Mediterranean Coast / Hyper-Arid Sahara',
      icon: 'sun',
      description: 'Mediterranean northern coast with mild wet winters; 90% of land is hyper-arid desert.'
    }
  },
  MDG: {
    id: 'MDG',
    name: 'Madagascar',
    capital: 'Antananarivo',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '26 June 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Malagasy', 'French'],
      mostSpoken: ['Malagasy (Plateau/Merina, Betsimisaraka, etc., 99%)', 'French (Official/Business)']
    },
    religion: {
      primary: 'Christianity (85%) & Ancestral (7%)',
      breakdown: 'Protestant 45.0%, Roman Catholic 40.0%, Traditional Ancestor Veneration 7.0%, Islam 3.0%, None 5.0%'
    },
    timeZone: 'Indian/Antananarivo',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 19,
      tempRangeC: [10, 27],
      condition: 'Highland Subtropical / Tropical Maritime',
      icon: 'sun-cloud',
      description: 'Mild highland climate in Antananarivo (1,276m); tropical rainforest east coast and semi-arid south.'
    }
  },
  MWI: {
    id: 'MWI',
    name: 'Malawi',
    capital: 'Lilongwe (Political) / Blantyre (Commercial)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '6 July 1964',
    independenceFrom: 'United Kingdom',
    unMemberDate: '1 December 1964',
    unStatus: 'Full Member State',
    languages: {
      official: ['English', 'Chichewa'],
      mostSpoken: ['Chichewa (Chewa, 57%)', 'Tumbuka (10%)', 'Yao (10%)', 'Lomwe (8%)', 'Sena']
    },
    religion: {
      primary: 'Christianity (77.3%)',
      breakdown: 'Protestant/CCAP 44.0%, Roman Catholic 17.2%, Islam 13.8%, Traditional/Other 8.9%'
    },
    timeZone: 'Africa/Blantyre',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 21,
      tempRangeC: [11, 30],
      condition: 'Subtropical Highland / Lake Basin',
      icon: 'sun-cloud',
      description: 'Subtropical climate moderated by Lake Malawi and elevation; wet summer (Nov–April).'
    }
  },
  MLI: {
    id: 'MLI',
    name: 'Mali',
    capital: 'Bamako',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '22 September 1960',
    independenceFrom: 'France',
    unMemberDate: '28 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Bambara + 12 National Languages (French as Working)'],
      mostSpoken: ['Bambara (Bamanankan, 80%)', 'Fula (Peul, 12%)', 'Soninke', 'Songhai', 'Tamasheq']
    },
    religion: {
      primary: 'Islam (Sunni 94.8%)',
      breakdown: 'Islam (Sunni/Sufi) 94.8%, Christianity 2.4%, Traditional Animist 2.0%, None 0.8%'
    },
    timeZone: 'Africa/Bamako',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 28,
      tempRangeC: [17, 40],
      condition: 'Sahelian Savanna / Saharan Arid',
      icon: 'sun',
      description: 'Tropical savanna in the south transitioning through the Sahelian belt to Saharan desert north.'
    }
  },
  MRT: {
    id: 'MRT',
    name: 'Mauritania',
    capital: 'Nouakchott',
    governmentType: 'Islamic Presidential Republic',
    independenceDate: '28 November 1960',
    independenceFrom: 'France',
    unMemberDate: '27 October 1961',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic'],
      mostSpoken: ['Hassaniya Arabic (80%)', 'Pulaar (Fula, 10%)', 'Soninke', 'Wolof', 'French (Administration)']
    },
    religion: {
      primary: 'Islam (Sunni 100%)',
      breakdown: 'Islam (Official State Religion) 100.0%'
    },
    timeZone: 'Africa/Nouakchott',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 26,
      tempRangeC: [15, 36],
      condition: 'Atlantic Saharan Desert',
      icon: 'sun',
      description: 'Hyper-arid Saharan climate tempered along the coast by cool Canary ocean currents.'
    }
  },
  MUS: {
    id: 'MUS',
    name: 'Mauritius',
    capital: 'Port Louis',
    governmentType: 'Unitary Parliamentary Republic',
    independenceDate: '12 March 1968',
    independenceFrom: 'United Kingdom',
    unMemberDate: '24 April 1968',
    unStatus: 'Full Member State',
    languages: {
      official: ['English (National Assembly)', 'French (Judiciary)'],
      mostSpoken: ['Mauritian Creole (Morisyen, 86%)', 'Bhojpuri (5%)', 'French', 'English']
    },
    religion: {
      primary: 'Hinduism (48.5%) & Christianity (32.7%)',
      breakdown: 'Hinduism 48.5%, Christianity 32.7% (Roman Catholic 26.3%), Islam 17.3%, Others 1.5%'
    },
    timeZone: 'Indian/Mauritius',
    timeZoneAbbr: 'MUT',
    utcOffset: 'UTC+4',
    climate: {
      baseTempC: 25,
      tempRangeC: [19, 30],
      condition: 'Tropical Oceanic Maritime',
      icon: 'tropical',
      description: 'Tropical maritime climate with Southeast trade winds; warm humid summer and mild dry winter.'
    }
  },
  MAR: {
    id: 'MAR',
    name: 'Morocco',
    capital: 'Rabat (Political) / Casablanca (Economic Capital)',
    governmentType: 'Unitary Parliamentary Constitutional Monarchy',
    independenceDate: '2 March 1956',
    independenceFrom: 'France & Spain',
    unMemberDate: '12 November 1956',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic', 'Tamazight (Berber)'],
      mostSpoken: ['Moroccan Arabic (Darija, 90%)', 'Tashelhit (Chleuh, 15%)', 'Central Atlas Tamazight', 'Tarifit', 'French']
    },
    religion: {
      primary: 'Islam (Sunni 99%)',
      breakdown: 'Sunni Islam (State Religion) 99.0%, Christianity & Judaism 1.0%'
    },
    timeZone: 'Africa/Casablanca',
    timeZoneAbbr: 'WEST',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 20,
      tempRangeC: [9, 30],
      condition: 'Mediterranean Coast / Atlas Alpine / Saharan',
      icon: 'sun-cloud',
      description: 'Mediterranean climate in the coastal north and west, snowcapped High Atlas, Saharan south.'
    }
  },
  MOZ: {
    id: 'MOZ',
    name: 'Mozambique',
    capital: 'Maputo',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '25 June 1975',
    independenceFrom: 'Portugal',
    unMemberDate: '16 September 1975',
    unStatus: 'Full Member State',
    languages: {
      official: ['Portuguese'],
      mostSpoken: ['Makhuwa (26%)', 'Portuguese (50% secondary)', 'Tsonga (Xichangana, 11%)', 'Sena (7%)', 'Lomwe']
    },
    religion: {
      primary: 'Christianity (59.8%)',
      breakdown: 'Christianity 59.8% (Catholic 27.2%, Evangelical/Zionist 32.6%), Islam 18.9%, Traditional/None 21.3%'
    },
    timeZone: 'Africa/Maputo',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 24,
      tempRangeC: [15, 31],
      condition: 'Tropical Indian Ocean Savanna',
      icon: 'sun-cloud',
      description: 'Tropical savanna climate along 2,470km of Indian Ocean coast; warm wet summers.'
    }
  },
  NAM: {
    id: 'NAM',
    name: 'Namibia',
    capital: 'Windhoek',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '21 March 1990',
    independenceFrom: 'South Africa (UN Mandate Transition)',
    unMemberDate: '23 April 1990',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Oshiwambo (49%)', 'Khoekhoegowab (Nama/Damara, 11%)', 'Afrikaans (10%)', 'Otjiherero (9%)', 'German']
    },
    religion: {
      primary: 'Christianity (87.9%)',
      breakdown: 'Protestant/Lutheran 44.0%, Roman Catholic 23.0%, Other Christian 20.9%, Traditional 10.2%'
    },
    timeZone: 'Africa/Windhoek',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 20,
      tempRangeC: [7, 31],
      condition: 'Subtropical Desert / Highveld Plateau',
      icon: 'sun',
      description: 'Arid to semi-arid; Namib desert along the coast, dry Kalahari east, sunny high plateau.'
    }
  },
  NER: {
    id: 'NER',
    name: 'Niger',
    capital: 'Niamey',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '3 August 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French + 10 National Languages'],
      mostSpoken: ['Hausa (53%)', 'Zarma/Songhai (21%)', 'Tamasheq (Tuareg, 11%)', 'Fulfulde (9%)', 'Kanuri (4%)']
    },
    religion: {
      primary: 'Islam (Sunni 99.3%)',
      breakdown: 'Islam (Sunni/Maliki) 99.3%, Christianity & Animist 0.7%'
    },
    timeZone: 'Africa/Niamey',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 29,
      tempRangeC: [17, 42],
      condition: 'Sahelian Semi-Arid / Saharan Hyper-Arid',
      icon: 'sun',
      description: 'One of the hottest nations on earth; predominantly desert with Sahelian southern farming belt.'
    }
  },
  NGA: {
    id: 'NGA',
    name: 'Nigeria',
    capital: 'Abuja (Federal Capital) / Lagos (Economic Hub)',
    governmentType: 'Federal Presidential Constitutional Republic',
    independenceDate: '1 October 1960',
    independenceFrom: 'United Kingdom',
    unMemberDate: '7 October 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Hausa (30%)', 'Yoruba (20%)', 'Igbo (18%)', 'Nigerian Pidgin (80M+ speakers)', 'Fulfulde', 'Kanuri', 'Ibibio']
    },
    religion: {
      primary: 'Islam (53.5%) & Christianity (45.9%)',
      breakdown: 'Islam (Northern majority) 53.5%, Christianity (Southern majority) 45.9%, Traditional/Other 0.6%'
    },
    timeZone: 'Africa/Lagos',
    timeZoneAbbr: 'WAT',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 27,
      tempRangeC: [21, 35],
      condition: 'Tropical Rainforest to Sahel Savanna',
      icon: 'tropical',
      description: 'Abuja enjoys pleasant tropical savanna climate; hot dry harmattan season in winter months.'
    }
  },
  RWA: {
    id: 'RWA',
    name: 'Rwanda',
    capital: 'Kigali',
    governmentType: 'Unitary Dominant-party Presidential Republic',
    independenceDate: '1 July 1962',
    independenceFrom: 'Belgium',
    unMemberDate: '18 September 1962',
    unStatus: 'Full Member State',
    languages: {
      official: ['Kinyarwanda', 'English', 'French', 'Swahili'],
      mostSpoken: ['Kinyarwanda (99.4%)', 'English (Education)', 'French', 'Swahili (Trade)']
    },
    religion: {
      primary: 'Christianity (93.8%)',
      breakdown: 'Protestant/Adventist 49.5%, Roman Catholic 40.0%, Islam 2.2%, Traditional/None 4.3%'
    },
    timeZone: 'Africa/Kigali',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 21,
      tempRangeC: [15, 28],
      condition: 'Equatorial Highland (Land of a Thousand Hills)',
      icon: 'sun-cloud',
      description: 'Pleasant equatorial mountain climate moderated by altitude (1,567m Kigali).'
    }
  },
  STP: {
    id: 'STP',
    name: 'São Tomé and Príncipe',
    capital: 'São Tomé',
    governmentType: 'Unitary Semi-presidential Republic',
    independenceDate: '12 July 1975',
    independenceFrom: 'Portugal',
    unMemberDate: '16 September 1975',
    unStatus: 'Full Member State',
    languages: {
      official: ['Portuguese'],
      mostSpoken: ['Portuguese (98%)', 'Forro Creole (36%)', 'Angolar (7%)', 'Principense']
    },
    religion: {
      primary: 'Christianity (71.9%)',
      breakdown: 'Roman Catholic 55.7%, Protestant/Adventist 16.2%, Islam 2.0%, None/Other 26.1%'
    },
    timeZone: 'Africa/Sao_Tome',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 26,
      tempRangeC: [22, 31],
      condition: 'Tropical Equatorial Maritime',
      icon: 'tropical',
      description: 'Lush volcanic island climate with two rainy seasons and rich cloud forest biomes.'
    }
  },
  SEN: {
    id: 'SEN',
    name: 'Senegal',
    capital: 'Dakar',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '4 April 1960',
    independenceFrom: 'France',
    unMemberDate: '28 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Wolof (85% lingua franca)', 'Pulaar (Fula, 24%)', 'Serer (15%)', 'Jola', 'Mandinka']
    },
    religion: {
      primary: 'Islam (Sunni/Sufi 96.1%)',
      breakdown: 'Islam (Tijaniyyah & Murid Sufi orders) 96.1%, Roman Catholic Christianity 3.8%, Animism 0.1%'
    },
    timeZone: 'Africa/Dakar',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 25,
      tempRangeC: [18, 30],
      condition: 'Oceanic Tropical Semi-Arid',
      icon: 'wind',
      description: 'Cape Verde peninsula location provides cooling ocean breezes in Dakar; tropical Sahelian interior.'
    }
  },
  SYC: {
    id: 'SYC',
    name: 'Seychelles',
    capital: 'Victoria (Mahé Island)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '29 June 1976',
    independenceFrom: 'United Kingdom',
    unMemberDate: '21 September 1976',
    unStatus: 'Full Member State',
    languages: {
      official: ['Seychellois Creole (Seselwa)', 'English', 'French'],
      mostSpoken: ['Seychellois Creole (95%)', 'English (Administration/Law)', 'French']
    },
    religion: {
      primary: 'Christianity (89.2%)',
      breakdown: 'Roman Catholic 76.2%, Anglican 10.6%, Hinduism 2.4%, Islam 1.6%, Others 9.2%'
    },
    timeZone: 'Indian/Mahe',
    timeZoneAbbr: 'SCT',
    utcOffset: 'UTC+4',
    climate: {
      baseTempC: 28,
      tempRangeC: [24, 32],
      condition: 'Tropical Marine Coral Archipelago',
      icon: 'tropical',
      description: 'Warm and humid tropical island paradise outside the cyclone belt; steady ocean breezes.'
    }
  },
  SLE: {
    id: 'SLE',
    name: 'Sierra Leone',
    capital: 'Freetown',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '27 April 1961',
    independenceFrom: 'United Kingdom',
    unMemberDate: '27 September 1961',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Krio (Creole, 90% lingua franca)', 'Mende (30% south)', 'Temne (30% north)', 'Limba', 'Fula']
    },
    religion: {
      primary: 'Islam (78.5%) & Christianity (20.4%)',
      breakdown: 'Islam (Sunni) 78.5%, Christianity 20.4%, Indigenous Beliefs 1.1%'
    },
    timeZone: 'Africa/Freetown',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [23, 32],
      condition: 'Tropical Monsoon Atlantic',
      icon: 'rain',
      description: 'Extremely high rainfall in Freetown (3,000mm+); torrential wet season from May to November.'
    }
  },
  SOM: {
    id: 'SOM',
    name: 'Somalia',
    capital: 'Mogadishu',
    governmentType: 'Federal Parliamentary Republic',
    independenceDate: '1 July 1960',
    independenceFrom: 'Italy (Trusteeship) & United Kingdom (British Somaliland)',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['Somali', 'Arabic'],
      mostSpoken: ['Somali (Af-Soomaali, 95%)', 'Maay (Southern dialects)', 'Arabic', 'English', 'Italian']
    },
    religion: {
      primary: 'Islam (Sunni 99.8%)',
      breakdown: 'Sunni Islam (Official State Religion) 99.8%, Others 0.2%'
    },
    timeZone: 'Africa/Mogadishu',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 27,
      tempRangeC: [22, 33],
      condition: 'Arid to Semi-Arid Tropical Coast',
      icon: 'sun',
      description: 'Hot desert and semi-arid scrub with monsoons and over 3,300km of coastline.'
    }
  },
  ZAF: {
    id: 'ZAF',
    name: 'South Africa',
    capital: 'Pretoria (Administrative) / Cape Town (Legislative) / Bloemfontein (Judicial)',
    capitalType: 'Three Capital System',
    governmentType: 'Unitary Parliamentary Republic with an Executive President',
    independenceDate: '31 May 1910 (Union) / 27 April 1994 (Democratic Non-Racial Transition)',
    independenceFrom: 'United Kingdom',
    unMemberDate: '7 November 1945',
    unStatus: 'UN Founding Member State',
    languages: {
      official: ['isiZulu', 'isiXhosa', 'Afrikaans', 'English', 'Sepedi', 'Setswana', 'Sesotho', 'Xitsonga', 'siSwati', 'Tshivenda', 'isiNdebele', 'SA Sign Language'],
      mostSpoken: ['isiZulu (24%)', 'isiXhosa (16%)', 'Afrikaans (13%)', 'English (10% primary, universal business)', 'Sepedi (9%)', 'Setswana (8%)']
    },
    religion: {
      primary: 'Christianity (86%)',
      breakdown: 'Christianity 86.0% (Zionist, Pentecostal, Methodist, Catholic), Traditional/Ancestral 5.4%, Islam 1.9%, Hinduism 0.9%, None 5.8%'
    },
    timeZone: 'Africa/Johannesburg',
    timeZoneAbbr: 'SAST',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 18,
      tempRangeC: [4, 29],
      condition: 'Subtropical Highveld / Mediterranean Cape',
      icon: 'sun-cloud',
      description: 'Diverse biomes: Mediterranean winter-rainfall in Cape Town, sunny high-altitude plateau in Pretoria.'
    }
  },
  SSD: {
    id: 'SSD',
    name: 'South Sudan',
    capital: 'Juba',
    governmentType: 'Transitional Presidential Republic',
    independenceDate: '9 July 2011',
    independenceFrom: 'Sudan (2011 Referendum - World’s Newest Sovereign State)',
    unMemberDate: '14 July 2011',
    unStatus: 'Newest 193rd UN Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Dinka (Thuɔŋjäŋ, 40%)', 'Nuer (Thok Nath, 15%)', 'Juba Arabic (lingua franca)', 'Bari', 'Zande', 'Shilluk']
    },
    religion: {
      primary: 'Christianity (60.5%) & Traditional (32.9%)',
      breakdown: 'Christianity 60.5% (Catholic 30%, Episcopal/Anglican 25%), Traditional African Religions 32.9%, Islam 6.2%'
    },
    timeZone: 'Africa/Juba',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 28,
      tempRangeC: [20, 39],
      condition: 'Tropical Savanna / Sudd Wetlands',
      icon: 'tropical',
      description: 'Tropical wet-and-dry with extensive White Nile Sudd papyrus swamps.'
    }
  },
  SDN: {
    id: 'SDN',
    name: 'Sudan',
    capital: 'Khartoum (Official) / Port Sudan (Administrative)',
    governmentType: 'Transitional Sovereignty Council',
    independenceDate: '1 January 1956',
    independenceFrom: 'United Kingdom & Egypt',
    unMemberDate: '12 November 1956',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic', 'English'],
      mostSpoken: ['Sudanese Arabic (80%)', 'Beja (Bedawiyet)', 'Fur', 'Nubian languages', 'Hausa']
    },
    religion: {
      primary: 'Islam (Sunni 91%)',
      breakdown: 'Sunni Islam 91.0%, Christianity 5.4%, Traditional Animist 3.6%'
    },
    timeZone: 'Africa/Khartoum',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 30,
      tempRangeC: [15, 43],
      condition: 'Hyper-Arid Saharan Desert to Savanna',
      icon: 'sun',
      description: 'Extremely hot and dry climate at the confluence of Blue and White Niles; haboob dust storms.'
    }
  },
  TZA: {
    id: 'TZA',
    name: 'Tanzania',
    capital: 'Dodoma (Official) / Dar es Salaam (Economic Hub & Port)',
    governmentType: 'Unitary Presidential Democratic Republic',
    independenceDate: '9 December 1961 (Tanganyika) / 26 April 1964 (Union with Zanzibar)',
    independenceFrom: 'United Kingdom',
    unMemberDate: '14 December 1961',
    unStatus: 'Full Member State',
    languages: {
      official: ['Swahili (Kiswahili)', 'English'],
      mostSpoken: ['Swahili (National lingua franca, 95%)', 'Sukuma (16%)', 'Chagga', 'Haya', 'Nyamwezi', 'Luo', 'English']
    },
    religion: {
      primary: 'Christianity (63.1%) & Islam (34.1%)',
      breakdown: 'Christianity 63.1% (Catholic 31%, Protestant 32%), Islam 34.1% (99% in Zanzibar archipelago), Traditional 2.8%'
    },
    timeZone: 'Africa/Dar_es_Salaam',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 23,
      tempRangeC: [14, 31],
      condition: 'Semi-Arid Central Plateau / Tropical Coast',
      icon: 'sun-cloud',
      description: 'Dodoma plateau is semi-arid with mild sunny days; humid tropical Indian Ocean coast.'
    }
  },
  TGO: {
    id: 'TGO',
    name: 'Togo',
    capital: 'Lomé',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '27 April 1960',
    independenceFrom: 'France',
    unMemberDate: '20 September 1960',
    unStatus: 'Full Member State',
    languages: {
      official: ['French'],
      mostSpoken: ['Ewe (Mina, 45% south)', 'Kabiye (25% north)', 'Kotokoli (Tem)', 'Gurma', 'French']
    },
    religion: {
      primary: 'Christianity (43.7%) & Traditional (35.6%)',
      breakdown: 'Christianity 43.7% (Catholic 26%, Protestant 17%), Traditional Animism/Vodun 35.6%, Islam 18.6%'
    },
    timeZone: 'Africa/Lome',
    timeZoneAbbr: 'GMT',
    utcOffset: 'UTC+0',
    climate: {
      baseTempC: 27,
      tempRangeC: [23, 33],
      condition: 'Tropical Guinea Savanna',
      icon: 'tropical',
      description: 'Warm tropical maritime coast with Benin Gap microclimate and two wet seasons.'
    }
  },
  TUN: {
    id: 'TUN',
    name: 'Tunisia',
    capital: 'Tunis',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '20 March 1956',
    independenceFrom: 'France',
    unMemberDate: '12 November 1956',
    unStatus: 'Full Member State',
    languages: {
      official: ['Arabic'],
      mostSpoken: ['Tunisian Arabic (Derja, 98%)', 'Berber (Chelha, 1%)', 'French (Commerce/Higher Education)']
    },
    religion: {
      primary: 'Islam (Sunni 99%)',
      breakdown: 'Sunni Islam (State Religion) 99.0%, Christianity & Judaism 1.0%'
    },
    timeZone: 'Africa/Tunis',
    timeZoneAbbr: 'CET',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 20,
      tempRangeC: [8, 35],
      condition: 'Mediterranean Coast / Saharan South',
      icon: 'sun-cloud',
      description: 'Warm Mediterranean climate in Tunis with mild winters and sunny dry summers; Saharan desert south.'
    }
  },
  UGA: {
    id: 'UGA',
    name: 'Uganda',
    capital: 'Kampala',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '9 October 1962',
    independenceFrom: 'United Kingdom',
    unMemberDate: '25 October 1962',
    unStatus: 'Full Member State',
    languages: {
      official: ['English', 'Swahili'],
      mostSpoken: ['Luganda (40%)', 'Runyankole/Rukiga (15%)', 'Swahili', 'Luo/Acholi', 'Ateso', 'Lugbara']
    },
    religion: {
      primary: 'Christianity (84.5%)',
      breakdown: 'Roman Catholic 39.3%, Anglican/Episcopal 32.0%, Pentecostal 11.1%, Islam 13.7%, Traditional/Other 3.9%'
    },
    timeZone: 'Africa/Kampala',
    timeZoneAbbr: 'EAT',
    utcOffset: 'UTC+3',
    climate: {
      baseTempC: 22,
      tempRangeC: [16, 29],
      condition: 'Equatorial Plateau / Lake Victoria Basin',
      icon: 'sun-cloud',
      description: 'Lush "Pearl of Africa" climate moderated by Lake Victoria and high altitude (1,190m).'
    }
  },
  ZMB: {
    id: 'ZMB',
    name: 'Zambia',
    capital: 'Lusaka',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '24 October 1964',
    independenceFrom: 'United Kingdom',
    unMemberDate: '1 December 1964',
    unStatus: 'Full Member State',
    languages: {
      official: ['English'],
      mostSpoken: ['Bemba (ChiBemba, 33%)', 'Nyanja/Chewa (15%)', 'Tonga (11%)', 'Lozi (6%)', 'Luvale', 'Kaonde']
    },
    religion: {
      primary: 'Christianity (95.5%)',
      breakdown: 'Protestant/Evangelical 75.3%, Roman Catholic 20.2%, Islam 1.0%, Traditional 3.5%'
    },
    timeZone: 'Africa/Lusaka',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 21,
      tempRangeC: [9, 31],
      condition: 'Subtropical High Plateau',
      icon: 'sun-cloud',
      description: 'Lusaka sits on a high plateau (1,280m); pleasant tropical climate with three distinct seasons.'
    }
  },
  ZWE: {
    id: 'ZWE',
    name: 'Zimbabwe',
    capital: 'Harare (Political) / Bulawayo (Industrial)',
    governmentType: 'Unitary Presidential Republic',
    independenceDate: '18 April 1980',
    independenceFrom: 'United Kingdom',
    unMemberDate: '25 August 1980',
    unStatus: 'Full Member State',
    languages: {
      official: ['16 Constitutional Languages including Shona, Ndebele & English'],
      mostSpoken: ['Shona (ChiShona, 70%)', 'isiNdebele (20%)', 'English (Business/Law)', 'Tonga', 'Chewa']
    },
    religion: {
      primary: 'Christianity (84.1%)',
      breakdown: 'Apostolic/Pentecostal 40.0%, Protestant 20.0%, Roman Catholic 14.1%, Traditional/Ancestral 10.2%, Islam 0.7%, None 5.0%'
    },
    timeZone: 'Africa/Harare',
    timeZoneAbbr: 'CAT',
    utcOffset: 'UTC+2',
    climate: {
      baseTempC: 20,
      tempRangeC: [7, 29],
      condition: 'Subtropical Highveld Plateau',
      icon: 'sun-cloud',
      description: 'Harare sits at 1,490m on the Highveld, enjoying warm sunny days and cool pleasant nights.'
    }
  },
  ESH: {
    id: 'ESH',
    name: 'Western Sahara',
    capital: 'Laayoune (Administered) / Tifariti (SADR Provisional)',
    governmentType: 'Disputed Territory / Sahrawi Arab Democratic Republic (AU Member)',
    independenceDate: '27 February 1976 (Spanish Withdrawal / SADR Declaration)',
    independenceFrom: 'Spain (Administered / Disputed Status)',
    unMemberDate: 'Non-Self-Governing Territory (UN MINURSO Mandate)',
    unStatus: 'UN Non-Self-Governing Territory / African Union Member',
    languages: {
      official: ['Arabic', 'Spanish'],
      mostSpoken: ['Hassaniya Arabic (90%)', 'Moroccan Arabic (Darija)', 'Spanish (Widely Understood)']
    },
    religion: {
      primary: 'Islam (Sunni 99.9%)',
      breakdown: 'Sunni Islam (Maliki school) 99.9%, Christian/Expatriate 0.1%'
    },
    timeZone: 'Africa/El_Aaiun',
    timeZoneAbbr: 'WEST',
    utcOffset: 'UTC+1',
    climate: {
      baseTempC: 22,
      tempRangeC: [13, 31],
      condition: 'Hyper-Arid Saharan Coastal Desert',
      icon: 'sun',
      description: 'Hyper-arid desert cooled along the Atlantic shoreline by the offshore Canary Current.'
    }
  }
};

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
