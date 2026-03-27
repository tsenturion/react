import type { LessonLabId } from './learning-model';

type StudyFile = {
  path: string;
  note: string;
};

type StudySnippet = {
  label: string;
  note: string;
  code: string;
};

export const projectStudyByLab: Record<
  LessonLabId,
  {
    files: readonly StudyFile[];
    snippets: readonly StudySnippet[];
  }
> = {
  'render-commit': {
    files: [
      {
        path: 'src/App.tsx',
        note: 'Главный shell урока и живая лаборатория для render/commit-потока.',
      },
      {
        path: 'src/lib/render-commit-model.ts',
        note: 'Чистая модель, которая считает signature, render summary и commit label.',
      },
      {
        path: 'src/components/rendering/ElementTreeView.tsx',
        note: 'Показывает React element tree до того, как commit коснётся DOM.',
      },
    ],
    snippets: [
      {
        label: 'buildRenderCommitReport',
        note: 'Render-фаза описана как чистая функция от controls.',
        code: `const report = buildRenderCommitReport({
  screen,
  density,
  showSidebar,
  revision,
});`,
      },
      {
        label: 'WorkspacePreview',
        note: 'Текущее описание UI строится прямо в этом проекте, а затем инспектируется как element tree.',
        code: `<WorkspacePreview
  screen={screen}
  density={density}
  showSidebar={showSidebar}
  showFilters={screen === 'catalog'}
/>`,
      },
    ],
  },
  triggers: {
    files: [
      {
        path: 'src/lib/rerender-trigger-model.ts',
        note: 'Модель дерева ререндеров и причин повторного вызова поддерева.',
      },
      {
        path: 'src/components/rendering-lab/RenderTreePreview.tsx',
        note: 'Рекурсивный визуализатор render-веток с признаками rerender/output change.',
      },
      {
        path: 'src/App.tsx',
        note: 'Интерактивные переключатели сценариев: local-state, parent-state, prop-change и same-input.',
      },
    ],
    snippets: [
      {
        label: 'Render trigger report',
        note: 'Один переключатель меняет не DOM напрямую, а модель причин ререндера.',
        code: `const report = buildRenderTriggerReport(trigger);

<RenderTreePreview tree={report.tree} />`,
      },
      {
        label: 'Tree node',
        note: 'Для каждой ветки отдельно хранится: была ли она вызвана и изменился ли output.',
        code: `type RenderTreeNode = {
  label: string;
  reason: string;
  rerendered: boolean;
  outputChanged: boolean;
  children?: RenderTreeNode[];
};`,
      },
    ],
  },
  purity: {
    files: [
      {
        path: 'src/components/rendering-lab/PuritySandbox.tsx',
        note: 'Ставит рядом чистый и нечистый компоненты.',
      },
      {
        path: 'src/components/rendering-lab/purity-registry.ts',
        note: 'Внешний mutable registry нужен как учебный контрпример side effect внутри render.',
      },
      {
        path: 'src/lib/purity-model.ts',
        note: 'Краткая предметная модель рисков при нарушении purity.',
      },
    ],
    snippets: [
      {
        label: 'Impure registry',
        note: 'Контрпример вынесен в отдельный файл, чтобы было видно: проблема именно во внешнем mutable состоянии.',
        code: `const impureRegistry: string[] = [];

export function pushImpureRegistry(label: string) {
  impureRegistry.push(label);
  return impureRegistry.length;
}`,
      },
      {
        label: 'Impure card',
        note: 'Даже один повторный render добавляет новую запись, хотя пользователь не совершал отдельного действия.',
        code: `const registryLength = useMemo(() => {
  return pushImpureRegistry(topic);
}, [pulse, topic]);`,
      },
    ],
  },
  idempotency: {
    files: [
      {
        path: 'src/components/rendering-lab/IdempotencyPair.tsx',
        note: 'Живое сравнение стабильного и нестабильного output при одинаковом input.',
      },
      {
        path: 'src/lib/idempotency-model.ts',
        note: 'Модель поясняет, почему same input должен давать same output.',
      },
      {
        path: 'src/App.tsx',
        note: 'Кнопка в родителе форсирует повторный render без изменения props пары.',
      },
    ],
    snippets: [
      {
        label: 'Stable vs unstable label',
        note: 'Тема idempotency выражена прямо в текущем коде компонента, а не только в тексте на экране.',
        code: `const stableLabel = \`\${topic.toUpperCase()} · \${topic.length} символов\`;
// eslint-disable-next-line react-hooks/purity -- учебный контрпример
const unstableLabel = \`\${topic.toUpperCase()} · \${Math.random().toFixed(4)}\`;`,
      },
      {
        label: 'Force rerender',
        note: 'Отдельный state в родителе нужен только для повторного render-прохода при тех же props.',
        code: `const [rerenderTick, setRerenderTick] = useState(0);

<button onClick={() => setRerenderTick((value) => value + 1)}>
  Force rerender with same input
</button>`,
      },
    ],
  },
  reconciliation: {
    files: [
      {
        path: 'src/lib/reconciliation-model.ts',
        note: 'Сравнивает before/after tree на уровне веток интерфейса.',
      },
      {
        path: 'src/components/rendering/ElementTreeView.tsx',
        note: 'Инспектирует React elements, а не браузерный DOM.',
      },
      {
        path: 'src/App.tsx',
        note: 'Лаборатория собирает before и after tree из реальных JSX-структур.',
      },
    ],
    snippets: [
      {
        label: 'Reconciliation report',
        note: 'Изменения считаются через before/after state, а не через ручные DOM-операции.',
        code: `const report = buildReconciliationReport(beforeState, afterState);

const beforeElement = <WorkspacePreview {...beforeState} />;
const afterElement = <WorkspacePreview {...afterState} />;`,
      },
      {
        label: 'Changed branches',
        note: 'Reconciliation работает по веткам описания UI.',
        code: `const changedBranches = [
  before.screen !== after.screen ? 'main-screen' : null,
  before.showFilters !== after.showFilters ? 'filters' : null,
  before.showSidebar !== after.showSidebar ? 'sidebar' : null,
].filter(Boolean);`,
      },
    ],
  },
  'extra-renders': {
    files: [
      {
        path: 'src/lib/render-cost-model.ts',
        note: 'Оценивает стоимость render-проходов и риск duplicated side effects.',
      },
      {
        path: 'src/App.tsx',
        note: 'Живые ползунки меняют объём работы и число повторных проходов.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests фиксируют ожидаемую предметную логику моделей урока.',
      },
    ],
    snippets: [
      {
        label: 'Render cost model',
        note: 'Даже чистый render может стать дорогим, если умножить тяжёлую работу на повторные проходы.',
        code: `const estimatedOperations =
  controls.items * controls.workPerItem * (controls.extraPasses + 1);

const duplicatedSideEffects = controls.sideEffectsInRender
  ? controls.extraPasses + 1
  : 0;`,
      },
      {
        label: 'Interactive controls',
        note: 'UI не просто показывает число, а даёт живо менять объём работы и видеть последствия.',
        code: `const report = buildRenderCostReport({
  items,
  workPerItem,
  extraPasses,
  sideEffectsInRender,
});`,
      },
    ],
  },
};
