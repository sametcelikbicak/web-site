/**
 * @jest-environment node
 */
import { render } from '@/entry-server';

jest.mock('@/components/Header/Header', () => () => null);
jest.mock('@/components/Footer/Footer', () => () => null);
jest.mock('@/components/BackToTop/BackToTop', () => () => null);
jest.mock('@/pages/HomePage', () => () => null);
jest.mock('@/pages/AboutPage', () => () => null);
jest.mock('@/pages/ExperiencePage', () => () => null);
jest.mock('@/pages/EducationPage', () => () => null);
jest.mock('@/pages/SkillsPage', () => () => null);
jest.mock('@/pages/ProjectsPage', () => () => null);
jest.mock('@/pages/BlogPage', () => () => null);
jest.mock('@/pages/BlogPostPage', () => () => null);
jest.mock('@/i18n', () => {});

describe('entry-server render', () => {
  it('returns a string for root path', () => {
    const result = render('https://example.com/');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns a string for a sub-path', () => {
    const result = render('https://example.com/about');
    expect(typeof result).toBe('string');
  });
});
