import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCode } from 'react-icons/fa';
import useAnalytics from '@/hooks/useAnalytics';
import './ExperiencePage.css';

const EXPERIENCE_START_YEAR = 2007;

const EXPERIENCES = [
  {
    key: 'etiya',
    startDate: '02-2024',
    endDate: '',
  },
  {
    key: 'virtudev',
    startDate: '06-2018',
    endDate: '01-2024',
  },
  {
    key: 'univera',
    startDate: '12-2015',
    endDate: '05-2018',
  },
  {
    key: 'agito',
    startDate: '09-2012',
    endDate: '09-2014',
  },
  {
    key: 'doganata',
    startDate: '03-2012',
    endDate: '08-2012',
  },
  {
    key: 'birim',
    startDate: '07-2007',
    endDate: '01-2012',
  },
];

const ExperiencePage = () => {
  const { t } = useTranslation();
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    trackSectionView('experience_page');
  }, [trackSectionView]);

  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;

  return (
    <div className="experience-page page-container">
      {/* Experience Hero */}
      <div className="experience-hero">
        <h1 className="experience-title">{t('experience.title')}</h1>
        <p className="experience-subtitle">
          {t('experience.subtitle', { years })}
        </p>
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        {/* Vertical Line */}
        <div className="timeline-line-center" />

        <div className="experience-list">
          {EXPERIENCES.map((exp, index) => {
            const company = t(`experiencesData.${exp.key}.company`);
            const position = t(`experiencesData.${exp.key}.position`);
            const desc = t(`experiencesData.${exp.key}.desc`);
            const techStack = t(`experiencesData.${exp.key}.tech`, {
              returnObjects: true,
            }) as string[];

            const isEven = index % 2 === 0;

            return (
              <div
                key={exp.key}
                className={`experience-row ${isEven ? 'row-normal' : 'row-reverse'}`}
              >
                {/* Text Side */}
                <div className="experience-text-side">
                  <span
                    className={`date-badge ${isEven ? 'badge-primary' : 'badge-muted'}`}
                  >
                    {exp.startDate} &mdash; {exp.endDate}
                  </span>
                  <h3 className="company-name">{company}</h3>
                  <p className="position-title">{position}</p>
                  <p className="experience-description">{desc}</p>
                </div>

                {/* Center Dot */}
                <div
                  className={`timeline-dot-wrapper ${index === 0 ? 'first-dot' : ''}`}
                >
                  <div className="timeline-dot" />
                </div>

                {/* Card Side */}
                <div className="experience-card-side">
                  <div className="experience-info-card">
                    <div
                      className={`card-header ${!isEven ? 'header-right' : ''}`}
                    >
                      <span className="icon-primary">
                        <FaCode />
                      </span>
                      <span className="card-category">Tech Stack</span>
                    </div>
                    {
                      // istanbul ignore next — data-dependent on i18n return values
                      Array.isArray(techStack) && (
                        <p className="card-tech">{techStack.join(', ')}</p>
                      )
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
