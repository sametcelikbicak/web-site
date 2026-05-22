import { useTranslation } from 'react-i18next';
import './Hero.css';

const EXPERIENCE_START_YEAR = 2007;

const Hero = () => {
  const { t } = useTranslation();
  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;

  return (
    <section className="hero-section section-gap">
      <div className="page-container hero-container">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">{t('hero.title')}</h1>
          <p
            className="hero-subtitle animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            {t('hero.subtitle', { years })}
          </p>
        </div>
        <div className="hero-image-wrapper animate-fade-in">
          <img
            src="/sc_caricature.webp"
            alt="Samet Çelikbıçak"
            className="hero-image"
            width={400}
            height={400}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
