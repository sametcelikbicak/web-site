import type { SVGProps } from 'react';

// Inlined from react-icons/md, same reason as the footer social icons: the
// shared react-icons chunk was 33 KB on every page because ExpertiseCards and
// Footer sat on the home route while SkillsPage's icons are lazy.
const ExpertiseLeadershipIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      fill="currentColor"
      d="M7.5 21H2V9h5.5zm7.25-18h-5.5v18h5.5zM22 11h-5.5v10H22z"
    />
  </svg>
);

export default ExpertiseLeadershipIcon;
