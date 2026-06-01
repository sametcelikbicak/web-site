import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useAnalytics from '@/hooks/useAnalytics';
import './FeaturedProjects.css';

const FEATURED_PROJECTS = [
  {
    key: 'tsci',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/tsci/refs/heads/main/assets/tsci.jpeg',
    link: 'https://www.npmjs.com/package/tsci',
    titleKey: 'projects.tsci.title',
    descKey: 'projects.tsci.description',
  },
  {
    key: 'enum2array',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/enum2array/81a91637434dc2d11eac821c589dea7a8a79d1e8/assets/enum2array.svg',
    link: 'https://www.npmjs.com/package/enum2array',
    titleKey: 'projects.enum2array.title',
    descKey: 'projects.enum2array.description',
  },
];

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();

  return (
    <section className="featured-projects section-gap">
      <div className="page-container">
        <div className="featured-header">
          <h2 className="section-label">{t('featuredProjects.label')}</h2>
          <Link
            to="/projects"
            className="view-all-link"
            onClick={() => trackButtonClick('View All Projects')}
          >
            {t('featuredProjects.viewAll')} &rarr;
          </Link>
        </div>

        <div className="projects-grid">
          {FEATURED_PROJECTS.map((project) => (
            <a
              key={project.key}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card project-card"
              onClick={() => trackButtonClick(`Project: ${project.key}`)}
            >
              <div className="project-image-wrapper">
                <img
                  src={project.image}
                  alt={t(project.titleKey)}
                  className="project-image"
                  loading="lazy"
                />
              </div>
              <div className="project-content">
                <h3 className="project-title">{t(project.titleKey)}</h3>
                <p className="project-desc">{t(project.descKey)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
