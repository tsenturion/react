import type { StatusTone } from './learning-model';

export type LegacyContextScenario =
  | 'class-consumer'
  | 'consumer-render-prop'
  | 'historical-legacy-context'
  | 'modern-hook'
  | 'migration';

export const contextScenarioCards: readonly {
  id: LegacyContextScenario;
  title: string;
  tone: StatusTone;
  note: string;
}[] = [
  {
    id: 'class-consumer',
    title: 'contextType в class components',
    tone: 'warn',
    note: 'Старый, но всё ещё рабочий способ чтения context внутри одного class consumer.',
  },
  {
    id: 'consumer-render-prop',
    title: 'Context.Consumer',
    tone: 'warn',
    note: 'Гибкий legacy-friendly API, но обычно более шумный, чем useContext.',
  },
  {
    id: 'historical-legacy-context',
    title: 'childContextTypes / contextTypes',
    tone: 'error',
    note: 'Историческая модель legacy context, полезная для чтения старого кода, но не для нового проектирования.',
  },
  {
    id: 'modern-hook',
    title: 'useContext',
    tone: 'success',
    note: 'Современный и наиболее прямой способ выразить context dependency.',
  },
  {
    id: 'migration',
    title: 'Migration-first reading',
    tone: 'success',
    note: 'Сначала найдите provider boundary и ответственность значения, только потом меняйте способ consumption.',
  },
] as const;

export function describeContextRecommendation(useCase: string): {
  title: string;
  tone: StatusTone;
  steps: readonly string[];
} {
  if (useCase === 'legacy-class-shell') {
    return {
      title: 'Оставьте class consumer и стабилизируйте provider boundary',
      tone: 'warn',
      steps: [
        'Сначала определите, где реально находится provider.',
        'Потом уберите лишние nested overrides.',
        'Только затем переносите потребителей на useContext по одному.',
      ],
    };
  }

  return {
    title: 'Новый код проектируйте через useContext и явные границы provider',
    tone: 'success',
    steps: [
      'Держите provider как можно ближе к реальной области ответственности.',
      'Избегайте превращать context в глобальный контейнер для всего подряд.',
      'Оставляйте старые consumers только там, где они ещё поддерживают legacy tree.',
    ],
  };
}
