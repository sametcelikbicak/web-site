import { escapeXml } from './xml';

const SITE_URL = 'https://sametcelikbicak.com';
const SITE_TITLE = 'Samet ÇELİKBIÇAK';
const SITE_DESCRIPTION =
  'Principal Software Specialist blog posts on Angular, TypeScript, JavaScript, and modern web development.';

export interface FeedPost {
  title: string;
  date: string;
  description: string;
  link: string;
}

export const buildRssXml = (posts: FeedPost[]): string => {
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
