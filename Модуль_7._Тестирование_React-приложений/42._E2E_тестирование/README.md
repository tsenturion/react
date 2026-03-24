# E2E тестирование

Интерактивный учебный проект для темы `Модуль 7 / 42. E2E тестирование`.

## Что покрывает тема

- `End-to-End` тестирование как проверка приложения целиком;
- `Playwright` как реальный browser runner и `Cypress` как сравниваемая альтернатива;
- пользовательские сценарии через маршруты, авторизацию, формы и загрузку данных;
- отличие `E2E` от `component` и `integration` слоёв;
- hidden routes, redirect flow и сохранение намерения пользователя;
- loading, error, retry и восстановление системного пути;
- границы E2E: где он усиливает уверенность, а где превращается в дорогое дублирование.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- внутри есть и видимые лаборатории, и скрытые системные маршруты;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- в коде есть реальные `Playwright`-specs и supporting `Vitest` suites.

Внутри приложения 6 лабораторий:

1. `E2E overview`
   Показывает, что именно системный сценарий подтверждает лучше lower-level проверок.
2. `Route journeys`
   Показывает path + URL state + redirect как часть наблюдаемого пользовательского пути.
3. `Auth journeys`
   Показывает protected route, login redirect и сохранение intended destination.
4. `Form journeys`
   Показывает валидацию, submit и переход на отдельный review screen.
5. `Data journeys`
   Показывает loading, error, retry и восстановление сценария без fixed waits.
6. `Boundaries`
   Показывает, где E2E оправдан, а где это уже overkill.

## Как тема выражена в коде проекта

Урок сам использует реальные E2E-механики:

- `src/router.tsx`
  Определяет lesson routes, hidden system screens и auth redirect flow.
- `src/state/JourneyStateContext.tsx`
  Держит session и результат последней отправки, которые переживают переходы между экранами.
- `src/components/e2e/AuthFlowPanel.tsx`
  Реализует login flow с возвратом на intended route.
- `src/components/e2e/ReleaseFormLab.tsx`
  Реализует форму, которая ведёт на отдельный review route.
- `src/components/e2e/ReleaseQueueLab.tsx`
  Реализует async data flow с ошибкой, retry и успешным восстановлением.
- `tests/e2e/e2e-journeys.spec.ts`
  Содержит реальные `Playwright`-сценарии поверх приложения как единой системы.

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
- Playwright `1.58.2`
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
npm run test:e2e:list
```

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
