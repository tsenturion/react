# Формы в React

Интерактивный учебный проект для темы `Модуль 2 / 16. Формы в React`.

## Что покрывает тема

- управление формами в React;
- controlled и uncontrolled components;
- `input`, `textarea`, `select`, `checkbox`, `radio`;
- submit flow;
- валидация;
- UX форм;
- обработка ошибок пользователя;
- синхронизация `ввод → state → UI`;
- различие между нативной формой и React-управлением;
- как организовать понятный и устойчивый поток данных в форме;
- типичные ошибки с обработчиками, значениями, submit и reset формы.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Controlled поля`
   Показывает controlled `input`, `textarea`, `select`, `checkbox` и `radio`.
2. `Controlled vs uncontrolled`
   Сравнивает live React-state и чтение DOM через `FormData`.
3. `Submit flow`
   Показывает `preventDefault`, стадии отправки, payload и reset.
4. `Validation UX`
   Разбирает ошибки формы, touched-поля и понятную обратную связь.
5. `Native vs React`
   Сравнивает возможности платформы и React-управления.
6. `Типичные ошибки`
   Воспроизводит частые баги с `checked`, submit и reset controlled-формы.

На каждой лаборатории есть:

- живые переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о последствиях выбранного паттерна работы с формой.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому в проекте есть реальные controlled/uncontrolled формы, live `submit` и `validation`, `FormData`, `reportValidity()`, custom errors и отдельные pure models для логики формы.

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
