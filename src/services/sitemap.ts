import { escapeXml } from './xml';

const SITE_URL = 'https://sametcelikbicak.com';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const STATIC_PAGES: SitemapEntry[] = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/experience', changefreq: 'monthly', priority: '0.8' },
  { loc: '/education', changefreq: 'monthly', priority: '0.7' },
  { loc: '/skills', changefreq: 'monthly', priority: '0.7' },
  { loc: '/projects', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
];

export const toSitemapEntries = (
  posts: { slug: string; date: string }[]
): SitemapEntry[] =>
  posts.map((post) => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.6',
  }));

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

export const getSitemapEntries = (): SitemapEntry[] => [...STATIC_PAGES];
