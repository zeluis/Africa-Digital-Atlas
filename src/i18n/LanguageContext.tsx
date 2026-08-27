import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageOption } from './types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from './translations';

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
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGE_OPTIONS.some(l => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // Ignore storage errors
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  // Synchronize document dir and lang attribute
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      root.classList.add('rtl-mode');
    } else {
      root.classList.remove('rtl-mode');
    }
  }, [language, isRTL]);

  const currentLanguageOption = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
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
