import type { LabId } from './learning-model';

type StudyFile = {
  path: string;
  note: string;
};

type StudySnippet = {
  label: string;
  note: string;
  code: string;
};

export const projectStudies: Record<
  LabId,
  { files: readonly StudyFile[]; snippets: readonly StudySnippet[] }
> = {
  useid: {
    files: [
      {
        path: 'src/hooks/useStableFieldIds.ts',
        note: 'Hook на `useId`, который строит стабильные ids для DOM-связей формы.',
      },
      {
        path: 'src/components/advanced-hooks/StableIdLab.tsx',
        note: 'Живая лаборатория со стабильными и нестабильными id.',
      },
      {
        path: 'src/lib/id-model.ts',
        note: 'Вспомогательная модель для preview нестабильных id.',
      },
    ],
    snippets: [
      {
        label: 'useStableFieldIds.ts',
        note: 'Комментарий внутри hook-а явно фиксирует, что `useId` не заменяет `key`.',
        code: `const baseId = useId();
const normalizedScope = scope.toLowerCase().replace(/\\s+/g, '-');

return {
  titleId: \`\${baseId}-\${normalizedScope}-title\`,
  ownerId: \`\${baseId}-\${normalizedScope}-owner\`,
  notesId: \`\${baseId}-\${normalizedScope}-notes\`,
};`,
      },
      {
        label: 'StableIdLab.tsx',
        note: 'Стабильные ids живут внутри формы, а рядом показан анти-паттерн с id из рендера.',
        code: `const ids = useStableFieldIds(\`review-card-\${cardIndex}\`);
const unstablePreview = Array.from({ length: cardsCount }, (_, cardIndex) => ({
  ids: ['title', 'owner', 'notes'].map((field) =>
    buildEphemeralFieldId(renderTick, cardIndex, field),
  ),
}));`,
      },
    ],
  },
  debug: {
    files: [
      {
        path: 'src/hooks/useRuleDiagnostics.ts',
        note: 'Custom hook с `useDebugValue` и formatter-функцией.',
      },
      {
        path: 'src/lib/debug-value-model.ts',
        note: 'Pure model для summary и короткой debug label.',
      },
      {
        path: 'src/components/advanced-hooks/DebugValueLab.tsx',
        note: 'Экран, где состояние hook-а меняется интерактивно.',
      },
    ],
    snippets: [
      {
        label: 'useRuleDiagnostics.ts',
        note: 'Hook отдаёт наружу state и summary, а в DevTools показывает короткую сводку.',
        code: `const summary = buildDiagnosticsSummary(state);

useDebugValue(summary, formatDiagnosticsDebugValue);

return {
  state,
  summary,
  toggleCheck(key) {
    setState((current) => ({ ...current, [key]: !current[key] }));
  },
};`,
      },
      {
        label: 'debug-value-model.ts',
        note: 'Formatter делает debug label коротким и пригодным для чтения в дереве hooks.',
        code: `export function formatDiagnosticsDebugValue(summary) {
  return \`\${summary.passed}/\${summary.total} safe • \${summary.blockers.length} blockers\`;
}`,
      },
    ],
  },
  'sync-store': {
    files: [
      {
        path: 'src/hooks/useLintRuleStore.ts',
        note: 'Hook на `useSyncExternalStore`, который подключает React к внешнему store.',
      },
      {
        path: 'src/lib/rule-store.ts',
        note: 'Внешний store с `subscribe`, `getSnapshot` и domain actions.',
      },
      {
        path: 'src/components/advanced-hooks/SyncExternalStoreLab.tsx',
        note: 'Два независимых зеркала, которые читают один snapshot без props drilling.',
      },
    ],
    snippets: [
      {
        label: 'useLintRuleStore.ts',
        note: 'Хук читает snapshot согласованно и даёт действия поверх store.',
        code: `const snapshot = useSyncExternalStore(ruleStore.subscribe, ruleStore.getSnapshot);
const summary = summarizeRuleStore(snapshot);

useDebugValue(summary, formatRuleStoreDebugValue);

return {
  snapshot,
  summary,
  setPreset(preset) {
    ruleStore.setPreset(preset);
  },
};`,
      },
      {
        label: 'rule-store.ts',
        note: 'Сторонний store живёт вне React и уведомляет подписчиков через `subscribe`.',
        code: `let snapshot = initialRuleStoreSnapshot;
const listeners = new Set();

export const ruleStore = {
  getSnapshot() {
    return snapshot;
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};`,
      },
    ],
  },
  rules: {
    files: [
      {
        path: 'src/lib/hook-rules-model.ts',
        note: 'Симулятор порядка hook slots между двумя рендерами.',
      },
      {
        path: 'src/components/advanced-hooks/RulesOrderLab.tsx',
        note: 'Интерактивное сравнение render A и render B без поломки самого урока.',
      },
      {
        path: 'eslint.config.js',
        note: 'Реальный guardrail, который ловит `rules-of-hooks` в проекте.',
      },
    ],
    snippets: [
      {
        label: 'hook-rules-model.ts',
        note: 'Порядок сравнивается по слотам, а не по названию переменных.',
        code: `export function compareHookOrders(first, second) {
  const slotPairs = Array.from({ length: maxLength }, (_, index) => ({
    slot: index + 1,
    first: first[index] ?? '—',
    second: second[index] ?? '—',
    changed: first[index] !== second[index],
  }));
}`,
      },
      {
        label: 'RulesOrderLab.tsx',
        note: 'Сам урок остаётся валидным: smell моделируется чистой функцией, а не реальным нарушением runtime.',
        code: `const firstOrder = buildHookOrder(presetId, firstVariant);
const secondOrder = buildHookOrder(presetId, secondVariant);
const comparison = compareHookOrders(firstOrder, secondOrder);`,
      },
    ],
  },
  purity: {
    files: [
      {
        path: 'src/lib/purity-model.ts',
        note: 'Pure evaluator для render-phase нарушений и safe moves.',
      },
      {
        path: 'src/components/advanced-hooks/PurityLab.tsx',
        note: 'Интерактивная модель purity и ref pitfalls.',
      },
      {
        path: 'eslint.config.js',
        note: 'В `recommended-latest` появляются дополнительные purity/refs guardrails.',
      },
    ],
    snippets: [
      {
        label: 'purity-model.ts',
        note: 'Чистое derived вычисление оставляется в рендере, а не переносится в effect по инерции.',
        code: `if (!state.derivesInRender) {
  issues.push('Чистое derived вычисление вынесено из рендера без необходимости.');
}

return {
  safeMoves: [
    'Чистые derived вычисления держите в рендере.',
    'ref обновляйте в обработчике или effect, а не в теле компонента.',
  ],
};`,
      },
      {
        label: 'PurityLab.tsx',
        note: 'UI управляет только моделью сигналов, а не исполняет реально плохой render-код.',
        code: `const [state, setState] = useState(defaultPurityState);
const summary = evaluatePurityState(state);

function toggleSignal(key) {
  setState((current) => ({ ...current, [key]: !current[key] }));
}`,
      },
    ],
  },
  lint: {
    files: [
      {
        path: 'eslint.config.js',
        note: 'Конфиг проекта с `recommended-latest` preset для `eslint-plugin-react-hooks`.',
      },
      {
        path: 'src/lib/lint-discipline-model.ts',
        note: 'Pure model, который показывает, какие проблемы ловятся выбранным preset-ом.',
      },
      {
        path: 'src/components/advanced-hooks/LintDisciplineLab.tsx',
        note: 'Интерактивная лаборатория про lint-first discipline и ранние guardrails.',
      },
    ],
    snippets: [
      {
        label: 'eslint.config.js',
        note: 'Проект реально использует `recommended-latest`, а не просто упоминает его в тексте.',
        code: `const reactHooksRecommendedLatestRules =
  reactHooks.configs.flat?.['recommended-latest']?.rules ??
  reactHooks.configs['recommended-latest'].rules;

rules: {
  ...reactHooksRecommendedLatestRules,
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
},`,
      },
      {
        label: 'lint-discipline-model.ts',
        note: 'Модель отличает минимум `recommended` от расширенного `recommended-latest`.',
        code: `function presetCoversIssue(preset, issueId) {
  const issue = lintIssueCatalog.find((item) => item.id === issueId);
  return preset === 'recommended-latest' || issue.minimumPreset === 'recommended';
}`,
      },
    ],
  },
};
