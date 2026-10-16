import { parseLanguageCookie } from '@/i18n';

describe('parseLanguageCookie', () => {
  it('reads the language cookie', () => {
    expect(parseLanguageCookie('lang=en')).toBe('en');
  });

  it('finds it among other cookies', () => {
    expect(parseLanguageCookie('a=1; lang=en; b=2')).toBe('en');
  });

  it('handles quoted and spaced values', () => {
    expect(parseLanguageCookie('  lang="tr" ')).toBe('tr');
  });

  it('falls back to Turkish when absent, empty or unsupported', () => {
    expect(parseLanguageCookie(null)).toBe('tr');
    expect(parseLanguageCookie('')).toBe('tr');
    expect(parseLanguageCookie('other=1')).toBe('tr');
    expect(parseLanguageCookie('lang=de')).toBe('tr');
  });
});
