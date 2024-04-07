import { ModalityDate, ModalityRules, ModalityType } from '@/types';
import InputController from '@/controllers/input.controller';
import Separator from '@/components/separator';
import { Row, RowField, RowLabel } from '@/components/row';
import Rules from '@/components/rules';
import React from 'react';

type DateModalityProps = {
  value: ModalityDate;
  onChange(modality: ModalityDate): void;
};

const DateModality: React.FC<DateModalityProps> = ({ value, onChange }) => {
  const onDefaultValueChange = (defaultValue: string): void => {
    onChange({ ...value, defaultValue });
  };

  const onRulesChange = (rules: ModalityRules): void => {
    onChange({ ...value, rules });
  };

  return (
    <>
      <Row>
        <RowLabel className="w-44">Default value</RowLabel>
        <RowField>
          <InputController value={value.defaultValue || ''} onChange={onDefaultValueChange} />
        </RowField>
      </Row>
      <Separator />
      <Rules type={ModalityType.DATE} value={value.rules} onChange={onRulesChange} />
    </>
  );
};

export default DateModality;
