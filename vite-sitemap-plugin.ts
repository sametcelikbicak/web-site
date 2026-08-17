import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

interface BlogFrontmatter {
  title?: string;
  date?: string;
  slug?: string;
  description?: string;
  tags?: string[];
  lang?: string;
  image?: string;
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const SITE_URL = 'https://sametcelikbicak.com';

const STATIC_PAGES: SitemapEntry[] = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/experience', changefreq: 'monthly', priority: '0.8' },
  { loc: '/education', changefreq: 'monthly', priority: '0.7' },
  { loc: '/skills', changefreq: 'monthly', priority: '0.7' },
  { loc: '/projects', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
];

const parseFrontmatter = (
  fileContent: string
): { data: BlogFrontmatter; content: string } => {
  const parts = fileContent.split('---');
  if (parts.length >= 3 && fileContent.trim().startsWith('---')) {
    const yamlBlock = parts[1];
    const content = parts.slice(2).join('---').trim();
    return { data: parseYaml(yamlBlock), content };
  }
  return { data: {}, content: fileContent };
};

const parseYaml = (yamlBlock: string): BlogFrontmatter => {
  const data: BlogFrontmatter = {};
  const lines = yamlBlock.split(/[\r\n]+/);

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      (data as Record<string, unknown>)[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
    } else {
      (data as Record<string, unknown>)[key] = value;
    }
  }
  return data;
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildSitemap = (entries: SitemapEntry[]): string => {
  const urls = entries
    .map((entry) => {
      const loc = `${SITE_URL}${entry.loc}`;
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : '';
      return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

const loadEntries = (): SitemapEntry[] => {
  const root = process.cwd();
  const blogDir = path.resolve(root, 'src/content/blog');

  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  const entriesBySlug = new Map<string, SitemapEntry>();

  for (const file of files) {
    const raw = readFileSync(path.join(blogDir, file), 'utf-8');
    const { data } = parseFrontmatter(raw);

    const fileLang = data.lang || file.split('.').reverse()[1] || 'tr';
    const slug =
      data.slug || file.replace(`.${fileLang}.md`, '').replace('.md', '');
    const date = data.date || '';

    if (!date.trim()) continue;

    const existing = entriesBySlug.get(slug);
    if (
      !existing ||
      new Date(date).getTime() > new Date(existing.lastmod || 0).getTime()
    ) {
      entriesBySlug.set(slug, {
        loc: `/blog/${slug}`,
        lastmod: date,
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  }

  return [...entriesBySlug.values()].sort(
    (a, b) =>
      new Date(b.lastmod || 0).getTime() - new Date(a.lastmod || 0).getTime()
  );
};

export function sitemapPlugin(): Plugin {
  let config: ResolvedConfig;
  let written = false;

  return {
    name: 'sitemap',
    enforce: 'post',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    closeBundle() {
      if (written) return;

      try {
        const entries = [...STATIC_PAGES, ...loadEntries()];
        if (entries.length === 0) {
          console.warn(
            '[sitemap] No entries found, skipping sitemap generation'
          );
          return;
        }

        const sitemap = buildSitemap(entries);
        const root = config.root || process.cwd();
        const outFile = path.resolve(root, 'dist', 'sitemap.xml');

        const dir = path.dirname(outFile);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }

        writeFileSync(outFile, sitemap, 'utf-8');
        written = true;
      } catch (err) {
        console.error('[sitemap] Failed to generate sitemap:', err);
      }
    },
  };
}
