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

describe('server-rendered lang attribute', () => {
  // The worker patches <html lang> from the cookie because i18n.tsx can only set
  // it on document, which does not exist during the edge render. Without the
  // patch an English visitor is served lang="tr" until hydration runs, and
  // crawlers and agents only ever see the wrong value.
  const template =
    '<html lang="tr"><head></head><body><div id="root">x</div></body></html>';
  const patch = (cookie: string | null) =>
    template.replace(
      '<html lang="tr">',
      `<html lang="${parseLanguageCookie(cookie)}">`
    );

  it('keeps Turkish when there is no preference', () => {
    expect(patch(null)).toContain('<html lang="tr">');
  });

  it('serves English when the visitor chose English', () => {
    expect(patch('lang=en')).toContain('<html lang="en">');
  });

  it('ignores an unsupported cookie', () => {
    expect(patch('lang=fr')).toContain('<html lang="tr">');
  });
});
