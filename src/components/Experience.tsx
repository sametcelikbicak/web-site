import { useTranslation } from 'react-i18next';

function Experience() {
  const { t } = useTranslation();
  return (
    <section className="scroll-mt-20 text-left" id="experience">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('experience.title')}
      </h2>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 sm:gap-6">
          <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">💼</div>
          <div className="flex-1">
            <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
              {t('experience.etiya.company')}
            </p>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              {t('experience.etiya.position')}
            </p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">💼</div>
          <div className="flex-1">
            <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
              {t('experience.virtudev.company')}
            </p>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              {t('experience.virtudev.position')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
