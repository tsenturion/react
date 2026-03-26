# Режимы рендеринга: CSR, SSR, SSG, streaming и hydration

Интерактивный учебный проект для темы `Модуль 10 / Урок 52. Режимы рендеринга: CSR, SSR, SSG, streaming и hydration`.

## Что покрывает тема

- разницу между `CSR`, `SSR`, `SSG` и `streaming SSR`;
- влияние режима рендеринга на `HTML delivery`, `SEO`, `interactivity` и структуру проекта;
- `hydration` как контракт между серверным HTML и клиентским React tree;
- `selective hydration` и то, как пользовательское намерение меняет порядок оживления поддеревьев;
- `mismatch debugging`: время, случайные значения, locale formatting и browser-only ветки;
- архитектурный выбор режима рендеринга по природе экрана, а не по популярности API.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту темы: режимы рендеринга, hydration, streaming, mismatch debugging и архитектурные последствия.
2. `CSR / SSR / SSG`
   Сравнивает режимы по времени первого HTML, готовности контента и interactivity.
3. `Hydration`
   Показывает причины mismatch и порядок их отладки.
4. `Streaming`
   Сравнивает обычный порядок hydration и selective hydration под пользовательское намерение.
5. `Architecture`
   Показывает, как один и тот же продукт выглядит для разных режимов по кэшу, SEO и операционной цене.
6. `Playbook`
   Помогает выбрать режим рендеринга по типу экрана и инфраструктурным ограничениям.

## Как тема выражена в коде проекта

Урок не только рассказывает о режимах рендеринга, но и использует их модели в самом коде:

- `src/components/render-modes/ModeComparisonLab.tsx`
  Сравнивает режимы в живой latency-модели.
- `src/components/render-modes/HydrationMismatchLab.tsx`
  Показывает mismatch через переключатели нестабильного initial render.
- `src/components/render-modes/StreamingHydrationLab.tsx`
  Демонстрирует streaming timeline и selective hydration order.
- `src/components/render-modes/ArchitectureConsequencesLab.tsx`
  Сравнивает архитектурные последствия CSR, SSR, SSG и streaming по типу продукта.
- `src/components/render-modes/RenderingPlaybookLab.tsx`
  Даёт интерактивный advisor по выбору режима рендеринга.
- `src/lib/render-mode-model.ts`
  Содержит чистую модель сравнения CSR, SSR, SSG и streaming.
- `src/lib/hydration-model.ts`
  Формализует mismatch между server HTML и client first render.
- `src/lib/streaming-model.ts`
  Описывает streaming timeline и selective hydration order.
- `src/lib/architecture-consequences-model.ts`
  Хранит сценарии продукта и их архитектурные trade-offs.
- `src/lib/rendering-playbook-model.ts`
  Помогает выбирать режим рендеринга по требованиям экрана.
- `src/server/render-mode-runtime.tsx`
  Содержит реальные функции на `react-dom/server`: `renderToString`, `renderToStaticMarkup` и `renderToReadableStream`.

## Важная оговорка про тему

Нет одного «правильного» режима рендеринга для всего приложения.
Нужно отдельно оценивать:

- нужен ли полезный HTML до загрузки клиента;
- насколько важны SEO и кэшируемость;
- как часто меняются данные;
- есть ли персонализация above the fold;
- сколько стоит hydration и серверный рендер;
- оправдан ли streaming для конкретного типа экрана.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
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
