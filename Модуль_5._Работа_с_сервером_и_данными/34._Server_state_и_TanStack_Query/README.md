# Server state и TanStack Query

Интерактивный учебный проект для темы `Модуль 5 / 34. Server state и TanStack Query`.

## Что покрывает тема

- server state как отдельный архитектурный слой;
- различие между server state и client state;
- `TanStack Query` / `React Query`;
- caching и shared query cache;
- invalidation и согласованность cache entries;
- stale data strategy;
- retries и жизненный цикл запроса;
- server mutations через `useMutation`;
- причины, по которым ручное хранение серверных данных в `useState` и `useEffect` быстро становится неудобным и хрупким.

## Что внутри

Проект построен как одна учебная страница:

- сверху общий вводный блок по теме;
- под ним меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок с тем, как читать проект, и стеком с версиями.

Внутри страницы 6 лабораторий:

1. `Server vs client state`
   Показывает границу между локальным UI-state и данными, которые принадлежат серверу.
2. `Caching`
   Показывает shared query cache и повторное использование одного query key несколькими виджетами.
3. `Stale and retries`
   Разбирает `staleTime`, retries, refetch и поведение устаревающих данных.
4. `Mutations`
   Показывает `useMutation`, server writes и invalidation связанных query keys.
5. `Consistency`
   Разбирает, как список и summary начинают расходиться при слишком узком invalidation scope.
6. `Architecture`
   Помогает понять, когда TanStack Query действительно оправдан, а когда хватит более простого слоя.

На каждой лаборатории есть:

- интерактивные переключатели и действия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения о том, как cache, stale policy и invalidation меняют поведение интерфейса.

Важный принцип проекта: тема раскрывается не только в тексте, но и в коде самого приложения. Поэтому здесь есть реальный `QueryClient`, query keys, dedicated hooks, fake server с abort-aware query functions, `useMutation` с invalidation и pure-модели для freshness и архитектурных trade-offs.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- TanStack Query `5.95.2`
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
