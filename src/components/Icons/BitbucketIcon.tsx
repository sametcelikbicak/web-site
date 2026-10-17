import type { SVGProps } from 'react';

// Part of the local icon set. These were imported from react-icons, but that
// library shipped a shared 33 KB chunk on every first paint because SkillsPage's
// 21 Simple Icons and the nine icons on the home route landed in the same
// chunk. Copying the path data in gives a dependency-free tree-shaken set: only
// the glyphs actually rendered exist, and the home route carries 9 icons
// instead of a whole icon pack. MoonIcon / SunIcon / TRIcon already worked this
// way.
const BitbucketIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"
    />
  </svg>
);

export default BitbucketIcon;
