import type { SVGProps } from 'react';

// Inlined from react-icons/fa6 rather than imported. These five icons are 2.6 KB
// of path data, but importing them pulled the shared `react-icons` chunk
// (33 KB) onto the critical path of every page — SkillsPage's 21 Simple Icons
// were bundled into the same chunk and SkillsPage is lazy. Matches the MoonIcon /
// SunIcon / TRIcon pattern already used in this codebase.
const StackOverflowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 384 512"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M290.7 311L95 269.7 86.8 309l195.7 41zm51-87L188.2 95.7l-25.5 30.8 153.5 128.3zm-31.2 39.7L129.2 179l-16.7 36.5L293.7 300zM262 32l-32 24 119.3 160.3 32-24zm20.5 328h-200v39.7h200zm39.7 80H42.7V320h-40v160h359.5V320h-40z"
    />
  </svg>
);

export default StackOverflowIcon;
