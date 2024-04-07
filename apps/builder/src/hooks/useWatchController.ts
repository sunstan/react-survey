import { FieldPath, FieldValues, useController, UseControllerReturn, useFormContext, useWatch } from 'react-hook-form';
import { Data } from '@/types';
import { get } from 'lodash';

/** -----------------------------------------------------------
 * Hooks
 * --------------------------------------------------------- */

function useWatchController(name: FieldPath<FieldValues>): UseControllerReturn {
  const { control, getValues } = useFormContext<Data>();
  const { field, ...controller } = useController({ control, name: name as FieldPath<Data> });

  const data = { ...useWatch(), ...getValues() };
  return { ...controller, field: { ...field, value: get(data, name) } };
}

export default useWatchController;
