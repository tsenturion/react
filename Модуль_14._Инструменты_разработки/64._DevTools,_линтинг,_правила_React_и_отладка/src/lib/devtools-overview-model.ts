export type OverviewFocus =
  | 'all'
  | 'inspection'
  | 'lint'
  | 'rules'
  | 'debugging'
  | 'quality';

export type ToolingOverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  caution: string;
  practicalLens: string;
};

const overviewCards: readonly ToolingOverviewCard[] = [
  {
    id: 'devtools-inspection',
    focus: 'inspection',
    title: 'DevTools показывает живое дерево данных, а не просто DOM',
    blurb:
      'Главная ценность React DevTools в том, что он позволяет смотреть на props, state, context и render reasons именно на уровне React-компонентов.',
    whyItMatters:
      'Так проще разделить баг в UI на источник данных, контракт компонента и реальную точку ререндера.',
    caution:
      'Если смотреть только в DOM или только в network tab, можно пропустить реальную причину проблемы внутри component tree.',
    practicalLens:
      'Сначала локализуйте компонент, потом сравните props/state/context snapshot, и только затем оптимизируйте или правьте логику.',
  },
  {
    id: 'linting',
    focus: 'lint',
    title: 'Линтер ловит не стиль, а архитектурные нарушения React-модели',
    blurb:
      'ESLint и eslint-plugin-react-hooks в современном проекте проверяют не только формат кода, но и допущения о purity, hooks order, refs и side effects.',
    whyItMatters:
      'Это даёт ранний сигнал до runtime-ошибки, regression в QA или сложной отладки в DevTools.',
    caution:
      'Если отключать предупреждения без понимания причины, линтер перестаёт быть guardrail и становится шумом.',
    practicalLens:
      'Полезно читать lint finding как архитектурный вопрос: какое предположение о React здесь оказалось неверным?',
  },
  {
    id: 'rules-of-react',
    focus: 'rules',
    title:
      'Rules of React расширились: важен не только hooks order, но и purity, refs и factories',
    blurb:
      'Современный lint stack проверяет не только rules-of-hooks, но и более тонкие ограничения React-модели.',
    whyItMatters:
      'Это особенно важно в больших codebase, где баги появляются не из-за одной строки, а из-за системного расхождения с моделью рендеринга.',
    caution:
      'Не все нарушения проявляются мгновенно: часть из них сначала выглядит как “странный ререндер”, “нестабильный ref” или “хрупкий компонентный API”.',
    practicalLens:
      'Лучше воспринимать эти правила как рамку проектирования, а не как список запретов после факта.',
  },
  {
    id: 'debugging',
    focus: 'debugging',
    title:
      'Отладка работает лучше как маршрут между инструментами, а не как один волшебный tool',
    blurb:
      'DevTools, линтер, profiler-style reasoning и тесты закрывают разные части проблемы и усиливают друг друга.',
    whyItMatters:
      'Так удаётся понять не только что сломалось, но и почему ошибка вообще стала возможной.',
    caution:
      'Если искать ответ только в одном инструменте, часто теряется причинно-следственная цепочка между кодом, данными и поведением интерфейса.',
    practicalLens:
      'Сначала выберите тип симптома, затем инструмент для локализации, затем инструмент для подтверждения гипотезы.',
  },
  {
    id: 'quality-system',
    focus: 'quality',
    title: 'Инструменты разработки образуют контур качества проекта',
    blurb:
      'Config линтера, debugging workflow, архитектурные проверки и тесты должны быть согласованы между собой.',
    whyItMatters:
      'Тогда проект защищён не точечно, а системно: одинаковые инварианты повторяются в коде, линте и проверках.',
    caution:
      'Набор разрозненных инструментов без общей логики часто создаёт иллюзию контроля, но не повышает устойчивость проекта.',
    practicalLens:
      'Хороший toolchain сначала помогает принять верное решение в коде, а уже потом только ловит ошибку.',
  },
  {
    id: 'inspection-to-action',
    focus: 'inspection',
    title: 'Инспекция полезна только тогда, когда переходит в конкретное действие',
    blurb:
      'Снимок props/state/context сам по себе не исправляет баг. Он нужен, чтобы перевести проблему в решение: смену API, исправление эффекта, изменение ownership state или добавление теста.',
    whyItMatters:
      'Именно это превращает DevTools и lint из диагностических экранов в часть инженерного процесса.',
    caution:
      'Если ограничиться “посмотрел дерево”, но не закрепить вывод в коде и проверках, тот же класс багов быстро вернётся.',
    practicalLens:
      'Каждый найденный симптом должен заканчиваться явным изменением: fix, guardrail, правило или тест.',
  },
] as const;

export const toolingComparisonRows = [
  {
    tool: 'React DevTools',
    strength:
      'Показывает живой snapshot props/state/context и помогает локализовать компонент.',
    limit: 'Не объясняет сам по себе, почему код вообще оказался написан так.',
  },
  {
    tool: 'ESLint + react-hooks',
    strength: 'Даёт ранний сигнал об архитектурных и hooks-related нарушениях.',
    limit: 'Не показывает реальный пользовательский сценарий и runtime данные.',
  },
  {
    tool: 'Profiler-style reasoning',
    strength: 'Помогает анализировать причины ререндеров и стоимость обновлений.',
    limit: 'Не заменяет проверку контрактов, side effects и lint-инвариантов.',
  },
  {
    tool: 'Тесты',
    strength: 'Подтверждают, что баг действительно исправлен и guardrail закреплён.',
    limit: 'Без диагностики не всегда помогают быстро найти исходную причину.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
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
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly ToolingOverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
