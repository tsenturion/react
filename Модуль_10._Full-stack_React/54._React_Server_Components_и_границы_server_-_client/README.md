# React Server Components и границы server/client

Интерактивный учебный проект для темы `Модуль 10 / Урок 54. React Server Components и границы server/client`.

## Что покрывает тема

- что реально исполняется на сервере, а что в браузере;
- `React Server Components` как архитектурная модель mixed приложения;
- `server/client boundaries` и их влияние на bundle, hydration и доступность данных;
- async server components;
- композицию server и client слоёв;
- отличие `server default`, `client island`, `slot composition` и `client-heavy subtree`;
- как выбор границы меняет структуру кода и способ мышления о приложении.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: execution layers, async server components, mixed composition и bundle trade-offs.
2. `Execution map`
   Позволяет перекладывать узлы между server и client и видеть цену этого решения.
3. `Async server`
   Сравнивает async server component, split boundary и client fetch после hydration.
4. `Composition`
   Показывает правила импорта и slot-композиции между server и client слоями.
5. `Trade-offs`
   Сравнивает готовые архитектурные пресеты: `server-first`, `balanced islands`, `client-heavy`.
6. `Playbook`
   Помогает выбрать boundary strategy по свойствам реального экрана.

## Как тема выражена в коде проекта

Урок не только рассказывает о `React Server Components`, но и выражает тему через структуру текущего проекта:

- `src/components/rsc-labs/ExecutionBoundaryLab.tsx`
  Интерактивная карта server/client placement.
- `src/components/rsc-labs/AsyncServerComponentsLab.tsx`
  Сравнение async server и client-fetch сценариев.
- `src/components/rsc-labs/CompositionBoundaryLab.tsx`
  Проверка import/slot-композиции между слоями.
- `src/components/rsc-labs/BundleTradeoffLab.tsx`
  Сравнение архитектурных пресетов по bundle и hydration pressure.
- `src/components/rsc-labs/RscPlaybookLab.tsx`
  Playbook выбора boundary strategy.
- `src/lib/rsc-boundary-model.ts`
  Предметная модель слоёв, узлов и presets mixed дерева.
- `src/lib/rsc-composition-model.ts`
  Правила допустимой и недопустимой mixed composition.
- `src/lib/async-server-model.ts`
  Модель таймингов async server components.
- `src/server/rsc-runtime.ts`
  Flight-like runtime report для учебной серверной модели.

## Важная оговорка про тему

Полноценные `React Server Components` в production собираются framework/runtime-уровнем.
Внутри этого урока используется честная учебная модель:

- server/client boundary анализируется как архитектурная система;
- mixed tree выражен в моделях и sandboxes проекта;
- `src/server/rsc-runtime.ts` показывает `flight-like` отчёт, чтобы тема была видна и в server-side коде проекта;
- при этом урок не притворяется полноценным framework-рантаймом для RSC transport.

Это ограничение показано осознанно, чтобы фокус оставался на реальной архитектуре границ, а не на магии конкретного фреймворка.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- Vitest `2.1.9`
- Testing Library
- ESLint `9`
- Prettier `3`
- Docker + Nginx

## Команды

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```
