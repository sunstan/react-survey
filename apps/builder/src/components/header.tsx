import React from 'react';
import { cn } from '@react-survey/ui';
import Theme from '@/containers/theme';

const Header: React.FC = () => {
  return (
    <div
      className={cn([
        'px-6',
        'bg-white',
        'h-16 w-full',
        'transition-all',
        'absolute top-0 z-20',
        'flex items-center gap-2',
        'border-b border-neutral-200 ',
        'dark:border-neutral-700',
        'dark:bg-neutral-900',
      ])}
    >
      <Theme className="ml-auto" />
    </div>
  );
};

export default Header;
