import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserGraduate } from 'react-icons/fa6';
import useAnalytics from '@/hooks/useAnalytics';

const EDUCATIONS = [
  {
    school: 'education.school.ahmetYeseviUniversity.name',
    division: 'education.school.ahmetYeseviUniversity.division',
    graduationGrade: '2.6 / 4.0',
    startDate: '09-2018',
    endDate: '06-2019',
  },
  {
    school: 'education.school.anadoluUniversity.name',
    division: 'education.school.anadoluUniversity.division',
    graduationGrade: '65.31 / 100',
    startDate: '09-2007',
    endDate: '06-2012',
  },
  {
    school: 'education.school.dokuzEylulUniversity.name',
    division: 'education.school.dokuzEylulUniversity.division',
    graduationGrade: '2.29 / 4.0',
    startDate: '09-2005',
    endDate: '06-2007',
  },
];

const Education = () => {
  const { t } = useTranslation();
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    trackSectionView('education');
  }, [trackSectionView]);

  return (
    <section className="scroll-mt-20 text-left main-bg" id="education">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('education.title')}
      </h2>
      {EDUCATIONS.map((exp) => (
        <div key={exp.school} className="flex flex-col gap-8 mt-4">
          <div className="flex gap-4 sm:gap-6">
            <div className="text-xl sm:text-2xl font-bold flex items-center">
              <FaUserGraduate />
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
                {t(`${exp.school}`)}
              </p>
              <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
                {t(`${exp.division}`)}{' '}
                <span className="italic">
                  ({exp.startDate} - {exp.endDate})
                </span>
              </p>
              <p>{exp.graduationGrade}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Education;
