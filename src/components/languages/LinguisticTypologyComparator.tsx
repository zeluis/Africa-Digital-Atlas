import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Languages, 
  ArrowRightLeft, 
  Volume2, 
  Check, 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  SlidersHorizontal, 
  Mic 
} from 'lucide-react';
import { speakAcademicNarration } from '../../utils/afriataVoiceEngine';

export interface LanguageTypologyProfile {
  id: string;
  name: string;
  nativeName: string;
  family: string;
  branch: string;
  speakers: string;
  nounClasses: string;
  nounClassCount: number;
  wordOrder: 'SVO' | 'SOV' | 'VSO';
  toneSystem: 'Poly-tone (3+ registers)' | 'Two-tone (High/Low)' | 'Pitch Accent' | 'Non-tonal';
  hasClicks: boolean;
  hasImplosives: boolean;
  hasLabialVelars: boolean;
  morphologyType: 'Agglutinative / Polysynthetic' | 'Fusional / Introflexive' | 'Isolating / Analytic';
  writingTraditions: string[];
  greetingWord: string;
  greetingIpa: string;
  greetingMeaning: string;
}

export const COMPARATIVE_LANGUAGES: LanguageTypologyProfile[] = [
  {
    id: 'swahili',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    family: 'Niger-Congo',
    branch: 'Bantu (Sabaki)',
    speakers: '150–200M',
    nounClasses: '18 active Bantu noun classes with strict concord',
    nounClassCount: 18,
    wordOrder: 'SVO',
    toneSystem: 'Non-tonal', // Penultimate stress accent
    hasClicks: false,
    hasImplosives: true, // /ɓ, ɗ/
    hasLabialVelars: false,
    morphologyType: 'Agglutinative / Polysynthetic',
    writingTraditions: ['Latin script', 'Historical Arabic Ajami'],
    greetingWord: 'Habari za asubuhi',
    greetingIpa: '[haˈɓa.ri za a.suˈɓu.hi]',
    greetingMeaning: 'Good morning / How is the morning?'
  },
  {
    id: 'zulu',
    name: 'Zulu',
    nativeName: 'isiZulu',
    family: 'Niger-Congo',
    branch: 'Bantu (Nguni)',
    speakers: '28–30M',
    nounClasses: '15 active noun classes with alliterative concord',
    nounClassCount: 15,
    wordOrder: 'SVO',
    toneSystem: 'Two-tone (High/Low)',
    hasClicks: true, // 15 phonemic clicks: c / q / x
    hasImplosives: true,
    hasLabialVelars: false,
    morphologyType: 'Agglutinative / Polysynthetic',
    writingTraditions: ['Latin script'],
    greetingWord: 'Sawubona',
    greetingIpa: '[sa.wou̯ˈɓɔ́ːna]',
    greetingMeaning: 'I see you / We see you'
  },
  {
    id: 'yoruba',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    family: 'Niger-Congo',
    branch: 'Volta-Niger (Defoid)',
    speakers: '50–55M',
    nounClasses: 'No noun classes; vowel-initial nominalization',
    nounClassCount: 0,
    wordOrder: 'SVO',
    toneSystem: 'Poly-tone (3+ registers)', // High, Mid, Low
    hasClicks: false,
    hasImplosives: false,
    hasLabialVelars: true, // /kp, gb/
    morphologyType: 'Isolating / Analytic',
    writingTraditions: ['Latin script with subdots (ẹ, ọ, ṣ)'],
    greetingWord: 'Ẹ n lẹ́ o',
    greetingIpa: '[ɛ̄ ń lɛ́ ō]',
    greetingMeaning: 'Greetings to you (honorific)'
  },
  {
    id: 'hausa',
    name: 'Hausa',
    nativeName: 'Harshen Hausa (هَرْشَن هَوْسَ)',
    family: 'Afroasiatic',
    branch: 'Chadic (West Chadic)',
    speakers: '85–90M',
    nounClasses: 'Grammatical gender (Masculine / Feminine)',
    nounClassCount: 2,
    wordOrder: 'SVO',
    toneSystem: 'Poly-tone (3+ registers)', // High, Low, Falling
    hasClicks: false,
    hasImplosives: true, // /ɓ, ɗ/ and ejective /ƙ/
    hasLabialVelars: false,
    morphologyType: 'Fusional / Introflexive',
    writingTraditions: ['Latin Boko', 'Arabic Ajami'],
    greetingWord: 'Sannu da safe',
    greetingIpa: '[sàn.núː dà sàː.féː]',
    greetingMeaning: 'Greetings in the morning'
  },
  {
    id: 'amharic',
    name: 'Amharic',
    nativeName: 'አማርኛ (Amarəñña)',
    family: 'Afroasiatic',
    branch: 'Semitic (South Semitic / Ethiopic)',
    speakers: '35–40M',
    nounClasses: 'Grammatical gender (Masculine / Feminine)',
    nounClassCount: 2,
    wordOrder: 'SOV', // Typological SOV shift due to Cushitic substrate
    toneSystem: 'Non-tonal', // Dynamic stress
    hasClicks: false,
    hasImplosives: false, // Rich ejective series /pʼ, tʼ, kʼ, sʼ, t͡sʼ/
    hasLabialVelars: false,
    morphologyType: 'Fusional / Introflexive',
    writingTraditions: ['Ge\'ez script (Fidel / አቡጊዳ)'],
    greetingWord: 'እንደምን አደሩ (Indemin aderru)',
    greetingIpa: '[ɨndəmin adərru]',
    greetingMeaning: 'Good morning (How did you spend the night?)'
  },
  {
    id: 'oromo',
    name: 'Oromo',
    nativeName: 'Afaan Oromoo',
    family: 'Afroasiatic',
    branch: 'Cushitic (Lowland East Cushitic)',
    speakers: '40–45M',
    nounClasses: 'Grammatical gender & singulative/plurative system',
    nounClassCount: 2,
    wordOrder: 'SOV',
    toneSystem: 'Pitch Accent',
    hasClicks: false,
    hasImplosives: true, // Retroflex implosive /ᶑ/
    hasLabialVelars: false,
    morphologyType: 'Fusional / Introflexive',
    writingTraditions: ['Qubee (Latin-based)', 'Historic Sapalo script'],
    greetingWord: 'Akkam bultan',
    greetingIpa: '[ak.kam bul.tan]',
    greetingMeaning: 'Good morning (honorific)'
  },
  {
    id: 'lingala',
    name: 'Lingala',
    nativeName: 'Lingála',
    family: 'Niger-Congo',
    branch: 'Bantu (Bangala)',
    speakers: '45–50M',
    nounClasses: '15 noun classes with reduced concord prefixes',
    nounClassCount: 15,
    wordOrder: 'SVO',
    toneSystem: 'Two-tone (High/Low)',
    hasClicks: false,
    hasImplosives: false,
    hasLabialVelars: false,
    morphologyType: 'Agglutinative / Polysynthetic',
    writingTraditions: ['Latin script', 'Mandombe script'],
    greetingWord: 'Mbote na yo',
    greetingIpa: '[ᵐbó.te na jɔ]',
    greetingMeaning: 'Greetings to you'
  },
  {
    id: 'khoekhoegowab',
    name: 'Nama / Damara',
    nativeName: 'Khoekhoegowab',
    family: 'Khoe-Kwadi',
    branch: 'Khoe (Khoekhoe)',
    speakers: '250,000',
    nounClasses: '3 genders (M/F/Common) x 3 numbers (Sing/Dual/Plural)',
    nounClassCount: 9,
    wordOrder: 'SOV',
    toneSystem: 'Poly-tone (3+ registers)', // 4 tone melodies
    hasClicks: true, // 20 click consonants (ǀ, ǁ, ǃ, ǂ)
    hasImplosives: false,
    hasLabialVelars: false,
    morphologyType: 'Agglutinative / Polysynthetic',
    writingTraditions: ['Latin script with standard click orthography'],
    greetingWord: '!Gâi tsēs',
    greetingIpa: '[!kã́ĩ̀ t͡sèːs]',
    greetingMeaning: 'Good day'
  }
];

export const LinguisticTypologyComparator: React.FC = () => {
  const [langAId, setLangAId] = useState<string>('swahili');
  const [langBId, setLangBId] = useState<string>('zulu');

  const langA = COMPARATIVE_LANGUAGES.find(l => l.id === langAId) || COMPARATIVE_LANGUAGES[0];
  const langB = COMPARATIVE_LANGUAGES.find(l => l.id === langBId) || COMPARATIVE_LANGUAGES[1];

  // Calculate typological concordance score (0 - 100%)
  const similarityScore = useMemo(() => {
    let score = 0;
    let totalWeights = 0;

    // 1. Phylum / Family (Weight: 25)
    totalWeights += 25;
    if (langA.family === langB.family) score += 25;

    // 2. Word Order (Weight: 15)
    totalWeights += 15;
    if (langA.wordOrder === langB.wordOrder) score += 15;

    // 3. Morphology Type (Weight: 15)
    totalWeights += 15;
    if (langA.morphologyType === langB.morphologyType) score += 15;

    // 4. Tone System (Weight: 15)
    totalWeights += 15;
    if (langA.toneSystem === langB.toneSystem) score += 15;

    // 5. Clicks presence (Weight: 10)
    totalWeights += 10;
    if (langA.hasClicks === langB.hasClicks) score += 10;

    // 6. Implosives presence (Weight: 10)
    totalWeights += 10;
    if (langA.hasImplosives === langB.hasImplosives) score += 10;

    // 7. Labial-Velars presence (Weight: 10)
    totalWeights += 10;
    if (langA.hasLabialVelars === langB.hasLabialVelars) score += 10;

    return Math.round((score / totalWeights) * 100);
  }, [langA, langB]);

  const handleSpeak = (text: string) => {
    speakAcademicNarration({ text, playChime: true });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header & Selector Plaque */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Comparative African Linguistics &amp; WALS Typology</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Typological Distance &amp; Morphological Comparator
            </h3>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Select any two African languages to evaluate syntactic word order, noun class systems, tonal registers, and phonetic sound inventories.
            </p>
          </div>

          {/* Language Pair Selectors */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <select
              value={langAId}
              onChange={(e) => setLangAId(e.target.value)}
              className="bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 py-1.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              aria-label="Select first language for comparison"
            >
              {COMPARATIVE_LANGUAGES.map(l => (
                <option key={`a-${l.id}`} value={l.id} disabled={l.id === langBId}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
            <ArrowRightLeft className="w-4 h-4 text-zinc-400" />
            <select
              value={langBId}
              onChange={(e) => setLangBId(e.target.value)}
              className="bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 py-1.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              aria-label="Select second language for comparison"
            >
              {COMPARATIVE_LANGUAGES.map(l => (
                <option key={`b-${l.id}`} value={l.id} disabled={l.id === langAId}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Concordance Meter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 md:col-span-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-zinc-500 font-bold">Typological Congruence Index</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {similarityScore}% Match
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${similarityScore}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              {similarityScore >= 80 
                ? 'High structural affinity: Closely related within the identical linguistic branch sharing deep morphological and syntactic concord.' 
                : similarityScore >= 50 
                ? 'Moderate cross-branch affinity: Shared continental areal features (such as tonal inflection or implosives) with distinct syntactic rules.' 
                : 'Divergent typology: Distinct phylum origins with contrasting word order, phonemic inventories, and grammatical systems.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono uppercase text-zinc-500">Acoustic Audio Playback</div>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSpeak(langA.greetingWord)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                title={`Listen to ${langA.name} greeting`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{langA.name}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeak(langB.greetingWord)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors cursor-pointer"
                title={`Listen to ${langB.name} greeting`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{langB.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Typological Matrix Table */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono p-4">
          <div>Linguistic Feature</div>
          <div className="text-zinc-900 dark:text-zinc-100">{langA.name}</div>
          <div className="text-zinc-900 dark:text-zinc-100">{langB.name}</div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
          {/* Family & Branch */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Genetic Phylum &amp; Branch</div>
            <div className="font-mono text-zinc-900 dark:text-zinc-100">{langA.family} ({langA.branch})</div>
            <div className="font-mono text-zinc-900 dark:text-zinc-100">{langB.family} ({langB.branch})</div>
          </div>

          {/* Canonical Word Order */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Basic Word Order</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{langA.wordOrder}</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{langB.wordOrder}</div>
          </div>

          {/* Noun Classes & Gender */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Nominal Classification</div>
            <div className="text-zinc-800 dark:text-zinc-200">{langA.nounClasses}</div>
            <div className="text-zinc-800 dark:text-zinc-200">{langB.nounClasses}</div>
          </div>

          {/* Tone & Pitch Registers */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Tone &amp; Pitch Accent</div>
            <div className="text-zinc-800 dark:text-zinc-200">{langA.toneSystem}</div>
            <div className="text-zinc-800 dark:text-zinc-200">{langB.toneSystem}</div>
          </div>

          {/* Click Consonants */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Click Consonants (Lingual Ingressive)</div>
            <div className="flex items-center gap-1.5">
              {langA.hasClicks ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Present (ǂ, ǃ, ǁ, ǀ)
                </span>
              ) : (
                <span className="text-zinc-400">Absent</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {langB.hasClicks ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Present (ǂ, ǃ, ǁ, ǀ)
                </span>
              ) : (
                <span className="text-zinc-400">Absent</span>
              )}
            </div>
          </div>

          {/* Glottalic Implosives */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Voiced Glottalic Implosives (/ɓ, ɗ/)</div>
            <div>{langA.hasImplosives ? 'Present (/ɓ, ɗ/)' : 'Absent'}</div>
            <div>{langB.hasImplosives ? 'Present (/ɓ, ɗ/)' : 'Absent'}</div>
          </div>

          {/* Labial-Velars */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Co-articulated Labial-Velars (/kp, gb/)</div>
            <div>{langA.hasLabialVelars ? 'Present (/kp, gb/)' : 'Absent'}</div>
            <div>{langB.hasLabialVelars ? 'Present (/kp, gb/)' : 'Absent'}</div>
          </div>

          {/* Morphology Type */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Morphological Synthesis</div>
            <div>{langA.morphologyType}</div>
            <div>{langB.morphologyType}</div>
          </div>

          {/* Writing Tradition */}
          <div className="grid grid-cols-3 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Historic &amp; Modern Scripts</div>
            <div>{langA.writingTraditions.join(', ')}</div>
            <div>{langB.writingTraditions.join(', ')}</div>
          </div>

          {/* Greeting Word & IPA */}
          <div className="grid grid-cols-3 p-4 bg-zinc-50/60 dark:bg-zinc-800/40">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">Phonetic Sample (Greeting)</div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">{langA.greetingWord}</div>
              <div className="font-mono text-[11px] text-zinc-500">{langA.greetingIpa}</div>
              <div className="text-[10px] text-zinc-400 italic mt-0.5">"{langA.greetingMeaning}"</div>
            </div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">{langB.greetingWord}</div>
              <div className="font-mono text-[11px] text-zinc-500">{langB.greetingIpa}</div>
              <div className="text-[10px] text-zinc-400 italic mt-0.5">"{langB.greetingMeaning}"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
