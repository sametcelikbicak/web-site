import { parseFrontmatter } from './frontmatter';

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

/**
 * Pure assembly of posts from a file map. services/blog.ts opens with
 * import.meta.glob, which Jest cannot transform, so anything living next to it
 * was untestable. The glob is the only Vite-specific part of this logic.
 */
export const toPosts = (files: Record<string, string>): BlogPost[] =>
  Object.keys(files)
    .map((path) => {
      const { data, content: body } = parseFrontmatter(files[path]);

      // Language comes from the filename suffix (.en.md) or frontmatter, defaulting to tr
      const filename = path.split('/').pop() || '';
      const fileLang = filename.split('.').reverse()[1] || 'tr';
      const postLang = (data.lang as string) || fileLang;

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
    .filter((post) => post.date && post.date.trim() !== '')
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime() -
        new Date(a.date as string).getTime()
    );

/**
 * One entry per slug, newest translation wins. The feed and the sitemap must not
 * emit the same /blog/<slug> twice when a post exists in several languages.
 */
export const getDistinctBlogPosts = (posts: BlogPost[]): BlogPost[] => {
  const newestBySlug = new Map<string, BlogPost>();
  for (const post of posts) {
    if (!newestBySlug.has(post.slug)) newestBySlug.set(post.slug, post);
  }
  return [...newestBySlug.values()];
};
