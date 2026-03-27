# Мутации данных и оптимистический UX

Интерактивный учебный проект для темы `Модуль 5 / 33. Мутации данных и оптимистический UX`.

## Что покрывает тема

- изменение данных на клиенте и сервере;
- мутации и жизненный цикл mutation request;
- optimistic updates;
- rollback при ошибке;
- различие между подтверждёнными данными сервера и ожидаемым локальным результатом;
- согласованность UI при add, rename, toggle и delete;
- архитектурные trade-offs между optimistic, hybrid и conservative UX.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Mutation flow`
   Показывает путь от пользовательского действия до optimistic UI, server confirm и финального состояния.
2. `Optimistic vs wait`
   Сравнивает optimistic и conservative UX на одном и том же действии.
3. `Rollback`
   Показывает, как optimistic изменение откатывается при server error.
4. `Pending vs confirmed`
   Разбирает ситуации, где сервер подтверждает не ровно то значение, которое вы уже показали локально.
5. `List consistency`
   Показывает optimistic add и delete, временные id и rollback при неуспешной мутации.
6. `Architecture`
   Помогает выбрать между optimistic, hybrid и conservative UX по характеру операции.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, где optimistic UX помогает, а где начинает вводить в заблуждение.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть fake server для мутаций, optimistic snapshots, rollback logic, server-side canonicalization, временные client id и архитектурный advisor по выбору mutation UX.

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
