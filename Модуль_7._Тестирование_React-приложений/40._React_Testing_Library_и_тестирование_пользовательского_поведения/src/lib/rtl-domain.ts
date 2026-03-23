import type { LabId } from './learning-model';

export type GuideFocus = 'queries' | 'interactions' | 'forms' | 'providers' | 'strategy';
export type OverviewFocus = 'all' | GuideFocus;
export type QueryTargetId =
  | 'save-button'
  | 'email-field'
  | 'error-alert'
  | 'success-status'
  | 'helper-copy';

export type RtlGuide = {
  id: string;
  title: string;
  focus: GuideFocus;
  summary: string;
  bestFor: string;
  avoidWhen: string;
  pitfalls: readonly string[];
};

export type QueryTarget = {
  id: QueryTargetId;
  label: string;
  semanticSurface: string;
  recommendedQuery: string;
  why: string;
  avoid: string;
};

export type SmellCard = {
  id: string;
  title: string;
  signal: string;
  whyRisky: string;
  better: string;
};

export const rtlGuides: readonly RtlGuide[] = [
  {
    id: 'query-priority',
    title: 'Queries should follow the accessible surface',
    focus: 'queries',
    summary:
      'Ищите элемент так, как его находит человек и assistive tech: по роли, имени и лейблу.',
    bestFor:
      'Кнопки, поля ввода, `alert`, `status`, headings и доступные landmark-элементы.',
    avoidWhen:
      'Если вы выбираете query только потому, что так проще дотянуться до DOM-узла.',
    pitfalls: [
      'Не начинайте с `container.querySelector`, если у элемента есть роль или лейбл.',
      'Не превращайте `data-testid` в основной способ поиска обычных UI-элементов.',
    ],
  },
  {
    id: 'user-events',
    title: 'Drive the UI through user actions',
    focus: 'interactions',
    summary:
      'Тест должен нажимать, вводить, табаться и ждать видимый результат, а не вызывать внутренние обработчики напрямую.',
    bestFor:
      'Раскрывающиеся панели, multi-step flows, активацию CTA и асинхронные баннеры результата.',
    avoidWhen:
      'Если проверка сводится к чтению внутреннего state без реального поведения на экране.',
    pitfalls: [
      'Не вызывайте `setState` или component methods вручную.',
      'Не проверяйте шаги реализации вместо того, что реально увидит пользователь.',
    ],
  },
  {
    id: 'forms-and-errors',
    title: 'Forms should be tested as real input flows',
    focus: 'forms',
    summary:
      'В форме важны поля, ошибки, submit и success-state, а не то, сколько раз вызывался validator.',
    bestFor:
      'Validation, disabled state, field errors, error summaries и success banners.',
    avoidWhen:
      'Если тест проверяет только вызов функции и не подтверждает пользовательский результат.',
    pitfalls: [
      'Не ограничивайтесь `toHaveBeenCalled`, если пользователь ничего не видит.',
      'Не прячьте ошибки в недоступный текст без `alert` или связанного описания поля.',
    ],
  },
  {
    id: 'custom-render-helper',
    title: 'Custom render helpers hide provider noise',
    focus: 'providers',
    summary:
      'Когда компоненту нужен router, context или theme, helper делает тест короче и не ломает user-centric assertions.',
    bestFor:
      'Компоненты, которые постоянно требуют одни и те же обёртки и initial route.',
    avoidWhen:
      'Если helper начинает тащить в каждый тест лишние зависимости и скрывает важный setup.',
    pitfalls: [
      'Не складывайте в helper вообще весь runtime приложения без причины.',
      'Не делайте helper настолько магическим, что из теста уже не видно, в каком окружении рендерится компонент.',
    ],
  },
  {
    id: 'behavior-over-implementation',
    title: 'Behavior matters more than implementation details',
    focus: 'strategy',
    summary:
      'Хороший RTL-тест проверяет текст, роли, доступные имена и observable transitions, а не private state.',
    bestFor:
      'Компоненты, где важно сохранить устойчивость при рефакторинге внутренней реализации.',
    avoidWhen:
      'Если вы сознательно привязываетесь к внутреннему устройству вместо пользовательского сценария.',
    pitfalls: [
      'Не проверяйте className, если важнее доступность или видимый текст.',
      'Не стройте test strategy вокруг количества `setState` или props re-renders.',
    ],
  },
] as const;

export const queryTargets: readonly QueryTarget[] = [
  {
    id: 'save-button',
    label: 'Кнопка сохранения',
    semanticSurface: 'button',
    recommendedQuery: "getByRole('button', { name: 'Сохранить фильтр' })",
    why: 'Кнопка уже выражена ролью и доступным именем, поэтому role query отражает реальное взаимодействие.',
    avoid: 'Не ищите такую кнопку по className или по порядковому номеру в DOM.',
  },
  {
    id: 'email-field',
    label: 'Поле email',
    semanticSurface: 'label + input',
    recommendedQuery: "getByLabelText('Email для отчёта')",
    why: 'Для form control связанный label даёт понятный и устойчивый surface для теста.',
    avoid: 'Не полагайтесь только на placeholder, если у поля уже есть нормальный label.',
  },
  {
    id: 'error-alert',
    label: 'Ошибка формы',
    semanticSurface: 'role="alert"',
    recommendedQuery: "findByRole('alert')",
    why: 'Ошибка появляется после действия и должна читаться как доступный alert, поэтому здесь нужен async role query.',
    avoid:
      'Не ищите ошибку по случайному куску текста, если она уже оформлена как alert.',
  },
  {
    id: 'success-status',
    label: 'Баннер успеха',
    semanticSurface: 'role="status"',
    recommendedQuery: "findByRole('status')",
    why: 'Статус появляется после успешного действия и должен проверяться как observable feedback.',
    avoid:
      'Не проверяйте только внутренний флаг `saved`, если пользователь видит именно status banner.',
  },
  {
    id: 'helper-copy',
    label: 'Вспомогательный текст',
    semanticSurface: 'plain text',
    recommendedQuery: "getByText('Черновик сохранится только после подтверждения')",
    why: 'Когда у текста нет самостоятельной роли, обычный текстовый query остаётся нормальной пользовательской проверкой.',
    avoid: "Не тянитесь к `querySelector('p')`, если вы проверяете именно видимую копию.",
  },
] as const;

export const smellCards: readonly SmellCard[] = [
  {
    id: 'internal-state',
    title: 'Чтение внутреннего state',
    signal: 'Тест смотрит не на DOM, а на частный state или вызов setter.',
    whyRisky:
      'Такой тест быстро ломается при рефакторинге и ничего не говорит о пользовательском результате.',
    better:
      'Проверяйте текст, disabled state, роли, баннеры и другие observable outcomes.',
  },
  {
    id: 'classname-hook',
    title: 'Селектор через className',
    signal: 'Тест зависит от CSS-класса, хотя элемент имеет роль или доступное имя.',
    whyRisky:
      'Оформление меняется чаще пользовательского поведения, поэтому тест становится шумным и хрупким.',
    better: 'Предпочитайте role, label text, status, alert и обычный видимый текст.',
  },
  {
    id: 'manual-callback',
    title: 'Прямой вызов handler вместо userEvent',
    signal: 'В тесте вызывается callback напрямую, минуя реальное действие пользователя.',
    whyRisky:
      'Так теряется сама цепочка поведения: фокус, ввод, submit и видимый результат.',
    better: 'Используйте `userEvent.click`, `type`, `tab` и ждите observable DOM change.',
  },
  {
    id: 'giant-helper',
    title: 'Слишком магический custom render',
    signal: 'Helper рендерит пол-приложения даже там, где нужен только один provider.',
    whyRisky:
      'Тесты становятся менее понятными, а setup скрывает важные условия сценария.',
    better:
      'Выносите в helper только повторяемую инфраструктуру, не скрывая сам смысл тестового окружения.',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/rtl-overview')) {
    return 'overview';
  }

  if (pathname.startsWith('/query-priority')) {
    return 'queries';
  }

  if (pathname.startsWith('/user-interactions')) {
    return 'interactions';
  }

  if (pathname.startsWith('/forms-and-errors')) {
    return 'forms';
  }

  if (pathname.startsWith('/custom-render')) {
    return 'custom-render';
  }

  if (pathname.startsWith('/anti-patterns')) {
    return 'anti-patterns';
  }

  return null;
}

export function filterGuidesByFocus(focus: OverviewFocus) {
  return focus === 'all'
    ? [...rtlGuides]
    : rtlGuides.filter((item) => item.focus === focus);
}
