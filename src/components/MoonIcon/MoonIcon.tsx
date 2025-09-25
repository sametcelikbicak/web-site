import type { SVGProps } from 'react';

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="cursor-pointer"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="m18.9,13.69c-1.33.85-3.01,1.21-4.77.82-2.29-.51-4.13-2.35-4.64-4.64-.39-1.76-.03-3.44.82-4.77.25-.39-.11-.9-.55-.77-3.44,1-5.91,4.25-5.75,8.04.18,4.06,3.56,7.44,7.62,7.62,3.8.17,7.04-2.31,8.04-5.75.13-.45-.38-.81-.77-.55Z" />
  </svg>
);

export default MoonIcon;
