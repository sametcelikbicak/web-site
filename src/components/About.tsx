import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  const aboutText = t('about.description');

  return (
    <section className="scroll-mt-20 text-left" id="about">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-6">
        {t('about.title')}
      </h2>
      <p className="text-text-secondary text-base sm:text-lg font-normal leading-relaxed">
        {aboutText.split('\n').map((line, index) => (
          <Fragment key={line + Math.random()}>
            {index > 0 && <br />}
            <span
              style={{
                textIndent: '2em',
                display: 'inline-block',
                width: '100%',
              }}
            >
              {line}
            </span>
          </Fragment>
        ))}
      </p>
    </section>
  );
}

export default About;
