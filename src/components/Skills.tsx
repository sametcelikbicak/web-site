import { useTranslation } from 'react-i18next';
import {
  SiTypescript,
  SiTailwindcss,
  SiSharp,
  SiPnpm,
  SiGit,
  SiAngular,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiGithub,
  SiBitbucket,
  SiGitlab,
  SiNpm,
  SiYarn,
  SiDocker,
} from 'react-icons/si';

const SKILLS = [
  { name: 'Angular', icon: SiAngular },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'HTML5', icon: SiHtml5 },
  { name: 'CSS3', icon: SiCss3 },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'React', icon: SiReact },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'C#', icon: SiSharp },
  { name: 'NodeJS', icon: SiNodedotjs },
  { name: 'Git', icon: SiGit },
  { name: 'GitHub', icon: SiGithub },
  { name: 'Bitbucket', icon: SiBitbucket },
  { name: 'GitLab', icon: SiGitlab },
  { name: 'NPM', icon: SiNpm },
  { name: 'Yarn', icon: SiYarn },
  { name: 'PNPM', icon: SiPnpm },
  { name: 'Docker', icon: SiDocker },
];

const Skills = () => {
  const { t } = useTranslation();
  return (
    <section className="scroll-mt-20 text-left" id="skills">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        {t('skills')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {SKILLS.map(({ name, icon: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <Icon size={40} title={name} />
            <span className="text-text-secondary text-sm font-medium">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
