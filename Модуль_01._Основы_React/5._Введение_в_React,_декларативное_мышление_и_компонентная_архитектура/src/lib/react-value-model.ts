import type { StatusTone } from './common';

export type SurfaceMode = 'static' | 'interactive' | 'scaling';
export type ReuseLevel = 'single' | 'shared' | 'system';

export const surfaceModes = [
  {
    id: 'static',
    label: 'Статичный экран',
    description: 'Небольшой экран без частых изменений и без сложной композиции.',
  },
  {
    id: 'interactive',
    label: 'Живой экран',
    description: 'Есть фильтры, summary, состояние интерфейса и повторяемые блоки.',
  },
  {
    id: 'scaling',
    label: 'Растущий продукт',
    description: 'Экран меняется, переиспользуется и требует устойчивого дерева UI.',
  },
] as const satisfies readonly {
  id: SurfaceMode;
  label: string;
  description: string;
}[];

export const reuseLevels = [
  {
    id: 'single',
    label: 'Один экран',
    description: 'UI почти не переиспользуется между разделами.',
  },
  {
    id: 'shared',
    label: 'Повторяемые паттерны',
    description: 'Похожие блоки начинают встречаться на нескольких экранах.',
  },
  {
    id: 'system',
    label: 'Целая система',
    description: 'Из одних и тех же блоков собираются разные экраны и сценарии.',
  },
] as const satisfies readonly {
  id: ReuseLevel;
  label: string;
  description: string;
}[];

const toPressureLabel = (score: number) =>
  score >= 3 ? 'Высокое' : score === 2 ? 'Среднее' : 'Низкое';

export function evaluateReactValue(
  surfaceMode: SurfaceMode,
  reuseLevel: ReuseLevel,
  hasSharedState: boolean,
) {
  const surfaceScore = { static: 1, interactive: 2, scaling: 3 }[surfaceMode];
  const reuseScore = { single: 1, shared: 2, system: 3 }[reuseLevel];
  const stateScore = hasSharedState ? 3 : 1;
  const combinedScore = surfaceScore + reuseScore + stateScore;

  const tone: StatusTone = combinedScore >= 7 ? 'success' : 'warn';
  const recommendation =
    combinedScore >= 7
      ? 'React здесь уже не просто удобен: он помогает удерживать UI как систему из компонентов, данных и состояния.'
      : 'Экран ещё можно собрать и без React, но как только появятся повторяемые блоки и shared state, цена ручного DOM быстро вырастет.';

  return {
    tone,
    recommendation,
    reactDefinition:
      'React здесь рассматривается как библиотека, которая помогает описывать интерфейс через дерево компонентов и обновлять его из данных и состояния.',
    manualDomPressure: toPressureLabel(surfaceScore + (hasSharedState ? 1 : 0)),
    reusePressure: toPressureLabel(reuseScore),
    statePressure: toPressureLabel(stateScore),
    previewMode:
      surfaceMode === 'static'
        ? 'strip'
        : surfaceMode === 'interactive'
          ? 'summary'
          : 'full',
    benefits: [
      ...(surfaceMode !== 'static'
        ? [
            'Один и тот же экран можно описывать как функцию от текущих данных, а не как длинную последовательность DOM-команд.',
          ]
        : [
            'Даже у небольшого экрана появляется читаемая структура, если вы делите его на header, list, card и summary.',
          ]),
      ...(reuseLevel !== 'single'
        ? [
            'Компоненты позволяют переиспользовать границы UI без копирования разметки и логики.',
          ]
        : ['Даже в одном экране компоненты помогают отделить части по ответственности.']),
      ...(hasSharedState
        ? [
            'Когда фильтры, summary и список зависят от одного состояния, React помогает держать их синхронными.',
          ]
        : [
            'Если shared state ещё нет, React всё равно задаёт дисциплину дерева компонентов и данных.',
          ]),
    ],
    caveats: [
      'React не отменяет знание HTML, DOM и JavaScript: он строится поверх этих основ.',
      'Для совсем простого и статичного экрана React не обязателен сам по себе.',
      'Главная польза React проявляется там, где есть повторение, композиция и изменение UI во времени.',
    ],
    before:
      'Императивный подход заставляет отдельно помнить, какие DOM-узлы скрыть, какие пересчитать и где синхронизировать summary.',
    after:
      'Декларативный подход формулирует источник истины: данные, состояние фильтров и дерево компонентов. Всё остальное становится следствием.',
  };
}
