import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока раскладывает тему по практическим поверхностям advanced typing.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Route map и модель лабораторий текущего урока.',
      },
      {
        path: 'src/lib/advanced-typing-overview-domain.ts',
        note: 'Карта идей и типичных ошибок вокруг reducers, generics и shared primitives.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты отражают конкретные слои advanced typing, а не абстрактный набор теории.',
        code: `export const lessonLabs = [
  { id: 'reducers', href: '/typed-reducers-and-unions' },
  { id: 'generics', href: '/generic-components-and-apis' },
  { id: 'polymorphic', href: '/polymorphic-components' },
  { id: 'design-system', href: '/design-system-typing' },
] as const;`,
      },
      {
        label: 'Focus parser',
        note: 'Даже обзор строится на явной union-модели query focus.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'reducers':
    case 'generics':
      return value;
    default:
      return 'all';
  }
}`,
      },
    ],
  },
  reducers: {
    files: [
      {
        path: 'src/components/advanced-types-labs/ReducerUnionLab.tsx',
        note: 'Живой editor flow на `useReducer` и action union.',
      },
      {
        path: 'src/lib/reducer-union-model.ts',
        note: 'Pure reducer model и typed snippets.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Reducer transitions проверяются unit-тестами.',
      },
    ],
    snippets: [
      {
        label: 'Action union',
        note: 'Reducer получает конечный набор transitions, а не свободный payload.',
        code: `type ComposerAction =
  | { type: 'select-kind'; kind: ComposerKind }
  | { type: 'update-title'; value: string }
  | { type: 'add-checklist-item'; label: string }
  | { type: 'add-approver'; name: string };`,
      },
      {
        label: 'Branch narrowing',
        note: 'Type narrowing не даёт случайно обновить поле чужой ветки editor state.',
        code: `case 'update-message':
  if (state.editor.kind !== 'announcement') {
    return state;
  }
  return {
    ...state,
    editor: { ...state.editor, message: action.value },
  };`,
      },
    ],
  },
  generics: {
    files: [
      {
        path: 'src/components/advanced-types-labs/GenericComponentsLab.tsx',
        note: 'Generic list primitive и scenario-specific detail panels.',
      },
      {
        path: 'src/lib/generic-components-model.ts',
        note: 'Scenario descriptors, entity shapes и reusable helpers.',
      },
      {
        path: 'src/components/advanced-types-labs/GenericComponentsLab.test.tsx',
        note: 'Компонентный тест на generic-сценарии и фильтрацию.',
      },
    ],
    snippets: [
      {
        label: 'Generic list contract',
        note: 'Reusable API описывает форму взаимодействия, а не прячет доменную модель.',
        code: `type ExplorerListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  renderPrimary: (item: T) => ReactNode;
  renderMeta: (item: T) => ReactNode;
  onSelect: (item: T) => void;
};`,
      },
      {
        label: 'Scenario descriptor',
        note: 'Каждая сущность приносит свои selectors, но list primitive остаётся одним.',
        code: `const endpointScenario: ScenarioDescriptor<EndpointRecord> = {
  getId: (item) => item.id,
  getLabel: (item) => item.path,
  getMeta: (item) => \`\${item.owner} · \${item.latencyMs}ms\`,
};`,
      },
    ],
  },
  polymorphic: {
    files: [
      {
        path: 'src/components/advanced-types-labs/PolymorphicComponentsLab.tsx',
        note: 'Typed `as`-pattern и live semantics switch между button, anchor и label.',
      },
      {
        path: 'src/lib/polymorphic-components-model.ts',
        note: 'Polymorphic helper snippets и semantic cases.',
      },
      {
        path: 'src/components/ui.tsx',
        note: 'Обычные UI helpers урока остаются non-polymorphic, чтобы показать границы применения pattern.',
      },
    ],
    snippets: [
      {
        label: 'Polymorphic helper',
        note: 'Typed helper соединяет own props primitive и props выбранного элемента.',
        code: `type PolymorphicProps<T extends ElementType, OwnProps> =
  OwnProps & {
    as?: T;
  } & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;`,
      },
      {
        label: 'Loose anti-pattern',
        note: 'Свободный `any` размывает semantics и перестаёт подсказывать корректные props.',
        code: `function Primitive({ as, ...rest }: any) {
  const Comp = as || 'div';
  return <Comp {...rest} />;
}`,
      },
    ],
  },
  'design-system': {
    files: [
      {
        path: 'src/components/advanced-types-labs/DesignSystemTypingLab.tsx',
        note: 'Recipe union и live preview primitive.',
      },
      {
        path: 'src/lib/design-system-typing-model.ts',
        note: 'Token maps, recipes и helpers для design-system typing.',
      },
      {
        path: 'src/components/advanced-types-labs/DesignSystemTypingLab.test.tsx',
        note: 'Тест на смену recipe modes и loading state.',
      },
    ],
    snippets: [
      {
        label: 'Recipe union',
        note: 'Primitive различает action и link режимы прямо на уровне контракта.',
        code: `type PrimitiveRecipe =
  | (RecipeBase & { mode: 'action'; buttonLabel: string })
  | (RecipeBase & { mode: 'link'; buttonLabel: string; href: string; external: boolean });`,
      },
      {
        label: 'Token map',
        note: 'Variant names связаны с class maps через `Record`, а не живут строками в нескольких местах.',
        code: `const toneToken: Record<RecipeTone, string> = {
  brand: 'bg-sky-700 text-white border-sky-700',
  neutral: 'bg-white text-slate-900 border-slate-300',
  danger: 'bg-rose-100 text-rose-950 border-rose-300',
};`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/advanced-types-labs/AdvancedTypingPlaybookLab.tsx',
        note: 'Chooser стратегии rollout по pain point и масштабу внедрения.',
      },
      {
        path: 'src/lib/advanced-typing-playbook-model.ts',
        note: 'Pure recommendation model для advanced typing rollout.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует границы пользы advanced typing и anti-pattern overengineering.',
      },
    ],
    snippets: [
      {
        label: 'State-machine branch',
        note: 'Если боль идёт из экранной логики, стратегия советует начать с reducer unions.',
        code: `if (input.pain === 'state-machine') {
  return {
    title: 'Начните с typed reducer и state unions',
    tone: 'warn',
  };
}`,
      },
      {
        label: 'Design-system branch',
        note: 'Если команда владеет shared layer, advanced typing смещается к recipes и token maps.',
        code: `if (input.pain === 'design-system' || input.ownsDesignSystem) {
  return {
    title: 'Соберите token maps и recipe unions вокруг shared primitives',
    tone: 'success',
  };
}`,
      },
    ],
  },
};
