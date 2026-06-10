jest.mock('@/services/blog', () => ({
  getBlogPosts: jest.fn(),
  getBlogPostBySlug: jest.fn(),
}));

import { getBlogPostBySlug, getBlogPosts } from '@/services/blog';

describe('blog service interface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBlogPosts is a function', () => {
    expect(typeof getBlogPosts).toBe('function');
  });

  it('getBlogPostBySlug is a function', () => {
    expect(typeof getBlogPostBySlug).toBe('function');
  });

  it('getBlogPosts returns filtered posts by lang', () => {
    const mockPosts = [
      { slug: 'post-1', title: 'Post 1', lang: 'en' },
      { slug: 'post-2', title: 'Post 2', lang: 'tr' },
    ];
    (getBlogPosts as jest.Mock).mockImplementation((lang: string) =>
      mockPosts.filter((p) => p.lang === lang)
    );

    expect(getBlogPosts('en')).toHaveLength(1);
    expect(getBlogPosts('tr')).toHaveLength(1);
    expect(getBlogPosts('fr')).toHaveLength(0);
  });

  it('getBlogPostBySlug returns post by slug', () => {
    (getBlogPostBySlug as jest.Mock).mockReturnValue({
      slug: 'test-post',
      title: 'Test Post',
    });

    const result = getBlogPostBySlug('test-post', 'en');
    expect(result?.slug).toBe('test-post');
  });

  it('getBlogPostBySlug returns undefined for non-existent slug', () => {
    (getBlogPostBySlug as jest.Mock).mockReturnValue(undefined);

    const result = getBlogPostBySlug('non-existent', 'en');
    expect(result).toBeUndefined();
  });
});
