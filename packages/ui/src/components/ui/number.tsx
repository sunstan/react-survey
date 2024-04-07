import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { enhanceChildren, EnhancedChildren } from '../../factory';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { createContextScope } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { Primitive } from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';
import { isFinite, isNil, omit } from 'lodash';
import React, { useLayoutEffect } from 'react';
import { cn } from '../../utils';

/** -----------------------------------------------------------
 * Root
 * --------------------------------------------------------- */

const ROOT_NAME = 'Number';

type ScopedProps<P> = P & { __scopeNumber?: Scope };
type RootContextValue = Partial<React.ComponentPropsWithoutRef<typeof Primitive.input>> & {
  min: number;
  max: number;
  step: number;
  value: string;
  spinner: Spinner;
  focused?: boolean;
  invalid?: boolean;
  precision: number;
  increment(step?: number): void;
  decrement(step?: number): void;
  onValueChange(value: string): void;
  onFocusChange(focused: boolean): void;
  onValueAsNumberChange(value: number | undefined): void;
};

const [createRootContext] = createContextScope(ROOT_NAME);
const [RootContextProvider, useRootContext] = createRootContext<RootContextValue>(ROOT_NAME);

type RootProps = Partial<Omit<React.ComponentPropsWithoutRef<typeof Primitive.input>, 'children'>> & {
  min?: number;
  max?: number;
  step?: number;
  invalid?: boolean;
  precision?: number;
  value?: number | string;
  defaultValue?: string | number;
  onValueChange?(value: string): void;
  children: EnhancedChildren<EnhancedData>;
  onValueAsNumberChange?(value: number | undefined): void;
};

type EnhancedData = {
  focused?: boolean;
  invalid?: boolean;
};

const Root: React.FC<RootProps> = (props: ScopedProps<RootProps>) => {
  const {
    invalid,
    children,
    step = 1,
    defaultValue,
    onValueChange,
    precision = 0,
    __scopeNumber,
    value: valueProp,
    onValueAsNumberChange,
    min = window.Number.MIN_SAFE_INTEGER,
    max = window.Number.MAX_SAFE_INTEGER,
    ...inputProps
  } = props;
  const [value = '', setValue] = useControllableState({
    onChange: onValueChange,
    prop: valueProp?.toString(),
    defaultProp: defaultValue?.toString(),
  });
  const [, setValueAsNumber] = useControllableState<number | undefined>({
    onChange: onValueAsNumberChange,
  });
  const [focused = false, setFocus] = useControllableState<boolean>({});
  const ReactId = React.useId();

  const clamp = React.useCallback(
    (v: number) => {
      let nextValue = v;

      nextValue = clampValue(nextValue, min, max);

      return toPrecision(nextValue, precision);
    },
    [precision, max, min],
  );

  const increment = React.useCallback(() => {
    let next: string | number;

    if (value === '') next = parse(step);
    else next = parse(value) + step;

    next = clamp(next as number);
    setValue(format(next));
  }, [clamp, step, setValue, value]);

  const decrement = React.useCallback(() => {
    let next: string | number;

    // Same thing here. We'll follow native implementation
    if (value === '') next = parse(-step);
    else next = parse(value) - step;

    next = clamp(next as number);
    setValue(format(next));
  }, [clamp, step, setValue, value]);

  const spinner = useSpinner(increment, decrement);

  return (
    <RootContextProvider
      {...inputProps}
      min={min}
      max={max}
      step={step}
      value={value}
      focused={focused}
      spinner={spinner}
      invalid={invalid}
      scope={__scopeNumber}
      precision={precision}
      increment={increment}
      decrement={decrement}
      onValueChange={setValue}
      onFocusChange={setFocus}
      id={inputProps.id || ReactId}
      onValueAsNumberChange={setValueAsNumber}
    >
      {enhanceChildren(children, { invalid, focused })}
    </RootContextProvider>
  );
};

/** -----------------------------------------------------------
 * Field
 * --------------------------------------------------------- */

type FieldElement = React.ElementRef<typeof Primitive.div>;
type FieldProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;

const Field = React.forwardRef<FieldElement, FieldProps>((props: ScopedProps<FieldProps>, forwardedRef) => {
  const { __scopeNumber, className, ...fieldProps } = props;
  const { focused, invalid, disabled } = useRootContext(ROOT_NAME, __scopeNumber);
  return (
    <Primitive.div
      {...fieldProps}
      ref={forwardedRef}
      data-focused={focused ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'h-9',
        'flex',
        'text-sm',
        'bg-white',
        'rounded-md',
        'outline-none',
        'text-neutral-900',
        'transition-colors',
        'border border-neutral-200',
        'shadow-sm shadow-neutral-900/10',
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
      )}
    />
  );
});

/** -----------------------------------------------------------
 * Value
 * --------------------------------------------------------- */

type ValueElement = React.ElementRef<typeof Primitive.input>;
type ValueProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
type InputSelection = { start: number | null; end: number | null };

const Value = React.forwardRef<ValueElement, ValueProps>((props: ScopedProps<ValueProps>, forwardedRef) => {
  const { __scopeNumber, className, ...valueProps } = props;
  const inputSelectionRef = React.useRef<InputSelection | null>(null);
  const context = useRootContext(ROOT_NAME, __scopeNumber);
  const cleanContext = omit(context, 'spinner');
  const {
    min,
    max,
    step,
    value,
    focused,
    invalid,
    precision,
    increment,
    decrement,
    onValueChange,
    onFocusChange,
    onValueAsNumberChange,
    ...ctx
  } = cleanContext;

  function sanitize(v: string): string {
    return v.split('').filter(isFloatingPointNumericCharacter).join('');
  }

  function updateValueAsNumber(v: string): void {
    const asNumber = parseFloat(v);
    const isValid = isFinite(asNumber) && !isNil(asNumber);
    onValueAsNumberChange(isValid ? asNumber : undefined);
  }

  function getStepFactor<Event extends React.KeyboardEvent | React.WheelEvent | WheelEvent>(event: Event) {
    // eslint-disable-next-line no-nested-ternary
    return event.metaKey || event.ctrlKey ? 0.1 : event.shiftKey ? 10 : 1;
  }

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const evt = event.nativeEvent as InputEvent;
      if (evt.isComposing) return;

      const sanitizedValue = sanitize(event.currentTarget.value);
      updateValueAsNumber(sanitizedValue);
      onValueChange(sanitizedValue);

      inputSelectionRef.current = {
        start: event.currentTarget.selectionStart,
        end: event.currentTarget.selectionEnd,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onValueChange],
  );

  const validateAndClamp = React.useCallback(() => {
    let next = value as string | number;
    if (value === '') return;

    const valueStartsWithE = /^[eE]/.test(value.toString());

    if (valueStartsWithE) onValueChange('');
    else {
      if (parse(value) < min) next = min;
      if (parse(value) > max) next = max;
      const castedValue = cast(next, step, precision) ?? value;
      updateValueAsNumber(castedValue);
      onValueChange(castedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, precision, step, value, onValueChange]);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.nativeEvent.isComposing) return;
      const eventKey = event.key;

      if (eventKey === 'Enter') {
        validateAndClamp();
        return;
      }

      if (!isValidNumericKeyboardEvent(event, isFloatingPointNumericCharacter)) {
        event.preventDefault();
      }

      const stepFactor = getStepFactor(event) * step;
      const keyMap: Record<string, React.KeyboardEventHandler> = {
        ArrowUp: () => increment(stepFactor),
        ArrowDown: () => decrement(stepFactor),
        End: () => {
          updateValueAsNumber(max.toString());
          onValueChange(max.toString());
        },
        Home: () => {
          updateValueAsNumber(min.toString());
          onValueChange(min.toString());
        },
      };
      const action = keyMap[eventKey];
      if (!action) return;

      event.preventDefault();
      action(event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, increment, decrement, onValueChange, validateAndClamp],
  );

  useLayoutEffect(() => {
    const castedValue = cast(value, step, precision) ?? value;
    updateValueAsNumber(castedValue);
    onValueChange(castedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Primitive.input
      {...ctx}
      {...valueProps}
      min={min}
      max={max}
      step={step}
      value={value}
      ref={forwardedRef}
      aria-required={ctx.required}
      data-focused={focused ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-disabled={ctx.disabled ? '' : undefined}
      onBlur={composeEventHandlers(props.onBlur || context.onBlur, () => {
        onFocusChange(false);
        validateAndClamp();
      })}
      onChange={composeEventHandlers(props.onChange || context.onChange, onChange)}
      onKeyDown={composeEventHandlers(props.onKeyDown || context.onKeyDown, onKeyDown)}
      onFocus={composeEventHandlers(props.onFocus || context.onFocus, (event: React.FocusEvent<HTMLInputElement>) => {
        onFocusChange(true);
        if (!inputSelectionRef.current) return;
        event.target.selectionStart = inputSelectionRef.current.start ?? event.currentTarget.value?.length;
        event.currentTarget.selectionEnd = inputSelectionRef.current.end ?? event.currentTarget.selectionStart;
      })}
      className={cn(
        'px-3 pb-1',
        'rounded-lg',
        'h-full w-full',
        'bg-transparent',
        'text-secondary-900',
        'outline-none outline-0',
        'read-only:bg-secondary-100',
        'read-only:pointer-events-none',
        className,
      )}
    />
  );
});

/** -----------------------------------------------------------
 * Unit
 * --------------------------------------------------------- */

type UnitElement = React.ElementRef<typeof Primitive.span>;
type UnitProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;

const Unit = React.forwardRef<UnitElement, UnitProps>((props, forwardedRef) => (
  <Primitive.span
    {...props}
    ref={forwardedRef}
    className={cn('text-secondary-400 whitespace-nowrap px-4 leading-none empty:hidden', props.className)}
  />
));

/** -----------------------------------------------------------
 * NumberDecrement
 * --------------------------------------------------------- */

type DecrementElement = React.ElementRef<typeof Primitive.button>;
type DecrementProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

const Decrement = React.forwardRef<DecrementElement, DecrementProps>(
  (props: ScopedProps<DecrementProps>, forwardedRef) => {
    const { __scopeNumber, type, className, ...inputIncrementProps } = props;
    const context = useRootContext(ROOT_NAME, __scopeNumber);

    const spinDown = React.useCallback(
      (event: React.PointerEvent) => {
        event.preventDefault();
        context.spinner.down();
      },
      [context.spinner],
    );

    return (
      <Primitive.button
        ref={forwardedRef}
        type={type || 'button'}
        {...inputIncrementProps}
        data-focused={context.focused ? '' : undefined}
        data-invalid={context.invalid ? '' : undefined}
        data-disabled={context.disabled || props.disabled || isLTE(context.value, context.min) ? '' : undefined}
        aria-disabled={context.disabled || props.disabled}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          if (event.button !== 0 || context.disabled) return;
          spinDown(event);
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, context.spinner.stop)}
        onPointerLeave={composeEventHandlers(props.onPointerLeave, context.spinner.stop)}
        className={cn(
          'h-full',
          'aspect-square',
          'text-primary-500',
          'border-secondary-200 border-l',
          'flex items-center justify-center',
          'data-[disabled]:text-secondary-300',
          className,
        )}
      />
    );
  },
);

/** -----------------------------------------------------------
 * NumberIncrement
 * --------------------------------------------------------- */

type IncrementElement = React.ElementRef<typeof Primitive.button>;
type IncrementProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

const Increment = React.forwardRef<IncrementElement, IncrementProps>(
  (props: ScopedProps<IncrementProps>, forwardedRef) => {
    const { __scopeNumber, type, className, ...inputIncrementProps } = props;
    const context = useRootContext(ROOT_NAME, __scopeNumber);

    const spinUp = React.useCallback(
      (event: React.PointerEvent) => {
        event.preventDefault();
        context.spinner.up();
      },
      [context.spinner],
    );

    return (
      <Primitive.button
        ref={forwardedRef}
        type={type || 'button'}
        {...inputIncrementProps}
        data-focused={context.focused ? '' : undefined}
        data-invalid={context.invalid ? '' : undefined}
        data-disabled={context.disabled || props.disabled || isGTE(context.value, context.max) ? '' : undefined}
        aria-disabled={context.disabled || props.disabled}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          if (event.button !== 0 || context.disabled) return;
          spinUp(event);
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, context.spinner.stop)}
        onPointerLeave={composeEventHandlers(props.onPointerLeave, context.spinner.stop)}
        className={cn(
          'h-full',
          'aspect-square',
          'text-primary-500',
          'border-secondary-200 border-l',
          'flex items-center justify-center',
          'data-[disabled]:text-secondary-300',
          className,
        )}
      />
    );
  },
);

/** -----------------------------------------------------------
 * Utils
 * --------------------------------------------------------- */

function isLTE(value: string | number, min?: number): boolean {
  if (!min?.toString()) return false;
  return parse(value) <= min;
}

function isGTE(value: string | number, max?: number): boolean {
  if (!max?.toString()) return false;
  return parse(value) >= max;
}

function parse(value: string | number): number {
  return parseFloat(value.toString().replace(/[^\w.-]+/g, ''));
}

function format(value: string | number): string {
  return value.toString();
}

function isFloatingPointNumericCharacter(character: string): boolean {
  const FLOATING_POINT_REGEX = /^[Ee0-9+\-.]$/;
  return FLOATING_POINT_REGEX.test(character);
}

function isValidNumericKeyboardEvent(event: React.KeyboardEvent, isValid: (key: string) => boolean): boolean {
  if (event.key == null) return true;
  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
  const isSingleCharacterKey = event.key.length === 1;
  if (!isSingleCharacterKey || isModifierKey) return true;
  return isValid(event.key);
}

function countDecimalPlaces(value: number) {
  if (!window.Number.isFinite(value)) return 0;

  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
}

function getDecimalPlaces(value: number, step: number) {
  return Math.max(countDecimalPlaces(step), countDecimalPlaces(value));
}

function toPrecision(value: number, precision?: number) {
  let nextValue: string | number = parse(value);
  const precisionIsValid = isFinite(precision) && !isNil(precision);
  const scaleFactor = 10 ** (precisionIsValid ? precision : 10);
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor;
  return precisionIsValid ? nextValue.toFixed(precision) : nextValue.toString();
}

function cast(value: string | number, step: number, precision?: number) {
  const parsedValue = parse(value);
  if (window.Number.isNaN(parsedValue)) return undefined;
  const decimalPlaces = getDecimalPlaces(parsedValue, step);
  const precisionIsValid = isFinite(precision) && !isNil(precision);
  return toPrecision(parsedValue, precisionIsValid ? precision : decimalPlaces);
}

function clampValue(value: number, min: number, max: number) {
  if (value == null) return value;
  if (max < min) console.warn('clamp: max cannot be less than min');
  return Math.min(Math.max(value, min), max);
}

/** -----------------------------------------------------------
 * Hooks
 * --------------------------------------------------------- */

const CONTINUOUS_CHANGE_INTERVAL = 50;

const CONTINUOUS_CHANGE_DELAY = 300;

type Action = 'increment' | 'decrement';

export type Spinner = {
  up: () => void;
  down: () => void;
  stop: () => void;
  isSpinning: boolean;
};

function useSpinner(increment: (step?: number) => void, decrement: (step?: number) => void): Spinner {
  /**
   * To keep incrementing/decrementing on press, we call that `spinning`
   */
  const [isSpinning, setIsSpinning] = React.useState(false);

  // This state keeps track of the action ("increment" or "decrement")
  const [action, setAction] = React.useState<Action | null>(null);

  // To increment the value the first time you mousedown, we call that `runOnce`
  const [runOnce, setRunOnce] = React.useState(true);

  // Store the timeout instance id in a ref, so we can clear the timeout later
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  // Clears the timeout from memory
  const removeTimeout = () => clearTimeout(timeoutRef.current);

  /**
   * useInterval hook provides a performant way to
   * update the state value at specific interval
   */
  useInterval(
    () => {
      if (action === 'increment') increment();
      if (action === 'decrement') decrement();
    },
    isSpinning ? CONTINUOUS_CHANGE_INTERVAL : null,
  );

  // Function to activate the spinning and increment the value
  const up = React.useCallback(() => {
    // increment the first time
    if (runOnce) {
      increment();
    }

    // after a delay, keep incrementing at interval ("spinning up")
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction('increment');
    }, CONTINUOUS_CHANGE_DELAY);
  }, [increment, runOnce]);

  // Function to activate the spinning and increment the value
  const down = React.useCallback(() => {
    // decrement the first time
    if (runOnce) decrement();

    // after a delay, keep decrementing at interval ("spinning down")
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction('decrement');
    }, CONTINUOUS_CHANGE_DELAY);
  }, [decrement, runOnce]);

  // Function to stop spinning (useful for mouseup, keyup handlers)
  const stop = React.useCallback(() => {
    setRunOnce(true);
    setIsSpinning(false);
    removeTimeout();
  }, []);

  /**
   * If the component unmounts while spinning,
   * let's clear the timeout as well
   */
  React.useEffect(() => () => removeTimeout(), []);

  return { up, down, stop, isSpinning };
}

function useInterval(callback: () => void, delay: number | null) {
  const fn = useCallbackRef(callback);

  React.useEffect(() => {
    let intervalId: number | null = null;
    const tick = () => fn();
    if (delay !== null) {
      intervalId = window.setInterval(tick, delay);
    }
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [delay, fn]);
}

/** -----------------------------------------------------------
 * Display Names
 * --------------------------------------------------------- */

Root.displayName = ROOT_NAME;
Unit.displayName = 'NumberUnit';
Field.displayName = 'NumberField';
Value.displayName = 'NumberValue';
Decrement.displayName = 'NumberDecrement';
Increment.displayName = 'NumberIncrement';

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export const Number = Root;
export const NumberUnit = Unit;
export const NumberField = Field;
export const NumberValue = Value;
export const NumberIncrement = Increment;
export const NumberDecrement = Decrement;
