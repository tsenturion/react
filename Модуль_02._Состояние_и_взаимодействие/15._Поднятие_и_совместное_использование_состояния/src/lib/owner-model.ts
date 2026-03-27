import type { OwnerScenario } from './shared-state-domain';
import type { StatusTone } from './learning-model';

export type OwnerDecision = {
  target: 'local' | 'shared-parent' | 'layout-or-route';
  tone: StatusTone;
  reason: string;
  checklist: string[];
  snippet: string;
};

export function buildOwnerDecision(scenario: OwnerScenario): OwnerDecision {
  if (scenario.needsCrossPagePersistence || scenario.affectsLayoutSummary) {
    return {
      target: 'layout-or-route',
      tone: 'warn',
      reason:
        'Если одно и то же значение влияет на общий layout, summary-хедер или несколько экранов, владельцем становится более высокий общий уровень приложения.',
      checklist: [
        'Поднимать только до реального общего владельца.',
        'Не смешивать там локальные leaf-флаги без необходимости.',
      ],
      snippet: [
        'const [activeWorkspace, setActiveWorkspace] = useState("state");',
        '<Header activeWorkspace={activeWorkspace} />',
        '<Page activeWorkspace={activeWorkspace} />',
      ].join('\n'),
    };
  }

  if (scenario.usedBySiblings) {
    return {
      target: 'shared-parent',
      tone: 'success',
      reason:
        'Если значение нужно нескольким соседним веткам, его поднимают к ближайшему общему владельцу и держат в одном source of truth.',
      checklist: [
        'Одна переменная состояния вместо нескольких локальных копий.',
        'Callbacks поднимают изменения вверх, props разносят их вниз.',
      ],
      snippet: [
        'const [selectedId, setSelectedId] = useState("alpha");',
        '<Toolbar selectedId={selectedId} onSelect={setSelectedId} />',
        '<Details selectedId={selectedId} />',
      ].join('\n'),
    };
  }

  return {
    target: 'local',
    tone: 'success',
    reason:
      'Если значение используется только одним leaf-компонентом и не влияет на соседей, поднимать его выше не нужно.',
    checklist: ['Не раздувать общий state.', 'Не провоцировать лишний prop drilling.'],
    snippet: [
      'function LeafPanel() {',
      '  const [open, setOpen] = useState(false);',
      '}',
    ].join('\n'),
  };
}
