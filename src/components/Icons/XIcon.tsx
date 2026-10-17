import type { SVGProps } from 'react';

// Inlined from react-icons/fa6 rather than imported. These five icons are 2.6 KB
// of path data, but importing them pulled the shared `react-icons` chunk
// (33 KB) onto the critical path of every page — SkillsPage's 21 Simple Icons
// were bundled into the same chunk and SkillsPage is lazy. Matches the MoonIcon /
// SunIcon / TRIcon pattern already used in this codebase.
const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
    />
  </svg>
);

export default XIcon;
