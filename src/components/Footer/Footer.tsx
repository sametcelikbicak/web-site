import { useTranslation } from 'react-i18next';
import {
  SiGithub,
  SiLinkedin,
  SiStackoverflow,
  SiX,
  SiYoutube,
} from 'react-icons/si';
import useAnalytics from '@/hooks/useAnalytics';
import './Footer.css';

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/sametcelikbicak', icon: SiGithub },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sametcelikbicak/',
    icon: SiLinkedin,
  },
  { name: 'X', url: 'https://x.com/sametcelikbicak', icon: SiX },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@sametcelikbicak',
    icon: SiYoutube,
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/10509056/samet-%c3%87el%c4%b0kbi%c3%87ak',
    icon: SiStackoverflow,
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();

  return (
    <footer className="site-footer">
      <div className="footer-inner page-container">
        <div className="footer-social">
          {SOCIAL_LINKS.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="footer-social-link"
              onClick={() => trackButtonClick(name)}
            >
              <Icon size={20} />
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
