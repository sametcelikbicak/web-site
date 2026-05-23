import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type Theme, ThemeContext } from '@/types/theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Always start with 'dark' so server and client produce matching HTML for hydration.
  // The stored preference is read after hydration in useEffect.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
};
