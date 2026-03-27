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
        note: 'Shell урока сам организует tooling workflow как набор route-level сценариев.',
      },
      {
        path: 'src/lib/devtools-overview-model.ts',
        note: 'Карта темы, фильтры overview и сравнение ролей инструментов.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Навигационная модель урока: пути, подписи лабораторий и их фокусы.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Фокус overview хранится в URL, а не в локальном состоянии страницы. Так обзор сам становится примером диагностируемого route-state.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'inspection':
    case 'lint':
    case 'rules':
    case 'debugging':
    case 'quality':
      return value;
    default:
      return 'all';
  }
}`,
      },
      {
        label: 'Lesson lab map',
        note: 'Структура урока сразу делит tooling по сценариям: inspection, lint, rules, debugging flow и quality system.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/tooling-overview?focus=all' },
  { id: 'devtools', href: '/devtools-inspector' },
  { id: 'lint', href: '/lint-rules' },
  { id: 'rules', href: '/rules-of-react' },
  { id: 'debug', href: '/debugging-workflow' },
  { id: 'quality', href: '/quality-control-system' },
] as const;`,
      },
    ],
  },
  devtools: {
    files: [
      {
        path: 'src/components/tooling-labs/DevToolsInspectorLab.tsx',
        note: 'Живой sandbox для props/state/context snapshot и render reasons.',
      },
      {
        path: 'src/lib/devtools-inspector-model.ts',
        note: 'Чистая модель объяснения рендера для разных узлов дерева.',
      },
      {
        path: 'src/pages/DevToolsInspectorPage.tsx',
        note: 'Страница связывает интерактивную инспекцию с кодом текущего проекта.',
      },
    ],
    snippets: [
      {
        label: 'Render reason lookup',
        note: 'Модель намеренно изолирована от UI, чтобы одну и ту же логику можно было обсуждать и тестировать отдельно от разметки.',
        code: `const explanation = explainRenderReason({
  nodeId: selectedNode,
  filter,
  selectedTab,
  theme,
});`,
      },
      {
        label: 'Snapshot assembly',
        note: 'Снимок разбит на props, state и context: именно в таком разрезе React DevTools обычно помогает локализовать проблему.',
        code: `const snapshot = {
  props: { filter, selectedTab },
  state: { highlightedIndex: filter.length % 3 },
  context: { theme, devtoolsMode },
};`,
      },
    ],
  },
  lint: {
    files: [
      {
        path: 'src/components/tooling-labs/LintRulesLab.tsx',
        note: 'Сравнение baseline и strict lint-профилей на одном наборе smell-ов.',
      },
      {
        path: 'src/lib/lint-rule-model.ts',
        note: 'Каталог finding-ов и сводка baseline/strict видимости.',
      },
      {
        path: 'eslint.config.js',
        note: 'Реальный lint-config урока: тема выражена не только в UI, но и в инфраструктуре проекта.',
      },
    ],
    snippets: [
      {
        label: 'Strict summary',
        note: 'Видимость finding-ов зависит не только от самого smell, но и от того, насколько сильный guardrail реально включён в проекте.',
        code: `const summary = summarizeLintFindings(activeFindings, mode);
const visibleFindings = lintFindingCatalog.filter(
  (item) => activeFindings.includes(item.id) && (mode === 'strict' || item.baseline),
);`,
      },
      {
        label: 'Recommended latest rules',
        note: 'Для этого урока важно использовать расширенный react-hooks preset, а не только минимальный rules-of-hooks слой.',
        code: `const reactHooksRecommendedLatestRules =
  reactHooks.configs.flat?.['recommended-latest']?.rules ??
  reactHooks.configs['recommended-latest'].rules;`,
      },
    ],
  },
  rules: {
    files: [
      {
        path: 'src/components/tooling-labs/RulesOfReactLab.tsx',
        note: 'Интерактивная карта violations: hooks order, ref misuse, purity и component factories.',
      },
      {
        path: 'src/lib/rules-of-react-model.ts',
        note: 'Rule catalog и pressure-анализ по зонам риска.',
      },
      {
        path: 'src/pages/RulesOfReactPage.tsx',
        note: 'Связывает нарушения правил React с современным debugging mindset.',
      },
    ],
    snippets: [
      {
        label: 'Rule pressure',
        note: 'Приоритет ошибки определяется по зоне риска: hooks order критичнее, чем просто архитектурная хрупкость.',
        code: `if (hasHooksOrder) {
  return {
    tone: 'error',
    hotZone: 'hooks-order',
  };
}`,
      },
      {
        label: 'Rule catalog',
        note: 'Лаборатория показывает связь между lint-rule, runtime symptom и реальной причиной, а не только список запретов.',
        code: `{
  id: 'ref-read-render',
  lintRule: 'react-hooks/refs',
  runtimeSymptom: 'Компонент опирается на mutable escape hatch прямо в render phase.',
}`,
      },
    ],
  },
  debug: {
    files: [
      {
        path: 'src/components/tooling-labs/DebuggingWorkflowLab.tsx',
        note: 'Scenario-driven выбор первого диагностического инструмента.',
      },
      {
        path: 'src/lib/debugging-workflow-model.ts',
        note: 'Модель symptom → first tool → next steps.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests проверяют, что симптом действительно ведёт к ожидаемому debugging route.',
      },
    ],
    snippets: [
      {
        label: 'First tool selection',
        note: 'Здесь баги не чинятся сразу. Сначала выбирается корректный первый сигнал, иначе отладка превращается в перебор.',
        code: `const card = debugSymptomCards.find((item) => item.id === symptom)!;

if (!availableTools.includes(card.firstTool)) {
  return {
    tone: 'error',
    missingTool: card.firstTool,
  };
}`,
      },
      {
        label: 'Guardrail step',
        note: 'Финальный шаг всегда закрепляет находку: тестом, lint-rule или архитектурным изменением.',
        code: `availableTools.includes('tests')
  ? '4. Закрепите исправление тестом, чтобы баг не вернулся.'
  : '4. После исправления создайте тестовый guardrail для повторяемости.'`,
      },
    ],
  },
  quality: {
    files: [
      {
        path: 'src/components/tooling-labs/QualityControlSystemLab.tsx',
        note: 'Собирает DevTools, lint, rules и tests в единый контур качества.',
      },
      {
        path: 'src/lib/quality-playbook-model.ts',
        note: 'План по фазам: наблюдение, предотвращение, закрепление.',
      },
      {
        path: 'README.md',
        note: 'README урока фиксирует, что тема — это именно quality system, а не набор отдельных утилит.',
      },
    ],
    snippets: [
      {
        label: 'Quality system plan',
        note: 'План зависит и от формы codebase, и от числа gaps: tooling оценивается как система, а не как список зависимостей.',
        code: `const risk =
  args.gaps.length + (args.shape === 'platform' ? 2 : args.shape === 'growing' ? 1 : 0);`,
      },
      {
        label: 'Quality evidence',
        note: 'Урок завершает тему не абстрактно, а через проверяемые признаки здорового toolchain.',
        code: `export const qualityEvidence = [
  'Линтер отражает реальные правила проекта, а не только базовые stylistic checks.',
  'Типовые баги закрепляются тестами и архитектурными guardrails.',
] as const;`,
      },
    ],
  },
};
