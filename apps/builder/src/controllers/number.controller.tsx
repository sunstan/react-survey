import { Number, NumberField, NumberValue } from '@react-survey/ui';
import React from 'react';

/** -----------------------------------------------------------
 * Number
 * --------------------------------------------------------- */

type Props = {
  value: string | number | undefined;
  onChange(value: string): void;
};

const NumberController: React.FC<Props> = ({ value, onChange }) => (
  <Number value={value} onValueChange={onChange}>
    <NumberField>
      <NumberValue />
    </NumberField>
  </Number>
);

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default NumberController;
