import type { SVGProps } from 'react';

// Part of the local icon set. These were imported from react-icons, but that
// library shipped a shared 33 KB chunk on every first paint because SkillsPage's
// 21 Simple Icons and the nine icons on the home route landed in the same
// chunk. Copying the path data in gives a dependency-free tree-shaken set: only
// the glyphs actually rendered exist, and the home route carries 9 icons
// instead of a whole icon pack. MoonIcon / SunIcon / TRIcon already worked this
// way.
const NextdotjsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"
    />
  </svg>
);

export default NextdotjsIcon;
