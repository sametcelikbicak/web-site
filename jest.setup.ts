import '@testing-library/jest-dom';

// Polyfill TextEncoder and TextDecoder for react-router-dom in Jest
import { TextDecoder, TextEncoder } from 'node:util';

declare global {
  interface Global {
    TextEncoder: typeof TextEncoder;
    TextDecoder: typeof TextDecoder;
  }
}

if (typeof global.TextEncoder === 'undefined') {
  (global as unknown as Global).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as unknown as Global).TextDecoder = TextDecoder;
}

// i18next is initialised with the real English bundle, not empty resources.
// With empty resources t() returns the key, which let components ship
// hard-coded English labels while the tests still passed — the tests were
// asserting against key fallbacks rather than the copy users actually see.
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './src/locales/en/translation.json';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});
