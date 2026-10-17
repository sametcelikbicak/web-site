import type { SVGProps } from 'react';

// Part of the local icon set. These were imported from react-icons, but that
// library shipped a shared 33 KB chunk on every first paint because SkillsPage's
// 21 Simple Icons and the nine icons on the home route landed in the same
// chunk. Copying the path data in gives a dependency-free tree-shaken set: only
// the glyphs actually rendered exist, and the home route carries 9 icons
// instead of a whole icon pack. MoonIcon / SunIcon / TRIcon already worked this
// way.
const Html5Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
    />
  </svg>
);

export default Html5Icon;
