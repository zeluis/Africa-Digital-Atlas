import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageOption, TranslationDictionary } from './types';
import { initNativeTranslationEngine, syncNativeTranslation } from '../utils/nativeTranslationBridge';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / Africa', flagEmoji: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Afrique francophone', flagEmoji: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europa', flagEmoji: '🇩🇪' },
  { code: 'pt', name: 'Portuguese (Portugal)', nativeName: 'Português (PT)', region: 'Lusofonia', flagEmoji: '🇵🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'España / Guinea Ecuatorial', flagEmoji: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europa / Corno d\'Africa', flagEmoji: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europa / Nederland', flagEmoji: '🇳🇱' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'شمال أفريقيا', flagEmoji: '🇪🇬', isRTL: true },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'ምሥራቅ አፍሪካ', flagEmoji: '🇪🇹' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', region: 'Yammacin Afirka', flagEmoji: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', region: 'Ọdịda Anyanwụ Afrịka', flagEmoji: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', region: 'Iwọ-oorun Afirika', flagEmoji: '🇳🇬' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wòlof', region: 'Sowwu Afrig', flagEmoji: '🇸🇳' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Ningizimu Afrika', flagEmoji: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Mzantsi Afrika', flagEmoji: '🇿🇦' },
];

const EN_DICTIONARY: TranslationDictionary = {
  'app.title': 'AFRICA DATA ATLAS',
  'app.subtitle': 'Curated Pan-African Socio-Economic Platform • 54 Sovereign Nations',
  'app.live_data': 'LIVE DATA',
  'app.live_data_tooltip': 'Real-time synchronized data feeds: World Bank, IMF, UN DESA & UNESCO',
  'app.quick_search': 'Quick Search...',
  'app.offline_ready': 'Offline Ready',
  'app.switch_theme_light': 'Switch to Day Mode (Light)',
  'app.switch_theme_dark': 'Switch to Night Mode (Dark)',
  'app.select_language': 'Language',
  'nav.africa': 'Africa',
  'nav.africa_home': 'Africa',
  'nav.overview': 'Overview',
  'nav.explore': 'Explore',
  'nav.history': 'History',
  'nav.reports': 'Reports',
  'nav.slave_trade': 'Atlantic Slave Trade',
  'nav.african_development_foundations': 'Foundations of African Development',
  'nav.pillars': '8 Thematic Pillars',
  'nav.blocs': '21 Regional Blocs',
  'nav.regions': 'Regions',
  'nav.analytics': 'Analytics',
  'nav.map': 'Map',
  'nav.languages': 'Languages',
  'nav.heritage': 'World Heritage',
  'nav.regions_section': 'Regions',
  'nav.northern_africa': 'Northern Africa',
  'nav.western_africa': 'Western Africa',
  'nav.central_africa': 'Central Africa',
  'nav.eastern_africa': 'Eastern Africa',
  'nav.southern_africa': 'Southern Africa',
  'nav.countries': 'Country Profiles',
  'nav.compare': 'Compare Tool',
  'nav.provenance': 'Quality & Pipeline',
  'nav.docs': 'Documentation & Guides',
  'nav.orientation': 'Orientation & Heritage',
  'report.directory_title': 'African Research & Analytical Reports',
  'report.directory_badge': 'Peer-Reviewed Academic & Policy Repository',
  'report.directory_desc': 'Explore accredited treatises spanning evolutionary genomics, international reparatory jurisprudence, macroeconomic development, and the enduring material legacies of the Transatlantic Slave Trade.',
  'report.read_report': 'Read Report',
  'report.peer_reviewed': 'Peer-Reviewed Reports',
  'report.cite_report': 'Cite Report',
  'report.explore_tree': 'Explore Ethnic Tree of Life',
  'report.category_all': 'All Disciplines',
  'report.category_genetics': 'Genetics & Admixture',
  'report.category_law': 'International Law & Reparations',
  'report.category_development': 'Development & Sociology',
  'report.category_tast': 'Historical Legacies (TAST)',
  'report.title.report-genetic-linguistic-blueprints': 'Genetic and Linguistic Blueprints of the African Atlantic Creole',
  'report.title.report-genetic-social-structure-cape-verde': 'Genetic and Social Structure of Cape Verde',
  'report.title.report-creole-admixture-cabo-verde': 'The Trans-Atlantic Slave Trade and Creole Admixture: Cabo Verde & São Tomé',
  'report.title.report-latest-developments-genetic-legacy': 'Latest Developments: Genetic Legacy of Transatlantic Slave Trade',
  'report.title.report-slavery-international-law-reparatory': 'Scholarly Analysis: Slavery, International Law, and Reparatory Justice',
  'report.title.report-sovereign-responsibility-reparations': 'Sovereign Responsibility and the Jurisprudence of Global Reparations',
  'report.title.report-reparations-debt-anthropocene': 'Reparations, Debt & Anthropocene Report',
  'report.title.report-ancestry-ideology-underdevelopment': 'Ancestry, Ideology, and Underdevelopment',
  'report.title.report-rao-model-socioeconomic': 'Research: RAO Model and African Socioeconomic Legacies',
  'report.title.report-sociological-origins-racism': 'Sociological Origins of Racism and African Underdevelopment',
  'report.title.molecular-legacies': 'The Molecular and Material Legacies of Slavery',
  'report.title.african-development-foundations': 'Foundations of African Development',
  'tab.overview': 'Overview & Facts',
  'tab.climate': 'Climate & Ecology',
  'tab.economy': 'Economy & Trade',
  'tab.demographics': 'Demographics',
  'tab.health_edu': 'Health & Education',
  'tab.infrastructure': 'Infrastructure & Tech',
  'tab.governance': 'Governance & Peace',
  'tab.heritage': 'UNESCO Heritage',
  'tab.subnational': 'Regions & Divisions',
  'tab.provenance': 'Provenance & Sources',
  'climate.title': 'Climate & Ecological Profile',
  'climate.subtitle': '12-month climatology cycles, precipitation, historical warming trends, vulnerability matrix & live capital conditions',
  'climate.temp_cycle_title': '12-Month Temperature Cycle & Monthly Climatology',
  'climate.temp_cycle_desc': 'Long-term mean monthly temperatures (°C) from January through December across meteorological baselines.',
  'climate.precip_title': 'Precipitation Distribution (Monthly Rainfall)',
  'climate.precip_desc': 'Monthly average precipitation distribution in millimeters (mm), highlighting seasonal rainfall patterns and dry/wet cycles.',
  'climate.historical_trend_title': 'Historical Temperature Trends (1970–2024)',
  'climate.historical_trend_desc': 'Multi-decadal warming trajectory showing average annual mean temperature growth per decade.',
  'climate.anomaly_title': 'Temperature Anomaly Trends (Baseline Deviations)',
  'climate.anomaly_desc': 'Annual temperature anomalies relative to the pre-industrial / 1961–1990 baseline showing climate shift intensity.',
  'climate.vulnerability_title': 'Climate Vulnerability & Risk Matrix',
  'climate.vulnerability_desc': 'ND-GAIN Index, ecosystem resilience, extreme weather exposure, and structural adaptation indicators.',
  'climate.resilience_title': 'National Resilience Narrative & Adaptation Strategy',
  'climate.resilience_desc': 'Comprehensive policy adaptation programs, NDC commitments, renewable integration, and ecological conservation.',
  'weather.live_title': 'Live Capital City Weather',
  'weather.source_openmeteo': 'Live via Open-Meteo',
  'weather.source_cached': 'Cached Climatological Baseline',
  'weather.temperature': 'Temperature',
  'weather.humidity': 'Relative Humidity',
  'weather.wind': 'Wind Speed',
  'weather.wind_dir': 'Wind Direction',
  'weather.condition': 'WMO Condition',
  'weather.apparent_temp': 'Apparent / Feels Like',
  'weather.refresh': 'Refresh Weather',
  'weather.last_updated': 'Last updated',
  'vuln.ndgain_index': 'ND-GAIN Vulnerability Index',
  'vuln.ndgain_rank': 'Global Vulnerability Rank',
  'vuln.readiness': 'ND-GAIN Readiness Score',
  'vuln.drought_risk': 'Drought & Heat Exposure Risk',
  'vuln.flood_risk': 'Flood & Coastal Surge Risk',
  'vuln.water_stress': 'Freshwater Stress Index',
  'vuln.renewable_share': 'Renewable Electricity Share',
  'vuln.target_2030': '2030 NDC Target',
  'action.read_more': 'Read Full Ecological & Resilience Narrative',
  'action.show_less': 'Show Summary',
  'action.toggle_unit': 'Switch Unit',
  'action.download_data': 'Export Data',
  'action.back_to_top': 'Back to Top',
  'quality.audit_note': 'Data Reconciliation Note',
  'quality.view_audit': 'View Provenance Audit →',
  'footer.license': 'Open Data License (CC-BY-4.0)',
  'footer.harmonized': 'Harmonized World Bank • IMF • UN DESA • UNESCO Series',
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'atlas_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGE_OPTIONS.some(l => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // Ignore storage errors
    }
    return 'en';
  });

  const [loadedTranslations, setLoadedTranslations] = useState<Record<string, TranslationDictionary> | null>(null);

  const isRTL = language === 'ar';

  // Initialize native translation bridge on initial app mount
  useEffect(() => {
    initNativeTranslationEngine();
  }, []);

  // Dynamically load full 15-language dictionary bundle when a non-English language is active
  useEffect(() => {
    if (language !== 'en' && !loadedTranslations) {
      import('./translations').then(m => {
        setLoadedTranslations(m.TRANSLATIONS);
      }).catch(() => {});
    }
  }, [language, loadedTranslations]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
    syncNativeTranslation(lang);
  };

  // Synchronize document dir, lang attribute, and native translation bridge on state changes
  useEffect(() => {
    syncNativeTranslation(language);
  }, [language]);

  const currentLanguageOption = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];

  const t = (key: string, fallback?: string): string => {
    if (language !== 'en' && loadedTranslations) {
      const langDict = loadedTranslations[language];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
    }
    if (EN_DICTIONARY[key]) {
      return EN_DICTIONARY[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        currentLanguageOption,
        availableLanguages: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
