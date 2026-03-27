# Мемоизация и оптимизация рендера

Интерактивный учебный проект для темы `Модуль 8 / 45. Мемоизация и оптимизация рендера`.

## Что покрывает тема

- `memo`, `useMemo` и `useCallback` как одна система оптимизации;
- связь между стабильностью ссылок, сравнением `props` и шириной поддерева;
- случаи, где мемоизация действительно уменьшает лишние рендеры;
- анти-паттерны: unstable object props, useless callback memoization, premature optimization;
- оптимизация списков через memoized rows, stable handlers и memoized visible slice;
- стоимость мемоизации и момент, когда она только усложняет код без реального выигрыша.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и кодовые фрагменты текущей реализации.

Внутри приложения 6 лабораторий:

1. `Memoization overview`
   Даёт карту темы и отделяет полезную мемоизацию от автоматического добавления hooks.
2. `memo and props`
   Показывает, как `memo` зависит от стабильности `props` и почему новый object reference пробивает границу.
3. `useMemo`
   Сравнивает direct derive и memoized derive на одном и том же наборе данных.
4. `useCallback`
   Показывает, как стабильность обработчиков влияет на `memo`-rows и дочерние поддеревья.
5. `List optimization`
   Сопоставляет naive list и optimized list на одинаковых действиях пользователя.
6. `Cost and trade-offs`
   Помогает решить, когда мемоизация оправдана, а когда сначала нужно измерять bottleneck.

## Как тема выражена в коде проекта

Урок не просто рассказывает о мемоизации, а использует её в самом проекте как предмет изучения:

- `src/components/memoization/MemoBoundariesLab.tsx`
  Сравнивает plain child и `memo`-child, чтобы показать роль stable props.
- `src/components/memoization/UseMemoDerivedLab.tsx`
  Показывает, где `useMemo` удерживает derived data стабильной для downstream subtree.
- `src/components/memoization/UseCallbackLab.tsx`
  Показывает, как один unstable callback reference размножает ререндеры по списку.
- `src/components/memoization/ListOptimizationLab.tsx`
  Собирает memoized rows, stable callbacks и memoized visible slice в реальный list scenario.
- `src/components/memoization/MemoCostAdvisorLab.tsx`
  Переводит тему в decision model, где учитываются lag, breadth и цена dependencies.
- `src/lib/memo-boundary-model.ts`
  Формализует разницу между полезным ререндером и avoidable rerender.
- `src/lib/use-memo-model.ts`
  Содержит pure projection каталога и сценарии, где `useMemo` действительно меняет поведение дерева.
- `src/lib/use-callback-model.ts`
  Показывает ширину повторных рендеров при stable и unstable handlers.
- `src/lib/list-optimization-model.ts`
  Содержит модель затронутых rows для разных list actions.
- `src/lib/memo-cost-model.ts`
  Формализует цену и полезность мемоизации вместо лозунга “везде добавьте hook”.

## Важная оговорка про dev-режим

Проект запускается через `StrictMode`, поэтому в development initial mount может выглядеть
шумнее, чем production. В лабораториях важно смотреть не на первую абсолютную цифру,
а на то, какой именно subtree повторно рендерится после действия и почему.

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
