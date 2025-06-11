import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { es } from './locales/es';
import { hi } from './locales/hi';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
      hi,
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // Añadimos configuración específica para idiomas RTL/LTR
    supportedLngs: ['en', 'es', 'hi'],
    load: 'languageOnly',
  });

export default i18n;