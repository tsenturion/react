export type OverviewFocus =
  | 'all'
  | 'framework'
  | 'routes'
  | 'data'
  | 'rendering'
  | 'direction';

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
    id: 'framework-first-surface',
    focus: 'framework',
    title:
      'Framework-first React даёт готовую поверхность для routing, data и server rendering',
    blurb:
      'Современный full-stack React всё чаще собирается не из набора отдельных библиотек, а вокруг framework, который уже определяет маршруты, серверный рендеринг и жизненный цикл данных.',
    whyItMatters:
      'Это сокращает количество ручной инфраструктуры и делает архитектуру экрана более предсказуемой: экран, данные, серверная логика и rendering strategy проектируются вместе.',
    typicalFailure:
      'Команда продолжает собирать full-stack React как вручную склеенный SPA, хотя требования уже давно вышли на уровень framework-задач.',
  },
  {
    id: 'route-modules-own-screens',
    focus: 'routes',
    title: 'Экран становится route module, а не только набором компонентов',
    blurb:
      'Framework держит вместе layout, data loading, ошибки, мутации и код экрана. Это меняет структуру дерева проекта и распределение ответственности.',
    whyItMatters:
      'Вместо хаотичного разрастания “components + hooks + api + utils” появляется явный экранный модуль, который собирает всё, что нужно маршруту.',
    typicalFailure:
      'Экран по-прежнему собирают как чисто клиентский компонент, а маршрутизация и серверные данные живут где-то сбоку и теряют связность.',
  },
  {
    id: 'framework-data-flow',
    focus: 'data',
    title: 'Framework берёт на себя data loading и server mutations как часть маршрута',
    blurb:
      'Next.js и React Router framework mode дают встроенные места, где данные грузятся и меняются рядом с маршрутом, а не через самодельный слой вокруг каждого экрана.',
    whyItMatters:
      'Так меньше ручного glue-кода, проще revalidation, проще error boundaries и понятнее путь от URL до данных.',
    typicalFailure:
      'Даже внутри framework команды продолжают делать всё через произвольные `fetch`-эффекты в клиентах, теряя главную пользу framework-first подхода.',
  },
  {
    id: 'rendering-belongs-to-framework',
    focus: 'rendering',
    title:
      'CSR, SSR, streaming и partial prerendering становятся частью framework pipeline',
    blurb:
      'Rendering mode больше не живёт отдельно от маршрутов и данных. Framework определяет, что можно отдать статически, что стримить и где включать dynamic work.',
    whyItMatters:
      'Это влияет не только на скорость, но и на структуру проекта: какие файлы серверные, где layout static, а где сегмент обязан стать request-time.',
    typicalFailure:
      'Режимы рендеринга обсуждают как абстрактную теорию, но не связывают с route modules, layouts и серверными границами конкретного framework.',
  },
  {
    id: 'platform-direction',
    focus: 'direction',
    title:
      'Partial prerendering и resume/prerender family APIs задают направление развития платформы',
    blurb:
      'Даже если конкретные API ещё развиваются, направление уже видно: всё больше внимания к постепенной загрузке, сегментам страницы и управляемой интерактивности.',
    whyItMatters:
      'Важно различать, что уже production-ready в текущем framework, а что пока относится к направлению развития платформы и требует более осторожного мышления.',
    typicalFailure:
      'Команда либо игнорирует направление платформы полностью, либо строит архитектуру целиком на ещё нестабильных возможностях.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'framework' ||
    value === 'routes' ||
    value === 'data' ||
    value === 'rendering' ||
    value === 'direction'
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
