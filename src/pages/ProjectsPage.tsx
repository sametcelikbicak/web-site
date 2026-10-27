import { useTranslation } from 'react-i18next';
import './ProjectsPage.css';

const PROJECTS = [
  {
    key: 'opencode-team',
    image: '/projects/opencode-team.svg',
    width: 1200,
    height: 600,
    link: 'https://github.com/sametcelikbicak/opencode-team',
  },
  {
    key: 'vidfix',
    image: '/projects/vidfix.webp',
    width: 640,
    height: 640,
    link: 'https://github.com/sametcelikbicak/vidfix',
  },
  {
    key: 'rolecraft',
    image: '/projects/rolecraft.webp',
    width: 640,
    height: 640,
    link: 'https://rolecraft-sh.github.io/rolecraft/',
  },
  {
    key: 'task-decomposer',
    image: '/projects/task-decomposer.webp',
    width: 640,
    height: 640,
    link: 'https://agentskill.sh/@sametcelikbicak/task-decomposer',
  },
  {
    key: 'flaky-test-detector',
    image: '/projects/flaky-test-detector.webp',
    width: 640,
    height: 640,
    link: 'https://agentskill.sh/@sametcelikbicak/flaky-test-detector',
  },
  {
    key: 'coverage-guard',
    image: '/projects/coverage-guard.webp',
    width: 640,
    height: 640,
    link: 'https://agentskill.sh/@sametcelikbicak/coverage-guard',
  },
  {
    key: 'pomodoro',
    image: '/projects/pomodoro.svg',
    width: 128,
    height: 128,
    link: 'https://sametcelikbicak.github.io/pomodoro/',
  },
  {
    key: 'tsci',
    image: '/projects/tsci.webp',
    width: 640,
    height: 640,
    link: 'https://www.npmjs.com/package/tsci',
  },
  {
    key: 'storage-function',
    image: '/projects/storage-function.svg',
    width: 250,
    height: 250,
    link: 'https://www.npmjs.com/package/storage-function',
  },
  {
    key: 'enum2array',
    image: '/projects/enum2array.svg',
    width: 250,
    height: 250,
    link: 'https://www.npmjs.com/package/enum2array',
  },
];

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="projects-page page-container section-gap">
      <div className="projects-header">
        <h1 className="page-title">{t('projects.title')}</h1>
        <p className="page-subtitle">{t('projects.subtitle')}</p>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((project, index) => (
          <a
            key={project.key}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card card"
          >
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={t(`projects.${project.key}.title`)}
                className="project-image"
                width={project.width}
                height={project.height}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
                decoding="async"
              />
            </div>
            <div className="project-content">
              <h2 className="project-title">
                {t(`projects.${project.key}.title`)}
              </h2>
              <p className="project-desc">
                {t(`projects.${project.key}.description`)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
