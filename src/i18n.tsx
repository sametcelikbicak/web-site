import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/translation.json';
import tr from '@/locales/tr/translation.json';

const FALLBACK_LANG = 'tr';

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  fallbackLng: FALLBACK_LANG,
  interpolation: {
    escapeValue: false,
  },
});

// index.html ships lang="en" because the markup is generated in English, but the
// app falls back to Turkish, so a screen reader would announce the whole page in
// the wrong language. Keep the attribute in step with whatever i18next resolves.
const syncDocumentLanguage = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};

syncDocumentLanguage(i18n.resolvedLanguage || FALLBACK_LANG);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
