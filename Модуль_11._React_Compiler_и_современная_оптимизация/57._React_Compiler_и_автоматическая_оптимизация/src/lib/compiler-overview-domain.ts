export type OverviewFocus =
  | 'all'
  | 'mental-model'
  | 'rollout'
  | 'profiling'
  | 'limits'
  | 'architecture';

export type OverviewCard = {
  readonly id: string;
  readonly focus: Exclude<OverviewFocus, 'all'>;
  readonly title: string;
  readonly blurb: string;
  readonly whyItMatters: string;
  readonly typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'compiler-mental-model',
    focus: 'mental-model',
    title: 'Compiler убирает часть ручной мемоизации, но не заменяет модель данных',
    blurb:
      'React Compiler пытается автоматически сохранять стабильность там, где раньше вручную добавляли `memo`, `useMemo` и `useCallback` ради одинаковых ссылок.',
    whyItMatters:
      'Это уменьшает клей из ручной оптимизации и освобождает код от большого количества incidental complexity.',
    typicalFailure:
      'Compiler воспринимают как автоматический фикс любых лагов, хотя context blast radius, тяжелые эффекты и плохая структура состояния остаются архитектурной проблемой.',
  },
  {
    id: 'rollout-discipline',
    focus: 'rollout',
    title:
      'Правильный rollout начинается с lint и профилирования, а не с массового удаления useMemo',
    blurb:
      'Нормальный путь внедрения — сначала увидеть compiler diagnostics, собрать profiling baseline и только потом масштабировать включение.',
    whyItMatters:
      'Так можно отличить реальный выигрыш от слепой миграции, которая только меняет синтаксис, но не поведение.',
    typicalFailure:
      'Команда удаляет всю ручную мемоизацию сразу, не понимая, какие места были workaround для library boundaries или кастомных сравнений.',
  },
  {
    id: 'profiling-first',
    focus: 'profiling',
    title:
      'Проверять нужно commit time и причины ререндеров, а не просто наличие компилятора в сборке',
    blurb:
      'Compiler даёт ценность, когда уменьшает повторную работу дерева, но это нужно подтверждать через Profiler и реальные interaction сценарии.',
    whyItMatters:
      'Без profiling легко принять синтаксическую чистку за performance work и пропустить настоящий bottleneck.',
    typicalFailure:
      'Оптимизацию признают успешной по одному факту “теперь useCallback не нужен”, хотя медленный список или тяжелый effect не изменились.',
  },
  {
    id: 'limits-and-bailouts',
    focus: 'limits',
    title: 'Impure render и мутации превращают compiler в observer, а не в optimizer',
    blurb:
      'Если компонент зависит от мутабельных значений, побочных эффектов в render или несовместимой библиотеки, компилятор пропускает его.',
    whyItMatters:
      'Тема про React Compiler автоматически подтягивает важность purity, immutability и rules of React.',
    typicalFailure:
      'Проблему ищут в “плохом compiler”, хотя исходный код сам делает корректную оптимизацию невозможной.',
  },
  {
    id: 'architecture-boundary',
    focus: 'architecture',
    title:
      'Compiler не заменяет state colocation, нормальные boundaries и деление тяжёлых экранов',
    blurb:
      'Автоматическая мемоизация не лечит network waterfalls, плохое дерево провайдеров, giant context updates и перегруженные DOM-списки.',
    whyItMatters:
      'Это помогает не путать micro-optimization с архитектурной работой и не заниматься магическим мышлением.',
    typicalFailure:
      'Компилятору поручают задачу, которую должен решать рефакторинг структуры состояния, маршрутов или серверных данных.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'mental-model' ||
    value === 'rollout' ||
    value === 'profiling' ||
    value === 'limits' ||
    value === 'architecture'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
