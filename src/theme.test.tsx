import '@testing-library/jest-dom';
import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/theme';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

const renderWithProvider = (ui: ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('ThemeProvider', () => {
  it('renders children', () => {
    renderWithProvider(<div data-testid="child" />);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('sets data-theme attribute on mount', () => {
    renderWithProvider(null);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reads theme from localStorage if available', () => {
    localStorage.setItem('theme', 'light');
    renderWithProvider(null);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('uses system preference when no stored theme', () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })) as unknown as (query: string) => MediaQueryList;
    localStorage.removeItem('theme');
    renderWithProvider(null);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('stores theme in localStorage when it changes', () => {
    renderWithProvider(null);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('provides toggleTheme that switches the theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.theme).toBe('dark');
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });
});
