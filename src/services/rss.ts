import { parseFrontmatter } from './blog';

interface RssPost {
  title: string;
  date: string;
  description: string;
  link: string;
}

const SITE_URL = 'https://sametcelikbicak.com';
const SITE_TITLE = 'Samet ÇELİKBIÇAK';
const SITE_DESCRIPTION =
  'Principal Software Specialist blog posts on Angular, TypeScript, JavaScript, and modern web development.';

const blogFiles = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const loadRssPosts = (): RssPost[] =>
  Object.keys(blogFiles)
    .map((path) => {
      const rawContent = blogFiles[path];
      const { data } = parseFrontmatter(rawContent);

      const filename = path.split('/').pop() || '';
      const fileLang = filename.split('.').reverse()[1] || 'tr';
      const slug =
        (data.slug as string) ||
        filename.replace(`.${fileLang}.md`, '').replace('.md', '');

      return {
        title: (data.title as string) || 'Untitled',
        date: (data.date as string) || '',
        description: (data.description as string) || '',
        link: `/blog/${slug}`,
      };
    })
    .filter((post) => post.date.trim() !== '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const buildRssXml = (posts: RssPost[]): string => {
  const lastBuildDate = new Date().toUTCString();
  const items = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const link = `${SITE_URL}${post.link}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
};

export const getRssXml = (): string => buildRssXml(loadRssPosts());
