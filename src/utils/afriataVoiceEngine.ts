/**
 * Afriata Voice & Audio Synthesis Engine (Zero-Key Hybrid)
 *
 * Dual-layer voice architecture requiring zero runtime API keys:
 * 1. Two-Tier Static African Neural Audio Pack (`public/audio/tongues/`):
 *    - Core Precached Tier (`audio/tongues/*.mp3`): 18 African mother-tongue
 *      greetings + 6 linguistic phylum welcomes using Meta MMS-TTS ONNX (VITS
 *      for Yorùbá, Akan/Twi, Fon, Wolof, Afaan Oromoo, Tamazight, Malagasy)
 *      and keyless neural voices (Kiswahili, isiZulu, Amharic, Somali, Hausa,
 *      Maghrebi Arabic, plus transparently labeled phonetic proxies).
 *    - Extended Runtime Cache (`audio/tongues/extended/*.mp3`): Ancestral
 *      proverbs and typological minimal-pair / click samples cached on demand.
 * 2. OS Native Voice Engine (`window.speechSynthesis`):
 *    Ranked selector prioritizing installed regional African voices (`am-ET`,
 *    `sw-KE`/`sw-TZ`, `so-SO`, `om-ET`, `zu-ZA`, `xh-ZA`, `af-ZA`,
 *    `en-NG`/`en-KE`/`en-GH`/`en-ZA`, Lusophone `pt-PT`, Francophone `fr-*`,
 *    Maghrebi Arabic `ar-MA`/`ar-DZ`/`ar-TN`) and natural/Siri OS voices.
 * 3. Acoustic Resonator: Web Audio API pentatonic kalimba/marimba chord progression.
 */

import { isBackendTtsAvailable, resolveApiUrl } from './apiClient';
import { resolveAssetPath } from './assetPath';

export interface StaticAudioClipSpec {
  id: string;
  tier?: 'core' | 'extended';
  file: string;
  langTag: string;
  phrase: string;
  durationSeconds: number;
  engineLabel: string;
  provenanceBadge?: string;
  isProxy?: boolean;
  proxyNote?: string;
}

export const STATIC_AFRICAN_AUDIO_CLIPS: Record<string, StaticAudioClipSpec> = {
  'mother-yoruba': {
    id: 'mother-yoruba',
    tier: 'core',
    file: 'audio/tongues/mother-yoruba.mp3',
    langTag: 'yo-NG',
    phrase: 'Báwo ni?',
    durationSeconds: 0.89,
    engineLabel: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
  'mother-igbo': {
    id: 'mother-igbo',
    tier: 'core',
    file: 'audio/tongues/mother-igbo.mp3',
    langTag: 'ig-NG',
    phrase: 'Ndewo / Kèdú?',
    durationSeconds: 3.19,
    engineLabel: 'Nigerian English Phonetic Proxy',
    isProxy: true,
  },
  'mother-hausa': {
    id: 'mother-hausa',
    tier: 'core',
    file: 'audio/tongues/mother-hausa.mp3',
    langTag: 'ha-NG',
    phrase: 'Sannu / Ina kwana?',
    durationSeconds: 2.35,
    engineLabel: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  'mother-swahili': {
    id: 'mother-swahili',
    tier: 'core',
    file: 'audio/tongues/mother-swahili.mp3',
    langTag: 'sw-KE',
    phrase: 'Hujambo / Habari yako?',
    durationSeconds: 3.43,
    engineLabel: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  'mother-kabuverdianu': {
    id: 'mother-kabuverdianu',
    tier: 'core',
    file: 'audio/tongues/mother-kabuverdianu.mp3',
    langTag: 'pt-CV',
    phrase: 'Munti sabi! / Modi ki bu sta?',
    durationSeconds: 4.27,
    engineLabel: 'Kabuverdianu Lusophone Proxy',
    isProxy: true,
  },
  'mother-akan': {
    id: 'mother-akan',
    tier: 'core',
    file: 'audio/tongues/mother-akan.mp3',
    langTag: 'ak-GH',
    phrase: 'Akwaaba! / Wo ho te sɛn?',
    durationSeconds: 1.87,
    engineLabel: 'Meta MMS-TTS (Akan/Twi VITS)',
    isProxy: false,
  },
  'mother-fon': {
    id: 'mother-fon',
    tier: 'core',
    file: 'audio/tongues/mother-fon.mp3',
    langTag: 'fr-BJ',
    phrase: 'Kú dɔ / Mi kwabo!',
    durationSeconds: 1.61,
    engineLabel: 'Meta MMS-TTS (Fongbe VITS)',
    isProxy: false,
  },
  'mother-zulu': {
    id: 'mother-zulu',
    tier: 'core',
    file: 'audio/tongues/mother-zulu.mp3',
    langTag: 'zu-ZA',
    phrase: 'Sawubona!',
    durationSeconds: 1.92,
    engineLabel: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  'mother-amharic': {
    id: 'mother-amharic',
    tier: 'core',
    file: 'audio/tongues/mother-amharic.mp3',
    langTag: 'am-ET',
    phrase: 'Selam! (ሰላም) / Tena Yistillign',
    durationSeconds: 3.24,
    engineLabel: 'Amharic Ethiopia Neural',
    isProxy: false,
  },
  'mother-arabic_maghrebi': {
    id: 'mother-arabic_maghrebi',
    tier: 'core',
    file: 'audio/tongues/mother-arabic_maghrebi.mp3',
    langTag: 'ar-MA',
    phrase: 'Salam Aleikoum / Labas?',
    durationSeconds: 3.82,
    engineLabel: 'Maghrebi Arabic Neural',
    isProxy: false,
  },
  'mother-tamazight': {
    id: 'mother-tamazight',
    tier: 'core',
    file: 'audio/tongues/mother-tamazight.mp3',
    langTag: 'kab-DZ',
    phrase: 'Azul! Amek tettiliḍ?',
    durationSeconds: 1.92,
    engineLabel: 'Meta MMS-TTS (Tamazight / Kabyle VITS)',
    isProxy: false,
  },
  'mother-wolof': {
    id: 'mother-wolof',
    tier: 'core',
    file: 'audio/tongues/mother-wolof.mp3',
    langTag: 'wo-SN',
    phrase: 'Nanga def? / Mangi fi rekk',
    durationSeconds: 2.26,
    engineLabel: 'Meta MMS-TTS (Wolof VITS)',
    isProxy: false,
  },
  'mother-oromo': {
    id: 'mother-oromo',
    tier: 'core',
    file: 'audio/tongues/mother-oromo.mp3',
    langTag: 'om-ET',
    phrase: 'Akkam jirta? / Nagaa!',
    durationSeconds: 1.68,
    engineLabel: 'Meta MMS-TTS (Afaan Oromoo VITS)',
    isProxy: false,
  },
  'mother-somali': {
    id: 'mother-somali',
    tier: 'core',
    file: 'audio/tongues/mother-somali.mp3',
    langTag: 'so-SO',
    phrase: 'Iska warran? / Nabad!',
    durationSeconds: 3.26,
    engineLabel: 'Somali Horn of Africa Neural',
    isProxy: false,
  },
  'mother-xhosa': {
    id: 'mother-xhosa',
    tier: 'core',
    file: 'audio/tongues/mother-xhosa.mp3',
    langTag: 'xh-ZA',
    phrase: 'Molo! Kunjani?',
    durationSeconds: 3.05,
    engineLabel: 'Nguni Sister-Voice Proxy (isiZulu)',
    isProxy: true,
  },
  'mother-lingala': {
    id: 'mother-lingala',
    tier: 'core',
    file: 'audio/tongues/mother-lingala.mp3',
    langTag: 'ln-CD',
    phrase: 'Mbote na yo! Sango nini?',
    durationSeconds: 3.98,
    engineLabel: 'Francophone Phonetic Proxy',
    isProxy: true,
  },
  'mother-fula': {
    id: 'mother-fula',
    tier: 'core',
    file: 'audio/tongues/mother-fula.mp3',
    langTag: 'ff-SN',
    phrase: 'A jaaraama! No mbadda?',
    durationSeconds: 3.55,
    engineLabel: 'Sahelian Phonetic Proxy',
    isProxy: true,
  },
  'mother-khoekhoegowab': {
    id: 'mother-khoekhoegowab',
    tier: 'core',
    file: 'audio/tongues/mother-khoekhoegowab.mp3',
    langTag: 'naq-NA',
    phrase: 'ǃGâi tsēs! Matisa?',
    durationSeconds: 3.48,
    engineLabel: 'Southern African Phonetic Proxy',
    isProxy: true,
  },
  'family-niger-congo': {
    id: 'family-niger-congo',
    tier: 'core',
    file: 'audio/tongues/family-niger-congo.mp3',
    langTag: 'sw-KE',
    phrase: 'Karibu Afriata—Mvumbuzi wa Kikabila wa Atlantiki.',
    durationSeconds: 4.25,
    engineLabel: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  'family-afroasiatic': {
    id: 'family-afroasiatic',
    tier: 'core',
    file: 'audio/tongues/family-afroasiatic.mp3',
    langTag: 'ha-NG',
    phrase: 'Barka da zuwa Afriata—Mai Binciken Kabilun Atlantika.',
    durationSeconds: 5.47,
    engineLabel: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  'family-nilo-saharan': {
    id: 'family-nilo-saharan',
    tier: 'core',
    file: 'audio/tongues/family-nilo-saharan.mp3',
    langTag: 'luo-KE',
    phrase: 'Yawa, karibu Afriata—Jagol kido mar Atlantic.',
    durationSeconds: 4.42,
    engineLabel: 'East African Neural Proxy (Kiswahili)',
    isProxy: true,
  },
  'family-austronesian': {
    id: 'family-austronesian',
    tier: 'core',
    file: 'audio/tongues/family-austronesian.mp3',
    langTag: 'mg-MG',
    phrase: "Tonga soa eto amin'ny Afriata—Mpikaroka ny foko Atlantika.",
    durationSeconds: 3.98,
    engineLabel: 'Meta MMS-TTS (Malagasy VITS)',
    isProxy: false,
  },
  'family-khoisan': {
    id: 'family-khoisan',
    tier: 'core',
    file: 'audio/tongues/family-khoisan.mp3',
    langTag: 'naq-NA',
    phrase: 'ǁKhawa ǃgû re Afriata—Atlantic ǃAosab ǃKhôa-aos.',
    durationSeconds: 4.42,
    engineLabel: 'Southern African Phonetic Proxy',
    isProxy: true,
  },
  'family-indo-european': {
    id: 'family-indo-european',
    tier: 'core',
    file: 'audio/tongues/family-indo-european.mp3',
    langTag: 'pt-CV',
    phrase: 'Bem-bindu na Afriata—Splorador Étniku di Atlântiku.',
    durationSeconds: 4.82,
    engineLabel: 'Kabuverdianu Lusophone Proxy',
    isProxy: true,
  },
  'proverb-yoruba': {
    id: 'proverb-yoruba',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-yoruba.mp3',
    langTag: 'yo-NG',
    phrase: 'Ilé la ti ń kọ́ èṣọ́ ròde.',
    durationSeconds: 2.28,
    engineLabel: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
  'proverb-swahili': {
    id: 'proverb-swahili',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-swahili.mp3',
    langTag: 'sw-KE',
    phrase: 'Kidogo kidogo hujaza kibaba.',
    durationSeconds: 3.02,
    engineLabel: 'Kiswahili East Africa Neural',
    isProxy: false,
  },
  'proverb-zulu': {
    id: 'proverb-zulu',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-zulu.mp3',
    langTag: 'zu-ZA',
    phrase: 'Umuntu ngumuntu ngabantu.',
    durationSeconds: 2.54,
    engineLabel: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  'proverb-amharic': {
    id: 'proverb-amharic',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-amharic.mp3',
    langTag: 'am-ET',
    phrase: 'ድር ቢያብር አንበሳ ያስር።',
    durationSeconds: 2.4,
    engineLabel: 'Amharic Ethiopia Neural',
    isProxy: false,
  },
  'proverb-hausa': {
    id: 'proverb-hausa',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-hausa.mp3',
    langTag: 'ha-NG',
    phrase: 'Gani ya kori ji.',
    durationSeconds: 1.78,
    engineLabel: 'Hausa Native Neural Audio',
    isProxy: false,
  },
  'proverb-akan': {
    id: 'proverb-akan',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-akan.mp3',
    langTag: 'ak-GH',
    phrase: 'Sankofa: Wɔnkyi sɛ w’akɔfa nea w’akyi akyi.',
    durationSeconds: 3.41,
    engineLabel: 'Meta MMS-TTS (Akan/Twi VITS)',
    isProxy: false,
  },
  'proverb-fon': {
    id: 'proverb-fon',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-fon.mp3',
    langTag: 'fr-BJ',
    phrase: 'Nǔ ɖé sín nu wɛ nyí gbɛ̀.',
    durationSeconds: 1.75,
    engineLabel: 'Meta MMS-TTS (Fongbe VITS)',
    isProxy: false,
  },
  'proverb-wolof': {
    id: 'proverb-wolof',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-wolof.mp3',
    langTag: 'wo-SN',
    phrase: 'Nit, nit ay garabam.',
    durationSeconds: 1.73,
    engineLabel: 'Meta MMS-TTS (Wolof VITS)',
    isProxy: false,
  },
  'proverb-oromo': {
    id: 'proverb-oromo',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-oromo.mp3',
    langTag: 'om-ET',
    phrase: 'Walii galan alaa galan.',
    durationSeconds: 1.51,
    engineLabel: 'Meta MMS-TTS (Afaan Oromoo VITS)',
    isProxy: false,
  },
  'proverb-somali': {
    id: 'proverb-somali',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-somali.mp3',
    langTag: 'so-SO',
    phrase: 'Gacmo wadajir bay wax ku gooyaan.',
    durationSeconds: 2.98,
    engineLabel: 'Somali Horn of Africa Neural',
    isProxy: false,
  },
  'proverb-arabic_maghrebi': {
    id: 'proverb-arabic_maghrebi',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-arabic_maghrebi.mp3',
    langTag: 'ar-MA',
    phrase: 'اليد الواحدة ما كتصفقش.',
    durationSeconds: 3.0,
    engineLabel: 'Maghrebi Arabic Neural',
    isProxy: false,
  },
  'proverb-tamazight': {
    id: 'proverb-tamazight',
    tier: 'extended',
    file: 'audio/tongues/extended/proverb-tamazight.mp3',
    langTag: 'kab-DZ',
    phrase: 'Afus deg ufus, ad yifsus wugur.',
    durationSeconds: 2.45,
    engineLabel: 'Meta MMS-TTS (Tamazight / Kabyle VITS)',
    isProxy: false,
  },
  'typology-nguni-clicks': {
    id: 'typology-nguni-clicks',
    tier: 'extended',
    file: 'audio/tongues/extended/typology-nguni-clicks.mp3',
    langTag: 'zu-ZA',
    phrase: 'i-cici · i-xoxo · Sawubona',
    durationSeconds: 4.68,
    engineLabel: 'isiZulu South Africa Neural',
    isProxy: false,
  },
  'typology-yoruba-tones': {
    id: 'typology-yoruba-tones',
    tier: 'extended',
    file: 'audio/tongues/extended/typology-yoruba-tones.mp3',
    langTag: 'yo-NG',
    phrase: 'ọwọ́ · ọwọ̀ · ọwọ',
    durationSeconds: 0.79,
    engineLabel: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
  },
};

function normalizePhraseKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

const PHRASE_TO_STATIC_CLIP = new Map<string, StaticAudioClipSpec>(
  Object.values(STATIC_AFRICAN_AUDIO_CLIPS).map((clip) => [normalizePhraseKey(clip.phrase), clip])
);

export function resolveStaticAudioClip(opts: {
  audioClipId?: string;
  text?: string;
  langTag?: string;
}): StaticAudioClipSpec | null {
  if (opts.audioClipId && STATIC_AFRICAN_AUDIO_CLIPS[opts.audioClipId]) {
    return STATIC_AFRICAN_AUDIO_CLIPS[opts.audioClipId];
  }
  if (opts.text) {
    const byExactPhrase = PHRASE_TO_STATIC_CLIP.get(normalizePhraseKey(opts.text));
    if (byExactPhrase) return byExactPhrase;
  }
  return null;
}

export interface SpeechGreetingConfig {
  text: string;
  audioClipId?: string;
  langTag?: string;
  languageName?: string;
  title?: string;
  phonetic?: string;
  meaning?: string;
  rate?: number;
  startFraction?: number;
  onStart?: () => void;
  onProgress?: (fraction: number, currentTime: number, duration: number) => void;
  onEnd?: () => void;
  onError?: () => void;
}

export const AFRIATA_SPEECH_STOP_EVENT = 'afriata-speech-stop';

// Global state to track currently speaking audio
let currentAudioElement: HTMLAudioElement | null = null;
let activeAudioProgressRaf: number | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeAudioCtx: AudioContext | null = null;
const activeChimeOscillators = new Set<OscillatorNode>();
let voicesFallbackTimer: ReturnType<typeof setTimeout> | null = null;
let speechSessionCounter = 0;
let activeSpeechSessionId = 0;
const MAX_CLIENT_AUDIO_CACHE = 40;
const clientAudioCache = new Map<string, string>(); // key -> base64 data URL

function setClientAudioCache(key: string, value: string) {
  if (clientAudioCache.has(key)) {
    clientAudioCache.delete(key);
  }
  while (clientAudioCache.size >= MAX_CLIENT_AUDIO_CACHE) {
    const oldestKey = clientAudioCache.keys().next().value;
    if (!oldestKey) break;
    clientAudioCache.delete(oldestKey);
  }
  clientAudioCache.set(key, value);
}

// Male voice keywords to avoid for the default persona
const MALE_VOICE_NAMES = [
  'male', 'david', 'george', 'james', 'daniel', 'thomas', 'mark', 'paul',
  'guy', 'stefan', 'oliver', 'rishi', 'alex', 'fred', 'jorge', 'diego',
  'juan', 'pablo', 'manuel', 'carlos', 'enrique', 'alberto', 'pedro',
  'goncalo', 'duarte', 'tiago', 'joao', 'afonso', 'antonio', 'jean',
  'pierre', 'louis', 'michel', 'mathieu', 'alain', 'lucas', 'leo',
  'max', 'hans', 'klaus', 'stephan', 'michael', 'brian', 'arthur',
  'carlo', 'marco', 'luca', 'giuseppe', 'roberto', 'jan', 'willem',
  'dries', 'ruben', 'yannick', 'tariq', 'youssef', 'hassan',
  'ameha', 'rafiki', 'daudi', 'themba', 'abeo', 'maged',
  'man', 'boy', 'sir', 'mr'
];

// Preferred high-clarity female and natural/neural voice indicators across macOS, iOS, Windows, Edge, Android, ChromeOS
const PREMIUM_NATURAL_VOICES = [
  'online (natural)', 'natural', 'neural', 'premium', 'enhanced', 'siri',
  'zuri', 'rehema', 'thando', 'mekdes', 'ezinne', 'asilia', 'leah', 'mouna',
  'karen', 'samantha', 'victoria', 'moira', 'fiona', 'tessa', 'zira', 'ayanda',
  'monica', 'lucia', 'elsa', 'alice', 'joana', 'raquel', 'paola', 'helena',
  'catarina', 'francisca', 'leonor', 'ines', 'matilde', 'beatriz',
  'maria', 'ana', 'clara', 'camila', 'laura', 'sara', 'eva',
  'marta', 'sofia', 'carmen', 'elena', 'isabel', 'julie', 'marie',
  'charlotte', 'amelie', 'lea', 'manon', 'chloe', 'camille', 'celine',
  'audrey', 'denise', 'amira', 'fatima', 'yasmin', 'amina', 'leila', 'nour',
  'salma', 'mariam', 'aicha', 'khadija', 'jenny', 'sonia', 'serena', 'kore', 'zephyr'
];

/**
 * Validates that a speech synthesis voice is natural and non-male
 */
export function isNaturalFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice || !voice.name) return false;
  const name = voice.name.toLowerCase();

  for (const maleKeyword of MALE_VOICE_NAMES) {
    const regex = new RegExp(`\\b${maleKeyword}\\b`, 'i');
    if (regex.test(name) || name.includes(` ${maleKeyword}`) || name.startsWith(maleKeyword)) {
      return false;
    }
  }

  for (const femaleKeyword of PREMIUM_NATURAL_VOICES) {
    if (name.includes(femaleKeyword)) {
      return true;
    }
  }

  return true;
}

/**
 * Clean and format text for natural rhythmic pauses without robotic cadence
 */
export function formatSpeechTextWithNaturalBreaths(rawText: string): string {
  return rawText
    .replace(/[—–]/g, ', ')
    .replace(/\s*:\s*/g, ', ')
    .replace(/\s*\.\.\.\s*/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Play a warm African kalimba/marimba pentatonic chord progression
 * Pentatonic scale: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), A4 (440.00Hz), C5 (523.25Hz)
 */
export function playWarmAfricanChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
      activeAudioCtx = new AudioContextClass();
    }
    const ctx = activeAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);

      activeChimeOscillators.add(osc);
      osc.onended = () => {
        activeChimeOscillators.delete(osc);
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore cleanup errors
        }
      };

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.0);
    });
  } catch (err) {
    console.debug('Acoustic chime initialization:', err);
  }
}

const AFRICAN_ENGLISH_LOCALES = ['en-ng', 'en-ke', 'en-gh', 'en-za', 'en-tz', 'en-ug'];

function normalizeVoiceLang(lang: string): string {
  return (lang || '').trim().toLowerCase().replace(/_/g, '-');
}

function getPreferredTargetLocales(langLower: string): {
  exactTargets: string[];
  secondaryTargets: string[];
  fallbackLangCode: string;
  rate: number;
} {
  const baseLang = langLower.split('-')[0];

  // Cape Verdean Creole (Kabuverdianu) -> native kea / pt-CV first, then non-palatalizing pt-PT
  if (langLower === 'kea' || langLower === 'pt-cv' || langLower === 'kea-cv') {
    return {
      exactTargets: ['kea-cv', 'kea', 'pt-cv'],
      secondaryTargets: ['pt-pt', 'pt-gw', 'pt-st', 'pt-ao', 'pt-mz', 'pt'],
      fallbackLangCode: 'pt-PT',
      rate: 0.95,
    };
  }

  // European & Lusophone Portuguese
  if (baseLang === 'pt') {
    return {
      exactTargets: ['pt-pt', 'pt-ao', 'pt-mz', 'pt-cv'],
      secondaryTargets: ['pt'],
      fallbackLangCode: 'pt-PT',
      rate: 0.98,
    };
  }

  // Akan (Twi / Fante)
  if (baseLang === 'ak' || baseLang === 'tw') {
    return {
      exactTargets: ['ak-gh', 'ak', 'tw-gh', 'tw'],
      secondaryTargets: ['en-gh', 'en-ng'],
      fallbackLangCode: 'en-GH',
      rate: 0.94,
    };
  }

  // Amharic
  if (baseLang === 'am') {
    return {
      exactTargets: ['am-et', 'am'],
      secondaryTargets: ['en-ke', 'en-ng'],
      fallbackLangCode: 'am-ET',
      rate: 0.94,
    };
  }

  // Kiswahili
  if (baseLang === 'sw') {
    return {
      exactTargets: ['sw-ke', 'sw-tz', 'sw-ug', 'sw'],
      secondaryTargets: ['en-ke', 'en-tz', 'en-ng'],
      fallbackLangCode: 'sw-KE',
      rate: 0.95,
    };
  }

  // isiZulu & Nguni
  if (baseLang === 'zu' || baseLang === 'xh') {
    return {
      exactTargets: [`${baseLang}-za`, baseLang],
      secondaryTargets: ['en-za'],
      fallbackLangCode: `${baseLang}-ZA`,
      rate: 0.95,
    };
  }

  // West African indigenous -> regional voice pack first, then Nigerian/Ghanaian English
  if (baseLang === 'yo' || baseLang === 'ig' || baseLang === 'ha') {
    return {
      exactTargets: [`${baseLang}-ng`, `${baseLang}-ne`, baseLang],
      secondaryTargets: ['en-ng', 'en-gh'],
      fallbackLangCode: `${baseLang}-NG`,
      rate: 0.94,
    };
  }

  // Wolof / Fon -> regional voice pack first, then Francophone West Africa
  if (baseLang === 'wo' || baseLang === 'fon') {
    return {
      exactTargets: [langLower, baseLang],
      secondaryTargets: ['fr-sn', 'fr-bj', 'fr-ci', 'fr-fr', 'fr'],
      fallbackLangCode: 'fr-FR',
      rate: 0.96,
    };
  }

  // Afaan Oromoo & Somali -> Horn of Africa voices first
  if (baseLang === 'om' || baseLang === 'so') {
    return {
      exactTargets: [langLower, baseLang, 'so-so', 'so-ke', 'om-et'],
      secondaryTargets: ['am-et', 'en-ke', 'en-ng'],
      fallbackLangCode: baseLang === 'so' ? 'so-SO' : 'om-ET',
      rate: 0.95,
    };
  }

  // Lingála / Fula -> Central & West African Francophone voice packs
  if (baseLang === 'ln' || baseLang === 'ff') {
    return {
      exactTargets: [langLower, baseLang],
      secondaryTargets: ['fr-cd', 'fr-cg', 'fr-sn', 'fr-gn', 'fr-fr', 'fr'],
      fallbackLangCode: 'fr-FR',
      rate: 0.95,
    };
  }

  // Khoekhoegowab & Afrikaans -> Southern African voices
  if (baseLang === 'naq' || baseLang === 'af') {
    return {
      exactTargets: [langLower, baseLang, 'af-za'],
      secondaryTargets: ['en-za', 'zu-za', 'xh-za'],
      fallbackLangCode: baseLang === 'af' ? 'af-ZA' : 'en-ZA',
      rate: 0.95,
    };
  }

  // Tamazight / Kabyle / Berber -> Maghrebi voices
  if (baseLang === 'kab' || baseLang === 'zgh' || baseLang === 'ber') {
    return {
      exactTargets: [langLower, baseLang, 'kab-dz', 'zgh-ma'],
      secondaryTargets: ['fr-dz', 'fr-ma', 'ar-dz', 'ar-ma', 'fr-fr'],
      fallbackLangCode: 'kab-DZ',
      rate: 0.95,
    };
  }

  // Dholuo -> East African voices
  if (baseLang === 'luo') {
    return {
      exactTargets: [langLower, 'luo-ke', 'luo'],
      secondaryTargets: ['sw-ke', 'sw-tz', 'en-ke'],
      fallbackLangCode: 'sw-KE',
      rate: 0.95,
    };
  }

  // Malagasy -> Indian Ocean / Francophone fallback
  if (baseLang === 'mg') {
    return {
      exactTargets: [langLower, 'mg-mg', 'mg'],
      secondaryTargets: ['fr-mg', 'fr-fr', 'fr'],
      fallbackLangCode: 'mg-MG',
      rate: 0.96,
    };
  }

  // Maghrebi & North African Arabic -> Moroccan/Algerian/Tunisian/Egyptian before Gulf Arabic
  if (baseLang === 'ar') {
    return {
      exactTargets: [langLower, 'ar-ma', 'ar-dz', 'ar-tn', 'ar-eg', 'ar-sa'],
      secondaryTargets: ['ar'],
      fallbackLangCode: 'ar-MA',
      rate: 0.95,
    };
  }

  if (baseLang === 'fr') {
    return {
      exactTargets: [langLower, 'fr-sn', 'fr-ci', 'fr-cm', 'fr-fr'],
      secondaryTargets: ['fr'],
      fallbackLangCode: 'fr-FR',
      rate: 0.98,
    };
  }

  if (['es', 'de', 'it', 'nl'].includes(baseLang)) {
    const defaultRegion = baseLang === 'es' ? 'es-ES' : baseLang === 'de' ? 'de-DE' : baseLang === 'it' ? 'it-IT' : 'nl-NL';
    return {
      exactTargets: [langLower, defaultRegion.toLowerCase()],
      secondaryTargets: [baseLang],
      fallbackLangCode: defaultRegion,
      rate: baseLang === 'de' ? 0.98 : 1.0,
    };
  }

  // English -> prioritize African English (en-NG, en-KE, en-GH, en-ZA)
  return {
    exactTargets: [langLower, ...AFRICAN_ENGLISH_LOCALES].filter(Boolean),
    secondaryTargets: ['en-gb', 'en-us', 'en'],
    fallbackLangCode: preferredLocaleFromEnglish(langLower),
    rate: 0.96,
  };
}

function preferredLocaleFromEnglish(langLower: string): string {
  if (langLower.startsWith('en-')) return langLower.replace(/-([a-z]{2})$/, (_, r) => `-${r.toUpperCase()}`);
  return 'en-NG';
}

function scoreSystemVoice(
  voice: SpeechSynthesisVoice,
  exactTargets: string[],
  secondaryTargets: string[]
): number {
  const vLang = normalizeVoiceLang(voice.lang);
  const vName = (voice.name || '').toLowerCase();
  let score = 0;

  // 1. Language & regional priority
  const exactIdx = exactTargets.findIndex((t) => vLang === t);
  if (exactIdx !== -1) {
    score += 1000 - exactIdx * 25;
  } else {
    const prefixIdx = exactTargets.findIndex((t) => vLang.startsWith(`${t.split('-')[0]}-`) || vLang === t.split('-')[0]);
    if (prefixIdx !== -1) {
      score += 750 - prefixIdx * 20;
    } else {
      const secExact = secondaryTargets.findIndex((t) => vLang === t);
      if (secExact !== -1) {
        score += 550 - secExact * 20;
      } else {
        const secPrefix = secondaryTargets.findIndex((t) => vLang.startsWith(`${t.split('-')[0]}-`) || vLang === t.split('-')[0]);
        if (secPrefix !== -1) {
          score += 420 - secPrefix * 20;
        } else if (AFRICAN_ENGLISH_LOCALES.includes(vLang)) {
          score += 240;
        } else if (vLang.startsWith('en')) {
          score += 120;
        }
      }
    }
  }

  // 2. Engine tier quality (Edge Online Natural, Apple Siri/Enhanced, Google Neural)
  if (vName.includes('online (natural)') || vName.includes('neural')) score += 160;
  else if (vName.includes('natural') || vName.includes('siri') || vName.includes('enhanced') || vName.includes('premium')) score += 130;
  else if (vName.includes('google')) score += 70;

  // 3. Natural female persona weighting
  if (isNaturalFemaleVoice(voice)) {
    score += 90;
    if (PREMIUM_NATURAL_VOICES.some((p) => vName.includes(p))) {
      score += 40;
    }
  } else {
    score -= 80;
  }

  // 4. Avoid robotic espeak/legacy robotic tags when better options exist
  if (vName.includes('espeak') || vName.includes('compact')) {
    score -= 100;
  }

  return score;
}

/**
 * Finds the most natural, native OS voice for a target locale using ranked regional + neural scoring.
 */
export function getBestSystemVoice(preferredLang?: string): { voice: SpeechSynthesisVoice | null; langCode: string; rate: number; pitch: number } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, langCode: preferredLang || 'en-US', rate: 1.0, pitch: 1.0 };
  }

  const rawVoices = window.speechSynthesis.getVoices();
  const langLower = normalizeVoiceLang(preferredLang || 'en');
  const targets = getPreferredTargetLocales(langLower);

  if (!rawVoices || rawVoices.length === 0) {
    return { voice: null, langCode: preferredLang || targets.fallbackLangCode, rate: targets.rate, pitch: 1.0 };
  }

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;

  for (const voice of rawVoices) {
    const score = scoreSystemVoice(voice, targets.exactTargets, targets.secondaryTargets);
    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  if (bestVoice) {
    return {
      voice: bestVoice,
      langCode: bestVoice.lang || targets.fallbackLangCode,
      rate: targets.rate,
      pitch: 1.0,
    };
  }

  return { voice: rawVoices[0] || null, langCode: targets.fallbackLangCode, rate: 1.0, pitch: 1.0 };
}

/**
 * Returns diagnostic summary of installed OS native voices vs static African audio clips.
 */
export function getOsVoiceInventorySummary(preferredLang?: string): {
  totalOsVoices: number;
  africanLocaleOsVoices: number;
  selectedVoiceName: string | null;
  selectedVoiceLang: string;
  staticClipsCount: number;
} {
  const rawVoices =
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
  const africanTags = [
    'sw', 'zu', 'xh', 'am', 'yo', 'ig', 'ha', 'ak', 'tw', 'wo', 'fon', 'om', 'so', 'ln', 'ff',
    'naq', 'kab', 'zgh', 'mg', 'luo', 'af', 'ar-ma', 'ar-dz', 'ar-tn', 'ar-eg',
    'en-ng', 'en-ke', 'en-gh', 'en-za', 'en-tz', 'fr-sn', 'fr-bj', 'fr-cd', 'kea', 'pt-cv',
  ];
  const africanLocaleOsVoices = rawVoices.filter((v) => {
    const l = normalizeVoiceLang(v.lang);
    return africanTags.some((tag) => l === tag || l.startsWith(`${tag}-`));
  }).length;
  const best = getBestSystemVoice(preferredLang);
  return {
    totalOsVoices: rawVoices.length,
    africanLocaleOsVoices,
    selectedVoiceName: best.voice?.name || null,
    selectedVoiceLang: best.langCode,
    staticClipsCount: Object.keys(STATIC_AFRICAN_AUDIO_CLIPS).length,
  };
}

/**
 * Backward compatibility alias for legacy callers
 */
export function getAfricanFemaleVoice(preferredLang?: string): SpeechSynthesisVoice | null {
  return getBestSystemVoice(preferredLang).voice;
}

/**
 * Stop any current speech or audio playback
 */
export function stopAfriataSpeech() {
  activeSpeechSessionId = ++speechSessionCounter;

  if (voicesFallbackTimer !== null) {
    clearTimeout(voicesFallbackTimer);
    voicesFallbackTimer = null;
  }

  if (activeAudioProgressRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(activeAudioProgressRaf);
    activeAudioProgressRaf = null;
  }

  if (activeChimeOscillators.size > 0) {
    activeChimeOscillators.forEach((osc) => {
      try {
        osc.onended = null;
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already-stopped oscillator
      }
    });
    activeChimeOscillators.clear();
  }

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.onplay = null;
      currentAudioElement.onended = null;
      currentAudioElement.onerror = null;
      currentAudioElement = null;
    } catch {
      // Ignore
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.onvoiceschanged = null;
      currentUtterance = null;
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancel errors
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AFRIATA_SPEECH_STOP_EVENT, { detail: { sessionId: activeSpeechSessionId } }));
  }
}

/**
 * Speaks an academic narrative (primary source quote, historical chronicle, mother tongue phrase, or kingdom profile)
 * via pre-rendered Static African Audio Pack when matched, or the upgraded OS native voice engine otherwise.
 */
export function speakAcademicNarration(config: {
  text: string;
  audioClipId?: string;
  langTag?: string;
  playChime?: boolean;
  rate?: number;
  pitch?: number;
  startFraction?: number;
  onStart?: () => void;
  onProgress?: (fraction: number, currentTime: number, duration: number) => void;
  onEnd?: () => void;
  onError?: () => void;
}) {
  if (typeof window === 'undefined') return;

  // 1. Terminate any active speech or audio singleton
  stopAfriataSpeech();
  const sessionId = activeSpeechSessionId;

  // 2. Play subtle introductory chime if requested
  if (config.playChime) {
    playWarmAfricanChime();
  }

  // 3. Synchronously prefer Static African Neural Audio Pack if clip exists (works 100% offline & on iOS Safari)
  const staticClip = resolveStaticAudioClip({
    audioClipId: config.audioClipId,
    text: config.text,
    langTag: config.langTag,
  });
  if (staticClip) {
    playAudioClipElement(
      resolveAssetPath(staticClip.file),
      {
        text: config.text,
        langTag: config.langTag || staticClip.langTag,
        rate: config.rate,
        startFraction: config.startFraction,
        onStart: config.onStart,
        onProgress: config.onProgress,
        onEnd: config.onEnd,
        onError: config.onError,
      },
      sessionId
    );
    return;
  }

  if (!('speechSynthesis' in window)) {
    config.onStart?.();
    setTimeout(() => config.onEnd?.(), 2000);
    return;
  }

  try {
    // 4. Clean textual artifacts (Markdown bold/italics, citation years, brackets, excessive punctuation)
    const cleanedText = config.text
      .replace(/[*_#`~]/g, '')
      .replace(/\(\s*\d{3,4}\s*[-–—]\s*\d{3,4}\s*(?:BCE|CE|AD)?\s*\)/gi, '')
      .replace(/\[\s*\d+\s*\]/g, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/[—–]/g, ', ')
      .replace(/\s*:\s*/g, ', ')
      .replace(/\s*\.\.\.\s*/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    currentUtterance = utterance;

    const { voice, langCode } = getBestSystemVoice(config.langTag || 'en');
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = langCode;
    }

    // Curated, dignified academic pacing (0.92x prevents slurred fast synthesis unless caller sets rate)
    utterance.rate = config.rate ?? 0.92;
    utterance.pitch = config.pitch ?? 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (currentUtterance === utterance && sessionId === activeSpeechSessionId) {
        config.onStart?.();
      }
    };

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
        config.onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
        config.onError?.();
        config.onEnd?.();
      }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      let spoken = false;
      const speakOnce = () => {
        if (spoken || currentUtterance !== utterance || sessionId !== activeSpeechSessionId) return;
        spoken = true;
        if (voicesFallbackTimer !== null) {
          clearTimeout(voicesFallbackTimer);
          voicesFallbackTimer = null;
        }
        window.speechSynthesis.onvoiceschanged = null;
        const lateVoice = getBestSystemVoice(config.langTag || 'en');
        if (lateVoice.voice) {
          utterance.voice = lateVoice.voice;
          utterance.lang = lateVoice.voice.lang;
        }
        window.speechSynthesis.speak(utterance);
      };

      window.speechSynthesis.onvoiceschanged = speakOnce;
      voicesFallbackTimer = setTimeout(speakOnce, 400);
    } else {
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    currentUtterance = null;
    config.onError?.();
    config.onEnd?.();
  }
}

/**
 * Speak welcoming phrase using Static African Audio Pack first, optional server TTS if keys are configured,
 * or the upgraded native OS voice engine.
 */
export async function speakAfriataGreeting(config: SpeechGreetingConfig) {
  if (typeof window === 'undefined') return;

  // Always stop existing audio first
  stopAfriataSpeech();
  const sessionId = activeSpeechSessionId;

  // Play the welcoming African pentatonic kalimba chime
  playWarmAfricanChime();

  const formattedText = formatSpeechTextWithNaturalBreaths(config.text);

  // 1. Synchronous Static African Audio Pack match (0ms latency, zero API key, offline-ready, iOS gesture safe)
  const staticClip = resolveStaticAudioClip({
    audioClipId: config.audioClipId,
    text: config.text,
    langTag: config.langTag,
  });
  if (staticClip) {
    playAudioClipElement(
      resolveAssetPath(staticClip.file),
      { ...config, text: formattedText, langTag: config.langTag || staticClip.langTag },
      sessionId
    );
    return;
  }

  const cacheKey = `${config.langTag || 'default'}:${formattedText}`;

  // 2. Try local memory cache of dynamic neural audio if available
  if (clientAudioCache.has(cacheKey)) {
    const audioDataUrl = clientAudioCache.get(cacheKey)!;
    playAudioClipElement(audioDataUrl, { ...config, text: formattedText }, sessionId);
    return;
  }

  // 3. Query optional Server-Side TTS API ONLY when backend explicitly reports keys configured
  try {
    if (await isBackendTtsAvailable()) {
      if (sessionId !== activeSpeechSessionId) return;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(resolveApiUrl('/api/tts'), {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: formattedText,
            langTag: config.langTag,
            languageName: config.languageName,
          }),
        });

        if (sessionId !== activeSpeechSessionId) return;

        if (res.ok) {
          const data = await res.json();
          if (sessionId !== activeSpeechSessionId) return;
          if (data.audioBase64) {
            const mime = data.mimeType || 'audio/mp3';
            const dataUrl = `data:${mime};base64,${data.audioBase64}`;
            setClientAudioCache(cacheKey, dataUrl);
            playAudioClipElement(dataUrl, { ...config, text: formattedText }, sessionId);
            return;
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
  } catch {
    // Graceful silent fallback to native OS speech synthesis
  }

  if (sessionId !== activeSpeechSessionId) return;

  // 4. Upgraded Native OS Speech Synthesis
  speakWithClientSynthesis({ ...config, text: formattedText }, sessionId);
}

/**
 * Play static MP3 or data-URL neural audio buffer through HTML5 Audio with seek & playbackRate support
 */
function playAudioClipElement(audioUrl: string, config: SpeechGreetingConfig, sessionId: number) {
  if (sessionId !== activeSpeechSessionId) return;
  try {
    const audio = new Audio(audioUrl);
    currentAudioElement = audio;
    audio.playbackRate = config.rate ?? 1.0;

    let seekApplied = false;
    const applyInitialSeek = () => {
      if (seekApplied) return;
      if (config.startFraction && config.startFraction > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
        seekApplied = true;
        audio.currentTime = Math.max(0, Math.min(audio.duration - 0.05, config.startFraction * audio.duration));
      }
    };

    if (audio.readyState >= 1) {
      applyInitialSeek();
    } else {
      audio.addEventListener('loadedmetadata', applyInitialSeek, { once: true });
    }

    const pumpProgress = () => {
      if (currentAudioElement !== audio || sessionId !== activeSpeechSessionId || audio.paused || audio.ended) {
        activeAudioProgressRaf = null;
        return;
      }
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const frac = Math.max(0, Math.min(1, audio.currentTime / audio.duration));
        config.onProgress?.(frac, audio.currentTime, audio.duration);
      }
      activeAudioProgressRaf = requestAnimationFrame(pumpProgress);
    };

    audio.onplay = () => {
      if (currentAudioElement === audio && sessionId === activeSpeechSessionId) {
        applyInitialSeek();
        config.onStart?.();
        if (config.onProgress && typeof requestAnimationFrame !== 'undefined') {
          activeAudioProgressRaf = requestAnimationFrame(pumpProgress);
        }
      }
    };

    audio.onended = () => {
      if (activeAudioProgressRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(activeAudioProgressRaf);
        activeAudioProgressRaf = null;
      }
      if (currentAudioElement === audio) {
        currentAudioElement = null;
        config.onProgress?.(1, audio.duration || 0, audio.duration || 0);
        config.onEnd?.();
      }
    };

    audio.onerror = () => {
      if (activeAudioProgressRaf !== null && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(activeAudioProgressRaf);
        activeAudioProgressRaf = null;
      }
      if (currentAudioElement === audio) {
        currentAudioElement = null;
        speakWithClientSynthesis(config, sessionId);
      }
    };

    audio.play().catch(() => {
      if (currentAudioElement === audio && sessionId === activeSpeechSessionId) {
        currentAudioElement = null;
        speakWithClientSynthesis(config, sessionId);
      }
    });
  } catch {
    speakWithClientSynthesis(config, sessionId);
  }
}

/**
 * Client-Side SpeechSynthesis using native un-distorted operating system prosody
 */
function speakWithClientSynthesis(config: SpeechGreetingConfig, sessionId = activeSpeechSessionId) {
  if (sessionId !== activeSpeechSessionId) return;
  if (!('speechSynthesis' in window)) {
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 3000);
    return;
  }

  try {
    const textToSpeak = formatSpeechTextWithNaturalBreaths(config.text);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance = utterance;

    const { voice, langCode, rate, pitch } = getBestSystemVoice(config.langTag);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = langCode;
    }

    // Use pure natural acoustic cadence without synthetic pitch/rate distortion
    utterance.pitch = pitch;
    utterance.rate = config.rate ?? rate;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (currentUtterance === utterance && sessionId === activeSpeechSessionId) {
        config.onStart?.();
      }
    };

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
        config.onEnd?.();
      }
    };

    utterance.onerror = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
        config.onError?.();
        config.onEnd?.();
      }
    };

    // Ensure voices are loaded if browser initialized asynchronously
    if (window.speechSynthesis.getVoices().length === 0) {
      let spoken = false;
      const speakOnce = () => {
        if (spoken || currentUtterance !== utterance || sessionId !== activeSpeechSessionId) return;
        spoken = true;
        if (voicesFallbackTimer !== null) {
          clearTimeout(voicesFallbackTimer);
          voicesFallbackTimer = null;
        }
        window.speechSynthesis.onvoiceschanged = null;
        const lateVoice = getBestSystemVoice(config.langTag);
        if (lateVoice.voice) {
          utterance.voice = lateVoice.voice;
          utterance.lang = lateVoice.voice.lang;
        }
        window.speechSynthesis.speak(utterance);
      };

      window.speechSynthesis.onvoiceschanged = speakOnce;
      voicesFallbackTimer = setTimeout(speakOnce, 400);
    } else {
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    currentUtterance = null;
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 2500);
  }
}

/**
 * High-Intelligibility UI Language Greetings for the App Top Bar
 */
export const TOP_BAR_UI_GREETINGS: Record<string, { phrase: string; langTag: string; languageName: string; audioClipId?: string }> = {
  'en': {
    phrase: 'Welcome to the Afriata experience, the Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'English (Sovereign Voice)'
  },
  'fr': {
    phrase: 'Bienvenue dans l\'expérience Afriata, l\'explorateur ethnique de l\'Atlantique. Bonne découverte.',
    langTag: 'fr-FR',
    languageName: 'Français'
  },
  'pt': {
    phrase: 'Olá, bem-vindo à experiência Afriata, o Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    langTag: 'pt-PT',
    languageName: 'Português (Portugal)'
  },
  'es': {
    phrase: 'Hola, bienvenido a la experiencia Afriata, el Explorador Étnico del Atlántico. Disfrute de su exploración.',
    langTag: 'es-ES',
    languageName: 'Español'
  },
  'it': {
    phrase: 'Ciao e benvenuto nell\'esperienza Afriata, l\'Esploratore Etnico dell\'Atlantico. Buona scoperta.',
    langTag: 'it-IT',
    languageName: 'Italiano'
  },
  'nl': {
    phrase: 'Hallo, welkom bij de Afriata-ervaring, de Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    langTag: 'nl-NL',
    languageName: 'Nederlands'
  },
  'de': {
    phrase: 'Willkommen zum Afriata-Erlebnis, der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    langTag: 'de-DE',
    languageName: 'Deutsch'
  },
  'ar': {
    phrase: 'مرحباً بكم في تجربة أفرياتا، مستكشف التنوع الإفريقي والأطلسي.',
    langTag: 'ar-MA',
    languageName: 'العربية (Arabic)'
  },
  'yo': {
    phrase: 'Báwo ni?',
    audioClipId: 'mother-yoruba',
    langTag: 'yo-NG',
    languageName: 'Yorùbá'
  },
  'ha': {
    phrase: 'Sannu / Ina kwana?',
    audioClipId: 'mother-hausa',
    langTag: 'ha-NG',
    languageName: 'Hausa'
  },
  'ig': {
    phrase: 'Ndewo / Kèdú?',
    audioClipId: 'mother-igbo',
    langTag: 'ig-NG',
    languageName: 'Igbo'
  },
  'sw': {
    phrase: 'Hujambo / Habari yako?',
    audioClipId: 'mother-swahili',
    langTag: 'sw-KE',
    languageName: 'Kiswahili'
  },
  'am': {
    phrase: 'Selam! (ሰላም) / Tena Yistillign',
    audioClipId: 'mother-amharic',
    langTag: 'am-ET',
    languageName: 'Amharic (አማርኛ)'
  },
  'wo': {
    phrase: 'Nanga def? / Mangi fi rekk',
    audioClipId: 'mother-wolof',
    langTag: 'wo-SN',
    languageName: 'Wolof'
  },
  'zu': {
    phrase: 'Sawubona!',
    audioClipId: 'mother-zulu',
    langTag: 'zu-ZA',
    languageName: 'isiZulu'
  },
  'xh': {
    phrase: 'Molo! Kunjani?',
    audioClipId: 'mother-xhosa',
    langTag: 'xh-ZA',
    languageName: 'isiXhosa'
  }
};

