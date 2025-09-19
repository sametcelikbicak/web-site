import { useTranslation } from 'react-i18next';

const SKILLS = [
  { name: 'Angular', icon: 'angular' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'HTML5', icon: 'html' },
  { name: 'CSS3', icon: 'css' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'React', icon: 'react' },
  { name: 'Tailwind', icon: 'tailwind' },
  { name: 'C#', icon: 'cs' },
  { name: 'NodeJS', icon: 'nodejs' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Bitbucket', icon: 'bitbucket' },
  { name: 'GitLab', icon: 'gitlab' },
  { name: 'NPM', icon: 'npm' },
  { name: 'Yarn', icon: 'yarn' },
  { name: 'PNPM', icon: 'pnpm' },
  { name: 'Docker', icon: 'docker' },
  { name: 'WebStorm', icon: 'webstorm' },
  { name: 'Rider', icon: 'rider' },
  { name: 'VSCode', icon: 'vscode' },
];

function Skills() {
  const { t } = useTranslation();
  return (
    <section className="scroll-mt-20 text-left" id="skills">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('skills')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {SKILLS.map(({ name, icon }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <img
              src={`https://skillicons.dev/icons?i=${icon}`}
              alt={name}
              width={40}
              height={40}
              loading="lazy"
            />
            <span className="text-text-secondary text-sm font-medium">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
