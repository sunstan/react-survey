import { ModalityRules, ModalitySlider, ModalityType } from '@/types';
import NumberController from '@/controllers/number.controller';
import { Row, RowField, RowLabel } from '@/components/row';
import Separator from '@/components/separator';
import Rules from '@/components/rules';
import React from 'react';

type SliderModalityProps = {
  value: ModalitySlider;
  onChange(modality: ModalitySlider): void;
};

const SliderModality: React.FC<SliderModalityProps> = ({ value, onChange }) => {
  const onDefaultValueChange = (defaultValue: number): void => {
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
          <NumberController value={value.defaultValue} onChange={(v) => onDefaultValueChange(+v)} />
        </RowField>
      </Row>
      <Separator />
      <Rules type={ModalityType.SLIDER} value={value.rules} onChange={onRulesChange} />
    </>
  );
};

export default SliderModality;
