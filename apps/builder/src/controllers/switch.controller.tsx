import { Switch } from '@react-survey/ui';
import React from 'react';

/** -----------------------------------------------------------
 * Switch
 * --------------------------------------------------------- */

type Props = {
  value: boolean;
  onChange(value: boolean): void;
};

const SwitchController: React.FC<Props> = ({ value, onChange }) => {
  return <Switch checked={value} onCheckedChange={onChange} />;
};

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default SwitchController;
