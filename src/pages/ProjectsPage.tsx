import { useTranslation } from 'react-i18next';
import './ProjectsPage.css';

const PROJECTS = [
  {
    key: 'rolecraft',
    image:
      'https://github.com/sametcelikbicak/rolecraft/blob/main/assets/rolecraft_logo.png?raw=true',
    link: 'https://www.npmjs.com/package/rolecraft',
  },
  {
    key: 'task-decomposer',
    image:
      'https://github.com/sametcelikbicak/task-decomposer/blob/main/assets/task-decomposer.png?raw=true',
    link: 'https://agentskill.sh/@sametcelikbicak/task-decomposer',
  },
  {
    key: 'flaky-test-detector',
    image:
      'https://github.com/sametcelikbicak/flaky-test-detector/blob/main/assets/flaky-test-detector.png?raw=true',
    link: 'https://agentskill.sh/@sametcelikbicak/flaky-test-detector',
  },
  {
    key: 'coverage-guard',
    image:
      'https://github.com/sametcelikbicak/coverage-guard/blob/main/assets/coverage-guard.png?raw=true',
    link: 'https://agentskill.sh/@sametcelikbicak/coverage-guard',
  },
  {
    key: 'pomodoro',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/pomodoro/5c03dca9b63b406c579978468adae42a07fc2dcf/public/pomodoro.svg',
    link: 'https://sametcelikbicak.github.io/pomodoro/',
  },
  {
    key: 'tsci',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/tsci/refs/heads/main/assets/tsci.jpeg',
    link: 'https://www.npmjs.com/package/tsci',
  },
  {
    key: 'storage-function',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/storage-function/0b679da3eac7a09d471b4eaa3b741a978cba74a8/assets/storage-function.svg',
    link: 'https://www.npmjs.com/package/storage-function',
  },
  {
    key: 'enum2array',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/enum2array/81a91637434dc2d11eac821c589dea7a8a79d1e8/assets/enum2array.svg',
    link: 'https://www.npmjs.com/package/enum2array',
  },
];

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="projects-page page-container section-gap">
      <div className="projects-header">
        <h1 className="projects-title">{t('projects.title')}</h1>
        <p className="projects-subtitle">{t('projects.subtitle')}</p>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((project) => (
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
                loading="lazy"
              />
            </div>
            <div className="project-content">
              <h3 className="project-title">
                {t(`projects.${project.key}.title`)}
              </h3>
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
