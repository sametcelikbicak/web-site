import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { ThemeContext, type ThemeContextProps } from '@/types/theme';

const mockToggleTheme = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderHeader = (
  theme: 'light' | 'dark' = 'light',
  initialEntries = ['/']
) => {
  const mockThemeContext: ThemeContextProps = {
    theme,
    toggleTheme: mockToggleTheme,
  };
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeContext value={mockThemeContext}>
        <Header />
      </ThemeContext>
    </MemoryRouter>
  );
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
  jest.spyOn(window, 'scrollTo').mockImplementation();
});

beforeEach(() => {
  mockToggleTheme.mockClear();
  mockNavigate.mockClear();
});

describe('Header', () => {
  it('renders without crashing', () => {
    renderHeader();
  });

  describe('logo button', () => {
    it('navigates to home and scrolls to top when clicked', () => {
      renderHeader();
      fireEvent.click(screen.getByLabelText('Go to home'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('desktop theme toggle', () => {
    it('calls toggleTheme on click', () => {
      const { container } = renderHeader();
      const headerActions = container.querySelector(
        '.header-actions'
      ) as HTMLElement;
      fireEvent.click(within(headerActions).getByLabelText('Toggle theme'));
      expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('renders MoonIcon when theme is dark', () => {
      const { container } = renderHeader('dark');
      const headerActions = container.querySelector(
        '.header-actions'
      ) as HTMLElement;
      expect(within(headerActions).getByTitle('Dark mode')).toBeTruthy();
    });
  });

  describe('desktop language toggle', () => {
    it('toggles language on click', () => {
      const { container } = renderHeader();
      const headerActions = container.querySelector(
        '.header-actions'
      ) as HTMLElement;
      fireEvent.click(within(headerActions).getByLabelText('Toggle language'));
    });
  });

  describe('desktop navigation', () => {
    it('highlights active nav link', () => {
      const { container } = renderHeader('light', ['/about']);
      const nav = container.querySelector('.header-nav') as HTMLElement;
      const aboutLink = within(nav).getByText('header.about').closest('a');
      expect(aboutLink?.className).toContain('nav-link--active');
    });
  });

  describe('mobile menu', () => {
    it('opens and closes the mobile drawer', () => {
      const { container } = renderHeader();
      expect(container.querySelector('.mobile-backdrop')).toBeNull();

      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(container.querySelector('.mobile-backdrop')).toBeTruthy();

      fireEvent.click(screen.getByLabelText('Close menu'));
      expect(container.querySelector('.mobile-backdrop')).toBeNull();
    });

    it('closes drawer when backdrop is clicked', () => {
      const { container } = renderHeader();
      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(container.querySelector('.mobile-backdrop')).toBeTruthy();

      fireEvent.click(
        container.querySelector('.mobile-backdrop') as HTMLElement
      );
      expect(container.querySelector('.mobile-backdrop')).toBeNull();
    });

    it('closes drawer on mobile nav link click', () => {
      const { container } = renderHeader();
      fireEvent.click(screen.getByLabelText('Open menu'));

      const mobileNav = container.querySelector('.mobile-nav') as HTMLElement;
      fireEvent.click(within(mobileNav).getByText('header.about'));
      expect(container.querySelector('.mobile-backdrop')).toBeNull();
    });

    it('toggles language from mobile drawer', () => {
      const { container } = renderHeader();
      fireEvent.click(screen.getByLabelText('Open menu'));

      const drawerActions = container.querySelector(
        '.mobile-drawer-actions'
      ) as HTMLElement;
      fireEvent.click(within(drawerActions).getByLabelText('Toggle language'));
      expect(container.querySelector('.mobile-backdrop')).toBeNull();
    });

    it('toggles theme from mobile drawer', () => {
      const { container } = renderHeader();
      fireEvent.click(screen.getByLabelText('Open menu'));

      const drawerActions = container.querySelector(
        '.mobile-drawer-actions'
      ) as HTMLElement;
      fireEvent.click(within(drawerActions).getByLabelText('Toggle theme'));
      expect(mockToggleTheme).toHaveBeenCalled();
      expect(container.querySelector('.mobile-backdrop')).toBeNull();
    });
  });

  describe('image fallback', () => {
    it('shows fallback image on error', () => {
      renderHeader();
      const img = screen.getByAltText('SC Logo');
      fireEvent.error(img);
      expect(img.getAttribute('src')).toBe('/sc.png');
    });
  });
});
