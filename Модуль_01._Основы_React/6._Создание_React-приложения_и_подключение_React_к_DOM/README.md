# CreateRoot, React Root and DOM Mounting Lab

Интерактивный учебный проект для темы `Модуль 1 / 6. Создание React-приложения и подключение React к DOM`.

## Что покрывает тема

- `createRoot`, `React Root` и клиентское монтирование React в DOM;
- `root.render(...)`, `root.unmount()` и lifecycle root;
- `StrictMode` и его роль в development;
- dev-only checks и отличие development от production;
- путь входа приложения в HTML-страницу через `index.html` и `src/main.tsx`;
- структуру первого React-приложения;
- типовые ошибки подключения к DOM и ошибки в стартовой цепочке.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню переключения лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы есть 6 практических лабораторий:

1. `Вход в HTML и createRoot`
   Показывает полную bootstrap-цепочку от `index.html` до `root.render(...)`.
2. `Root lifecycle`
   Даёт отдельный sub-root sandbox, где можно вызвать `createRoot`, `root.render(...)` и `root.unmount()`.
3. `StrictMode`
   Сравнивает pure/impure probe и показывает смысл dev-only проверок.
4. `Структура первого приложения`
   Разбирает роли `index.html`, `src/main.tsx`, `src/App.tsx` и стартовой структуры файлов.
5. `Development vs production`
   Показывает, как отличаются HMR, dev-checks и финальный production runtime.
6. `Типовые ошибки старта`
   Разбирает `null` container, mismatch ID, забытый `createRoot(...)`, повторный root и ложные ожидания от StrictMode.

Во всех лабораториях есть:

- интерактивные переключатели и сценарии;
- ссылки на файлы текущего проекта и листинги из него;
- блоки `до/после` там, где они реально помогают увидеть разницу;
- типичные ошибки;
- короткие объяснения того, как знание проявляется в реальном React-коде.

Важный принцип проекта: тема показывается не только в UI-демо, но и в самом коде приложения. Поэтому здесь есть реальный `src/main.tsx` с `createRoot(...)`, отдельные sub-root sandbox-компоненты, чистые модели сценариев и комментарии в местах, где lifecycle и StrictMode легко понять неправильно.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
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

- `clsx` `2.1.1` для сборки состояний интерфейса;
- `@testing-library/react` `16.3.2`, `@testing-library/jest-dom` `6.9.1`, `@testing-library/user-event` `14.6.1` и `jsdom` `26.1.0` для тестовой среды;
- без внешних UI-библиотек поверх темы: root lifecycle и DOM-entry остаются видимыми напрямую.

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
