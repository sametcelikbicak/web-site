import { useTranslation } from 'react-i18next';
import ExpertiseArchitectureIcon from '@/components/Icons/ExpertiseArchitectureIcon';
import ExpertiseCodeIcon from '@/components/Icons/ExpertiseCodeIcon';
import ExpertiseLeadershipIcon from '@/components/Icons/ExpertiseLeadershipIcon';
import ExpertiseSpeedIcon from '@/components/Icons/ExpertiseSpeedIcon';
import './ExpertiseCards.css';

const EXPERTISE_DATA = [
  {
    icon: ExpertiseCodeIcon,
    titleKey: 'expertise.frontend.title',
    descKey: 'expertise.frontend.desc',
  },
  {
    icon: ExpertiseArchitectureIcon,
    titleKey: 'expertise.architecture.title',
    descKey: 'expertise.architecture.desc',
  },
  {
    icon: ExpertiseSpeedIcon,
    titleKey: 'expertise.performance.title',
    descKey: 'expertise.performance.desc',
  },
  {
    icon: ExpertiseLeadershipIcon,
    titleKey: 'expertise.leadership.title',
    descKey: 'expertise.leadership.desc',
  },
];

const ExpertiseCards = () => {
  const { t } = useTranslation();

  return (
    <section className="expertise-section section-gap">
      <div className="page-container">
        <h2 className="section-label">{t('expertise.label')}</h2>
        <div className="expertise-grid">
          {EXPERTISE_DATA.map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="card expertise-card">
              <div className="expertise-icon-wrapper">
                <Icon width={24} height={24} className="expertise-icon" />
              </div>
              <h3 className="expertise-title">{t(titleKey)}</h3>
              <p className="expertise-desc">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseCards;
