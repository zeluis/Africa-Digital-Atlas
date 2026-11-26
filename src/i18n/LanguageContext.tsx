import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageOption, TranslationDictionary } from './types';
import { LANGUAGE_OPTIONS } from './languages';
import EN_DICTIONARY from './locales/en';
import { initNativeTranslationEngine, syncNativeTranslation } from '../utils/nativeTranslationBridge';
import { readStorageString, writeStorageString } from '../utils/storageCache';

export { LANGUAGE_OPTIONS };

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'atlas_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = readStorageString(STORAGE_KEY);
    if (saved && LANGUAGE_OPTIONS.some(l => l.code === saved)) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  const [loadedTranslations, setLoadedTranslations] = useState<Partial<Record<SupportedLanguage, TranslationDictionary>>>({
    en: EN_DICTIONARY,
  });

  const isRTL = language === 'ar';

  // Defer Google Translate bridge injection until a non-English language is active or selected
  useEffect(() => {
    if (language !== 'en') {
      initNativeTranslationEngine();
    }
  }, [language]);

  // Dynamically load only the active non-English locale dictionary chunk on demand
  useEffect(() => {
    if (language !== 'en' && !loadedTranslations[language]) {
      let cancelled = false;
      import('./translations')
        .then(m => m.loadLocaleTranslations(language))
        .then(dict => {
          if (!cancelled) {
            setLoadedTranslations(prev => ({ ...prev, [language]: dict }));
          }
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
  }, [language, loadedTranslations]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    writeStorageString(STORAGE_KEY, lang);
    if (lang !== 'en') {
      initNativeTranslationEngine();
    }
    syncNativeTranslation(lang);
  };

  // Synchronize document dir, lang attribute, and native translation bridge on state changes
  useEffect(() => {
    syncNativeTranslation(language);
  }, [language]);

  const currentLanguageOption = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];

  const t = (key: string, fallback?: string): string => {
    if (language !== 'en') {
      const langDict = loadedTranslations[language];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
    }
    if (EN_DICTIONARY[key]) {
      return EN_DICTIONARY[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        currentLanguageOption,
        availableLanguages: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
