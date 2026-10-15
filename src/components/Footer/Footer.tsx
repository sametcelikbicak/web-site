import { useTranslation } from 'react-i18next';
import {
  FaGithub,
  FaLinkedin,
  FaStackOverflow,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import './Footer.css';

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/sametcelikbicak', icon: FaGithub },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sametcelikbicak/',
    icon: FaLinkedin,
  },
  { name: 'X', url: 'https://x.com/sametcelikbicak', icon: FaXTwitter },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@sametcelikbicak',
    icon: FaYoutube,
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/10509056/samet-%c3%87el%c4%b0kbi%c3%87ak',
    icon: FaStackOverflow,
  },
];

const Footer = () => {
  const { t } = useTranslation();

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
              onClick={() => {}}
            >
              <Icon title={name} size={20} />
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
