import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-solid border-gray-200 dark:border-b-[#243647] px-6">
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
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-8">
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
          aria-label="Select language"
          onClick={() => setShowDropdown((prev) => !prev)}
          style={{ fontSize: '1.5rem' }}
        >
          {i18n.language === 'tr' ? '🇹🇷' : '🇬🇧'}
        </button>
        {showDropdown && (
          <div className="absolute right-0 w-28 header-bg border border-gray-200 rounded shadow-lg z-10 flex flex-col top-14">
            <button
              onClick={() => {
                changeLanguage('tr');
                setShowDropdown(false);
              }}
              className={`p-2 flex items-center gap-2 lang-hover ${i18n.language === 'tr' ? 'font-bold' : ''}`}
              aria-label="Türkçe"
            >
              🇹🇷 <span>Türkçe</span>
            </button>
            <button
              onClick={() => {
                changeLanguage('en');
                setShowDropdown(false);
              }}
              className={`p-2 flex items-center gap-2 lang-hover ${i18n.language === 'en' ? 'font-bold' : ''}`}
              aria-label="English"
            >
              🇬🇧 <span>English</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
