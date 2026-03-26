export type OverviewFocus =
  | 'all'
  | 'boundaries'
  | 'lazy'
  | 'use'
  | 'server'
  | 'streaming';

export type OverviewCard = {
  id: string;
  title: string;
  blurb: string;
  focus: Exclude<OverviewFocus, 'all'>;
  whyItMatters: string;
  typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'boundary-design',
    title: 'Suspense — это граница ожидания, а не глобальный loading mode',
    blurb:
      'Граница определяет, какая часть UI может ждать отдельно, а какая уже должна оставаться видимой.',
    focus: 'boundaries',
    whyItMatters:
      'От размера границы зависит, скрывает ли одна медленная секция весь экран или только собственный остров.',
    typicalFailure:
      'Обернуть Suspense весь экран и тем самым превратить локальную задержку в полный откат страницы к одному fallback.',
  },
  {
    id: 'lazy-chunks',
    title: 'lazy + Suspense режут код, но не проектируют UX автоматически',
    blurb:
      'Code splitting полезен только тогда, когда fallback не уничтожает уже готовую часть интерфейса.',
    focus: 'lazy',
    whyItMatters:
      'Граница вокруг lazy-компонента решает, останется ли рядом уже видимый контент, пока chunk ещё не доехал.',
    typicalFailure:
      'Использовать один общий Suspense для нескольких lazy-виджетов и терять уже открытый блок из-за загрузки соседнего.',
  },
  {
    id: 'resource-reading',
    title: 'use(Promise) переводит данные в resource reading внутри render',
    blurb:
      'Компонент не ждёт promise вручную в effect, а читает ресурс прямо в рендере через Suspense boundary.',
    focus: 'use',
    whyItMatters:
      'Так ожидание становится частью структуры дерева, а не набором ручных флагов loading/data/error вокруг каждого state.',
    typicalFailure:
      'Создавать новый promise на каждый render и тем самым срывать стабильность resource cache и повторного чтения.',
  },
  {
    id: 'server-waiting',
    title: 'На сервере Suspense меняет не только fallback, но и сам способ доставки HTML',
    blurb:
      'Сервер может отдать shell раньше полной готовности всех данных и постепенно достраивать ответ.',
    focus: 'server',
    whyItMatters:
      'Это уже не просто local loading indicator: меняется порядок flush HTML, hydration и perceived performance страницы.',
    typicalFailure:
      'Мысленно переносить клиентскую модель «ждём данные и показываем fallback» на сервер без понимания streaming и разницы между toString и stream.',
  },
  {
    id: 'streaming-thinking',
    title: 'Потоковое мышление раскладывает экран на части с разной скоростью готовности',
    blurb:
      'Вместо вопроса «когда загрузится весь экран» появляется вопрос «что должно быть видно, доступно и интерактивно раньше остальных частей».',
    focus: 'streaming',
    whyItMatters:
      'Так строятся большие экраны без монолитного ожидания, особенно когда shell, навигация и тяжёлые секции готовы в разное время.',
    typicalFailure:
      'Проектировать экран как одну неразделимую страницу и потом пытаться добавить streaming постфактум без переосмысления boundaries.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'boundaries' ||
    value === 'lazy' ||
    value === 'use' ||
    value === 'server' ||
    value === 'streaming'
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
