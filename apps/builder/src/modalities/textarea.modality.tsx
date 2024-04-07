import { ModalityType, ModalityTextarea, ModalityRules } from '@/types';
import TextareaController from '@/controllers/textarea.controller';
import { Row, RowLabel, RowField } from '@/components/row';
import Separator from '@/components/separator';
import Rules from '@/components/rules';
import React from 'react';

type TextareaModalityProps = {
  value: ModalityTextarea;
  onChange(modality: ModalityTextarea): void;
};

const TextareaModality: React.FC<TextareaModalityProps> = ({ value, onChange }) => {
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
          <TextareaController value={value.defaultValue || ''} onChange={onDefaultValueChange} />
        </RowField>
      </Row>
      <Separator />
      <Rules type={ModalityType.TEXTAREA} value={value.rules} onChange={onRulesChange} />
    </>
  );
};

export default TextareaModality;
