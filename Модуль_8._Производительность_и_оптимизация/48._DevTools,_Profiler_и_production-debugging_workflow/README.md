# DevTools, Profiler и production-debugging workflow

Интерактивный учебный проект для темы `Модуль 8 / 48. DevTools, Profiler и production-debugging workflow`.

## Что покрывает тема

- React DevTools и чтение дерева компонентов;
- React Profiler, commits, `actualDuration` и `baseDuration`;
- browser Performance tools, `performance.mark/measure` и track-oriented анализ;
- React Performance Tracks и связь между input, render, network, commit и paint;
- поиск bottleneck в реальном interaction flow, а не в изолированном “toy example”;
- production-debugging workflow: symptom → evidence → suspected layer → candidate fix.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Tooling overview`
   Связывает symptom, component tree, Profiler и browser trace в один рабочий процесс.
2. `Component tree`
   Показывает, как DevTools помогает искать лишние sibling renders и ownership state.
3. `React Profiler`
   Даёт commit feed с `actualDuration`, `baseDuration` и сравнением profiling scope.
4. `Performance tools`
   Разбивает interaction на input, render, network, commit и paint.
5. `Production debug`
   Собирает symptom presets, profiler evidence и browser evidence в один сценарий расследования.
6. `Playbook`
   Помогает выбирать правильный инструмент под конкретный тип bottleneck.

## Как тема выражена в коде проекта

Урок не ограничивается рассказом про инструменты, а использует их идеи в самом коде:

- `src/components/profiling/ComponentTreeLab.tsx`
  Показывает дерево веток, render counters и разницу между wide parent state и isolated branch state.
- `src/components/profiling/ReactProfilerLab.tsx`
  Использует реальный `Profiler` callback и собирает commit feed в UI.
- `src/components/profiling/PerformanceTracksLab.tsx`
  Записывает interaction trace через `performance.now`, `mark/measure` и `requestAnimationFrame`.
- `src/components/profiling/ProductionDebugLab.tsx`
  Собирает symptom presets, Profiler и browser trace в один production-style workflow.
- `src/components/profiling/TrackTimeline.tsx`
  Визуализирует track lanes и относительную стоимость каждой фазы.
- `src/lib/performance-cases-model.ts`
  Содержит reusable heavy workload для всех лабораторий.
- `src/lib/profiler-model.ts`
  Формализует интерпретацию commit timing.
- `src/lib/workflow-playbook-model.ts`
  Определяет, с какого инструмента начинать расследование под заданный symptom.

## Важная оговорка про тему

Profiler и DevTools не решают проблему сами по себе. Они дают evidence, которое
помогает понять, где именно живёт bottleneck: в React tree, в browser pipeline,
в сети или в общей архитектуре экрана.

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
