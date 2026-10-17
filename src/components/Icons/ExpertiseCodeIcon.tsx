import type { SVGProps } from 'react';

// Inlined from react-icons/md, same reason as the footer social icons: the
// shared react-icons chunk was 33 KB on every page because ExpertiseCards and
// Footer sat on the home route while SkillsPage's icons are lazy.
const ExpertiseCodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path fill="currentColor" d="M0 0h24v24H0z" />
    <path
      fill="currentColor"
      d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z"
    />
  </svg>
);

export default ExpertiseCodeIcon;
