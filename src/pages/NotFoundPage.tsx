import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page page-container section-gap">
      <p className="not-found-code">404</p>
      <h1 className="not-found-title">{t('notFound.title')}</h1>
      <p className="not-found-text">{t('notFound.text')}</p>
      <Link to="/" className="not-found-link">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
