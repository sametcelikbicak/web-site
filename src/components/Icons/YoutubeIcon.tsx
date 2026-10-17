import type { SVGProps } from 'react';

// Inlined from react-icons/fa6 rather than imported. These five icons are 2.6 KB
// of path data, but importing them pulled the shared `react-icons` chunk
// (33 KB) onto the critical path of every page — SkillsPage's 21 Simple Icons
// were bundled into the same chunk and SkillsPage is lazy. Matches the MoonIcon /
// SunIcon / TRIcon pattern already used in this codebase.
const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 576 512"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
    />
  </svg>
);

export default YoutubeIcon;
