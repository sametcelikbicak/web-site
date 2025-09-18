import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import HamburgerMenu from './HamburgerMenu';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  }

  return (
    <header
      className="flex items-center justify-between whitespace-nowrap border-solid px-6 py-2 sticky top-0 z-50 bg-white dark:bg-[var(--header-bg)]"
      style={{ borderBottom: '1px solid var(--header-border)' }}
    >
      <div
        className="flex items-center gap-3 text-text-primary cursor-pointer"
        onClick={() => window.history.pushState({}, '', '/')}
      >
        <div className="w-10 h-10">
          <img src="./sc.png" alt="Logo" />
        </div>
        <h2 className="text-text-primary text-xl font-bold leading-tight">
          {t('header.name')}
        </h2>
      </div>
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4">
        <nav className="flex items-center gap-8">
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#about"
          >
            {t('header.about')}
          </a>
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#experience"
          >
            {t('header.experience')}
          </a>
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#projects"
          >
            {t('header.projects')}
          </a>
        </nav>
        <button
          className="cursor-pointer"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          style={{ fontSize: '1.5rem' }}
        >
          {theme === 'light' ? '🌞' : '🌙'}
        </button>
        <button
          className="cursor-pointer"
          aria-label="Toggle language"
          onClick={toggleLanguage}
          style={{ fontSize: '1.5rem' }}
        >
          {i18n.language === 'tr' ? '🇹🇷' : '🇺🇸'}
        </button>
      </div>
      {/* Mobile hamburger menu */}
      <div className="md:hidden flex items-center">
        <button
          className="cursor-pointer"
          aria-label="Open menu"
          style={{ fontSize: '2rem', background: 'none', border: 'none' }}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
          <nav className="flex flex-col gap-6 mt-6">
            <a
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              href="#about"
              onClick={() => setMenuOpen(false)}
            >
              {t('header.about')}
            </a>
            <a
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              href="#experience"
              onClick={() => setMenuOpen(false)}
            >
              {t('header.experience')}
            </a>
            <a
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              href="#projects"
              onClick={() => setMenuOpen(false)}
            >
              {t('header.projects')}
            </a>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { toggleLanguage(); setMenuOpen(false); }}
                className="p-2 flex items-center gap-2 lang-hover"
                aria-label="Toggle language"
                style={{ fontSize: '1.5rem' }}
              >
                {i18n.language === 'tr' ? '🇹🇷' : '🇺🇸'}
              </button>
              <button
                className="cursor-pointer ml-4"
                aria-label="Toggle theme"
                onClick={() => { toggleTheme(); setMenuOpen(false); }}
                style={{ fontSize: '1.5rem' }}
              >
                {theme === 'light' ? '🌞' : '🌙'}
              </button>
            </div>
          </nav>
        </HamburgerMenu>
      </div>
    </header>
  );
}

export default Header;
