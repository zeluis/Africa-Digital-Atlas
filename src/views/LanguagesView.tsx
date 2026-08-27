import React, { useState, useMemo } from 'react';
import { atlas } from '../data/atlas-store';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { CountryFlag } from '../components/CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';
import { getCountryRegionTonalPalette, getRegionTonalPalette } from '../data/unGeoschemeColors';
import { getCountrySilhouette } from '../data/countrySilhouettes';
import { 
  Languages, 
  Search, 
  Globe2, 
  BookOpen, 
  Users, 
  Sparkles, 
  Filter, 
  ChevronRight,
  Landmark,
  Layers,
  Award
} from 'lucide-react';

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

export const LanguagesView: React.FC<LanguagesViewProps> = ({
  onSelectCountry
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'families' | 'lingua-francas' | 'countries'>('families');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('niger-congo');

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

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Active Page Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
              <Languages className="w-3.5 h-3.5" />
              <span>AFRICA ATLAS • LANGUAGES & LINGUISTICS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Languages & Linguistics of Africa
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
              Home to over 2,000 distinct living languages across 6 major linguistic phyla, representing extraordinary phonetic diversity, unique writing systems, and dynamic cross-border lingua francas.
            </p>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('families')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'families'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Language Families (6)
            </button>
            <button
              onClick={() => setActiveTab('lingua-francas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lingua-francas'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Major Lingua Francas
            </button>
            <button
              onClick={() => setActiveTab('countries')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'countries'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Country Matrix (54)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LANGUAGE FAMILIES */}
      {activeTab === 'families' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANGUAGE_FAMILIES.map(family => (
              <div
                key={family.id}
                onClick={() => setSelectedFamilyId(family.id)}
                className={`rounded-3xl border p-6 transition-all cursor-pointer ${
                  selectedFamilyId === family.id
                    ? 'border-emerald-500 bg-emerald-950/10 dark:bg-emerald-950/30 shadow-xl ring-1 ring-emerald-500'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {family.languagesCount}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {family.speakers}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                  {family.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                  {family.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    Key Languages:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {family.keyLanguages.slice(0, 4).map(l => (
                      <span key={l} className="text-[10px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Selected Family Deep Dive */}
          {(() => {
            const family = LANGUAGE_FAMILIES.find(f => f.id === selectedFamilyId) || LANGUAGE_FAMILIES[0];
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
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      Speakers: <strong className="text-zinc-900 dark:text-zinc-100">{family.speakers}</strong>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      Total: <strong className="text-zinc-900 dark:text-zinc-100">{family.languagesCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      Phylum Overview & Origins
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {family.description}
                    </p>

                    <div className="space-y-2 pt-3">
                      <h5 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                        Primary Geographic Regions
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {family.primaryRegions.map(r => {
                          const tonal = getRegionTonalPalette(r);
                          return (
                            <span key={r} className={`px-3 py-1 rounded-xl text-xs font-semibold border ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                              {r}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5">
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
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                        Key Exemplar Languages
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {family.keyLanguages.map(l => (
                          <span key={l} className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
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
          {INDIGENOUS_LINGUA_FRANCAS.map((lf, idx) => (
            <div
              key={lf.name}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    {lf.family}
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {lf.name} <span className="text-sm font-normal text-zinc-500 font-sans">({lf.nativeName})</span>
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-xl text-zinc-800 dark:text-zinc-200">
                  {lf.speakers}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lf.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Writing Systems:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lf.writingSystems.join(', ')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500">Primary Countries:</span>
                  <div className="flex flex-wrap gap-1">
                    {lf.countriesSpoken.map(c => (
                      <span key={c} className="text-[11px] bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                        {c}
                      </span>
                    ))}
                  </div>
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
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${tonal.badge.bg} ${tonal.badge.border} ${tonal.badge.text}`}>
                              {entity.id}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
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
                        <span className="text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold">Official Languages:</span>
                        <div className="flex flex-wrap gap-1">
                          {meta?.languages.official.map(l => (
                            <span key={l} className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {l}
                            </span>
                          )) || <span className="text-zinc-500">Not specified</span>}
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block mb-1 font-semibold">Widely Spoken / National:</span>
                        <div className="flex flex-wrap gap-1">
                          {meta?.languages.mostSpoken.map(l => (
                            <span key={l} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md text-[11px]">
                              {l}
                            </span>
                          )) || <span className="text-zinc-500">Standard regional</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCountry(entity.id)}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
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
    </div>
  );
};
