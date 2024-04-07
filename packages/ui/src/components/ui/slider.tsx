import * as React from 'react';
import { clamp } from 'lodash';
import { cn } from '../../utils';
import * as SliderPrimitive from '@radix-ui/react-slider';

type Marker = {
  value: number;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { markers?: Marker[] }
>(({ className, ...props }, ref) => {
  const { orientation = 'horizontal', max = 100, markers = [] } = props;

  const Marker: React.FC<{ value: number }> = ({ value }) => (
    <div
      className={cn(
        'absolute flex items-center justify-center px-1.5',
        orientation === 'horizontal' ? 'w-0 -translate-x-1/2' : 'h-0 -translate-y-1/2',
      )}
      style={{ [orientation === 'horizontal' ? 'left' : 'top']: calcStepMarkOffset(value, max) }}
    >
      <div className="h-4 w-1 shrink-0 bg-neutral-200" />
    </div>
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      {markers.map(({ value }) => (
        <Marker key={value} value={value} />
      ))}
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <SliderPrimitive.Range className="absolute h-full bg-neutral-900 dark:bg-neutral-50" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-neutral-200 border-neutral-900/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

const THUMB_SIZE = 16;

function calcStepMarkOffset(value: number, maxValue: number) {
  const percent = convertValueToPercentage(value, 0, maxValue);
  const thumbInBoundsOffset = getThumbInBoundsOffset(THUMB_SIZE, percent, 1);
  return `calc(${percent}% + ${thumbInBoundsOffset}px)`;
}

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, 0, 100);
}

function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}

function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}

export { Slider };
