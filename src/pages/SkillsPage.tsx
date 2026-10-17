import { useTranslation } from 'react-i18next';
import './SkillsPage.css';
import AngularIcon from '@/components/Icons/AngularIcon';
import BitbucketIcon from '@/components/Icons/BitbucketIcon';
import CssIcon from '@/components/Icons/CssIcon';
import DockerIcon from '@/components/Icons/DockerIcon';
import DotnetIcon from '@/components/Icons/DotnetIcon';
import GithubIcon from '@/components/Icons/GithubIcon';
import GitIcon from '@/components/Icons/GitIcon';
import GitlabIcon from '@/components/Icons/GitlabIcon';
import Html5Icon from '@/components/Icons/Html5Icon';
import JavascriptIcon from '@/components/Icons/JavascriptIcon';
import NestjsIcon from '@/components/Icons/NestjsIcon';
import NextdotjsIcon from '@/components/Icons/NextdotjsIcon';
import NodedotjsIcon from '@/components/Icons/NodedotjsIcon';
import NpmIcon from '@/components/Icons/NpmIcon';
import PnpmIcon from '@/components/Icons/PnpmIcon';
import ReactIcon from '@/components/Icons/ReactIcon';
import SharpIcon from '@/components/Icons/SharpIcon';
import TailwindcssIcon from '@/components/Icons/TailwindcssIcon';
import TurborepoIcon from '@/components/Icons/TurborepoIcon';
import TypescriptIcon from '@/components/Icons/TypescriptIcon';
import YarnIcon from '@/components/Icons/YarnIcon';

const SKILL_CATEGORIES = [
  {
    category: 'Frontend & UI',
    skills: [
      { name: 'Angular', icon: AngularIcon },
      { name: 'TypeScript', icon: TypescriptIcon },
      { name: 'React', icon: ReactIcon },
      { name: 'Next.js', icon: NextdotjsIcon },
      { name: 'JavaScript', icon: JavascriptIcon },
      { name: 'Tailwind', icon: TailwindcssIcon },
      { name: 'HTML5', icon: Html5Icon },
      { name: 'CSS3', icon: CssIcon },
    ],
  },
  {
    category: 'Backend & APIs',
    skills: [
      { name: 'NodeJS', icon: NodedotjsIcon },
      { name: 'NestJS', icon: NestjsIcon },
      { name: 'C#', icon: SharpIcon },
      { name: '.Net', icon: DotnetIcon },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: GitIcon },
      { name: 'Docker', icon: DockerIcon },
      { name: 'Turborepo', icon: TurborepoIcon },
      { name: 'GitHub', icon: GithubIcon },
      { name: 'GitLab', icon: GitlabIcon },
      { name: 'Bitbucket', icon: BitbucketIcon },
      { name: 'NPM', icon: NpmIcon },
      { name: 'Yarn', icon: YarnIcon },
      { name: 'PNPM', icon: PnpmIcon },
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
