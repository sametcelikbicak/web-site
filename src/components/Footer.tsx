import { useTranslation } from 'react-i18next';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="text-center text-text-secondary text-sm border-t border-gray-200 pt-6">
      <SocialLinks />
      <span>
        &copy; {new Date().getFullYear()} {t('footer.copyright')}
      </span>
    </footer>
  );
};

export default Footer;
