import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  cn,
  Drag,
  Input,
  Plus,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  Trash,
} from '@react-survey/ui';
import { FieldPath, FieldValues, FormProvider, useForm } from 'react-hook-form';
import {
  Data,
  Group,
  Meta,
  Modality,
  ModalityDate,
  ModalitySelect,
  ModalitySlider,
  ModalityTextarea,
  ModalityToggles,
  ModalityType,
  Page,
  Question,
  Text,
} from '@/types';
import useWatchController from '@/hooks/useWatchController';
import { AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import Separator from '@/components/separator';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useMount } from 'react-use';
import { Row, RowLabel, RowField } from '@/components/row';
import { v4 as uuid } from 'uuid';
import React from 'react';
import DateModality from '@/modalities/date.modality';
import SelectModality from '@/modalities/select.modality';
import SliderModality from '@/modalities/slider.modality';
import TextareaModality from '@/modalities/textarea.modality';
import TogglesModality from '@/modalities/toggles.modality';
import { createContext } from '@radix-ui/react-context';

/** -----------------------------------------------------------
 * Context
 * --------------------------------------------------------- */

type VisualContextValue = {
  editId: string;
  mounted: boolean;
  setEditId(id: string): void;
};

const [VisualContextProviderDef, useVisualContextDef] = createContext<VisualContextValue>('VisualContext');

const VisualContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [id, setId] = React.useState<string>('');
  const [mounted, setMounted] = React.useState<boolean>(false);

  useMount(() => setMounted(true));

  return (
    <VisualContextProviderDef editId={id} mounted={mounted} setEditId={setId}>
      {children}
    </VisualContextProviderDef>
  );
};

const useVisualContext = (): VisualContextValue => useVisualContextDef('VisualContext');

/** -----------------------------------------------------------
 * Root
 * --------------------------------------------------------- */

const VisualRoot: React.FC = React.memo(() => {
  const methods = useForm<Data>({ mode: 'onChange', defaultValues: { id: uuid(), title: 'Survey', pages: [] } });

  return (
    <FormProvider {...methods}>
      <VisualContextProvider>
        <div className="relative flex h-screen w-full">
          <VisualSidebar />
          <VisualContent />
        </div>
      </VisualContextProvider>
    </FormProvider>
  );
});

/** -----------------------------------------------------------
 * Sidebar
 * --------------------------------------------------------- */

const VisualSidebar: React.FC = () => {
  const { setEditId } = useVisualContext();
  const { field } = useWatchController('pages');

  const onReorder = (items: unknown[]): void => {
    field.onChange(items as Page[]);
  };

  const onRemove = (id: string): void => {
    field.onChange(field.value.filter((page: Page) => page.id !== id));
  };

  const addPage = (): void => {
    const id = uuid();
    field.onChange([
      ...field.value,
      {
        id,
        text: undefined,
        group: undefined,
        meta: { title: 'Untitled', description: undefined },
      },
    ]);
    setEditId(id);
  };

  return (
    <ScrollArea.Root
      className={cn([
        'pt-16',
        'relative',
        'shrink-0',
        'h-screen w-96',
        'bg-neutral-100',
        'transition-all',
        'overflow-hidden',
        'border-r border-neutral-200',
        'dark:border-neutral-700',
        'dark:bg-neutral-950/50',
      ])}
    >
      <ScrollArea.Viewport className="h-full w-full p-6">
        <Reorder.Group axis="y" values={field.value} onReorder={onReorder} className="grid w-full space-y-6">
          <AnimatePresence>
            {field.value.map((page: Page, index: number) => (
              <VisualPage key={page.id} name={`pages.${index}`} onRemove={() => onRemove(page.id)} />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex w-1 touch-none select-none pt-16">
        <ScrollArea.Thumb
          className={cn([
            'flex-1',
            'relative',
            'bg-neutral-200',
            'transition-colors',
            'before:w-full',
            'before:h-full',
            'before:top-1/2',
            'before:left-1/2',
            'before:min-h-10',
            'before:absolute',
            'before:content-[""]',
            'before:-translate-x-1/2',
            'before:-translate-y-1/2',
            'dark:bg-neutral-700',
          ])}
        />
      </ScrollArea.Scrollbar>
      <Button size="icon" onClick={addPage} className="absolute bottom-4 right-4">
        <Plus />
      </Button>
    </ScrollArea.Root>
  );
};

/** -----------------------------------------------------------
 * Page
 * --------------------------------------------------------- */

type VisualPageProps = {
  name: FieldPath<FieldValues>;
  onRemove(): void;
};

const VisualPage: React.FC<VisualPageProps> = ({ name, onRemove }) => {
  const dragControls = useDragControls();
  const { editId, mounted, setEditId } = useVisualContext();
  const { field } = useWatchController(name);

  const toggleEdit = () => {
    setEditId(editId !== field.value.id ? field.value.id : '');
  };

  const onDrag = (event: React.PointerEvent) => {
    dragControls.start(event);
    event.preventDefault();
  };

  const handleRemove = (evt: React.MouseEvent) => {
    if (editId === field.value.id) setEditId('');
    evt.stopPropagation();
    onRemove();
  };

  if (!field.value) return null;

  return (
    <Reorder.Item
      value={field.value}
      dragListener={false}
      dragControls={dragControls}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, marginTop: 0, height: 0 }}
      initial={mounted ? { opacity: 0, height: 0 } : false}
    >
      <Card
        className={cn([
          'flex',
          'group',
          'w-full',
          'relative',
          'aspect-video',
          'transition-all',
          'ring-2 ring-transparent',
          editId === field.value.id && 'ring-blue-500 dark:ring-blue-500',
        ])}
      >
        <div
          onPointerDown={onDrag}
          className={cn(['flex', 'h-full w-6', 'cursor-grab', 'transition-all', 'text-neutral-900', 'dark:text-white'])}
        >
          <Drag className="m-auto h-4 w-4" />
        </div>
        <div
          className={cn([
            'p-4',
            'h-full',
            'transition-all',
            'text-neutral-900',
            'flex flex-grow flex-col gap-2',
            'dark:text-white',
          ])}
          onClick={toggleEdit}
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRemove}
            className={cn([
              'opacity-0',
              'transition-all',
              'text-neutral-900',
              'pointer-events-none',
              'absolute right-2 top-2',
              'group-hover:opacity-100',
              'group-hover:pointer-events-auto',
              'dark:text-white',
            ])}
          >
            <Trash />
          </Button>
          <span className="h-10 text-sm font-semibold">{field.value.meta.title}</span>
          {field.value.text && (
            <div
              className={cn([
                'p-2',
                'w-full',
                'rounded-md',
                'text-center',
                'bg-neutral-100',
                'transition-all',
                'text-neutral-900',
                'dark:bg-neutral-800',
                'dark:text-white',
              ])}
            >
              Text
            </div>
          )}
          {field.value.group && (
            <div
              className={cn([
                'p-2',
                'w-full',
                'rounded-md',
                'text-center',
                'bg-neutral-100',
                'transition-all',
                'text-neutral-900',
                'dark:bg-neutral-800',
                'dark:text-white',
              ])}
            >
              Group
            </div>
          )}
        </div>
      </Card>
    </Reorder.Item>
  );
};

/** -----------------------------------------------------------
 * Content
 * --------------------------------------------------------- */

const VisualContent: React.FC = () => (
  <ScrollArea.Root className="flex h-full flex-grow bg-neutral-50 pt-16 transition-colors dark:bg-neutral-950/20">
    <ScrollArea.Viewport className="h-full w-full">
      <VisualPageEdit />
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar className="flex w-1 touch-none select-none pt-16">
      <ScrollArea.Thumb
        className={cn([
          'flex-1',
          'relative',
          'bg-neutral-200',
          'transition-colors',
          'before:w-full',
          'before:h-full',
          'before:top-1/2',
          'before:left-1/2',
          'before:min-h-10',
          'before:absolute',
          'before:content-[""]',
          'before:-translate-x-1/2',
          'before:-translate-y-1/2',
          'dark:bg-neutral-700',
        ])}
      />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
);

/** -----------------------------------------------------------
 * Page Edit
 * --------------------------------------------------------- */

const VisualPageEdit: React.FC = () => {
  const { editId } = useVisualContext();
  const { field } = useWatchController('pages');
  const index = field.value.findIndex((page: Page) => page.id === editId);

  return <VisualPageEditForm key={field.value.length} index={index} />;
};

const VisualPageEditForm: React.FC<{ index: number }> = ({ index }) => {
  const { field } = useWatchController(`pages.${index}`);

  const onMetaChange = (meta: Meta): void => {
    field.onChange({ ...field.value, meta });
  };

  const onTextChange = (text: Text | undefined): void => {
    field.onChange({ ...field.value, text });
  };

  const onGroupChange = (group: Group | undefined): void => {
    field.onChange({ ...field.value, group });
  };

  if (index < 0) return null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <EditMeta value={field.value.meta} onChange={onMetaChange} />
      <EditText value={field.value.text} onChange={onTextChange} />
      <EditGroup value={field.value.group} onChange={onGroupChange} />
    </div>
  );
};

/** -----------------------------------------------------------
 * Edit Meta
 * --------------------------------------------------------- */

const EditMeta: React.FC<{ value: Meta; onChange: (meta: Meta) => void }> = ({ value, onChange }) => {
  const onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...value, title: evt.target.value });
  };

  const onDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onChange({ ...value, description: evt.target.value });
  };

  return (
    <Card className="flex flex-col gap-x-2 gap-y-1 p-6">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-neutral-900 transition-all dark:text-white">Page information</span>
        <span className="text-sm italic text-neutral-500">Not visible in production</span>
      </div>
      <Row>
        <RowLabel className="w-52">Title</RowLabel>
        <RowField>
          <Input value={value.title} onChange={onTitleChange} />
        </RowField>
      </Row>
      <Row>
        <RowLabel className="w-52">Description</RowLabel>
        <RowField>
          <Textarea value={value.description} onChange={onDescriptionChange} />
        </RowField>
      </Row>
    </Card>
  );
};

/** -----------------------------------------------------------
 * Edit Text
 * --------------------------------------------------------- */

type EditTextProps = {
  value: Text;
  onChange(text: Text | undefined): void;
};

const EditText: React.FC<EditTextProps> = ({ value, onChange }) => {
  const reset = () => onChange(undefined);

  const init = () => onChange({ title: '', description: undefined });

  const onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...value, title: evt.target.value });
  };

  const onDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onChange({ ...value, description: evt.target.value });
  };

  if (value === undefined) {
    return (
      <button
        type="button"
        onClick={init}
        className={cn([
          'uppercase',
          'rounded-md',
          'h-10 w-full',
          'font-semibold',
          'transition-all',
          'text-xs text-neutral-900',
          'flex items-center justify-center',
          'border-2 border-dashed border-neutral-200',
          'dark:border-neutral-700',
          'dark:text-white',
        ])}
      >
        Ajouter un bloc de text
      </button>
    );
  }

  return (
    <Card className="flex flex-col gap-x-2 gap-y-1 p-6">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-neutral-900 transition-all dark:text-white">Text bloc</span>
        <span className="">
          <Button variant="ghost" size="icon" onClick={reset}>
            <Trash />
          </Button>
        </span>
      </div>
      <Row>
        <RowLabel className="w-52">Title</RowLabel>
        <RowField>
          <Input value={value.title} onChange={onTitleChange} />
        </RowField>
      </Row>
      <Row>
        <RowLabel className="w-52">Description</RowLabel>
        <RowField>
          <Textarea value={value.description} onChange={onDescriptionChange} />
        </RowField>
      </Row>
    </Card>
  );
};

/** -----------------------------------------------------------
 * Edit Group
 * --------------------------------------------------------- */

type EditGroupProps = {
  value: Group;
  onChange(group: Group | undefined): void;
};

const EditGroup: React.FC<EditGroupProps> = ({ value, onChange }) => {
  const init = () => onChange({ id: uuid(), shuffle: false, questions: [] });

  const reset = () => onChange(undefined);

  if (value === undefined) {
    return (
      <button
        type="button"
        onClick={init}
        className={cn([
          'uppercase',
          'rounded-md',
          'h-10 w-full',
          'font-semibold',
          'transition-all',
          'text-xs text-neutral-900',
          'flex items-center justify-center',
          'border-2 border-dashed border-neutral-200',
          'dark:border-neutral-700',
          'dark:text-white',
        ])}
      >
        Ajouter un groupe de questions
      </button>
    );
  }

  const addQuestion = () => {
    onChange({
      ...value,
      questions: [
        ...value.questions,
        {
          label: '',
          id: uuid(),
          readonly: false,
          disabled: false,
          modality: {
            type: ModalityType.TEXTAREA,
            rules: { required: false },
            defaultValue: undefined,
          },
        },
      ],
    });
  };

  const onShuffleChange = (shuffle: boolean): void => {
    onChange({ ...value, shuffle });
  };

  const onQuestionsChange = (questions: Question[]): void => {
    onChange({ ...value, questions });
  };

  return (
    <Card className="flex flex-col gap-x-2 gap-y-1 p-6">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-neutral-900 transition-colors dark:text-white">Questions</span>
        <span className="">
          <Button variant="ghost" size="icon" onClick={reset}>
            <Trash />
          </Button>
        </span>
      </div>
      <Row>
        <RowLabel className="w-52">Randomize questions</RowLabel>
        <RowField>
          <Switch checked={value.shuffle} onCheckedChange={onShuffleChange} />
        </RowField>
      </Row>
      <EditGroupQuestions value={value.questions} onChange={onQuestionsChange} />
      <Button variant="outline" className="mt-4 w-fit" onClick={addQuestion}>
        <Plus />
        Ajouter une questions
      </Button>
    </Card>
  );
};

/** -----------------------------------------------------------
 * Edit Group Questions
 * --------------------------------------------------------- */

type EditGroupQuestions = {
  value: Question[];
  onChange(questions: Question[]): void;
};

const EditGroupQuestions: React.FC<EditGroupQuestions> = ({ value, onChange }) => {
  const onRemove = (id: string) => {
    onChange(value.filter((question: Question) => question.id !== id));
  };

  const onQuestionChange = (question: Question): void => {
    onChange(value.map((datum) => (question.id === datum.id ? question : datum)));
  };

  return (
    <Accordion type="multiple">
      {value.map((question: Question) => (
        <EditGroupQuestion
          key={question.id}
          value={question}
          onChange={onQuestionChange}
          onRemove={() => onRemove(question.id)}
        />
      ))}
    </Accordion>
  );
};

/** -----------------------------------------------------------
 * Edit Group Question
 * --------------------------------------------------------- */

type EditGroupQuestionProps = {
  value: Question;
  onRemove: () => void;
  onChange: (question: Question) => void;
};

const EditGroupQuestion: React.FC<EditGroupQuestionProps> = ({ value, onChange, onRemove }) => {
  const onLabelChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...value, label: evt.target.value });
  };

  const onModalityChange = (modality: Modality): void => {
    onChange({ ...value, modality });
  };

  const onReadonlyChange = (readonly: boolean): void => {
    onChange({ ...value, readonly });
  };

  return (
    <AccordionItem value={value.id}>
      <AccordionTrigger className="flex items-center gap-3">
        <span className="w-24 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-500">
          {value.modality.type}
        </span>
        <span>{value.label || 'Untitled'}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-x-2 gap-y-1 rounded-md bg-neutral-50 p-8 transition-colors dark:bg-neutral-800">
          <Row>
            <RowLabel className="w-44">Label</RowLabel>
            <RowField>
              <Input value={value.label || ''} onChange={onLabelChange} />
            </RowField>
          </Row>
          <Row>
            <RowLabel className="w-44">Readonly</RowLabel>
            <RowField>
              <Switch checked={value.readonly} onCheckedChange={onReadonlyChange} />
            </RowField>
          </Row>
          <Separator />
          <EditGroupQuestionModality value={value.modality} onChange={onModalityChange} />
          <Separator />
          <Button variant="link" size="sm" className="ml-auto w-fit text-red-500 dark:text-red-500" onClick={onRemove}>
            Supprimer
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

/** -----------------------------------------------------------
 * Edit Group Question Modality
 * --------------------------------------------------------- */

type EditGroupQuestionModalityProps = {
  onChange: (modality: Modality) => void;
  value: Modality;
};

const DEFAULT_MODALITY: Record<ModalityType, Modality> = {
  [ModalityType.TEXTAREA]: {
    type: ModalityType.TEXTAREA,
    rules: { required: false },
    defaultValue: undefined,
  },
  [ModalityType.TOGGLES]: {
    type: ModalityType.TOGGLES,
    rules: { required: false },
    defaultValue: undefined,
    options: [{ label: '', value: '1' }],
    shuffle: false,
  },
  [ModalityType.SELECT]: {
    type: ModalityType.SELECT,
    rules: { required: false },
    defaultValue: undefined,
    placeholder: 'Séléctionner une option',
    options: [{ label: '', value: '1' }],
    shuffle: false,
  },
  [ModalityType.SLIDER]: {
    type: ModalityType.SLIDER,
    rules: { required: false },
    defaultValue: undefined,
    step: 1,
    min: 0,
    max: 100,
  },
  [ModalityType.DATE]: {
    type: ModalityType.DATE,
    rules: { required: false },
    defaultValue: undefined,
  },
};

const EditGroupQuestionModality: React.FC<EditGroupQuestionModalityProps> = ({ value, onChange }) => {
  const onTypeChange = (type: ModalityType): void => {
    onChange({ ...value, ...DEFAULT_MODALITY[type] });
  };

  return (
    <div className="grid gap-x-2 gap-y-1">
      <Row>
        <RowLabel className="w-44">Type</RowLabel>
        <RowField>
          <Select value={value.type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModalityType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RowField>
      </Row>
      <Separator />
      {{
        [ModalityType.DATE]: <DateModality value={value as ModalityDate} onChange={onChange} />,
        [ModalityType.SELECT]: <SelectModality value={value as ModalitySelect} onChange={onChange} />,
        [ModalityType.SLIDER]: <SliderModality value={value as ModalitySlider} onChange={onChange} />,
        [ModalityType.TOGGLES]: <TogglesModality value={value as ModalityToggles} onChange={onChange} />,
        [ModalityType.TEXTAREA]: <TextareaModality value={value as ModalityTextarea} onChange={onChange} />,
      }[value.type] || null}
    </div>
  );
};

/** -----------------------------------------------------------
 * Display Names
 * --------------------------------------------------------- */

VisualRoot.displayName = 'Visual';

/** -----------------------------------------------------------
 * Exports
 * --------------------------------------------------------- */

export default VisualRoot;
