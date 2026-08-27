export type SupportedLanguage = 
  | 'en' // English
  | 'fr' // French
  | 'de' // German
  | 'pt' // Portuguese (Portugal)
  | 'am' // Amharic
  | 'ha' // Hausa
  | 'ig' // Igbo
  | 'wo' // Wolof
  | 'xh' // Xhosa
  | 'yo' // Yoruba
  | 'zu' // Zulu
  | 'ar'; // Arabic

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  flagEmoji: string;
  isRTL?: boolean;
}

export interface TranslationDictionary {
  [key: string]: string;
}
