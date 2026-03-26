# Framework-based React

Интерактивный учебный проект для темы `Модуль 10 / Урок 56. Framework-based React`.

## Что покрывает тема

- Next.js как основной full-stack React framework;
- React Router framework mode как альтернативный framework-oriented сценарий;
- route modules, layouts и ownership экрана;
- data loading, server mutations и server rendering в рамках framework surface;
- framework-first подход к структуре full-stack React приложения;
- partial prerendering, streaming и resume/prerender family APIs как направление развития платформы;
- различие между stable production story и emerging platform direction.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: framework surface, route ownership, data flow, rendering strategy и platform direction.
2. `Frameworks`
   Сравнивает Next.js, React Router framework mode и DIY SPA по встроенным full-stack возможностям.
3. `Route modules`
   Показывает, как framework перестраивает дерево проекта вокруг экранов и layouts.
4. `Data flow`
   Разбирает ownership данных, auth, server mutations и route pipeline.
5. `Rendering`
   Показывает, как SSR, streaming и PPR привязываются к framework surface.
6. `Playbook`
   Помогает выбрать между Next.js, React Router framework mode и сохранением SPA-подхода.

## Как тема выражена в коде проекта

Урок не только рассказывает о framework-based React, но и выражает тему через структуру текущего проекта:

- `src/components/framework-labs/FrameworkComparisonLab.tsx`
  Интерактивный chooser full-stack framework стратегии.
- `src/components/framework-labs/RouteStructureLab.tsx`
  Генератор route structure для Next.js и React Router framework mode.
- `src/components/framework-labs/DataFlowLab.tsx`
  Сравнение framework-owned full-stack flow.
- `src/components/framework-labs/RenderingDirectionLab.tsx`
  Планировщик SSR/streaming/PPR-direction.
- `src/components/framework-labs/FrameworkPlaybookLab.tsx`
  Итоговый playbook выбора framework strategy.
- `src/lib/framework-comparison-model.ts`
  Профили frameworks и scoring по требованиям продукта.
- `src/lib/route-structure-model.ts`
  Route-first структура проекта и метрики ownership.
- `src/lib/framework-flow-model.ts`
  Сравнение full-stack flow между framework-подходами.
- `src/lib/rendering-family-model.ts`
  Rendering strategy в привязке к framework surface.
- `src/lib/framework-playbook-model.ts`
  Выбор стратегии между Next.js, React Router и SPA.
- `src/server/framework-runtime.ts`
  Учебный full-stack runtime report маршрута.

## Важная оговорка про тему

Полноценные Next.js и React Router framework mode требуют собственного runtime/deployment pipeline.
Внутри этого урока используется честная учебная модель:

- framework capabilities анализируются как архитектурная система;
- route structures, data flow и rendering plans выражены через интерактивные sandboxes;
- `src/server/framework-runtime.ts` показывает учебный server-side pipeline маршрута;
- при этом урок не притворяется полноценным запуском Next.js или React Router framework mode внутри Vite.

Это ограничение показано осознанно, чтобы фокус оставался на архитектурной модели frameworks, а не на маскировке одного инструмента под другой.

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
