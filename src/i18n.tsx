import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/translation.json';
import tr from '@/locales/tr/translation.json';

const FALLBACK_LANG = 'tr';
const STORAGE_KEY = 'language';
const SUPPORTED = ['tr', 'en'] as const;

/**
 * Without an explicit lng every reload fell back to Turkish, so a visitor who
 * switched to English lost it on refresh. Preference first, then the browser
 * language, then the fallback.
 */
const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return FALLBACK_LANG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED as readonly string[]).includes(stored))
      return stored;
  } catch {
    /* ignore */
  }
  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  return (SUPPORTED as readonly string[]).includes(browser)
    ? browser
    : FALLBACK_LANG;
};

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
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
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* private mode or storage disabled */
  }
};

syncDocumentLanguage(i18n.resolvedLanguage || FALLBACK_LANG);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
