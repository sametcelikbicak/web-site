import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';
import HamburgerMenu from './HamburgerMenu';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  return (
    <header
      className="flex items-center justify-between whitespace-nowrap border-solid px-6 py-2 sticky top-0 z-50 bg-white dark:bg-[var(--header-bg)]"
      style={{ borderBottom: '1px solid var(--header-border)' }}
    >
      <div
        className="flex items-center gap-3 text-text-primary cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10">
          <img src="/sc.png" alt="Logo" />
        </div>
        <h2 className="text-text-primary text-xl font-bold leading-tight">
          {t('header.name')}
        </h2>
      </div>
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4">
        <nav className="flex items-center gap-8">
          <Link
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            to="/#about"
            reloadDocument={false}
          >
            {t('header.about')}
          </Link>
          <Link
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            to="/#experience"
            reloadDocument={false}
          >
            {t('header.experience')}
          </Link>
          <Link
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            to="/#projects"
            reloadDocument={false}
          >
            {t('header.projects')}
          </Link>
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="https://sametcelikbicak.hashnode.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
        </nav>
        <button
          className="cursor-pointer text-text-secondary hover:text-[var(--primary-color)]"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
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
            <Link
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              to="/#about"
              onClick={() => setMenuOpen(false)}
              reloadDocument={false}
            >
              {t('header.about')}
            </Link>
            <Link
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              to="/#experience"
              onClick={() => setMenuOpen(false)}
              reloadDocument={false}
            >
              {t('header.experience')}
            </Link>
            <Link
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              to="/#projects"
              onClick={() => setMenuOpen(false)}
              reloadDocument={false}
            >
              {t('header.projects')}
            </Link>
            <a
              className="text-text-secondary hover:text-[var(--primary-color)] text-lg font-medium leading-normal transition-colors"
              href="https://sametcelikbicak.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </a>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMenuOpen(false);
                }}
                className="p-2 flex items-center gap-2 lang-hover"
                aria-label="Toggle language"
                style={{ fontSize: '1.5rem' }}
              >
                {i18n.language === 'tr' ? '🇹🇷' : '🇺🇸'}
              </button>
              <button
                className="cursor-pointer ml-4"
                aria-label="Toggle theme"
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                style={{ fontSize: '1.5rem' }}
              >
                {theme === 'light' ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </nav>
        </HamburgerMenu>
      </div>
    </header>
  );
}

export default Header;
