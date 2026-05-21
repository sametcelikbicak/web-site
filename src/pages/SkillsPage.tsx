import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SiAngular,
  SiBitbucket,
  SiCss3,
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
import useAnalytics from '@/hooks/useAnalytics';
import './SkillsPage.css';

const SKILL_CATEGORIES = [
  {
    category: 'Frontend & UI',
    skills: [
      { name: 'Angular', icon: SiAngular, color: '#DD0031' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    ],
  },
  {
    category: 'Backend & APIs',
    skills: [
      { name: 'NodeJS', icon: SiNodedotjs, color: '#339933' },
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'C#', icon: SiSharp, color: '#239120' },
      { name: '.Net', icon: SiDotnet, color: '#512BD4' },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Turborepo', icon: SiTurborepo, color: '#EF4444' },
      { name: 'GitHub', icon: SiGithub, color: '#181717' },
      { name: 'GitLab', icon: SiGitlab, color: '#FC6D26' },
      { name: 'Bitbucket', icon: SiBitbucket, color: '#0052CC' },
      { name: 'NPM', icon: SiNpm, color: '#CB3837' },
      { name: 'Yarn', icon: SiYarn, color: '#2C8EBB' },
      { name: 'PNPM', icon: SiPnpm, color: '#F69220' },
    ],
  },
];

const SkillsPage = () => {
  const { t } = useTranslation();
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    trackSectionView('skills_page');
  }, [trackSectionView]);

  return (
    <div className="skills-page page-container section-gap">
      <div className="skills-header">
        <h1 className="skills-title">{t('skills.title')}</h1>
        <p className="skills-subtitle">{t('skills.subtitle')}</p>
      </div>

      <div className="skills-categories">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.category} className="skill-category">
            <h3 className="category-title">{cat.category}</h3>
            <div className="skills-grid">
              {cat.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="skill-card card">
                    <div
                      className="skill-icon-wrapper"
                      style={
                        { '--hover-color': skill.color } as React.CSSProperties
                      }
                    >
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
