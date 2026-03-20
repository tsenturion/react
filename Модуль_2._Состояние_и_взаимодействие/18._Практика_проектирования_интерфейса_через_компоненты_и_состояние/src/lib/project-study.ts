import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  decomposition: {
    files: [
      {
        path: 'src/components/interface-practice/ScreenDecompositionLab.tsx',
        note: 'Живая карта экрана и component tree для разных уровней декомпозиции.',
      },
      {
        path: 'src/lib/decomposition-model.ts',
        note: 'Чистая модель формулирует component boundaries и уровни детализации.',
      },
      {
        path: 'src/components/interface-practice/CourseWorkbench.tsx',
        note: 'Именно этот экран затем выступает реальным объектом декомпозиции.',
      },
    ],
    snippets: [
      {
        label: 'Balanced decomposition',
        note: 'Сбалансированный уровень обычно лучше всего подходит для первого прохода по экрану.',
        code: [
          '<CourseWorkbench>',
          '  <WorkbenchToolbar />',
          '  <WorkbenchBody>',
          '    <LessonGrid />',
          '    <LessonDetails />',
          '  </WorkbenchBody>',
          '</CourseWorkbench>',
        ].join('\n'),
      },
      {
        label: 'Component plan builder',
        note: 'Архитектура строится через отдельную pure model, а не захардкожена прямо в UI.',
        code: ['const plan = buildDecompositionPlan(level);'].join('\n'),
      },
    ],
  },
  truth: {
    files: [
      {
        path: 'src/components/interface-practice/SourceOfTruthLab.tsx',
        note: 'Сравнение хорошего и плохих сценариев source of truth на одном и том же экране.',
      },
      {
        path: 'src/components/interface-practice/CourseWorkbench.tsx',
        note: 'Хороший сценарий: owner state поднят в один экранный компонент.',
      },
      {
        path: 'src/lib/source-truth-model.ts',
        note: 'Чистая модель объясняет score, owners и симптомы архитектурного выбора.',
      },
    ],
    snippets: [
      {
        label: 'Single source of truth',
        note: 'Один owner state даёт общие данные для list, details и summary.',
        code: [
          'const [query, setQuery] = useState("");',
          'const [activeTrack, setActiveTrack] = useState<TrackFilter>("all");',
          'const [selectedId, setSelectedId] = useState(initialId);',
          'const [draftsById, setDraftsById] = useState(createDraftMap);',
        ].join('\n'),
      },
      {
        label: 'Duplicated selection anti-pattern',
        note: 'Дублирование selection в разных компонентах даёт визуальный drift.',
        code: [
          'const [gridSelectedId, setGridSelectedId] = useState("lesson-12");',
          'const [detailsSelectedId, setDetailsSelectedId] = useState("lesson-14");',
        ].join('\n'),
      },
    ],
  },
  classification: {
    files: [
      {
        path: 'src/components/interface-practice/DataDerivedEventsLab.tsx',
        note: 'Интерактивная лаборатория для различения data, state, derived values и events.',
      },
      {
        path: 'src/lib/data-flow-model.ts',
        note: 'Модель рассчитывает duplicated-state риски для выбранной конфигурации.',
      },
      {
        path: 'src/lib/workbench-model.ts',
        note: 'Файл с реальными derived вычислениями для итогового экрана.',
      },
    ],
    snippets: [
      {
        label: 'Derived values',
        note: 'filteredLessons и summary не живут отдельно, а вычисляются на render.',
        code: [
          'const visibleLessons = filterLessons(lessons, query, activeTrack);',
          'const summary = buildWorkbenchSummary(lessons, visibleLessons, selectedId);',
        ].join('\n'),
      },
      {
        label: 'Selected id over selected object',
        note: 'Минимальный state проще поддерживать и сложнее рассинхронизировать.',
        code: [
          'const [selectedId, setSelectedId] = useState(initialId);',
          'const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? null;',
        ].join('\n'),
      },
    ],
  },
  blueprint: {
    files: [
      {
        path: 'src/components/interface-practice/BlueprintWorkshopLab.tsx',
        note: 'Связывает текстовый бриф и архитектурный план экрана.',
      },
      {
        path: 'src/lib/blueprint-model.ts',
        note: 'Чистая модель переводит preset брифа в components, state, derived и events.',
      },
      {
        path: 'src/lib/interface-practice-domain.ts',
        note: 'В проекте лежат сами текстовые presets для практики архитектуры.',
      },
    ],
    snippets: [
      {
        label: 'Blueprint to architecture',
        note: 'Компоненты, state и events извлекаются из брифа отдельными слоями.',
        code: [
          'const plan = buildBlueprintPlan(presetId);',
          'plan.components;',
          'plan.state;',
          'plan.derived;',
          'plan.events;',
        ].join('\n'),
      },
      {
        label: 'Course console plan',
        note: 'Один из presets прямо совпадает с итоговым экраном этого урока.',
        code: [
          '<CourseWorkbench>',
          '  <WorkbenchToolbar />',
          '  <LessonGrid />',
          '  <LessonDetails />',
          '</CourseWorkbench>',
        ].join('\n'),
      },
    ],
  },
  flow: {
    files: [
      {
        path: 'src/components/interface-practice/InteractionLoopLab.tsx',
        note: 'Живая трассировка цепочки действие → state → render → UI.',
      },
      {
        path: 'src/components/interface-practice/CourseWorkbench.tsx',
        note: 'Экран отправляет trace-lines из обработчиков и render phase.',
      },
      {
        path: 'src/lib/interaction-flow-model.ts',
        note: 'Pure model формулирует структуру одного causality entry.',
      },
    ],
    snippets: [
      {
        label: 'Action tracing',
        note: 'Событие фиксируется в момент обработчика, до следующего рендера.',
        code: [
          'onTrace?.(`Action: выбран урок ${lessonId}.`);',
          'setSelectedId(lessonId);',
        ].join('\n'),
      },
      {
        label: 'Render tracing',
        note: 'После изменения state экран логирует уже пересчитанный render snapshot.',
        code: [
          'useEffect(() => {',
          '  onTrace?.(`Render: query="${query}", track="${activeTrack}", visible=${visibleLessons.length}.`);',
          '}, [activeTrack, onTrace, query, visibleLessons.length]);',
        ].join('\n'),
      },
    ],
  },
  demo: {
    files: [
      {
        path: 'src/components/interface-practice/ArchitectureMiniDemoLab.tsx',
        note: 'Итоговая лаборатория собирает все решения в один цельный экран.',
      },
      {
        path: 'src/components/interface-practice/CourseWorkbench.tsx',
        note: 'Главный файл урока: тут реальная компонентная архитектура экрана.',
      },
      {
        path: 'src/lib/workbench-model.ts',
        note: 'Derived computations и update helpers вынесены отдельно, чтобы экран не смешивал всё в одном компоненте.',
      },
    ],
    snippets: [
      {
        label: 'Top-level state owner',
        note: 'Верхний компонент держит только минимальный state, а остальное вычисляет.',
        code: [
          'const [lessons, setLessons] = useState(createLessonCatalog);',
          'const [query, setQuery] = useState("");',
          'const [activeTrack, setActiveTrack] = useState<TrackFilter>("all");',
          'const [selectedId, setSelectedId] = useState(lessons[0]?.id ?? "");',
          'const [draftsById, setDraftsById] = useState(createDraftMap);',
        ].join('\n'),
      },
      {
        label: 'Sibling composition',
        note: 'Компоненты получают данные и события через props, а не через локальные копии shared state.',
        code: [
          '<LessonGrid',
          '  lessons={visibleLessons}',
          '  selectedId={selectedLesson?.id ?? null}',
          '  onSelectLesson={handleSelectLesson}',
          '/>',
          '<LessonDetails',
          '  lesson={selectedLesson}',
          '  draft={selectedLesson ? draftsById[selectedLesson.id] ?? "" : ""}',
          '  onDraftChange={...}',
          '/>',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
