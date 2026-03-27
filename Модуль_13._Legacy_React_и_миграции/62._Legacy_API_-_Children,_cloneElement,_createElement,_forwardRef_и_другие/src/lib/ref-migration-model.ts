import type { StatusTone } from './learning-model';

export type RefMigrationChoice = 'dom' | 'forward-ref' | 'ref-as-prop' | 'avoid-ref';

export function describeRefMigration(choice: RefMigrationChoice): {
  title: string;
  tone: StatusTone;
  note: string;
} {
  switch (choice) {
    case 'dom':
      return {
        title: 'DOM ref напрямую',
        tone: 'success',
        note: 'Если ref нужен только на реальном DOM узле, это самый прямой и понятный путь.',
      };
    case 'forward-ref':
      return {
        title: 'forwardRef как compatibility layer',
        tone: 'warn',
        note: 'Полезен для старых wrappers и экосистемы до React 19, но добавляет дополнительный слой.',
      };
    case 'ref-as-prop':
      return {
        title: 'React 19 ref-as-prop',
        tone: 'success',
        note: 'Упрощает migration и убирает часть wrapper noise, если компонент просто прокидывает ref дальше.',
      };
    case 'avoid-ref':
      return {
        title: 'Ref здесь не нужен',
        tone: 'error',
        note: 'Если задача решается через props или state, ref только добавит скрытый imperative канал.',
      };
    default:
      return {
        title: 'Нужен контекст использования',
        tone: 'warn',
        note: 'Сначала определите, действительно ли нужен imperative access.',
      };
  }
}

export const refMigrationTakeaways = [
  'createRef остаётся частью class-based кода и миграционных слоёв.',
  'forwardRef всё ещё нужно уметь читать, потому что старый код и библиотеки используют его повсеместно.',
  'ref-as-prop в React 19 убирает часть ceremony, но не меняет саму природу ref как escape hatch.',
  'Рефы не должны становиться скрытым бизнес-state или каналом данных между компонентами.',
] as const;
