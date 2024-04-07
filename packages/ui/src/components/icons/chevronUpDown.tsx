import { SVGProps } from 'react';

const ChevronUpDown = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m7 15l5 5l5-5M7 9l5-5l5 5"
    />
  </svg>
);

export default ChevronUpDown;
