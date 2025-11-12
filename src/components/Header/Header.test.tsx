import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { ThemeContext, type ThemeContextProps } from '@/types/theme';

const mockThemeContext: ThemeContextProps = {
  theme: 'light',
  toggleTheme: jest.fn(),
};

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
  global.IntersectionObserver = MockIntersectionObserver;
});

describe('Header', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ThemeContext value={mockThemeContext}>
          <Header />
        </ThemeContext>
      </MemoryRouter>
    );
  });
});
