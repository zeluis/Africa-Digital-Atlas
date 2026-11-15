import type { SupportedLanguage, TranslationDictionary } from './types';
export { LANGUAGE_OPTIONS } from './languages';

const LOCALE_LOADERS: Record<SupportedLanguage, () => Promise<{ default: TranslationDictionary }>> = {
  en: () => import('./locales/en'),
  fr: () => import('./locales/fr'),
  de: () => import('./locales/de'),
  pt: () => import('./locales/pt'),
  es: () => import('./locales/es'),
  it: () => import('./locales/it'),
  nl: () => import('./locales/nl'),
  ar: () => import('./locales/ar'),
  am: () => import('./locales/am'),
  ha: () => import('./locales/ha'),
  ig: () => import('./locales/ig'),
  yo: () => import('./locales/yo'),
  wo: () => import('./locales/wo'),
  zu: () => import('./locales/zu'),
  xh: () => import('./locales/xh'),
};

export async function loadLocaleTranslations(lang: SupportedLanguage): Promise<TranslationDictionary> {
  const loader = LOCALE_LOADERS[lang] || LOCALE_LOADERS.en;
  const mod = await loader();
  return mod.default;
}
