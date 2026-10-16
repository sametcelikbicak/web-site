import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type Theme, ThemeContext } from '@/types/theme';

// localStorage throws on access in Safari private mode and when cookies are
// blocked, not just on write. Both directions are guarded here so no caller
// has to remember to.
const readStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const writeStoredTheme = (theme: Theme) => {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* ignore */
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = (): Theme => {
    if (typeof document === 'undefined') return 'dark';
    const stored = readStoredTheme();
    if (stored) return stored;
    const el = document.documentElement;
    const attr = el.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    if (window.matchMedia('(prefers-color-scheme: light)').matches)
      return 'light';
    return 'dark';
  };
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeStoredTheme(theme);
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
