import type { StatusTone } from './learning-model';

export type InspectorNodeId = 'filter-panel' | 'result-list' | 'detail-pane';

export function explainRenderReason(args: {
  nodeId: InspectorNodeId;
  filter: string;
  selectedTab: 'all' | 'warnings' | 'performance';
  theme: 'classic' | 'contrast';
}): {
  title: string;
  tone: StatusTone;
  bullets: readonly string[];
} {
  if (args.nodeId === 'filter-panel') {
    return {
      title: 'FilterPanel ререндерится из-за локального ввода и выбранной вкладки',
      tone: 'success',
      bullets: [
        'Изменение filter меняет controlled input state.',
        'Переключение tabs влияет на visible controls.',
        'Theme влияет на context snapshot, который тоже виден в панели.',
      ],
    };
  }

  if (args.nodeId === 'result-list') {
    return {
      title: 'ResultList ререндерится из-за props + context',
      tone: args.filter.length > 5 ? 'warn' : 'success',
      bullets: [
        'Список зависит от filter и selectedTab как от входных props.',
        'Theme меняет visual density и тоже попадает в render reason.',
        args.filter.length > 5
          ? 'Длинный filter особенно полезно сверять через DevTools snapshot, чтобы не искать причину в DOM.'
          : 'Текущий filter короткий, поэтому причина изменения читается довольно прозрачно.',
      ],
    };
  }

  return {
    title: 'DetailPane комбинирует props, state и context',
    tone: args.selectedTab === 'performance' ? 'warn' : 'success',
    bullets: [
      'Выбранный элемент приходит как props.',
      'Theme и selectedTab влияют на то, как секция визуализирует акценты и подсказки.',
      args.selectedTab === 'performance'
        ? 'Performance tab добавляет ещё одну ветку условий, поэтому DevTools помогает быстро увидеть реальную комбинацию входов.'
        : 'В текущем режиме зависимостей меньше, поэтому reason chain проще.',
    ],
  };
}

export const inspectorTakeaways = [
  'Сначала найдите компонент с неверным поведением, потом сравните его props, state и context snapshot.',
  'React DevTools полезен тем, что показывает React-level дерево, а не только DOM.',
  'Причина ререндера почти всегда читается как комбинация ownership state, props chain и context updates.',
  'Инспекция должна заканчиваться действием: исправлением API, состояния, эффекта или guardrail-а.',
] as const;
