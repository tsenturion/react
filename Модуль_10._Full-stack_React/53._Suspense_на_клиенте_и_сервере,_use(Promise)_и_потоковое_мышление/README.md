# Suspense на клиенте и сервере, use(Promise) и потоковое мышление

Интерактивный учебный проект для темы `Модуль 10 / Урок 53. Suspense на клиенте и сервере, use(Promise) и потоковое мышление`.

## Что покрывает тема

- `Suspense` как mental model in depth;
- границы ожидания на клиенте и их влияние на reveal UI;
- `React.lazy` вместе с `Suspense`;
- `use(Promise)` и resource reading;
- различие между client-side waiting и server-side Suspense;
- `streaming` intuition и постепенная сборка интерфейса по частям;
- выбор между простым spinner, split boundaries, lazy, `use(Promise)` и server streaming.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: boundaries, lazy, `use(Promise)`, server Suspense и потоковое мышление.
2. `Client Suspense`
   Показывает разницу между одной общей и несколькими локальными границами ожидания.
3. `lazy + Suspense`
   Показывает code splitting и влияние глобальной/локальной границы на уже открытый UI.
4. `use(Promise)`
   Показывает shared resource reading и отличие общего promise cache от раздельных ресурсов.
5. `Server Suspense`
   Сравнивает client wait, SSR fallback и streaming SSR.
6. `Playbook`
   Помогает выбрать подходящий Suspense-подход по типу экрана и ограничений инфраструктуры.

## Как тема выражена в коде проекта

Урок не только рассказывает о Suspense, но и использует её реальные механики в коде проекта:

- `src/components/suspense-labs/ClientSuspenseLab.tsx`
  Реальный client-side Suspense с разным размером boundaries.
- `src/components/suspense-labs/LazyBoundaryLab.tsx`
  Реальный `React.lazy` с отложенным import и Suspense fallback.
- `src/components/suspense-labs/UsePromiseLab.tsx`
  Реальный `use(Promise)` и shared resource cache.
- `src/components/suspense-labs/ServerSuspenseLab.tsx`
  Интерактивная модель различий между client wait, SSR fallback и streaming reveal.
- `src/components/suspense-labs/SuspensePlaybookLab.tsx`
  Advisor по выбору suspense-подхода.
- `src/lib/suspense-resource-store.ts`
  Resource cache для чтения через `use(Promise)`.
- `src/lib/server-suspense-model.ts`
  Модель таймингов server-side Suspense и streaming.
- `src/server/suspense-runtime.tsx`
  Реальная server-side Suspense реализация через `renderToString` и `renderToReadableStream`.

## Важная оговорка про тему

Suspense не заменяет собой все loading state и не «загружает данные» автоматически.
Нужно отдельно понимать:

- где проходит граница ожидания;
- что должно остаться видимым во время ожидания;
- как стабилизируется resource cache;
- нужен ли reveal HTML до загрузки клиента;
- оправдан ли server streaming для конкретного экрана.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- `React.lazy`
- `use(Promise)`
- React DOM Server APIs
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
