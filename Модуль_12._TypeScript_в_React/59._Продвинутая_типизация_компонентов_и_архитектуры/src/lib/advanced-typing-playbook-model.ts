import type { StatusTone } from './learning-model';

export const typingPains = [
  'state-machine',
  'generic-reusable',
  'polymorphic-primitive',
  'design-system',
  'mixed-boundaries',
] as const;
export type TypingPain = (typeof typingPains)[number];

export const teamMaturities = ['starting', 'confident', 'advanced'] as const;
export type TeamMaturity = (typeof teamMaturities)[number];

export const rolloutScopes = ['one-feature', 'shared-layer', 'system-wide'] as const;
export type RolloutScope = (typeof rolloutScopes)[number];

export type PlaybookInput = {
  pain: TypingPain;
  team: TeamMaturity;
  scope: RolloutScope;
  ownsDesignSystem: boolean;
};

export type PlaybookRecommendation = {
  title: string;
  tone: StatusTone;
  summary: string;
  nextSteps: readonly string[];
  watchouts: readonly string[];
};

export function buildTypingRecommendation(input: PlaybookInput): PlaybookRecommendation {
  if (input.pain === 'state-machine') {
    return {
      title: 'Начните с typed reducer и state unions',
      tone: 'warn',
      summary:
        'Сложный экран даст быстрый выигрыш, если сначала оформить actions и branches как конечную typed-модель.',
      nextSteps: [
        'Выделите action union и reducer из компонента.',
        'Сведите экран к нескольким конечным веткам состояния.',
        'Добавьте exhaustive handling для новых action types.',
      ],
      watchouts: [
        'Не тяните в reducer произвольные payload-объекты без явного контракта.',
        'Не смешивайте UI flags и domain transitions в одной бесформенной структуре.',
      ],
    };
  }

  if (input.pain === 'generic-reusable') {
    return {
      title:
        'Проверяйте, есть ли у abstractions повторяемая форма, а не только общий JSX',
      tone: 'success',
      summary:
        'Generic API стоит вводить там, где повторяется одна и та же структура взаимодействия: list, selection, details, filtering.',
      nextSteps: [
        'Сначала вынесите повторяемые callbacks и shape данных.',
        'После этого делайте generic component или helper.',
        'Оставляйте domain wording в props, не прячьте всё за абстрактным `renderItem`.',
      ],
      watchouts: [
        'Если generic API требует десять callbacks, abstraction уже перегружена.',
        'Не заменяйте две ясные реализации одним “универсальным” компонентом без причины.',
      ],
    };
  }

  if (input.pain === 'polymorphic-primitive') {
    return {
      title: 'Polymorphic primitives вводите только в shared layer',
      tone: 'warn',
      summary:
        'Typed `as`-pattern полезен там, где один primitive реально переносит стиль между разной семантикой.',
      nextSteps: [
        'Ограничьте набор поддерживаемых semantics.',
        'Проверьте link/button/form cases отдельно.',
        'Сохраните доступность и role semantics как часть контракта.',
      ],
      watchouts: [
        'Не делайте `as?: ElementType` для любого частного компонента.',
        'Не жертвуйте ясностью API ради одной абстракции на весь проект.',
      ],
    };
  }

  if (input.pain === 'design-system' || input.ownsDesignSystem) {
    return {
      title: 'Соберите token maps и recipe unions вокруг shared primitives',
      tone: 'success',
      summary:
        'Design-system typing окупается, когда команда владеет shared primitives и должна синхронно держать variants, tokens и contracts.',
      nextSteps: [
        'Вынесите tone/size/emphasis в явные union types.',
        'Держите token maps рядом с typed recipes.',
        'Покройте shared primitives компонентными тестами на ключевые режимы.',
      ],
      watchouts: [
        'Не начинайте с тотального типизирования всех class names проекта.',
        'Не вводите utility types, если у вас ещё нет стабильного слоя primitives.',
      ],
    };
  }

  return {
    title: 'Держите runtime boundaries и advanced typing рядом',
    tone: input.scope === 'system-wide' && input.team === 'starting' ? 'error' : 'warn',
    summary:
      'На смешанных границах типы полезны только вместе с проверкой данных, reducer contracts и внятным разделением server/client responsibility.',
    nextSteps: [
      'Типизируйте входные и выходные contracts на boundary.',
      'Не полагайтесь только на compile-time там, где есть внешние данные.',
      'Раскатывайте advanced typing по feature slices, а не одним большим refactor.',
    ],
    watchouts: [
      'System-wide rollout без промежуточных границ быстро превращается в шумный rewrite.',
      'Type safety не заменяет runtime validation для внешних данных.',
    ],
  };
}
