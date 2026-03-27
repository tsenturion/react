export type PerformanceArea = 'all' | 'render' | 'routing' | 'network' | 'forms' | 'data';

export type CaseSort = 'impact' | 'duration' | 'frequency';

export type PerformanceCase = {
  id: string;
  title: string;
  area: Exclude<PerformanceArea, 'all'>;
  impact: number;
  averageDuration: number;
  frequency: number;
  summary: string;
};

export const performanceCases: readonly PerformanceCase[] = [
  {
    id: 'profiler-overlay',
    title: 'Profiler overlay redraw',
    area: 'render',
    impact: 9,
    averageDuration: 32,
    frequency: 6,
    summary: 'Большой subtree ререндерится при каждом изменении локального input.',
  },
  {
    id: 'routing-shell',
    title: 'Route shell persistence',
    area: 'routing',
    impact: 7,
    averageDuration: 24,
    frequency: 4,
    summary: 'Layout route тянет за собой expensive summary при каждом переходе.',
  },
  {
    id: 'release-search',
    title: 'Release search projection',
    area: 'data',
    impact: 10,
    averageDuration: 48,
    frequency: 8,
    summary: 'Фильтрация и сортировка списка съедают основной budget на вводе.',
  },
  {
    id: 'audit-panel',
    title: 'Audit panel hydration',
    area: 'render',
    impact: 6,
    averageDuration: 18,
    frequency: 3,
    summary: 'Summary cards строятся заново при каждом unrelated parent update.',
  },
  {
    id: 'save-draft',
    title: 'Draft autosave waterfall',
    area: 'network',
    impact: 8,
    averageDuration: 85,
    frequency: 7,
    summary: 'Слишком частые network retries маскируются под React lag.',
  },
  {
    id: 'review-tabs',
    title: 'Review tabs switch',
    area: 'routing',
    impact: 7,
    averageDuration: 21,
    frequency: 5,
    summary: 'Смена экрана ломает отзывчивость из-за тяжёлого shell branch.',
  },
  {
    id: 'bulk-form',
    title: 'Bulk approval form',
    area: 'forms',
    impact: 8,
    averageDuration: 28,
    frequency: 6,
    summary: 'Ошибки и derived indicators обновляют весь экран вместо нужной секции.',
  },
  {
    id: 'trace-table',
    title: 'Trace table diff',
    area: 'render',
    impact: 9,
    averageDuration: 42,
    frequency: 5,
    summary: 'Широкая таблица даёт длинные commits и скрывает origin update.',
  },
  {
    id: 'network-burst',
    title: 'Network burst recovery',
    area: 'network',
    impact: 6,
    averageDuration: 95,
    frequency: 3,
    summary: 'После ошибки refresh logic запускает cascade запросов и повторных paints.',
  },
  {
    id: 'filter-badges',
    title: 'Filter badge reconciliation',
    area: 'forms',
    impact: 5,
    averageDuration: 15,
    frequency: 9,
    summary: 'Частые мелкие commits хорошо видны в Profiler, хотя каждый из них дешёвый.',
  },
  {
    id: 'server-board',
    title: 'Server health board',
    area: 'data',
    impact: 8,
    averageDuration: 36,
    frequency: 4,
    summary: 'Derived aggregates пересчитываются слишком высоко по дереву.',
  },
  {
    id: 'timeline-paint',
    title: 'Timeline paint burst',
    area: 'render',
    impact: 7,
    averageDuration: 29,
    frequency: 4,
    summary: 'Paint и layout начинают доминировать после масштабного DOM update.',
  },
  {
    id: 'deep-link-open',
    title: 'Deep-link entity open',
    area: 'routing',
    impact: 6,
    averageDuration: 27,
    frequency: 3,
    summary: 'Навигация по URL приводит к перерасчёту всего review workspace.',
  },
  {
    id: 'validation-wave',
    title: 'Validation wave',
    area: 'forms',
    impact: 7,
    averageDuration: 22,
    frequency: 8,
    summary: 'Форма запускает длинную волну ререндеров из-за shared parent state.',
  },
  {
    id: 'payload-normalize',
    title: 'Payload normalization',
    area: 'data',
    impact: 6,
    averageDuration: 31,
    frequency: 2,
    summary:
      'Тяжёлая нормализация данных происходит в render-path вместо background prep.',
  },
  {
    id: 'request-waterfall',
    title: 'Request waterfall',
    area: 'network',
    impact: 9,
    averageDuration: 110,
    frequency: 4,
    summary: 'Сеть доминирует над UX, но симптом выглядит как “React тормозит”.',
  },
  {
    id: 'comparison-grid',
    title: 'Comparison grid highlight',
    area: 'render',
    impact: 8,
    averageDuration: 34,
    frequency: 5,
    summary: 'Подсветка строк тянет за собой всю сетку и соседние summary cards.',
  },
  {
    id: 'stale-route-data',
    title: 'Stale route data hint',
    area: 'routing',
    impact: 5,
    averageDuration: 17,
    frequency: 2,
    summary: 'Проблема проявляется только на переходах и требует route-level trace.',
  },
] as const;

function expensiveProjectionScore(
  item: PerformanceCase,
  query: string,
  intensity: number,
  index: number,
) {
  let score = item.impact * 5 + item.frequency * 3 - item.averageDuration / 8;
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length > 0) {
    const haystack = `${item.title} ${item.summary}`.toLowerCase();
    if (haystack.includes(normalizedQuery)) {
      score += 24;
    }
  }

  for (let cursor = 0; cursor < intensity * 900; cursor += 1) {
    score += ((cursor + index) % 7) - 3;
  }

  return score;
}

export function projectPerformanceCases({
  query,
  area,
  sort,
  intensity,
}: {
  query: string;
  area: PerformanceArea;
  sort: CaseSort;
  intensity: number;
}) {
  let operations = 0;

  const filtered = performanceCases.filter((item, index) => {
    operations += 1;

    if (area !== 'all' && item.area !== area) {
      return false;
    }

    if (query.trim().length === 0) {
      return true;
    }

    const haystack = `${item.title} ${item.summary}`.toLowerCase();

    return haystack.includes(query.trim().toLowerCase()) || index % 4 === 0;
  });

  const projected = filtered
    .map((item, index) => {
      const score = expensiveProjectionScore(item, query, intensity, index);
      operations += intensity * 900;

      return {
        ...item,
        score,
      };
    })
    .sort((left, right) => {
      if (sort === 'duration') {
        return right.averageDuration - left.averageDuration;
      }

      if (sort === 'frequency') {
        return right.frequency - left.frequency;
      }

      return right.score - left.score;
    });

  const visibleItems = projected.slice(0, 7);
  const totalDuration = visibleItems.reduce((sum, item) => sum + item.averageDuration, 0);
  const peakDuration = visibleItems.reduce(
    (max, item) => Math.max(max, item.averageDuration),
    0,
  );

  return {
    visibleItems,
    matchCount: filtered.length,
    operations,
    totalDuration,
    peakDuration,
  };
}
