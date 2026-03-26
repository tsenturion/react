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
        note: 'Shell урока сразу раскладывает тему на mental model, rollout, bailouts, profiling и итоговый playbook.',
      },
      {
        path: 'vite.config.ts',
        note: 'Compiler подключён в build pipeline проекта, а не вынесен только в теоретический текст.',
      },
      {
        path: 'eslint.config.js',
        note: 'Lint сразу отражает compiler-aware diagnostics через `recommended-latest` preset.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты урока разделяют тему по практическим сценариям: автоматическая мемоизация, config, bailouts, profiling и rollout.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/compiler-overview?focus=all' },
  { id: 'automatic', href: '/automatic-memoization' },
  { id: 'configuration', href: '/compiler-configuration-and-rollout' },
  { id: 'bailouts', href: '/compiler-bailouts-and-limits' },
  { id: 'profiling', href: '/compiler-profiling-and-debugging' },
  { id: 'playbook', href: '/compiler-playbook' },
] as const;`,
      },
      {
        label: 'Real compiler setup',
        note: 'Тема урока выражена прямо в `vite.config.ts`: компилятор включён не декларативно “на словах”, а в реальном build config.',
        code: `const reactCompilerPlugin = [
  'babel-plugin-react-compiler',
  {
    compilationMode: 'infer',
    panicThreshold: 'none',
  },
] as const;`,
      },
    ],
  },
  automatic: {
    files: [
      {
        path: 'src/components/compiler-labs/AutomaticMemoizationLab.tsx',
        note: 'Интерактивное сравнение manual memoization, compiler-friendly кода и over-memoized варианта.',
      },
      {
        path: 'src/lib/compiler-comparison-model.ts',
        note: 'Чистая модель сравнения стратегий и их profiling-like метрик.',
      },
      {
        path: 'src/components/compiler-labs/AutomaticMemoizationLab.test.tsx',
        note: 'Проверяет, что lab действительно переключает сценарии и выводит реакцию модели.',
      },
    ],
    snippets: [
      {
        label: 'Manual vs compiler-ready',
        note: 'Проект показывает, что compiler-friendly код часто даёт сопоставимый результат без лишнего шума из ручной мемоизации.',
        code: `const visibleCards = useMemo(
  () => filterCards(cards, query, onlyErrors),
  [cards, query, onlyErrors],
);

// vs

const visibleCards = filterCards(cards, query, onlyErrors);`,
      },
      {
        label: 'Strategy report',
        note: 'Сравнение идёт не по вкусу кода, а по expected rerenders, avg commit time и cognitive load.',
        code: `return [
  { id: 'manual', rerenders: 11, avgCommitMs: 24.1, codeNoise: 'high' },
  { id: 'compiler-ready', rerenders: 10, avgCommitMs: 22.8, codeNoise: 'low' },
  { id: 'over-memoized', rerenders: 10, avgCommitMs: 23.2, codeNoise: 'high' },
];`,
      },
    ],
  },
  configuration: {
    files: [
      {
        path: 'vite.config.ts',
        note: 'Здесь подключается `babel-plugin-react-compiler`.',
      },
      {
        path: 'eslint.config.js',
        note: 'Здесь включён `eslint-plugin-react-hooks` в режиме `recommended-latest`.',
      },
      {
        path: 'src/lib/compiler-rollout-model.ts',
        note: 'Модель rollout plan, config snippet и первого surface для внедрения.',
      },
    ],
    snippets: [
      {
        label: 'Compiler plugin',
        note: 'Минимальная реальная конфигурация проекта включена прямо в Vite build pipeline.',
        code: `react({
  babel: {
    plugins: [[
      'babel-plugin-react-compiler',
      {
        compilationMode: 'infer',
        panicThreshold: 'none',
      },
    ]],
  },
})`,
      },
      {
        label: 'Compiler-aware lint',
        note: 'Линтер помогает увидеть bailout diagnostics до того, как проблема проявится только в runtime profiling.',
        code: `export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
);`,
      },
    ],
  },
  bailouts: {
    files: [
      {
        path: 'src/components/compiler-labs/CompilerBailoutsLab.tsx',
        note: 'Sandbox для impure render, mutable props, context blast radius и library boundaries.',
      },
      {
        path: 'src/lib/compiler-limitations-model.ts',
        note: 'Чистая карта bailouts и объяснение, что нужно исправлять в коде.',
      },
      {
        path: 'eslint.config.js',
        note: 'Compiler rules в линтере подчёркивают связь bailouts с purity, refs, immutability и unsupported syntax.',
      },
    ],
    snippets: [
      {
        label: 'Impure render bailout',
        note: 'Проект показывает типичный пример, где компилятор не должен оптимизировать компонент.',
        code: `function ClockCard() {
  auditStore.lastRender = Date.now();
  return <div>{auditStore.lastRender}</div>;
}`,
      },
      {
        label: 'Architecture gap',
        note: 'Отдельной веткой выделено то, что compiler не исправляет в принципе: data waterfalls и giant effects.',
        code: `useEffect(() => {
  fetchSummary();
  fetchRows();
  fetchAudit();
}, [projectId]);`,
      },
    ],
  },
  profiling: {
    files: [
      {
        path: 'src/components/compiler-labs/ProfilingDebugLab.tsx',
        note: 'Интерактивный profiler workflow для сравнения commit cost до и после.',
      },
      {
        path: 'src/lib/compiler-profiler-model.ts',
        note: 'Модель commit duration, rerender counts и trace breakdown.',
      },
      {
        path: 'src/components/compiler-labs/ProfilingDebugLab.test.tsx',
        note: 'Проверка того, что переключатели compiler/manual memo действительно меняют report.',
      },
    ],
    snippets: [
      {
        label: 'Profiler report',
        note: 'Лаборатория считает commit cost и rerenders для одного и того же interaction path.',
        code: `const compilerFactor = input.compilerEnabled ? 0.68 : 1;
const manualFactor = input.manualMemoKept ? 0.93 : 1;
const combinedFactor = compilerFactor * manualFactor;`,
      },
      {
        label: 'Workflow',
        note: 'Порядок работы фиксирован: сначала симптом, потом profiler, потом compiler, потом повторная проверка.',
        code: `[
  'Сначала зафиксируйте interaction, где lag реально заметен пользователю.',
  'Откройте React Profiler и посмотрите commit duration.',
  'После включения compiler повторите тот же сценарий.',
]`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/compiler-labs/CompilerPlaybookLab.tsx',
        note: 'Итоговый chooser стратегии внедрения по форме продукта и уровню риска.',
      },
      {
        path: 'src/lib/compiler-playbook-model.ts',
        note: 'Чистая модель rollout strategy без привязки к конкретному UI.',
      },
      {
        path: 'README.md',
        note: 'README отдельно фиксирует границу между автоматической оптимизацией и архитектурной работой.',
      },
    ],
    snippets: [
      {
        label: 'Low-confidence rollout',
        note: 'Если команда или ecosystem ещё не готовы, project playbook предлагает постепенный rollout, а не массовую миграцию.',
        code: `if (input.compilerConfidence === 'low' || input.adoptionRisk === 'high') {
  return {
    title: 'Нужен постепенный rollout с проверкой гипотез',
    tone: 'warn',
  };
}`,
      },
      {
        label: 'Architecture reminder',
        note: 'Даже в положительном сценарии playbook оставляет явную оговорку: compiler не отменяет архитектурную работу.',
        code: `watchouts: [
  'Продолжайте инвестировать в architecture.',
  'Оставляйте ручные оптимизации там, где библиотечный контракт этого требует.',
]`,
      },
    ],
  },
};
