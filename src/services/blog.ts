export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags?: string[];
  lang: string;
  image?: string;
}

// In Vite, we use query: '?raw' and import: 'default' for raw content
const blogFiles = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Lightweight frontmatter parser for the browser
 */
export const parseFrontmatter = (fileContent: string) => {
  const parts = fileContent.split('---');

  // A valid markdown with frontmatter should have at least 3 parts when split by ---
  // (empty or whitespace before first ---, the frontmatter, and the content)
  if (parts.length >= 3 && fileContent.trim().startsWith('---')) {
    const yamlBlock = parts[1];
    const content = parts.slice(2).join('---').trim();
    return { data: parseYaml(yamlBlock), content };
  }

  return { data: {}, content: fileContent };
};

const parseYaml = (yamlBlock: string) => {
  const data: Record<string, string | string[]> = {};
  const lines = yamlBlock.split(/[\r\n]+/);

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Handle tags array: [React, CSS]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
      } else {
        data[key] = value;
      }
    }
  }
  return data;
};

/**
 * lang is optional. Omit it to get every language, which is what the RSS feed
 * and the sitemap want before they collapse translations down to one entry.
 */
export const getBlogPosts = (lang?: string): BlogPost[] => {
  return Object.keys(blogFiles)
    .map((path) => {
      const rawContent = blogFiles[path];
      const { data, content: body } = parseFrontmatter(rawContent);

      // Determine language from filename suffix (e.g., .en.md) or frontmatter
      const filename = path.split('/').pop() || '';
      const fileLang = filename.split('.').reverse()[1] || 'tr'; // Default to 'tr' if no suffix
      const postLang = data.lang || fileLang;

      return {
        slug:
          (data.slug as string) ||
          filename.replace(`.${postLang}.md`, '').replace('.md', ''),
        title: (data.title as string) || 'Untitled',
        date: (data.date as string) || '',
        description: (data.description as string) || '',
        content: body,
        tags: data.tags as string[],
        lang: postLang as string,
        image: data.image as string,
      };
    })
    .filter((post) => lang === undefined || post.lang === lang)
    .filter((post) => post.date && post.date.trim() !== '')
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime() -
        new Date(a.date as string).getTime()
    );
};

/**
 * One entry per slug, newest translation wins. Feeds and the sitemap must not
 * emit the same /blog/<slug> twice when a post exists in several languages.
 */
export const getDistinctBlogPosts = (): BlogPost[] => {
  const newestBySlug = new Map<string, BlogPost>();
  for (const post of getBlogPosts()) {
    if (!newestBySlug.has(post.slug)) newestBySlug.set(post.slug, post);
  }
  return [...newestBySlug.values()];
};

export const getBlogPostBySlug = (
  slug: string,
  lang: string = 'tr'
): BlogPost | undefined => {
  const posts = getBlogPosts(lang);
  const normalizedSlug = slug.toLowerCase().trim();
  return posts.find(
    (post) => post.slug.toLowerCase().trim() === normalizedSlug
  );
};
