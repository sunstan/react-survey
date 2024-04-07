import * as React from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn([
        'flex',
        'text-sm',
        'bg-white',
        'px-3 pb-1',
        'h-9 w-full',
        'rounded-md',
        'outline-none',
        'text-neutral-900',
        'transition-colors',
        'border border-neutral-200',
        'shadow-sm shadow-neutral-900/10',
        // File
        'file:text-sm',
        'file:border-0',
        'file:font-medium',
        // Placeholder
        'placeholder:text-neutral-500',
        // Focus visible
        'focus-visible:border-neutral-700',
        // Disabled
        'disabled:opacity-50',
        // Dark
        'dark:text-white',
        'dark:bg-neutral-900',
        'dark:border-neutral-700',
        'dark:shadow-neutral-950/50',
        'dark:placeholder:text-neutral-400',
        'dark:focus-visible:border-neutral-300',
        className,
      ])}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
