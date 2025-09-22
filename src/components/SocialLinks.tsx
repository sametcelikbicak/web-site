import type { ElementType } from 'react';
import { SiGithub, SiLinkedin, SiX, SiYoutube } from 'react-icons/si';

type SocialLink = {
  name: 'LinkedIn' | 'X' | 'YouTube' | 'GitHub';
  url: string;
  icon: ElementType;
};

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/sametcelikbicak',
    icon: SiGithub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sametcelikbicak/',
    icon: SiLinkedin,
  },
  {
    name: 'X',
    url: 'https://x.com/sametcelikbicak',
    icon: SiX,
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@sametcelikbicak',
    icon: SiYoutube,
  },
];

const SocialLinks = () => {
  return (
    <div className="flex gap-4 justify-center my-3">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="text-2xl text-text-secondary hover:text-[var(--primary-color)] transition-colors"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
