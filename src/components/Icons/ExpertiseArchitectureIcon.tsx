import type { SVGProps } from 'react';

// Inlined from react-icons/md, same reason as the footer social icons: the
// shared react-icons chunk was 33 KB on every page because ExpertiseCards and
// Footer sat on the home route while SkillsPage's icons are lazy.
const ExpertiseArchitectureIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.36 18.78 6.61 21l1.62-1.54 2.77-7.6c-.68-.17-1.28-.51-1.77-.98zM14.77 10.88c-.49.47-1.1.81-1.77.98l2.77 7.6L17.39 21l.26-2.22zM15 8c0-1.3-.84-2.4-2-2.82V3h-2v2.18C9.84 5.6 9 6.7 9 8c0 1.66 1.34 3 3 3s3-1.34 3-3m-3 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"
    />
  </svg>
);

export default ExpertiseArchitectureIcon;
