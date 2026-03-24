# Асинхронное тестирование, моки и тестирование окружения

Интерактивный учебный проект для темы `Модуль 7 / 41. Асинхронное тестирование, моки и тестирование окружения`.

## Что покрывает тема

- async UI и ожидание наблюдаемого результата;
- loading, error, empty и success состояния;
- mocked HTTP и выбор границы для мока;
- `fetch`, retries, повторные запросы и rerender;
- тестирование компонентов с context, router и provider harness;
- `Vitest` setup, cleanup, fake timers и restore strategy;
- стратегии изоляции и интеграции;
- anti-patterns: fixed sleep, leaking environment и over-mocking.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- в коде самого проекта есть реальные async-компоненты, fetch helper, provider-aware render helper и test setup.

Внутри приложения 6 лабораторий:

1. `Async overview`
   Показывает карту async UI, mocks и test environment через route-driven filter.
2. `Loading and waiting`
   Показывает loading/error/empty/success и различие между ожиданием DOM-result и fixed sleep.
3. `Mocked HTTP`
   Показывает fetch, retry flow и выбор границы для мока запроса.
4. `Providers and context`
   Показывает test harness для компонентов, которым нужен router и context одновременно.
5. `Test environment`
   Показывает fake timers, polling, cleanup и reset strategy.
6. `Anti-fragility`
   Показывает, как sleep, leaking environment и over-mocking делают async tests хрупкими.

## Как тема выражена в коде проекта

Урок сам использует асинхронные сценарии и testing infrastructure:

- `src/components/async-testing/AsyncResourceLab.tsx`
  Показывает loading/error/empty/success и защиту от stale result.
- `src/components/async-testing/MockedHttpLab.tsx`
  Показывает mocked HTTP, retry и повторные запросы через реальный fetch helper.
- `src/components/async-testing/ProviderHarnessLab.tsx`
  Показывает компонент, которому одновременно нужны router и context.
- `src/components/async-testing/PollingEnvironmentLab.tsx`
  Показывает polling и работу fake timers.
- `src/test/test-utils.tsx`
  Focused helper для router + provider без лишней магии.
- `vitest.setup.ts`
  Сбрасывает DOM, mocks и fake timers после каждого теста.

Ключевые файлы:

- `src/router.tsx`
  Общий shell урока и навигация лабораторий.
- `src/lib/async-testing-runtime.ts`
  Pure-модели стратегий ожидания, mocking, provider harness и environment setup.
- `src/lib/async-testing-http.ts`
  fetch helper как явная внешняя граница для мока.
- `src/state/AsyncTestHarnessContext.tsx`
  Provider, который используется и в приложении, и в custom render helper.
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
