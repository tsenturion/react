export type OverviewFocus =
  | 'all'
  | 'execution'
  | 'async'
  | 'composition'
  | 'bundle'
  | 'mindset';

export type OverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'server-default',
    focus: 'mindset',
    title: 'Server by default, client by need',
    blurb:
      'В mixed приложении выгодно сначала считать компонент server, а не client. В client слой попадает только то, что реально требует browser APIs, local interaction или live typing.',
    whyItMatters:
      'Это удерживает данные рядом с источником, уменьшает JS bundle и не размазывает гидрацию по всему экрану.',
    typicalFailure:
      'Весь экран делают client из-за одного поиска или toggle, и вместе с ним в браузер уезжают тяжёлые data blocks.',
  },
  {
    id: 'execution-boundary',
    focus: 'execution',
    title: 'Граница меняет место исполнения',
    blurb:
      'После пересечения server/client boundary меняются не только imports, но и сама среда выполнения: доступ к данным, hooks, browser APIs и стоимость bundle.',
    whyItMatters:
      'Если граница поставлена слишком высоко, клиент получает лишний код. Если слишком низко, появляется лишняя серверная связность или неудобная композиция.',
    typicalFailure:
      'Компонент трактуют как обычный UI-блок и забывают, что перенос в client автоматически делает его частью hydrate graph.',
  },
  {
    id: 'async-server-components',
    focus: 'async',
    title: 'Async server components убирают часть client fetch waterfall',
    blurb:
      'Серверный компонент может дождаться данных до отдачи client bundle. Это меняет порядок: сначала данные и HTML, потом гидрация islands.',
    whyItMatters:
      'Пользователь раньше видит содержимое, а разработчик не тратит client state и effect-обвязку на то, что можно вычислить на сервере.',
    typicalFailure:
      'Тот же запрос сначала делают на сервере ради shell, а потом повторяют на клиенте из-за неверно выбранной границы.',
  },
  {
    id: 'composition-rules',
    focus: 'composition',
    title: 'Composition важнее, чем просто “server рядом с client”',
    blurb:
      'Server components могут импортировать client components. Client components не могут напрямую импортировать server components, но могут получать server-rendered children от родителя server.',
    whyItMatters:
      'Именно эта разница определяет архитектуру mixed tree и то, как проектировать islands, wrappers и reusable UI.',
    typicalFailure:
      'Client wrapper начинает напрямую импортировать server list, и граница ломается уже на уровне модульной зависимости.',
  },
  {
    id: 'bundle-pressure',
    focus: 'bundle',
    title: 'Граница напрямую влияет на bundle и hydration pressure',
    blurb:
      'Server слой не уезжает в браузер как исполняемый client code. Чем больше статических и data-heavy блоков остаётся server, тем меньше JS приходится гидрировать.',
    whyItMatters:
      'Это особенно заметно на длинных экранах с таблицами, рекомендациями, приватными данными и тяжёлыми визуальными блоками.',
    typicalFailure:
      'Data-heavy grid переносят в client “на всякий случай”, хотя локальной интерактивности там почти нет, и платят bundle-стоимость без заметного UX-выигрыша.',
  },
  {
    id: 'mental-shift',
    focus: 'mindset',
    title: 'Меняется не только API, но и модель мышления',
    blurb:
      'RSC заставляют думать не “какой hook здесь удобнее”, а “где этому коду вообще нужно исполняться и где должны жить данные”.',
    whyItMatters:
      'Без этого server/client границы быстро превращаются в случайный набор директив, а не в архитектурный инструмент.',
    typicalFailure:
      'Server/client директивы добавляют точечно после ошибок сборки, вместо того чтобы заранее проектировать смешанное дерево.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'execution' ||
    value === 'async' ||
    value === 'composition' ||
    value === 'bundle' ||
    value === 'mindset'
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
