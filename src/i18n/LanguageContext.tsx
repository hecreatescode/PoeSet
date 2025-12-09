import React, { useState, useEffect } from 'react';
import { translations, type Language } from './translations';
import { LanguageContext } from './languageContextInternal';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('poeset_language');
    if (saved === 'pl' || saved === 'en') return saved;
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('pl') ? 'pl' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('poeset_language', lang);
  };

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
