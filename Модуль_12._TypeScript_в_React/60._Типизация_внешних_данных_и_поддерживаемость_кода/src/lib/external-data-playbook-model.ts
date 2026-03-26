import type { StatusTone } from './learning-model';

export type DataSource =
  | 'public-api'
  | 'internal-api'
  | 'form-data'
  | 'route-loader'
  | 'server-function';

export type FailureMode =
  | 'silent-shape-drift'
  | 'mixed-nullability'
  | 'partial-mutations'
  | 'date-fields';

export type TeamDiscipline = 'starting' | 'confident' | 'advanced';

export type Recommendation = {
  title: string;
  tone: StatusTone;
  summary: string;
  steps: readonly string[];
  warnings: readonly string[];
};

export function buildExternalDataRecommendation(input: {
  source: DataSource;
  failureMode: FailureMode;
  team: TeamDiscipline;
}): Recommendation {
  if (input.source === 'form-data') {
    return {
      title: 'Поставьте schema прямо на входе формы и на ответе мутации',
      tone: 'warn',
      summary:
        'Form payload кажется локальным, но фактически это внешний ввод пользователя и браузера.',
      steps: [
        'Опишите `z.object(...)` для входящего payload и не полагайтесь на строки из `FormData`.',
        'Отдельно валидируйте shape ответа после submit.',
        'Держите inferred type рядом со schema, а не отдельно от неё.',
      ],
      warnings: [
        'Не считайте `score: string` автоматически корректным числом без `coerce` или `preprocess`.',
      ],
    };
  }

  if (input.source === 'route-loader') {
    return {
      title: 'Parse выгоднее делать в loader boundary',
      tone: 'error',
      summary:
        'Loader boundary раньше остальных узнаёт о schema mismatch и не пускает сырой payload в UI-дерево.',
      steps: [
        'Парсите ответ сервера до возврата данных из loader.',
        'Передавайте вниз уже validated data.',
        'Связывайте route errors с проблемой контракта, а не с “непонятным падением страницы”.',
      ],
      warnings: [
        'Если parse живёт в leaf-компоненте, часть дерева уже могла начать опираться на неверные данные.',
      ],
    };
  }

  if (input.failureMode === 'silent-shape-drift') {
    return {
      title: 'Нужна shared schema рядом с data client',
      tone: 'error',
      summary:
        'Когда форма ответа часто дрейфует, ручные type assertions делают код молча ложно безопасным.',
      steps: [
        'Вынесите schema в отдельный модуль рядом с fetch helpers.',
        'Используйте `safeParse` или `parse` в единой boundary функции.',
        'Не размазывайте локальные `if`-проверки по компонентам.',
      ],
      warnings: [
        'Разные локальные guards почти всегда начинают расходиться при следующих изменениях API.',
      ],
    };
  }

  if (input.team === 'starting') {
    return {
      title: 'Начните с одного самого болезненного boundary',
      tone: 'warn',
      summary:
        'На старте полезнее стабилизировать один запрос или одну форму, чем сразу покрывать схемами всё подряд.',
      steps: [
        'Выберите экран, где уже были реальные баги из-за формы данных.',
        'Поставьте schema на вход и договоритесь, где именно живёт parse.',
        'Потом только расширяйте подход на соседние flow.',
      ],
      warnings: [
        'Массовое внедрение схем без явных boundary points превращается в новый шум.',
      ],
    };
  }

  return {
    title: 'Держите schema как общий full-stack contract',
    tone: 'success',
    summary:
      'Для зрелого кода schema полезна не только как guard, но и как единый язык между клиентом, сервером и роутером.',
    steps: [
      'Соберите shared schemas по доменным сущностям.',
      'Вынесите request, mutation и route parse в явные boundary helpers.',
      'Используйте inferred types только после успешного runtime parse.',
    ],
    warnings: [
      'Даже при зрелом коде schema не заменяет UX-ветки для network error, empty state и partial failure.',
    ],
  };
}
