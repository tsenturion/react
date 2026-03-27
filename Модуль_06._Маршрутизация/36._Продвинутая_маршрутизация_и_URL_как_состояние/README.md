# Продвинутая маршрутизация и URL как состояние

Интерактивный учебный проект для темы `Модуль 6 / 36. Продвинутая маршрутизация и URL как состояние`.

## Что покрывает тема

- nested routes;
- layout routes;
- search params;
- URL as state;
- вложенные маршруты и общие layouts;
- связь между адресной строкой и состоянием экрана;
- синхронизацию фильтров, сортировки, вкладок и выбранных сущностей через URL;
- проектирование устойчивой и понятной навигации.

## Что внутри

Проект построен как одно учебное SPA-приложение с реальным nested route tree:

- сверху общий lesson layout route с header, навигацией и shell state;
- внутри него активный экран-лаборатория;
- часть лабораторий сами являются parent routes со своими child routes;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри приложения 6 лабораторий:

1. `Nested routes`
   Показывает parent route, leaf route и route tree с `:moduleId`.
2. `Layout routes`
   Показывает общий layout branch и дочерние экраны `overview / checklist / activity`.
3. `Search params`
   Показывает filters, sort и view mode через `useSearchParams`.
4. `URL as state`
   Показывает tabs, statuses и sort как устойчивое состояние одного и того же экрана.
5. `Selected entity`
   Показывает сочетание `path param + query string` для выбранной сущности и режима просмотра.
6. `Navigation design`
   Помогает понять, когда нужен nested route, path param, search params или local state.

На каждой лаборатории есть:

- живые route transitions и URL-driven состояния;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о границах применения URL и навигации.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому весь урок сам построен на реальном `React Router`: `BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`, `Navigate`, `useParams`, `useSearchParams` и parent layout routes с состоянием, которое сохраняется между переходами внутри ветки.

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
