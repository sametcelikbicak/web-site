import { useTranslation } from 'react-i18next';
import { MdArchitecture, MdCode, MdLeaderboard, MdSpeed } from 'react-icons/md';
import './ExpertiseCards.css';

const EXPERTISE_DATA = [
  {
    icon: MdCode,
    titleKey: 'expertise.frontend.title',
    descKey: 'expertise.frontend.desc',
  },
  {
    icon: MdArchitecture,
    titleKey: 'expertise.architecture.title',
    descKey: 'expertise.architecture.desc',
  },
  {
    icon: MdSpeed,
    titleKey: 'expertise.performance.title',
    descKey: 'expertise.performance.desc',
  },
  {
    icon: MdLeaderboard,
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
                <Icon size={24} className="expertise-icon" />
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
