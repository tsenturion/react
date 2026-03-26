export type BoundaryPattern =
  | 'server-default'
  | 'client-island'
  | 'slot-composition'
  | 'client-heavy'
  | 'server-parent-client-child';

export function chooseBoundaryStrategy(input: {
  needsLiveTyping: boolean;
  readsPrivateData: boolean;
  wantsMinimalBundle: boolean;
  requiresBrowserApi: boolean;
  parentMostlyStatic: boolean;
  sharesLargeLocalState: boolean;
}) {
  if (input.requiresBrowserApi || input.needsLiveTyping) {
    if (input.parentMostlyStatic) {
      return {
        primaryPattern: 'client-island' as const,
        title:
          'Оставьте parent server, а interactive зону вынесите в узкий client island',
        why: 'Browser APIs и live typing требуют client layer, но нет причины тащить в него весь surrounding tree.',
        antiPattern:
          'Не переводите весь page shell в client только ради одного input или picker.',
        steps: [
          'Server component читает данные и собирает shell.',
          'Client island получает только минимально нужные props.',
          'Тяжёлые data blocks и приватные вычисления остаются server-only.',
        ],
      };
    }

    return {
      primaryPattern: 'server-parent-client-child' as const,
      title: 'Сделайте mixed tree с явно выделенным client subtree',
      why: 'Интерактивный слой достаточно крупный, поэтому его лучше оформить как самостоятельную client ветку под server parent.',
      antiPattern:
        'Не размазывайте client hooks по многим мелким блокам без общей boundary discipline.',
      steps: [
        'Parent route/page остаётся server.',
        'Interactive subtree живёт в одном client boundary.',
        'Server data пробрасываются вниз как props, а не дублируются через client fetch без необходимости.',
      ],
    };
  }

  if (input.readsPrivateData && input.wantsMinimalBundle) {
    return {
      primaryPattern: 'server-default' as const,
      title: 'Держите блок на сервере по умолчанию',
      why: 'Приватные данные и минимальный bundle лучше всего сочетаются с server-only исполнением.',
      antiPattern:
        'Не переносите приватный data block в client ради “на будущее, вдруг понадобится интерактивность”.',
      steps: [
        'Данные читаются рядом с серверным кэшем или БД.',
        'В браузер уходит уже готовый markup.',
        'Если позже понадобится интерактивность, вокруг точечной зоны добавляется island.',
      ],
    };
  }

  if (input.parentMostlyStatic && !input.sharesLargeLocalState) {
    return {
      primaryPattern: 'slot-composition' as const,
      title: 'Используйте slot-композицию между server output и client wrapper',
      why: 'Это полезно, когда нужен client wrapper, но сам тяжёлый content должен остаться server-rendered.',
      antiPattern:
        'Не пытайтесь импортировать server child прямо из client wrapper. Передавайте его через parent server component.',
      steps: [
        'Parent server component собирает content.',
        'Client wrapper получает content как children/slot.',
        'Граница остаётся узкой и не ломает import direction.',
      ],
    };
  }

  return {
    primaryPattern: 'client-heavy' as const,
    title: 'Оставляйте блок на клиенте только если local state действительно доминирует',
    why: 'Если shared local state больше, чем data benefit от сервера, client-heavy решение может быть оправдано, но это уже осознанный trade-off.',
    antiPattern:
      'Не называйте такое решение “универсальным” — bundle и hydration pressure будут выше.',
    steps: [
      'Измерьте bundle и количество bridge-запросов.',
      'Оставьте на клиенте только то, что реально выигрывает от общей local state модели.',
      'Все соседние static/data-heavy блоки по возможности верните в server layer.',
    ],
  };
}
