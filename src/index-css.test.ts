import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const css = readFileSync(join(SRC, 'index.css'), 'utf8');

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });

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

describe('custom property references', () => {
  const defined = new Set(
    [...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1])
  );

  const files = cssFiles(SRC).filter((file) => !file.endsWith('index.css'));

  it('finds stylesheets to check', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('never references an undefined custom property', () => {
    // --radius-2xl was used by five stylesheets with a hard-coded 1.5rem
    // fallback and was never declared anywhere.
    const undefinedRefs = files.flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/var\((--[a-z0-9-]+)\)/g)]
        .map((m) => m[1])
        .filter((name) => !defined.has(name))
        .map((name) => `${file.slice(SRC.length)} -> ${name}`)
    );
    expect([...new Set(undefinedRefs)]).toEqual([]);
  });
});

describe('blog code block contrast', () => {
  const postCss = readFileSync(join(SRC, 'pages/BlogPostPage.css'), 'utf8');
  const vendor = readFileSync(
    join(process.cwd(), 'node_modules/highlight.js/styles/github-dark.css'),
    'utf8'
  );

  const luminance = (hex: string) => {
    const pairs = hex.slice(1).match(/../g) ?? [];
    const parts = pairs.map((pair) => {
      const value = Number.parseInt(pair, 16) / 255;
      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
  };

  const ratio = (a: string, b: string) => {
    const [x, y] = [luminance(a), luminance(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };

  it('renders code blocks on a surface the vendor palette passes on', () => {
    const background: string | undefined = postCss.match(
      /post-content pre\s*\{[^}]*background:\s*(#[0-9a-f]{6})/i
    )?.[1];
    expect(background).toBe('#0d1117');

    const body = vendor.slice(vendor.indexOf('.hljs {'));
    const tokens = new Set(
      [...body.matchAll(/(?:^|[;{])\s*color:\s*(#[0-9a-f]{6})/gim)].map((m) =>
        m[1].toLowerCase()
      )
    );
    // Overridden locally because the vendor value sits at 4.08:1.
    tokens.delete('#1f6feb');
    tokens.add('#388bfd');

    const measured: [string, number][] = [...tokens].map((token) => [
      token,
      ratio(token, background as string),
    ]);
    const failing = measured
      .filter(([, value]) => value < 4.5)
      .map(([token, value]) => `${token} ${value.toFixed(2)}:1`);

    expect(failing).toEqual([]);
  });
});
