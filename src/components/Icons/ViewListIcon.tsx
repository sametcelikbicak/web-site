import type { SVGProps } from 'react';

// Part of the local icon set. These were imported from react-icons, but that
// library shipped a shared 33 KB chunk on every first paint because SkillsPage's
// 21 Simple Icons and the nine icons on the home route landed in the same
// chunk. Copying the path data in gives a dependency-free tree-shaken set: only
// the glyphs actually rendered exist, and the home route carries 9 icons
// instead of a whole icon pack. MoonIcon / SunIcon / TRIcon already worked this
// way.
// Heroicons outline glyph — stroked, not filled. Inlining it as a filled path
// rendered nothing, because a `M4 6h16` rule has no interior to fill. The grid
// sibling happened to survive the same mistake because its source really is
// filled. Both now carry the attributes react-icons emitted.
const ViewListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

export default ViewListIcon;
