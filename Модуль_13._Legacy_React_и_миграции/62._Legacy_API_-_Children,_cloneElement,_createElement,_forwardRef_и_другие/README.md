# Legacy API: Children, cloneElement, createElement, forwardRef и другие

Интерактивный учебный проект для темы `Модуль 13 / Урок 62. Legacy API: Children, cloneElement, createElement, forwardRef и другие`.

## Что покрывает тема

- `Children` API как работу с opaque children structure;
- `cloneElement` и его хрупкость при неявной модификации дочерних элементов;
- `createElement` как базовый низкоуровневый слой под JSX;
- `Component` и class-based слой в старых композиционных API;
- `createRef`, `forwardRef` и миграцию к `ref`-as-prop в React 19;
- `isValidElement` и безопасную проверку clone targets;
- старые способы работы с context: `contextType`, `Consumer`, исторический legacy context mindset;
- связь между legacy API и современными альтернативами.

## Что внутри

Проект построен как одно учебное SPA-приложение:

- сверху общий shell урока и меню лабораторий;
- в центре активная лаборатория;
- снизу блок `Как читать этот проект` и `Стек проекта`;
- на каждой странице есть ссылки на файлы проекта и листинги текущей реализации.

Внутри приложения 6 лабораторий:

1. `Overview`
   Даёт карту legacy API и показывает, какие из них всё ещё полезны, а какие требуют осторожности.
2. `Children API`
   Разбирает opaque children, `Children.map`, `Children.toArray`, `Children.only` и `isValidElement`.
3. `cloneElement`
   Показывает неявное расширение дочерних элементов, композицию или перезапись обработчиков и типичные риски.
4. `createElement`
   Строит UI из descriptor-модели через `createElement` и показывает, где это оправдано, а где уже только шум.
5. `Refs migration`
   Сравнивает `createRef`, `forwardRef` и React 19 `ref`-as-prop.
6. `Legacy context`
   Показывает class `contextType`, `Consumer`, исторический legacy context API и migration playbook.

## Как тема выражена в коде проекта

Урок не только рассказывает о legacy API, но и использует их в собственном коде:

- `src/components/legacy-api-labs/ChildrenApiLab.tsx`
  Реальное использование `Children.count`, `Children.map`, `Children.toArray`, `Children.only` и `isValidElement`.
- `src/components/legacy-api-labs/CloneElementLab.tsx`
  `cloneElement` для неявного внедрения props и композиции обработчиков.
- `src/components/legacy-api-labs/CreateElementLab.tsx`
  Динамическая фабрика интерфейса через `createElement`.
- `src/components/legacy-api-labs/RefMigrationLab.tsx`
  `createRef`, `forwardRef` и React 19 `ref`-as-prop в одном workbench.
- `src/components/legacy-api-labs/LegacyContextLab.tsx`
  Class `contextType`, `Context.Consumer` и современный `useContext` в одном сравнении.
- `src/lib/historical-context-reference.ts`
  Исторический `childContextTypes` / `contextTypes` пример как часть текущего проекта и migration commentary.

## Важная оговорка про тему

Legacy API не стоит делить на “плохие” и “хорошие” формально:

- `Children` и `cloneElement` всё ещё могут быть полезны в специальных адаптерных слоях;
- `createElement` честно показывает, как работает JSX под капотом;
- `forwardRef` остаётся частью старого кода и migration paths, хотя React 19 уже позволяет переходить к `ref`-as-prop;
- но все эти API требуют более осторожного архитектурного мышления, чем явные props, context и hooks-first композиция.

## Стек

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- TypeScript `5.7.3`
- Vite `7.1.4`
- Tailwind CSS `4.2.1`
- Vitest `2.1.9`
- Testing Library
- ESLint `9`
- Prettier `3`
- Docker + Nginx

## Команды

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```
