import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';
import { ThemeContext, Theme } from '../types/theme';
import { ReactNode, useMemo } from 'react';

const mockToggleTheme = jest.fn();

const MockProvider = ({
  theme = 'light',
  children,
}: {
  theme?: Theme;
  children: ReactNode;
}) => {
  const contextValue = useMemo(
    () => ({ theme, toggleTheme: mockToggleTheme }),
    [theme]
  );
  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
};

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the default theme as light', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <MockProvider theme="light">{children}</MockProvider>
      ),
    });
    expect(result.current.theme).toBe('light');
  });

  it('should return the theme from provider if set to dark', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <MockProvider theme="dark">{children}</MockProvider>
      ),
    });
    expect(result.current.theme).toBe('dark');
  });

  it('should call toggleTheme when toggled', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <MockProvider theme="light">{children}</MockProvider>
      ),
    });
    act(() => {
      result.current.toggleTheme();
    });
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('throws error if used outside provider', () => {
    // Suppress error output for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider'
    );
    spy.mockRestore();
  });
});
