import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8');

const block = (selector: string): string => {
  const start = css.indexOf(selector);
  expect(start).toBeGreaterThan(-1);
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n}', open);
  return css.slice(open, close);
};

const tokens = (selector: string) =>
  new Set(
    [...block(selector).matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1])
  );

// Fonts, radii, spacing and transitions are theme-independent and live only in
// :root. Only colour tokens have to exist in both themes.
const colors = (selector: string) =>
  new Set(
    [...tokens(selector)].filter((token) => token.startsWith('--color-'))
  );

const LIGHT = '[data-theme="light"]';
const DARK = ':root';

describe('theme tokens', () => {
  const light = colors(LIGHT);
  const dark = colors(DARK);

  it('defines both theme blocks', () => {
    expect(light.size).toBeGreaterThan(5);
    expect(dark.size).toBeGreaterThan(5);
    expect(light.size).toBeGreaterThan(5);
  });

  it('defines every dark colour token in the light theme too', () => {
    // --color-tertiary existed only in the dark block, so inline code in a blog
    // post fell back to an inherited colour at 1.43:1 in light mode.
    const missing = [...dark].filter((token) => !light.has(token));
    expect(missing).toEqual([]);
  });

  it('gives the tertiary token a different value per theme', () => {
    const value = (selector: string) =>
      block(selector)
        .match(/--color-tertiary:\s*([^;]+);/)?.[1]
        .trim();
    expect(value(LIGHT)).toBeDefined();
    expect(value(DARK)).toBeDefined();
    expect(value(LIGHT)).not.toBe(value(DARK));
  });
});

describe('reduced motion', () => {
  it('ships a prefers-reduced-motion block', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    const at = css.indexOf('@media (prefers-reduced-motion: reduce)');
    const body = css.slice(at);
    expect(body).toContain('scroll-behavior: auto');
    expect(body).toContain('animation-iteration-count: 1');
  });
});
