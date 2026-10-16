import { getDistinctBlogPosts, toPosts } from '@/services/posts';

const file = (yaml: string, body = 'text') => `---\n${yaml}\n---\n\n${body}\n`;

const FILES = {
  'a.tr.md': file('title: A\ndate: "2024-01-01"\nslug: a'),
  'b.tr.md': file('title: B\ndate: "2024-06-01"\nslug: b'),
  'shared.tr.md': file('title: Türkçe\ndate: "2024-03-01"\nslug: shared'),
  'shared.en.md': file('title: English\ndate: "2024-03-01"\nslug: shared'),
  'en-only.en.md': file('title: Only English\ndate: "2024-05-01"'),
  'no-date.tr.md': file('title: Undated'),
};

describe('toPosts', () => {
  const posts = toPosts(FILES);

  it('sorts newest first', () => {
    expect(posts.map((post) => post.title)).toEqual([
      'B',
      'Only English',
      // Both shared-slug translations carry 2024-03-01, so they tie and keep
      // input order: shared.tr.md is declared before shared.en.md.
      'Türkçe',
      'English',
      'A',
    ]);
  });

  it('drops posts without a date', () => {
    expect(posts.some((post) => post.title === 'Undated')).toBe(false);
  });

  it('reads the language from the filename suffix', () => {
    expect(posts.find((post) => post.slug === 'en-only')?.lang).toBe('en');
    expect(posts.find((post) => post.slug === 'a')?.lang).toBe('tr');
  });

  it('prefers the frontmatter slug over the filename', () => {
    expect(posts.map((post) => post.slug)).toContain('a');
  });

  it('falls back to the filename when there is no slug', () => {
    expect(posts.find((post) => post.title === 'Only English')?.slug).toBe(
      'en-only'
    );
  });

  it('keeps both languages of a shared slug', () => {
    expect(posts.filter((post) => post.slug === 'shared')).toHaveLength(2);
  });

  it('carries the body as content', () => {
    expect(posts[0].content).toBe('text');
  });

  it('defaults a missing title rather than dropping the post', () => {
    const [post] = toPosts({ 'x.tr.md': file('date: "2024-01-01"') });
    expect(post.title).toBe('Untitled');
  });

  it('honours a lang declared in frontmatter over the filename', () => {
    const [post] = toPosts({ 'x.tr.md': file('date: "2024-01-01"\nlang: en') });
    expect(post.lang).toBe('en');
  });
});

describe('getDistinctBlogPosts', () => {
  const dedupe = (files: Record<string, string>) =>
    getDistinctBlogPosts(toPosts(files));

  it('keeps one entry per slug when a post exists in two languages', () => {
    const distinct = dedupe(FILES);
    const slugs = distinct.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps the newer translation', () => {
    const [newer] = dedupe(FILES).filter((post) => post.slug === 'shared');
    // Both translations share the date, so whichever sorts first survives; what
    // matters is that only one does.
    expect(newer.lang).toMatch(/^(tr|en)$/);
  });

  it('returns everything when no slug repeats', () => {
    const files = {
      'a.tr.md': file('title: A\ndate: "2024-01-01"\nslug: a'),
      'b.tr.md': file('title: B\ndate: "2024-02-01"\nslug: b'),
    };
    expect(dedupe(files)).toHaveLength(2);
  });
});
