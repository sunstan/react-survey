import React from 'react';
import { Option } from '@/types';
import InputController from './input.controller';
import { Button, Trash, Plus } from '@react-survey/ui';

/** -----------------------------------------------------------
 * Options
 * --------------------------------------------------------- */

type OptionsControllerProps = {
  value: Option[];
  onChange: (options: Option[]) => void;
};

const OptionsController: React.FC<OptionsControllerProps> = ({ value, onChange }) => {
  const [count, setCount] = React.useState<number>(value?.length || 0);

  React.useEffect(() => {
    setCount(value?.length || 0);
  }, [value]);

  const addOption = () => {
    onChange([...value, { label: '', value: `${count + 1}` }]);
  };

  const onRemove = (index: number) => {
    onChange(value.filter((_: Option, i: number) => i !== index));
  };

  const onOptionChange = (index: number, option: Option): void => {
    onChange(value.map((o, i) => (i === index ? option : o)));
  };

  return (
    <div className="grid gap-2">
      <div className="flex min-h-10 flex-grow items-center">
        <div className="grid flex-grow gap-2">
          {value?.map((option: Option, i: number) => (
            <OptionController
              key={i}
              value={option}
              onRemove={() => onRemove(i)}
              onChange={(o) => onOptionChange(i, o)}
            />
          ))}
        </div>
      </div>
      <Button variant="link" size="sm" className="w-fit" onClick={addOption}>
        <Plus className="h-4 w-4" />
        Ajouter une réponse
      </Button>
    </div>
  );
};

/** -----------------------------------------------------------
 * Option
 * --------------------------------------------------------- */

type OptionControllerProps = {
  value: Option;
  onRemove(): void;
  onChange(option: Option): void;
};

const OptionController: React.FC<OptionControllerProps> = ({ value, onChange, onRemove }) => {
  const onLabelChange = (label: string): void => {
    return onChange({ ...value, label });
  };

  const onValueChange = (optionValue: string): void => {
    return onChange({ ...value, value: optionValue });
  };

  return (
    <div className="grid grid-cols-[4FR_1FR_MIN-CONTENT] items-center gap-x-4 gap-y-2">
      <InputController value={value.label} onChange={onLabelChange} />
      <InputController value={value.value} onChange={onValueChange} />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash />
      </Button>
    </div>
  );
};

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default OptionsController;
