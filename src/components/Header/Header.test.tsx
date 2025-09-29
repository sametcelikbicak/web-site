import { render } from '@testing-library/react';
import Header from './Header';
import { ThemeContext, ThemeContextProps } from '../../types/theme';
import { MemoryRouter } from 'react-router-dom';

const mockThemeContext: ThemeContextProps = {
  theme: 'light',
  toggleTheme: jest.fn(),
};

beforeAll(() => {
  class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    constructor() {}
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
