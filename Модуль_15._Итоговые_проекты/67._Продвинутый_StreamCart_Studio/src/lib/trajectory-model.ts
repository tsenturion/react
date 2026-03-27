export type JourneyStage = {
  id: 'spa' | 'ssr' | 'mixed';
  label: string;
  headline: string;
  summary: string;
  strengths: readonly string[];
  limit: string;
};

export type RouteBlueprint = {
  id: string;
  route: string;
  userGoal: string;
  bestFit: string;
  whyNotSpaOnly: string;
  whyNotServerEverywhere: string;
};

export type ArchitectureOption = {
  id: 'spa-only' | 'ssr-everywhere' | 'mixed-fullstack';
  label: string;
  bundleKb: number;
  htmlReadiness: number;
  mutationSimplicity: number;
  opsRisk: number;
  note: string;
};

export const journeyStages: readonly JourneyStage[] = [
  {
    id: 'spa',
    label: 'Этап 1',
    headline: 'Рабочий SPA для каталога и кабинета',
    summary:
      'Команда начинает с честного SPA: клиентский роутер, запросы после гидратации, общий пакет JavaScript и быстрые продуктовые итерации.',
    strengths: [
      'Самая простая модель мышления для каталога, фильтров и личного кабинета.',
      'Единый клиентский сценарий для поиска, корзины и защищённых экранов.',
      'Хорошо подходит для внутренних экранов и частых повторных посещений, где SEO не критично.',
    ],
    limit:
      'Посадочные страницы и карточки товара страдают от каскада запросов и слабого HTML в первом ответе, а правила оформления заказа расползаются между браузером и API.',
  },
  {
    id: 'ssr',
    label: 'Этап 2',
    headline: 'SSR и streaming на входных коммерческих экранах',
    summary:
      'Следующий шаг: отдавать полезный HTML для главной, каталога и карточки товара, но не тащить серверный рендер на весь продукт без разбора.',
    strengths: [
      'SEO-страницы получают контент до загрузки клиента.',
      'Потоковая отдача позволяет показать первый экран и цену раньше рекомендаций и блока «покупают вместе».',
      'Hydration остаётся там, где нужна живая интерактивность.',
    ],
    limit:
      'Если этим ограничиться, сервер всё ещё слишком много знает о клиентских поддеревьях, а часть давления от большого клиентского пакета остаётся прежней.',
  },
  {
    id: 'mixed',
    label: 'Этап 3',
    headline: 'Mixed full-stack React архитектура',
    summary:
      'Финальная форма проекта: витрина с приоритетом сервера, клиентские острова только там, где нужен браузер, и серверные действия для оформления заказа.',
    strengths: [
      'Подход с серверными компонентами уменьшает клиентский пакет на экранах, где преобладает чтение данных.',
      'Серверные действия упрощают формы, потому что правила и запись данных живут ближе к источнику данных.',
      'Код, дружественный компилятору React, и переходы помогают оптимизировать живые клиентские острова без ручной мемоизации повсюду.',
    ],
    limit:
      'Требует дисциплины в проектировании границ: нельзя бездумно переносить всё на сервер или, наоборот, оставлять всё клиенту.',
  },
] as const;

export const routeBlueprints: readonly RouteBlueprint[] = [
  {
    id: 'landing',
    route: '/collections/fall-drop',
    userGoal: 'Быстро увидеть первый экран, подборки и SEO-контент при заходе из поиска.',
    bestFit:
      'SSR-оболочка + потоковая отдача промо-блоков + клиентский остров только для живого поиска.',
    whyNotSpaOnly:
      'Поисковый трафик получает слишком пустой HTML и ждёт загрузки клиента ради первого полезного контента.',
    whyNotServerEverywhere:
      'Персональная строка поиска и закреплённая корзина не требуют полного серверного поддерева.',
  },
  {
    id: 'pdp',
    route: '/products/aurora-shell-jacket',
    userGoal:
      'Увидеть цену, наличие и контент товара до гидратации, но сохранить быстрый выбор варианта.',
    bestFit:
      'Серверные компоненты для карточки товара с преобладанием чтения + клиентский остров для выбора варианта и мини-корзины.',
    whyNotSpaOnly:
      'Появляется характерный каскад запросов: товар -> остатки -> рекомендации уже после загрузки JavaScript.',
    whyNotServerEverywhere:
      'Выбор варианта, счётчик количества и мини-корзина лучше остаются живыми браузерными островами.',
  },
  {
    id: 'checkout',
    route: '/checkout/shipping',
    userGoal:
      'Безопасно отправить адрес, промокод и подтверждение заказа с понятными состояниями ожидания и ошибки.',
    bestFit:
      'SSR-оболочка + серверные действия для шагов отправки формы + клиентское состояние только для локального ввода.',
    whyNotSpaOnly:
      'Правила промокодов и наличие расходятся между состоянием формы, клиентской валидацией и обработчиками API.',
    whyNotServerEverywhere:
      'Поля формы, маски, управление фокусом и валидация при вводе всё ещё должны жить в клиентском острове.',
  },
  {
    id: 'ops',
    route: '/ops/fulfillment',
    userGoal:
      'Работать во внутренней авторизованной системе без SEO и с высокой частотой переходов.',
    bestFit:
      'Остаётся SPA, потому что это инструмент для повторного использования с длинной клиентской сессией.',
    whyNotSpaOnly: 'Здесь как раз SPA-only полностью оправдан.',
    whyNotServerEverywhere:
      'SSR и серверные компоненты не окупаются на внутреннем инструменте, где ценность мгновенной HTML-отдачи низкая.',
  },
] as const;

export const architectureOptions: readonly ArchitectureOption[] = [
  {
    id: 'spa-only',
    label: 'Чистый SPA',
    bundleKb: 272,
    htmlReadiness: 32,
    mutationSimplicity: 48,
    opsRisk: 34,
    note: 'Простой старт, но тяжёлый первый экран и раздвоение правил между клиентом и API.',
  },
  {
    id: 'ssr-everywhere',
    label: 'SSR везде',
    bundleKb: 228,
    htmlReadiness: 88,
    mutationSimplicity: 59,
    opsRisk: 73,
    note: 'Хороший HTML везде, но сервер тянет слишком много обязанностей, а операционная стоимость резко растёт.',
  },
  {
    id: 'mixed-fullstack',
    label: 'Смешанный full-stack React',
    bundleKb: 164,
    htmlReadiness: 91,
    mutationSimplicity: 86,
    opsRisk: 56,
    note: 'Выигрывает по общему балансу: полезный HTML там, где он нужен, меньше JavaScript на экранах чтения и более простой путь мутаций.',
  },
] as const;

export function selectWinningArchitecture() {
  return architectureOptions.reduce((winner, option) => {
    const score =
      option.htmlReadiness * 0.35 +
      option.mutationSimplicity * 0.3 +
      (300 - option.bundleKb) * 0.2 +
      (100 - option.opsRisk) * 0.15;
    const winnerScore =
      winner.htmlReadiness * 0.35 +
      winner.mutationSimplicity * 0.3 +
      (300 - winner.bundleKb) * 0.2 +
      (100 - winner.opsRisk) * 0.15;

    return score > winnerScore ? option : winner;
  });
}
