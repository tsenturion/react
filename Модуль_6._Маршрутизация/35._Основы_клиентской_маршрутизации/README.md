# Основы клиентской маршрутизации

Интерактивный учебный проект для темы `Модуль 6 / 35. Основы клиентской маршрутизации`.

## Что покрывает тема

- что такое client-side routing;
- React Router и базовая настройка;
- route tree;
- объявление маршрутов;
- страницы и навигация;
- параметры маршрутов;
- переходы без полной перезагрузки;
- влияние роутинга на ментальную модель SPA;
- связь между экранами, URL и пользовательскими сценариями.

## Что внутри

Проект построен как одно учебное SPA-приложение с реальным роутингом:

- сверху общий layout route с header, навигацией и shell state;
- под ним активный экран-лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри приложения 6 лабораторий:

1. `Client-side routing`
   Показывает разницу между client transition и document reload.
2. `Route tree`
   Показывает layout route, дочерние маршруты и совпадение pathname с route tree.
3. `Navigation`
   Разбирает `Link`, `NavLink`, `useNavigate` и navigation history.
4. `Route params`
   Показывает динамический сегмент `:lessonId` и повторное использование одного экрана.
5. `SPA mental model`
   Объясняет, как URL, экраны и сценарии образуют архитектуру SPA.
6. `Routing architecture`
   Помогает понять, когда экрану нужен маршрут, а когда достаточно локального состояния.

На каждой лаборатории есть:

- живые переходы и ссылки;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения маршрутов и URL.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому весь урок сам построен на реальном `React Router`: `BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`, `useNavigate`, `useParams`, `Navigate` и общем layout route с состоянием, которое сохраняется между client-side переходами.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- ESLint `9.38.0`
- Prettier `3.6.2`
- Vite `7.1.4`
- `@vitejs/plugin-react` `5.0.2`
- Tailwind CSS `4.2.1`
- `@tailwindcss/vite` `4.2.1`
- Vitest `2.1.9`
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
