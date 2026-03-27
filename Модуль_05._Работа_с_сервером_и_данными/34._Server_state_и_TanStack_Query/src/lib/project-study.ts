import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, ProjectStudyEntry> = {
  layer: {
    files: [
      {
        path: 'src/main.tsx',
        note: 'Точка входа, где QueryClientProvider поднимает server-state layer над всем приложением.',
      },
      {
        path: 'src/query/query-client.ts',
        note: 'Единый QueryClient с default options для staleTime, retry и cache lifetime.',
      },
      {
        path: 'src/components/server-state/ServerStateSplitLab.tsx',
        note: 'Лаборатория, где local filter state и server data живут рядом, но не смешиваются.',
      },
    ],
    snippets: [
      {
        label: 'main.tsx',
        note: 'Server state слой не "включается сам". Его нужно поднять на уровне провайдера над приложением.',
        code: `<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>`,
      },
      {
        label: 'ServerStateSplitLab.tsx',
        note: 'Локальный фильтр меняет отображение, но не создаёт новый источник истины для серверных данных.',
        code: `const [trackFilter, setTrackFilter] = useState<'all' | LessonTrack>('all');
const catalogQuery = useCatalogQuery('catalog', 'all', 15_000);

const visibleItems =
  trackFilter === 'all'
    ? catalogQuery.data?.items ?? []
    : (catalogQuery.data?.items ?? []).filter((item) => item.track === trackFilter);`,
      },
    ],
  },
  cache: {
    files: [
      {
        path: 'src/hooks/useCatalogQueries.ts',
        note: 'Повторно используемый query hook со стабильным query key и единым query function.',
      },
      {
        path: 'src/query/query-keys.ts',
        note: 'Query keys отделены в отдельный модуль, чтобы кэш проектировался явно, а не строками по месту.',
      },
      {
        path: 'src/components/server-state/CacheSharingLab.tsx',
        note: 'Два observer-компонента на одном query key показывают shared cache entry.',
      },
    ],
    snippets: [
      {
        label: 'useCatalogQueries.ts',
        note: 'Один и тот же query key делает данные общими для всех потребителей этого hook.',
        code: `return useQuery({
  queryKey: serverStateKeys.catalog(resource, scope),
  queryFn: ({ signal }) => fetchLessonCatalog({ resource, scope, signal }),
  staleTime,
});`,
      },
      {
        label: 'CacheSharingLab.tsx',
        note: 'Инвалидация и очистка cache наглядно показывают, что shared data живут не внутри одного компонента.',
        code: `void queryClient.invalidateQueries({
  queryKey: serverStateKeys.catalog('catalog', 'published'),
});`,
      },
    ],
  },
  stale: {
    files: [
      {
        path: 'src/hooks/useHealthSnapshotQuery.ts',
        note: 'Хук, который связывает freshness profile с `staleTime` и `retry`.',
      },
      {
        path: 'src/lib/freshness-profile-model.ts',
        note: 'Pure-модель профилей свежести и стоимости refetch-стратегии.',
      },
      {
        path: 'src/components/server-state/StaleRetriesLab.tsx',
        note: 'Живая лаборатория stale data, server changes и retry behaviour.',
      },
    ],
    snippets: [
      {
        label: 'useHealthSnapshotQuery.ts',
        note: 'Retry и stale policy задаются не в разметке, а в server-state hook.',
        code: `return useQuery({
  queryKey: serverStateKeys.health(profile, failBeforeSuccess),
  queryFn: ({ signal }) =>
    fetchHealthSnapshot({ profile, failBeforeSuccess, signal }),
  staleTime: freshnessProfile.staleTimeMs,
  retry: freshnessProfile.retryCount,
});`,
      },
      {
        label: 'fake-server.ts',
        note: 'Abort-aware delay показывает, что query layer умеет отменять уже неактуальные запросы.',
        code: `if (signal?.aborted) {
  throw new DOMException('Aborted', 'AbortError');
}`,
      },
    ],
  },
  mutations: {
    files: [
      {
        path: 'src/components/server-state/MutationInvalidationLab.tsx',
        note: 'Связка `useMutation` и invalidation после server write.',
      },
      {
        path: 'src/lib/fake-server.ts',
        note: 'Fake server mutations меняют server-owned data, а не локальное состояние компонента.',
      },
      {
        path: 'src/query/query-keys.ts',
        note: 'Mutation invalidation опирается на те же query keys, что и чтение.',
      },
    ],
    snippets: [
      {
        label: 'MutationInvalidationLab.tsx',
        note: 'Мутация не обновляет query cache автоматически, поэтому onSuccess явно инвалидирует связанные запросы.',
        code: `await Promise.all([
  queryClient.invalidateQueries({
    queryKey: serverStateKeys.catalogRoot('mutation-board'),
  }),
  queryClient.invalidateQueries({
    queryKey: serverStateKeys.summary('mutation-board'),
  }),
]);`,
      },
      {
        label: 'fake-server.ts',
        note: 'Server mutation реально меняет базу fake server, а не только локальную копию на экране.',
        code: `getResourceItems(resource).unshift(nextLesson);
return cloneLesson(nextLesson);`,
      },
    ],
  },
  consistency: {
    files: [
      {
        path: 'src/components/server-state/CacheConsistencyLab.tsx',
        note: 'Лаборатория, где список и summary могут разойтись из-за неполной invalidation strategy.',
      },
      {
        path: 'src/lib/consistency-model.ts',
        note: 'Pure-модель оценки invalidation scope и риска cache drift.',
      },
      {
        path: 'src/hooks/useCatalogQueries.ts',
        note: 'Список и summary живут в разных query keys, поэтому требуют осознанной синхронизации.',
      },
    ],
    snippets: [
      {
        label: 'CacheConsistencyLab.tsx',
        note: 'Неполная invalidation strategy специально оставляет часть UI в старом кэше.',
        code: `await queryClient.invalidateQueries({
  queryKey: serverStateKeys.catalogRoot('consistency-board'),
});

if (scope === 'catalog-and-summary') {
  await queryClient.invalidateQueries({
    queryKey: serverStateKeys.summary('consistency-board'),
  });
}`,
      },
      {
        label: 'consistency-model.ts',
        note: 'Согласованность здесь считается отдельным архитектурным решением, а не побочным эффектом удачной мутации.',
        code: `if (scope === 'catalog-and-summary') {
  return {
    status: 'Safe invalidation scope',
  };
}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/server-state-architecture-model.ts',
        note: 'Pure advisor по выбору между local fetch, dedicated hook и полноценным TanStack Query layer.',
      },
      {
        path: 'src/query/query-client.ts',
        note: 'Даже сама конфигурация QueryClient показывает, что server state несёт собственную runtime-политику.',
      },
      {
        path: 'src/App.tsx',
        note: 'Shell урока задаёт тему архитектурно: freshness, ownership и отдельный server-state vocabulary.',
      },
    ],
    snippets: [
      {
        label: 'server-state-architecture-model.ts',
        note: 'Архитектурный выбор тестируется как pure function, а не прячется в UI-текстах.',
        code: `if (
  inputs.sharedAcrossWidgets ||
  inputs.needsRetries ||
  inputs.needsFreshnessStrategy
) {
  return {
    approach: 'TanStack Query layer',
    score: 88,
  };
}`,
      },
      {
        label: 'query-client.ts',
        note: 'QueryClient здесь фиксирует дефолтную политику всего server-state слоя.',
        code: `export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 4_000,
    },
  },
});`,
      },
    ],
  },
};
