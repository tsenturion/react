# Аутентификация и защищённые маршруты

Интерактивный учебный проект для темы `Модуль 6 / 38. Аутентификация и защищённые маршруты`.

## Что покрывает тема

- auth flow;
- protected routes;
- роли и доступ;
- session и token flows;
- logout и refresh logic;
- защита экранов;
- UX авторизации;
- redirect после входа и сохранение намерения пользователя;
- влияние архитектуры доступа на роутинг, данные и состояние приложения.

## Что внутри

Проект построен как одно учебное SPA-приложение с реальным auth-aware route tree:

- сверху общий lesson shell route с header, навигацией, auth snapshot и router audit;
- внутри него активный экран-лаборатория;
- часть лабораторий сами являются защищёнными ветками с собственными loaders и error boundaries;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри приложения 6 лабораторий:

1. `Auth flow basics`
   Показывает базовую карту темы: route guards, roles, session refresh и preserved intent.
2. `Protected branch`
   Показывает parent protected route, child screens, session guard и redirect на login до leaf render.
3. `Roles and access`
   Показывает role-based 403 boundaries поверх уже валидной auth session.
4. `Session lifecycle`
   Показывает login, expire, refresh, forced refresh failure и logout через route action.
5. `Auth UX`
   Показывает login route, сохранение intended destination и redirect обратно в нужный сценарий.
6. `Access architecture`
   Помогает понять, где должны жить auth state, route guards, role gates и local widget restrictions.

На каждой лаборатории есть:

- живые route transitions и access-сценарии;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения guard loaders, role checks и session logic.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому весь урок сам построен на реальном `React Router`: `createBrowserRouter`, `RouterProvider`, route objects с `loader` и `action`, `redirect`, nested protected branches, route-specific error boundaries и общем auth store, который видят и shell, и маршрутизаторные loaders.

## Ключевые файлы

- `src/router.tsx`
  Реальный lesson shell, protected branch, role routes, login route и route-level error boundaries.
- `src/lib/auth-store.ts`
  In-memory auth store с session snapshot, intent path, refresh mode и audit trail.
- `src/lib/auth-runtime.ts`
  Guard loaders, login/session actions, redirect sanitization и архитектурные pure-модели.
- `src/pages/ProtectedWorkspacePage.tsx`
  Parent protected branch с child screens через `Outlet`.
- `src/pages/AuthUxPage.tsx`
  Login route с preserved intent и redirect после входа.
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
