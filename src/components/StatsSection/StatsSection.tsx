import { useTranslation } from 'react-i18next';
import './StatsSection.css';

const EXPERIENCE_START_YEAR = 2007;

const STATS = [
  { value: 'experience', key: 'experience' },
  { value: '50+', key: 'projects' },
  { value: '20+', key: 'stack' },
  { value: '100%', key: 'satisfaction' },
];

const StatsSection = () => {
  const { t } = useTranslation();
  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.key} className="stat-item">
            <span className="stat-value">
              {stat.key === 'experience' ? `${years}+` : stat.value}
            </span>
            <span className="stat-label">{t(`stats.${stat.key}`)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
