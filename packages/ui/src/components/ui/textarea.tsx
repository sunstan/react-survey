import * as React from 'react';
import { cn } from '../../utils';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

type TextareaProps = TextareaAutosizeProps;
type TextareaElement = React.ElementRef<typeof TextareaAutosize>;

const Textarea = React.forwardRef<TextareaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosize
      minRows={3}
      className={cn([
        'flex',
        'text-sm',
        'bg-white',
        'px-3 py-2',
        'rounded-md',
        'outline-none',
        'text-neutral-900',
        'transition-colors',
        'h-9 max-h-40 w-full',
        'border border-neutral-200',
        'shadow-sm shadow-neutral-900/10',
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
Textarea.displayName = 'Textarea';

export { Textarea };
