import { ModalityRules, ModalitySelect, ModalityType, Option } from '@/types';
import OptionsController from '@/controllers/options.controller';
import InputController from '@/controllers/input.controller';
import Separator from '@/components/separator';
import { Row, RowField, RowLabel } from '@/components/row';
import Rules from '@/components/rules';
import React from 'react';

type SelectModality = {
  value: ModalitySelect;
  onChange(modality: ModalitySelect): void;
};

const SelectModality: React.FC<SelectModality> = ({ value, onChange }) => {
  const onOptionsChange = (options: Option[]): void => {
    onChange({ ...value, options });
  };

  const onDefaultValueChange = (defaultValue: string): void => {
    onChange({ ...value, defaultValue });
  };

  const onRulesChange = (rules: ModalityRules): void => {
    onChange({ ...value, rules });
  };

  const onPlaceholderChange = (placeholder: string): void => {
    onChange({ ...value, placeholder });
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
        <RowLabel className="w-44">Default value</RowLabel>
        <RowField>
          <InputController value={value.defaultValue || ''} onChange={onDefaultValueChange} />
        </RowField>
      </Row>
      <Row>
        <RowLabel className="w-44">Placeholder</RowLabel>
        <RowField>
          <InputController value={value.placeholder} onChange={onPlaceholderChange} />
        </RowField>
      </Row>
      <Separator />
      <Rules type={ModalityType.SELECT} value={value.rules} onChange={onRulesChange} />
    </>
  );
};

export default SelectModality;
