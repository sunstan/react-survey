import NumberController from '@/controllers/number.controller';
import SwitchController from '@/controllers/switch.controller';
import InputController from '@/controllers/input.controller';
import { ModalityRules, ModalityType } from '@/types';
import { Row, RowLabel, RowField } from './row';
import React from 'react';

type RulesProps = {
  type: ModalityType;
  value: ModalityRules;
  onChange(rules: ModalityRules): void;
};

const Rules: React.FC<RulesProps> = ({ type, value, onChange }) => {
  const Min: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Min</RowLabel>
        <RowField>
          <NumberController value={value.min} onChange={(min) => onChange({ ...value, min: +min })} />
        </RowField>
      </Row>
    );
  };

  const Max: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Max</RowLabel>
        <RowField>
          <NumberController value={value.max} onChange={(max) => onChange({ ...value, max: +max })} />
        </RowField>
      </Row>
    );
  };

  const MinLength: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Min length</RowLabel>
        <RowField>
          <NumberController value={value.minLength} onChange={(min) => onChange({ ...value, minLength: +min })} />
        </RowField>
      </Row>
    );
  };

  const MaxLength: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Max length</RowLabel>
        <RowField>
          <NumberController value={value.maxLength} onChange={(max) => onChange({ ...value, maxLength: +max })} />
        </RowField>
      </Row>
    );
  };

  const MinLengthArray: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Min length array</RowLabel>
        <RowField>
          <NumberController
            value={value.minLengthArray}
            onChange={(min) => onChange({ ...value, minLengthArray: +min })}
          />
        </RowField>
      </Row>
    );
  };

  const MaxLengthArray: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Max length array</RowLabel>
        <RowField>
          <NumberController
            value={value.maxLengthArray}
            onChange={(max) => onChange({ ...value, maxLengthArray: +max })}
          />
        </RowField>
      </Row>
    );
  };

  const MinDate: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Min date</RowLabel>
        <RowField>
          <InputController
            value={value.minDate || ''}
            onChange={(minDate: string) => onChange({ ...value, minDate })}
          />
        </RowField>
      </Row>
    );
  };

  const MaxDate: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Max date</RowLabel>
        <RowField>
          <InputController
            value={value.maxDate || ''}
            onChange={(maxDate: string) => onChange({ ...value, maxDate })}
          />
        </RowField>
      </Row>
    );
  };

  const Required: React.FC = () => {
    return (
      <Row>
        <RowLabel className="w-44">Required</RowLabel>
        <RowField>
          <SwitchController value={value.required} onChange={(required: boolean) => onChange({ ...value, required })} />
        </RowField>
      </Row>
    );
  };

  return (
    <div className="grid grid-flow-row auto-rows-fr items-center gap-x-2 gap-y-1">
      <div className="text-xs font-semibold uppercase text-neutral-400 transition-colors dark:text-neutral-500">
        Validation rules
      </div>
      <Required />
      {
        {
          [type]: null,
          [ModalityType.DATE]: (
            <>
              <MinDate />
              <MaxDate />
            </>
          ),
          [ModalityType.TEXTAREA]: (
            <>
              <MinLength />
              <MaxLength />
            </>
          ),
          [ModalityType.SLIDER]: (
            <>
              <Min />
              <Max />
            </>
          ),
          [ModalityType.TOGGLES]: (
            <>
              <MinLengthArray />
              <MaxLengthArray />
            </>
          ),
        }[type]
      }
    </div>
  );
};

export default Rules;
