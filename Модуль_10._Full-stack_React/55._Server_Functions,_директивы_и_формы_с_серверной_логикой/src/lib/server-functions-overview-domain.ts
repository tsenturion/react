export type OverviewFocus =
  | 'all'
  | 'directives'
  | 'flow'
  | 'forms'
  | 'limits'
  | 'mindset';

export type OverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'directives-define-boundary',
    focus: 'directives',
    title:
      '`use client` и `use server` определяют среду исполнения, а не просто синтаксис',
    blurb:
      'После пересечения границы меняются доступ к browser APIs, сериализация аргументов, способ вызова и цена интерактивности.',
    whyItMatters:
      'Если директивы расставляются только после ошибок сборки, архитектура быстро превращается в случайный набор исключений.',
    typicalFailure:
      'Весь экран переводят в client из-за одной формы, хотя server logic и data-heavy блоки могли остаться на сервере.',
  },
  {
    id: 'server-function-flow',
    focus: 'flow',
    title: 'Server Function убирает часть ручного API-слоя, но не отменяет границы',
    blurb:
      'Вместо вручную написанного route handler + fetch + локальной схемы валидации часть full-stack потока можно выразить прямым серверным вызовом.',
    whyItMatters:
      'Меньше дублирования между клиентом и сервером, короче путь от формы до серверной мутации и меньше связующего кода.',
    typicalFailure:
      'Server Function начинают воспринимать как универсальную замену любому API, включая live onChange и browser-driven циклы.',
  },
  {
    id: 'forms-are-boundaries',
    focus: 'forms',
    title: 'Форма становится естественной границей серверного действия',
    blurb:
      'Форма задаёт момент вызова, набор сериализуемых данных, pending UX и точку, где серверная логика возвращает результат обратно в UI.',
    whyItMatters:
      'Это хорошо ложится на submit-driven сценарии: сохранение, публикацию, назначение reviewer, отправку feedback.',
    typicalFailure:
      'Форму продолжают оборачивать в ручные `fetch`-эффекты и дублирующие локальные статусы, хотя граница submit уже существует сама по себе.',
  },
  {
    id: 'limits-still-real',
    focus: 'limits',
    title: 'Ограничения остаются: сериализация, browser APIs, live typing',
    blurb:
      'Server Function не может напрямую читать `window`, DOM, локальное состояние браузера и не подходит для мгновенного onChange-цикла.',
    whyItMatters:
      'Нужно заранее понимать, где заканчивается server logic и где начинается client island с local interaction.',
    typicalFailure:
      'Server Function пытаются использовать как обработчик каждого ввода символа или как место, где “как-нибудь” появится доступ к DOM.',
  },
  {
    id: 'mindset-shift',
    focus: 'mindset',
    title: 'Меняется модель full-stack React приложения',
    blurb:
      'Логика перестаёт раскладываться на “client вызывает API”, а собирается вокруг server boundaries, forms и точек, где данные действительно должны пересечь сеть.',
    whyItMatters:
      'Это упрощает submit-сценарии, но требует дисциплины: где форма, где server mutation, где optimistic client feedback и где ограничения runtime.',
    typicalFailure:
      'Пытаются мигрировать на server functions только точечно, не пересматривая форму потока данных и ответственность client/server слоёв.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'directives' ||
    value === 'flow' ||
    value === 'forms' ||
    value === 'limits' ||
    value === 'mindset'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
