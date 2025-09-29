import { useTranslation } from 'react-i18next';
import { FaBuilding } from 'react-icons/fa';
import useAnalytics from '../../hooks/useAnalytics';
import { useEffect } from 'react';

const EXPERIENCES = [
  {
    company: 'Etiya',
    position: 'Principal Software Specialist',
    startDate: '02-2024',
    endDate: '',
  },
  {
    company: 'VirtuDev',
    position: 'Team Lead | Senior Software Specialist',
    startDate: '06-2018',
    endDate: '01-2024',
  },
  {
    company: 'Univera Kurumsal Teknoloji Çözümleri',
    position: 'Software Developer',
    startDate: '12-2015',
    endDate: '05-2018',
  },
  {
    company: 'Agito Software & Consulting',
    position: 'Software Developer',
    startDate: '09-2012',
    endDate: '09-2014',
  },
  {
    company: 'Doğanata Şirketler Grubu',
    position: 'Software Developer',
    startDate: '03-2012',
    endDate: '08-2012',
  },
  {
    company: 'Birim Bilgi Teknolojileri',
    position: 'Software Developer',
    startDate: '07-2007',
    endDate: '01-2012',
  },
];

const Experience = () => {
  const { t } = useTranslation();
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    trackSectionView('experience');
  }, [trackSectionView]);

  return (
    <section className="scroll-mt-20 text-left main-bg" id="experience">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('experience')}
      </h2>
      {EXPERIENCES.map((exp) => (
        <div key={exp.company} className="flex flex-col gap-8 mt-4">
          <div className="flex gap-4 sm:gap-6">
            <div className="text-xl sm:text-2xl font-bold mt-1">
              <FaBuilding />
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
                {exp.company}
              </p>
              <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
                {exp.position} |{' '}
                <span className="italic">
                  {exp.startDate} - {exp.endDate}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Experience;
