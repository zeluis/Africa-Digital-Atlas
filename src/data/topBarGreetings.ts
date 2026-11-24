export const AFRIATA_SPEECH_STOP_EVENT = 'afriata-speech-stop';

export interface TopBarUiGreeting {
  phrase: string;
  langTag: string;
  languageName: string;
  audioClipId?: string;
}

/**
 * High-Intelligibility UI Language Greetings for the App Top Bar.
 * Kept separate from afriataVoiceEngine.ts so Navbar/VoiceWelcomeFab
 * do not pull the full speech synthesis engine into the initial entry chunk.
 */
export const TOP_BAR_UI_GREETINGS: Record<string, TopBarUiGreeting> = {
  'en': {
    phrase: 'Welcome to the Afriata experience, the Atlantic Ethnic Explorer. Please enjoy.',
    audioClipId: 'ui-greeting-en',
    langTag: 'en-NG',
    languageName: 'English (Sovereign Voice)'
  },
  'fr': {
    phrase: 'Bienvenue dans l\'expérience Afriata, l\'explorateur ethnique de l\'Atlantique. Bonne découverte.',
    audioClipId: 'ui-greeting-fr',
    langTag: 'fr-FR',
    languageName: 'Français'
  },
  'pt': {
    phrase: 'Olá, bem-vindo à experiência Afriata, o Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    audioClipId: 'ui-greeting-pt',
    langTag: 'pt-PT',
    languageName: 'Português (Portugal)'
  },
  'es': {
    phrase: 'Hola, bienvenido a la experiencia Afriata, el Explorador Étnico del Atlántico. Disfrute de su exploración.',
    audioClipId: 'ui-greeting-es',
    langTag: 'es-ES',
    languageName: 'Español'
  },
  'it': {
    phrase: 'Ciao e benvenuto nell\'esperienza Afriata, l\'Esploratore Etnico dell\'Atlantico. Buona scoperta.',
    audioClipId: 'ui-greeting-it',
    langTag: 'it-IT',
    languageName: 'Italiano'
  },
  'nl': {
    phrase: 'Hallo, welkom bij de Afriata-ervaring, de Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    audioClipId: 'ui-greeting-nl',
    langTag: 'nl-NL',
    languageName: 'Nederlands'
  },
  'de': {
    phrase: 'Willkommen zum Afriata-Erlebnis, der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    audioClipId: 'ui-greeting-de',
    langTag: 'de-DE',
    languageName: 'Deutsch'
  },
  'ar': {
    phrase: 'مرحباً بكم في تجربة أفرياتا، مستكشف التنوع الإفريقي والأطلسي.',
    audioClipId: 'ui-greeting-ar',
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
