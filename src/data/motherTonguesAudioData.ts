/**
 * Mother Tongues Audio Pronunciation and Greeting Engine
 * Provides authentic greetings, IPA phonetics, language family classifications,
 * and Web Speech Synthesis / Web Audio harmonic speech sounds for major African tongues.
 */

export interface MotherTongueSyllable {
  text: string;
  phonetic: string;
  startFraction: number; // 0.0 - 1.0
  endFraction: number;   // 0.0 - 1.0
  tone?: 'High' | 'Mid' | 'Low' | 'Rising' | 'Falling' | 'Neutral';
}

export interface MotherTongueEntry {
  id: string;
  language: string;
  autonym: string; // Native name
  family: string;
  country: string;
  isoCode: string;
  greetingText: string;
  greetingPhonetic: string;
  greetingMeaning: string;
  proverbText: string;
  proverbTranslation: string;
  bcp47Tag: string; // For SpeechSynthesisUtterance where supported
  tonalHarmonics: number[]; // Frequencies for subtle indigenous musical motif
  durationSeconds?: number;
  waveformProfile?: number[];
  syllables?: MotherTongueSyllable[];
}

export const AFRICAN_MOTHER_TONGUES: Record<string, MotherTongueEntry> = {
  'yoruba': {
    id: 'yoruba',
    language: 'Yorùbá',
    autonym: 'Èdè Yorùbá',
    family: 'Niger-Congo (Volta-Niger)',
    country: 'Nigeria',
    isoCode: 'yo',
    greetingText: 'Báwo ni?',
    greetingPhonetic: '[bá.wo ni]',
    greetingMeaning: 'How are things? / Greetings',
    proverbText: 'Ilé la ti ń kọ́ èṣọ́ ròde.',
    proverbTranslation: 'Good character and manners are nurtured at home before taken into the world.',
    bcp47Tag: 'yo-NG',
    tonalHarmonics: [440, 554.37, 659.25], // A Major triad
    durationSeconds: 2.8,
    waveformProfile: [0.18, 0.28, 0.65, 0.92, 0.88, 0.74, 0.42, 0.22, 0.15, 0.35, 0.78, 0.86, 0.64, 0.40, 0.20, 0.16, 0.38, 0.72, 0.94, 0.80, 0.52, 0.28, 0.18, 0.12, 0.20, 0.32, 0.55, 0.70, 0.62, 0.45, 0.26, 0.18, 0.14, 0.22, 0.40, 0.60, 0.50, 0.32, 0.18, 0.12, 0.15, 0.24, 0.32, 0.22, 0.14, 0.10, 0.08, 0.05],
    syllables: [
      { text: 'Bá', phonetic: '[bá]', startFraction: 0.05, endFraction: 0.32, tone: 'High' },
      { text: 'wo', phonetic: '[wo]', startFraction: 0.32, endFraction: 0.62, tone: 'Mid' },
      { text: 'ni?', phonetic: '[ni]', startFraction: 0.62, endFraction: 0.95, tone: 'Low' }
    ]
  },
  'igbo': {
    id: 'igbo',
    language: 'Igbo',
    autonym: 'Ásụ̀sụ́ Ìgbò',
    family: 'Niger-Congo (Volta-Niger)',
    country: 'Nigeria',
    isoCode: 'ig',
    greetingText: 'Ndewo / Kèdú?',
    greetingPhonetic: '[n.de.wo]',
    greetingMeaning: 'Greetings / How are you?',
    proverbText: 'Egbe bere, ugo bere.',
    proverbTranslation: 'Let the kite perch and let the eagle perch; let all coexist in harmony.',
    bcp47Tag: 'ig-NG',
    tonalHarmonics: [392, 493.88, 587.33], // G Major triad
    durationSeconds: 3.0,
    waveformProfile: [0.15, 0.32, 0.74, 0.95, 0.82, 0.55, 0.30, 0.18, 0.22, 0.48, 0.88, 0.92, 0.70, 0.45, 0.24, 0.18, 0.30, 0.68, 0.90, 0.76, 0.48, 0.28, 0.18, 0.14, 0.22, 0.50, 0.82, 0.74, 0.52, 0.30, 0.18, 0.12, 0.18, 0.35, 0.58, 0.42, 0.25, 0.16, 0.12, 0.10, 0.14, 0.20, 0.25, 0.18, 0.12, 0.08, 0.06, 0.04],
    syllables: [
      { text: 'N-', phonetic: '[n]', startFraction: 0.05, endFraction: 0.25, tone: 'Low' },
      { text: 'de-', phonetic: '[de]', startFraction: 0.25, endFraction: 0.55, tone: 'High' },
      { text: 'wo', phonetic: '[wo]', startFraction: 0.55, endFraction: 0.95, tone: 'Mid' }
    ]
  },
  'hausa': {
    id: 'hausa',
    language: 'Hausa',
    autonym: 'Harshen Hausa',
    family: 'Afroasiatic (Chadic)',
    country: 'Nigeria / Niger',
    isoCode: 'ha',
    greetingText: 'Sannu / Ina kwana?',
    greetingPhonetic: '[sàn.núː]',
    greetingMeaning: 'Hello / How was your morning?',
    proverbText: 'Gani ya kori ji.',
    proverbTranslation: 'Seeing overcomes hearing (Seeing is believing).',
    bcp47Tag: 'ha-NG',
    tonalHarmonics: [329.63, 415.3, 493.88], // E Major triad
    durationSeconds: 2.9,
    waveformProfile: [0.12, 0.25, 0.58, 0.85, 0.90, 0.68, 0.38, 0.20, 0.28, 0.62, 0.95, 0.88, 0.60, 0.32, 0.18, 0.15, 0.32, 0.70, 0.85, 0.72, 0.44, 0.24, 0.16, 0.12, 0.22, 0.45, 0.75, 0.65, 0.48, 0.28, 0.16, 0.12, 0.16, 0.32, 0.52, 0.38, 0.22, 0.15, 0.12, 0.10, 0.12, 0.18, 0.22, 0.16, 0.10, 0.08, 0.05, 0.04],
    syllables: [
      { text: 'San-', phonetic: '[sàn]', startFraction: 0.05, endFraction: 0.45, tone: 'Low' },
      { text: 'nu', phonetic: '[núː]', startFraction: 0.45, endFraction: 0.92, tone: 'High' }
    ]
  },
  'swahili': {
    id: 'swahili',
    language: 'Kiswahili',
    autonym: 'Kiswahili',
    family: 'Niger-Congo (Bantu)',
    country: 'Kenya / Tanzania / DRC',
    isoCode: 'sw',
    greetingText: 'Hujambo / Habari yako?',
    greetingPhonetic: '[hu.dʒam.bo]',
    greetingMeaning: 'How are you? / What news do you bring?',
    proverbText: 'Kidogo kidogo hujaza kibaba.',
    proverbTranslation: 'Little by little fills the measuring pot.',
    bcp47Tag: 'sw-KE',
    tonalHarmonics: [349.23, 440, 523.25], // F Major triad
    durationSeconds: 3.2,
    waveformProfile: [0.15, 0.30, 0.60, 0.85, 0.75, 0.48, 0.25, 0.18, 0.35, 0.78, 0.98, 0.85, 0.58, 0.30, 0.18, 0.22, 0.52, 0.88, 0.92, 0.68, 0.40, 0.22, 0.15, 0.18, 0.40, 0.72, 0.80, 0.60, 0.38, 0.20, 0.14, 0.18, 0.35, 0.55, 0.45, 0.28, 0.16, 0.12, 0.14, 0.22, 0.30, 0.24, 0.15, 0.10, 0.08, 0.06, 0.04, 0.03],
    syllables: [
      { text: 'Hu-', phonetic: '[hu]', startFraction: 0.05, endFraction: 0.30, tone: 'Mid' },
      { text: 'jam-', phonetic: '[dʒam]', startFraction: 0.30, endFraction: 0.65, tone: 'High' },
      { text: 'bo', phonetic: '[bo]', startFraction: 0.65, endFraction: 0.95, tone: 'Low' }
    ]
  },
  'kabuverdianu': {
    id: 'kabuverdianu',
    language: 'Kriolu (Kabuverdianu)',
    autonym: 'Kabuverdianu',
    family: 'Atlantic Creole (Niger-Congo substrate)',
    country: 'Cabo Verde',
    isoCode: 'kea',
    greetingText: 'Munti sabi! / Modi ki bu sta?',
    greetingPhonetic: '[mũ.ti sa.bi]',
    greetingMeaning: 'Deep warmth and contentment! / How are you?',
    proverbText: 'Genti d’agu, sabura di mar.',
    proverbTranslation: 'People of the water, boundless savor of the Atlantic sea.',
    bcp47Tag: 'pt-CV',
    tonalHarmonics: [261.63, 329.63, 392], // C Major warm chord
    durationSeconds: 3.1,
    waveformProfile: [0.14, 0.28, 0.62, 0.88, 0.80, 0.52, 0.28, 0.18, 0.30, 0.65, 0.92, 0.84, 0.55, 0.32, 0.20, 0.25, 0.58, 0.85, 0.90, 0.65, 0.38, 0.20, 0.14, 0.18, 0.42, 0.70, 0.78, 0.58, 0.35, 0.18, 0.12, 0.16, 0.32, 0.50, 0.42, 0.26, 0.15, 0.10, 0.12, 0.20, 0.28, 0.20, 0.14, 0.09, 0.07, 0.05, 0.04, 0.02],
    syllables: [
      { text: 'Mun-', phonetic: '[mũ]', startFraction: 0.05, endFraction: 0.30, tone: 'Mid' },
      { text: 'ti', phonetic: '[ti]', startFraction: 0.30, endFraction: 0.55, tone: 'High' },
      { text: 'sa-', phonetic: '[sa]', startFraction: 0.55, endFraction: 0.78, tone: 'High' },
      { text: 'bi', phonetic: '[bi]', startFraction: 0.78, endFraction: 0.95, tone: 'Low' }
    ]
  },
  'akan': {
    id: 'akan',
    language: 'Akan (Twi / Fante)',
    autonym: 'Twi',
    family: 'Niger-Congo (Kwa)',
    country: 'Ghana',
    isoCode: 'ak',
    greetingText: 'Akwaaba! / Wo ho te sɛn?',
    greetingPhonetic: '[a.kʷaː.ba]',
    greetingMeaning: 'Welcome! / How is your body and health?',
    proverbText: 'Sankofa: Wɔnkyi sɛ w’akɔfa nea w’akyi akyi.',
    proverbTranslation: 'It is not forbidden to return and claim that which was forgotten.',
    bcp47Tag: 'ak-GH',
    tonalHarmonics: [440, 554.37, 659.25],
    durationSeconds: 3.3,
    waveformProfile: [0.12, 0.24, 0.52, 0.82, 0.95, 0.78, 0.45, 0.22, 0.28, 0.60, 0.90, 0.82, 0.52, 0.28, 0.18, 0.24, 0.55, 0.88, 0.94, 0.70, 0.42, 0.22, 0.15, 0.20, 0.45, 0.75, 0.82, 0.62, 0.38, 0.20, 0.14, 0.18, 0.35, 0.54, 0.44, 0.28, 0.16, 0.12, 0.14, 0.22, 0.30, 0.22, 0.15, 0.10, 0.08, 0.05, 0.04, 0.02],
    syllables: [
      { text: 'A-', phonetic: '[a]', startFraction: 0.05, endFraction: 0.25, tone: 'Low' },
      { text: 'kwaa-', phonetic: '[kʷaː]', startFraction: 0.25, endFraction: 0.65, tone: 'High' },
      { text: 'ba!', phonetic: '[ba]', startFraction: 0.65, endFraction: 0.95, tone: 'Mid' }
    ]
  },
  'fon': {
    id: 'fon',
    language: 'Fon (Fongbe)',
    autonym: 'Fɔngbe',
    family: 'Niger-Congo (Gbe)',
    country: 'Benin',
    isoCode: 'fon',
    greetingText: 'Kú dɔ / Mi kwabo!',
    greetingPhonetic: '[ku dɔ]',
    greetingMeaning: 'Peace and honor upon your labor / Welcome!',
    proverbText: 'Nǔ ɖé sín nu wɛ nyí gbɛ̀.',
    proverbTranslation: 'Everything on earth shares the same life breath.',
    bcp47Tag: 'fr-BJ',
    tonalHarmonics: [392, 493.88, 587.33],
    durationSeconds: 2.7,
    waveformProfile: [0.15, 0.35, 0.75, 0.94, 0.80, 0.50, 0.25, 0.18, 0.32, 0.70, 0.92, 0.80, 0.50, 0.25, 0.18, 0.22, 0.50, 0.82, 0.88, 0.65, 0.38, 0.20, 0.14, 0.18, 0.40, 0.68, 0.75, 0.55, 0.32, 0.18, 0.12, 0.15, 0.30, 0.48, 0.38, 0.24, 0.15, 0.10, 0.12, 0.18, 0.25, 0.18, 0.12, 0.08, 0.06, 0.04, 0.03, 0.02],
    syllables: [
      { text: 'Kú', phonetic: '[ku]', startFraction: 0.05, endFraction: 0.48, tone: 'High' },
      { text: 'dɔ', phonetic: '[dɔ]', startFraction: 0.48, endFraction: 0.95, tone: 'Low' }
    ]
  },
  'zulu': {
    id: 'zulu',
    language: 'isiZulu',
    autonym: 'isiZulu',
    family: 'Niger-Congo (Bantu / Nguni)',
    country: 'South Africa',
    isoCode: 'zu',
    greetingText: 'Sawubona!',
    greetingPhonetic: '[sa.wu.ɓoː.na]',
    greetingMeaning: 'I see you (I recognize your humanity and worth)',
    proverbText: 'Umuntu ngumuntu ngabantu.',
    proverbTranslation: 'A person is a person through other persons (Ubuntu).',
    bcp47Tag: 'zu-ZA',
    tonalHarmonics: [293.66, 369.99, 440], // D Major
    durationSeconds: 3.1,
    waveformProfile: [0.16, 0.32, 0.68, 0.90, 0.84, 0.56, 0.30, 0.18, 0.28, 0.64, 0.94, 0.86, 0.58, 0.32, 0.20, 0.25, 0.58, 0.90, 0.96, 0.72, 0.44, 0.24, 0.16, 0.20, 0.44, 0.74, 0.82, 0.62, 0.38, 0.20, 0.14, 0.18, 0.34, 0.52, 0.42, 0.26, 0.15, 0.10, 0.12, 0.20, 0.28, 0.20, 0.14, 0.09, 0.07, 0.05, 0.04, 0.02],
    syllables: [
      { text: 'Sa-', phonetic: '[sa]', startFraction: 0.05, endFraction: 0.28, tone: 'Mid' },
      { text: 'wu-', phonetic: '[wu]', startFraction: 0.28, endFraction: 0.52, tone: 'Mid' },
      { text: 'bo-', phonetic: '[ɓoː]', startFraction: 0.52, endFraction: 0.78, tone: 'High' },
      { text: 'na!', phonetic: '[na]', startFraction: 0.78, endFraction: 0.95, tone: 'Low' }
    ]
  },
  'amharic': {
    id: 'amharic',
    language: 'Amharic',
    autonym: 'አማርኛ (Amarəñña)',
    family: 'Afroasiatic (Semitic)',
    country: 'Ethiopia',
    isoCode: 'am',
    greetingText: 'Selam! (ሰላም) / Tena Yistillign',
    greetingPhonetic: '[sə.lam]',
    greetingMeaning: 'Peace! / May the creator grant you health',
    proverbText: 'ድር ቢያብር አንበሳ ያስር።',
    proverbTranslation: 'When spider webs unite, they can tie up a lion.',
    bcp47Tag: 'am-ET',
    tonalHarmonics: [329.63, 392, 493.88], // E minor pentatonic
    durationSeconds: 2.6,
    waveformProfile: [0.14, 0.30, 0.65, 0.92, 0.85, 0.55, 0.28, 0.18, 0.30, 0.68, 0.96, 0.88, 0.58, 0.30, 0.18, 0.24, 0.52, 0.85, 0.90, 0.68, 0.40, 0.22, 0.15, 0.18, 0.38, 0.65, 0.72, 0.52, 0.32, 0.18, 0.12, 0.15, 0.28, 0.45, 0.35, 0.22, 0.14, 0.10, 0.12, 0.18, 0.24, 0.18, 0.12, 0.08, 0.06, 0.04, 0.03, 0.02],
    syllables: [
      { text: 'Se-', phonetic: '[sə]', startFraction: 0.05, endFraction: 0.45, tone: 'Mid' },
      { text: 'lam!', phonetic: '[lam]', startFraction: 0.45, endFraction: 0.95, tone: 'High' }
    ]
  },
  'arabic_maghrebi': {
    id: 'arabic_maghrebi',
    language: 'Maghrebi Arabic / Tamazight',
    autonym: 'الدارجة / ⵜⴰⵎⴰⵣⵉⵖⵜ',
    family: 'Afroasiatic (Semitic & Berber)',
    country: 'Morocco / Algeria / Tunisia / Egypt',
    isoCode: 'ar',
    greetingText: 'Salam Aleikoum / Azul!',
    greetingPhonetic: '[sa.laːm ʕa.laj.kum]',
    greetingMeaning: 'Peace be upon you / Life and light!',
    proverbText: 'اليد الواحدة ما كتصفقش.',
    proverbTranslation: 'A single hand cannot clap alone; community is vital.',
    bcp47Tag: 'ar-MA',
    tonalHarmonics: [440, 523.25, 659.25],
    durationSeconds: 3.4,
    waveformProfile: [0.15, 0.32, 0.70, 0.92, 0.84, 0.55, 0.28, 0.18, 0.32, 0.68, 0.95, 0.86, 0.58, 0.32, 0.20, 0.26, 0.58, 0.90, 0.95, 0.72, 0.44, 0.24, 0.16, 0.20, 0.44, 0.75, 0.82, 0.62, 0.38, 0.20, 0.14, 0.18, 0.34, 0.52, 0.42, 0.26, 0.15, 0.10, 0.12, 0.20, 0.28, 0.20, 0.14, 0.09, 0.07, 0.05, 0.04, 0.02],
    syllables: [
      { text: 'Sa-', phonetic: '[sa]', startFraction: 0.05, endFraction: 0.25, tone: 'Low' },
      { text: 'laam', phonetic: '[laːm]', startFraction: 0.25, endFraction: 0.55, tone: 'High' },
      { text: 'Alei-', phonetic: '[ʕa.laj]', startFraction: 0.55, endFraction: 0.80, tone: 'Mid' },
      { text: 'kum', phonetic: '[kum]', startFraction: 0.80, endFraction: 0.95, tone: 'Low' }
    ]
  }
};

import { getBestSystemVoice } from '../utils/africaliaVoiceEngine';

/**
 * Play an indigenous musical greeting soundscape using high-fidelity native voice & harmonic Web Audio
 */
export function playMotherTongueAudio(entry: MotherTongueEntry) {
  if (typeof window === 'undefined') return;

  // 1. Play Browser Native Speech Synthesis with natural voice selection
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.greetingText);
      const { voice, langCode, rate, pitch } = getBestSystemVoice(entry.bcp47Tag);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1.0;

      // Slight delay so the opening kalimba chime resonates cleanly
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 150);
    } catch {
      // Graceful fallback
    }
  }

  // 2. Play complementary tonal harmonic resonance chord (Marimba / Kalimba style chime)
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    entry.tonalHarmonics.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Kalimba / Bell envelope
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (err) {
    console.debug('Web Audio not allowed without user gesture:', err);
  }
}
