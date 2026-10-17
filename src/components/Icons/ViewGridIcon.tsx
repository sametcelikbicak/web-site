import type { SVGProps } from 'react';

// Part of the local icon set. These were imported from react-icons, but that
// library shipped a shared 33 KB chunk on every first paint because SkillsPage's
// 21 Simple Icons and the nine icons on the home route landed in the same
// chunk. Copying the path data in gives a dependency-free tree-shaken set: only
// the glyphs actually rendered exist, and the home route carries 9 icons
// instead of a whole icon pack. MoonIcon / SunIcon / TRIcon already worked this
// way.
const ViewGridIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

export default ViewGridIcon;
