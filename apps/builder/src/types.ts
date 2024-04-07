export type Many<T> = T | T[];

export type Meta = {
  title: string;
  description: string | undefined;
};

export type Data = {
  id: string;
  title: string;
  style: string | undefined;
  pages: Page[];
};

export type Page = {
  id: string;
  meta: Meta;
  text: Text | undefined;
  group: Group | undefined;
};

export type Text = {
  title: string;
  description: string | undefined;
};

export type Group = {
  id: string;
  shuffle: boolean;
  questions: Question[];
};

export type Question<T = Modality> = {
  id: string;
  label: string;
  readonly: boolean;
  disabled: boolean;
  modality: T;
};

export enum ModalityType {
  DATE = 'DATE',
  SELECT = 'SELECT',
  SLIDER = 'SLIDER',
  TOGGLES = 'TOGGLES',
  TEXTAREA = 'TEXTAREA',
}

export type Modality = ModalityDate | ModalityToggles | ModalitySelect | ModalitySlider | ModalityTextarea;

export type ModalityRules = {
  min?: number;
  max?: number;
  required: boolean;
  minDate?: string;
  maxDate?: string;
  minLength?: number;
  maxLength?: number;
  minLengthArray?: number;
  maxLengthArray?: number;
};

export type ModalityDate = {
  type: ModalityType.DATE;
  rules: ModalityRules;
  defaultValue: string | undefined;
};

export type ModalityToggles = {
  type: ModalityType.TOGGLES;
  shuffle: boolean;
  rules: ModalityRules;
  options: Option[];
  defaultValue: Many<string> | undefined;
};

export type ModalitySlider = {
  type: ModalityType.SLIDER;
  min: number;
  max: number;
  step: number;
  rules: ModalityRules;
  defaultValue: number | undefined;
};

export type ModalitySelect = {
  type: ModalityType.SELECT;
  shuffle: boolean;
  placeholder: string;
  rules: ModalityRules;
  options: Option[];
  defaultValue: string | undefined;
};

export type ModalityTextarea = {
  type: ModalityType.TEXTAREA;
  rules: ModalityRules;
  defaultValue: string | undefined;
};

export type Option = {
  label: string;
  value: string;
};
