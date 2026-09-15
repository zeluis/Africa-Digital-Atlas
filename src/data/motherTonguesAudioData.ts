/**
 * Mother Tongues Audio Pronunciation and Greeting Engine
 * Provides authentic greetings, IPA phonetics, language family classifications,
 * and Web Speech Synthesis / Web Audio harmonic speech sounds for major African tongues.
 */

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
    tonalHarmonics: [440, 554.37, 659.25] // A Major triad
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
    tonalHarmonics: [392, 493.88, 587.33] // G Major triad
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
    tonalHarmonics: [329.63, 415.3, 493.88] // E Major triad
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
    tonalHarmonics: [349.23, 440, 523.25] // F Major triad
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
    tonalHarmonics: [261.63, 329.63, 392] // C Major warm chord
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
    tonalHarmonics: [440, 554.37, 659.25]
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
    tonalHarmonics: [392, 493.88, 587.33]
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
    tonalHarmonics: [293.66, 369.99, 440] // D Major
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
    tonalHarmonics: [329.63, 392, 493.88] // E minor pentatonic
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
    tonalHarmonics: [440, 523.25, 659.25]
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
