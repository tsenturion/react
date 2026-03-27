export type OverviewFocus = 'all' | 'stability' | 'computation' | 'lists' | 'tradeoffs';

export const memoizationGuideCards = [
  {
    id: 'stable-boundaries',
    focus: 'stability',
    title: 'memo работает только вместе со стабильными входными данными',
    summary:
      'Сам по себе `memo` не отменяет parent render. Он лишь не пускает лишний render в child, если props сравнимы и действительно остались теми же.',
    whyItMatters:
      'Если в child летит новый object или callback на каждый parent render, memo-граница пробивается и пользы почти нет.',
  },
  {
    id: 'derived-computation',
    focus: 'computation',
    title: 'useMemo нужен там, где важно не пересчитывать derived data без причины',
    summary:
      '`useMemo` полезен не как универсальный ускоритель, а когда вычисление дорогое или когда нужно стабилизировать derived object для memo-child.',
    whyItMatters:
      'Тривиальная строковая конкатенация не становится лучше от useMemo, а вычисление фильтрованного каталога или grouped summary может выиграть заметно.',
  },
  {
    id: 'callback-stability',
    focus: 'stability',
    title:
      'useCallback важен ровно настолько, насколько важна стабильность обработчика для downstream tree',
    summary:
      'Стабильный callback обычно нужен не сам по себе, а для `memo`-детей, row-компонентов и API, где ссылка участвует в сравнении.',
    whyItMatters:
      'Если child не memoized и не зависит от referential equality, лишний useCallback только увеличивает шум кода.',
  },
  {
    id: 'lists-first',
    focus: 'lists',
    title: 'На списках цена нестабильных ссылок видна быстрее всего',
    summary:
      'Когда родитель прокидывает в rows новые objects, derived arrays и callbacks, список теряет локальность обновлений и начинает перерисовываться широко.',
    whyItMatters:
      'Именно здесь становится видно, что одна нестабильная ссылка может умножиться на десятки элементов.',
  },
  {
    id: 'tradeoffs',
    focus: 'tradeoffs',
    title: 'Мемоизация имеет собственную цену и не заменяет архитектурное упрощение',
    summary:
      'Каждый `memo`, `useMemo` и `useCallback` добавляет точки зависимости, сравнений и возможные ошибки со stale deps.',
    whyItMatters:
      'Если bottleneck решается placement state, сужением props или упрощением структуры, это почти всегда лучше, чем слоить мемоизацию поверх проблемы.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'stability' ||
    value === 'computation' ||
    value === 'lists' ||
    value === 'tradeoffs'
  ) {
    return value;
  }

  return 'all';
}

export function filterGuideCardsByFocus(focus: OverviewFocus) {
  return focus === 'all'
    ? memoizationGuideCards
    : memoizationGuideCards.filter((item) => item.focus === focus);
}
