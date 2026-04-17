import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ── Translation Files
import en from './locales/en.json';
import fa from './locales/fa.json';
import ps from './locales/ps.json';

// ── RTL Languages
export const RTL_LANGUAGES = ['fa', 'ps'];

// ── Direction Helper
export const getDirection = (lang) =>
  RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';

// ── i18n Init
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fa: { translation: fa },
      ps: { translation: ps },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'hisabbook-language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'translation',
    debug: false,
  });

export default i18n;
