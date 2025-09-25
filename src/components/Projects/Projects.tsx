import { useTranslation } from 'react-i18next';

const PROJECTS = [
  {
    key: 'enum2array',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/enum2array/81a91637434dc2d11eac821c589dea7a8a79d1e8/assets/enum2array.svg',
    link: 'https://www.npmjs.com/package/enum2array',
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
];

const Projects = () => {
  const { t } = useTranslation();
  return (
    <section className="scroll-mt-20 text-left" id="projects">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('projects.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div
            key={project.key}
            className="flex flex-col items-center main-bg rounded-lg overflow-hidden transition-shadow duration-300 p-6 cursor-pointer"
            onClick={() => window.open(project.link, '_blank')}
          >
            <img
              src={project.image}
              alt={t(`projects.${project.key}.title`)}
              className="object-contain mb-4"
              style={{ background: 'transparent' }}
            />
            <div className="flex flex-col items-center text-center">
              <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal mb-2">
                {t(`projects.${project.key}.title`)}
              </p>
              <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
                {t(`projects.${project.key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
