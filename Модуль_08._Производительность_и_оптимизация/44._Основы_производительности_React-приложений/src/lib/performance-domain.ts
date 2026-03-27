export type OverviewFocus = 'all' | 'rerenders' | 'structure' | 'measurement';

export type GuideCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  summary: string;
  whyItMatters: string;
};

export const performanceGuideCards: readonly GuideCard[] = [
  {
    id: 'render-source',
    focus: 'rerenders',
    title: 'Ререндер сам по себе не баг',
    summary: 'Проблема начинается там, где перерисовка затрагивает дорогую ветку.',
    whyItMatters:
      'Сначала нужно понять scope рендера, а уже потом думать про оптимизацию.',
  },
  {
    id: 'prop-identity',
    focus: 'rerenders',
    title: 'Новый object prop меняет картину',
    summary:
      'Даже одинаковые по содержимому объекты имеют новую ссылку и могут пробить memo-границу.',
    whyItMatters:
      'Это один из самых частых источников «почему снова ререндерится memo-child».',
  },
  {
    id: 'state-placement',
    focus: 'structure',
    title: 'State placement важнее точечной микрооптимизации',
    summary:
      'Если draft state лежит слишком высоко, он тянет за собой всё поддерево на каждый ввод.',
    whyItMatters:
      'Перенос состояния ближе к месту использования часто снимает проблему без сложных приёмов.',
  },
  {
    id: 'data-shape',
    focus: 'structure',
    title: 'Форма данных тоже влияет на скорость',
    summary:
      'Nested projection и лишний обход больших коллекций легко разрастаются вместе с данными.',
    whyItMatters:
      'Иногда быстрее не memo-изировать, а изменить shape данных и уменьшить объём работы.',
  },
  {
    id: 'measure-first',
    focus: 'measurement',
    title: 'Измеряйте до оптимизации',
    summary:
      'Без наблюдаемого сигнала легко исправить не ту ветку и усложнить код без пользы.',
    whyItMatters:
      'Хорошая оптимизация начинается с вопроса: что именно дорого и когда это чувствуется?',
  },
  {
    id: 'strict-mode',
    focus: 'measurement',
    title: 'Dev-mode шум не равен production-проблеме',
    summary:
      'Initial mount в StrictMode выглядит громче, но это ещё не значит, что экран тормозит у пользователя.',
    whyItMatters:
      'Нужно отделять диагностический шум development от реального bottleneck.',
  },
] as const;

export const renderCauseCards = [
  'Parent state change ререндерит родителя и всё, что не изолировано ниже.',
  'Local state change ререндерит только тот компонент, которому это состояние принадлежит.',
  'Meaningful prop change должен приводить к новому рендеру: это нормальная реакция React.',
  'Новый объект в `props` может выглядеть невинно, но ломает referential equality.',
] as const;

export const bottleneckProfiles = [
  {
    title: 'Wide rerender tree',
    summary:
      'Незаметный toggle наверху цепляет большой expensive subtree и делает действие ощутимо медленным.',
  },
  {
    title: 'Heavy derived work',
    summary:
      'Повторная фильтрация, сортировка и агрегация больших данных делают каждый рендер дороже.',
  },
  {
    title: 'Premature optimization',
    summary:
      'Код уже усложнился из-за memo и ref-трюков, а источник лага так и не был измерен.',
  },
] as const;

export const prematureOptimizationCards = [
  'Не добавляйте `memo` и `useMemo` во всё подряд без измерения bottleneck.',
  'Не поднимайте state выше только ради «удобства», если он нужен одному leaf-компоненту.',
  'Не путайте dev-only шум со сценариями, где пользователь реально видит задержку.',
  'Не лечите данные через render-трюки, если проблема в их форме или лишних обходах.',
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (value === 'rerenders' || value === 'structure' || value === 'measurement') {
    return value;
  }

  return 'all';
}

export function filterGuideCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return performanceGuideCards;
  }

  return performanceGuideCards.filter((item) => item.focus === focus);
}
