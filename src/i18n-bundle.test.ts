import en from '@/locales/en/translation.json';

const flat = (obj: unknown, prefix = ''): [string, string][] => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    typeof v === 'object'
      ? flat(v, prefix ? `${prefix}.${k}` : k)
      : [[prefix ? `${prefix}.${k}` : k, String(v)]]
  );
};

describe('English translation bundle', () => {
  it('has no entry whose copy is identical to its key', () => {
    // A key that renders as itself is indistinguishable from an unregistered
    // bundle once tests start asserting on keys.
    expect(flat(en).filter(([key, value]) => key === value)).toEqual([]);
  });

  it('keeps every locale in step', () => {
    const tr = require('@/locales/tr/translation.json');
    const keysOf = (obj: unknown) =>
      flat(obj)
        .map(([k]) => k)
        .sort();
    expect(keysOf(tr)).toEqual(keysOf(en));
  });

  it('has no empty values', () => {
    expect(flat(en).filter(([, value]) => value.trim() === '')).toEqual([]);
  });
});
