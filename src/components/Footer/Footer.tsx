import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GithubIcon from '@/components/Icons/GithubIcon';
import LinkedinIcon from '@/components/Icons/LinkedinIcon';
import StackOverflowIcon from '@/components/Icons/StackOverflowIcon';
import XIcon from '@/components/Icons/XIcon';
import YoutubeIcon from '@/components/Icons/YoutubeIcon';
import './Footer.css';

// Mirrors the header's NAV_ITEMS (Header.tsx:18-29) with the home route added,
// so the page map follows the order the site already teaches rather than
// introducing a second ordering to learn. /blog/:slug is content, not navigation.
const NAV_ITEMS = [
  { to: '/', labelKey: 'footer.nav.home' },
  { to: '/about', labelKey: 'header.about' },
  { to: '/experience', labelKey: 'header.experience' },
  { to: '/education', labelKey: 'education.title' },
  { to: '/skills', labelKey: 'skills.title' },
  { to: '/projects', labelKey: 'header.projects' },
  { to: '/blog', labelKey: 'header.blog' },
];

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/sametcelikbicak',
    icon: GithubIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sametcelikbicak/',
    icon: LinkedinIcon,
  },
  { name: 'X', url: 'https://x.com/sametcelikbicak', icon: XIcon },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@sametcelikbicak',
    icon: YoutubeIcon,
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/10509056/samet-%c3%87el%c4%b0kbi%c3%87ak',
    icon: StackOverflowIcon,
  },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="footer-inner page-container">
        <nav className="footer-nav" aria-label={t('footer.siteNavigation')}>
          <ul className="footer-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="footer-nav-link">
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-social">
          {SOCIAL_LINKS.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="footer-social-link"
              onClick={() => {}}
            >
              <Icon width={20} height={20} />
            </a>
          ))}
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
