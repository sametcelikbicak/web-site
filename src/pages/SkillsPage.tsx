import { useTranslation } from 'react-i18next';
import {
  SiAngular,
  SiBitbucket,
  SiCss,
  SiDocker,
  SiDotnet,
  SiGit,
  SiGithub,
  SiGitlab,
  SiHtml5,
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPnpm,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTurborepo,
  SiTypescript,
  SiYarn,
} from 'react-icons/si';
import './SkillsPage.css';

const SKILL_CATEGORIES = [
  {
    category: 'Frontend & UI',
    skills: [
      { name: 'Angular', icon: SiAngular },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Tailwind', icon: SiTailwindcss },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: SiCss },
    ],
  },
  {
    category: 'Backend & APIs',
    skills: [
      { name: 'NodeJS', icon: SiNodedotjs },
      { name: 'NestJS', icon: SiNestjs },
      { name: 'C#', icon: SiSharp },
      { name: '.Net', icon: SiDotnet },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'Docker', icon: SiDocker },
      { name: 'Turborepo', icon: SiTurborepo },
      { name: 'GitHub', icon: SiGithub },
      { name: 'GitLab', icon: SiGitlab },
      { name: 'Bitbucket', icon: SiBitbucket },
      { name: 'NPM', icon: SiNpm },
      { name: 'Yarn', icon: SiYarn },
      { name: 'PNPM', icon: SiPnpm },
    ],
  },
];

const SkillsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="skills-page page-container section-gap">
      <div className="skills-header">
        <h1 className="page-title">{t('skills.title')}</h1>
        <p className="page-subtitle">{t('skills.subtitle')}</p>
      </div>

      <div className="skills-categories">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.category} className="skill-category">
            <h2 className="category-title">{cat.category}</h2>
            <div className="skills-grid">
              {cat.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="skill-card card">
                    <div className="skill-icon-wrapper">
                      <Icon className="skill-icon" />
                    </div>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
