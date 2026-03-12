import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ENIcon from '@/components/ENIcon/ENIcon';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import MoonIcon from '@/components/MoonIcon/MoonIcon';
import SunIcon from '@/components/SunIcon/SunIcon';
import TRIcon from '@/components/TRIcon/TRIcon';
import useAnalytics from '@/hooks/useAnalytics';
import { useTheme } from '@/hooks/useTheme';

const HEADER_ITEMS = [
  { to: '/#about', labelKey: 'header.about', analyticsKey: 'About' },
  {
    to: '/#experience',
    labelKey: 'header.experience',
    analyticsKey: 'Experience',
  },
  {
    to: '/#education',
    labelKey: 'education.title',
    analyticsKey: 'Education',
  },
  { to: '/#skills', labelKey: 'skills', analyticsKey: 'Skills' },
  { to: '/#projects', labelKey: 'header.projects', analyticsKey: 'Projects' },
  {
    to: 'https://sametcelikbicak.hashnode.dev/',
    labelKey: 'Blog',
    external: true,
    analyticsKey: 'Blog',
  },
];

const sectionIds = ['about', 'experience', 'education', 'skills', 'projects'];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Use a threshold relative to viewport height for better mobile/desktop support
      const threshold = Math.max(80, window.innerHeight * 0.18);
      let closestSection = null;
      let minDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - threshold <= 0) {
            const distance = Math.abs(rect.top - threshold);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = id;
            }
          }
        }
      }
      if (closestSection) {
        setActiveSection(closestSection);
      } else {
        setActiveSection(sectionIds[0]);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };
  const { trackButtonClick } = useAnalytics();

  return (
    <header
      className="flex items-center justify-between whitespace-nowrap border-solid px-6 py-2 sticky top-0 z-50 bg-white dark:bg-(--background-color)"
      style={{ borderBottom: '1px solid var(--header-border)' }}
    >
      <button
        type="button"
        className="flex items-center gap-3 text-text-primary cursor-pointer"
        onClick={() => navigate('/')}
        aria-label="Go to home"
      >
        <div className="w-10 h-10">
          <img src="/sc.png" alt="Logo" />
        </div>
        <h2 className="text-text-primary text-xl font-bold leading-tight">
          {t('header.name')}
        </h2>
      </button>
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4">
        <nav className="flex items-center gap-8">
          {HEADER_ITEMS.map((item) => {
            const section = item.to.startsWith('/#')
              ? item.to.replace('/#', '')
              : null;
            const isActive = section && activeSection === section;
            const baseClass =
              'text-base font-medium leading-normal transition-colors hover:text-(--primary-color) hover:scale-110';
            const activeClass = isActive
              ? ' text-(--primary-color) scale-110 font-bold'
              : ' text-text-secondary';
            if (item.external) {
              return (
                <a
                  key={item.labelKey}
                  className={baseClass + activeClass}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick(item.analyticsKey)}
                >
                  {t(item.labelKey)}
                </a>
              );
            } else {
              return (
                <Link
                  key={item.labelKey}
                  className={baseClass + activeClass}
                  to={item.to}
                  reloadDocument={false}
                  onClick={() => trackButtonClick(item.analyticsKey)}
                >
                  {t(item.labelKey)}
                </Link>
              );
            }
          })}
        </nav>
        <button
          type="button"
          className="cursor-pointer text-text-secondary hover:text-(--primary-color) hover:scale-110"
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
          className="cursor-pointer hover:scale-110"
          aria-label="Toggle language"
          onClick={() => {
            toggleLanguage();
            trackButtonClick('language-toggle');
          }}
          style={{ fontSize: '1.5rem' }}
        >
          {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
        </button>
      </div>
      {/* Mobile hamburger menu */}
      <div className="md:hidden flex items-center">
        <button
          type="button"
          className="cursor-pointer"
          aria-label="Open menu"
          style={{ fontSize: '2rem', background: 'none', border: 'none' }}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
          <nav className="flex flex-col gap-6 mt-6">
            {HEADER_ITEMS.map((item) => {
              const section = item.to.startsWith('/#')
                ? item.to.replace('/#', '')
                : null;
              const isActive = section && activeSection === section;
              const baseClass =
                'text-lg font-medium leading-normal transition-colors hover:text-(--primary-color) hover:scale-110';
              const activeClass = isActive
                ? ' text-(--primary-color) scale-110 font-bold'
                : ' text-text-secondary';
              if (item.external) {
                return (
                  <a
                    key={item.labelKey}
                    className={baseClass + activeClass}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setMenuOpen(false);
                      trackButtonClick(item.analyticsKey);
                    }}
                  >
                    {t(item.labelKey)}
                  </a>
                );
              } else {
                return (
                  <Link
                    key={item.labelKey}
                    className={baseClass + activeClass}
                    to={item.to}
                    onClick={() => {
                      setMenuOpen(false);
                      trackButtonClick(item.analyticsKey);
                    }}
                    reloadDocument={false}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              }
            })}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  toggleLanguage();
                  setMenuOpen(false);
                  trackButtonClick('language-toggle');
                }}
                className="p-2 flex items-center gap-2"
                aria-label="Toggle language"
                style={{ fontSize: '1.5rem' }}
              >
                {i18n.language === 'tr' ? <TRIcon /> : <ENIcon />}
              </button>
              <button
                type="button"
                className="cursor-pointer ml-4 hover:text-(--primary-color) hover:scale-110"
                aria-label="Toggle theme"
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                  trackButtonClick('theme-toggle');
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
};

export default Header;
