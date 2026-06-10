import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import AboutPage from '@/pages/AboutPage';

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
});

beforeEach(() => {
  i18next.addResource(
    'en',
    'translation',
    'about.description',
    'Line 1\n\nLine 3'
  );
  i18next.addResource('en', 'translation', 'about.title', 'About Me');
  i18next.addResource('en', 'translation', 'about.subtitle', 'My Story');
});

describe('AboutPage', () => {
  it('renders title and subtitle with translations', () => {
    render(<AboutPage />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('My Story')).toBeInTheDocument();
  });

  it('renders non-empty description paragraphs', () => {
    render(<AboutPage />);
    const paragraphs = document.querySelectorAll('.about-paragraph');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].textContent).toBe('Line 1');
    expect(paragraphs[1].textContent).toBe('Line 3');
  });

  it('skips empty lines in description', () => {
    const initialSpy = jest.spyOn(console, 'error').mockImplementation();
    render(<AboutPage />);
    const paragraphs = document.querySelectorAll('.about-paragraph');
    paragraphs.forEach((p) => {
      expect(p.textContent?.trim()).not.toBe('');
    });
    initialSpy.mockRestore();
  });
});
