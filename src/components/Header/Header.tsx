import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ENIcon from '@/components/ENIcon/ENIcon';
import MoonIcon from '@/components/MoonIcon/MoonIcon';
import SunIcon from '@/components/SunIcon/SunIcon';
import TRIcon from '@/components/TRIcon/TRIcon';
import useAnalytics from '@/hooks/useAnalytics';
import { useTheme } from '@/hooks/useTheme';
import './Header.css';

interface NavItem {
  to: string;
  labelKey: string;
  analyticsKey: string;
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/about', labelKey: 'header.about', analyticsKey: 'About' },
  {
    to: '/experience',
    labelKey: 'header.experience',
    analyticsKey: 'Experience',
  },
  { to: '/education', labelKey: 'education.title', analyticsKey: 'Education' },
  { to: '/skills', labelKey: 'skills.title', analyticsKey: 'Skills' },
  { to: '/projects', labelKey: 'header.projects', analyticsKey: 'Projects' },
  { to: '/blog', labelKey: 'header.blog', analyticsKey: 'Blog' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackButtonClick } = useAnalytics();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  const isActive = (to: string) =>
    !to.startsWith('http') && location.pathname === to;

  return (
    <header className="site-header">
      <div className="header-inner page-container">
        {/* Logo */}
        <button
          type="button"
          className="header-logo"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Go to home"
        >
          <img
            src="/sc.webp"
            alt="SC Logo"
            width={36}
            height={36}
            onError={(e) => {
              e.currentTarget.src = '/sc.png';
            }}
          />
          <span className="header-name">{t('header.name')}</span>
        </button>

        {/* Desktop Nav */}
        <nav className="header-nav hidden md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.labelKey}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
                onClick={() => trackButtonClick(item.analyticsKey)}
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <Link
                key={item.labelKey}
                to={item.to}
                className={`nav-link${isActive(item.to) ? ' nav-link--active' : ''}`}
                onClick={() => trackButtonClick(item.analyticsKey)}
              >
                {t(item.labelKey)}
                {isActive(item.to) && <span className="nav-active-dot" />}
              </Link>
            )
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions hidden md:flex">
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => {
              toggleTheme();
              trackButtonClick('theme-toggle');
            }}
          >
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle language"
            onClick={() => {
              toggleLanguage();
              trackButtonClick('language-toggle');
            }}
          >
            {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="hamburger-btn md:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="mobile-backdrop md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`mobile-drawer md:hidden${menuOpen ? ' mobile-drawer--open' : ''}`}
      >
        <div className="mobile-drawer-header">
          <span className="header-name">{t('header.name')}</span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mobile-nav">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.labelKey}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-link"
                onClick={() => {
                  setMenuOpen(false);
                  trackButtonClick(item.analyticsKey);
                }}
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <Link
                key={item.labelKey}
                to={item.to}
                className={`mobile-nav-link${isActive(item.to) ? ' mobile-nav-link--active' : ''}`}
                onClick={() => {
                  setMenuOpen(false);
                  trackButtonClick(item.analyticsKey);
                }}
              >
                {t(item.labelKey)}
              </Link>
            )
          )}
        </nav>
        <div className="mobile-drawer-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle language"
            onClick={() => {
              toggleLanguage();
              setMenuOpen(false);
              trackButtonClick('language-toggle');
            }}
            style={{ fontSize: '1.5rem' }}
          >
            {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
              trackButtonClick('theme-toggle');
            }}
            style={{ fontSize: '1.25rem' }}
          >
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
