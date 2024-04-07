import { Input } from '@react-survey/ui';
import React from 'react';

/** -----------------------------------------------------------
 * Input
 * --------------------------------------------------------- */

type Props = {
  value: string | undefined;
  onChange(value: string): void;
};

const InputController: React.FC<Props> = ({ value, onChange }) => {
  return <Input value={value || ''} onChange={(evt) => onChange(evt.target.value)} />;
};

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default InputController;
