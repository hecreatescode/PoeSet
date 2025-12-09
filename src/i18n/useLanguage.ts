import { useContext } from 'react';
import { translations, type Language } from './translations';

// Import the context directly
import { LanguageContext } from './languageContextInternal';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
