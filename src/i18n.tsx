import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/translation.json';
import tr from '@/locales/tr/translation.json';

const FALLBACK_LANG = 'tr';
const COOKIE_NAME = 'lang';
const SUPPORTED = ['tr', 'en'] as const;

const isSupported = (value: string | undefined | null): value is string =>
  SUPPORTED.includes(value as (typeof SUPPORTED)[number]);

export const parseLanguageCookie = (cookieHeader: string | null): string => {
  const raw = (cookieHeader || '')
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === COOKIE_NAME)?.[1]
    ?.replace(/^"|"$/g, '');

  return isSupported(raw) ? raw : FALLBACK_LANG;
};

/**
 * A cookie, not localStorage. The edge render happens on a machine that cannot
 * see localStorage, so any client-only preference makes the server emit one
 * language and the client another — React then throws a hydration mismatch and
 * throws the whole tree away. localStorage and navigator.language both caused
 * exactly that; the cookie is the only storage both sides read, so both resolve
 * to the same value or both fall back.
 */
const getInitialLanguage = (): string =>
  typeof document === 'undefined'
    ? FALLBACK_LANG
    : parseLanguageCookie(document.cookie);

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
  // Constrain the value before it reaches document.cookie: whatever i18next
  // reports, only the two languages this bundle actually ships get written.
  const safe = isSupported(lng) ? lng : FALLBACK_LANG;
  try {
    const secure =
      typeof location !== 'undefined' && location.protocol === 'https:'
        ? '; secure'
        : '';
    // biome-ignore lint/suspicious/noDocumentCookie: value constrained to SUPPORTED; a cookie is the only storage the edge and the browser both read
    document.cookie = `${COOKIE_NAME}=${safe}; path=/; max-age=31536000; samesite=lax${secure}`;
  } catch {
    /* cookies disabled */
  }
};

syncDocumentLanguage(i18n.resolvedLanguage || FALLBACK_LANG);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
