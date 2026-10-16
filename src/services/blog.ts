import {
  type BlogPost,
  getDistinctBlogPosts as dedupe,
  toPosts,
} from './posts';

export type { Frontmatter } from './frontmatter';
export { parseFrontmatter } from './frontmatter';
export type { BlogPost } from './posts';
export { toPosts } from './posts';

// In Vite, we use query: '?raw' and import: 'default' for raw content
const blogFiles = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * lang is optional. Omit it to get every language, which is what the RSS feed
 * and the sitemap want before they collapse translations down to one entry.
 */
export const getBlogPosts = (lang?: string): BlogPost[] => {
  const posts = toPosts(blogFiles);
  return lang === undefined
    ? posts
    : posts.filter((post) => post.lang === lang);
};

export const getDistinctBlogPosts = (): BlogPost[] => dedupe(getBlogPosts());

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
