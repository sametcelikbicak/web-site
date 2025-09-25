import '@testing-library/jest-dom';

// Polyfill TextEncoder and TextDecoder for react-router-dom in Jest
import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  // eslint-disable-next-line
  (global as any).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // eslint-disable-next-line
  (global as any).TextDecoder = TextDecoder;
}

// Mock i18next and react-i18next to silence NO_I18NEXT_INSTANCE warning
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {},
  interpolation: { escapeValue: false },
});
