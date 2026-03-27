# Concurrent React и неблокирующий UI

Интерактивный учебный проект для темы `Модуль 8 / 47. Concurrent React и неблокирующий UI`.

## Что покрывает тема

- `useTransition`, `startTransition` и `useDeferredValue`;
- различие между срочными и несрочными обновлениями;
- отзывчивый input рядом с тяжёлой фильтрацией и большими списками;
- неблокирующий search UI и heavy projection scenarios;
- выбор concurrent API под конкретный тип лагов;
- граница между concurrent-приёмами и обычной архитектурной оптимизацией.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Concurrent overview`
   Даёт карту темы и связывает concurrent APIs с реальными сигналами lag.
2. `useTransition`
   Показывает, как отделить срочный input от тяжёлой фоновой перерисовки списка.
3. `startTransition`
   Показывает императивный перевод тяжёлого screen switch в non-urgent update.
4. `useDeferredValue`
   Показывает, как heavy consumer может немного отставать от input.
5. `Search and lists`
   Собирает concurrent search из срочного input, deferred query и transition filters.
6. `Playbook`
   Помогает выбирать between concurrent APIs и measure-first подходом.

## Как тема выражена в коде проекта

Урок не просто рассказывает о Concurrent React, а использует его ключевые идеи в самом коде:

- `src/components/concurrent/TransitionPriorityLab.tsx`
  Сравнивает direct update и `useTransition` на одном search/list сценарии.
- `src/components/concurrent/StartTransitionLab.tsx`
  Использует imported `startTransition` для тяжёлого workspace switch.
- `src/components/concurrent/DeferredValueLab.tsx`
  Показывает difference между current query и `deferredQuery`.
- `src/components/concurrent/ConcurrentSearchLab.tsx`
  Собирает реальный integrated scenario для input, filters и heavy results list.
- `src/components/concurrent/SearchProjectionPreview.tsx`
  Даёт reusable view на expensive subtree и его commit telemetry.
- `src/lib/search-workload-model.ts`
  Содержит pure heavy projection для фильтрации и сортировки списка.
- `src/lib/transition-priority-model.ts`
  Формализует urgent/background channels одного действия пользователя.
- `src/lib/concurrency-playbook-model.ts`
  Помогает выбирать between `useTransition`, `startTransition`, `useDeferredValue` и measure-first подходом.

## Важная оговорка про тему

Concurrent APIs не убирают expensive work из приложения автоматически. Они помогают
сделать так, чтобы тяжёлая работа не ломала основной interaction loop там, где это
действительно возможно и логично по UX.

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
