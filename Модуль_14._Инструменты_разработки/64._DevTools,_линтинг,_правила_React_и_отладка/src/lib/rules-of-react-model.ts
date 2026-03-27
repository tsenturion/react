import type { StatusTone } from './learning-model';

export type ReactRuleId =
  | 'conditional-hook'
  | 'hook-in-loop'
  | 'component-factory'
  | 'ref-read-render'
  | 'impure-prop-mutation'
  | 'unsupported-syntax';

export const reactRuleCatalog: readonly {
  id: ReactRuleId;
  title: string;
  lintRule: string;
  runtimeSymptom: string;
  whyItMatters: string;
}[] = [
  {
    id: 'conditional-hook',
    title: 'Hook inside condition',
    lintRule: 'react-hooks/rules-of-hooks',
    runtimeSymptom: 'Порядок хуков становится нестабильным, и компонент может упасть.',
    whyItMatters:
      'React привязывает state и effects к порядку вызовов, а не к именам хуков.',
  },
  {
    id: 'hook-in-loop',
    title: 'Hook inside loop',
    lintRule: 'react-hooks/rules-of-hooks',
    runtimeSymptom:
      'При разном числе итераций component state связывается с неверными слотами.',
    whyItMatters: 'Логика цикла разрушает предсказуемую структуру render calls.',
  },
  {
    id: 'component-factory',
    title: 'Component factory in render',
    lintRule: 'react-hooks/static-components',
    runtimeSymptom: 'Поддерево каждый раз получает новую identity и становится хрупким.',
    whyItMatters:
      'Component boundary должна быть стабильной, иначе reasoning по дереву усложняется.',
  },
  {
    id: 'ref-read-render',
    title: 'Ref read during render',
    lintRule: 'react-hooks/refs',
    runtimeSymptom: 'Компонент опирается на mutable escape hatch прямо в render phase.',
    whyItMatters:
      'Render должен опираться на props/state/context, а не на скрытое mutable значение.',
  },
  {
    id: 'impure-prop-mutation',
    title: 'Mutating props during render',
    lintRule: 'react-hooks/purity',
    runtimeSymptom:
      'Поведение становится неидемпотентным и плохо объясняется через snapshot state.',
    whyItMatters: 'Impure render ломает основу React mental model и затрудняет отладку.',
  },
  {
    id: 'unsupported-syntax',
    title: 'Unsupported syntax for React analysis',
    lintRule: 'react-hooks/unsupported-syntax',
    runtimeSymptom:
      'Инструменты теряют часть информации о компонентных границах и правилах.',
    whyItMatters:
      'Tooling quality зависит от того, насколько проект остаётся анализируемым.',
  },
] as const;

export function analyzeRulePressure(activeRules: readonly ReactRuleId[]): {
  tone: StatusTone;
  title: string;
  hotZone: 'hooks-order' | 'render-purity' | 'architecture';
  copy: string;
} {
  const hasHooksOrder =
    activeRules.includes('conditional-hook') || activeRules.includes('hook-in-loop');
  const hasPurity =
    activeRules.includes('ref-read-render') ||
    activeRules.includes('impure-prop-mutation');

  if (hasHooksOrder) {
    return {
      tone: 'error',
      title: 'Нарушен базовый порядок хуков',
      hotZone: 'hooks-order',
      copy: 'Это критическая зона: такой код может ломаться не “иногда”, а по самой структуре вызовов render.',
    };
  }

  if (hasPurity) {
    return {
      tone: 'warn',
      title: 'Проблема находится в render purity и escape hatches',
      hotZone: 'render-purity',
      copy: 'Баг может выглядеть как нестабильный UI, хотя корень лежит в нечистой логике render.',
    };
  }

  return {
    tone: activeRules.length > 0 ? 'warn' : 'success',
    title:
      activeRules.length > 0
        ? 'Инструменты сигнализируют об архитектурной хрупкости'
        : 'Правила React соблюдены',
    hotZone: 'architecture',
    copy:
      activeRules.length > 0
        ? 'Здесь ошибка не в одном хуке, а в том, как организованы компонентные границы и анализируемость кода.'
        : 'Текущий набор patterns остаётся дружелюбным к React rules и tooling.',
  };
}

export const rulesTakeaways = [
  'Rules of React сегодня шире классического rules-of-hooks.',
  'Нарушение purity часто проявляется как debugging pain ещё до явного runtime error.',
  'Ref misuse и component factories обычно выглядят как локальные удобства, но ухудшают системную читаемость дерева.',
  'Лучше менять структуру компонента, чем отключать правило и оставлять хрупкую модель.',
] as const;
