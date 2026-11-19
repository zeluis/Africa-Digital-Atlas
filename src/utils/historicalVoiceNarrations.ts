import { speakAcademicNarration } from './afriataVoiceEngine';

export interface HistoricalEntityPronunciation {
  id: string;
  name: string;
  polity: string;
  era: string;
  phonetic: string;
  title: string;
  contextSummary: string;
}

export const HISTORICAL_ENTITY_PRONUNCIATIONS: Record<string, HistoricalEntityPronunciation> = {
  'mansa-musa': {
    id: 'mansa-musa',
    name: 'Mansa Musa',
    polity: 'Mali Empire',
    era: 'c. 1280–1337 CE',
    phonetic: '[ˈmæn.sə ˈmuː.sə]',
    title: 'Tenth Mansa of the Mali Empire',
    contextSummary: 'Renowned sovereign of the Mali Empire whose pilgrimage to Mecca in 1324 demonstrated the immense wealth and intellectual prestige of West African scholarship.'
  },
  'sundiata-keita': {
    id: 'sundiata-keita',
    name: 'Sundiata Keita',
    polity: 'Mali Empire',
    era: 'c. 1217–1255 CE',
    phonetic: '[sʊnˈdʒɑː.tə ˈkeɪ.tə]',
    title: 'Mari Djata, Founder of the Mali Empire',
    contextSummary: 'The legendary Lion King of Manden who defeated Sumanguru Kante at the Battle of Kirina and proclaimed the Kurukan Fuga charter.'
  },
  'askia-muhammad': {
    id: 'askia-muhammad',
    name: 'Askia Muhammad I',
    polity: 'Songhai Empire',
    era: 'c. 1443–1538 CE',
    phonetic: '[æsˈkiː.ə məˈhæm.əd]',
    title: 'Askia the Great, Emperor of Songhai',
    contextSummary: 'Visionary ruler who centralized administration, standardized weights and measures, and patronized the Sankoré University at Timbuktu.'
  },
  'sonni-ali': {
    id: 'sonni-ali',
    name: 'Sonni Ali Ber',
    polity: 'Songhai Empire',
    era: 'r. 1464–1492 CE',
    phonetic: '[ˈsɒn.i ˈæ.li bɛər]',
    title: 'First Great Emperor of Songhai',
    contextSummary: 'Fierce military strategist who captured Timbuktu and Djenné with his riverine naval fleet along the Niger River.'
  },
  'queen-nzinga': {
    id: 'queen-nzinga',
    name: 'Queen Nzinga Mbande',
    polity: 'Kingdoms of Ndongo & Matamba',
    era: 'c. 1583–1663 CE',
    phonetic: '[ˈŋzɪŋ.ɡə mˈbæn.deɪ]',
    title: 'Ngola of Ndongo and Queen of Matamba',
    contextSummary: 'Unyielding political and military strategist who allied with the Dutch and waged four decades of diplomatic and armed resistance against Portuguese colonial expansion.'
  },
  'shaka-zulu': {
    id: 'shaka-zulu',
    name: 'Shaka kaSenzangakhona',
    polity: 'Zulu Kingdom',
    era: 'c. 1787–1828 CE',
    phonetic: '[ˈʃɑː.kə kə.sɛn.zæŋ.ɡəˈkoʊ.nə]',
    title: 'King of the Zulu Kingdom',
    contextSummary: 'Transformational monarch who modernized military warfare with the iklwa short spear and the bull horn tactical encirclement formation.'
  },
  'osei-tutu': {
    id: 'osei-tutu',
    name: 'Otumfuo Osei Tutu I',
    polity: 'Ashanti Empire',
    era: 'c. 1660–1717 CE',
    phonetic: '[oʊˈseɪ ˈtuː.tuː]',
    title: 'First Asantehene of the Ashanti Empire',
    contextSummary: 'United the Akan clans into the Ashanti Empire alongside priest Okomfo Anokye under the spiritual unity of the Golden Stool.'
  },
  'yaa-asantewaa': {
    id: 'yaa-asantewaa',
    name: 'Yaa Asantewaa',
    polity: 'Ashanti Empire',
    era: 'c. 1840–1921 CE',
    phonetic: '[ˈjɑː ə.sænˈteɪ.wɑː]',
    title: 'Queen Mother of Ejisu',
    contextSummary: 'Valiant commander who led the 1900 War of the Golden Stool against British colonial aggression in defense of Asante sovereignty.'
  },
  'ezana-axum': {
    id: 'ezana-axum',
    name: 'Ezana of Axum',
    polity: 'Kingdom of Axum',
    era: 'r. c. 320s–360 CE',
    phonetic: '[ˈɛ.zə.nə ɒv ˈæk.sʊm]',
    title: 'Negus of Axum, Sovereign of Saba and Salhen',
    contextSummary: 'Monumental ruler of the Horn of Africa who erected the monumental Axumite stelae and forged maritime trade conduits across the Red Sea.'
  },
  'idris-alooma': {
    id: 'idris-alooma',
    name: 'Mai Idris Alooma',
    polity: 'Kanem-Bornu Empire',
    era: 'r. 1571–1603 CE',
    phonetic: '[maɪ ˈɪd.rɪs əˈluː.mə]',
    title: 'Mai of Kanem-Bornu',
    contextSummary: 'Celebrated statesman and military commander who equipped the cavalry with Turkish firearms and established fortified caravanserais around Lake Chad.'
  },
  'nyatsimba-mutota': {
    id: 'nyatsimba-mutota',
    name: 'Nyatsimba Mutota',
    polity: 'Kingdom of Mutapa',
    era: 'c. 1430–1450 CE',
    phonetic: '[ɲaˈtsim.ba muˈtoː.ta]',
    title: 'Mwene Mutapa',
    contextSummary: 'Founder of the Mutapa Empire who expanded northern dominance from Great Zimbabwe to the gold and copper routes of the Zambezi Valley.'
  },
  'dihya-kahina': {
    id: 'dihya-kahina',
    name: 'Dihya (Al-Kahina)',
    polity: 'Amazigh Resistance of the Aurès',
    era: 'r. c. 680s–703 CE',
    phonetic: '[diːˈhjæ æl kəˈhiː.nə]',
    title: 'Queen of the Aurès Mountains',
    contextSummary: 'Formidable Amazigh warrior queen who united Berber tribes against Byzantine and Umayyad expansion in Northwest Africa.'
  }
};

export function speakHistoricalEntity(
  entityKeyOrName: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: () => void }
) {
  const normKey = entityKeyOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const entity = HISTORICAL_ENTITY_PRONUNCIATIONS[normKey] ||
    Object.values(HISTORICAL_ENTITY_PRONUNCIATIONS).find(e =>
      e.name.toLowerCase().includes(entityKeyOrName.toLowerCase()) ||
      entityKeyOrName.toLowerCase().includes(e.name.toLowerCase())
    );

  const textToSpeak = entity
    ? `${entity.name}, ${entity.phonetic}. ${entity.title} of the ${entity.polity}, ${entity.era}. ${entity.contextSummary}`
    : `${entityKeyOrName}. Sovereign historical entity documented in the Afriata Cartographic Observatory.`;

  speakAcademicNarration({
    text: textToSpeak,
    langTag: 'en-NG',
    playChime: true,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError
  });
}

export function speakToponymConcordance(
  item: {
    antiqueName: string;
    plateSource: string;
    indigenousName?: string;
    modernName: string;
    modernCountry: string;
    note?: string;
  },
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: () => void }
) {
  const parts: string[] = [];
  parts.push(`${item.antiqueName}.`);
  if (item.indigenousName && item.indigenousName !== item.antiqueName) {
    parts.push(`Indigenous name: ${item.indigenousName}.`);
  }
  parts.push(`Corresponds to modern ${item.modernName} in ${item.modernCountry}.`);
  parts.push(`Observed on ${item.plateSource}.`);
  if (item.note) {
    parts.push(item.note);
  }

  speakAcademicNarration({
    text: parts.join(' '),
    langTag: 'en-NG',
    playChime: true,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError
  });
}
