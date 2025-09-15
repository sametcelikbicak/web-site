import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-center text-text-secondary text-sm border-t border-gray-200 pt-6">
      &copy; {new Date().getFullYear()} {t('footer.copyright')}
    </footer>
  );
}

export default Footer;
