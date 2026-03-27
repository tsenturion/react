# Стратегия тестирования фронтенда

Интерактивный учебный проект для темы `Модуль 7 / 39. Стратегия тестирования фронтенда`.

## Что покрывает тема

- виды тестов: `unit`, `component`, `integration`, `E2E`;
- распределение проверок по уровням риска;
- пользовательский vs implementation-centric подход;
- поведенческие проверки вместо тестирования внутренних деталей;
- рост тестовой стратегии вместе с ростом приложения;
- границы, цена и назначение каждого слоя.

## Что внутри

Проект построен как одно учебное SPA-приложение с route-driven lesson shell:

- сверху общий header и меню лабораторий;
- в центре активная лаборатория;
- снизу общий блок `Как читать этот проект` и `Стек проекта`;
- внутри самого проекта реально присутствуют все основные слои тестирования.

Внутри приложения 6 лабораторий:

1. `Карта слоёв тестирования`
   Показывает, зачем вообще нужны разные уровни тестов и как они соотносятся с риском.
2. `Unit strategy`
   Показывает, когда сценарий действительно стоит тестировать как pure logic, а когда unit-first подход уже не даёт главной уверенности.
3. `Component behavior`
   Показывает поведенческий компонентный тест через доступный UI, события пользователя и видимый результат.
4. `Integration workflow`
   Показывает связанный сценарий из нескольких controls и общего verdict, где важна согласованность интерфейса.
5. `E2E journeys`
   Показывает, когда имеет смысл поднимать браузерный пользовательский путь, а когда это уже лишняя цена.
6. `Testing architecture`
   Показывает, как стратегия тестирования меняется по мере роста продукта и команды.

На каждой лаборатории есть:

- интерактивные сценарии;
- типичные ошибки и их последствия;
- ссылки на файлы текущего проекта;
- листинги из этих файлов;
- короткие пояснения, почему конкретный тестовый слой полезен именно в этом случае.

## Как тема выражена в коде проекта

Проект не просто рассказывает о стратегии тестирования, а сам использует несколько уровней проверок:

- `src/lib/learning-model.test.ts`
  Unit tests для предметной логики урока.
- `src/components/testing-strategy/BehaviorWorkbench.test.tsx`
  Component test через `Testing Library` и пользовательские действия.
- `src/integration/release-workbench.test.tsx`
  Integration test для связанного UI-сценария.
- `tests/e2e/testing-strategy.spec.ts`
  E2E-спеки на `Playwright` для маршрутов и пользовательских путей.

Ключевые файлы:

- `src/router.tsx`
  Общий lesson shell, навигация лабораторий, loaders и route-driven структура проекта.
- `src/lib/testing-runtime.ts`
  Pure-модели рекомендаций и стратегических решений по слоям тестирования.
- `src/components/testing-strategy/BehaviorWorkbench.tsx`
  Компонент, который намеренно спроектирован как удобная цель для behavior-first component tests.
- `src/components/testing-strategy/ReleaseWorkbench.tsx`
  Связанный workflow для integration-проверок.
- `playwright.config.ts`
  Отдельная конфигурация E2E-слоя.
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
- Playwright `1.58.2`
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

## E2E

```bash
npm run test:e2e:list
```

Для полноценного прогона браузерных тестов:

```bash
npm run test:e2e
```

## Docker

```bash
docker compose up --build
```

После запуска приложение будет доступно на `http://localhost:8080`.
