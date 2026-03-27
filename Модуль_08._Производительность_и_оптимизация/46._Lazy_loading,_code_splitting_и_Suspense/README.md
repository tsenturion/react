# Lazy loading, code splitting и Suspense

Интерактивный учебный проект для темы `Модуль 8 / 46. Lazy loading, code splitting и Suspense`.

## Что покрывает тема

- `React.lazy` и компонентный code splitting;
- route-level splitting и устойчивый shell приложения;
- `Suspense` как граница fallback, а не просто loading-плашка;
- progressive loading UX: spinner, skeleton, shell-first;
- постепенная загрузка тяжёлых частей приложения;
- trade-offs code splitting: когда он уменьшает стартовую цену, а когда превращается в сетевую дробность.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- shell урока сам использует lazy pages и `Suspense` вокруг `Outlet`, поэтому тема выражена и в устройстве текущего приложения.

Внутри приложения 6 лабораторий:

1. `Lazy loading overview`
   Даёт карту темы и показывает, как выбирать split points.
2. `Component splitting`
   Сравнивает eager import и `React.lazy` на тяжёлых panel.
3. `Route splitting`
   Показывает, как route tree становится естественной границей для code splitting.
4. `Suspense boundaries`
   Сравнивает local и global fallback на одном и том же heavy widget.
5. `Progressive loading`
   Показывает различие между spinner, skeleton и shell-first loading UX.
6. `Split strategy`
   Помогает оценивать, когда split оправдан, а когда лучше оставить код рядом.

## Как тема выражена в коде проекта

Урок не просто говорит о lazy loading, а сам реализует его несколькими слоями:

- `src/router.tsx`
  Использует `React.lazy` для страниц урока и `Suspense` вокруг `Outlet`.
- `src/components/lazy-loading/ComponentLazyLab.tsx`
  Показывает component-level splitting с локальным fallback.
- `src/components/lazy-loading/RouteCodeSplitLab.tsx`
  Связывает реальный router проекта и архитектурные split-стратегии.
- `src/components/lazy-loading/SuspenseBoundariesLab.tsx`
  Показывает цену слишком высокой boundary на одном workspace.
- `src/components/lazy-loading/ProgressiveLoadingLab.tsx`
  Сравнивает loading UX через реальные отдельные chunks.
- `src/components/lazy-loading/SplitStrategyAdvisorLab.tsx`
  Переводит тему в decision model, где учитываются вес кода, частота использования и fallback scope.
- `src/lib/lazy-runtime.ts`
  Даёт controlled delay для учебной наблюдаемости split points.
- `src/lib/route-split-model.ts`
  Формализует различия между eager router, lazy pages и over-split стратегией.
- `src/lib/split-strategy-model.ts`
  Помогает оценивать архитектурную пользу и цену split-решения.

## Важная оговорка про dev-режим

В проекте есть controlled delay для lazy imports. Он нужен не для имитации “настоящей сети”,
а для того, чтобы split point и fallback были заметны в учебной среде. В production
такие искусственные задержки не нужны.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- `@vitejs/plugin-react` `5.0.2`
- Tailwind CSS `4.2.1`
- `@tailwindcss/vite` `4.2.1`
- Vitest `2.1.9`
- `@testing-library/react` `16.3.2`
- `@testing-library/jest-dom` `6.9.1`
- `@testing-library/user-event` `14.6.1`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run lint
npm run format:check
npm test
npm run build
```

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
