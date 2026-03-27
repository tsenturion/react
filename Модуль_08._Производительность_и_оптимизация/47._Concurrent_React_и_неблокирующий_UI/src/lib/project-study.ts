import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока задаёт рамку темы: срочные и несрочные обновления, heavy lists и выбор concurrent API.',
      },
      {
        path: 'src/lib/concurrent-domain.ts',
        note: 'Guide cards собирают тему по практическим сигналам, а не по формальному перечню hooks.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует, что Concurrent React рассматривается через реальные input/list/search сценарии.',
      },
    ],
    snippets: [
      {
        label: 'concurrent-domain.ts',
        note: 'Карта темы начинается с вопроса о срочности обновления, а не с механического перечисления API.',
        code: `{
  focus: 'priorities',
  title: 'Не все обновления должны блокировать ввод одинаково',
}`,
      },
      {
        label: 'router.tsx',
        note: 'Shell урока сам проговаривает, что concurrent APIs не убирают работу, а меняют её приоритет.',
        code: `<p className="mt-3 text-sm leading-6 text-slate-600">
  Здесь важно не просто уменьшить работу, а отделить срочный feedback
  от тяжёлой несрочной визуальной части.
</p>`,
      },
    ],
  },
  'transition-priority': {
    files: [
      {
        path: 'src/components/concurrent/TransitionPriorityLab.tsx',
        note: 'Лаборатория сравнивает direct update и useTransition на одном search/list сценарии.',
      },
      {
        path: 'src/lib/transition-priority-model.ts',
        note: 'Модель описывает каналы urgent и background work для одного действия пользователя.',
      },
      {
        path: 'src/components/concurrent/TransitionPriorityLab.test.tsx',
        note: 'Component test фиксирует, что срочный input остаётся доступным в transition-режиме.',
      },
    ],
    snippets: [
      {
        label: 'TransitionPriorityLab.tsx',
        note: 'useTransition включается только вокруг expensive state, а draft input остаётся обычным срочным обновлением.',
        code: `if (mode === 'transition') {
  startTransition(() => setQuery(nextQuery));
  return;
}

setQuery(nextQuery);`,
      },
      {
        label: 'transition-priority-model.ts',
        note: 'Здесь различается срочный канал и background channel для heavy list update.',
        code: `return {
  urgentChannel: 'draft state и быстрый feedback остаются срочными',
  backgroundChannel: 'expensive subtree обновляется как non-urgent work',
};`,
      },
    ],
  },
  'start-transition': {
    files: [
      {
        path: 'src/components/concurrent/StartTransitionLab.tsx',
        note: 'Лаборатория показывает imported startTransition на heavy workspace switch без отдельного pending state.',
      },
      {
        path: 'src/lib/start-transition-model.ts',
        note: 'Модель объясняет, когда plain startTransition достаточно и чем он отличается от useTransition.',
      },
      {
        path: 'src/components/concurrent/StartTransitionLab.test.tsx',
        note: 'Тест закрепляет переключение heavy workspace в режиме startTransition.',
      },
    ],
    snippets: [
      {
        label: 'StartTransitionLab.tsx',
        note: 'Быстрый shell feedback идёт напрямую, а тяжёлое переключение workspace переводится в lower priority lane.',
        code: `setShellNote(\`Переход к \${item.label} зафиксирован в shell сразу.\`);

if (mode === 'start-transition') {
  startTransition(() => setActiveView(item.value as WorkspaceView));
  return;
}`,
      },
      {
        label: 'start-transition-model.ts',
        note: 'Модель урока явно проговаривает отсутствие built-in pending flag у imported API.',
        code: `return {
  pendingSignal: 'manual pending UI не встроен автоматически',
};`,
      },
    ],
  },
  'deferred-value': {
    files: [
      {
        path: 'src/components/concurrent/DeferredValueLab.tsx',
        note: 'Здесь видно различие между текущим query и deferredQuery на одном heavy consumer.',
      },
      {
        path: 'src/lib/deferred-value-model.ts',
        note: 'Pure-модель фиксирует, когда deferred consumer отстаёт и когда уже синхронизировался.',
      },
      {
        path: 'src/components/concurrent/DeferredValueLab.test.tsx',
        note: 'Тест закрепляет, что само input-значение обновляется немедленно.',
      },
    ],
    snippets: [
      {
        label: 'DeferredValueLab.tsx',
        note: 'useDeferredValue применяется именно к значению, которое потребляет тяжёлый subtree.',
        code: `const deferredQuery = useDeferredValue(query);

const projection = projectSearchResults({
  query: deferredQuery,
  track,
  sort: 'relevance',
  intensity,
});`,
      },
      {
        label: 'deferred-value-model.ts',
        note: 'Лаг трактуется не как ошибка, а как осознанное временное расхождение между input и consumer.',
        code: `const isLagging = input.query !== input.deferredQuery;`,
      },
    ],
  },
  'concurrent-search': {
    files: [
      {
        path: 'src/components/concurrent/ConcurrentSearchLab.tsx',
        note: 'Интегрированный сценарий объединяет срочный input, deferred query и transitions для filter controls.',
      },
      {
        path: 'src/components/concurrent/SearchProjectionPreview.tsx',
        note: 'Общий preview-компонент помогает смотреть на heavy projection как на отдельный consumer subtree.',
      },
      {
        path: 'src/lib/search-workload-model.ts',
        note: 'Pure search projection содержит synthetic expensive work, чтобы concurrent behavior было видно в браузере.',
      },
    ],
    snippets: [
      {
        label: 'ConcurrentSearchLab.tsx',
        note: 'Track и sort переводятся в transition, а query проходит через deferred consumer.',
        code: `const [isPending, startTransition] = useTransition();
const deferredQuery = useDeferredValue(draftQuery);`,
      },
      {
        label: 'search-workload-model.ts',
        note: 'Дорогой projection моделируется на чистой функции, а не прячется в импровизированном setTimeout.',
        code: `for (let spin = 0; spin < intensity * 1200; spin += 1) {
  score += (item.complexity * ((spin % 7) + 1) + item.sessions) % 11;
}`,
      },
    ],
  },
  'concurrency-playbook': {
    files: [
      {
        path: 'src/components/concurrent/ConcurrencyPlaybookLab.tsx',
        note: 'Итоговая лаборатория собирает реальные сигналы выбора concurrent API в одну decision model.',
      },
      {
        path: 'src/lib/concurrency-playbook-model.ts',
        note: 'Модель разделяет случаи, где нужен transition, deferred value, plain startTransition или вообще measure-first.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests фиксируют выбор инструмента для structural bottleneck и lagging list filters.',
      },
    ],
    snippets: [
      {
        label: 'concurrency-playbook-model.ts',
        note: 'Concurrent APIs выбираются по типу работы, а не по шаблону “всегда ставьте startTransition”.',
        code: `if (input.structuralProblemLikely) {
  return {
    recommendedTool: 'measure-first',
  };
}`,
      },
      {
        label: 'ConcurrencyPlaybookLab.tsx',
        note: 'Лаборатория превращает тему в систему решений, а не в набор разрозненных hook demos.',
        code: `const verdict = evaluateConcurrencyStrategy({
  lagSeverity,
  updatePattern,
  resultCanLag,
  needsPendingIndicator,
  startedOutsideComponent,
  structuralProblemLikely,
});`,
      },
    ],
  },
};
