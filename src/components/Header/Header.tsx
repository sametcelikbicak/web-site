import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ENIcon from '@/components/ENIcon/ENIcon';
import MoonIcon from '@/components/MoonIcon/MoonIcon';
import SunIcon from '@/components/SunIcon/SunIcon';
import TRIcon from '@/components/TRIcon/TRIcon';
import { useTheme } from '@/hooks/useTheme';
import './Header.css';

interface NavItem {
  to: string;
  labelKey: string;
  analyticsKey: string;
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
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // While the drawer is open it covers the page, so Escape must close it, focus
  // must stay inside it, and it must hand focus back to the button that opened
  // it. Without these, tabbing walks into the page behind the overlay.
  useEffect(() => {
    if (!menuOpen) return;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

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
          aria-label={t('header.name')}
        >
          <img
            src="/sc.webp"
            alt=""
            width={36}
            height={36}
            onError={(e) => {
              e.currentTarget.src = '/sc.png';
            }}
          />
          <span className="header-name">{t('header.name')}</span>
        </button>

        {/* Desktop Nav */}
        <nav
          className="header-nav hidden md:flex"
          aria-label={t('header.mainNav')}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.labelKey}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`nav-link${isActive(item.to) ? ' nav-link--active' : ''}`}
              onClick={() => {}}
            >
              {t(item.labelKey)}
              {isActive(item.to) && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions hidden md:flex">
          <button
            type="button"
            className="icon-btn"
            aria-label={t('header.toggleTheme')}
            onClick={() => {
              toggleTheme();
            }}
          >
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={t('header.toggleLanguage')}
            onClick={() => {
              toggleLanguage();
            }}
          >
            {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          ref={hamburgerRef}
          className="hamburger-btn md:hidden"
          aria-label={t('header.openMenu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
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
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('header.menu')}
        className={`mobile-drawer md:hidden${menuOpen ? ' mobile-drawer--open' : ''}`}
      >
        <div className="mobile-drawer-header">
          <span className="header-name">{t('header.name')}</span>
          <button
            type="button"
            className="icon-btn"
            aria-label={t('header.closeMenu')}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mobile-nav" aria-label={t('header.mobileNav')}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.labelKey}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`mobile-nav-link${isActive(item.to) ? ' mobile-nav-link--active' : ''}`}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="mobile-drawer-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={t('header.toggleLanguage')}
            onClick={() => {
              toggleLanguage();
              setMenuOpen(false);
            }}
            style={{ fontSize: '1.5rem' }}
          >
            {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={t('header.toggleTheme')}
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
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
