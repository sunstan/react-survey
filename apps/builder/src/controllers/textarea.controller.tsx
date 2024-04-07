import { Textarea } from '@react-survey/ui';
import React from 'react';

/** -----------------------------------------------------------
 * Textarea
 * --------------------------------------------------------- */

type Props = {
  value: string | undefined;
  onChange(value: string): void;
};

const TextareaController: React.FC<Props> = ({ value, onChange }) => {
  return <Textarea value={value || ''} onChange={(evt) => onChange(evt.target.value)} />;
};

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default TextareaController;
