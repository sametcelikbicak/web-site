import { useTranslation } from 'react-i18next';
import { FaBuilding } from 'react-icons/fa';
import './EducationPage.css';

const EDUCATIONS = [
  {
    key: 'ahmetYeseviUniversity',
    graduationGrade: '2.6 / 4.0',
    startDate: '09-2018',
    endDate: '06-2019',
  },
  {
    key: 'anadoluUniversity',
    graduationGrade: '65.31 / 100',
    startDate: '09-2007',
    endDate: '06-2012',
  },
  {
    key: 'dokuzEylulUniversity',
    graduationGrade: '2.29 / 4.0',
    startDate: '09-2005',
    endDate: '06-2007',
  },
];

const EducationPage = () => {
  const { t } = useTranslation();

  return (
    <div className="education-page page-container">
      <div className="education-hero">
        <h1 className="education-title">{t('education.title')}</h1>
        <p className="education-subtitle">{t('education.subtitle')}</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line-center" />

        <div className="education-list">
          {EDUCATIONS.map((edu, index) => {
            const school = t(`education.school.${edu.key}.name`);
            const division = t(`education.school.${edu.key}.division`);

            const isEven = index % 2 === 0;

            return (
              <div
                key={edu.key}
                className={`education-row ${isEven ? 'row-left' : 'row-right'}`}
              >
                <div className="education-entry">
                  <div className="entry-header">
                    <span className="entry-icon">
                      <FaBuilding />
                    </span>
                    <span className="entry-date">
                      {edu.startDate} &mdash; {edu.endDate}
                    </span>
                  </div>
                  <h3 className="entry-school">{school}</h3>
                  <p className="entry-division">{division}</p>
                  <p className="entry-grade">
                    <span className="grade-label">GPA:</span>{' '}
                    {edu.graduationGrade}
                  </p>
                </div>

                <div className="timeline-dot-wrapper">
                  <div
                    className={`timeline-dot ${index === 0 ? 'dot-active' : ''}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
