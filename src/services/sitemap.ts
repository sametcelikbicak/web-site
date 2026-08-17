import { parseFrontmatter } from './blog';

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

const blogFiles = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const loadBlogEntries = (): SitemapEntry[] => {
  const entriesBySlug = new Map<string, SitemapEntry>();

  for (const path of Object.keys(blogFiles)) {
    const rawContent = blogFiles[path];
    const { data } = parseFrontmatter(rawContent);

    const filename = path.split('/').pop() || '';
    const fileLang = filename.split('.').reverse()[1] || 'tr';
    const slug =
      (data.slug as string) ||
      filename.replace(`.${fileLang}.md`, '').replace('.md', '');
    const date = (data.date as string) || '';

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

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const buildSitemapXml = (entries: SitemapEntry[]): string => {
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

export const getSitemapXml = (): string =>
  buildSitemapXml([...STATIC_PAGES, ...loadBlogEntries()]);
