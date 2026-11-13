import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { CountryFlag } from '../components/CountryFlag';
import { getCountryRegionTonalPalette, getRegionTonalPalette } from '../data/unGeoschemeColors';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { 
  Search, 
  Globe2, 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  Layers,
  Radio,
  ArrowRightLeft
} from 'lucide-react';
import { VoiceWelcomeFab } from '../components/VoiceWelcomeFab';
import { LANGUAGE_FAMILY_GREETINGS } from '../utils/afriataVoiceEngine';
import { MotherTonguesWaveformScrubber } from '../components/MotherTonguesWaveformScrubber';
import { AFRICAN_TYPOLOGICAL_FEATURES } from '../data/africanLinguisticTypology';
import { LinguisticTypologyComparator } from '../components/languages/LinguisticTypologyComparator';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_TACTILE, AnimatedTabPanel } from '../utils/motion';

interface LanguageFamily {
  id: string;
  name: string;
  nativeScript?: string;
  speakers: string;
  languagesCount: string;
  primaryRegions: string[];
  description: string;
  majorBranches: string[];
  keyLanguages: string[];
  color: string;
}

const LANGUAGE_FAMILIES: LanguageFamily[] = [
  {
    id: 'niger-congo',
    name: 'Niger-Congo',
    speakers: '600+ Million',
    languagesCount: '1,500+ Languages',
    primaryRegions: ['Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'],
    description: 'The world\'s largest language family by number of languages and Africa\'s most populous. Includes the vast Bantu family that spread across central and southern Africa, as well as Atlantic, Volta-Niger, and Kwa sub-branches.',
    majorBranches: ['Bantu', 'Volta-Niger', 'Atlantic', 'Kwa', 'Gur', 'Mande'],
    keyLanguages: ['Swahili (Kiswahili)', 'Yoruba', 'Igbo', 'Zulu (isiZulu)', 'Shona', 'Lingala', 'Fula (Fulfulde)', 'Wolof', 'Akan (Twi)', 'Xhosa'],
    color: 'emerald'
  },
  {
    id: 'afroasiatic',
    name: 'Afroasiatic',
    speakers: '450+ Million',
    languagesCount: '300+ Languages',
    primaryRegions: ['Northern Africa', 'Eastern Africa', 'Western Africa (Sahel)'],
    description: 'A major language family spanning North Africa, the Horn of Africa, and the Sahel. It includes ancient literary languages like Ge\'ez, Coptic, and Ancient Egyptian, alongside modern continental powerhouses.',
    majorBranches: ['Semitic', 'Cushitic', 'Berber (Tamazight)', 'Chadic', 'Omotic'],
    keyLanguages: ['Arabic (Modern Standard & Maghrebi/Sudanese dialects)', 'Hausa', 'Amharic', 'Oromo', 'Somali', 'Tamazight (Berber)', 'Tigrinya', 'Afar'],
    color: 'indigo'
  },
  {
    id: 'nilo-saharan',
    name: 'Nilo-Saharan',
    speakers: '60+ Million',
    languagesCount: '200+ Languages',
    primaryRegions: ['Central Africa', 'Eastern Africa', 'Sahel'],
    description: 'A distinct group of indigenous African languages centered around the upper Nile, Chad basin, and central Sahelian plateau, noted for tonal systems and rich pastoral vocabulary.',
    majorBranches: ['Nilotic', 'Saharan', 'Songhay', 'Central Sudanic', 'Fur', 'Maban'],
    keyLanguages: ['Dinka (Thuɔŋjäŋ)', 'Luo (Dholuo)', 'Kanuri', 'Maasai (ɔl-Maa)', 'Songhai', 'Nuer (Thok Nath)', 'Lugbara', 'Zarma'],
    color: 'amber'
  },
  {
    id: 'austronesian',
    name: 'Austronesian (Malagasy)',
    speakers: '28+ Million',
    languagesCount: 'Dialects of Malagasy',
    primaryRegions: ['Eastern Africa (Madagascar)'],
    description: 'The sole Austronesian language branch in Africa, spoken across Madagascar. Brought by seafaring Indonesian settlers during the 1st millennium CE, it fused with Bantu influences to form a unique linguistic heritage.',
    majorBranches: ['Barito (East Barito)'],
    keyLanguages: ['Standard Malagasy (Merina)', 'Betsimisaraka', 'Tsimihety', 'Sakalava'],
    color: 'rose'
  },
  {
    id: 'khoisan',
    name: 'Khoisan (Click Language Families)',
    speakers: '400,000+',
    languagesCount: '30+ Languages',
    primaryRegions: ['Southern Africa (Kalahari)', 'Eastern Africa (Rift Valley)'],
    description: 'Indigenous language families of southern and eastern Africa famous for their complex click consonants. Represents some of humanity\'s oldest surviving linguistic lineages.',
    majorBranches: ['Kx\'a (Ju-ǂHoan)', 'Tuu (!Xóõ)', 'Khoe-Kwadi (Nama)', 'Hadza (Isolate)', 'Sandawe'],
    keyLanguages: ['Nama (Khoekhoegowab)', 'Ju/\'hoansi', '!Xóõ (Taa)', 'Hadza', 'Sandawe'],
    color: 'purple'
  },
  {
    id: 'indo-european',
    name: 'Indo-European & Creoles',
    speakers: '180+ Million (L1 + L2)',
    languagesCount: 'Colonial & Creole varieties',
    primaryRegions: ['Continental & Island States'],
    description: 'Includes African-evolved Indo-European languages (Afrikaans in South Africa/Namibia), Portuguese- and French-based Creoles (Cape Verdean Crioulo, Seychellois Creole, Mauritian Kreol), alongside European administrative languages.',
    majorBranches: ['Germanic (Afrikaans)', 'Portuguese Creoles', 'French Creoles', 'English Creoles'],
    keyLanguages: ['Afrikaans', 'Cape Verdean Creole (Kabuverdianu)', 'Mauritian Creole (Morisyen)', 'Seychellois Creole (Seselwa)'],
    color: 'cyan'
  }
];

interface IndigenousLinguaFranca {
  name: string;
  nativeName: string;
  family: string;
  speakers: string;
  writingSystems: string[];
  countriesSpoken: string[];
  status: string;
  description: string;
}

const INDIGENOUS_LINGUA_FRANCAS: IndigenousLinguaFranca[] = [
  {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    family: 'Niger-Congo (Bantu)',
    speakers: '150–200 Million',
    writingSystems: ['Latin script', 'Historical Arabic script (Ajami)'],
    countriesSpoken: ['Tanzania', 'Kenya', 'Uganda', 'DR Congo', 'Rwanda', 'Burundi', 'Mozambique', 'Somalia'],
    status: 'Official language of EAC, African Union, SADC, Tanzania, Kenya, Uganda & DR Congo',
    description: 'The premier African lingua franca of the Great Lakes and Swahili Coast, widely used in cross-border trade, media, and diplomacy.'
  },
  {
    name: 'Hausa',
    nativeName: 'Harshen Hausa (هَرْشَن هَوْسَ)',
    family: 'Afroasiatic (Chadic)',
    speakers: '85–90 Million',
    writingSystems: ['Latin (Boko)', 'Arabic (Ajami)'],
    countriesSpoken: ['Nigeria', 'Niger', 'Ghana', 'Cameroon', 'Chad', 'Benin', 'Togo', 'Sudan'],
    status: 'Dominant regional commercial language of West Africa and the Sahel',
    description: 'The most widely spoken indigenous language in West Africa, historically dominant across Trans-Saharan trade routes.'
  },
  {
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    family: 'Niger-Congo (Volta-Niger)',
    speakers: '50–55 Million',
    writingSystems: ['Latin script'],
    countriesSpoken: ['Nigeria', 'Benin', 'Togo'],
    status: 'National language in Nigeria, Benin; vibrant global diaspora presence',
    description: 'A major tonal language with rich classical literature, orature (Oriki, Ifá corpus), and prominent cultural diaspora in the Americas.'
  },
  {
    name: 'Amharic',
    nativeName: 'አማርኛ (Amarəñña)',
    family: 'Afroasiatic (Semitic)',
    speakers: '35–40 Million',
    writingSystems: ['Ge\'ez script (Fidel / አቡጊዳ)'],
    countriesSpoken: ['Ethiopia', 'Eritrea (Diaspora)'],
    status: 'Official working language of the Federal Democratic Republic of Ethiopia',
    description: 'Spoken natively and as a working language across Ethiopia, utilizing the historic 3,000-year-old Ge\'ez abugida writing system.'
  },
  {
    name: 'Oromo',
    nativeName: 'Afaan Oromoo',
    family: 'Afroasiatic (Cushitic)',
    speakers: '40–45 Million',
    writingSystems: ['Qubee (Latin-based)', 'Historic Arabic/Sapalo scripts'],
    countriesSpoken: ['Ethiopia', 'Kenya', 'Somalia'],
    status: 'Official working language of Oromia State; largest native language in Horn of Africa',
    description: 'The most populous mother tongue in the Horn of Africa, spoken extensively across the Ethiopian highlands and northern Kenya.'
  },
  {
    name: 'Zulu',
    nativeName: 'isiZulu',
    family: 'Niger-Congo (Bantu/Nguni)',
    speakers: '28–30 Million',
    writingSystems: ['Latin script'],
    countriesSpoken: ['South Africa', 'Eswatini', 'Lesotho', 'Zimbabwe', 'Mozambique'],
    status: 'Official language of South Africa (most spoken first language, ~24% of pop)',
    description: 'The largest home language in South Africa, featuring distinct click consonants adopted from Khoisan languages.'
  },
  {
    name: 'Lingala',
    nativeName: 'Lingála',
    family: 'Niger-Congo (Bantu)',
    speakers: '45–50 Million',
    writingSystems: ['Latin script', 'Mandombe script'],
    countriesSpoken: ['DR Congo', 'Republic of Congo', 'Angola', 'Central African Republic'],
    status: 'National language of DR Congo and Republic of the Congo; language of Soukous & Congolese Rumba',
    description: 'The commercial and musical lingua franca of the Congo River basin, celebrated globally through Congolese musical culture.'
  },
  {
    name: 'Fula / Fulfulde',
    nativeName: 'Fulfulde / Pulaar (𞤊𞤵𞤤𞤬𞤵𞤤𞤣𞤫)',
    family: 'Niger-Congo (Senegambian)',
    speakers: '40–45 Million',
    writingSystems: ['ADLaM script', 'Latin', 'Arabic (Ajami)'],
    countriesSpoken: ['Senegal', 'Guinea', 'Mali', 'Nigeria', 'Cameroon', 'Niger', 'Burkina Faso', 'Mauritania'],
    status: 'Cross-continental lingua franca spoken across 18+ African nations from Senegal to Sudan',
    description: 'Spoken across the vast Sahelian belt by the pastoral Fulani people; pioneer of the modern African ADLaM script created in Guinea.'
  }
];

interface LanguagesViewProps {
  onSelectCountry: (entityId: string) => void;
}

type LangSubTab = 'families' | 'waveforms' | 'comparator' | 'typology' | 'lingua-francas' | 'countries';
type LangPrimaryGroup = 'families' | 'phonetics-labs' | 'lingua-francas' | 'countries';

const LANG_TAB_TO_GROUP: Record<LangSubTab, LangPrimaryGroup> = {
  families: 'families',
  waveforms: 'phonetics-labs',
  comparator: 'phonetics-labs',
  typology: 'phonetics-labs',
  'lingua-francas': 'lingua-francas',
  countries: 'countries',
};

const handleLangTabKeyDown = (
  e: React.KeyboardEvent<HTMLButtonElement>,
  ids: string[],
  currentIndex: number,
  onSelect: (id: string) => void
) => {
  if (ids.length === 0) return;
  let nextIdx = -1;
  if (e.key === 'ArrowRight') nextIdx = (currentIndex + 1) % ids.length;
  else if (e.key === 'ArrowLeft') nextIdx = (currentIndex - 1 + ids.length) % ids.length;
  else if (e.key === 'Home') nextIdx = 0;
  else if (e.key === 'End') nextIdx = ids.length - 1;

  if (nextIdx !== -1) {
    e.preventDefault();
    onSelect(ids[nextIdx]);
    const nextBtn = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIdx];
    nextBtn?.focus();
  }
};

export const LanguagesView: React.FC<LanguagesViewProps> = ({
  onSelectCountry
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<LangSubTab>('families');
  const [lastLabTab, setLastLabTab] = useState<'waveforms' | 'comparator' | 'typology'>('waveforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('niger-congo');
  const [activeWaveformLangId, setActiveWaveformLangId] = useState<string>('yoruba');
  const [selectedTypologyId, setSelectedTypologyId] = useState<string>('clicks');

  const allEntities = atlas.getAllEntities();

  // Filter countries by language search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return allEntities;
    const q = searchQuery.toLowerCase();
    return allEntities.filter(entity => {
      const meta = COUNTRY_HEADER_DATA[entity.id];
      const nameMatch = entity.name.toLowerCase().includes(q);
      const officialMatch = meta?.languages.official.some(l => l.toLowerCase().includes(q));
      const spokenMatch = meta?.languages.mostSpoken.some(l => l.toLowerCase().includes(q));
      return nameMatch || officialMatch || spokenMatch;
    });
  }, [allEntities, searchQuery]);

  const activeGroup = LANG_TAB_TO_GROUP[activeTab];

  const selectSubTab = (tab: LangSubTab) => {
    setActiveTab(tab);
    if (tab === 'waveforms' || tab === 'comparator' || tab === 'typology') {
      setLastLabTab(tab);
    }
  };

  const selectPrimaryGroup = (group: LangPrimaryGroup) => {
    if (group === 'phonetics-labs') {
      setActiveTab(lastLabTab);
    } else {
      setActiveTab(group);
    }
  };

  const primaryGroups: { id: LangPrimaryGroup; label: string; icon: React.ReactNode }[] = [
    { id: 'families', label: 'Language Families (6)', icon: null },
    { id: 'phonetics-labs', label: 'Phonetics & Typology Labs', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'lingua-francas', label: 'Major Lingua Francas', icon: null },
    { id: 'countries', label: 'Country Matrix (54)', icon: null },
  ];

  const labSubTabs: { id: 'waveforms' | 'comparator' | 'typology'; label: string; icon: React.ReactNode }[] = [
    { id: 'waveforms', label: 'Waveform Lab (10)', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'comparator', label: 'Typology Comparator', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
    { id: 'typology', label: 'Phonemic & Typology Lab (5)', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <section aria-label="Languages and Linguistics of Africa Observatory" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <header className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm transition-colors space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Africa Atlas · Languages &amp; Linguistics
            </p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display text-balance">
              Languages &amp; Linguistics of Africa
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Home to over 2,000 distinct living languages across 6 major linguistic phyla, representing extraordinary phonetic diversity, indigenous scripts, and dynamic cross-border lingua francas.
            </p>
          </div>

          {/* Primary 4-Section WAI-ARIA Tablist */}
          <div
            role="tablist"
            aria-label="Linguistic sections"
            className="flex flex-nowrap lg:flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar shrink-0"
          >
            {primaryGroups.map((group, idx) => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  id={`lang-group-tab-${group.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`lang-group-panel-${group.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectPrimaryGroup(group.id)}
                  onKeyDown={(e) =>
                    handleLangTabKeyDown(
                      e,
                      primaryGroups.map((g) => g.id),
                      idx,
                      (id) => selectPrimaryGroup(id as LangPrimaryGroup)
                    )
                  }
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer select-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'text-white shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="languagesViewTabPill"
                      className="absolute inset-0 rounded-xl bg-emerald-600 shadow-md shadow-emerald-950/20"
                      transition={prefersReducedMotion ? { duration: 0 } : SPRING_TACTILE}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {group.icon}
                    <span>{group.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contextual Sub-Switcher for Phonetics & Typology Labs */}
        {activeGroup === 'phonetics-labs' && (
          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <div
              role="tablist"
              aria-label="Phonetics and typology laboratory tools"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {labSubTabs.map((sub, idx) => {
                const isSelected = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    id={`lang-subtab-${sub.id}`}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`lang-subpanel-${sub.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => selectSubTab(sub.id)}
                    onKeyDown={(e) =>
                      handleLangTabKeyDown(
                        e,
                        labSubTabs.map((s) => s.id),
                        idx,
                        (id) => selectSubTab(id as LangSubTab)
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <div
        id={`lang-group-panel-${activeGroup}`}
        role="tabpanel"
        aria-labelledby={`lang-group-tab-${activeGroup}`}
      >
        <div
          id={`lang-subpanel-${activeTab}`}
          role={activeGroup === 'phonetics-labs' ? 'tabpanel' : undefined}
          aria-labelledby={activeGroup === 'phonetics-labs' ? `lang-subtab-${activeTab}` : undefined}
        >
        <AnimatedTabPanel tabKey={activeTab} className="space-y-6">

      {/* TAB: TYPOLOGICAL DISTANCE COMPARATOR */}
      {activeTab === 'comparator' && (
        <LinguisticTypologyComparator />
      )}

      {/* TAB: WAVEFORM LABORATORY */}
      {activeTab === 'waveforms' && (
        <div className="space-y-6">
          <MotherTonguesWaveformScrubber
            initialLanguageId={activeWaveformLangId}
            onSelectLanguage={(id) => setActiveWaveformLangId(id)}
          />
        </div>
      )}

      {/* TAB 1: LANGUAGE FAMILIES */}
      {activeTab === 'families' && (
        <div className="space-y-8">
          {/* Featured Phonetic & Waveform Scrubber Highlight */}
          <MotherTonguesWaveformScrubber
            initialLanguageId={activeWaveformLangId}
            onSelectLanguage={(id) => setActiveWaveformLangId(id)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANGUAGE_FAMILIES.map(family => {
              const greeting = LANGUAGE_FAMILY_GREETINGS[family.id];
              const isFamilySelected = selectedFamilyId === family.id;
              return (
                <article
                  key={family.id}
                  className={`relative rounded-3xl border p-6 transition-all flex flex-col justify-between ${
                    isFamilySelected
                      ? 'border-emerald-500 bg-emerald-950/10 dark:bg-emerald-950/30 shadow-xl ring-1 ring-emerald-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2 text-xs">
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {family.languagesCount} · {family.speakers}
                      </span>
                      {greeting && (
                        <VoiceWelcomeFab
                          text={greeting.nativePhrase}
                          langTag={greeting.langTag}
                          languageName={greeting.languageName}
                          subtitle={greeting.meaningEn}
                          tooltip={`Listen to Welcome in ${greeting.languageName}`}
                          ariaLabel={`Listen to welcome greeting in ${family.name}`}
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedFamilyId(family.id)}
                      aria-pressed={isFamilySelected}
                      className="text-left w-full group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                    >
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {family.name}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                        {family.description}
                      </p>
                    </button>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      Key Languages: <span className="font-medium text-zinc-800 dark:text-zinc-200">{family.keyLanguages.slice(0, 4).join(' · ')}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targetMap: Record<string, string> = {
                            'niger-congo': 'yoruba',
                            'afroasiatic': 'hausa',
                            'nilo-saharan': 'swahili',
                            'austronesian': 'swahili',
                            'khoisan': 'zulu',
                            'indo-european': 'kabuverdianu'
                          };
                          setActiveWaveformLangId(targetMap[family.id] || 'yoruba');
                          selectSubTab('waveforms');
                        }}
                        className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                      >
                        <Radio className="w-3 h-3" />
                        <span>Inspect Phonetic Waveform →</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFamilyId(family.id)}
                        className="text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                      >
                        {isFamilySelected ? 'Inspecting ↓' : 'Deep Dive'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Detailed Selected Family Deep Dive */}
          {(() => {
            const family = LANGUAGE_FAMILIES.find(f => f.id === selectedFamilyId) || LANGUAGE_FAMILIES[0];
            const deepGreeting = LANGUAGE_FAMILY_GREETINGS[family.id];
            return (
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Linguistic Phylum Deep Dive
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                      {family.name} Phylum
                    </h2>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                    <span>Speakers: <strong className="text-zinc-900 dark:text-zinc-100">{family.speakers}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Total: <strong className="text-zinc-900 dark:text-zinc-100">{family.languagesCount}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      Phylum Overview &amp; Origins
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {family.description}
                    </p>

                    {/* Welcoming Voice Greeting Bar */}
                    {deepGreeting && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                            Welcome Greeting · {deepGreeting.languageName}
                          </div>
                          <p className="text-sm font-serif font-bold text-zinc-900 dark:text-zinc-100 italic">
                            "{deepGreeting.nativePhrase}"
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            Phonetics: <code className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{deepGreeting.phoneticGuide}</code> · <em>"{deepGreeting.meaningEn}"</em>
                          </p>
                        </div>
                        <VoiceWelcomeFab
                          text={deepGreeting.nativePhrase}
                          langTag={deepGreeting.langTag}
                          languageName={deepGreeting.languageName}
                          subtitle={deepGreeting.meaningEn}
                          tooltip={`Listen to Welcome in ${deepGreeting.languageName}`}
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 pt-3">
                      <h5 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                        Primary Geographic Regions
                      </h5>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
                        {family.primaryRegions.map((r, rIdx) => {
                          const tonal = getRegionTonalPalette(r);
                          return (
                            <React.Fragment key={r}>
                              {rIdx > 0 && <span aria-hidden="true" className="text-zinc-400">·</span>}
                              <span className={tonal.badge.text}>{r}</span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div 
                    className="space-y-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-xs transition-colors"
                    style={{ backgroundColor: 'var(--region-pan-african-calm)' }}
                  >
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" /> Sub-Branches & Taxa
                    </h4>
                    <div className="space-y-1.5">
                      {family.majorBranches.map(b => (
                        <div key={b} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1.5">
                        Key Exemplar Languages
                      </h4>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                        {family.keyLanguages.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: INDIGENOUS LINGUA FRANCAS */}
      {activeTab === 'lingua-francas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDIGENOUS_LINGUA_FRANCAS.map(lf => (
            <div
              key={lf.name}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    {lf.family}
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {lf.name} <span className="text-sm font-normal text-zinc-500 font-sans">({lf.nativeName})</span>
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 tabular-nums shrink-0">
                  {lf.speakers}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lf.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-zinc-500 shrink-0">Writing Systems:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right">{lf.writingSystems.join(', ')}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500">Primary Countries:</span>
                  <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {lf.countriesSpoken.join(' · ')}
                  </span>
                </div>
                <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {lf.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 54 COUNTRIES LANGUAGE MATRIX */}
      {activeTab === 'countries' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              aria-label="Filter countries by name or spoken language"
              placeholder="Search country, language (e.g. Swahili, French, Hausa, Arabic)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map(entity => {
              const meta = COUNTRY_HEADER_DATA[entity.id];
              const tonal = getCountryRegionTonalPalette(entity.id);
              const silhouette = getCountrySilhouette(entity.id);
              return (
                <div
                  key={entity.id}
                  className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4 transition-all ${tonal.card.borderHover} hover:shadow-2xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CountryFlag entityId={entity.id} size="md" />
                        <div>
                          <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                            {entity.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                            <span className={`font-mono font-bold ${tonal.badge.text}`}>
                              {entity.id}
                            </span>
                            <span aria-hidden="true" className="text-zinc-400">·</span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              {entity.region}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Country Vector Silhouette Badge */}
                      {silhouette && (
                        <div 
                          className={`w-12 h-12 flex items-center justify-center p-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800/80 ${tonal.card.borderHover} ${tonal.card.bgHover} transition-all shrink-0`}
                          title={`${entity.name} vector silhouette`}
                        >
                          <svg
                            viewBox={silhouette.viewBox}
                            className="w-full h-full max-w-[38px] max-h-[38px] transition-transform duration-300 select-none hover:scale-105"
                            style={{ color: tonal.warmAccent }}
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label={`${entity.name} map silhouette`}
                          >
                            <path
                              d={silhouette.path}
                              fill="currentColor"
                              fillOpacity="0.22"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                            {silhouette.islandPaths?.map((islandPath, idx) => (
                              <path
                                key={idx}
                                d={islandPath}
                                fill="currentColor"
                                fillOpacity="0.22"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />
                            ))}
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block mb-0.5 font-semibold">Official Languages</span>
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium text-[11px] leading-relaxed">
                          {meta?.languages.official.join(' · ') || 'Not specified'}
                        </p>
                      </div>

                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block mb-0.5 font-semibold">Widely Spoken / National</span>
                        <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                          {meta?.languages.mostSpoken.join(' · ') || 'Standard regional'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCountry(entity.id)}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span>View Country Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PHONEMIC & TYPOLOGY LAB */}
      {activeTab === 'typology' && (() => {
        const activeFeature = AFRICAN_TYPOLOGICAL_FEATURES.find(f => f.id === selectedTypologyId) || AFRICAN_TYPOLOGICAL_FEATURES[0];
        return (
          <div className="space-y-6">
            {/* Feature Selection Ribbon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {AFRICAN_TYPOLOGICAL_FEATURES.map(feat => {
                const isSelected = feat.id === activeFeature.id;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTypologyId(feat.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-colors cursor-pointer select-none flex flex-col justify-between min-h-[118px] overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isSelected
                        ? 'text-white border-zinc-900 dark:border-zinc-100 shadow-lg shadow-zinc-950/15'
                        : 'bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/60 dark:hover:bg-zinc-850'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="languagesTypologyPill"
                        className="absolute inset-0 rounded-2xl bg-zinc-900 dark:bg-zinc-100 ring-2 ring-emerald-500/60"
                        transition={prefersReducedMotion ? { duration: 0 } : SPRING_TACTILE}
                      />
                    )}
                    <div className="relative z-10 space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                        <span className={isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'}>
                          {feat.category}
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-400'}`}>
                          {feat.glyph}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm leading-snug font-display">
                        {feat.shortName}
                      </h4>
                    </div>

                    <div className="relative z-10 pt-2 mt-2 border-t border-zinc-200/30 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium">
                      <span className={isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}>
                        {feat.leadSummary}
                      </span>
                      <span className={`text-[10px] font-mono font-bold tabular-nums ${
                        isSelected 
                          ? 'text-white dark:text-zinc-900' 
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {feat.keyPhonemesOrClasses.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Feature Deep Dive Dossier */}
            <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xl space-y-7">
              {/* Top Overview & Prevalence Banner */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-200/90 dark:border-zinc-800/90 pb-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      {activeFeature.category} System
                    </span>
                    <span aria-hidden="true" className="text-zinc-400">·</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      World Atlas of Language Structures (WALS)
                    </span>
                    <span aria-hidden="true" className="text-zinc-400">·</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-semibold">
                      Phonological Typology
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight font-display leading-tight">
                    {activeFeature.name}
                  </h2>
                </div>

                {/* Continental Prevalence Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 lg:max-w-md w-full space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Continental Prevalence</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {activeFeature.prevalenceInAfrica}
                  </p>
                </div>
              </div>

              {/* Mechanism and Geographic Distribution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-zinc-50 dark:from-emerald-950/20 dark:to-zinc-900/50 border border-emerald-500/20 dark:border-emerald-500/20 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-mono">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Articulatory &amp; Acoustic Production
                  </span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {activeFeature.acousticMechanism}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/40 to-zinc-50 dark:from-cyan-950/20 dark:to-zinc-900/50 border border-cyan-500/20 dark:border-cyan-500/20 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-2 font-mono">
                    <Globe2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Phylogenetic &amp; Spatial Distribution
                  </span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {activeFeature.geographicDistribution}
                  </p>
                </div>
              </div>

              {/* Phoneme & Class Breakdown Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-2">
                    <span>Phonemic Influx Inventory &amp; Attested Lexical Corpus</span>
                    <span className="text-zinc-400">({activeFeature.keyPhonemesOrClasses.length} documented classes)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {activeFeature.keyPhonemesOrClasses.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 space-y-4 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
                    >
                      {/* Item Header */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-serif font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
                          {item.symbol}
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                            {item.ipaName}
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Sample Words / Attested Lexicon */}
                      <div className="space-y-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Attested Lexicon:
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {item.sampleWords.map((sample, sIdx) => (
                            <div 
                              key={sIdx}
                              className="p-3 rounded-xl bg-white dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800/70 shadow-2xs space-y-1.5"
                            >
                              {/* Row 1: Word and English Translation */}
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 font-serif">
                                  {sample.word}
                                </span>
                                <span className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                                  "{sample.translation}"
                                </span>
                              </div>

                              {/* Row 2: IPA transcription and Language attribution */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-900 text-xs font-mono">
                                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                  IPA: {sample.ipa}
                                </span>
                                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">
                                  {sample.language}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theoretical Linguistic Significance */}
              <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 dark:border-amber-600/30 text-amber-950 dark:text-amber-200 space-y-2 shadow-2xs">
                <div className="font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Theoretical Linguistic &amp; Anthropological Significance</span>
                </div>
                <p className="text-sm leading-relaxed font-sans text-amber-900/90 dark:text-amber-200/90">
                  {activeFeature.theoreticalSignificance}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
        </AnimatedTabPanel>
        </div>
      </div>
    </section>
  );
};

export default LanguagesView;
