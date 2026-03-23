# Data Router, loaders, actions и ошибки маршрутов

Интерактивный учебный проект для темы `Модуль 6 / 37. Data Router, loaders, actions и ошибки маршрутов`.

## Что покрывает тема

- data routing;
- loaders;
- actions;
- route-level data;
- error routes и route error boundaries;
- загрузку и мутации на уровне маршрутизатора;
- различие между component request и route request;
- роль маршрутов как слоя, который управляет не только отображением, но и данными, доступом и переходами.

## Что внутри

Проект построен как одно учебное SPA-приложение с реальным data router tree:

- сверху общий lesson shell route с header, навигацией и shell state;
- внутри него активный экран-лаборатория;
- часть лабораторий сами являются parent routes со своими child routes и error boundaries;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри приложения 6 лабораторий:

1. `Data router basics`
   Показывает route loader, который читает `request.url`, фильтрует данные по query string и отдаёт экрану готовый snapshot ещё до рендера.
2. `Nested loaders`
   Показывает parent loader, child loader, `Outlet`, leaf route и child route error boundary в одной branch.
3. `Actions`
   Показывает `Form`, `action`, validation, pending submit и автоматическую revalidation loader-а после мутации.
4. `Route errors`
   Показывает `Response`, обычный `Error` и route-specific `errorElement` для локализации сбоя.
5. `Route vs component data`
   Сравнивает loader/action lifecycle и запрос, который стартует уже после первого рендера компонента.
6. `Data ownership`
   Помогает понять, когда сценарий должен жить в loader, action, component request или вообще оставаться plain compute.

На каждой лаборатории есть:

- живые route transitions, route submissions и route error modes;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения loader/action/errorElement и component fetch.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому весь урок сам построен на реальном data router API из `React Router`: `createBrowserRouter`, `RouterProvider`, route objects с `loader` и `action`, `Form`, `useLoaderData`, `useActionData`, `useNavigation`, `useRouteError`, nested routes и route-level `errorElement`.

## Ключевые файлы

- `src/router.tsx`
  Реальный data router tree, lesson shell, nested routes, loaders, actions и error boundaries.
- `src/lib/data-router-runtime.ts`
  Fake route runtime, loader/action logic, route-owned mutation queue и архитектурные pure-модели.
- `src/pages/OverviewPage.tsx`
  GET Form + query string + `useLoaderData` без локального fetch.
- `src/pages/ActionsPage.tsx`
  Полный route submit flow через `Form`, `useActionData` и `useNavigation`.
- `src/pages/ErrorRouteBoundary.tsx`
  Route-level fallback UI для `Response` и обычных исключений.
- `src/lib/project-study.ts`
  Ссылки на файлы проекта и листинги для каждой лаборатории.

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
- ESLint `9.38.0`
- Prettier `3.6.2`
- Docker Compose + Node `22-alpine` + Nginx `1.27-alpine`

Дополнительно:

- `clsx` `2.1.1`;
- `@testing-library/react` `16.3.2`, `@testing-library/jest-dom` `6.9.1`, `@testing-library/user-event` `14.6.1` и `jsdom` `26.1.0`.

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

## Preview

```bash
npm run preview
```

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
