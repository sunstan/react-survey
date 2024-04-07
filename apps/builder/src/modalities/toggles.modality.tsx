import { ModalityRules, ModalityToggles, ModalityType, Option } from '@/types';
import OptionsController from '@/controllers/options.controller';
import InputController from '@/controllers/input.controller';
import { Row, RowLabel, RowField } from '@/components/row';
import Separator from '@/components/separator';
import { Switch } from '@react-survey/ui';
import Rules from '@/components/rules';
import React from 'react';
import { castArray } from 'lodash';

type TogglesModalityProps = {
  value: ModalityToggles;
  onChange(modality: ModalityToggles): void;
};

const TogglesModality: React.FC<TogglesModalityProps> = ({ value, onChange }) => {
  const onOptionsChange = (options: Option[]): void => {
    onChange({ ...value, options });
  };

  const onShuffleChange = (shuffle: boolean): void => {
    onChange({ ...value, shuffle });
  };

  const onRulesChange = (rules: ModalityRules): void => {
    onChange({ ...value, rules });
  };

  const onDefaultValueChange = (defaultValue: string): void => {
    onChange({ ...value, defaultValue });
  };

  return (
    <>
      <Row>
        <RowLabel className="w-44">Options</RowLabel>
        <RowField>
          <OptionsController value={value.options} onChange={onOptionsChange} />
        </RowField>
      </Row>
      <Separator />
      <Row>
        <RowLabel className="w-44">Randomize answers</RowLabel>
        <RowField>
          <Switch checked={value.shuffle} onCheckedChange={onShuffleChange} />
        </RowField>
      </Row>
      <Row>
        <RowLabel className="w-44">Default value</RowLabel>
        <RowField>
          <InputController value={castArray(value.defaultValue).join(', ') || ''} onChange={onDefaultValueChange} />
        </RowField>
      </Row>
      <Separator />
      <Rules type={ModalityType.TOGGLES} value={value.rules} onChange={onRulesChange} />
    </>
  );
};

export default TogglesModality;
