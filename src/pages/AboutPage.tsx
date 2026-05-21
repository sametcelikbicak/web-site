import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAnalytics from '@/hooks/useAnalytics';
import './AboutPage.css';

const AboutPage = () => {
  const { t } = useTranslation();
  const { trackSectionView } = useAnalytics();

  const aboutText = t('about.description');

  useEffect(() => {
    trackSectionView('about_page');
  }, [trackSectionView]);

  return (
    <div className="about-page page-container">
      <div className="about-header">
        <h1 className="about-title">{t('about.title')}</h1>
        <p className="about-subtitle">
          {t('about.subtitle', {
            defaultValue:
              'Yazılım dünyasındaki 15 yılı aşkın profesyonel serüvenim.',
          })}
        </p>
      </div>

      <div className="about-content">
        {aboutText.split('\n').map((line, index) => {
          if (!line.trim()) return null;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <p key={index} className="about-paragraph">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default AboutPage;
