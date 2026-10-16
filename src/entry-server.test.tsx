/**
 * @jest-environment node
 */
import { render } from '@/entry-server';
import i18n from '@/i18n';

// Only the chrome is stubbed. The pages stay real so this test fails if the
// renderer ever stops awaiting React.lazy again — which is exactly what happened:
// renderToString returned the Suspense fallback, and the resulting empty HTML
// was served and edge-cached for a day.
jest.mock('@/components/Header/Header', () => () => null);
jest.mock('@/components/Footer/Footer', () => () => null);
jest.mock('@/components/BackToTop/BackToTop', () => () => null);

// These two reach import.meta.glob through services/blog, which Jest cannot
// transform. They are lazy targets, so the other routes still prove the point.
jest.mock('@/pages/BlogPage', () => () => null);
jest.mock('@/pages/BlogPostPage', () => () => null);

// RecentPosts pulls services/blog into the home route's dependency graph, and
// blog.ts is built on import.meta.glob, which Jest cannot transform. Without
// this the whole HomePage chunk throws and the route falls back to its skeleton.
jest.mock('@/services/blog', () => ({
  getBlogPosts: () => [],
  getDistinctBlogPosts: () => [],
  getBlogPostBySlug: () => undefined,
}));

// Each route's own markup must appear somewhere in the response. Where React
// places it depends on whether the chunk resolved before the stream flushed —
// inline when it did, in a hidden chunk when it did not — so assert on the
// content, not on the position.
const ROUTES: [string, string][] = [
  ['/', 'home-page'],
  ['/about', 'about-page'],
  ['/experience', 'experience-page'],
  ['/education', 'education-page'],
  ['/skills', 'skills-page'],
  ['/projects', 'projects-page'],
];

describe('entry-server render', () => {
  it('renders real page markup for every route, never a bare fallback', async () => {
    for (const [route, marker] of ROUTES) {
      const html = await render(`https://example.com${route}`);
      expect(html).toContain('<main');
      expect(html).toContain(marker);
    }
  });

  it('renders the skills page with its full content', async () => {
    const html = await render('https://example.com/skills');
    expect(html).toContain('skill-card');
    expect(html.length).toBeGreaterThan(10000);
  });

  it('returns identical markup for repeated renders of the same route', async () => {
    const [first, second] = await Promise.all([
      render('https://example.com/skills'),
      render('https://example.com/skills'),
    ]);
    expect(first.length).toBe(second.length);
  });
});

describe('language agreement', () => {
  afterEach(() => i18n.changeLanguage('tr'));

  // The hydration failure this guards against: the edge cannot read localStorage,
  // so any client-only language preference made the server emit Turkish while the
  // client rendered another language, and React discarded the whole tree.
  it('renders the language the visitor chose, not the fallback', async () => {
    const html = await render('https://example.com/', 'lang=en');
    expect(i18n.language).toBe('en');
    expect(html).not.toContain('Ana Sayfa');
  });

  it('falls back to Turkish when the visitor has no preference', async () => {
    await render('https://example.com/', null);
    expect(i18n.language).toBe('tr');
  });

  it('ignores an unsupported cookie rather than trusting it', async () => {
    await render('https://example.com/', 'lang=de');
    expect(i18n.language).toBe('tr');
  });
});
