# Основы производительности React-приложений

Интерактивный учебный проект для темы `Модуль 8 / 44. Основы производительности React-приложений`.

## Что покрывает тема

- лишние рендеры и реальные причины перерисовок;
- `state colocation` как первый и самый дешёвый уровень оптимизации;
- влияние структуры данных и ширины component tree на нагрузку;
- bottlenecks и их распознавание без угадывания;
- граница между полезной оптимизацией и premature optimization;
- связь между `state`, `props`, шириной дерева и итоговым замедлением.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- в коде самого проекта есть реальные render-counters, synthetic slow paths,
  модели bottlenecks и отдельные unit tests.

Внутри приложения 6 лабораторий:

1. `Performance overview`
   Даёт карту темы и показывает, какие сигналы действительно полезны.
2. `Render causes`
   Показывает, почему компонент ререндерится и где ререндер лишний.
3. `State colocation`
   Сравнивает lifted state и colocated state на одном и том же UI.
4. `Data structure`
   Показывает, как форма данных влияет на объём вычислений.
5. `Bottlenecks`
   Показывает, как одно дорогое поддерево превращает невинный toggle в лаг.
6. `Premature optimization`
   Помогает понять, когда оптимизация нужна, а когда сначала нужно измерить проблему.

## Как тема выражена в коде проекта

Урок не просто рассказывает про производительность, а сам реализует её ключевые идеи:

- `src/components/performance/RenderCausesLab.tsx`
  Показывает разницу между meaningful prop change и новым объектом `props`.
- `src/components/performance/StateColocationLab.tsx`
  Сравнивает blast radius lifted state и colocated state на двух параллельных mini-app.
- `src/components/performance/DataStructureLab.tsx`
  Сравнивает nested projection и indexed projection на одном каталоге.
- `src/components/performance/BottleneckLab.tsx`
  Создаёт synthetic slow subtree и показывает, как его задевают широкие рендеры.
- `src/lib/render-performance-model.ts`
  Формализует причины ререндеров вместо абстрактных текстов.
- `src/lib/data-structure-model.ts`
  Содержит pure-модели каталога, индекса и оценки объёма вычислений.
- `src/lib/performance-advisor-model.ts`
  Помогает отличать реальную проблему от преждевременной оптимизации.
- `src/hooks/useRenderCount.ts`
  Даёт live telemetry для лабораторий без вмешательства в business state.

## Важная оговорка про dev-режим

Проект запускается через `StrictMode`, поэтому в development initial mount может выглядеть
шумнее, чем production. В лабораториях важно смотреть не на абсолютную первую цифру,
а на то, какой именно компонент повторно рендерится после вашего действия и почему.

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
