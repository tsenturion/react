import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, ProjectStudyEntry> = {
  http: {
    files: [
      {
        path: 'src/lib/http-client.ts',
        note: 'Транспортный слой с реальным fetch, artificial delay и AbortController-aware wait.',
      },
      {
        path: 'src/lib/http-domain.ts',
        note: 'Типы запроса, response metadata и error-модель для HTTP сценариев урока.',
      },
      {
        path: 'src/components/http-fetch/HttpBasicsLab.tsx',
        note: 'Ручной GET-запрос с показом transport metadata и payload.',
      },
    ],
    snippets: [
      {
        label: 'http-client.ts',
        note: 'Локальный JSON не даёт естественной сетевой задержки, поэтому она добавляется вручную, чтобы lifecycle был виден в интерфейсе.',
        code: `await waitWithAbort(delayMs, signal);

const response = await fetch('/data/http-react-playbook.json', {
  headers: { Accept: 'application/json' },
  signal,
});`,
      },
      {
        label: 'HttpBasicsLab.tsx',
        note: 'Даже самый простой ручной fetch здесь уже держит status, error и возможность отмены.',
        code: `const controller = new AbortController();
controllerRef.current = controller;
setStatus('loading');

const nextResult = await fetchPlaybookCatalog({
  query,
  scenario,
  delayMs: 650,
  signal: controller.signal,
});`,
      },
    ],
  },
  states: {
    files: [
      {
        path: 'src/hooks/usePlaybookQuery.ts',
        note: 'Хук, который собирает loading/error/empty/success в одну сетевую модель.',
      },
      {
        path: 'src/components/http-fetch/LoadingStatesLab.tsx',
        note: 'Живой экран с переключением response mode и состояниями интерфейса.',
      },
      {
        path: 'src/components/http-fetch/PlaybookList.tsx',
        note: 'Общий success-layer поверх результатов запроса.',
      },
    ],
    snippets: [
      {
        label: 'usePlaybookQuery.ts',
        note: 'Хук возвращает не сырые promise-объекты, а нормализованное состояние UI.',
        code: `setState((current) => ({
  ...current,
  status: 'loading',
  error: null,
}));`,
      },
      {
        label: 'LoadingStatesLab.tsx',
        note: 'Loading, empty, error и success рендерятся как отдельные смысловые ветки, а не смешиваются в один условный блок.',
        code: `{request.status === 'loading' ? <LoadingSkeleton /> : null}
{request.status === 'error' ? <ErrorState /> : null}
{request.status === 'empty' ? <EmptyState /> : null}
{request.status === 'success' ? <PlaybookList items={request.items} /> : null}`,
      },
    ],
  },
  lifecycle: {
    files: [
      {
        path: 'src/components/http-fetch/RequestLifecycleLab.tsx',
        note: 'Лаборатория с явным timeline запроса: start, success, error и abort.',
      },
      {
        path: 'src/lib/request-lifecycle-model.ts',
        note: 'Подсказки и summaries для состояний сетевого lifecycle.',
      },
      {
        path: 'src/lib/http-client.ts',
        note: 'Один и тот же transport layer используется и в manual, и в hook-based сценариях.',
      },
    ],
    snippets: [
      {
        label: 'RequestLifecycleLab.tsx',
        note: 'Журнал lifecycle делает сетевую логику трассируемой и пригодной для отладки.',
        code: `setStatus('loading');
pushTimeline('loading: запрос стартовал');

const result = await fetchPlaybookCatalog(...);
pushTimeline(\`\${nextStatus}: ответ за \${result.meta.elapsedMs}ms\`);`,
      },
      {
        label: 'request-lifecycle-model.ts',
        note: 'Явные summaries упрощают переход от transport state к UI-пояснению.',
        code: `case 'aborted':
  return 'Запрос был отменён до завершения.';`,
      },
    ],
  },
  retry: {
    files: [
      {
        path: 'src/components/http-fetch/RetryAbortLab.tsx',
        note: 'Retry-план с backoff, abort и разными типами отказов.',
      },
      {
        path: 'src/lib/retry-model.ts',
        note: 'План retry-пауз и семантика сценариев flaky/server-error/empty.',
      },
      {
        path: 'src/lib/http-client.ts',
        note: 'HttpRequestError и retryable flag показывают, что повторять имеет смысл не каждую ошибку.',
      },
    ],
    snippets: [
      {
        label: 'RetryAbortLab.tsx',
        note: 'Retry здесь является частью orchestration logic, а не случайным повторным вызовом fetch.',
        code: `for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
  if (attempt > 0) {
    await waitWithAbort(retryPlan[attempt - 1], controller.signal);
  }
}`,
      },
      {
        label: 'http-client.ts',
        note: 'Retryable error маркируется прямо на объекте ошибки, чтобы orchestration code не гадал по тексту сообщения.',
        code: `throw new HttpRequestError(
  503,
  'Сервер временно недоступен. Попробуйте повторить запрос.',
  true,
);`,
      },
    ],
  },
  race: {
    files: [
      {
        path: 'src/components/http-fetch/RaceConditionsLab.tsx',
        note: 'Сравнение unsafe и safe запросов на одном и том же search input.',
      },
      {
        path: 'src/hooks/usePlaybookQuery.ts',
        note: 'Хук использует requestId guard и abort cleanup против устаревших ответов.',
      },
      {
        path: 'src/lib/race-model.ts',
        note: 'Искусственная задержка сделана не случайно: она провоцирует out-of-order responses.',
      },
    ],
    snippets: [
      {
        label: 'RaceConditionsLab.tsx',
        note: 'Unsafe-панель намеренно не отменяет запросы и не проверяет актуальность ответа.',
        code: `void fetchPlaybookCatalog({
  query,
  scenario: 'success',
  delayMs: getRaceDelay(query),
}).then((response) => {
  setItems(response.items);
  setAppliedQuery(response.meta.query);
});`,
      },
      {
        label: 'usePlaybookQuery.ts',
        note: 'Даже если старый запрос завершился позже нового, он не должен попасть в UI.',
        code: `if (requestId !== requestIdRef.current) {
  return;
}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/hooks/usePlaybookQuery.ts',
        note: 'Пример dedicated request hook как среднего слоя между transport logic и UI.',
      },
      {
        path: 'src/lib/fetch-architecture-model.ts',
        note: 'Pure model для выбора между inline fetch, dedicated hook и server-state layer.',
      },
      {
        path: 'src/components/http-fetch/FetchingArchitectureLab.tsx',
        note: 'Интерактивный advisor по росту сложности data fetching.',
      },
    ],
    snippets: [
      {
        label: 'fetch-architecture-model.ts',
        note: 'Когда появляются shared cache и reuse между экранами, локальный hook становится промежуточной ступенью, а не финальной архитектурой.',
        code: `if (inputs.crossScreenCaching || (inputs.sharedAcrossWidgets && inputs.needsRetry)) {
  return { approach: 'Server-state layer' };
}`,
      },
      {
        label: 'usePlaybookQuery.ts',
        note: 'Этот hook убирает из компонентов transport-шум и оставляет им только согласованную request-модель.',
        code: `return state;`,
      },
    ],
  },
};
