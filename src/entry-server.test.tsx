/**
 * @jest-environment node
 */
import { render } from '@/entry-server';

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
jest.mock('@/i18n', () => {});

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
