import * as React from 'react';
import { cn } from '../../utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  [
    'text-sm',
    'uppercase',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'whitespace-nowrap',
    'inline-flex items-center justify-center gap-2',
    'focus-visible:ring-1',
    'focus-visible:outline-none',
    'focus-visible:ring-neutral-950',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'dark:focus-visible:ring-neutral-300',
  ],
  {
    variants: {
      variant: {
        primary: ['shadow', 'text-white', 'bg-blue-500', 'hover:bg-blue-600'],
        destructive: [
          'shadow-sm',
          'bg-red-500',
          'text-neutral-50',
          'hover:bg-red-500/90',
          'dark:bg-red-900',
          'dark:text-neutral-50',
          'dark:hover:bg-red-900/90',
        ],
        outline: ['bg-transparent', 'shadow-sm', 'text-blue-500', 'border border-blue-500', 'hover:bg-blue-500/10'],
        secondary: [
          'shadow-sm',
          'bg-neutral-100',
          'text-neutral-900',
          'hover:bg-neutral-100/80',
          'dark:bg-neutral-800',
          'dark:text-neutral-50',
          'dark:hover:bg-neutral-800/80',
        ],
        ghost: [
          'hover:bg-neutral-100',
          'hover:text-neutral-900',
          'dark:hover:bg-neutral-800',
          'dark:hover:text-neutral-50',
        ],
        link: ['text-neutral-900', 'underline-offset-4', 'hover:underline', 'dark:text-neutral-50'],
      },
      size: {
        lg: 'h-10 px-8',
        md: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        icon: 'h-9 w-9 [&>*]:w-5 [&>*]:h-5 [&>*]:shrink-0 [&>*]:transition-colors [&>*]:text-neutral-900 [&>*]:dark:text-white',
      },
    },
    compoundVariants: [
      {
        variant: 'link',
        size: ['lg', 'md', 'sm', 'icon'],
        className: 'px-0',
      },
      {
        variant: 'primary',
        size: ['icon'],
        className: '[&>*]:text-white',
      },
      {
        variant: 'ghost',
        size: ['icon'],
        className: '[&>*]:text-neutral-900 [&>*]:dark:text-white',
      },
      {
        variant: 'outline',
        size: ['icon'],
        className: '[&>*]:text-blue-500 [&>*]:dark:text-blue-500',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
