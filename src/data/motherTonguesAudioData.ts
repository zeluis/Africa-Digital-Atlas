/**
 * Mother Tongues Audio Pronunciation and Greeting Engine
 * Provides greetings, IPA phonetics, language family classifications,
 * real PCM RMS waveform envelopes, and static African neural audio / OS Web Speech playback.
 */

import { speakAcademicNarration } from '../utils/afriataVoiceEngine';

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
  proverbAudioClipId?: string; // Extended tier runtime-cached MP3 clip ID
  bcp47Tag: string; // For SpeechSynthesisUtterance where supported
  audioClipId: string; // Static pre-rendered African neural audio clip ID
  provenanceBadge: string;
  isProxy: boolean;
  proxyNote?: string;
  tonalHarmonics: number[]; // Frequencies for subtle indigenous musical motif
  durationSeconds: number;
  waveformProfile: number[];
  syllables: MotherTongueSyllable[];
}

export const AFRICAN_MOTHER_TONGUES: Record<string, MotherTongueEntry> = {
  yoruba: {
    id: 'yoruba',
    audioClipId: 'mother-yoruba',
    proverbAudioClipId: 'proverb-yoruba',
    language: 'Yorùbá',
    autonym: 'Èdè Yorùbá',
    family: 'Niger-Congo (Volta-Niger)',
    country: 'Nigeria / Benin',
    isoCode: 'yo',
    greetingText: 'Báwo ni?',
    greetingPhonetic: '[bá.wo ni]',
    greetingMeaning: 'How are things? / Greetings',
    proverbText: 'Ilé la ti ń kọ́ èṣọ́ ròde.',
    proverbTranslation: 'Good character and manners are nurtured at home before taken into the world.',
    bcp47Tag: 'yo-NG',
    provenanceBadge: 'Meta MMS-TTS (Yorùbá VITS)',
    isProxy: false,
    tonalHarmonics: [440, 554.37, 659.25],
    durationSeconds: 0.89,
    waveformProfile: [0.06, 0.1, 0.37, 0.68, 0.95, 0.9, 0.89, 0.93, 0.85, 0.91, 0.88, 0.88, 0.9, 0.96, 0.95, 0.95, 0.92, 0.88, 0.93, 0.9, 0.96, 0.9, 0.89, 0.94, 1, 0.93, 0.95, 0.89, 0.91, 0.85, 0.81, 0.77, 0.73, 0.71, 0.7, 0.68, 0.63, 0.6, 0.56, 0.49, 0.43, 0.38, 0.31, 0.25, 0.15, 0.08, 0.06, 0.06],
    syllables: [
      { text: 'Bá', phonetic: '[bá]', startFraction: 0.04, endFraction: 0.34, tone: 'High' },
      { text: 'wo', phonetic: '[wo]', startFraction: 0.34, endFraction: 0.65, tone: 'Mid' },
      { text: 'ni?', phonetic: '[ni]', startFraction: 0.65, endFraction: 0.95, tone: 'Low' }
    ]
  },
  igbo: {
    id: 'igbo',
    audioClipId: 'mother-igbo',
    language: 'Igbo',
    autonym: 'Ásụ̀sụ́ Ìgbò',
    family: 'Niger-Congo (Volta-Niger)',
    country: 'Nigeria',
    isoCode: 'ig',
    greetingText: 'Ndewo / Kèdú?',
    greetingPhonetic: '[n.de.wo / kè.dú]',
    greetingMeaning: 'Greetings / How are you?',
    proverbText: 'Egbe bere, ugo bere.',
    proverbTranslation: 'Let the kite perch and let the eagle perch; let all coexist in harmony.',
    bcp47Tag: 'ig-NG',
    provenanceBadge: 'Nigerian English Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Nigerian English neural phonetic rendering used because open-weight Igbo ONNX synthesis weights are unavailable for browser/Node VITS inference.',
    tonalHarmonics: [392, 493.88, 587.33],
    durationSeconds: 3.19,
    waveformProfile: [0.06, 0.06, 0.16, 0.62, 0.56, 1, 0.95, 0.48, 0.68, 0.48, 0.08, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.32, 0.97, 0.69, 0.93, 0.76, 0.13, 0.33, 0.07, 0.53, 0.75, 0.34, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'N-', phonetic: '[n]', startFraction: 0.05, endFraction: 0.14, tone: 'Low' },
      { text: 'de-', phonetic: '[de]', startFraction: 0.14, endFraction: 0.25, tone: 'High' },
      { text: 'wo', phonetic: '[wo]', startFraction: 0.25, endFraction: 0.45, tone: 'Mid' },
      { text: 'Kèdú?', phonetic: '[kè.dú]', startFraction: 0.50, endFraction: 0.85, tone: 'Rising' }
    ]
  },
  hausa: {
    id: 'hausa',
    audioClipId: 'mother-hausa',
    proverbAudioClipId: 'proverb-hausa',
    language: 'Hausa',
    autonym: 'Harshen Hausa',
    family: 'Afroasiatic (Chadic)',
    country: 'Nigeria / Niger',
    isoCode: 'ha',
    greetingText: 'Sannu / Ina kwana?',
    greetingPhonetic: '[sàn.núː / ì.náː kwáː.nā]',
    greetingMeaning: 'Hello / How was your morning?',
    proverbText: 'Gani ya kori ji.',
    proverbTranslation: 'Seeing overcomes hearing (Seeing is believing).',
    bcp47Tag: 'ha-NG',
    provenanceBadge: 'Hausa Native Neural Audio',
    isProxy: false,
    tonalHarmonics: [329.63, 415.3, 493.88],
    durationSeconds: 2.35,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.63, 0.86, 0.58, 0.57, 0.56, 0.56, 0.59, 0.65, 0.68, 0.7, 0.61, 0.25, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.1, 0.56, 0.61, 0.47, 0.83, 1, 0.85, 0.16, 0.06, 0.55, 0.9, 0.93, 0.73, 0.62, 0.66, 0.7, 0.66, 0.65, 0.51, 0.28, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'San-', phonetic: '[sàn]', startFraction: 0.08, endFraction: 0.24, tone: 'Low' },
      { text: 'nu', phonetic: '[núː]', startFraction: 0.24, endFraction: 0.42, tone: 'High' },
      { text: 'I-na', phonetic: '[ì.náː]', startFraction: 0.48, endFraction: 0.68, tone: 'Rising' },
      { text: 'kwa-na?', phonetic: '[kwáː.nā]', startFraction: 0.68, endFraction: 0.92, tone: 'Falling' }
    ]
  },
  swahili: {
    id: 'swahili',
    audioClipId: 'mother-swahili',
    proverbAudioClipId: 'proverb-swahili',
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
    provenanceBadge: 'Kiswahili East Africa Neural',
    isProxy: false,
    tonalHarmonics: [349.23, 440, 523.25],
    durationSeconds: 3.43,
    waveformProfile: [0.06, 0.06, 0.06, 0.94, 0.29, 0.7, 0.95, 1, 0.96, 0.54, 0.34, 0.13, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.63, 0.55, 0.71, 0.81, 0.58, 0.77, 0.87, 0.72, 0.64, 0.16, 0.33, 0.58, 0.16, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Hu-', phonetic: '[hu]', startFraction: 0.06, endFraction: 0.16, tone: 'Mid' },
      { text: 'jambo', phonetic: '[dʒam.bo]', startFraction: 0.16, endFraction: 0.34, tone: 'High' },
      { text: 'Ha-ba-ri', phonetic: '[ha.ɓa.ri]', startFraction: 0.48, endFraction: 0.68, tone: 'Mid' },
      { text: 'ya-ko?', phonetic: '[ja.ko]', startFraction: 0.68, endFraction: 0.84, tone: 'Low' }
    ]
  },
  kabuverdianu: {
    id: 'kabuverdianu',
    audioClipId: 'mother-kabuverdianu',
    language: 'Kriolu (Kabuverdianu)',
    autonym: 'Kabuverdianu',
    family: 'Atlantic Creole (Niger-Congo substrate)',
    country: 'Cabo Verde',
    isoCode: 'kea',
    greetingText: 'Munti sabi! / Modi ki bu sta?',
    greetingPhonetic: '[mũ.ti sa.bi / mɔ.di ki bu sta]',
    greetingMeaning: 'Deep warmth and contentment! / How are you?',
    proverbText: 'Genti d’agu, sabura di mar.',
    proverbTranslation: 'People of the water, boundless savor of the Atlantic sea.',
    bcp47Tag: 'pt-CV',
    provenanceBadge: 'Kabuverdianu Lusophone Proxy',
    isProxy: true,
    proxyNote: 'Rendered with European Lusophone neural voice reading adapted Criolu phonetic orthography as closest non-palatalizing cognate.',
    tonalHarmonics: [261.63, 329.63, 392],
    durationSeconds: 4.27,
    waveformProfile: [0.06, 0.06, 0.48, 0.88, 1, 0.82, 0.36, 0.41, 0.23, 0.6, 0.4, 0.18, 0.31, 0.12, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.14, 0.82, 0.93, 0.83, 0.55, 0.59, 0.13, 0.43, 0.2, 0.31, 0.06, 0.43, 0.54, 0.43, 0.14, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Munti', phonetic: '[mũ.ti]', startFraction: 0.04, endFraction: 0.20, tone: 'Mid' },
      { text: 'sabi!', phonetic: '[sa.bi]', startFraction: 0.20, endFraction: 0.34, tone: 'High' },
      { text: 'Modi ki', phonetic: '[mɔ.di ki]', startFraction: 0.50, endFraction: 0.68, tone: 'High' },
      { text: 'bu sta?', phonetic: '[bu sta]', startFraction: 0.68, endFraction: 0.85, tone: 'Low' }
    ]
  },
  akan: {
    id: 'akan',
    audioClipId: 'mother-akan',
    proverbAudioClipId: 'proverb-akan',
    language: 'Akan (Twi / Fante)',
    autonym: 'Twi',
    family: 'Niger-Congo (Kwa)',
    country: 'Ghana / Côte d’Ivoire',
    isoCode: 'ak',
    greetingText: 'Akwaaba! / Wo ho te sɛn?',
    greetingPhonetic: '[a.kʷaː.ba / wʊ hʊ tɪ sɛn]',
    greetingMeaning: 'Welcome! / How is your body and health?',
    proverbText: 'Sankofa: Wɔnkyi sɛ w’akɔfa nea w’akyi akyi.',
    proverbTranslation: 'It is not forbidden to return and claim that which was forgotten.',
    bcp47Tag: 'ak-GH',
    provenanceBadge: 'Meta MMS-TTS (Akan/Twi VITS)',
    isProxy: false,
    tonalHarmonics: [440, 554.37, 659.25],
    durationSeconds: 1.87,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.13, 0.72, 0.18, 0.06, 0.57, 1, 0.77, 0.93, 0.28, 0.32, 0.58, 0.96, 0.81, 0.76, 0.54, 0.46, 0.31, 0.61, 0.51, 0.15, 0.06, 0.22, 0.24, 0.1, 0.06, 0.5, 0.65, 0.44, 0.46, 0.37, 0.24, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'A-', phonetic: '[a]', startFraction: 0.12, endFraction: 0.22, tone: 'Low' },
      { text: 'kwaa-ba!', phonetic: '[kʷaː.ba]', startFraction: 0.22, endFraction: 0.44, tone: 'High' },
      { text: 'Wo ho', phonetic: '[wʊ hʊ]', startFraction: 0.46, endFraction: 0.66, tone: 'Mid' },
      { text: 'te sɛn?', phonetic: '[tɪ sɛn]', startFraction: 0.66, endFraction: 0.84, tone: 'Rising' }
    ]
  },
  fon: {
    id: 'fon',
    audioClipId: 'mother-fon',
    proverbAudioClipId: 'proverb-fon',
    language: 'Fon (Fongbe)',
    autonym: 'Fɔngbe',
    family: 'Niger-Congo (Gbe)',
    country: 'Benin / Togo',
    isoCode: 'fon',
    greetingText: 'Kú dɔ / Mi kwabo!',
    greetingPhonetic: '[ku dɔ / mi kʷa.bɔ]',
    greetingMeaning: 'Peace and honor upon your labor / Welcome!',
    proverbText: 'Nǔ ɖé sín nu wɛ nyí gbɛ̀.',
    proverbTranslation: 'Everything on earth shares the same life breath.',
    bcp47Tag: 'fr-BJ',
    provenanceBadge: 'Meta MMS-TTS (Fongbe VITS)',
    isProxy: false,
    tonalHarmonics: [392, 493.88, 587.33],
    durationSeconds: 1.61,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.21, 0.4, 0.49, 0.31, 0.15, 0.63, 0.85, 0.83, 0.38, 0.48, 0.55, 0.38, 0.09, 0.06, 0.27, 0.86, 0.99, 1, 0.84, 0.59, 0.57, 0.65, 0.55, 0.26, 0.11, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Kú', phonetic: '[ku]', startFraction: 0.30, endFraction: 0.45, tone: 'High' },
      { text: 'dɔ', phonetic: '[dɔ]', startFraction: 0.45, endFraction: 0.60, tone: 'Low' },
      { text: 'Mi kwa-bo!', phonetic: '[mi kʷa.bɔ]', startFraction: 0.60, endFraction: 0.88, tone: 'High' }
    ]
  },
  zulu: {
    id: 'zulu',
    audioClipId: 'mother-zulu',
    proverbAudioClipId: 'proverb-zulu',
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
    provenanceBadge: 'isiZulu South Africa Neural',
    isProxy: false,
    tonalHarmonics: [293.66, 369.99, 440],
    durationSeconds: 1.92,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.64, 1, 0.89, 0.67, 0.27, 0.08, 0.78, 0.96, 0.82, 0.65, 0.49, 0.31, 0.22, 0.16, 0.08, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Sa-', phonetic: '[sa]', startFraction: 0.12, endFraction: 0.22, tone: 'Mid' },
      { text: 'wu-', phonetic: '[wu]', startFraction: 0.22, endFraction: 0.30, tone: 'Mid' },
      { text: 'bo-', phonetic: '[ɓoː]', startFraction: 0.30, endFraction: 0.40, tone: 'High' },
      { text: 'na!', phonetic: '[na]', startFraction: 0.40, endFraction: 0.52, tone: 'Low' }
    ]
  },
  amharic: {
    id: 'amharic',
    audioClipId: 'mother-amharic',
    proverbAudioClipId: 'proverb-amharic',
    language: 'Amharic',
    autonym: 'አማርኛ (Amarəñña)',
    family: 'Afroasiatic (Semitic)',
    country: 'Ethiopia',
    isoCode: 'am',
    greetingText: 'Selam! (ሰላም) / Tena Yistillign',
    greetingPhonetic: '[sə.lam / tʼe.na jəs.tʼəl.ləɲ]',
    greetingMeaning: 'Peace! / May the creator grant you health',
    proverbText: 'ድር ቢያብር አንበሳ ያስር።',
    proverbTranslation: 'When spider webs unite, they can tie up a lion.',
    bcp47Tag: 'am-ET',
    provenanceBadge: 'Amharic Ethiopia Neural',
    isProxy: false,
    tonalHarmonics: [329.63, 392, 493.88],
    durationSeconds: 3.24,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.93, 0.97, 0.9, 0.75, 0.49, 0.08, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.08, 0.64, 0.95, 1, 0.76, 0.43, 0.06, 0.07, 0.69, 0.8, 0.62, 0.26, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Se-lam!', phonetic: '[sə.lam]', startFraction: 0.08, endFraction: 0.24, tone: 'High' },
      { text: 'Te-na', phonetic: '[tʼe.na]', startFraction: 0.48, endFraction: 0.62, tone: 'Mid' },
      { text: 'Yis-til-lign', phonetic: '[jəs.tʼəl.ləɲ]', startFraction: 0.62, endFraction: 0.80, tone: 'Neutral' }
    ]
  },
  arabic_maghrebi: {
    id: 'arabic_maghrebi',
    audioClipId: 'mother-arabic_maghrebi',
    proverbAudioClipId: 'proverb-arabic_maghrebi',
    language: 'Maghrebi Arabic (Darija)',
    autonym: 'الدارجة المغربية',
    family: 'Afroasiatic (Semitic)',
    country: 'Morocco / Algeria / Tunisia',
    isoCode: 'ar',
    greetingText: 'Salam Aleikoum / Labas?',
    greetingPhonetic: '[sa.laːm ʕa.laj.kum / laː.bɑːs]',
    greetingMeaning: 'Peace be upon you / Are you well?',
    proverbText: 'اليد الواحدة ما كتصفقش.',
    proverbTranslation: 'A single hand cannot clap alone; community is vital.',
    bcp47Tag: 'ar-MA',
    provenanceBadge: 'Maghrebi Arabic Neural',
    isProxy: false,
    tonalHarmonics: [440, 523.25, 659.25],
    durationSeconds: 3.82,
    waveformProfile: [0.06, 0.06, 0.66, 0.26, 0.48, 0.66, 0.78, 0.85, 0.96, 1, 0.71, 0.65, 0.57, 0.06, 0.53, 0.57, 0.47, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.59, 0.86, 0.73, 0.48, 0.69, 0.5, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Sa-laam', phonetic: '[sa.laːm]', startFraction: 0.04, endFraction: 0.22, tone: 'High' },
      { text: 'A-lei-kum', phonetic: '[ʕa.laj.kum]', startFraction: 0.22, endFraction: 0.40, tone: 'Mid' },
      { text: 'La-bas?', phonetic: '[laː.bɑːs]', startFraction: 0.58, endFraction: 0.76, tone: 'Rising' }
    ]
  },
  tamazight: {
    id: 'tamazight',
    audioClipId: 'mother-tamazight',
    proverbAudioClipId: 'proverb-tamazight',
    language: 'Tamazight (Amazigh)',
    autonym: 'ⵜⴰⵎⴰⵣⵉⵖⵜ / Taqbaylit',
    family: 'Afroasiatic (Berber)',
    country: 'Algeria / Morocco / Tunisia / Libya',
    isoCode: 'kab',
    greetingText: 'Azul! Amek tettiliḍ?',
    greetingPhonetic: '[a.zul / a.mək tət.ti.liðˤ]',
    greetingMeaning: 'Warm greetings (near the heart) / How are you?',
    proverbText: 'Afus deg ufus, ad yifsus wugur.',
    proverbTranslation: 'Hand in hand, even the heaviest burden becomes light.',
    bcp47Tag: 'kab-DZ',
    provenanceBadge: 'Meta MMS-TTS (Tamazight / Kabyle VITS)',
    isProxy: false,
    tonalHarmonics: [349.23, 440, 523.25],
    durationSeconds: 1.92,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.2, 0.83, 0.7, 0.33, 0.57, 1, 0.92, 0.59, 0.8, 0.78, 0.85, 0.69, 0.24, 0.17, 0.1, 0.06, 0.06, 0.21, 0.63, 0.72, 0.55, 0.48, 0.61, 0.63, 0.52, 0.17, 0.09, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'A-zul!', phonetic: '[a.zul]', startFraction: 0.18, endFraction: 0.34, tone: 'High' },
      { text: 'A-mek', phonetic: '[a.mək]', startFraction: 0.34, endFraction: 0.52, tone: 'Mid' },
      { text: 'tet-ti-liḍ?', phonetic: '[tət.ti.liðˤ]', startFraction: 0.52, endFraction: 0.76, tone: 'Rising' }
    ]
  },
  wolof: {
    id: 'wolof',
    audioClipId: 'mother-wolof',
    proverbAudioClipId: 'proverb-wolof',
    language: 'Wolof',
    autonym: 'Làkk wi Wolof',
    family: 'Niger-Congo (Atlantic / Senegambian)',
    country: 'Senegal / The Gambia / Mauritania',
    isoCode: 'wo',
    greetingText: 'Nanga def? / Mangi fi rekk',
    greetingPhonetic: '[naŋ.ɡa dɛf / maŋ.ɡi fi rɛk]',
    greetingMeaning: 'How are you doing? / I am well right here (in peace)',
    proverbText: 'Nit, nit ay garabam.',
    proverbTranslation: 'A human being is another human being’s medicine and shelter.',
    bcp47Tag: 'wo-SN',
    provenanceBadge: 'Meta MMS-TTS (Wolof VITS)',
    isProxy: false,
    tonalHarmonics: [293.66, 369.99, 440],
    durationSeconds: 2.26,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.13, 0.41, 0.58, 0.89, 1, 0.63, 0.54, 0.52, 0.51, 0.97, 0.44, 0.19, 0.9, 0.53, 0.21, 0.46, 0.55, 0.84, 0.86, 0.62, 0.58, 0.31, 0.42, 0.26, 0.06, 0.47, 0.6, 0.75, 0.8, 0.23, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Nan-ga', phonetic: '[naŋ.ɡa]', startFraction: 0.12, endFraction: 0.28, tone: 'High' },
      { text: 'def?', phonetic: '[dɛf]', startFraction: 0.28, endFraction: 0.42, tone: 'Mid' },
      { text: 'Man-gi fi', phonetic: '[maŋ.ɡi fi]', startFraction: 0.42, endFraction: 0.64, tone: 'Neutral' },
      { text: 'rekk', phonetic: '[rɛk]', startFraction: 0.64, endFraction: 0.78, tone: 'Low' }
    ]
  },
  oromo: {
    id: 'oromo',
    audioClipId: 'mother-oromo',
    proverbAudioClipId: 'proverb-oromo',
    language: 'Afaan Oromoo',
    autonym: 'Afaan Oromoo',
    family: 'Afroasiatic (Cushitic)',
    country: 'Ethiopia / Kenya',
    isoCode: 'om',
    greetingText: 'Akkam jirta? / Nagaa!',
    greetingPhonetic: '[ak.kam dʒir.ta / na.ɡaː]',
    greetingMeaning: 'How are you? / Peace and harmony!',
    proverbText: 'Walii galan alaa galan.',
    proverbTranslation: 'When people come together in accord, they triumph afar and return safely.',
    bcp47Tag: 'om-ET',
    provenanceBadge: 'Meta MMS-TTS (Afaan Oromoo VITS)',
    isProxy: false,
    tonalHarmonics: [329.63, 415.3, 493.88],
    durationSeconds: 1.68,
    waveformProfile: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.33, 0.66, 0.58, 0.06, 0.06, 0.53, 1, 0.66, 0.35, 0.33, 0.22, 0.32, 0.61, 0.3, 0.12, 0.06, 0.67, 0.91, 0.43, 0.55, 0.79, 0.81, 0.4, 0.57, 0.85, 0.72, 0.51, 0.17, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Ak-kam', phonetic: '[ak.kam]', startFraction: 0.20, endFraction: 0.34, tone: 'High' },
      { text: 'jir-ta?', phonetic: '[dʒir.ta]', startFraction: 0.34, endFraction: 0.54, tone: 'Rising' },
      { text: 'Na-gaa!', phonetic: '[na.ɡaː]', startFraction: 0.54, endFraction: 0.80, tone: 'High' }
    ]
  },
  somali: {
    id: 'somali',
    audioClipId: 'mother-somali',
    proverbAudioClipId: 'proverb-somali',
    language: 'Af-Soomaali',
    autonym: 'Af-Soomaali',
    family: 'Afroasiatic (Cushitic)',
    country: 'Somalia / Djibouti / Ethiopia / Kenya',
    isoCode: 'so',
    greetingText: 'Iska warran? / Nabad!',
    greetingPhonetic: '[ɪs.ka war.ran / na.bad]',
    greetingMeaning: 'What is the news? / Peace be with you!',
    proverbText: 'Gacmo wadajir bay wax ku gooyaan.',
    proverbTranslation: 'Hands working together cut with shared strength.',
    bcp47Tag: 'so-SO',
    provenanceBadge: 'Somali Horn of Africa Neural',
    isProxy: false,
    tonalHarmonics: [349.23, 440, 523.25],
    durationSeconds: 3.26,
    waveformProfile: [0.06, 0.06, 0.06, 0.54, 0.09, 0.06, 0.71, 1, 0.91, 0.84, 0.6, 0.68, 0.33, 0.12, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.45, 0.74, 0.52, 0.89, 0.51, 0.06, 0.08, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Is-ka', phonetic: '[ɪs.ka]', startFraction: 0.06, endFraction: 0.18, tone: 'Mid' },
      { text: 'war-ran?', phonetic: '[war.ran]', startFraction: 0.18, endFraction: 0.32, tone: 'High' },
      { text: 'Na-bad!', phonetic: '[na.bad]', startFraction: 0.56, endFraction: 0.74, tone: 'Low' }
    ]
  },
  xhosa: {
    id: 'xhosa',
    audioClipId: 'mother-xhosa',
    language: 'isiXhosa',
    autonym: 'isiXhosa',
    family: 'Niger-Congo (Bantu / Nguni)',
    country: 'South Africa',
    isoCode: 'xh',
    greetingText: 'Molo! Kunjani?',
    greetingPhonetic: '[mɔː.lɔ / kun.dʒaː.ni]',
    greetingMeaning: 'Greetings! / How are you?',
    proverbText: 'Umntu ngumntu ngabantu.',
    proverbTranslation: 'A person is a person through fellow persons.',
    bcp47Tag: 'xh-ZA',
    provenanceBadge: 'Nguni Sister-Voice Proxy (isiZulu)',
    isProxy: true,
    proxyNote: 'Synthesized with isiZulu Nguni sister-language neural voice; shares dental, alveolar, and lateral click consonant phonology.',
    tonalHarmonics: [293.66, 369.99, 440],
    durationSeconds: 3.05,
    waveformProfile: [0.06, 0.06, 0.06, 0.33, 0.69, 0.77, 0.77, 0.67, 0.44, 0.1, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.78, 1, 0.67, 0.48, 0.76, 0.44, 0.3, 0.23, 0.16, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Mo-', phonetic: '[mɔː]', startFraction: 0.06, endFraction: 0.16, tone: 'High' },
      { text: 'lo!', phonetic: '[lɔ]', startFraction: 0.16, endFraction: 0.26, tone: 'Low' },
      { text: 'Kun-ja-ni?', phonetic: '[kun.dʒaː.ni]', startFraction: 0.50, endFraction: 0.75, tone: 'Falling' }
    ]
  },
  lingala: {
    id: 'lingala',
    audioClipId: 'mother-lingala',
    language: 'Lingála',
    autonym: 'Lingála',
    family: 'Niger-Congo (Bantu)',
    country: 'DR Congo / Republic of the Congo',
    isoCode: 'ln',
    greetingText: 'Mbote na yo! Sango nini?',
    greetingPhonetic: '[ᵐbó.te na jɔ / sáŋ.ɡo ní.ni]',
    greetingMeaning: 'Greetings to you! / What is new?',
    proverbText: 'Mosapi moko etombolaka libanga te.',
    proverbTranslation: 'A single finger cannot lift a stone.',
    bcp47Tag: 'ln-CD',
    provenanceBadge: 'Francophone Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Central African Francophone phonetic reading proxy used because open-weight Lingála VITS ONNX weights are unavailable.',
    tonalHarmonics: [349.23, 440, 523.25],
    durationSeconds: 3.98,
    waveformProfile: [0.06, 0.06, 0.34, 0.51, 1, 0.11, 0.61, 0.71, 0.69, 0.31, 0.37, 0.51, 0.1, 0.45, 0.1, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.46, 0.6, 0.59, 0.99, 0.86, 0.78, 0.82, 0.77, 0.08, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'Mbo-te', phonetic: '[ᵐbó.te]', startFraction: 0.04, endFraction: 0.20, tone: 'High' },
      { text: 'na yo!', phonetic: '[na jɔ]', startFraction: 0.20, endFraction: 0.34, tone: 'Low' },
      { text: 'San-go', phonetic: '[sáŋ.ɡo]', startFraction: 0.56, endFraction: 0.70, tone: 'High' },
      { text: 'ni-ni?', phonetic: '[ní.ni]', startFraction: 0.70, endFraction: 0.82, tone: 'Mid' }
    ]
  },
  fula: {
    id: 'fula',
    audioClipId: 'mother-fula',
    language: 'Fula (Fulfulde)',
    autonym: 'Fulfulde / Pulaar',
    family: 'Niger-Congo (Senegambian)',
    country: 'Guinea / Senegal / Nigeria / Cameroon',
    isoCode: 'ff',
    greetingText: 'A jaaraama! No mbadda?',
    greetingPhonetic: '[a dʒaː.raː.ma / no ᵐbad.da]',
    greetingMeaning: 'Warm thanks & welcome! / How are you?',
    proverbText: 'Neddo ko bandum.',
    proverbTranslation: 'A person exists through kinship and community.',
    bcp47Tag: 'ff-SN',
    provenanceBadge: 'Sahelian Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Sahelian Francophone phonetic proxy used because Pulaar/Fulfulde ONNX weights are unavailable in browser/Node inference.',
    tonalHarmonics: [392, 493.88, 587.33],
    durationSeconds: 3.55,
    waveformProfile: [0.06, 0.06, 0.36, 0.75, 0.26, 0.65, 1, 0.76, 0.41, 0.87, 0.66, 0.9, 0.28, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.32, 0.81, 0.92, 0.83, 0.64, 0.83, 0.7, 0.7, 0.94, 0.18, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'A jaa-raa-ma!', phonetic: '[a dʒaː.raː.ma]', startFraction: 0.04, endFraction: 0.28, tone: 'High' },
      { text: 'No', phonetic: '[no]', startFraction: 0.54, endFraction: 0.64, tone: 'Mid' },
      { text: 'mbad-da?', phonetic: '[ᵐbad.da]', startFraction: 0.64, endFraction: 0.78, tone: 'Rising' }
    ]
  },
  khoekhoegowab: {
    id: 'khoekhoegowab',
    audioClipId: 'mother-khoekhoegowab',
    language: 'Khoekhoegowab (Nama)',
    autonym: 'Khoekhoegowab',
    family: 'Khoe-Kwadi (Nama / Damara)',
    country: 'Namibia / South Africa / Botswana',
    isoCode: 'naq',
    greetingText: 'ǃGâi tsēs! Matisa?',
    greetingPhonetic: '[!kã́ĩ̀ t͡sèːs / ma.ti.sa]',
    greetingMeaning: 'Good day! / How are you?',
    proverbText: 'ǀAwo ǃnâs ge a ǂkhî.',
    proverbTranslation: 'Inner serenity brings harmony and peace.',
    bcp47Tag: 'naq-NA',
    provenanceBadge: 'Southern African Phonetic Proxy',
    isProxy: true,
    proxyNote: 'Southern African English phonetic approximation; orthographic click consonants (ǀ, ǁ, ǃ, ǂ) are described in IPA since open-weight neural click synthesis does not yet exist.',
    tonalHarmonics: [261.63, 329.63, 392],
    durationSeconds: 3.48,
    waveformProfile: [0.06, 0.06, 0.14, 0.9, 0.78, 0.44, 0.06, 0.07, 0.8, 0.62, 0.56, 0.16, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.23, 0.79, 1, 0.32, 0.28, 0.76, 0.33, 0.1, 0.57, 0.31, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
    syllables: [
      { text: 'ǃGâi', phonetic: '[!kã́ĩ̀]', startFraction: 0.05, endFraction: 0.16, tone: 'Falling' },
      { text: 'tsēs!', phonetic: '[t͡sèːs]', startFraction: 0.16, endFraction: 0.28, tone: 'Low' },
      { text: 'Ma-ti-sa?', phonetic: '[ma.ti.sa]', startFraction: 0.54, endFraction: 0.76, tone: 'Rising' }
    ]
  }
};

let sharedMotherTongueAudioCtx: AudioContext | null = null;

/**
 * Play an indigenous musical greeting soundscape using static African neural audio + harmonic Web Audio (with OS Web Speech fallback)
 */
export function playMotherTongueAudio(
  entry: MotherTongueEntry,
  options?: {
    skipSpeech?: boolean;
    rate?: number;
    startFraction?: number;
    onProgress?: (fraction: number, currentTime: number, duration: number) => void;
    onEnd?: () => void;
    onError?: () => void;
  }
) {
  if (typeof window === 'undefined') return;

  // 1. Play Static African Neural Audio Pack (or OS native Speech Synthesis) synchronously
  if (!options?.skipSpeech) {
    speakAcademicNarration({
      text: entry.greetingText,
      audioClipId: entry.audioClipId,
      langTag: entry.bcp47Tag,
      playChime: false,
      rate: options?.rate ?? 0.95,
      pitch: 1.05,
      startFraction: options?.startFraction,
      onProgress: options?.onProgress,
      onEnd: options?.onEnd,
      onError: options?.onError,
    });
  }

  // 2. Play complementary tonal harmonic resonance chord (Marimba / Kalimba style chime)
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedMotherTongueAudioCtx || sharedMotherTongueAudioCtx.state === 'closed') {
      sharedMotherTongueAudioCtx = new AudioContextClass();
    }
    const ctx = sharedMotherTongueAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    entry.tonalHarmonics.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

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
