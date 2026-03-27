# Работа с HTTP, fetch и асинхронными запросами в React

Интерактивный учебный проект для темы `Модуль 5 / 32. Работа с HTTP, fetch и асинхронными запросами в React`.

## Что покрывает тема

- основы HTTP на стороне frontend;
- `fetch` и `async/await` в React-компонентах;
- loading, error, empty и success states;
- жизненный цикл запроса и связь сетевого состояния с UI;
- `AbortController`, retries и повторные запросы;
- race conditions и защита от устаревших ответов;
- архитектуру data fetching без useEffect-хаоса и рассыпанных флагов.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `HTTP basics`
   Показывает форму клиентского GET-запроса, метаданные ответа и связь между query, status и payload.
2. `UI states`
   Разбирает `loading / error / empty / success` на реальном fetch-хуке.
3. `Request lifecycle`
   Показывает переходы `idle → loading → success/error/aborted` и лог событий запроса.
4. `Retries & abort`
   Разбирает отмену длинного запроса, повторные попытки и сценарии, где retry оправдан.
5. `Race conditions`
   Сравнивает небезопасный запрос без защиты и безопасный запрос с abort и stale-guard.
6. `Architecture`
   Помогает выбрать между inline fetch, dedicated request hook и следующей ступенью server-state архитектуры.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, как сетевое состояние влияет на интерфейс и ожидания пользователя.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальный `fetch` к локальному JSON, `AbortController`, ручные и автоматические запросы, хук с защитой от гонок, модели retry и placement decisions для сетевой логики.

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
