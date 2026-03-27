import type { StatusTone } from './learning-model';

export type LegacyContextId =
  | 'error-boundary'
  | 'vendor-widget'
  | 'hoc-chain'
  | 'large-form'
  | 'migration-pass'
  | 'greenfield';

export const legacyContextOptions: readonly {
  id: LegacyContextId;
  label: string;
}[] = [
  { id: 'error-boundary', label: 'Error boundary' },
  { id: 'vendor-widget', label: 'Vendor widget' },
  { id: 'hoc-chain', label: 'HOC chain' },
  { id: 'large-form', label: 'Large form' },
  { id: 'migration-pass', label: 'Migration pass' },
  { id: 'greenfield', label: 'Greenfield' },
] as const;

export type LegacyRecommendation = {
  title: string;
  tone: StatusTone;
  why: string;
  steps: readonly string[];
};

export function recommendLegacyAction(context: LegacyContextId): LegacyRecommendation {
  switch (context) {
    case 'error-boundary':
      return {
        title: 'Оставьте boundary class-based и локализуйте границу падения',
        tone: 'success',
        why: 'Обычный React error boundary по-прежнему class-based, поэтому переписывать его “из принципа” не нужно.',
        steps: [
          'Сначала определите, где boundary должен отсекать сбой.',
          'Потом добавьте reset strategy через key или явную кнопку восстановления.',
          'Только затем сравнивайте, нужны ли отдельные hook-based child widgets внутри boundary.',
        ],
      };
    case 'vendor-widget':
      return {
        title: 'Сохраняйте class/ref bridge, пока жива imperative интеграция',
        tone: 'warn',
        why: 'Сторонние DOM-виджеты часто опираются на lifecycle и refs, а не на декларативную модель hooks.',
        steps: [
          'Изолируйте интеграцию в одном boundary-компоненте.',
          'Сделайте cleanup в componentWillUnmount очевидным.',
          'Вынесите бизнес-логику выше, чтобы legacy слой был тонким.',
        ],
      };
    case 'hoc-chain':
      return {
        title: 'Сначала распутайте HOC chain, потом переписывайте',
        tone: 'warn',
        why: 'Слепая миграция без понимания обёрток создаёт больше регрессий, чем пользы.',
        steps: [
          'Нарисуйте фактическое дерево обёрток и responsibilities.',
          'Отделите data, UI и side effects.',
          'После этого заменяйте части по одной, а не весь стек сразу.',
        ],
      };
    case 'large-form':
      return {
        title: 'Сначала стабилизируйте поведение формы, потом меняйте парадигму',
        tone: 'warn',
        why: 'В старых form-контейнерах setState queue, callback и refs часто связаны между собой.',
        steps: [
          'Зафиксируйте сценарии в tests.',
          'Уберите неявные мутации и дублирующийся state.',
          'Только потом переносите участки на hooks.',
        ],
      };
    case 'migration-pass':
      return {
        title: 'Мигрируйте по границам ответственности, а не по вкусу синтаксиса',
        tone: 'success',
        why: 'Наибольшую ценность даёт перенос плохо изолированных областей, а не переписывание уже стабильных классов ради единообразия.',
        steps: [
          'Начните с компонентов с большим количеством побочных эффектов и проп-drilling.',
          'Оставьте стабильные boundaries и PureComponent-узлы, пока они не мешают.',
          'Миграцию сопровождайте profiling и regression tests.',
        ],
      };
    case 'greenfield':
      return {
        title: 'В новом коде классы нужны только точечно',
        tone: 'error',
        why: 'Для обычного UI hooks и современный React mental model дают более предсказуемую основу.',
        steps: [
          'Не переносите class patterns в новый код без реальной причины.',
          'Если нужен boundary, держите class-only API как инфраструктурную оболочку.',
          'Остальную логику проектируйте уже в современной модели.',
        ],
      };
    default:
      return {
        title: 'Сначала поймите legacy responsibility',
        tone: 'warn',
        why: 'Даже старый код читается проще, когда видно, зачем он существует.',
        steps: [
          'Определите границу ответственности.',
          'Проверьте риски.',
          'Только потом меняйте реализацию.',
        ],
      };
  }
}

export const placesYouStillMeetClasses = [
  'Error boundaries в обычном React приложении.',
  'Старые enterprise dashboards и long-lived admin panels.',
  'HOC-heavy кодовые базы, которые выросли до hooks era.',
  'Интеграции с сторонними imperative DOM libraries.',
  'React Native код на старой архитектуре и медленно мигрирующие модули.',
] as const;
