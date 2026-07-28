import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

interface BlogFrontmatter {
  title?: string;
  date?: string;
  slug?: string;
  description?: string;
  tags?: string[];
  lang?: string;
  image?: string;
}

interface ParsedPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  lang: string;
  link: string;
}

const SITE_URL = 'https://sametcelikbicak.com';
const SITE_TITLE = 'Samet ÇELİKBIÇAK';
const SITE_DESCRIPTION =
  'Principal Software Specialist blog posts on Angular, TypeScript, JavaScript, and modern web development.';

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
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');

const buildRss = (posts: ParsedPost[]): string => {
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

export function rssFeedPlugin(): Plugin {
  return {
    name: 'rss-feed',
    enforce: 'post',

    closeBundle() {
      const blogDir = path.resolve(__dirname, 'src/content/blog');
      const outDir = path.resolve(__dirname, 'dist');
      const outFile = path.join(outDir, 'rss.xml');

      if (!existsSync(blogDir)) return;
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

      const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

      const posts: ParsedPost[] = files
        .map((file) => {
          const raw = readFileSync(path.join(blogDir, file), 'utf-8');
          const { data } = parseFrontmatter(raw);

          const filename = file;
          const fileLang =
            data.lang || filename.split('.').reverse()[1] || 'tr';

          const slug =
            data.slug ||
            filename.replace(`.${fileLang}.md`, '').replace('.md', '');

          return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || '',
            description: data.description || '',
            lang: fileLang,
            link: `/blog/${slug}`,
          };
        })
        .filter((post) => post.date.trim() !== '')
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      const rss = buildRss(posts);
      writeFileSync(outFile, rss, 'utf-8');
    },
  };
}
