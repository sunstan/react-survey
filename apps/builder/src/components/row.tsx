import { Label as CommonLabel, cn } from '@react-survey/ui';
import { Primitive } from '@radix-ui/react-primitive';
import React from 'react';

/** -----------------------------------------------------------
 * Root
 * --------------------------------------------------------- */

type RootElement = React.ElementRef<typeof Primitive.div>;
type RootProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
const Root = React.forwardRef<RootElement, RootProps>(({ className, ...props }, forwardedRef) => (
  <Primitive.div {...props} ref={forwardedRef} className={cn('flex shrink-0 items-center gap-2', className)} />
));

/** -----------------------------------------------------------
 * Label
 * --------------------------------------------------------- */

type LabelElement = React.ElementRef<typeof CommonLabel>;
type LabelProps = React.ComponentPropsWithoutRef<typeof CommonLabel>;
const Label = React.forwardRef<LabelElement, LabelProps>(({ className, ...props }, forwardedRef) => (
  <CommonLabel {...props} ref={forwardedRef} className={cn('mt-2 shrink-0 self-start text-sm', className)} />
));

/** -----------------------------------------------------------
 * Field
 * --------------------------------------------------------- */

type FieldElement = React.ElementRef<typeof Primitive.div>;
type FieldProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
const Field = React.forwardRef<FieldElement, FieldProps>(({ className, ...props }, forwardedRef) => (
  <Primitive.div {...props} ref={forwardedRef} className={cn('flex min-h-10 flex-grow items-center', className)} />
));

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export const Row = Root;
export const RowLabel = Label;
export const RowField = Field;
