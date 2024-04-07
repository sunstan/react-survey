import { SVGProps } from 'react';

const Drag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M8.5 10a2 2 0 1 0 2 2a2 2 0 0 0-2-2m0 7a2 2 0 1 0 2 2a2 2 0 0 0-2-2m7-10a2 2 0 1 0-2-2a2 2 0 0 0 2 2m-7-4a2 2 0 1 0 2 2a2 2 0 0 0-2-2m7 14a2 2 0 1 0 2 2a2 2 0 0 0-2-2m0-7a2 2 0 1 0 2 2a2 2 0 0 0-2-2"
    />
  </svg>
);

export default Drag;
