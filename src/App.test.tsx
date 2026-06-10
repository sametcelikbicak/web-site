import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import { ThemeContext } from '@/types/theme';

jest.mock('@/components/Header/Header', () => () => (
  <div data-testid="header" />
));
jest.mock('@/components/Footer/Footer', () => () => (
  <div data-testid="footer" />
));
jest.mock('@/components/BackToTop/BackToTop', () => () => (
  <div data-testid="back-to-top" />
));
jest.mock('@/pages/HomePage', () => () => <div data-testid="home-page" />);
jest.mock('@/pages/AboutPage', () => () => <div data-testid="about-page" />);
jest.mock('@/pages/ExperiencePage', () => () => (
  <div data-testid="experience-page" />
));
jest.mock('@/pages/EducationPage', () => () => (
  <div data-testid="education-page" />
));
jest.mock('@/pages/SkillsPage', () => () => <div data-testid="skills-page" />);
jest.mock('@/pages/ProjectsPage', () => () => (
  <div data-testid="projects-page" />
));
jest.mock('@/pages/BlogPage', () => () => <div data-testid="blog-page" />);
jest.mock('@/pages/BlogPostPage', () => () => (
  <div data-testid="blog-post-page" />
));

beforeAll(() => {
  class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  jest.spyOn(window, 'scrollTo').mockImplementation();
});

describe('App', () => {
  const renderApp = (route: string) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <ThemeContext value={{ theme: 'light', toggleTheme: jest.fn() }}>
          <App />
        </ThemeContext>
      </MemoryRouter>
    );

  it('renders header, footer, and back-to-top', () => {
    renderApp('/');
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('renders home page by default', async () => {
    renderApp('/');
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  it('renders about page for /about', async () => {
    renderApp('/about');
    expect(await screen.findByTestId('about-page')).toBeInTheDocument();
  });

  it('renders experience page for /experience', async () => {
    renderApp('/experience');
    expect(await screen.findByTestId('experience-page')).toBeInTheDocument();
  });

  it('renders education page for /education', async () => {
    renderApp('/education');
    expect(await screen.findByTestId('education-page')).toBeInTheDocument();
  });

  it('renders skills page for /skills', async () => {
    renderApp('/skills');
    expect(await screen.findByTestId('skills-page')).toBeInTheDocument();
  });

  it('renders projects page for /projects', async () => {
    renderApp('/projects');
    expect(await screen.findByTestId('projects-page')).toBeInTheDocument();
  });

  it('renders blog page for /blog', async () => {
    renderApp('/blog');
    expect(await screen.findByTestId('blog-page')).toBeInTheDocument();
  });

  it('renders blog post page for /blog/:slug', async () => {
    renderApp('/blog/test-post');
    expect(await screen.findByTestId('blog-post-page')).toBeInTheDocument();
  });
});
