import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  minimal: {
    files: [
      {
        path: 'src/components/state-architecture/MinimalStatePlanner.tsx',
        note: 'Живой компонент хранит только raw tasks, query и режим фильтра, а всё остальное вычисляет.',
      },
      {
        path: 'src/lib/minimal-state-model.ts',
        note: 'Чистые функции урока показывают, какие значения действительно нужно хранить, а какие лучше производить.',
      },
      {
        path: 'src/pages/MinimalStatePage.tsx',
        note: 'Страница связывает реальный planner и объяснение минимального state.',
      },
    ],
    snippets: [
      {
        label: 'Derived counts',
        note: 'completed и visible не хранятся отдельно, а вычисляются из текущих tasks и query.',
        code: [
          'const visibleTasks = tasks.filter(matchesQuery);',
          'const completed = tasks.filter((task) => task.done).length;',
        ].join('\n'),
      },
      {
        label: 'Minimal state',
        note: 'В state остаются только raw данные и пользовательский ввод.',
        code: [
          'const [tasks, setTasks] = useState(createPlanningTasks);',
          'const [query, setQuery] = useState("");',
          'const [showDoneOnly, setShowDoneOnly] = useState(false);',
        ].join('\n'),
      },
    ],
  },
  derived: {
    files: [
      {
        path: 'src/components/state-architecture/DerivedStateDriftLab.tsx',
        note: 'Компонент строит хорошую и плохую архитектуру рядом: вычисляемые totals против сохранённой копии totals.',
      },
      {
        path: 'src/lib/derived-state-model.ts',
        note: 'Здесь лежат чистые расчёты totals и специальная bad-state ветка с рассинхроном.',
      },
      {
        path: 'src/pages/DerivedStatePage.tsx',
        note: 'Страница связывает mismatch в UI и его причину в структуре state.',
      },
    ],
    snippets: [
      {
        label: 'Derived summary',
        note: 'Summary вычисляется из lines, а не хранится параллельно в отдельном state.',
        code: [
          'const summary = calculatePricingSummary(lines);',
          'return <p>{summary.subtotal}</p>;',
        ].join('\n'),
      },
      {
        label: 'Bad duplicated totals',
        note: 'Отдельное storedSubtotal требует ручной синхронизации после каждого изменения lines.',
        code: [
          'const [state, setState] = useState({',
          '  lines,',
          '  storedSubtotal: 280,',
          '});',
        ].join('\n'),
      },
    ],
  },
  duplicate: {
    files: [
      {
        path: 'src/components/state-architecture/SelectionDriftLab.tsx',
        note: 'Компонент показывает, как duplicated selectedTitle расходится с реальными lessons.',
      },
      {
        path: 'src/lib/duplicate-state-model.ts',
        note: 'Чистые функции урока держат bad и good selection models отдельно.',
      },
      {
        path: 'src/pages/DuplicateStatePage.tsx',
        note: 'Страница связывает проблему duplicated state и архитектурное решение через selectedId.',
      },
    ],
    snippets: [
      {
        label: 'Single source of truth',
        note: 'Выбранная сущность производится по id, а не хранится отдельной копией.',
        code: [
          'const selectedLesson = lessons.find(',
          '  (lesson) => lesson.id === selectedId,',
          ');',
        ].join('\n'),
      },
      {
        label: 'Duplicated selection bug',
        note: 'selectedTitle существует отдельно от lessons и может устареть после rename или archive.',
        code: [
          'const [selectedTitle, setSelectedTitle] = useState("Минимальный state");',
        ].join('\n'),
      },
    ],
  },
  colocated: {
    files: [
      {
        path: 'src/components/state-architecture/ColocatedStateWorkbench.tsx',
        note: 'В проекте есть две реальные реализации: локальный state внутри карточки и hoisted state в родителе.',
      },
      {
        path: 'src/lib/colocated-state-model.ts',
        note: 'Модель формулирует, когда local state достаточно, а когда parent summary заставляет поднимать его вверх.',
      },
      {
        path: 'src/pages/ColocatedStatePage.tsx',
        note: 'Страница связывает colocated state и архитектурную цену unnecessary hoisting.',
      },
    ],
    snippets: [
      {
        label: 'Colocated leaf state',
        note: 'Если open нужен только карточке, он живёт прямо рядом с местом использования.',
        code: [
          'function Card() {',
          '  const [open, setOpen] = useState(false);',
          '}',
        ].join('\n'),
      },
      {
        label: 'Hoisted state',
        note: 'Когда знание нужно родителю и siblings, состояние поднимается к общему владельцу.',
        code: [
          'const [expandedById, setExpandedById] = useState({});',
          '<Card open={Boolean(expandedById[id])} onToggle={() => toggleId(id)} />',
        ].join('\n'),
      },
    ],
  },
  placement: {
    files: [
      {
        path: 'src/components/state-architecture/StatePlacementAdvisor.tsx',
        note: 'Интерактивный advisor строит рекомендацию по месту хранения состояния из архитектурных признаков.',
      },
      {
        path: 'src/lib/placement-model.ts',
        note: 'Здесь лежит decision model: derive, local, shared parent, normalized или server-owned.',
      },
      {
        path: 'src/pages/PlacementPage.tsx',
        note: 'Страница переводит архитектурные флаги в понятное решение о владельце состояния.',
      },
    ],
    snippets: [
      {
        label: 'Placement decision',
        note: 'Если значение derived, дублировать его в state не нужно.',
        code: [
          'if (scenario.derivedFromOtherState) {',
          '  return { target: "derive" };',
          '}',
        ].join('\n'),
      },
      {
        label: 'Shared owner',
        note: 'Если значение нужно siblings, его поднимают только до ближайшего общего владельца.',
        code: [
          'const [selectedId, setSelectedId] = useState(null);',
          '<Sidebar selectedId={selectedId} />',
          '<Details selectedId={selectedId} />',
        ].join('\n'),
      },
    ],
  },
  normalize: {
    files: [
      {
        path: 'src/components/state-architecture/NormalizedDirectoryLab.tsx',
        note: 'Компонент сравнивает duplicated directory и normalized directory на одном rename-сценарии.',
      },
      {
        path: 'src/lib/normalization-architecture-model.ts',
        note: 'Чистые функции урока показывают, как normalization убирает дублирование одной сущности в нескольких ветках.',
      },
      {
        path: 'src/pages/NormalizationArchitecturePage.tsx',
        note: 'Страница связывает normalization не только с данными, но и с устойчивой архитектурой UI.',
      },
    ],
    snippets: [
      {
        label: 'Normalized entity update',
        note: 'Teacher меняется в одном entity storage, а все представления читают его уже обновлённым.',
        code: [
          'teachersById: {',
          '  ...current.teachersById,',
          '  [teacherId]: { ...current.teachersById[teacherId], name: nextName },',
          '},',
        ].join('\n'),
      },
      {
        label: 'Duplicated entity copy',
        note: 'Если имя teacher живёт копиями в cards и spotlight, архитектура вынуждена синхронизировать их вручную.',
        code: [
          'cards: current.cards.map((card) =>',
          '  card.teacherId === teacherId ? { ...card, teacherName: nextName } : card,',
          '),',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
