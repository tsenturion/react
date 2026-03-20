import type { PlacementScenario } from './state-architecture-domain';
import type { StatusTone } from './learning-model';

export type PlacementDecision = {
  target: 'derive' | 'local' | 'shared-parent' | 'normalized' | 'server';
  tone: StatusTone;
  reason: string;
  checklist: string[];
  snippet: string;
};

export function buildPlacementDecision(scenario: PlacementScenario): PlacementDecision {
  if (scenario.serverOwned) {
    return {
      target: 'server',
      tone: 'warn',
      reason:
        'Если данные приходят с сервера и являются source of truth вне компонента, локальный state не должен дублировать их без необходимости.',
      checklist: [
        'Владельцем остаётся сервер или route/data layer.',
        'UI хранит только локальные ephemeral flags.',
      ],
      snippet: [
        'const { data } = useLoaderData();',
        'const [isDialogOpen, setIsDialogOpen] = useState(false);',
      ].join('\n'),
    };
  }

  if (scenario.derivedFromOtherState) {
    return {
      target: 'derive',
      tone: 'success',
      reason:
        'Если значение полностью вычисляется из другого state, отдельное хранение создаёт лишнюю точку рассинхронизации.',
      checklist: [
        'Не хранить duplicate totals.',
        'Вычислять значение на каждом рендере.',
      ],
      snippet: [
        'const completed = tasks.filter((task) => task.done).length;',
        'const visible = tasks.filter(matchesQuery);',
      ].join('\n'),
    };
  }

  if (scenario.duplicatedAcrossBranches) {
    return {
      target: 'normalized',
      tone: 'warn',
      reason:
        'Если одна и та же сущность дублируется в разных ветках, архитектура выигрывает от entity storage и ссылок по id.',
      checklist: [
        'Хранить сущности в map по id.',
        'Связи выражать через ids, а не через копии объекта.',
      ],
      snippet: [
        'teachersById: { [id]: teacher },',
        'cardsById: { [id]: { title, teacherId } },',
      ].join('\n'),
    };
  }

  if (scenario.neededBySiblings || scenario.mustPersistAcrossPages) {
    return {
      target: 'shared-parent',
      tone: 'success',
      reason:
        'Когда состояние нужно нескольким соседним веткам или общему layout-блоку, его поднимают в ближайшего общего владельца.',
      checklist: [
        'Найти ближайшего общего владельца.',
        'Не поднимать состояние выше, чем требует реальное использование.',
      ],
      snippet: [
        'const [selectedId, setSelectedId] = useState(null);',
        '<Sidebar selectedId={selectedId} />',
        '<Details selectedId={selectedId} />',
      ].join('\n'),
    };
  }

  return {
    target: 'local',
    tone: 'success',
    reason:
      'Если значение нужно только одному leaf-компоненту и не влияет на соседей, лучше держать его рядом с местом использования.',
    checklist: [
      'Не раздувать root state.',
      'Не прокидывать лишние props вниз по дереву.',
    ],
    snippet: [
      'function LeafPanel() {',
      '  const [open, setOpen] = useState(false);',
      '}',
    ].join('\n'),
  };
}
