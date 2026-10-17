import postIndex from '@/generated/post-index.json';

/**
 * Metadata-only view of the blog for the browser.
 *
 * `services/blog` globs every .md file eagerly because the Worker needs the full
 * text for RSS and the sitemap. Importing it from a listing page pulled all
 * 268 KB of markdown into the entry chunk — verified at 247 KB with all 29
 * frontmatter blocks present. These pages only ever render metadata, so they
 * read the generated index instead: 11 KB for the same 28 posts.
 *
 * BlogPostPage still uses `services/blog` — it needs the body, and it is already
 * a lazy chunk.
 */
export type PostSummary = {
  slug: string;
  date: string;
  title: string;
  description: string;
  tags: string[] | null;
  lang: string;
  image: string | null;
};

export const getPostSummaries = (lang?: string): PostSummary[] => {
  const posts = postIndex as PostSummary[];
  return lang === undefined
    ? posts
    : posts.filter((post) => post.lang === lang);
};
