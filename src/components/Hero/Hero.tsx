import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Hero.css';

// Already public — the same address is printed in the npm package post.
const CONTACT_EMAIL = 'sametcelikbicak@outlook.com';

const EXPERIENCE_START_YEAR = 2007;

const Hero = ({ children }: { children?: ReactNode }) => {
  const { t } = useTranslation();
  const years = new Date().getFullYear() - EXPERIENCE_START_YEAR;

  return (
    <section className="hero-section section-gap">
      <div className="page-container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle', { years })}</p>
          <div className="hero-actions">
            <a
              className="hero-cta hero-cta--primary"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {t('hero.contact')}
            </a>
            <Link className="hero-cta" to="/projects">
              {t('hero.viewProjects')}
            </Link>
          </div>
          {children}
        </div>
        <div className="hero-image-wrapper">
          <img
            src="/sc_caricature.webp"
            alt="Samet Çelikbıçak"
            className="hero-image"
            width={500}
            height={750}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
